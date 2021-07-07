// Copyright 2017-2020 @earthwallet/ui-keyring authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { decodeAddress } from '@polkadot/keyring';
import { u8aToHex } from '@polkadot/util';

const ACCOUNT_PREFIX = 'account:';
const ADDRESS_PREFIX = 'address:';
const CONTRACT_PREFIX = 'contract:';

function toHex (address: string): string {
  return u8aToHex(
    // When saving pre-checksum changes, ensure that we can decode
    decodeAddress(address, true)
  );
}

const accountKey = (address: string): string =>
  `${ACCOUNT_PREFIX}${address}`;

const addressKey = (address: string): string =>
  `${ADDRESS_PREFIX}${address}`;

const contractKey = (address: string): string =>
  `${CONTRACT_PREFIX}${toHex(address)}`;

const accountRegex = new RegExp(`^${ACCOUNT_PREFIX}0x[0-9a-f]*`, '');

const addressRegex = new RegExp(`^${ADDRESS_PREFIX}0x[0-9a-f]*`, '');

const contractRegex = new RegExp(`^${CONTRACT_PREFIX}0x[0-9a-f]*`, '');

export {
  accountKey,
  accountRegex,
  addressKey,
  addressRegex,
  contractKey,
  contractRegex
};
