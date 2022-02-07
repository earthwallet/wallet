import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ConnectedDApps, DAppInfo } from '~global/types';
import { AppState } from '~state/store';

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

export const selectRequestStatusById =
  (requestId: string) => (state: AppState) =>
    state.entities?.dappRequests?.byId[requestId];

export const selectConnectedDapps = (state: AppState) =>
  state?.dapp && Object.keys(state?.dapp).map((id) => state?.dapp[id]);

export const selectConnectedDappsByAddress =
  (address: string) => (state: AppState) =>
    state?.dapp &&
    Object.keys(state?.dapp)
      .map((id) => state?.dapp[id])
      .filter((dapp) => dapp.address === address);

export const selectDapp = (origin: string) => (state: AppState) =>
  state?.dapp[origin];

export const selectDappRequests = (origin: string) => (state: AppState) =>
  state.entities?.dappRequests &&
  Object.keys(state.entities?.dappRequests.byId)
    .map((id) => state.entities?.dappRequests.byId[id])
    .filter((dappRequest) => dappRequest.origin === origin);

export default DAppState.reducer;
