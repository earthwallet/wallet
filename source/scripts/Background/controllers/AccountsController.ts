import { createWallet, newMnemonic } from '@earthwallet/sdk';
import store from '~state/store';
import {
  updateAccounts,
  updateActiveAccount,
  updateNewMnemonic,
  updateError,
  updateLoading,
} from '~state/wallet';
import type { IAccountsController } from '../types/IAccountsController';
import { EarthKeyringPair } from '@earthwallet/sdk';

export default class AccountsController implements IAccountsController {
  private password: string;

  constructor() {
    this.password = '';
  }

  checkPassword(pwd: string) {
    return this.password === pwd;
  }

  unlock(pwd: string) {
    // TODO: unlock logic should be implemented
    const isValidPassword = true;

    if (isValidPassword) {
      this.password = pwd;
      return true;
    }
    return false;
  }

  lock() {
    this.password = '';
  }

  async createNewMnemonic() {
    store.dispatch(updateLoading(true));

    try {
      const _newMnemonic = await newMnemonic();
      if (_newMnemonic !== false) {
        store.dispatch(updateNewMnemonic(_newMnemonic));
        store.dispatch(updateLoading(false));
      } else {
        store.dispatch(updateLoading(false));
        store.dispatch(updateError('Unable to generate mnemonic'));
      }
    } catch (error) {
      store.dispatch(updateLoading(false));
      store.dispatch(updateError('Unable to generate mnemonic'));
      console.log(error);
    }
  }

  async createAccount(mnemonic: string, symbol: string) {
    const available: EarthKeyringPair[] = store.getState().accounts;
    const existingActiveAccount = store.getState().activeAccount;

    const keypair = await createWallet(mnemonic, symbol);

    if (existingActiveAccount.address !== keypair.address) {
      store.dispatch(updateActiveAccount(keypair));
    }

    if (!available.some((_account) => _account.address === keypair.address)) {
      available.push(keypair);
      store.dispatch(updateAccounts(available));
    }
  }

  async createAccounts(symbols: string[]) {
    let newAccounts = [];

    for (const symbol of symbols) {
      const keypair = await createWallet(
        'open jelly jeans corn ketchup supreme brief element armed lens vault weather original scissors rug priority vicious lesson raven spot gossip powder person volcano',
        symbol
      );
      newAccounts.push(keypair);
    }
    store.dispatch(updateActiveAccount(newAccounts[0]));
    store.dispatch(updateAccounts(newAccounts));
  }
}
