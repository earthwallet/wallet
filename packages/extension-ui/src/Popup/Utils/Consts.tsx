// Copyright 2021 @earthwallet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

export const defaultTokenContext = {
  tokens: [
    { text: 'The Internet Computer', symbol: 'ICP', value: 0 },
    { text: 'Polkadot', symbol: 'DOT', value: 1 },
    { text: 'Kusama', symbol: 'KSM', value: 2 }],
  selectedToken: { text: 'The Internet Computer', symbol: 'ICP', value: 0 },
  setSelectedToken: () => { }
};
