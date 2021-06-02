// Copyright 2021 @earthwallet/extension-inject authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Injected, InjectedWindow, InjectOptions } from './types';

// It is recommended to always use the function below to shield the extension and dapp from
// any future changes. The exposed interface will manage access between the 2 environments,
// be it via window (current), postMessage (under consideration) or any other mechanism
export function injectExtension (enable: (origin: string) => Promise<Injected>, { name, version }: InjectOptions): void {
  // small helper with the typescript types, just cast window
  const windowInject = window as Window & InjectedWindow;

  // don't clobber the existing object, we will add it (or create as needed)
  windowInject.initWeb3 = windowInject.initWeb3 || {};

  // add our enable function
  windowInject.initWeb3[name] = {
    enable: (origin: string): Promise<Injected> =>
      enable(origin),
    version
  };
}
