import { EarthKeyringPair } from '@earthwallet/sdk';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NetworkType } from '~global/types';

import { IWalletState } from './types';

const initialState: IWalletState = {
  accounts: [],
  activeAccount: null,
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
  },
});

export const { updateAccounts } = WalletState.actions;

export default WalletState.reducer;
