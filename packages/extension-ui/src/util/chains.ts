// Copyright 2021 @earthwallet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

export const genesisSymbolMap = {
  DOT: '0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3',
  ICP: 'the_icp',
  KSM: '0xb0a8d493285c2df73290dfb7e61f870f17b41801197a149ca93654499ea3dafe'
};

export const symbolGenesisMap = function(): Map<string, string> {
  const symbolGenesisObj = new Map<string, string>();

  for (const [symbol, genesisHash] of Object.entries(genesisSymbolMap)) {
    symbolGenesisObj.set(genesisHash, symbol);
  }

  return symbolGenesisObj;
};

const chains = [
  { chain: 'The Internet Computer', genesisHash: genesisSymbolMap.ICP, icon: 'icp', ss58Format: 1234, symbol: 'ICP' }
];

export default chains;
