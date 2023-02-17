import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
  Store,
} from '@reduxjs/toolkit';
import logger from 'redux-logger';
import throttle from 'lodash/throttle';
//import omit from 'lodash/omit';
import app from './app';
import wallet from './wallet';
import assets from './assets';
import entities from './entities';
import dapp from './dapp';
import tokens from './tokens';

import { browser } from 'webextension-polyfill-ts';

const middleware = [
  ...getDefaultMiddleware({ thunk: true, serializableCheck: false }),
];

if (process.env.NODE_ENV !== 'production') {
  middleware.push(logger);
}
// to configure hydrate and persist data checkout state/app/preloadStateAsync
const store: Store = configureStore({
  reducer: combineReducers({
    app,
    wallet,
    assets,
    entities,
    dapp,
    tokens,
  }),
  middleware,
  devTools: process.env.NODE_ENV !== 'production',
});

const saveState = () => {
  if (!store) {
    return;
  }

  const state = store.getState();
  if (state.app.hydrated === false) {
    console.info(
      'Not saving state to browser.storage.local/chrome.storage.local as state is being re-hydrated'
    );
  } else {
    browser.storage.local.set(JSON.parse(JSON.stringify(state)));
    console.info('Saving state to browser.storage.local/chrome.storage.local');
  }
};

const throttledSave = throttle(saveState, 1000, {
  trailing: true,
  leading: true,
});

store.subscribe(throttledSave);

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
