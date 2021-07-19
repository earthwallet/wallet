// Copyright 2017-2020 @earthwallet/ui-keyring authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { EarthKeyringPair, EarthKeyringPairs } from './types';

type EarthKeyringPairMap = Record<string, EarthKeyringPair>;

export class Pairs implements EarthKeyringPairs {
  readonly #map: EarthKeyringPairMap = {};

  public add (pair: EarthKeyringPair): EarthKeyringPair {
    this.#map[pair.address] = pair;

    return pair;
  }

  public all (): EarthKeyringPair[] {
    return Object.values(this.#map);
  }

  public get (address: string): EarthKeyringPair {
    const pair = this.#map[address];

    if (pair === undefined) {
      console.log(`keyring/pair: Unable to retrieve keypair '${address}'`);
    }

    return pair;
  }

  public remove (address: string): void {
    delete this.#map[address];
  }
}
