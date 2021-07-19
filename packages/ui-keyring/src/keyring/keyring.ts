// Copyright 2017-2020 @earthwallet/ui-keyring authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { KeypairType } from '@polkadot/util-crypto/types';
import type { EarthKeyringPair, KeyringInstance, KeyringOptions, KeyringPair$Json, KeyringPair$Meta } from './types';

import { Ed25519KeyIdentity } from '@dfinity/identity';
import { createWallet } from '@earthwallet/sdk';

import { assert } from '@polkadot/util';

import { DEV_PHRASE } from './defaults';
import { Pairs } from './pairs';

/**
 * # @earthwallet/ui-keyring
 *
 * ## Overview
 *
 * @name Keyring
 * @summary Keyring management of user accounts
 * @description Allows generation of keyring pairs from a variety of input combinations, such as
 * json object containing account address or public key, account metadata, and account encoded using
 * `addFromJson`, or by providing those values as arguments separately to `addFromAddress`,
 * or by providing the mnemonic (seed phrase) and account metadata as arguments to `addFromMnemonic`.
 * Stores the keyring pairs in a keyring pair dictionary. Removal of the keyring pairs from the keyring pair
 * dictionary is achieved using `removePair`. Retrieval of all the stored pairs via `getPairs` or perform
 * lookup of a pair for a given account address or public key using `getPair`. JSON metadata associated with
 * an account may be obtained using `toJson` accompanied by the account passphrase.
 */
export class Keyring implements KeyringInstance {
  readonly #pairs: Pairs;

  readonly #type: KeypairType;

  constructor (options: KeyringOptions = {}) {
    options.type = options.type || 'ed25519';

    assert(['ecdsa', 'ethereum', 'ed25519', 'sr25519'].includes(options.type || 'undefined'), () => `Expected a keyring type of either 'ed25519', 'sr25519', 'ethereum' or 'ecdsa', found '${options.type || 'unknown'}`);

    this.#pairs = new Pairs();
    this.#type = options.type;
  }

  /**
   * @description retrieve the pairs (alias for getPairs)
   */
  public get pairs (): EarthKeyringPair[] {
    return this.getPairs();
  }

  /**
   * @description retrieve the publicKeys (alias for getPublicKeys)
   */
  public get publicKeys (): string[] {
    return this.getPublicKeys();
  }

  /**
   * @description Returns the type of the keyring, ed25519, sr25519 or ecdsa
   */
  public get type (): KeypairType {
    return this.#type;
  }

  /**
   * @name addPair
   * @summary Stores an account, given a keyring pair, as a Key/Value (public key, pair) in Keyring Pair Dictionary
   */
  public addPair (pair: EarthKeyringPair): EarthKeyringPair {
    return this.#pairs.add(pair);
  }

  /**
   * @name addFromJson
   * @summary Stores an account, given JSON data, as a Key/Value (public key, pair) in Keyring Pair Dictionary
   * @description Allows user to provide a json object argument that contains account information (that may be obtained from the json file
   * of an account backup), and then generates a keyring pair from it that it passes to
   * `addPair` to stores in a keyring pair dictionary the public key of the generated pair as a key and the pair as the associated value.
   */
  public addFromJson (json: KeyringPair$Json, ignoreChecksum?: boolean): EarthKeyringPair {
    return this.addPair(this.createFromJson(json, ignoreChecksum));
  }

  /**
   * @name addFromMnemonic
   * @summary Stores an account, given a mnemonic, as a Key/Value (public key, pair) in Keyring Pair Dictionary
   * @description Allows user to provide a mnemonic (seed phrase that is provided when account is originally created)
   * argument and a metadata argument that contains account information (that may be obtained from the json file
   * of an account backup), and then generates a keyring pair from it that it passes to
   * `addPair` to stores in a keyring pair dictionary the public key of the generated pair as a key and the pair as the associated value.
   */
  public async addFromMnemonic (mnemonic: string, meta: KeyringPair$Meta = {}, type: KeypairType = this.type): Promise<EarthKeyringPair> {
    const pair = await this.addFromUri(mnemonic, meta, type);

    return pair;
  }

  /**
   * @name addFromUri
   * @summary Creates an account via an suri
   * @description Extracts the phrase, path and password from a SURI format for specifying secret keys `<secret>/<soft-key>//<hard-key>///<password>` (the `///password` may be omitted, and `/<soft-key>` and `//<hard-key>` maybe repeated and mixed). The secret can be a hex string, mnemonic phrase or a string (to be padded)
   */
  public async addFromUri (suri: string, meta: KeyringPair$Meta = {}, type: KeypairType = this.type): Promise<EarthKeyringPair> {
    const pair = await this.createFromUri(suri, meta, type);

    return this.addPair(pair);
  }

  /**
   * @name createFromJson
   * @description Creates a pair from a JSON keyfile
   */
  public createFromJson ({ address, encoding, meta }: KeyringPair$Json, ignoreChecksum?: boolean): EarthKeyringPair {
    const { content, type, version } = encoding || {};

    const cryptoType = version === '0' || !Array.isArray(content)
      ? this.type
      : content[1];

    assert(['ed25519', 'sr25519', 'ecdsa', 'ethereum'].includes(cryptoType), () => `Unknown crypto type ${cryptoType}`);

    // Here the address and publicKey are 32 bytes and isomorphic. This is why the address field needs to be the public key for ethereum type pairs

    const keyPair = Ed25519KeyIdentity.fromJSON(JSON.stringify(meta.identity));

    return {
      meta,
      identity: keyPair,
      publicKey: keyPair.toJSON()[0],
      address: address,
      type: 'ed25519' || type
    };
  }

  /**
   * @name createFromUri
   * @summary Creates a Keypair from an suri
   * @description This creates a pair from the suri, but does not add it to the keyring
   */
  public async createFromUri (_suri: string, meta?: KeyringPair$Meta, type: KeypairType = this.type): Promise<EarthKeyringPair> {
    // here we only aut-add the dev phrase if we have a hard-derived path
    const suri = _suri.startsWith('//')
      ? `${DEV_PHRASE}${_suri}`
      : _suri;

    const keypair = await createWallet(suri, 'ICP');

    return { ...keypair, ...{ meta: meta } };
  }

  /**
   * @name getPair
   * @summary Retrieves an account keyring pair from the Keyring Pair Dictionary, given an account address
   * @description Returns a keyring pair value from the keyring pair dictionary by performing
   * a key lookup using the provided account address or public key (after decoding it).
   */
  public getPair (address: string): EarthKeyringPair {
    return this.#pairs.get(address);
  }

  /**
   * @name getPairs
   * @summary Retrieves all account keyring pairs from the Keyring Pair Dictionary
   * @description Returns an array list of all the keyring pair values that are stored in the keyring pair dictionary.
   */
  public getPairs (): EarthKeyringPair[] {
    return this.#pairs.all();
  }

  /**
   * @name getPublicKeys
   * @summary Retrieves Public Keys of all Keyring Pairs stored in the Keyring Pair Dictionary
   * @description Returns an array list of all the public keys associated with each of the keyring pair values that are stored in the keyring pair dictionary.
   */
  public getPublicKeys (): string[] {
    return this.#pairs
      .all()
      .map(({ publicKey }): string =>
        publicKey
      );
  }

  /**
   * @name removePair
   * @description Deletes the provided input address or public key from the stored Keyring Pair Dictionary.
   */
  public removePair (address: string): void {
    this.#pairs.remove(address);
  }

  /** `
   * @name toJson
   * @summary Returns a JSON object associated with the input argument that contains metadata assocated with an account
   * @description Returns a JSON object containing the metadata associated with an account
   * when valid address or public key and when the account passphrase is provided if the account secret
   * is not already unlocked and available in memory. Note that in [Polkadot-JS Apps](https://github.com/polkadot-js/apps) the user
   * may backup their account to a JSON file that contains this information.
   */
  public toJson (address: string, passphrase?: string): KeyringPair$Json | undefined {
    return undefined;
  }
}
