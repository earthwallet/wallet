// Copyright 2021 @earthwallet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

export const defaultNetworkContext = {
  networks: [
    { genesisHash: '', symbol: '', text: 'All Wallets', value: -1 },
    { genesisHash: 'the_icp', symbol: 'ICP', text: 'The Internet Computer', value: 0 },
  ],
  selectedNetwork: { genesisHash: '', symbol: '', text: 'Wallets', value: -1 },
  setSelectedNetwork: () => {}
};
