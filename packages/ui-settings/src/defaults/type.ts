// Copyright 2017-2021 @earthwallet/ui-settings authors & contributors
// SPDX-License-Identifier: Apache-2.0

// matches https://polkadot.js.org & https://*.polkadot.io
export const isPolkadot = typeof window !== 'undefined' && window.location.host.includes('polkadot');
