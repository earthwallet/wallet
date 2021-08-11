import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IAppState, AppStatusType, AppThemeType } from './types';
import { hydrateWallet } from '~state/wallet';
import { hydrateEntities } from '~state/entities';

const initialState: IAppState = {
  version: '2.0',
  status: 'none',
  theme: 'dark',
  hydrated: false,
};

function readLocalStorage(key: any) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(key, function (result) {
      if (true) {
        resolve(result);
      } else {
        reject();
      }
    });
  });
}
export const preloadStateAsync = createAsyncThunk(
  'state/preloadStateAsync',
  async (_, thunkAPI) => {
    console.log('preloadStateAsync');
    const state: any = await readLocalStorage(null);
    console.log('preloadStateAsync', state);
    thunkAPI.dispatch(hydrateWallet(state.wallet));
    thunkAPI.dispatch(hydrateEntities(state.entities));
    thunkAPI.dispatch(hydrateApp(state.app));

    return true;
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
    hydrateApp(state: IAppState, action: PayloadAction<IAppState>) {
      Object.assign(state, action.payload);
    },
  } /* ,
  extraReducers: (builder) => {
    builder.addCase(preloadStateAsync.fulfilled, (state, { payload }) => {
      console.log('me me', payload);
      Object.assign(state, payload.app);

      //state.hydrated = true;
    });
  }, */,
});

export const { updateState, updateTheme, hydrateApp } = AppState.actions;

export default AppState.reducer;
