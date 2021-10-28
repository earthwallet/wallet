import { getBalance } from '@earthwallet/keyring';
//import { ecsign, hashPersonalMessage, toRpcSig } from 'ethereumjs-util';
import { IWalletState } from '~state/wallet/types';
import store from '~state/store';
import { canisterAgentApi } from '@earthwallet/assets';

export class EarthProvider {
  constructor() {}

  getNetwork() {
    const { activeNetwork }: IWalletState = store.getState().vault;

    return activeNetwork;
  }

  getAddress() {
    const { activeAccount }: IWalletState = store.getState().wallet;

    return activeAccount?.address;
  }

  async getBalance() {
    const { activeNetwork, activeAccount }: IWalletState =
      store.getState().vault;

    return activeAccount
      ? await getBalance(activeAccount?.address, activeNetwork)
      : null;
  }

  async signMessage(msg: string) {
    let request = JSON.parse(msg)[0];
    console.log(request, 'signMessage EarthProvider');
    let response: any;
    try {
       response = await canisterAgentApi(
         request?.canisterId,
         request?.method,
         request?.args
       );  
    } catch (error) {
      console.log(error, typeof error, JSON.stringify(error));
      response = 'ERROR: ' + JSON.stringify(error);
    }
   
    return response;
  }

  /*   private remove0x(hash: string) {
    return hash.startsWith('0x') ? hash.slice(2) : hash;
  } */
}
