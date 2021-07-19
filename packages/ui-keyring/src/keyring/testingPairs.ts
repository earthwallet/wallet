// Copyright 2017-2020 @earthwallet/ui-keyring authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { EarthKeyringPair, KeyringOptions } from './types';

import { nobody } from './pair/nobody';
import { createTestKeyring } from './testing';

export interface TestKeyringMap {
  [index: string]: EarthKeyringPair;
}

export function createTestPairs (options?: KeyringOptions, isDerived = true): TestKeyringMap {
  const keyring = createTestKeyring(options, isDerived);
  const pairs = keyring.getPairs();
  const map: TestKeyringMap = { nobody: nobody() };

  return pairs.reduce((result, pair): TestKeyringMap => {
    const { name } = pair?.meta || { name: '' };

    result[name as string] = pair;

    return result;
  }, map);
}
