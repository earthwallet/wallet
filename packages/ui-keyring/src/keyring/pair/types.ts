// Copyright 2017-2020 @earthwallet/ui-keyring authors & contributors
// SPDX-License-Identifier: Apache-2.0

export interface PairInfo {
  publicKey: string;
  secretKey?: Uint8Array;
  seed?: Uint8Array | null;
}
