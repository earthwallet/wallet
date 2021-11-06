import { getBalance } from '@earthwallet/keyring';
//import { ecsign, hashPersonalMessage, toRpcSig } from 'ethereumjs-util';
import { IWalletState } from '~state/wallet/types';
import store from '~state/store';
import { canisterAgentApi } from '@earthwallet/assets';
import { keyable } from '~scripts/Background/types/IMainController';

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

  getAddressForDapp(origin: string) {
    const dapp = store.getState().dapp;
    return dapp[origin]?.address;
  }

  async getBalance() {
    const { activeNetwork, activeAccount }: IWalletState =
      store.getState().vault;

    return activeAccount
      ? await getBalance(activeAccount?.address, activeNetwork)
      : null;
  }

  async signMessage(request: keyable) {
    let response: any;
    let counter = 0;
    console.log(request, Array.isArray(request));
    //setLoading(true);
    if (Array.isArray(request)) {
      response = [];
      for (const singleRequest of request) {
        response[counter] = await canisterAgentApi(
          singleRequest?.canisterId,
          singleRequest?.method,
          singleRequest?.args
          //fromIdentity
        );
        counter++;
      }
    } else {
      response = await canisterAgentApi(
        request?.canisterId,
        request?.method,
        request?.args
        //fromIdentity
      );
    }

    console.log(response);

    /*     await approveSign().then(() => {
         });
        window.close(); */

    if (!Array.isArray(response) && response.type !== 'error') {
      // setSuccess(true);
      //setResponse(response);
    } else {
      //todo
      // setResponseArr(response);
      // setSuccess(true);
    }
    //setLoading(false);
    return response;
  }

  async signMessageOld(request: any) {
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
      response = error;
    }

    return response;
  }
}
