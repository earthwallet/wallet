// Copyright 2017-2020 @earthwallet/ui-keyring authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { EarthKeyringPair as KeyringPairWithIdentity } from '@earthwallet/sdk';
import type { Prefix } from '@polkadot/util-crypto/address/types';
import type { EncryptedJson } from '@polkadot/util-crypto/json/types';
import type { KeypairType } from '@polkadot/util-crypto/types';

export interface KeyringOptions {
  ss58Format?: Prefix;
  type?: KeypairType;
}
export declare type KeyringPair$Meta = Record<string, unknown>;

export interface KeyringPair$Json extends Partial<EncryptedJson> {
  address: string;
  meta: KeyringPair$Meta;
}
export interface SignOptions {
  withType?: boolean;
}

export type EarthKeyringPair = KeyringPairWithIdentity;

export interface KeyringPairs {
  add: (pair: EarthKeyringPair) => EarthKeyringPair;
  all: () => EarthKeyringPair[];
  get: (address: string | Uint8Array) => EarthKeyringPair;
  remove: (address: string | Uint8Array) => void;
}
export interface KeyringInstance {
  readonly pairs: EarthKeyringPair[];
  readonly publicKeys: string[];
  readonly type: KeypairType;
  addPair(pair: EarthKeyringPair): EarthKeyringPair;
  addFromJson(pair: KeyringPair$Json, ignoreChecksum?: boolean): EarthKeyringPair;
  addFromMnemonic(mnemonic: string, meta?: KeyringPair$Meta, type?: KeypairType): Promise<EarthKeyringPair>;
  addFromUri(suri: string, meta?: KeyringPair$Meta, type?: KeypairType): Promise<EarthKeyringPair>;
  createFromJson(json: KeyringPair$Json, ignoreChecksum?: boolean): EarthKeyringPair;
  createFromUri(suri: string, meta?: KeyringPair$Meta, type?: KeypairType): Promise<EarthKeyringPair>;
  getPair(address: string): EarthKeyringPair;
  getPairs(): EarthKeyringPair[];
  getPublicKeys(): string[];
  removePair(address: string): void;
  toJson(address: string | Uint8Array, passphrase?: string): KeyringPair$Json;
}
