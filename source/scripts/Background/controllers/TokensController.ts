//import { createWallet, newMnemonic } from '@earthwallet/keyring';
import store from '~state/store';

import type { ITokensController } from '../types/ITokensController';
import {
  storeEntities,
  updateEntities,
  //updateEntities
} from '~state/entities';
import {
  canisterAgent,
  canisterAgentApi,
  getAllTokens,
  getMetadata,
  principal_to_address,
  //tokenAPI,
  //pairFactoryAPI,
  //approve,
  //transfer_from,
  //pairAPI,
} from '@earthwallet/assets';
import { createEntity } from '~state/entities';
import { getTokenInfo } from '~global/tokens';
import { Principal } from '@dfinity/principal';
//import { keyable } from '../types/IAssetsController';
//import { createWallet } from '@earthwallet/keyring';
//import { parseBigIntToString } from '~utils/common';
import { v4 as uuid } from 'uuid';
import Secp256k1KeyIdentity from '@earthwallet/keyring/build/main/util/icp/secpk256k1/identity';
import { send } from '@earthwallet/keyring';

export default class TokensController implements ITokensController {
  getTokenBalances = async (address: string) => {
    console.log(address, 'getTokenBalances');
    const state = store.getState();

    const accountInfo = state.entities.accounts.byId[address];
    console.log(accountInfo?.meta?.principalId, 'getTokenBalances');

    const activeTokens =
      state.entities.tokens?.byId &&
      Object.keys(state.entities.tokens?.byId)
        ?.map((id) => state.entities.tokens.byId[id])
        .filter((token) => token.address === address && token.active);
    console.log(activeTokens, 'getTokenBalances');
    for (const activeToken of activeTokens) {
      const tokenInfo = getTokenInfo(activeToken.tokenId);
      let response;
      let usd;
      if (tokenInfo.type == 'DIP20') {
        response = await canisterAgent({
          canisterId: activeToken.tokenId,
          method: 'balanceOf',
          args: Principal.fromText(accountInfo?.meta?.principalId),
        });
        usd = await canisterAgent({
          canisterId: 'rkp4c-7iaaa-aaaaa-aaaca-cai',
          method: 'get_icp_xdr_conversion_rate',
        });

        console.log(response, usd, 'getTokenBalances DIP20');
      }
      const TRILLION_SDR_IN_USD =
        usd?.data?.xdr_permyriad_per_icp.toString() / 100000;

      const balanceTxt =
        (response?.toString() &&
          Number(
            response?.toString() / Math.pow(10, tokenInfo.decimals)
          ).toFixed(2)) ||
        0;
      const balance = {
        id: address + '_WITH_' + activeToken.tokenId,
        balance: response?.toString(),
        price: (balanceTxt * TRILLION_SDR_IN_USD)?.toFixed(2),
        balanceTxt: balanceTxt,
      };
      store.dispatch(
        storeEntities({
          entity: 'tokens',
          data: [balance],
        })
      );
    }
    return;
  };

  getTokens = async (callback?: ((address: string) => void) | undefined) => {
    const state = store.getState();

    if (state.entities.tokens == null) {
      store.dispatch(createEntity({ entity: 'tokens' }));
    }
    if (state.entities.tokensInfo == null) {
      store.dispatch(createEntity({ entity: 'tokensInfo' }));
    }
    const tokens = await getAllTokens();
    for (const tokenCanisterId of tokens) {
      const response = await getMetadata(tokenCanisterId);
      const { decimals, fee, feeTo, name, owner, symbol, totalSupply } =
        response;

      const tokenInfo = {
        id: tokenCanisterId,
        decimals,
        fee: fee?.toString(),
        feeTo: feeTo?.toText(),
        name,
        owner: owner?.toText(),
        symbol,
        totalSupply: totalSupply.toString(),
        tokenCanisterId,
      };
      store.dispatch(
        storeEntities({
          entity: 'tokensInfo',
          data: [tokenInfo],
        })
      );
    }
    callback && callback('address');
    return;
  };

  delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

  getPair = async (token1: string, token2: string) => {
    let TRILLION_SDR_IN_USD;
    let ICP_PRICE_IN_USD;
    if (token1 == 'ICP') {
      const usd = await canisterAgent({
        canisterId: 'rkp4c-7iaaa-aaaaa-aaaca-cai',
        method: 'get_icp_xdr_conversion_rate',
      });
      TRILLION_SDR_IN_USD =
        usd?.data?.xdr_permyriad_per_icp.toString() / 100000;
      //internet-computer
      const state = store.getState();

      const currentUSDValue = state.entities.prices.byId['internet-computer'];
      ICP_PRICE_IN_USD = currentUSDValue?.usd;
    } else {
      await this.delay(5000);
    }

    /*  console.log(token1, token2, 'getPair');
    let response = await pairFactoryAPI('get_pair', [
      Principal.fromText(token1),
      Principal.fromText(token2),
    ]);
    console.log(response, 'get_pair');
    if (response == undefined || response.length == 0) {
      response = await pairFactoryAPI('create_pair', [
        Principal.fromText(token1),
        Principal.fromText(token2),
      ]);
    }
    const pair = response[0].toText();
    const stats: keyable = await pairAPI(pair, 'stats');

    const price1 = stats.token0_price;
    const price2 = stats.token1_price;
    const ratio = isNaN(price2) ? 1 : price2; */
    return {
      token1,
      token2,
      ratio:
        TRILLION_SDR_IN_USD == undefined
          ? ''
          : ICP_PRICE_IN_USD / TRILLION_SDR_IN_USD,
      stats: { total_supply: '∞' },
    };
  };

  swap = async (token1: string, token2: string, amount: number) => {
    console.log(token1, token2, amount, 'swap');
    /* let response = await pairFactoryAPI('get_pair', [
      Principal.fromText(token1),
      Principal.fromText(token2),
    ]);
    if (response == undefined || response.length == 0) {
      response = await pairFactoryAPI('create_pair', [
        Principal.fromText(token1),
        Principal.fromText(token2),
      ]);
    }
    const pairCanisterId = response[0].toText();
    const stats: keyable = await pairAPI(pairCanisterId, 'stats');

    const price1 = stats.token0_price;
    const price2 = stats.token1_price;
    const ratio = isNaN(price2) ? 1 : price2;
    const seedPhrase =
      'open jelly jeans corn ketchup supreme brief element armed lens vault weather original scissors rug priority vicious lesson raven spot gossip powder person volcano';

    const walletObj = await createWallet(seedPhrase, 'ICP');
    const identity = walletObj.identity;
    const get_transit = await pairAPI(
      pairCanisterId,
      'get_transit',
      undefined,
      identity
    );
    if (get_transit[1] > 0n && get_transit[0] > 0n) {
      const refund_transfer = await pairAPI(
        pairCanisterId,
        'refund_transfer',
        undefined,
        identity
      );
      console.log(refund_transfer, 'refund_transfer');
    }
    const _approve1 = await approve(identity, token1, pairCanisterId, amount);
    const _transfer_from1 = await transfer_from(
      token1,
      amount,
      identity,
      pairCanisterId
    );

    console.log(_approve1, _transfer_from1, get_transit);
    const swap = await pairAPI(pairCanisterId, 'swap', undefined, identity); */
    await this.delay(5000);
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
    console.log(from, to, fromAmount);
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

  mintToken = async (
    txnId: string,
    identityJSON: string,

    callback?: (path: string) => void
  ) => {
    console.log(txnId);
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
              status: 'Sending ICP',
              current: 1,
              total: 2,
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
      console.log(index, 'amount');
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
              total: 2,
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
              current: 1,
              total: 2,
              type: 'mint',
              sendIndex: index?.toString(),
            },
          ],
        })
      );
      const response: any = await canisterAgentApi(
        txnObj.params.to,
        'mint_by_icp',
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
                total: 2,
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
                current: 1,
                total: 2,
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
              current: 1,
              total: 2,
              type: 'mint',
              sendIndex: index?.toString(),
            },
          ],
        })
      );
      return;
    }
    this.getTokenBalances(txnObj.address);
    callback && callback('/account/details/' + txnObj.address);
  };

  stake = async (token1: string, token2: string, amount: number) => {
    console.log(token1, token2, amount, 'stake');
    await this.delay(5000);

    /*  let response = await pairFactoryAPI('get_pair', [
      Principal.fromText(token1),
      Principal.fromText(token2),
    ]);
    if (response == undefined || response.length == 0) {
      response = await pairFactoryAPI('create_pair', [
        Principal.fromText(token1),
        Principal.fromText(token2),
      ]);
    }
    const pairCanisterId = response[0].toText();
    const stats: keyable = await pairAPI(pairCanisterId, 'stats');

    const price1 = stats.token0_price;
    const price2 = stats.token1_price;
    const ratio = isNaN(price2) ? 1 : price2;
    const seedPhrase =
      'open jelly jeans corn ketchup supreme brief element armed lens vault weather original scissors rug priority vicious lesson raven spot gossip powder person volcano';

    const walletObj = await createWallet(seedPhrase, 'ICP');
    const identity = walletObj.identity;
    const _approve1 = await approve(identity, token1, pairCanisterId, amount);
    const _transfer_from1 = await transfer_from(
      token1,
      amount,
      identity,
      pairCanisterId
    );
    const _approve2 = await approve(
      identity,
      token2,
      pairCanisterId,
      Math.floor(amount * ratio)
    );
    const _transfer_from2 = await transfer_from(
      token2,
      Math.floor(amount * ratio),
      identity,
      pairCanisterId
    );

    const get_transit = await pairAPI(
      pairCanisterId,
      'get_transit',
      undefined,
      identity
    );

    const stake = await pairAPI(pairCanisterId, 'mint', undefined, identity);

    console.log(
      get_transit,
      stake,
      _approve1,
      _transfer_from1,
      _approve2,
      _transfer_from2,
      'stake'
    ); */
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
    console.log(address, tokens, status);
    //const state = store.getState();

    /*     const existingAllTokens = Object.keys(state.entities.tokens.byId)
      .map((id) => state.entities.tokens.byId[id])
      .filter((token) => token.address === address)
      .sort((a, b) => a.order - b.order);
 */
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
