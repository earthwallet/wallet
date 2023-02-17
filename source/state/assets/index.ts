import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AssetPriceInfo, WalletAssets } from '~global/types';
import { getSymbol } from '~utils/common';

import { IAssetState } from './types';
import { AppState } from '~state/store';
import { keyable } from '~scripts/Background/types/IAssetsController';
import { getTokenCollectionInfo } from '~global/nfts';

const initialState: IAssetState = {
  assetList: {},
  activeAssetId: null,
  fetchingPrices: false,
};

const AssetState = createSlice({
  name: 'assets',
  initialState,
  reducers: {
    updateAssets(state: IAssetState, action: PayloadAction<WalletAssets>) {
      state.assetList = action.payload;
    },
    updateFetchingPrices(state: IAssetState, action: PayloadAction<boolean>) {
      state.fetchingPrices = action.payload;
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

export const { updateAssets, updateFiatPrice } = AssetState.actions;

export const selectAssetBySymbol = (symbol: string) => (state: AppState) =>
  state.entities.prices.byId[symbol];

export const selectPriceByContractAddress =
  (contractAddress: string) => (state: AppState) =>
    state.entities.prices.byId[contractAddress];

export const selectAirdropStatus = (id: string) => (state: AppState) =>
  state.entities.airdrops?.byId[id];

export const selectAssetByCoinGeckoId = (symbol: string) =>
  selectAssetBySymbol(getSymbol(symbol)?.coinGeckoId || '');

export const selectStatsOfCollection =
  (collectionId: string) => (state: AppState) =>
    state.entities?.collectionStats.byId[collectionId];

export const selectStatsOfCollections =
  (nftObjs: keyable) => (state: AppState) =>
    nftObjs.map((nftObj: keyable) => ({
      ...nftObj,
      ...state.entities?.collectionStats.byId[nftObj.id],
    }));

export const getPopupTxn = (txnId: string) => (state: AppState) =>
  state.entities?.txnRequests.byId[txnId];

export const selectTxnRequestsByAddress =
  (address: string) => (state: AppState) => {
    return (
      state.entities.txnRequests?.byId &&
      Object.keys(state.entities.txnRequests?.byId)
        ?.map((id) => ({
          ...state.entities.txnRequests.byId[id],
          ...{
            transaction: {
              metadata: {
                timestamp:
                  state.entities.txnRequests.byId[id].createdAt * 1000000,
              },
            },
          },
        }))
        .filter((txnReq) => txnReq.address == address)
    );
  };

export const selectAllCollectionInfo = () => (state: AppState) =>
  Object.keys(state.entities.collectionInfo?.byId)?.map((id) => ({
    ...state.entities.collectionInfo.byId[id],
    ...{ id: id },
  }));

export const selectCollectionInfo =
  (collectionId: string) => (state: AppState) =>
    getTokenCollectionInfo(collectionId)
      ? getTokenCollectionInfo(collectionId)
      : state.entities?.collectionInfo.byId[collectionId] || {};
export default AssetState.reducer;