// Copyright 2021 @earthwallet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { KeyringPairs$Json } from '@earthwallet/ui-keyring/types';
import type { KeyringPair$Json } from '@earthwallet/ui-keyring/types_extended';

export function isKeyringPairs$Json (json: KeyringPair$Json | KeyringPairs$Json): json is KeyringPairs$Json {
  return json.encoding && json?.encoding.content && (json?.encoding?.content).includes('batch-pkcs8') ? (json?.encoding?.content).includes('batch-pkcs8') : false;
}
