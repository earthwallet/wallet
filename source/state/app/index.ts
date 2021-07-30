import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { IAppState, AppStatusType, AppThemeType } from './types';

const initialState: IAppState = {
  version: '2.0',
  status: 'none',
  theme: 'dark',
};

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
  },
});

export const { updateState, updateTheme } = AppState.actions;

export default AppState.reducer;
