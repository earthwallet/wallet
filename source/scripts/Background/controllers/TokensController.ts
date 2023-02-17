import store from '~state/store';

import type { ITokensController } from '../types/ITokensController';
import {
  storeEntities,
  updateEntities,
} from '~state/entities';
import {
  canisterAgent,
  canisterAgentApi,
  principal_to_address,
} from '@earthwallet/assets';
import { createEntity } from '~state/entities';
import { getTokenInfo } from '~global/tokens';
import { Principal } from '@dfinity/principal';
import { v4 as uuid } from 'uuid';
import Secp256k1KeyIdentity from '@earthwallet/keyring/build/main/util/icp/secpk256k1/identity';
import { send } from '@earthwallet/keyring';
import { keyable } from '../types/IAssetsController';
import {
  getBalanceERC20,
  getERC20Info_ETH,
  getERC20Meta,
  getERC20TokensListFromTxs,
  rocketPoolInfo,
} from '~utils/services';

export default class TokensController implements ITokensController {
  getTokenBalances = async (accountId: string) => {
    const state = store.getState();

    const accountInfo = state.entities.accounts.byId[accountId];
    const address = accountInfo.address;

    const activeTokens =
      state.entities.tokens?.byId &&
      Object.keys(state.entities.tokens?.byId)
        ?.map((id) => state.entities.tokens.byId[id])
        .filter((token) => token.address === address && token.active);

    if (accountInfo.symbol == 'ICP') {
      for (const activeToken of activeTokens) {
        const tokenInfo = getTokenInfo(activeToken.tokenId);
        let response;
        let usd;
        let price;
        let balanceTxt;
        let ratio_per_icp;
        if (
          tokenInfo.wrappedSymbol != null &&
          tokenInfo.wrappedSymbol == 'XDR'
        ) {
          response = await canisterAgent({
            canisterId: activeToken.tokenId,
            method: 'balanceOf',
            args: Principal.fromText(accountInfo?.meta?.principalId),
          });
          const conv_res = await canisterAgent({
            canisterId: 'rkp4c-7iaaa-aaaaa-aaaca-cai',
            method: 'get_icp_xdr_conversion_rate',
          });
          const TRILLION_SDR_PER_ICP =
            conv_res?.data?.xdr_permyriad_per_icp.toString() / 10000;
          ratio_per_icp = TRILLION_SDR_PER_ICP;
          balanceTxt =
            (response?.toString() &&
              Number(
                response?.toString() / Math.pow(10, tokenInfo.decimals)
              ).toFixed(4)) ||
            0;
          const currentUSDValue =
            state.entities.prices.byId['internet-computer'];
          const ICP_PRICE_IN_USD = currentUSDValue?.usd;
          const SDR_PRICE_IN_USD = ICP_PRICE_IN_USD / TRILLION_SDR_PER_ICP;
          price = (balanceTxt * SDR_PRICE_IN_USD)?.toFixed(2);
          usd = SDR_PRICE_IN_USD;
        } else if (
          tokenInfo.wrappedSymbol != null &&
          tokenInfo.wrappedSymbol == 'ICP'
        ) {
          response = await canisterAgent({
            canisterId: activeToken.tokenId,
            method: 'balanceOf',
            args: Principal.fromText(accountInfo?.meta?.principalId),
          });
          balanceTxt =
            (response?.toString() &&
              Number(
                response?.toString() / Math.pow(10, tokenInfo.decimals)
              ).toFixed(4)) ||
            0;
          const currentUSDValue =
            state.entities.prices.byId['internet-computer'];
          const ICP_PRICE_IN_USD = currentUSDValue?.usd;
          price = (balanceTxt * ICP_PRICE_IN_USD)?.toFixed(2);
        }

        const balance = {
          id: address + '_WITH_' + activeToken.tokenId,
          balance: response?.toString(),
          price,
          balanceTxt,
          ratio_per_icp,
          usd,
          network: accountInfo.symbol,
        };

        store.dispatch(
          storeEntities({
            entity: 'tokens',
            data: [balance],
          })
        );
      }
    } else if (accountInfo.symbol == 'ETH' || accountInfo.symbol == 'MATIC') {
      let tokens = await getERC20TokensListFromTxs(
        accountInfo.address,
        accountInfo.symbol
      );

      const balances: keyable[] = await getBalanceERC20(
        address,
        accountInfo.symbol,
        tokens
      );
      for (const balance of balances) {
        if (balance.tokenBalance > 0) {
          const balanceObj = {
            id: accountId + '_WITH_' + balance.contractAddress,
            address: address,
            ...balance,
            contractAddress: balance.contractAddress?.toLowerCase(),
            active: true,
            network: accountInfo.symbol,
          };
          store.dispatch(
            storeEntities({
              entity: 'tokens',
              data: [balanceObj],
            })
          );
          this.updateERC20PriceAndMeta(
            balance.contractAddress,
            accountInfo.symbol
          );
        } else {
          const tokenId = address + '_WITH_' + balance.contractAddress;
          const existingTokenInfo = state.entities.tokens.byId[tokenId];
          if (existingTokenInfo != undefined) {
            const balanceObj = {
              id: tokenId,
              address: address,
              ...balance,
            };
            store.dispatch(
              updateEntities({
                entity: 'tokens',
                key: balanceObj.id,
                data: balanceObj,
              })
            );
          }
        }
      }
    }
    return;
  };

  updateERC20PriceAndMeta = async (contractAddress: string, symbol: string) => {
    const state = store.getState();
    // updates if price is last updated 15mins back
    if (
      !(
        Math.abs(
          new Date().getTime() -
            new Date(
              state.entities.prices.byId[contractAddress]?.last_updated || 0
            ).getTime()
        ) < 900000
      ) ||
      state.entities.prices.byId[contractAddress] == null
    ) {
      const tokenObj = await getERC20Meta(contractAddress, symbol);
      let additionalMeta = {};
      if (contractAddress == '0xae78736cd615f374d3085123a210448e74fc6393') {
        additionalMeta = await rocketPoolInfo();
      }
      const { icon } = getTokenInfo(contractAddress);
      const tokenInfo = {
        id: contractAddress,
        icon: icon != undefined ? icon : tokenObj.logo,
        ...tokenObj,
        network: symbol,
        last_updated: new Date().getTime(),
        loading: false,
        ...additionalMeta,
      };
      store.dispatch(
        storeEntities({
          entity: 'tokensInfo',
          data: [tokenInfo],
        })
      );
      const resp = await getERC20Info_ETH(contractAddress);
      if (resp == null || resp?.market_data == null) {
        return;
      }
      const { last_updated } = resp;
      const usd = resp?.market_data?.current_price.usd;

      const usd_market_cap = resp?.market_data?.market_cap.usd;

      const usd_24h_change = resp?.market_data?.price_change_24h;
      const usd_24h_vol =
        resp?.market_data?.market_cap_change_24h_in_currency?.usd;

      const priceInfo = {
        id: contractAddress,
        loading: false,
        error: false,
        usd,
        usd_market_cap,
        usd_24h_change,
        usd_24h_vol,
        last_updated,
      };

      store.dispatch(
        storeEntities({
          entity: 'prices',
          data: [priceInfo],
        })
      );
    }
  };

  delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  getPair = async (token1: string, token2: string) => {
    let TRILLION_SDR_PER_ICP;
    let total_supply;
    let ratio = 0;
    if (token1 == 'ICP') {
      total_supply = getTokenInfo(token2).totalSupply == 'Infinite' ? '∞' : '';
      if (
        getTokenInfo(token2).wrappedSymbol != null &&
        getTokenInfo(token2).wrappedSymbol == 'XDR'
      ) {
        const usd = await canisterAgent({
          canisterId: 'rkp4c-7iaaa-aaaaa-aaaca-cai',
          method: 'get_icp_xdr_conversion_rate',
        });
        TRILLION_SDR_PER_ICP =
          usd?.data?.xdr_permyriad_per_icp.toString() / 10000;

        ratio = TRILLION_SDR_PER_ICP == undefined ? 0 : TRILLION_SDR_PER_ICP;
      } else if (
        getTokenInfo(token2).wrappedSymbol != null &&
        getTokenInfo(token2).wrappedSymbol == 'ICP'
      ) {
        ratio = 1;
      }
    } else {
      await this.delay(5000);
    }

    return {
      ratio,
      stats: { total_supply },
    };
  };

  swap = async (token1: string, token2: string, amount: number) => {
    // mock
    console.log(amount);
    return {
      token1,
      token2,
      ratio: 1.6,
      stats: { total_supply: 12111122 },
    };
  };
  createMintTx = async ({
    from,
    to,
    fromAmount,
    address,
    pairRatio,
  }: {
    from: string;
    to: string;
    fromAmount: string;
    address: string;
    pairRatio: string;
  }) => {
    const state = store.getState();

    const txnId = uuid();
    if (state.entities.txnRequests == null) {
      store.dispatch(createEntity({ entity: 'txnRequests' }));
    }

    store.dispatch(
      storeEntities({
        entity: 'txnRequests',
        data: [
          {
            id: txnId,
            loading: false,
            current: 0,
            total: 2,
            type: 'mint',
            address: address,
            createdAt: new Date().getTime(),
            params: {
              from,
              to,
              fromAmount,
              pairRatio,
            },
          },
        ],
      })
    );
    return txnId;
  };

  transferToken = async (
    identityJSON: string,
    tokenId: string,
    recipient: string,
    amount: number,
    accountId: string,
    callback?: (path: string) => void
  ) => {
    const state = store.getState();

    if (state.entities.recents == null) {
      store.dispatch(createEntity({ entity: 'recents' }));
    }
    const selectedAccount = state.entities.accounts.byId[accountId];
    const { address } = selectedAccount;

    store.dispatch(
      updateEntities({
        entity: 'recents',
        key: recipient,
        data: {
          symbol: 'ICP',
          addressType: 'principal',
          lastSentAt: new Date().getTime(),
          sentBy: address,
        },
      })
    );

    const currentIdentity = Secp256k1KeyIdentity.fromJSON(identityJSON);

    const response: keyable = await canisterAgent({
      canisterId: tokenId,
      method: 'transfer',
      args: [
        Principal.fromText(recipient),
        amount * Math.pow(10, getTokenInfo(tokenId).decimals || 0),
      ],
      fromIdentity: currentIdentity,
    });
    callback && callback('s');
    await this.getTokenBalances(accountId);
    return response;
  };

  mintToken = async (
    txnId: string,
    identityJSON: string,

    callback?: (path: string) => void
  ) => {
    const state = store.getState();
    const txnObj = state.entities.txnRequests.byId[txnId];
    const currentIdentity = Secp256k1KeyIdentity.fromJSON(identityJSON);
    const selectedAmount = txnObj.params.fromAmount;
    let index: BigInt = 0n;
    const tokenAddress = principal_to_address(
      Principal.fromText(txnObj.params.to)
    );
    try {
      store.dispatch(
        storeEntities({
          entity: 'txnRequests',
          data: [
            {
              id: txnId,
              loading: true,
              status: 'Transferring ICP',
              current: 1,
              total: 3,
              type: 'mint',
            },
          ],
        })
      );
      index = await send(
        currentIdentity,
        tokenAddress,
        txnObj.address,
        selectedAmount,
        'ICP'
      );
    } catch (error: any) {
      store.dispatch(
        storeEntities({
          entity: 'txnRequests',
          data: [
            {
              id: txnId,
              loading: false,
              status: '',
              error: error?.message,
              current: 1,
              total: 3,
              type: 'mint',
            },
          ],
        })
      );
    }

    try {
      store.dispatch(
        storeEntities({
          entity: 'txnRequests',
          data: [
            {
              id: txnId,
              loading: true,
              status: 'Minting',
              current: 2,
              total: 3,
              type: 'mint',
              sendIndex: index?.toString(),
            },
          ],
        })
      );
      const response: any = await canisterAgentApi(
        txnObj.params.to,
        getTokenInfo(txnObj.params.to)?.mintMethod || '',
        [[], index],
        currentIdentity
      );
      if (response['Ok'] != undefined) {
        store.dispatch(
          storeEntities({
            entity: 'txnRequests',
            data: [
              {
                id: txnId,
                loading: false,
                status: '',
                current: 2,
                total: 3,
                type: 'mint',
                sendIndex: index?.toString(),
              },
            ],
          })
        );
      } else {
        store.dispatch(
          storeEntities({
            entity: 'txnRequests',
            data: [
              {
                id: txnId,
                loading: false,
                status: '',
                error: JSON.stringify(response['Err']),
                current: 2,
                total: 3,
                type: 'mint',
                sendIndex: index?.toString(),
              },
            ],
          })
        );
      }
    } catch (error: any) {
      store.dispatch(
        storeEntities({
          entity: 'txnRequests',
          data: [
            {
              id: txnId,
              loading: false,
              status: '',
              error: error?.message,
              current: 2,
              total: 3,
              type: 'mint',
              sendIndex: index?.toString(),
            },
          ],
        })
      );
      return;
    }
    store.dispatch(
      storeEntities({
        entity: 'txnRequests',
        data: [
          {
            id: txnId,
            loading: true,
            status: 'Updating balances',
            current: 3,
            total: 3,
            type: 'mint',
          },
        ],
      })
    );
    await this.getTokenBalances(txnObj.address);
    store.dispatch(
      storeEntities({
        entity: 'txnRequests',
        data: [
          {
            id: txnId,
            loading: false,
            status: 'Updating balances',
            current: 3,
            total: 3,
            type: 'mint',
          },
        ],
      })
    );
    callback && callback('/account/details/' + txnObj.address);
  };

  stake = async (token1: string, token2: string, amount: number) => {
    console.log(amount, 'mock');
    await this.delay(5000);
    return {
      token1,
      token2,
      stats: { total_supply: 12111122 },
      ratio: 1.1,
    };
  };
  updateTokensOfNetwork = async (
    address: string,
    tokens: string[],
    status: boolean,
    callback?: (address?: string) => void
  ) => {
   
    let forwardAddress = '';
    for (const tokenPair of tokens) {
      const tokenId = tokenPair.split('_WITH_', 2)[1];
      forwardAddress = address;
      store.dispatch(
        updateEntities({
          entity: 'tokens',
          key: tokenPair,
          data: {
            tokenId,
            id: tokenPair,
            active: status,
            address,
            type: 'ICP',
          },
        })
      );
    }

    callback && callback(forwardAddress);
  };
}
