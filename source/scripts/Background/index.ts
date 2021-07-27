import 'emoji-log';
import { wrapStore } from 'webext-redux';
import { browser } from 'webextension-polyfill-ts';

import { STATE_PORT } from '~global/constant';
import store from '~state/store';

browser.runtime.onInstalled.addListener((): void => {
  console.emoji('🦄', 'extension installed');
});

wrapStore(store, { portName: STATE_PORT });
