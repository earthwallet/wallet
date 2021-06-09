// Copyright 2017-2020 @earthwallet/ui-keyring authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Keyring } from './Keyring';

export { Ledger } from '@polkadot/hw-ledger';
export { packageInfo } from './packageInfo';

const keyring = new Keyring();

export { Keyring, keyring };

export default keyring;
