// Copyright 2017-2020 @earthwallet/ui-keyring authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { EncryptedJson } from '@polkadot/util-crypto/json/types';
import type { KeypairType } from '@polkadot/util-crypto/types';
import type { AddressSubject, SingleAddress } from './observable/types';
import type { EarthKeyringPair, KeyringInstance as BaseKeyringInstance, KeyringOptions as KeyringOptionsBase, KeyringPair$Json, KeyringPair$Meta } from './types_extended';

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
  readonly publicKey?: string;
}

export type KeyringAddressType = 'address' | 'contract';

export type KeyringItemType = 'account' | KeyringAddressType;

export interface CreateResult {
  json: KeyringPair$Json;
  pair: EarthKeyringPair;
}

export interface KeyringStruct {
  readonly accounts: AddressSubject;
  readonly addresses: AddressSubject;
  readonly contracts: AddressSubject;
  readonly keyring: BaseKeyringInstance | undefined;
  readonly genesisHash?: string;
  symbol?: string;
  addPair: (pair: EarthKeyringPair, password: string) => CreateResult;
  addUri: (suri: string, password?: string, meta?: KeyringPair$Meta, type?: KeypairType, symbol?: string) => Promise<CreateResult>;
  backupAccounts: (addresses: string[], password: string) => Promise<KeyringPairs$Json>
  createFromUri (suri: string, meta?: KeyringPair$Meta, type?: KeypairType, symbol?: string): Promise<EarthKeyringPair>;
  forgetAccount: (address: string) => void;
  forgetAddress: (address: string) => void;
  forgetContract: (address: string) => void;
  getAccount: (address: string) => KeyringAddress | undefined;
  getAccounts: () => KeyringAddress[];
  getAddress: (address: string, type: KeyringItemType | null) => KeyringAddress | undefined;
  getAddresses: () => KeyringAddress[];
  getContract: (address: string) => KeyringAddress | undefined;
  getContracts: (genesisHash?: string) => KeyringAddress[];
  getPair: (address: string) => EarthKeyringPair;
  getPairs: () => EarthKeyringPair[];
  isAvailable: (address: string) => boolean;
  isPassValid: (password: string) => boolean;
  loadAll: (options: KeyringOptions) => void;
  restoreAccount: (json: KeyringPair$Json, password: string) => EarthKeyringPair;
  restoreAccounts: (json: EncryptedJson, password: string) => void;
  saveAccount: (pair: EarthKeyringPair, password?: string) => KeyringPair$Json;
  saveAccountMeta: (pair: EarthKeyringPair, meta: KeyringPair$Meta) => void;
  saveAddress: (address: string, meta: KeyringPair$Meta) => KeyringPair$Json;
  saveContract: (address: string, meta: KeyringPair$Meta) => KeyringPair$Json;
  saveRecent: (address: string) => SingleAddress;
  setDevMode: (isDevelopment: boolean) => void;
}
