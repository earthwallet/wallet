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
import StringCrypto from 'string-crypto';
import { storeEntities } from '~state/entities';
import {
  getBalance as _getBalance,
  getTransactions as _getTransactions,
  send as _send,
} from '@earthwallet/sdk';

const { encryptString } = new StringCrypto();

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

  async createOrUpdateAccount(
    mnemonic: string,
    symbol: string,
    name: string,
    password: string,
    callback?: (address: string) => void
  ) {
    const existingActiveAccount = store.getState().activeAccount;

    const keypair = await createWallet(mnemonic, symbol);

    if (
      existingActiveAccount !== null &&
      existingActiveAccount?.address !== keypair.address
    ) {
      store.dispatch(updateActiveAccount({ id: keypair.address, ...keypair }));
    }

    store.dispatch(
      storeEntities({
        entity: 'accounts',
        data: [
          {
            meta: {
              name,
              createdAt: Math.round(new Date().getTime() / 1000),
              publicKey: keypair.publicKey,
              type: keypair.type,
            },
            vault: {
              encryptedMnemonic: encryptString(mnemonic, password),
              encryptedJson: encryptString(
                JSON.stringify(keypair.identity.toJSON()),
                password
              ),
              encryptionType: 'PBKDF2',
            },
            symbol,
            id: keypair.address,
          },
        ],
      })
    );
    callback && callback(keypair.address);
  }

  getBalance = async (address: string, symbol = 'ICP') => {
    await _getBalance(address, symbol);
  };

  getTransactions = async (address: string, symbol = 'ICP') => {
    await _getTransactions(address, symbol);
  };
 
  createAccounts = async (symbols: string[]) => {
    let newAccounts = [];

    for (const symbol of symbols) {
      const keypair = await createWallet(
        'open jelly jeans corn ketchup supreme brief element armed lens vault weather original scissors rug priority vicious lesson raven spot gossip powder person volcano',
        symbol
      );
      newAccounts.push({ id: keypair.address, ...keypair });
    }
    store.dispatch(updateActiveAccount(newAccounts[0]));
    store.dispatch(updateAccounts(newAccounts));
  };
}
