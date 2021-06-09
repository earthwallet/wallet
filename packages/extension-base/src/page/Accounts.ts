// Copyright 2021 @earthwallet/extension authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { InjectedAccount, InjectedAccounts, Unsubcall } from '@earthwallet/extension-inject/types';
import type { SendRequest } from './types';

// External to class, this.# is not private enough (yet)
let sendRequest: SendRequest;

export default class Accounts implements InjectedAccounts {
  constructor (_sendRequest: SendRequest) {
    sendRequest = _sendRequest;
  }

  public get (anyType?: boolean): Promise<InjectedAccount[]> {
    return sendRequest('ewpub(accounts.list)', { anyType });
  }

  public subscribe (cb: (accounts: InjectedAccount[]) => unknown): Unsubcall {
    sendRequest('ewpub(accounts.subscribe)', null, cb)
      .catch((error: Error) => console.error(error));

    return (): void => {
      // FIXME we need the ability to unsubscribe
    };
  }
}
