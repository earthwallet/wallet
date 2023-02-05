import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import type { ITokensState } from './types';
import { AppState } from '~state/store';
import { keyable } from '~scripts/Background/types/IMainController';
import { getTokenInfo, getLiveTokensByNetworkSymbol } from '~global/tokens';
import { getInfoBySymbol } from '~global/constant';

const initialState: ITokensState = {
  loading: false,
  error: '',
  tokensInfoLastUpdated_ETH: 0,
};

const TokenState = createSlice({
  name: 'tokens',
  initialState,
  reducers: {
    updateError(state: ITokensState, action: PayloadAction<string>) {
      state.error = action.payload;
    },
    updateLoading(state: ITokensState, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    updateTokensInfoLastUpdated_ETH(
      state: ITokensState,
      action: PayloadAction<number>
    ) {
      state.tokensInfoLastUpdated_ETH = action.payload;
    },
    hydrateTokens(state: ITokensState, action: PayloadAction<ITokensState>) {
      Object.assign(state, action.payload);
    },
  },
});

export const {
  updateError,
  updateLoading,
  updateTokensInfoLastUpdated_ETH,
  hydrateTokens,
} = TokenState.actions;

export const selectTokensInfo = (address: string) => (state: AppState) => {
  const activeAccount = state.entities.accounts.byId[address];
  return getLiveTokensByNetworkSymbol(activeAccount.symbol);
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
  (symbolOrTokenId: string, accountId: string) => (state: AppState) => {

    const info = getInfoBySymbol(symbolOrTokenId);
    const getTokenInfoFromStore = (address: string) =>
      state.entities.tokensInfo?.byId[address];
    const getTokenPrice = (contractAddress: string) =>
      state.entities.prices.byId[contractAddress];
    if (info == undefined) {
      const tokenId = symbolOrTokenId;
      const tokenPair = accountId + '_WITH_' + tokenId;
      const tokenObj = state.entities.tokens?.byId[tokenPair];

      if (tokenObj != null) {
        return tokenObj.network == 'ICP'
          ? {
              ...tokenObj,
              ...getTokenInfo(tokenObj.tokenId),
            }
          : {
              ...tokenObj,
              format: 'token',
              ...{
                balance:
                  tokenObj.tokenBalance /
                  Math.pow(
                    10,
                    getTokenInfoFromStore(tokenObj.contractAddress)?.decimals ||
                      0
                  ),
                balanceTxt: (
                  tokenObj.tokenBalance /
                  Math.pow(
                    10,
                    getTokenInfoFromStore(tokenObj.contractAddress)?.decimals ||
                      0
                  )
                ).toFixed(3),
                price: (
                  (tokenObj.tokenBalance /
                    Math.pow(
                      10,
                      getTokenInfoFromStore(tokenObj.contractAddress)
                        ?.decimals || 0
                    )) *
                  getTokenPrice(tokenObj.contractAddress)?.usd
                ).toFixed(3),
              },
              ...getTokenInfoFromStore(tokenObj.contractAddress),
              ...getTokenPrice(tokenObj.contractAddress),
            };
      } else {
        return {};
      }
    } else {
      const currentBalance = state.entities.balances.byId[accountId];
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
        },
        ...symbolStats,
      };
    }
  };

export const selectActiveTokensByAddressWithInfo =
  (address: string, symbol: string) => (state: AppState) => {
    const activeTokens =
      state.entities.tokens?.byId &&
      Object.keys(state.entities.tokens?.byId)
        ?.map((id) => state.entities.tokens.byId[id])
        .filter(
          (token) =>
            token.network == symbol && token.address === address && token.active
        );
    const getTokenInfoFromStore = (address: string) =>
      state.entities.tokensInfo?.byId[address];
    if (activeTokens?.length == 0) {
      return [];
    } else {
      return activeTokens
        .map((tokenObj: keyable) =>
          tokenObj.network == 'ICP'
            ? {
                ...tokenObj,
                ...getTokenInfo(tokenObj.tokenId),
              }
            : {
                ...tokenObj,
                ...{
                  balance:
                    tokenObj.tokenBalance /
                    Math.pow(
                      10,
                      getTokenInfoFromStore(tokenObj.contractAddress)
                        ?.decimals || 0
                    ),
                  balanceTxt: (
                    tokenObj.tokenBalance /
                    Math.pow(
                      10,
                      getTokenInfoFromStore(tokenObj.contractAddress)
                        ?.decimals || 0
                    )
                  ).toFixed(3),
                },
                ...getTokenInfoFromStore(tokenObj.contractAddress),
              }
        )
        .filter((token: keyable) =>
          token.network == 'ICP' ? token : token.balance != 0
        );
    }
  };

export const selectActiveTokenAndAddressBalanceByAccountId =
  (accountId: string) => (state: AppState) => {
    const { address, symbol } = state.entities.accounts.byId[accountId];
    const currentBalanceInUSD =
      state.entities.balances.byId[accountId]?.balanceInUSD;

    const activeTokenPrices =
      state.entities.tokens?.byId &&
      Object.keys(state.entities.tokens?.byId)
        ?.map((id) => state.entities.tokens.byId[id])
        .filter(
          (token) =>
            token.address === address && token.active && token.network == symbol
        )
        .map((token) =>
          token.network == 'ICP' ? token.price || 0 : token.price || 0
        );
    const tokenBalanceSumInUsd = activeTokenPrices.reduce(
      (a: number, b: number) => a + b,
      0
    );

    return Number(currentBalanceInUSD) + Number(tokenBalanceSumInUsd);
  };

export const selectTokenInfoByContract =
  (contractAddress: string) => (state: AppState) =>
    state.entities.tokensInfo?.byId[contractAddress];

export default TokenState.reducer;
