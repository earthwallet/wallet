// Copyright 2017-2021 @earthwallet/ui-settings authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '../types';

export const ENDPOINTS: Option[] = [{
  info: 'local',
  text: 'Local Node (Own, 127.0.0.1:9944)',
  value: 'ws://127.0.0.1:9944/'
}];

export const ENDPOINT_DEFAULT = ENDPOINTS[0];
