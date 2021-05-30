// Copyright 2021 @earthwallet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import networks from '@polkadot/networks';

export default networks.filter((network) => network.hasLedgerSupport);
