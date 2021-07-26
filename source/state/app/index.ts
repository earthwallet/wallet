import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppStateProps, AppStatusType } from './types';

const initialState: AppStateProps = {
  version: '2.0',
  status: 'none',
};

// createSlice comes with immer produce so we don't need to take care of immutational update
const AppState = createSlice({
  name: 'app',
  initialState,
  reducers: {
    updateState(state: AppStateProps, action: PayloadAction<AppStatusType>) {
      state.status = action.payload;
    },
  },
});

export const { updateState } = AppState.actions;

export default AppState.reducer;
