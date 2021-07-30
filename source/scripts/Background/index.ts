import 'emoji-log';
import { wrapStore } from 'webext-redux';
import { browser } from 'webextension-polyfill-ts';

import { STATE_PORT } from '~global/constant';
import store from '~state/store';
import MasterController from './controllers/MasterController';
import { IMasterController } from './types/IMasterController';

browser.runtime.onInstalled.addListener((): void => {
  console.emoji('🦄', 'extension installed');
});

declare global {
  interface Window {
    controller: Readonly<IMasterController>;
  }
}

if (!window.controller) {
  window.controller = Object.freeze(new MasterController());
}

wrapStore(store, { portName: STATE_PORT });
