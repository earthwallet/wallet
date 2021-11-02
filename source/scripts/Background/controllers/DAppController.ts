import { ConnectedDApps, DAppInfo } from '~global/types';
import { listNewDapp } from '~state/dapp';
import store from '~state/store';
import { IDAppController } from '../types/IDAppController';
import { updateActiveAccount } from '~state/wallet';
import { EarthKeyringPair } from '@earthwallet/keyring';
import { storeEntities } from '~state/entities';
import { keyable } from '../types/IAssetsController';

class DAppController implements IDAppController {
  #current: DAppInfo = { origin: '', logo: '', title: '' };
  #request: keyable;

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
    store.dispatch(
      storeEntities({
        entity: 'dappRequests',
        data: [
          {
            id,
            type: 'sign',
            ...{ request },
          },
        ],
      })
    );
  }

  setActiveAccount(account: EarthKeyringPair & { id: string }) {
    store.dispatch(updateActiveAccount(account));
  }

  getCurrent() {
    return this.#current;
  }

  setSignatureRequest(req: keyable) {
    this.#request = req;
  }

  getSignatureRequest = () => {
    return this.#request;
  };
}

export default DAppController;
