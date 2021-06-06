// Copyright 2017-2020 @earthwallet/ui-keyring authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SingleAddress } from '../observable/types';
import type { KeyringStruct } from '../types';
import type { KeyringOptionInstance, KeyringOptions, KeyringSectionOption, KeyringSectionOptions } from './types';

import { assert } from '@polkadot/util';
import { BehaviorSubject } from '@polkadot/x-rxjs';

import { obervableAll } from '../observable';

let hasCalledInitOptions = false;

const sortByName = (a: SingleAddress, b: SingleAddress): number => {
  const valueA = a.option.name;
  const valueB = b.option.name;

  return valueA.localeCompare(valueB);
};

const sortByCreated = (a: SingleAddress, b: SingleAddress): number => {
  const valueA = a.json.meta.whenCreated || 0;
  const valueB = b.json.meta.whenCreated || 0;

  if (valueA < valueB) {
    return 1;
  }

  if (valueA > valueB) {
    return -1;
  }

  return 0;
};

export class KeyringOption implements KeyringOptionInstance {
  public readonly optionsSubject: BehaviorSubject<KeyringOptions> = new BehaviorSubject(this.emptyOptions());

  public createOptionHeader (name: string): KeyringSectionOption {
    return {
      key: `header-${name.toLowerCase()}`,
      name,
      value: null
    };
  }

  public init (keyring: KeyringStruct): void {
    assert(!hasCalledInitOptions, 'Unable to initialise options more than once');

    obervableAll.subscribe((): void => {
      const opts = this.emptyOptions();

      this.addAccounts(keyring, opts);
      this.addAddresses(keyring, opts);
      this.addContracts(keyring, opts);

      opts.address = this.linkItems({ Addresses: opts.address, Recent: opts.recent });
      opts.account = this.linkItems({ Accounts: opts.account, Development: opts.testing });
      opts.contract = this.linkItems({ Contracts: opts.contract });
      opts.all = ([] as KeyringSectionOptions).concat(opts.account, opts.address);
      opts.allPlus = ([] as KeyringSectionOptions).concat(opts.account, opts.address, opts.contract);

      this.optionsSubject.next(opts);
    });

    hasCalledInitOptions = true;
  }

  private linkItems (items: { [index: string]: KeyringSectionOptions }): KeyringSectionOptions {
    return Object.keys(items).reduce((result, header): KeyringSectionOptions => {
      const options = items[header];

      return result.concat(
        options.length
          ? [this.createOptionHeader(header)]
          : [],
        options
      );
    }, [] as KeyringSectionOptions);
  }

  private addAccounts (keyring: KeyringStruct, options: KeyringOptions): void {
    const available = keyring.accounts.subject.getValue();

    Object
      .values(available)
      .sort(sortByName)
      .forEach(({ json: { meta: { isTesting = false } }, option }: SingleAddress): void => {
        if (!isTesting) {
          options.account.push(option);
        } else {
          options.testing.push(option);
        }
      });
  }

  private addAddresses (keyring: KeyringStruct, options: KeyringOptions): void {
    const available = keyring.addresses.subject.getValue();

    Object
      .values(available)
      .filter(({ json }: SingleAddress): boolean => !!json.meta.isRecent)
      .sort(sortByCreated)
      .forEach(({ option }: SingleAddress): void => {
        options.recent.push(option);
      });

    Object
      .values(available)
      .filter(({ json }: SingleAddress): boolean => !json.meta.isRecent)
      .sort(sortByName)
      .forEach(({ option }: SingleAddress): void => {
        options.address.push(option);
      });
  }

  private addContracts (keyring: KeyringStruct, options: KeyringOptions): void {
    const available = keyring.contracts.subject.getValue();

    Object
      .values(available)
      .sort(sortByName)
      .forEach(({ option }: SingleAddress): void => {
        options.contract.push(option);
      });
  }

  private emptyOptions (): KeyringOptions {
    return {
      account: [],
      address: [],
      all: [],
      allPlus: [],
      contract: [],
      recent: [],
      testing: []
    };
  }
}
