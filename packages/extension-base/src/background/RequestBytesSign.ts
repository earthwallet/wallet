// Copyright 2021 @earthwallet/extension authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { EarthKeyringPair } from '@earthwallet/ui-keyring/types_extended';
import type { SignerPayloadRaw } from '@polkadot/types/types';
import type { RequestSign } from './types';

import { TypeRegistry } from '@polkadot/types';
import { hexToU8a, u8aToHex } from '@polkadot/util';

export default class RequestBytesSign implements RequestSign {
  public readonly payload: SignerPayloadRaw;

  constructor (payload: SignerPayloadRaw) {
    this.payload = payload;
  }

  sign (_registry: TypeRegistry, pair: EarthKeyringPair): { signature: string } {
    return {
      signature: u8aToHex(
        pair.sign && pair.sign(
          hexToU8a(this.payload.data)
        )
      )
    };
  }
}
