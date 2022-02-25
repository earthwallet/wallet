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
  getAllTokens,
  getMetadata,
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
    await this.delay(5000);

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
      ratio: 1.4,
      stats: { total_supply: 12111122 },
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
