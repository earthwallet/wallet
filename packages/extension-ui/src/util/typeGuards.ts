// Copyright 2021 @earthwallet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { KeyringPair$Json } from '@polkadot/keyring/types';
import type { KeyringPairs$Json } from '@earthwallet/ui-keyring/types';

export function isKeyringPairs$Json (json: KeyringPair$Json | KeyringPairs$Json): json is KeyringPairs$Json {
  return (json.encoding.content).includes('batch-pkcs8');
}
