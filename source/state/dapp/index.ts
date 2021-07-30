import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WalletDapps, WalletDappState } from '~global/types';

const initialState: WalletDapps = {};

const AssetState = createSlice({
  name: 'assets',
  initialState,
  reducers: {
    connectDapp(state: WalletDapps, action: PayloadAction<WalletDappState>) {
      return {
        ...state,
        [action.payload.id]: action.payload,
      };
    },
  },
});

export const { connectDapp } = AssetState.actions;

export default AssetState.reducer;
