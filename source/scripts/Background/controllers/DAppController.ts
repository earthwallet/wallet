import { ConnectedDApps, DAppInfo } from '~global/types';
import { listNewDapp, updateDapp } from '~state/dapp';
import store from '~state/store';
import { IDAppController } from '../types/IDAppController';
import { storeEntities } from '~state/entities';
import { keyable } from '../types/IAssetsController';
import { stringifyWithBigInt } from '~global/helpers';

class DAppController implements IDAppController {
  #current: DAppInfo = { origin: '', logo: '', title: '', address: '' };
  #request: keyable;
  #approvedIdentity: any;

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
    let parsedRequest = Array.isArray(request)
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
            type: 'signMessage',
            request: parsedRequest,
          },
        ],
      })
    );
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

  setApprovedIdentity(identity: any) {
    this.#approvedIdentity = identity;
  }

  getApprovedIdentity = () => {
    return this.#approvedIdentity;
  };
}

export default DAppController;
