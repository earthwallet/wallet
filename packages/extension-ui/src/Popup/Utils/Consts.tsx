// Copyright 2021 @earthwallet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

export const defaultNetworkContext = {
  networks: [{ genesisHash: 'the_icp', symbol: 'ICP', text: 'The Internet Computer', value: 0 }],
  selectedNetwork: { genesisHash: 'the_icp', symbol: 'ICP', text: 'The Internet Computer', value: 0 },
  setSelectedNetwork: () => {}
};
