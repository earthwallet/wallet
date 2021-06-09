// Copyright 2017-2020 @earthwallet/ui-keyring authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { KeyringInstance, KeyringPair } from '@polkadot/keyring/types';
import type { Prefix } from '@polkadot/util-crypto/address/types';
import type { AddressSubject } from './observable/types';
import type { KeyringOptions, KeyringStore } from './types';

import { createTestKeyring } from '@polkadot/keyring/testing';
import { isBoolean, isString } from '@polkadot/util';

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

  public decodeAddress = (key: string | Uint8Array, ignoreChecksum?: boolean, ss58Format?: Prefix): Uint8Array => {
    return this.keyring.decodeAddress(key, ignoreChecksum, ss58Format);
  }

  public encodeAddress = (key: string | Uint8Array, ss58Format?: Prefix): string => {
    return this.keyring.encodeAddress(key, ss58Format);
  }

  public getPair (address: string | Uint8Array): KeyringPair {
    return this.keyring.getPair(address);
  }

  public getPairs (): KeyringPair[] {
    return this.keyring.getPairs().filter((pair: KeyringPair): boolean =>
      env.isDevelopment() || pair.meta.isTesting !== true
    );
  }

  public isAvailable (_address: Uint8Array | string): boolean {
    const accountsValue = this.accounts.subject.getValue();
    const addressesValue = this.addresses.subject.getValue();
    const contractsValue = this.contracts.subject.getValue();
    const address = isString(_address)
      ? _address
      : this.encodeAddress(_address);

    return !accountsValue[address] && !addressesValue[address] && !contractsValue[address];
  }

  public isPassValid (password: string): boolean {
    return password.length > 0;
  }

  public setSS58Format (ss58Format?: Prefix): void {
    if (this.#keyring && ss58Format) {
      this.#keyring.setSS58Format(ss58Format);
    }
  }

  public setDevMode (isDevelopment: boolean): void {
    env.set(isDevelopment);
  }

  protected initKeyring (options: KeyringOptions): void {
    const keyring = createTestKeyring(options, true);

    if (isBoolean(options.isDevelopment)) {
      this.setDevMode(options.isDevelopment);
    }

    this.#keyring = keyring;
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
      .forEach(({ address, meta }: KeyringPair): void => {
        this.accounts.add(this._store, address, { address, meta });
      });
  }

  protected addTimestamp (pair: KeyringPair): void {
    if (!pair.meta.whenCreated) {
      pair.setMeta({ whenCreated: Date.now() });
    }
  }
}
