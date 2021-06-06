// Copyright 2017-2021 @earthwallet/ui-settings authors & contributors
// SPDX-License-Identifier: Apache-2.0

import known from '@polkadot/networks';

type ChainDef = string[];

const chains: Record <string, ChainDef> = known
  .filter((n) => n.genesisHash.length)
  .reduce((chains, { genesisHash, network }) => ({ ...chains, [network]: genesisHash }), {});

export { chains };
