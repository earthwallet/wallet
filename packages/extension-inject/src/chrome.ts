// Copyright 2021 @earthwallet/extension-inject authors & contributors
// SPDX-License-Identifier: Apache-2.0

const extension = typeof chrome !== 'undefined'
  ? chrome
  : typeof browser !== 'undefined'
    ? browser
    : null;

export default extension as typeof chrome;
