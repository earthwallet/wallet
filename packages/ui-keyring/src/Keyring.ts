// Copyright 2017-2020 @earthwallet/ui-keyring authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/restrict-plus-operands */

import type { EarthKeyringPair, KeyringPair, KeyringPair$Json, KeyringPair$Meta } from '@earthwallet/ui-keyring/types_extended';
import type { EncryptedJson } from '@polkadot/util-crypto/json/types';
import type { KeypairType } from '@polkadot/util-crypto/types';
import type { AddressSubject, SingleAddress } from './observable/types';
import type { CreateResult, KeyringAddress, KeyringAddressType, KeyringItemType, KeyringJson, KeyringJson$Meta, KeyringOptions, KeyringPairs$Json, KeyringStruct } from './types';

import { createWallet } from '@earthwallet/sdk';
import StringCrypto from 'string-crypto';

import { createPair } from '@polkadot/keyring/pair';
import { isString, stringToU8a, u8aToString } from '@polkadot/util';
import { jsonDecrypt, jsonEncrypt } from '@polkadot/util-crypto';

// import { pairs } from '@polkadot/x-rxjs';
import { env } from './observable/env';
import { Base } from './Base';
import { accountKey, accountRegex, addressKey, addressRegex, contractKey, contractRegex } from './defaults';
import { KeyringOption } from './options';

const { encryptString } = new StringCrypto();

const RECENT_EXPIRY = 24 * 60 * 60;

// No accounts (or test accounts) should be loaded until after the chain determination.
// Chain determination occurs outside of Keyring. Loading `keyring.loadAll({ type: 'ed25519' | 'sr25519' })` is triggered
// from the API after the chain is received
export class Keyring extends Base implements KeyringStruct {
  public readonly keyringOption = new KeyringOption();

  #stores = {
    account: (): AddressSubject => this.accounts,
    address: (): AddressSubject => this.addresses,
    contract: (): AddressSubject => this.contracts
  };

  public addPair (pair: EarthKeyringPair, password: string): CreateResult {
    this.keyring.addPair(pair);

    return {
      json: this.saveAccount(pair, password),
      pair
    };
  }

  public async addUri (suri: string, password?: string, meta: KeyringPair$Meta = {}, type?: KeypairType, symbol?: string): Promise<CreateResult> {
    let wallet: any;
    let newPair: any = {};

    if (symbol === 'ICP') {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      wallet = await createWallet(suri, symbol);

      if (password !== '') {
        window.localStorage.setItem(wallet?.address + '_icpjson', encryptString(JSON.stringify(wallet.identity.toJSON()), password));
        window.localStorage.setItem(wallet?.address + '_mnemonic', encryptString(suri, password));
      }
    }

    const pair = this.keyring.addFromUri(suri, meta, type);

    if (symbol === 'ICP') {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
      newPair = { ...pair, ...wallet, type: 'ethereum' };
    } else {
      newPair = { ...pair };
    }

    return {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      json: this.saveAccount(newPair as EarthKeyringPair, password, wallet?.address),
      pair: newPair
    };
  }

  public backupAccount (pair: KeyringPair, password: string): KeyringPair$Json {
    if (!pair.isLocked) {
      pair.lock();
    }

    pair.decodePkcs8(password);

    return pair.toJson(password);
  }

  public async backupAccounts (addresses: string[], password: string): Promise<KeyringPairs$Json> {
    const accountPromises = addresses.map((address) => {
      return new Promise<KeyringJson>((resolve) => {
        this._store.get(accountKey(address), resolve);
      });
    });

    const accounts = await Promise.all(accountPromises);

    return {
      ...jsonEncrypt(stringToU8a(JSON.stringify(accounts)), ['batch-pkcs8'], password),
      accounts: accounts.map((account) => ({
        address: account.address,
        meta: account.meta
      }))
    };
  }

  public createFromJson (json: KeyringPair$Json, meta: KeyringPair$Meta = {}): KeyringPair {
    return this.keyring.createFromJson({ ...json, meta: { ...(json.meta || {}), meta } });
  }

  public async createFromUri (suri: string, meta: KeyringPair$Meta = {}, type?: KeypairType, symbol?: string): Promise<KeyringPair> {
    if (symbol === 'ICP') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const wallet = await createWallet(suri, symbol);
      const pair = this.keyring.addFromUri(suri, meta, type);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
      return { ...pair, address: wallet?.address, type: 'ethereum' };
    }

    return this.keyring.createFromUri(suri, meta, type);
  }

  public encryptAccount (pair: KeyringPair, password: string): void {
    const json = pair.toJson(password);

    json.meta.whenEdited = Date.now();

    this.keyring.addFromJson(json);
    this.accounts.add(this._store, pair.address, json, pair.type);
  }

  public forgetAccount (address: string): void {
    this.keyring.removePair(address);
    this.accounts.remove(this._store, address);
  }

  public forgetAddress (address: string): void {
    this.addresses.remove(this._store, address);
  }

  public forgetContract (address: string): void {
    this.contracts.remove(this._store, address);
  }

  public getAccount (address: string | Uint8Array): KeyringAddress | undefined {
    return this.getAddress(address, 'account');
  }

  public getAccounts (): KeyringAddress[] {
    const available = this.accounts.subject.getValue();

    return Object
      .keys(available)
      .map((address): KeyringAddress => this.getAddress(address, 'account') as KeyringAddress)
      .filter((account) => env.isDevelopment() || account.meta.isTesting !== true);
  }

  public getAddress (_address: string | Uint8Array, type: KeyringItemType | null = null): KeyringAddress | undefined {
    const address = isString(_address)
      ? _address
      : this.encodeAddress(_address);
    const stores = type
      ? [this.#stores[type]]
      : Object.values(this.#stores);

    const info = stores.reduce<SingleAddress | undefined>((lastInfo, store): SingleAddress | undefined =>
      (store().subject.getValue()[address] || lastInfo), undefined);

    return info && {
      address,
      meta: info.json.meta
    };
  }

  public getAddresses (): KeyringAddress[] {
    const available = this.addresses.subject.getValue();

    return Object
      .keys(available)
      .map((address): KeyringAddress => this.getAddress(address) as KeyringAddress);
  }

  public getContract (address: string | Uint8Array): KeyringAddress | undefined {
    return this.getAddress(address, 'contract');
  }

  public getContracts (): KeyringAddress[] {
    const available = this.contracts.subject.getValue();

    return Object
      .entries(available)
      .filter(([, { json: { meta: { contract } } }]): boolean =>
        !!contract && contract.genesisHash === this.genesisHash
      )
      .map(([address]): KeyringAddress => this.getContract(address) as KeyringAddress);
  }

  private rewriteKey (json: KeyringJson, key: string, hexAddr: string, creator: (addr: string) => string): void {
    if (hexAddr.substr(0, 2) === '0x') {
      return;
    }

    this._store.remove(key);
    this._store.set(creator(hexAddr), json);
  }

  private loadAccount (json: KeyringJson, key: string): void {
    if (!json.meta.isTesting && (json as KeyringPair$Json).encoded) {
      // FIXME Just for the transition period (ignoreChecksum)
      const pair = this.keyring.addFromJson(json as KeyringPair$Json, true);

      this.accounts.add(this._store, pair.address, json, pair.type);
    }

    const [, hexAddr] = key.split(':');

    this.rewriteKey(json, key, hexAddr.trim(), accountKey);
  }

  private loadAddress (json: KeyringJson, key: string): void {
    const { isRecent, whenCreated = 0 } = json.meta;

    if (isRecent && (Date.now() - whenCreated) > RECENT_EXPIRY) {
      this._store.remove(key);

      return;
    }

    // We assume anything hex that is not 32bytes (64 + 2 bytes hex) is an Ethereum-like address
    // (this caters for both H160 addresses as well as full or compressed publicKeys) - in the case
    // of both ecdsa and ethereum, we keep it as-is
    const address = json.address;
    const [, hexAddr] = key.split(':');

    this.addresses.add(this._store, address, json);
    this.rewriteKey(json, key, hexAddr, addressKey);
  }

  private loadContract (json: KeyringJson, key: string): void {
    const address = this.encodeAddress(
      this.decodeAddress(json.address)
    );
    const [, hexAddr] = key.split(':');

    // move genesisHash to top-level (TODO Remove from contracts section?)
    json.meta.genesisHash = json.meta.genesisHash || (json.meta.contract && json.meta.contract.genesisHash);

    this.contracts.add(this._store, address, json);
    this.rewriteKey(json, key, hexAddr, contractKey);
  }

  private loadInjected (address: string, meta: KeyringJson$Meta): void {
    const json = {
      address,
      meta: {
        ...meta,
        isInjected: true
      }
    };
    const pair = this.keyring.addFromAddress(address, json.meta);

    this.accounts.add(this._store, pair.address, json, pair.type);
  }

  private allowGenesis (json?: KeyringJson | { meta: KeyringJson$Meta } | null): boolean {
    if (json?.meta.genesisHash === 'the_icp') {
      return true;
    }

    if (json && json.meta && this.genesisHash) {
      const hashes: (string | null | undefined)[] = [this.genesisHash];

      if (json.meta.genesisHash) {
        return hashes.includes(json.meta.genesisHash);
      } else if (json.meta.contract) {
        return hashes.includes(json.meta.contract.genesisHash);
      }
    }

    return true;
  }

  public loadAll (options: KeyringOptions, injected: { address: string; meta: KeyringJson$Meta }[] = []): void {
    super.initKeyring(options);
    this._store.all((key: string, json: KeyringJson): void => {
      if (options.filter ? options.filter(json) : true) {
        try {
          if (this.allowGenesis(json)) {
            if (accountRegex.test(key)) {
              this.loadAccount(json, key);
            } else if (addressRegex.test(key)) {
              this.loadAddress(json, key);
            } else if (contractRegex.test(key)) {
              this.loadContract(json, key);
            } else if (json.meta.genesisHash === 'the_icp') {
              const [, hexAddr] = key.split(':');

              this.accounts.add(this._store, hexAddr, json, 'ethereum');
            }
          }
        } catch (error) {
          console.log(error);
          // ignore
        }
      }
    });

    injected.forEach((account): void => {
      if (this.allowGenesis(account)) {
        try {
          this.loadInjected(account.address, account.meta);
        } catch (error) {
          // ignore
        }
      }
    });

    this.keyringOption.init(this);
  }

  public restoreAccount (json: KeyringPair$Json, password: string): EarthKeyringPair {
    const cryptoType = Array.isArray(json?.encoding?.content) ? json?.encoding?.content[1] : 'ed25519';
    const pair = createPair(
      { toSS58: this.encodeAddress, type: cryptoType as KeypairType },
      { publicKey: this.decodeAddress(json.address, true) },
      json.meta
    );

    // unlock, save account and then lock (locking cleans secretKey, so needs to be last)
    pair.decodePkcs8(password);
    this.addPair(pair as EarthKeyringPair, password);
    pair.lock();

    return pair as EarthKeyringPair;
  }

  public restoreAccounts (json: EncryptedJson, password: string): void {
    console.log('restoreAccounts');

    const accounts: KeyringJson[] = JSON.parse(u8aToString(jsonDecrypt(json, password))) as KeyringJson[];

    accounts.forEach((account) => {
      this.loadAccount(account, accountKey(account.address));
    });
  }

  public saveAccount (pair: EarthKeyringPair, password?: string, icpAddress?: string): KeyringPair$Json {
    this.addTimestamp(pair);
    const json: KeyringPair$Json = { address: pair.address,
      meta: { identity: pair.identity.toJSON(password),
        ...pair.meta } };

    // this.keyring.addFromJson(json);

    this.accounts.add(this._store, icpAddress || pair.address, json, pair.type);

    return json;
  }

  public saveAccountMeta (pair: KeyringPair, meta: KeyringPair$Meta): void {
    const address = pair.address;

    this._store.get(accountKey(address), (json: KeyringJson): void => {
      pair.setMeta(meta);
      json.meta = pair.meta;

      this.accounts.add(this._store, address, json, pair.type);
    });
  }

  public saveAddress (address: string, meta: KeyringPair$Meta, type: KeyringAddressType = 'address'): KeyringPair$Json {
    const available = this.addresses.subject.getValue();

    const json = (available[address] && available[address].json) || {
      address,
      meta: {
        isRecent: undefined,
        whenCreated: Date.now()
      }
    };

    Object.keys(meta).forEach((key): void => {
      json.meta[key] = meta[key];
    });

    delete json.meta.isRecent;

    this.#stores[type]().add(this._store, address, json);

    return json as KeyringPair$Json;
  }

  public saveContract (address: string, meta: KeyringPair$Meta): KeyringPair$Json {
    return this.saveAddress(address, meta, 'contract');
  }

  public saveRecent (address: string): SingleAddress {
    const available = this.addresses.subject.getValue();

    if (!available[address]) {
      this.addresses.add(this._store, address, {
        address,
        meta: {
          genesisHash: this.genesisHash,
          isRecent: true,
          whenCreated: Date.now()
        }
      });
    }

    return this.addresses.subject.getValue()[address];
  }
}
