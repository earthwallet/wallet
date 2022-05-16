import {
  createWallet,
  newMnemonic,
  send,
  transfer,
} from '@earthwallet/keyring';
import store from '~state/store';
import {
  updateActiveAccount,
  updateNewMnemonic,
  updateError,
  updateLoading,
} from '~state/wallet';
import type { IAccountsController } from '../types/IAccountsController';
import { createEntity, storeEntities, updateEntities } from '~state/entities';
import {
  getBalance as _getBalance,
  getTransactions as _getTransactions,
  send as _send,
} from '@earthwallet/keyring';
import { encryptString } from '~utils/vault';
import { getSymbol } from '~utils/common';
import { GROUP_ID_SYMBOL } from '~global/constant';
import Secp256k1KeyIdentity from '@earthwallet/keyring/build/main/util/icp/secpk256k1/identity';
import { principal_to_address } from '@earthwallet/assets';
import { getBalanceETH } from '~utils/services';

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

  sendICP = async (
    identityJSON: string,
    selectedRecp: string,
    selectedAmount: number
  ) => {
    const state = store.getState();
    const currentIdentity = Secp256k1KeyIdentity.fromJSON(identityJSON);
    const address = principal_to_address(currentIdentity.getPrincipal());

    if (state.entities.recents == null) {
      store.dispatch(createEntity({ entity: 'recents' }));
    }
    store.dispatch(
      updateEntities({
        entity: 'recents',
        key: selectedRecp,
        data: {
          symbol: 'ICP',
          addressType: 'accountId',
          lastSentAt: new Date().getTime(),
          sentBy: address,
        },
      })
    );

    const index: BigInt = await send(
      currentIdentity,
      selectedRecp,
      address,
      selectedAmount,
      'ICP'
    );

    return index;
  };

  sendBTC = async (
    selectedRecp: string,
    selectedAmount: number,
    mnemonic: string,
    address: string
  ) => {
    const state = store.getState();

    if (state.entities.recents == null) {
      store.dispatch(createEntity({ entity: 'recents' }));
    }

    store.dispatch(
      updateEntities({
        entity: 'recents',
        key: selectedRecp,
        data: {
          symbol: 'BTC',
          lastSentAt: new Date().getTime(),
          sentBy: address,
        },
      })
    );

    const hash: any = await transfer(
      selectedRecp,
      selectedAmount.toString(),
      mnemonic,
      'BTC',
      { network: 'mainnet' }
    );
    return hash;
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
      let balance: keyable = {};
      if (account.symbol == 'ETH') {
        const value = await getBalanceETH(account.address);
        balance = { currency: { decimals: 18, symbol: 'ETH' }, value: value };
      } else {
        balance = await _getBalance(
          account.address,
          account.symbol === 'ICP_Ed25519' ? 'ICP' : account.symbol
        );
      }

      if (account.symbol === 'ICP' || account.symbol === 'ICP_Ed25519') {
        balance.value = balance?.balances[0]?.value;
        balance.currency = balance?.balances[0]?.currency;
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
              value: 0,
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
        if (decimals === undefined) {
          total = 0;
          store.dispatch(
            updateEntities({
              entity: 'balances',
              key: account.id,
              data: {
                balanceInUSD: 0,
                usd_24h_change: 0,
              },
            })
          );
        } else {
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
        }
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
    selectedSymbols?: string[],
    callback?: (address: string) => void
  ) => {
    let newAccounts = [];
    let index = 0;
    const groupId = (await createWallet(mnemonic, GROUP_ID_SYMBOL)).address;
    for (const symbol of symbols) {
      const keypair = await createWallet(mnemonic, symbol);
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
        order: index,
        active: index === 0 || selectedSymbols?.includes(symbol),
      };
      if (symbol === 'ICP') {
        data.meta.principalId = keypair.identity.getPrincipal().toText();
        data.vault.encryptedJson = encryptString(
          JSON.stringify(keypair.identity.toJSON()),
          password
        );
        data.identity = encryptString(
          JSON.stringify(keypair.identity.toJSON()),
          password
        );
      }
      newAccounts.push(data);
      index++;
    }
    store.dispatch(
      storeEntities({
        entity: 'accounts',
        data: newAccounts,
      })
    );
    //clear new mnemonic
    store.dispatch(updateNewMnemonic(''));
    callback && callback(groupId);
  };

  updateActiveAccountsOfGroup = async (
    groupId: string,
    symbols: string[],
    status: boolean,
    callback?: (address?: string) => void
  ) => {
    const state = store.getState();

    const existingAllAccounts = Object.keys(state.entities.accounts.byId)
      .map((id) => state.entities.accounts.byId[id])
      .filter((account) => account.groupId === groupId)
      .sort((a, b) => a.order - b.order);

    let forwardAddress = '';
    for (const symbol of symbols) {
      if (symbol !== 'ICP') {
        const selectedAccount = existingAllAccounts.filter(
          (a) => a.symbol === symbol
        )[0];
        forwardAddress = selectedAccount.id;
        store.dispatch(
          updateEntities({
            entity: 'accounts',
            key: selectedAccount.id,
            data: {
              active: status,
            },
          })
        );
      }
    }

    callback && callback(forwardAddress);
  };
}
