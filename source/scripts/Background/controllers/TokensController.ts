//import { createWallet, newMnemonic } from '@earthwallet/keyring';
import store from '~state/store';

import type { ITokensController } from '../types/ITokensController';
import {
  storeEntities,
  updateEntities,
  //updateEntities
} from '~state/entities';
import {
  getAllTokens,
  getMetadata,
  tokenAPI,
  pairFactoryAPI,
  get_current_price,
  swap,
} from '@earthwallet/assets';
import { createEntity } from '~state/entities';
import { Principal } from '@dfinity/principal';
import { keyable } from '../types/IAssetsController';
import { createWallet } from '@earthwallet/keyring';

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
    for (const tokenInfo of activeTokens) {
      const response = await tokenAPI(
        tokenInfo.tokenId,
        'balanceOf',
        Principal.fromText(accountInfo?.meta?.principalId)
      );
      const balance = {
        id: address + '_WITH_' + tokenInfo.tokenId,
        balance: response.toString(),
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
    console.log('getTokens');
    const state = store.getState();

    if (state.entities.tokens == null) {
      store.dispatch(createEntity({ entity: 'tokens' }));
    }
    if (state.entities.tokensInfo == null) {
      store.dispatch(createEntity({ entity: 'tokensInfo' }));
    }
    const tokens = await getAllTokens();
    console.log('getTokens', tokens);
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

  getPair = async (token1: string, token2: string) => {
    console.log(token1, token2, 'getPair');
    let response = await pairFactoryAPI('get_pair', [
      Principal.fromText(token1),
      Principal.fromText(token2),
    ]);
    if (response == undefined) {
      response = await pairFactoryAPI('create_pair', [
        Principal.fromText(token1),
        Principal.fromText(token2),
      ]);
    }
    const pair = response[0].toText();
    const price: keyable = await get_current_price(pair);
    const price1 = price[0];
    const price2 = price[1];
    const ratio = (price1 / price2) * 100;
    return { token1, token2, pair, price1, price2, ratio };
  };

  mint = async (token1: string, token2: string) => {
    console.log(token1, token2, 'mint');
    let response = await pairFactoryAPI('get_pair', [
      Principal.fromText(token1),
      Principal.fromText(token2),
    ]);
    if (response == undefined) {
      response = await pairFactoryAPI('create_pair', [
        Principal.fromText(token1),
        Principal.fromText(token2),
      ]);
    }
    const pair = response[0].toText();
    const price: keyable = await get_current_price(pair);
    const price1 = price[0];
    const price2 = price[1];
    const ratio = (price1 / price2) * 100;
    const seedPhrase =
      'open jelly jeans corn ketchup supreme brief element armed lens vault weather original scissors rug priority vicious lesson raven spot gossip powder person volcano';

    const walletObj = await createWallet(seedPhrase, 'ICP');

    const status = await swap(
      walletObj.identity,
      'wxns6-qiaaa-aaaaa-aaaqa-cai',
      'tmxop-wyaaa-aaaaa-aaapa-cai',
      1666
    );
    return { token1, token2, pair, price1, price2, price, ratio, status };
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
