import { EarthKeyringPair } from '@earthwallet/sdk';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NetworkType } from '~global/types';

import { IWalletState } from './types';

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

export default WalletState.reducer;
