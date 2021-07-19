// Copyright 2017-2020 @earthwallet/ui-keyring authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { EarthKeyringPair, KeyringInstance } from '@earthwallet/ui-keyring/types_extended';
import type { AddressSubject } from './observable/types';
import type { KeyringOptions, KeyringStore } from './types';

import { isBoolean, isString } from '@polkadot/util';

import { createTestKeyring } from './keyring/testing';
import { accounts } from './observable/accounts';
import { addresses } from './observable/addresses';
import { contracts } from './observable/contracts';
import { env } from './observable/env';
import { BrowserStore } from './stores/Browser'; // direct import (skip index with all)

export class Base {
  #accounts: AddressSubject;

  #addresses: AddressSubject;

  #contracts: AddressSubject;

  #keyring?: KeyringInstance;

  protected _store: KeyringStore;

  protected _genesisHash?: string;

  constructor () {
    this.#accounts = accounts;
    this.#addresses = addresses;
    this.#contracts = contracts;
    this._store = new BrowserStore();
  }

  public get accounts (): AddressSubject {
    return this.#accounts;
  }

  public get addresses (): AddressSubject {
    return this.#addresses;
  }

  public get contracts (): AddressSubject {
    return this.#contracts;
  }

  public get keyring (): KeyringInstance {
    if (this.#keyring) {
      return this.#keyring;
    }

    throw new Error('Keyring should be initialised via \'loadAll\' before use');
  }

  public get genesisHash (): string | undefined {
    return this._genesisHash;
  }

  public getPair (address: string): EarthKeyringPair {
    return this.keyring.getPair(address);
  }

  public getPairs (): EarthKeyringPair[] {
    return this.keyring.getPairs().filter((pair: EarthKeyringPair): boolean =>
      env.isDevelopment() || pair?.meta?.isTesting !== true
    );
  }

  public isAvailable (_address: string): boolean {
    const accountsValue = this.accounts.subject.getValue();
    const addressesValue = this.addresses.subject.getValue();
    const contractsValue = this.contracts.subject.getValue();
    const address = _address;

    return !accountsValue[address] && !addressesValue[address] && !contractsValue[address];
  }

  public isPassValid (password: string): boolean {
    return password.length > 0;
  }

  public setDevMode (isDevelopment: boolean): void {
    env.set(isDevelopment);
  }

  protected initKeyring (options: KeyringOptions): void {
    const keyring = createTestKeyring(options, true);

    if (isBoolean(options.isDevelopment)) {
      this.setDevMode(options.isDevelopment);
    }

    this.#keyring = keyring as KeyringInstance;
    this._genesisHash = options.genesisHash && (
      isString(options.genesisHash)
        ? options.genesisHash.toString()
        : options.genesisHash.toHex()
    );
    this._store = options.store || this._store;
    this.addAccountPairs();
  }

  protected addAccountPairs (): void {
    this.keyring
      .getPairs()
      .forEach(({ address, meta = {} }: EarthKeyringPair): void => {
        this.accounts.add(this._store, address, { address, meta });
      });
  }

  protected addTimestamp (pair: EarthKeyringPair): void {
    if (!(pair.meta && pair.meta.whenCreated)) {
      pair.setMeta && pair.setMeta({ whenCreated: Date.now() });
    }
  }
}
