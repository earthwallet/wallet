// Copyright 2017-2020 @earthwallet/ui-keyring authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubjectInfo } from './types';

import { combineLatest } from '@polkadot/x-rxjs';
import { map } from '@polkadot/x-rxjs/operators';

import { accounts } from './accounts';
import { addresses } from './addresses';
import { contracts } from './contracts';

interface Result {
  accounts: SubjectInfo;
  addresses: SubjectInfo;
  contracts: SubjectInfo;
}

export const obervableAll = combineLatest(
  accounts.subject,
  addresses.subject,
  contracts.subject
).pipe(
  map(([accounts, addresses, contracts]): Result => ({
    accounts,
    addresses,
    contracts
  }))
);
