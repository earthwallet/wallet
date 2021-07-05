// Copyright 2017-2020 @earthwallet/ui-keyring authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { EncryptedJson } from '@polkadot/util-crypto/json/types';
import type { KeypairType } from '@polkadot/util-crypto/types';
import type { AddressSubject, SingleAddress } from './observable/types';
import type { KeyringInstance as BaseKeyringInstance, KeyringOptions as KeyringOptionsBase, KeyringPair, KeyringPair$Json, KeyringPair$Meta } from './types_extended';

export interface ContractMeta {
  abi: string;
  genesisHash?: string | null;
}

export interface KeyringJson$Meta {
  contract?: ContractMeta;
  genesisHash?: string | null;
  hardwareType?: 'ledger';
  isHardware?: boolean;
  isInjected?: boolean;
  isRecent?: boolean;
  isTesting?: boolean;
  name?: string;
  whenCreated?: number;
  whenEdited?: number;
  whenUsed?: number;
  [index: string]: unknown;
}

export interface KeyringJson {
  address: string;
  meta: KeyringJson$Meta;
}

export interface KeyringPairs$Json extends EncryptedJson {
  accounts: KeyringJson[];
}

export interface KeyringStore {
  all: (cb: (key: string, value: KeyringJson) => void) => void;
  get: (key: string, cb: (value: KeyringJson) => void) => void;
  remove: (key: string, cb?: () => void) => void;
  set: (key: string, value: KeyringJson, cb?: () => void) => void;
}

export interface KeyringOptions extends KeyringOptionsBase {
  filter?: (json: KeyringJson) => boolean;
  genesisHash?: string | { toHex: () => string };
  isDevelopment?: boolean;
  store?: KeyringStore;
}

export interface KeyringAddress {
  readonly address: string;
  readonly meta: KeyringJson$Meta;
  readonly publicKey: Uint8Array;
}

export type KeyringAddressType = 'address' | 'contract';

export type KeyringItemType = 'account' | KeyringAddressType;

export interface CreateResult {
  json: KeyringPair$Json;
  pair: KeyringPair;
}

export interface KeyringStruct {
  readonly accounts: AddressSubject;
  readonly addresses: AddressSubject;
  readonly contracts: AddressSubject;
  readonly keyring: BaseKeyringInstance | undefined;
  readonly genesisHash?: string;
  symbol?: string;
  addExternal: (publicKey: Uint8Array, meta?: KeyringPair$Meta) => CreateResult;
  addPair: (pair: KeyringPair, password: string) => CreateResult;
  addUri: (suri: string, password?: string, meta?: KeyringPair$Meta, type?: KeypairType, symbol?: string) => Promise<CreateResult>;
  backupAccount: (pair: KeyringPair, password: string) => KeyringPair$Json;
  backupAccounts: (addresses: string[], password: string) => Promise<KeyringPairs$Json>
  createFromUri (suri: string, meta?: KeyringPair$Meta, type?: KeypairType, symbol?: string): Promise<KeyringPair>;
  decodeAddress: (key: string | Uint8Array) => Uint8Array;
  encodeAddress: (key: string | Uint8Array) => string;
  encryptAccount: (pair: KeyringPair, password: string) => void;
  forgetAccount: (address: string) => void;
  forgetAddress: (address: string) => void;
  forgetContract: (address: string) => void;
  getAccount: (address: string | Uint8Array) => KeyringAddress | undefined;
  getAccounts: () => KeyringAddress[];
  getAddress: (address: string | Uint8Array, type: KeyringItemType | null) => KeyringAddress | undefined;
  getAddresses: () => KeyringAddress[];
  getContract: (address: string | Uint8Array) => KeyringAddress | undefined;
  getContracts: (genesisHash?: string) => KeyringAddress[];
  getPair: (address: string | Uint8Array) => KeyringPair;
  getPairs: () => KeyringPair[];
  isAvailable: (address: string | Uint8Array) => boolean;
  isPassValid: (password: string) => boolean;
  loadAll: (options: KeyringOptions) => void;
  restoreAccount: (json: KeyringPair$Json, password: string) => KeyringPair;
  restoreAccounts: (json: EncryptedJson, password: string) => void;
  saveAccount: (pair: KeyringPair, password?: string) => KeyringPair$Json;
  saveAccountMeta: (pair: KeyringPair, meta: KeyringPair$Meta) => void;
  saveAddress: (address: string, meta: KeyringPair$Meta) => KeyringPair$Json;
  saveContract: (address: string, meta: KeyringPair$Meta) => KeyringPair$Json;
  saveRecent: (address: string) => SingleAddress;
  setDevMode: (isDevelopment: boolean) => void;
}
