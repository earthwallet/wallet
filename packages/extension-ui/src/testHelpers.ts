// Copyright 2021 @earthwallet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable header/header */
require('setimmediate');

export function flushAllPromises (): Promise<void> {
  return new Promise((resolve) => setImmediate(resolve));
}
