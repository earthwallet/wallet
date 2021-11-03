import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ConnectedDApps, DAppInfo } from '~global/types';

const initialState: ConnectedDApps = {};

// createSlice comes with immer produce so we don't need to take care of immutational update
const DAppState = createSlice({
  name: 'dapp',
  initialState,
  reducers: {
    listNewDapp(
      state: ConnectedDApps,
      action: PayloadAction<{ id: string; dapp: DAppInfo }>
    ) {
      return {
        ...state,
        [action.payload.id]: action.payload.dapp,
      };
    },
    updateDapp(
      state: ConnectedDApps,
      action: PayloadAction<{ id: string; dapp: DAppInfo }>
    ) {
      return {
        ...state,
        [action.payload.id]: {
          ...state[action.payload.id],
          ...action.payload.dapp,
        },
      };
    },
    unlistDapp(state: ConnectedDApps, action: PayloadAction<{ id: string }>) {
      delete state[action.payload.id];
    },
    hydrateDapp(state: ConnectedDApps, action: PayloadAction<ConnectedDApps>) {
      Object.assign(state, action.payload);
    },
  },
});

export const { listNewDapp, updateDapp, unlistDapp, hydrateDapp } =
  DAppState.actions;

export default DAppState.reducer;
