import { getBalance } from '@earthwallet/keyring';
import { ecsign, hashPersonalMessage, toRpcSig } from 'ethereumjs-util';
import { IWalletState } from '~state/wallet/types';
import store from '~state/store';

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

  signMessage(msg: string) {
    const privateKeyHex = '0x'; // TODO: Dummy private key hex
    const privateKey = Buffer.from(privateKeyHex, 'hex');
    const msgHash = hashPersonalMessage(Buffer.from(msg));

    const { v, r, s } = ecsign(msgHash, privateKey);
    const sig = this.remove0x(toRpcSig(v, r, s));

    return sig;
  }

  private remove0x(hash: string) {
    return hash.startsWith('0x') ? hash.slice(2) : hash;
  }
}
