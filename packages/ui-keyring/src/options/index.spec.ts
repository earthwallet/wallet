// Copyright 2017-2020 @earthwallet/ui-keyring authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { KeyringStruct } from '../types';

import { KeyringOption } from '.';

const keyringOption = new KeyringOption();

describe('KeyringOption', (): void => {
  it('should not allow initOptions to be called more than once', (): void => {
    const state: Partial<KeyringStruct> = {};

    // first call
    keyringOption.init(state as KeyringStruct);

    // second call
    expect((): void => {
      keyringOption.init(state as KeyringStruct);
    }).toThrowError('Unable to initialise options more than once');
  });
});
