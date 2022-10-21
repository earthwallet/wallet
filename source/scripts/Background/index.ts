import 'emoji-log';
import { wrapStore } from 'webext-redux';
import { browser, Runtime } from 'webextension-polyfill-ts';

import { STATE_PORT } from '~global/constant';
import store from '~state/store';
import MainController from './controllers/MainController';
import { messagesHandler } from './controllers/MessageHandler';
import type { IMainController } from './types/IMainController';

browser.runtime.onInstalled.addListener((): void => {
  console.emoji('🌎', 'earth extension installed');
});

declare global {
  interface Window {
    controller: Readonly<IMainController>;
  }
}

if (!window.controller) {
  window.controller = Object.freeze(new MainController());
}

browser.runtime.onConnect.addListener((port: Runtime.Port) => {
  console.emoji('🌎', 'earth extension onConnect');

  if (port.name === 'earth') {
    messagesHandler(port, window.controller);
  }
});

wrapStore(store, { portName: STATE_PORT });
