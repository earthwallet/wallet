// Copyright 2021 @earthwallet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { MetadataDef } from '@earthwallet/sdk/build/main/inject/types';

const metadataGets = new Map<string, Promise<MetadataDef | null>>();

export function getSavedMeta (genesisHash: string): Promise<MetadataDef | null> | undefined {
  return metadataGets.get(genesisHash);
}

export function setSavedMeta (genesisHash: string, def: Promise<MetadataDef | null>): Map<string, Promise<MetadataDef | null>> {
  return metadataGets.set(genesisHash, def);
}
