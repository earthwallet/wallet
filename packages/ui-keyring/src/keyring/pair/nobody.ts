// Copyright 2017-2020 @earthwallet/ui-keyring authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { EarthKeyringPair, KeyringPair$Meta } from '../types';

const publicKey = 'publickey';
const address = 'smthng';
const meta = {
  isTesting: true,
  name: 'nobody'
};

export function nobody (): EarthKeyringPair {
  const pair: EarthKeyringPair = {
    address,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    derive: (suri: string, meta?: KeyringPair$Meta): EarthKeyringPair =>
      pair,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isLocked: true,
    lock: (): void => {
      // no locking, it is always locked
    },
    meta,
    publicKey,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setMeta: (meta: KeyringPair$Meta): void =>
      undefined,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    sign: (message: Uint8Array): Uint8Array =>
      new Uint8Array(64),
    type: 'ed25519',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    unlock: (passphrase?: string): void =>
      undefined,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    verify: (message: Uint8Array, signature: Uint8Array): boolean =>
      false
  };

  return pair;
}
