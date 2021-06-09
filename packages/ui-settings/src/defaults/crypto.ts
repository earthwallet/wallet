// Copyright 2017-2021 @earthwallet/ui-settings authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '../types';

export const CRYPTOS: Option[] = [
  {
    info: 'sr25519',
    text: 'Schnorrkel (sr25519, recommended)',
    value: 'sr25519'
  },
  {
    info: 'ed25519',
    text: 'Edwards (ed25519, alternative)',
    value: 'ed25519'
  },
  {
    info: 'ecdsa',
    text: 'ECDSA (Non BTC/ETH compatible)',
    value: 'ecdsa'
  }
];

export const CRYPTOS_ETH: Option[] = [
  {
    info: 'ethereum',
    text: 'ECDSA (ETH compatible)',
    value: 'ethereum'
  }
];

export const CRYPTOS_LEDGER: Option[] = [
  ...CRYPTOS,
  {
    info: 'ed25519-ledger',
    text: 'Ledger (ed25519, BIP32 derivation)',
    value: 'ed25519-ledger'
  }
];
