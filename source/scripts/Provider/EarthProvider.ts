import { getBalance } from '@earthwallet/keyring';
//import { ecsign, hashPersonalMessage, toRpcSig } from 'ethereumjs-util';
import { IWalletState } from '~state/wallet/types';
import store from '~state/store';
import { canisterAgentApi } from '@earthwallet/assets';
import { keyable } from '~scripts/Background/types/IMainController';
import { updateEntities } from '~state/entities';
import Secp256k1KeyIdentity from '@earthwallet/keyring/build/main/util/icp/secpk256k1/identity';
import {
  parseObjWithBigInt,
  parsePrincipalObj,
  stringifyWithBigInt,
} from '~global/helpers';

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

  getAddressMeta(origin: string) {
    const dapp = store.getState().dapp;
    const address = dapp[origin]?.address;
    const account = store.getState().entities.accounts.byId[address];
    return account.meta;
  }

  async getBalance() {
    const { activeNetwork, activeAccount }: IWalletState =
      store.getState().vault;

    return activeAccount
      ? await getBalance(activeAccount?.address, activeNetwork)
      : null;
  }

  async sign(
    request: keyable,
    approvedIdentityJSON: string,
    requestId?: string
  ) {
    let response: any;
    let counter = 0;
    const fromIdentity = Secp256k1KeyIdentity.fromJSON(approvedIdentityJSON);

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
        const argsWithBigInt =
          singleRequest?.args && parseObjWithBigInt(singleRequest?.args);
        const argsWithPrincipalAndBigInt = parsePrincipalObj(argsWithBigInt);

        response[counter] = await canisterAgentApi(
          singleRequest?.canisterId,
          singleRequest?.method,
          argsWithPrincipalAndBigInt,
          fromIdentity
        );
        counter++;
      }
    } else {
      const argsWithBigInt = request?.args && parseObjWithBigInt(request?.args);
      const argsWithPrincipalAndBigInt = parsePrincipalObj(argsWithBigInt);

      response = await canisterAgentApi(
        request?.canisterId,
        request?.method,
        argsWithPrincipalAndBigInt,
        fromIdentity
      );
    }

    let parsedResponse = '';
    try {
      parsedResponse = stringifyWithBigInt(response);
      parsedResponse = parsedResponse?.substring(0, 1000);
    } catch (error) {
      console.log('Unable to stringify response');
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
          response: parsedResponse,
        },
      })
    );

    return response;
  }

  async signRaw(
    request: keyable,
    approvedIdentityJSON: string,
    requestId?: string
  ) {
    let response: any;
    const fromIdentity = Secp256k1KeyIdentity.fromJSON(approvedIdentityJSON);

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

    response = await fromIdentity.sign(request.message);

    let parsedResponse = '';
    try {
      parsedResponse = JSON.stringify(response);
      parsedResponse = parsedResponse?.substring(0, 1000);
    } catch (error) {
      console.log('Unable to stringify response');
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
          response: parsedResponse,
        },
      })
    );

    return response;
  }
}
