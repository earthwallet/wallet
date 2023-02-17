import {
  createWallet,
  newMnemonic,
  send,
} from '@earthwallet/keyring';
import store from '~state/store';
import {
  updateNewMnemonic,
  updateError,
  updateLoading,
  updateActiveNetwork,
  updateRestoreInActiveAccounts_ETH,
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
import { getInfoBySymbol, GROUP_ID_SYMBOL } from '~global/constant';
import Secp256k1KeyIdentity from '@earthwallet/keyring/build/main/util/icp/secpk256k1/identity';
import { principal_to_address } from '@earthwallet/assets';
import {
  getBalance_ETH,
  getBalanceMatic,
  transferERC721,
  transferERC20,
} from '~utils/services';
import { NetworkSymbol, NETWORK_TITLE } from '~global/types';
import { createAlchemyWeb3 } from '@alch/alchemy-web3';
import { ethers } from 'ethers';
import { ETH_MAINNET_ALCHEMY_URL, POLY_ALCHEMY_URL } from '~global/config';
import {
  broadcastTxn_BTC_DOGE,
  createTransaction_BTC_DOGE,
  getAllUnspentTransactions,
  getBalance_BTC_DOGE,
} from '~utils/btc';

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

  sendETH = async (
    selectedRecp: string,
    selectedAmount: number,
    mnemonic: string,
    feesArr: keyable,
    feesOptionSelected: number,
    symbol: string
  ) => {
    const wallet_tx = await createWallet(mnemonic, 'ETH');

    const web3 = createAlchemyWeb3(
      symbol == 'ETH' ? ETH_MAINNET_ALCHEMY_URL : POLY_ALCHEMY_URL
    );
    const privateKey = ethers.Wallet.fromMnemonic(mnemonic).privateKey;
    const nonce = await web3.eth.getTransactionCount(
      wallet_tx.address,
      'latest'
    );

    const transaction = {
      nonce: nonce,
      from: wallet_tx.address,
      to: selectedRecp,
      value: web3.utils.toWei(selectedAmount.toString(), 'ether'),
    };
    const estimateGas = '21000';

    const signedTx: keyable = await web3.eth.accounts.signTransaction(
      {
        gas: estimateGas,
        maxPriorityFeePerGas: web3.utils.toWei(
          feesArr[feesOptionSelected]?.suggestedMaxPriorityFeePerGas,
          'gwei'
        ),
        maxFeePerGas: web3.utils.toWei(
          feesArr[feesOptionSelected]?.suggestedMaxFeePerGas,
          'gwei'
        ),
        ...transaction,
      },
      privateKey
    );
    const hash: string = await new Promise(async (resolve) => {
      await web3.eth
        .sendSignedTransaction(signedTx?.rawTransaction)
        .once('transactionHash', (hash) => {
          resolve(hash);
        });
      console.log("We've finished");
    });
    return hash;
  };

  sendERC721_ETH = async (
    selectedRecp: string,
    fromAddress: string,
    mnemonic: string,
    selectedAssetObj: keyable,
    feesArr: keyable,
    feesOptionSelected: number,
    symbol: string
  ) => {
    const resp = await transferERC721(
      selectedAssetObj?.contractAddress,
      selectedRecp,
      fromAddress,
      selectedAssetObj?.tokenID,
      mnemonic,
      symbol,
      feesArr[feesOptionSelected]?.suggestedMaxPriorityFeePerGas,
      feesArr[feesOptionSelected]?.suggestedMaxFeePerGas
    );

    return resp.hash;
  };

  sendERC20_ETH = async (
    selectedRecp: string,
    selectedAmount: number,
    mnemonic: string,
    selectedAssetObj: keyable,
    feesArr: keyable,
    feesOptionSelected: number,
    symbol: string
  ) => {
    const resp = await transferERC20(
      selectedAssetObj?.contractAddress,
      selectedRecp,
      selectedAmount.toString(),
      mnemonic,
      symbol,
      feesArr[feesOptionSelected]?.suggestedMaxPriorityFeePerGas,
      feesArr[feesOptionSelected]?.suggestedMaxFeePerGas,
      selectedAssetObj?.decimals
    );

    return resp.hash;
  };

  send_BTC_DOGE = async (
    selectedRecp: string,
    selectedAmount: number,
    mnemonic: string,
    address: string,
    symbol: string,
    feeRate: number
  ) => {
    
    const utxos = await getAllUnspentTransactions(address, symbol);
    const resp = await createTransaction_BTC_DOGE(
      mnemonic,
      selectedRecp,
      address,
      typeof selectedAmount == 'number'
        ? selectedAmount?.toString()
        : selectedAmount,
      feeRate,
      utxos,
      symbol
    );
    if (resp?.error) {
      throw resp?.errorMessage;
    } else if (resp?.txHex == undefined) {
      throw { error: true };
    }
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

    const respBroad: any = await broadcastTxn_BTC_DOGE(resp?.txHex, symbol);

    if (respBroad?.error) {
      throw respBroad?.errorMessage;
    }
    return respBroad?.hash;
  };
  getBalancesOfAccount = async (account: keyable) => {
    const fetchBalance = async (account: keyable) => {
      store.dispatch(
        storeEntities({
          entity: 'balances',
          data: [
            {
              id: account.id,
              symbol: account.symbol,
              loading: true,
            },
          ],
        })
      );
      let balance: keyable = {};
      if (account.symbol == 'ETH') {
        const value = await getBalance_ETH(account.address);
        balance = { currency: { decimals: 18, symbol: 'ETH' }, value: value };
      } else if (account.symbol == 'MATIC') {
        const value = await getBalanceMatic(account.address);
        balance = { currency: { decimals: 18, symbol: 'MATIC' }, value: value };
      } else if (account.symbol == 'BTC' || account.symbol == 'DOGE') {
        const resp = await getBalance_BTC_DOGE(account.address, account.symbol);
        balance = { ...resp };
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
      return { ...balance, ...{ id: account.id, symbol: account.symbol } };
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
        if (decimals == undefined) {
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
        }
      }
    }
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
      const symbolInfo = getInfoBySymbol(symbol);
      const keypair = await createWallet(mnemonic, symbol);
      let data = {
        id: symbolInfo?.evmChain
          ? symbol + ':' + keypair.address
          : keypair.address,
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
    store.dispatch(updateNewMnemonic(''));
    callback && callback(groupId);
  };

  updateActiveNetwork = (symbol: NetworkSymbol) => {
    store.dispatch(
      updateActiveNetwork({ symbol, title: NETWORK_TITLE[symbol] })
    );
  };

  restoreOnceInactiveAccountsActive_ETH = async () => {
    //once restores previously inactive eth pregenerated addresses as active
    const state = store.getState();
    const currentWalletRestoreETHStatus =
      state.wallet.restoreInActiveAccounts_ETH;
    if (!currentWalletRestoreETHStatus) {
      const existingInactiveETHAccounts = Object.keys(
        state.entities.accounts.byId
      )
        .map((id) => state.entities.accounts.byId[id])
        .filter(
          (account) => account.active == false && account.symbol == 'ETH'
        );
      if (existingInactiveETHAccounts?.length != 0) {
        existingInactiveETHAccounts.map((account) => {
          store.dispatch(
            updateEntities({
              entity: 'accounts',
              key: account.id,
              data: {
                active: true,
              },
            })
          );
        });

        store.dispatch(updateRestoreInActiveAccounts_ETH(true));
        return;
      }
    }
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
      if (getInfoBySymbol(symbol).evmChain) {
        const selectedETHAccount = existingAllAccounts.filter(
          (a) => a.symbol === 'ETH'
        )[0];

        //https://en.bitcoin.it/wiki/BIP_0021
        // BIP_0021 uri format example MATIC:xyzzyxxxxxx
        const address_uri = symbol + ':' + selectedETHAccount.id;
        store.dispatch(
          updateEntities({
            entity: 'accounts',
            key: address_uri,
            data: {
              ...selectedETHAccount,
              ...{
                id: address_uri,
                active: status,
                symbol,
                evmChain: true,
                order: getInfoBySymbol(symbol).order,
              },
            },
          })
        );
        forwardAddress = address_uri;
      } else {
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
    }
    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
    await delay(500);

    callback && callback(forwardAddress);
  };
}
