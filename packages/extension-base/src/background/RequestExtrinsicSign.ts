// Copyright 2021 @earthwallet/extension authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { EarthKeyringPair } from '@earthwallet/ui-keyring/types_extended';
import type { SignerPayloadJSON } from '@polkadot/types/types';
import type { RequestSign } from './types';

export default class RequestExtrinsicSign implements RequestSign {
  public readonly payload: SignerPayloadJSON;

  constructor (payload: SignerPayloadJSON) {
    this.payload = payload;
  }

  sign (pair: EarthKeyringPair): { signature: string } {
    return { signature: JSON.stringify(pair.sign && pair.sign('STUB')) };
  }
}
