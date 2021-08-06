import { EarthKeyringPair } from '@earthwallet/sdk';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NetworkType } from '~global/types';

import type { IWalletState } from './types';
//import type { StoreInterface } from '~state/IStore';
import { AppState } from '~state/store';

const initialState: IWalletState = {
  accounts: [],
  activeAccount: null,
  newMnemonic: '',
  loading: false,
  error: '',
  activeNetwork: NetworkType.Ethereum,
};

const WalletState = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    updateAccounts(
      state: IWalletState,
      action: PayloadAction<EarthKeyringPair[]>
    ) {
      state.accounts = action.payload;
    },
    updateNewMnemonic(state: IWalletState, action: PayloadAction<string>) {
      state.newMnemonic = action.payload;
    },
    updateError(state: IWalletState, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    updateLoading(state: IWalletState, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    updateActiveAccount(
      state: IWalletState,
      action: PayloadAction<EarthKeyringPair>
    ) {
      state.activeAccount = action.payload;
    },
  },
});

export const {
  updateAccounts,
  updateActiveAccount,
  updateNewMnemonic,
  updateError,
  updateLoading,
} = WalletState.actions;

export const selectAccounts = (state: AppState) =>
  Object.keys(state.entities.accounts.byId).map(
    (id) => state.entities.accounts.byId[id]
  );

export const selectAccountById = (address: string) => (state: AppState) =>
  state.entities.accounts.byId[address];

export const selectActiveAccount = (state: AppState) => state.activeAccount;

export default WalletState.reducer;
