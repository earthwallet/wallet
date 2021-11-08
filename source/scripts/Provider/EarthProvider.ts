import { getBalance } from '@earthwallet/keyring';
//import { ecsign, hashPersonalMessage, toRpcSig } from 'ethereumjs-util';
import { IWalletState } from '~state/wallet/types';
import store from '~state/store';
import { canisterAgentApi } from '@earthwallet/assets';
import { keyable } from '~scripts/Background/types/IMainController';
import { updateEntities } from '~state/entities';
import Secp256k1KeyIdentity from '@earthwallet/keyring/build/main/util/icp/secpk256k1/identity';

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

  async signMessage(
    request: keyable,
    approvedIdentityJSON: string,
    requestId?: string
  ) {
    let response: any;
    let counter = 0;
    const fromIdentity = Secp256k1KeyIdentity.fromJSON(approvedIdentityJSON);

    //setLoading(true);
    //store.update
    store.dispatch(
      updateEntities({
        entity: 'dappRequests',
        key: requestId,
        data: {
          loading: true,
          error: '',
        },
      })
    );
    if (Array.isArray(request)) {
      response = [];
      for (const singleRequest of request) {
        store.dispatch(
          updateEntities({
            entity: 'dappRequests',
            key: requestId,
            data: {
              loadingIndex: counter,
            },
          })
        );
        response[counter] = await canisterAgentApi(
          singleRequest?.canisterId,
          singleRequest?.method,
          singleRequest?.args,
          fromIdentity
        );
        counter++;
      }
    } else {
      response = await canisterAgentApi(
        request?.canisterId,
        request?.method,
        request?.args,
        fromIdentity
      );
    }

    store.dispatch(
      updateEntities({
        entity: 'dappRequests',
        key: requestId,
        data: {
          loading: false,
          complete: true,
          completedAt: new Date().getTime(),
          error: '',
        },
      })
    );

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
}
