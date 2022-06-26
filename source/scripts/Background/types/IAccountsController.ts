import { EarthKeyringPair } from '@earthwallet/keyring';
import { NetworkSymbol } from '~global/types';

interface keyable {
  [key: string]: any;
}
export interface IAccountsController {
  createOrUpdateAccounts: (
    mnemonic: string,
    symbols: string[],
    name: string,
    password: string,
    selectedSymbols?: string[],
    callback?: (address: string) => void
  ) => Promise<void>;
  createOrUpdateAccount: (
    mnemonic: string,
    symbol: string,
    name: string,
    password: string,
    callback?: (address: string) => void
  ) => Promise<void>;
  createNewMnemonic: () => Promise<void>;
  sendICP: (
    identityJSON: string,
    selectedRecp: string,
    selectedAmount: number
  ) => Promise<BigInt>;
  sendBTC: (
    selectedRecp: string,
    selectedAmount: number,
    mnemonic: string,
    address: string
  ) => Promise<any>;
  sendETH: (
    selectedRecp: string,
    selectedAmount: number,
    mnemonic: string,
    feesArr: keyable,
    feesOptionSelected: number
  ) => Promise<any>;
  sendERC721_ETH: (
    selectedRecp: string,
    fromAddress: string,
    mnemonic: string,
    selectedAssetObj: keyable
  ) => Promise<any>;
  getBalancesOfAccountsGroup: (accounts: keyable[][]) => Promise<void>;
  getBalancesOfAccount: (account: keyable) => Promise<void>;
  getTotalBalanceOfAccountGroup: (accounts: keyable[][]) => void;
  updateActiveNetwork: (symbol: NetworkSymbol) => void;
  migrateExistingICP: (mnemonic: string) => Promise<{
    keypair: EarthKeyringPair;
    balance: keyable;
    keypairNew: EarthKeyringPair;
  }>;
  updateActiveAccountsOfGroup: (
    groupId: string,
    symbols: string[],
    status: boolean,
    callback?: (address?: string) => void
  ) => Promise<void>;
  restoreOnceInactiveAccountsActive_ETH: () => Promise<void>;
}
