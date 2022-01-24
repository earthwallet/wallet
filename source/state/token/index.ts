import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { ITokenState } from './types';
//import type { StoreInterface } from '~state/IStore';
import { AppState } from '~state/store';
//import groupBy from 'lodash/groupBy';

const initialState: ITokenState = {
  loading: false,
  error: '',
};

const TokenState = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    updateError(state: ITokenState, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    updateLoading(state: ITokenState, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    hydrateWallet(state: ITokenState, action: PayloadAction<ITokenState>) {
      Object.assign(state, action.payload);
    },
  },
});

export const { updateError, updateLoading, hydrateWallet } = TokenState.actions;

export const selectTokensInfo = (state: AppState) => {
  return (
    state.entities.tokensInfo?.byId &&
    Object.keys(state.entities.tokensInfo?.byId)?.map(
      (id) => state.entities.tokensInfo.byId[id]
    )
  );
};
export const selectActiveTokensByAddress =
  (address: string) => (state: AppState) => {
    return (
      state.entities.tokens?.byId &&
      Object.keys(state.entities.tokens?.byId)
        ?.map((id) => state.entities.tokens.byId[id])
        .filter((token) => token.address === address && token.active)
    );
  };

export default TokenState.reducer;
