// Copyright 2021 @earthwallet/extension-chains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { MetadataDef } from '@earthwallet/extension-inject/types';
import type { Registry } from '@polkadot/types/types';

export interface Chain {
  definition: MetadataDef;
  genesisHash?: string;
  hasMetadata: boolean;
  icon: string;
  isUnknown?: boolean;
  name: string;
  registry: Registry;
  specVersion: number;
  ss58Format: number;
  tokenDecimals: number;
  tokenSymbol: string;
}
