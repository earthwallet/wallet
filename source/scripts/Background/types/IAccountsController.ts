import { EarthKeyringPair } from '@earthwallet/keyring';

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
  getBalancesOfAccountsGroup: (accounts: keyable[][]) => Promise<void>;
  getBalancesOfAccount: (account: keyable) => Promise<void>;
  getTotalBalanceOfAccountGroup: (accounts: keyable[][]) => void;
  migrateExistingICP: (
    mnemonic: string
  ) => Promise<{
    keypair: EarthKeyringPair;
    balance: keyable;
    keypairNew: EarthKeyringPair;
  }>;
}
