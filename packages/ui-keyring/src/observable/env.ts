// Copyright 2017-2020 @earthwallet/ui-keyring authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BehaviorSubject } from '@polkadot/x-rxjs';

const subject = new BehaviorSubject(false);

export const env = {
  isDevelopment: (): boolean =>
    subject.getValue(),
  set: (isDevelopment: boolean): void => {
    subject.next(isDevelopment);
  },
  subject
};
