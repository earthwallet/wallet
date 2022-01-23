//import { createWallet, newMnemonic } from '@earthwallet/keyring';
import store from '~state/store';

import type { ITokensController } from '../types/ITokensController';
//import { storeEntities, updateEntities } from '~state/entities';

export default class TokensController implements ITokensController {
  getTokens = async (callback?: ((address: string) => void) | undefined) => {
    console.log('getTokens');
    const existingActiveAccount = store.getState().activeAccount;
    console.log(existingActiveAccount);
    callback && callback('address');
    return;
  };
}
