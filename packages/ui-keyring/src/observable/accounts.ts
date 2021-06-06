// Copyright 2017-2020 @earthwallet/ui-keyring authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { accountKey } from '../defaults';
import { genericSubject } from './genericSubject';

export const accounts = genericSubject(accountKey, true);
