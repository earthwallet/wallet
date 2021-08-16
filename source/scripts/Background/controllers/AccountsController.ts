import { createWallet, newMnemonic } from '@earthwallet/keyring';
import store from '~state/store';
import {
  updateActiveAccount,
  updateNewMnemonic,
  updateError,
  updateLoading,
} from '~state/wallet';
import type { IAccountsController } from '../types/IAccountsController';
import { storeEntities } from '~state/entities';
import {
  getBalance as _getBalance,
  getTransactions as _getTransactions,
  send as _send,
} from '@earthwallet/keyring';
import { encryptString } from '~utils/vault';

export default class AccountsController implements IAccountsController {
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
              encryptionType: 'AES',
            },
            symbol,
            id: keypair.address,
          },
        ],
      })
    );
    //clear new mnemonic
    store.dispatch(updateNewMnemonic(''));
    callback && callback(keypair.address);
  }

  getBalance = async (address: string, symbol = 'ICP') => {
    await _getBalance(address, symbol);
  };

  getTransactions = async (address: string, symbol = 'ICP') => {
    await _getTransactions(address, symbol);
  };

  createAccounts = async (
    mnemonic: string,
    symbols: string[],
    name: string,
    password: string,
    callback?: (address: string) => void
  ) => {
    console.log(mnemonic, symbols, name, password, 'createAccounts');

    let newAccounts = [];
    let groupId = '';
    for (const symbol of symbols) {
      const keypair = await createWallet(mnemonic, symbol);
      if (symbol === symbols[0]) {
        groupId = keypair.address;
      }

      let data = {
        id: keypair.address,
        groupId,
        ...keypair,
        meta: {
          name,
          createdAt: Math.round(new Date().getTime() / 1000),
          publicKey: keypair.publicKey,
          type: keypair.type,
        },
        vault: {
          encryptedMnemonic: encryptString(mnemonic, password),
          encryptedJson: '',
          encryptionType: 'AES',
        },
        symbol,
      };
      if (symbol === 'ICP') {
        data.vault.encryptedJson = encryptString(
          JSON.stringify(keypair.identity.toJSON()),
          password
        );
      }
      newAccounts.push(data);
    }
    store.dispatch(
      storeEntities({
        entity: 'accounts',
        data: newAccounts,
      })
    );
    //clear new mnemonic
    store.dispatch(updateNewMnemonic(''));
    callback && callback(newAccounts[0]?.id);
  };
}
