import 'emoji-log';
import { wrapStore } from 'webext-redux';
import { browser } from 'webextension-polyfill-ts';

import { STATE_PORT } from '~global/constant';
import store from '~state/store';
import MainController from './controllers/MainController';
import type { IMainController } from './types/IMainController';

browser.runtime.onInstalled.addListener((): void => {
  console.emoji('🦄', 'extension installed');
});

declare global {
  interface Window {
    controller: Readonly<IMainController>;
  }
}

if (!window.controller) {
  window.controller = Object.freeze(new MainController());
}

wrapStore(store, { portName: STATE_PORT });
