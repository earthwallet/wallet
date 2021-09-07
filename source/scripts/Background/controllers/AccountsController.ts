import { createWallet, newMnemonic } from '@earthwallet/keyring';
import store from '~state/store';
import {
  updateActiveAccount,
  updateNewMnemonic,
  updateError,
  updateLoading,
} from '~state/wallet';
import type { IAccountsController } from '../types/IAccountsController';
import { storeEntities, updateEntities } from '~state/entities';
import {
  getBalance as _getBalance,
  getTransactions as _getTransactions,
  send as _send,
} from '@earthwallet/keyring';
import { encryptString } from '~utils/vault';
import { getSymbol } from '~utils/common';

interface keyable {
  [key: string]: any;
}

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
    const balance = await _getBalance(address, symbol);
    return balance;
  };

  migrateExistingICP = async (mnemonic: string) => {
    const keypair = await createWallet(mnemonic.trim(), 'ICP', 0, {
      type: 'Ed25519',
    });
    const keypairNew = await createWallet(mnemonic.trim(), 'ICP');
    const balance = await this.getBalance(keypair.address);
    return { keypair, balance, keypairNew };
  };

  getBalancesOfAccount = async (account: keyable) => {
    const fetchBalance = async (account: keyable) => {
      store.dispatch(
        storeEntities({
          entity: 'balances',
          data: [
            {
              id: account.address,
              symbol: account.symbol,
              loading: true,
            },
          ],
        })
      );

      let balance: keyable = await _getBalance(account.address, account.symbol);
      if (account.symbol === 'ICP') {
        balance.value = balance?.balances[0]?.value;
        balance.currency = balance?.balances[0].currency;
      }
      return { ...balance, ...{ id: account.address, symbol: account.symbol } };
    };
    try {
      let balance: keyable = await fetchBalance(account);
      balance.error = false;
      balance.loading = false;

      store.dispatch(
        storeEntities({
          entity: 'balances',
          data: [balance],
        })
      );
    } catch (error) {
      store.dispatch(
        storeEntities({
          entity: 'balances',
          data: [
            {
              id: account.address,
              symbol: account.symbol,
              error: true,
              loading: false,
              errorData: JSON.stringify(error),
            },
          ],
        })
      );
    }
  };

  getBalancesOfAccountsGroup = async (accountsGroup: keyable[][]) => {
    for (const accounts of accountsGroup) {
      for (const account of accounts) {
        await this.getBalancesOfAccount(account);
      }
    }
  };

  getTotalBalanceOfAccountGroup = (accountsGroup: keyable[][]) => {
    const state = store.getState();
    for (const accounts of accountsGroup) {
      let addresses = accounts.length;
      let total = 0;
      for (const account of accounts) {
        let currentBalance = state.entities.balances.byId[account.id];
        const decimals = currentBalance?.currency?.decimals;
        const currentUSDValue: keyable =
          state.entities.prices.byId[
            getSymbol(account?.symbol)?.coinGeckoId || ''
          ];
        const usdValue =
          (currentBalance?.value / Math.pow(10, decimals)) *
          parseFloat(currentUSDValue?.usd);
        total = total + usdValue;
        store.dispatch(
          updateEntities({
            entity: 'balances',
            key: account.id,
            data: {
              balanceInUSD: usdValue,
              usd_24h_change: currentUSDValue.usd_24h_change,
            },
          })
        );
        if (!--addresses) {
          store.dispatch(
            storeEntities({
              entity: 'groupbalances',
              data: [{ balanceInUSD: total, id: account.groupId }],
            })
          );
          // do your thing
        }
      }
    }
  };

  getTransactions = async (address: string, symbol = 'ICP') => {
    await _getTransactions(address, symbol);
  };

  createOrUpdateAccounts = async (
    mnemonic: string,
    symbols: string[],
    name: string,
    password: string,
    callback?: (address: string) => void
  ) => {
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
          principalId: null,
        },
        vault: {
          encryptedMnemonic: encryptString(mnemonic, password),
          encryptedJson: '',
          encryptionType: 'AES',
        },
        symbol,
      };
      if (symbol === 'ICP') {
        data.meta.principalId = keypair.identity.getPrincipal().toText();
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
