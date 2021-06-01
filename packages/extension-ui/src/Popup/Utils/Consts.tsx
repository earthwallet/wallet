// Copyright 2021 @earthwallet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

export const defaultNetworkContext = {
  selectedNetwork: { genesisHash: '', symbol: '', text: 'All Network', value: -1 },
  setSelectedNetwork: () => { },
  tokens: [
    { genesisHash: '', symbol: '', text: 'All Network', value: -1 },
    { genesisHash: 'the_icp', symbol: 'ICP', text: 'The Internet Computer', value: 0 },
    { genesisHash: '0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3', symbol: 'DOT', text: 'Polkadot', value: 1 },
    { genesisHash: '0xb0a8d493285c2df73290dfb7e61f870f17b41801197a149ca93654499ea3dafe', symbol: 'KSM', text: 'Kusama', value: 2 }]
};
