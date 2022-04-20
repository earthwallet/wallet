import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { ITokenState } from './types';
//import type { StoreInterface } from '~state/IStore';
import { AppState } from '~state/store';
import { keyable } from '~scripts/Background/types/IMainController';
//import groupBy from 'lodash/groupBy';
import TOKENS, { getTokenInfo } from '~global/tokens';
import { getInfoBySymbol } from '~global/constant';
import millify from 'millify';

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
  return TOKENS;
  return (
    state.entities.tokensInfo?.byId &&
    Object.keys(state.entities.tokensInfo?.byId)?.map(
      (id) => state.entities.tokensInfo.byId[id]
    )
  );
};
export const selectTokensInfoById = (tokenId: string) => (state: AppState) => {
  return getTokenInfo(tokenId);
  return (
    state.entities.tokensInfo?.byId &&
    Object.keys(state.entities.tokensInfo?.byId)
      ?.map((id) => state.entities.tokensInfo.byId[id])
      .filter((token) => token.id === tokenId)[0]
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

export const selectTokenByTokenPair =
  (tokenPair: string) => (state: AppState) => {
    const tokenId = tokenPair.split('_WITH_', 2)[1];
    const tokenInfo = getTokenInfo(tokenId);
    if (state.entities.tokens?.byId[tokenPair] != null) {
      return { ...state.entities.tokens?.byId[tokenPair], ...tokenInfo };
    } else {
      return {};
    }
  };

export const selectInfoBySymbolOrToken =
  (symbolOrTokenId: string, address: string) => (state: AppState) => {
    const info = getInfoBySymbol(symbolOrTokenId);

    if (info == undefined) {
      const tokenId = symbolOrTokenId;
      const tokenPair = address + '_WITH_' + tokenId;
      const tokenInfo = getTokenInfo(tokenId);
      if (state.entities.tokens?.byId[tokenPair] != null) {
        return { ...state.entities.tokens?.byId[tokenPair], ...tokenInfo };
      } else {
        return {};
      }
    } else {
      const currentBalance = state.entities.balances.byId[address];
      const symbolStats = state.entities.prices.byId[info.coinGeckoId];
      return {
        ...info,
        ...{
          type: 'symbol',
          balanceTxt: (
            (currentBalance?.value || 0) /
            Math.pow(10, currentBalance?.currency?.decimals || 0)
          ).toFixed(4),
          price: currentBalance?.balanceInUSD?.toFixed(3),
          usd_market_cap:
            symbolStats?.usd_market_cap &&
            millify(symbolStats?.usd_market_cap, {
              precision: 2,
              lowercase: true,
            }),
          usd_24h_vol:
            symbolStats?.usd_24h_vol &&
            millify(symbolStats?.usd_24h_vol, {
              precision: 2,
              lowercase: true,
            }),
        },
      };
    }
  };

export const selectActiveTokensByAddressWithInfo =
  (address: string) => (state: AppState) => {
    const activeTokens =
      state.entities.tokens?.byId &&
      Object.keys(state.entities.tokens?.byId)
        ?.map((id) => state.entities.tokens.byId[id])
        .filter((token) => token.address === address && token.active);
    if (activeTokens?.length == 0) {
      return [];
    } else {
      return activeTokens.map((tokenObj: keyable) => ({
        ...tokenObj,
        ...getTokenInfo(tokenObj.tokenId),
      }));
    }
  };

export const selectActiveTokenAndAddressBalance =
  (address: string) => (state: AppState) => {
    const currentBalanceInUSD =
      state.entities.balances.byId[address]?.balanceInUSD;

    const activeTokenPrices =
      state.entities.tokens?.byId &&
      Object.keys(state.entities.tokens?.byId)
        ?.map((id) => state.entities.tokens.byId[id])
        .filter((token) => token.address === address && token.active)
        .map((token) => token.price || 0);
    const tokenBalanceSumInUsd = activeTokenPrices.reduce(
      (a: number, b: number) => a + b,
      0
    );

    return Number(currentBalanceInUSD) + Number(tokenBalanceSumInUsd);
  };

export default TokenState.reducer;
