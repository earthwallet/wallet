import { ConnectedDApps, DAppInfo } from '~global/types';
import { listNewDapp, unlistDapp, updateDapp } from '~state/dapp';
import store from '~state/store';
import { IDAppController } from '../types/IDAppController';
import { removeEntityKey, storeEntities } from '~state/entities';
import { keyable } from '../types/IAssetsController';
import { stringifyWithBigInt } from '~global/helpers';

class DAppController implements IDAppController {
  #current: DAppInfo = { origin: '', logo: '', title: '', address: '' };
  #request: keyable;
  #approvedIdentityJSON: string;

  fromPageConnectDApp(origin: string, title: string) {
    const dapp: ConnectedDApps = store.getState().dapp;

    this.#current = {
      origin,
      logo: `chrome://favicon/size/64@1x/${origin}`,
      title,
    };

    return !!dapp[origin];
  }

  fromUserConnectDApp(origin: string, dapp: DAppInfo) {
    store.dispatch(listNewDapp({ id: origin, dapp }));
  }

  addSignRequest(request: any, id: string) {
    if (request.type === 'signRaw') {
      store.dispatch(
        storeEntities({
          entity: 'dappRequests',
          data: [
            {
              id,
              origin: this.#current.origin,
              type: 'signRaw',
              request: request,
              address: this.getCurrentDappAddress(),
            },
          ],
        })
      );
    } else {
      const parsedRequest = Array.isArray(request)
        ? request.map((singleReq, _) => ({
            ...singleReq,
            args: stringifyWithBigInt(singleReq?.args),
          }))
        : {
            ...request,
            args: stringifyWithBigInt(request?.args),
          };

      store.dispatch(
        storeEntities({
          entity: 'dappRequests',
          data: [
            {
              id,
              origin: this.#current.origin,
              type: 'sign',
              request: parsedRequest,
              address: this.getCurrentDappAddress(),
            },
          ],
        })
      );
    }
  }

  setDappConnectedAddress(address: string, origin: string) {
    const dapp: ConnectedDApps = store.getState().dapp;
    if (origin !== undefined) {
      store.dispatch(
        updateDapp({
          id: origin,
          dapp: { ...dapp[origin], address: address },
        })
      );
    }
  }

  getCurrent() {
    return this.#current;
  }

  getCurrentDappAddress() {
    const dapp: ConnectedDApps = store.getState().dapp;
    return dapp[this.#current.origin].address || '';
  }

  setSignatureRequest(req: keyable, requestId: string) {
    this.#request = req;
    this.addSignRequest(req, requestId);
  }

  getSignatureRequest = () => {
    return this.#request;
  };

  setApprovedIdentityJSON(identityJSON: string) {
    this.#approvedIdentityJSON = identityJSON;
  }

  getApprovedIdentityJSON = () => {
    return this.#approvedIdentityJSON;
  };

  deleteOriginAndRequests = (origin: string, call?: () => void | undefined) => {
    call && call();

    store.dispatch(unlistDapp({ id: origin }));

    const dappRequests = store.getState().entities?.dappRequests?.byId;

    return (
      dappRequests &&
      Object.keys(dappRequests)
        .map((id) => dappRequests[id])
        .filter((dappRequest) => dappRequest.origin === origin)
        .map((dappRequest) =>
          store.dispatch(
            removeEntityKey({ entity: 'dappRequests', key: dappRequest.id })
          )
        )
    );
  };
}

export default DAppController;
