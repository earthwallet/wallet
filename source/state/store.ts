import {
  combineReducers,
  configureStore,
  getDefaultMiddleware,
  Store,
} from '@reduxjs/toolkit';
import logger from 'redux-logger';
import throttle from 'lodash/throttle';

import app from './app';
import wallet from './wallet';
import assets from './assets';
import entities from './entities';

import { saveState, loadState } from './localStorage';

const middleware = [
  ...getDefaultMiddleware({ thunk: false, serializableCheck: false }),
];

if (process.env.NODE_ENV !== 'production') {
  middleware.push(logger);
}

const store: Store = configureStore({
  reducer: combineReducers({
    app,
    wallet,
    assets,
    entities
  }),
  middleware,
  devTools: process.env.NODE_ENV !== 'production',
  preloadedState: loadState(),
});

store.subscribe(
  throttle(() => {
    const state = store.getState();
    saveState({
      app: state.app,
      wallet: state.wallet,
      assets: state.assets,
    });
  }, 1000)
);

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
