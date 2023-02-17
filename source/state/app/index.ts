import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IAppState, AppStatusType, AppThemeType } from './types';
import { hydrateWallet } from '~state/wallet';
import { hydrateEntities } from '~state/entities';
import { hydrateDapp } from '~state/dapp';
import { browser } from 'webextension-polyfill-ts';
import { hydrateTokens } from '~state/tokens';

const initialState: IAppState = {
  version: '2.0',
  status: 'none',
  theme: 'dark',
  hydrated: false,
  hydrating: false,
};

export const preloadStateAsync = createAsyncThunk(
  'state/preloadStateAsync',
  async (_, thunkAPI) => {
    thunkAPI.dispatch(updateHydrating(true));
    const state: any = await browser.storage.local.get(null);

    state?.wallet && thunkAPI.dispatch(hydrateWallet(state?.wallet));
    state?.entities && thunkAPI.dispatch(hydrateEntities(state?.entities));
    state?.app && thunkAPI.dispatch(hydrateApp(state?.app));
    state?.dapp && thunkAPI.dispatch(hydrateDapp(state?.dapp));
    state?.tokens && thunkAPI.dispatch(hydrateTokens(state?.tokens));

    thunkAPI.dispatch(updateHydrating(false));

    return thunkAPI.dispatch(updateHydrated(true));
  }
);

// createSlice comes with immer produce so we don't need to take care of immutational update
const AppState = createSlice({
  name: 'app',
  initialState,
  reducers: {
    updateState(state: IAppState, action: PayloadAction<AppStatusType>) {
      state.status = action.payload;
    },
    updateTheme(state: IAppState, action: PayloadAction<AppThemeType>) {
      state.theme = action.payload;
    },
    updateHydrated(state: IAppState, action: PayloadAction<boolean>) {
      state.hydrated = action.payload;
    },
    updateHydrating(state: IAppState, action: PayloadAction<boolean>) {
      state.hydrating = action.payload;
    },
    hydrateApp(state: IAppState, action: PayloadAction<IAppState>) {
      Object.assign(state, action.payload);
    },
  },
});

export const {
  updateState,
  updateTheme,
  hydrateApp,
  updateHydrated,
  updateHydrating,
} = AppState.actions;

export default AppState.reducer;
