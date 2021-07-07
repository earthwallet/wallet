// Copyright 2021 @earthwallet/extension authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Message } from '@earthwallet/extension-base/types';

import { enable, handleResponse, redirectIfPhishing } from '@earthwallet/extension-base/page';
import { injectExtension } from '@earthwallet/sdk/build/main/inject';

// setup a response listener (events created by the loader for extension responses)
window.addEventListener('message', ({ data, source }: Message): void => {
  // only allow messages from our window, by the loader
  if (source !== window || data.origin !== 'earthwallet') {
    return;
  }

  if (data.id) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleResponse(data as any);
  } else {
    console.error('Missing id for response.');
  }
});

redirectIfPhishing().then((gotRedirected) => {
  if (!gotRedirected) {
    inject();
  }
}).catch((e) => {
  console.warn(`Unable to determine if the site is in the phishing list: ${(e as Error).message}`);
  inject();
});

function inject () {
  injectExtension(enable, {
    name: 'earthwallet',
    version: process.env.PKG_VERSION as string
  });
}
