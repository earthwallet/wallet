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
  createNewMnemonic: () => Promise<void>;
  sendICP: (
    identityJSON: string,
    selectedRecp: string,
    selectedAmount: number
  ) => Promise<BigInt>;

  send_BTC_DOGE: (
    selectedRecp: string,
    selectedAmount: number,
    mnemonic: string,
    address: string,
    symbol: string,
    feeRate: number
  ) => Promise<any>;
  sendETH: (
    selectedRecp: string,
    selectedAmount: number,
    mnemonic: string,
    feesArr: keyable,
    feesOptionSelected: number,
    symbol: string
  ) => Promise<any>;
  sendERC721_ETH: (
    selectedRecp: string,
    fromAddress: string,
    mnemonic: string,
    selectedAssetObj: keyable,
    feesArr: keyable,
    feesOptionSelected: number,
    symbol: string
  ) => Promise<any>;
  sendERC20_ETH: (
    selectedRecp: string,
    selectedAmount: number,
    mnemonic: string,
    selectedAssetObj: keyable,
    feesArr: keyable,
    feesOptionSelected: number,
    symbol: string
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
