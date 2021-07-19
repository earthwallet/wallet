// Copyright 2017-2020 @earthwallet/ui-keyring authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/ban-ts-comment */

import type { KeypairType } from '@polkadot/util-crypto/types';
import type { EarthKeyringPair, KeyringPair$Json, KeyringPair$Meta } from '../types';

import { Ed25519KeyIdentity } from '@dfinity/identity';
// @ts-ignore
import { address_to_hex as addToHex } from '@dfinity/rosetta-client';
import { principal_id_to_address as principalToAddress } from '@earthwallet/sdk/build/main/util/icp';
import * as nacl from 'tweetnacl';

import { u8aToU8a } from '@polkadot/util';

/**
 * @name createPair
 * @summary Creates a keyring pair object
 * @description Creates a keyring pair object with provided account public key, metadata, and encoded arguments.
 * The keyring pair stores the account state including the encoded address and associated metadata.
 *
 * It has properties whose values are functions that may be called to perform account actions:
 *
 * - `address` function retrieves the address associated with the account.
 * - `decodedPkcs8` function is called with the account passphrase and account encoded public key.
 * It decodes the encoded public key using the passphrase provided to obtain the decoded account public key
 * and associated secret key that are then available in memory, and changes the account address stored in the
 * state of the pair to correspond to the address of the decoded public key.
 * - `encodePkcs8` function when provided with the correct passphrase associated with the account pair
 * and when the secret key is in memory (when the account pair is not locked) it returns an encoded
 * public key of the account.
 * - `meta` is the metadata that is stored in the state of the pair, either when it was originally
 * created or set via `setMeta`.
 * - `publicKey` returns the public key stored in memory for the pair.
 * - `sign` may be used to return a signature by signing a provided message with the secret
 * key (if it is in memory) using Nacl.
 * - `toJson` calls another `toJson` function and provides the state of the pair,
 * it generates arguments to be passed to the other `toJson` function including an encoded public key of the account
 * that it generates using the secret key from memory (if it has been made available in memory)
 * and the optionally provided passphrase argument. It passes a third boolean argument to `toJson`
 * indicating whether the public key has been encoded or not (if a passphrase argument was provided then it is encoded).
 * The `toJson` function that it calls returns a JSON object with properties including the `address`
 * and `meta` that are assigned with the values stored in the corresponding state variables of the account pair,
 * an `encoded` property that is assigned with the encoded public key in hex format, and an `encoding`
 * property that indicates whether the public key value of the `encoded` property is encoded or not.
 */
export function createPair (json: KeyringPair$Json, password: string): EarthKeyringPair {
  const keyPair = Ed25519KeyIdentity.fromJSON(JSON.stringify(json));

  let meta = { identity: json, genesisHash: 'the_icp' };

  return {
    get address (): string {
      return addToHex(
        principalToAddress(keyPair.getPrincipal())
      );
    },

    get meta (): KeyringPair$Meta {
      return meta;
    },
    get publicKey (): string {
      return keyPair.toJSON()[0];
    },
    get type (): KeypairType {
      return 'ethereum';
    },
    setMeta: (additional: KeyringPair$Meta): void => {
      meta = { ...meta, ...additional };
    },
    sign: (message: string) =>
      nacl.sign.detached(
        u8aToU8a(message),
        u8aToU8a('0x' + keyPair.toJSON()[1])
      ),
    toJson: (passphrase?: string): KeyringPair$Json => json,
    verify: (message: string | Uint8Array, signature: Uint8Array, _signerPublic: string | Uint8Array): boolean => false
  };
}
