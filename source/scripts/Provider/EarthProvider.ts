import { getBalance } from '@earthwallet/keyring';
//import { ecsign, hashPersonalMessage, toRpcSig } from 'ethereumjs-util';
import { IWalletState } from '~state/wallet/types';
import store from '~state/store';
import { canisterAgent, canisterAgentApi } from '@earthwallet/assets';
import { keyable } from '~scripts/Background/types/IMainController';
import { createEntity, storeEntities, updateEntities } from '~state/entities';
import Secp256k1KeyIdentity from '@earthwallet/keyring/build/main/util/icp/secpk256k1/identity';
import {
  parseObjWithBigInt,
  parsePrincipalObj,
  stringifyWithBigInt,
} from '~global/helpers';
import { PREGENERATE_SYMBOLS } from '~global/constant';
import { decryptString, encryptString } from '~utils/vault';
import { v4 as uuid } from 'uuid';

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

  generateSessionId() {
    const bigSessionId = uuid();
    const sessionId = bigSessionId.substring(0, 8);
    return sessionId;
  }

  getAddressForDapp(origin: string, assets?: keyable) {
    console.log(assets, PREGENERATE_SYMBOLS);
    const dapp = store.getState().dapp;
    const address = dapp[origin]?.address;

    const groupId = store.getState().entities.accounts.byId[address]?.groupId;
    if (assets === null || assets === undefined) {
      return dapp[origin]?.address;
    } else {
      try {
        if (Array.isArray(assets)) {
          return assets.map((asset) => {
            if (PREGENERATE_SYMBOLS.includes(asset)) {
              return Object.keys(store.getState().entities.accounts.byId)
                .map((id) => store.getState().entities.accounts.byId[id])
                .filter(
                  (account) =>
                    account.groupId === groupId && account.symbol === asset
                )[0]?.address;
            } else {
              return '';
            }
          });
        }
      } catch (error) {}

      return [groupId, dapp[origin]?.address];
    }
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

  async testSessionSign(request: keyable, origin: string) {
    console.log('testSessionSign', request, origin);
    const state = store.getState();
    const sessionState = Object.keys(state.entities.dappSessions?.byId)
      ?.map((id) => state.entities.dappSessions.byId[id])
      .filter(
        (dappSession: keyable) =>
          typeof dappSession == 'object' && dappSession.origin == origin
      );

    console.log(sessionState, 'sessionState');
    let approvedIdentityJSON = '';
    try {
      approvedIdentityJSON = decryptString(
        sessionState[0].vault.encryptedJson,
        request.sessionId.toString()
      );
    } catch (error) {
      console.log('Wrong sessionId! Please try again');
      return {
        error: 'Wrong sessionId! Please try again and request a new Session',
      };
    }
    const fromIdentity = Secp256k1KeyIdentity.fromJSON(approvedIdentityJSON);

    const response = await canisterAgent({
      canisterId: '7igbu-3qaaa-aaaaa-qaapq-cai',
      method: 'cowsay',
      args: request.message,
      fromIdentity: fromIdentity,
    });
    return { response, principal: fromIdentity?.getPrincipal()?.toText() };
  }

  async createSession(
    request: keyable,
    approvedIdentityJSON: string,
    requestId: string
  ) {
    const state = store.getState();

    const requestState = state.entities.dappRequests.byId[requestId];
    const { origin, address } = requestState;

    console.log('createSession', origin, address, request, requestId);
    let response: any;

    //approvedIdentityJSON store with sessionId as password

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

    const encryptedJson = encryptString(
      approvedIdentityJSON,
      request.sessionId.toString()
    );
    if (state.entities.dappSessions == null) {
      store.dispatch(createEntity({ entity: 'dappSessions' }));
    }

    store.dispatch(
      storeEntities({
        entity: 'dappSessions',
        data: [
          {
            id: requestId,
            vault: {
              encryptedJson,
            },
            origin,
            address,
            canisterIds: request.canisterIds,
            expiryAt: new Date().getTime() + request.expiryTime * 1000,
          },
        ],
      })
    );
    response = 'Session Created!';

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
