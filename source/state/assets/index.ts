import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AssetPriceInfo, WalletAssets } from '~global/types';

import { IAssetState } from './types';

const initialState: IAssetState = {
  assetList: {},
  activeAssetId: null,
};

const AssetState = createSlice({
  name: 'assets',
  initialState,
  reducers: {
    updateAccounts(state: IAssetState, action: PayloadAction<WalletAssets>) {
      state.assetList = action.payload;
    },
    updateFiatPrice(state: IAssetState, action: PayloadAction<AssetPriceInfo>) {
      if (state.assetList && state.assetList[action.payload.id]) {
        state.assetList[action.payload.id].price = action.payload.price;
        state.assetList[action.payload.id].priceChange =
          action.payload.priceChange;
      }
    },
  },
});

export const { updateAccounts, updateFiatPrice } = AssetState.actions;

export default AssetState.reducer;
