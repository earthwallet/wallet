//import { createWallet, newMnemonic } from '@earthwallet/keyring';
import store from '~state/store';

import type { ITokensController } from '../types/ITokensController';
import {
  storeEntities,
  //updateEntities
} from '~state/entities';
import {
  getAllTokens,
  getMetadata,
  //tokenAPI
} from '@earthwallet/assets';
import { createEntity } from '~state/entities';
export default class TokensController implements ITokensController {
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

      console.log(
        response,
        decimals,
        fee?.toString(),
        feeTo?.toText(),
        name,
        owner?.toText(),
        symbol,
        totalSupply.toString(),
        tokenCanisterId
      );
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
}
