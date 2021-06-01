// Copyright 2021 @earthwallet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { MetadataDefBase } from '@earthwallet/extension-inject/types';

import networks from '@polkadot/networks';

const hashes: MetadataDefBase[] = networks
  .filter(({ genesisHash }) => !!genesisHash.length)
  .filter(({ network }) => network === 'polkadot' || network === 'kusama')
  .map((network) => ({
    chain: network.displayName,
    genesisHash: network.genesisHash[0],
    icon: network.icon,
    ss58Format: network.prefix
  }));

hashes.push({ chain: 'Internet Computer Protocol', genesisHash: 'the_icp', icon: 'icp', ss58Format: 1234 });
export default hashes;
