export interface IAccountsController {
  checkPassword: (pwd: string) => void;
  unlock: (pwd: string) => void;
  lock: (pwd: string) => void;
  createAccounts: (symbols: string[]) => Promise<void>;
  createOrUpdateAccount: (
    mnemonic: string,
    symbol: string,
    name: string,
    password: string,
    callback?: (address: string) => void
  ) => Promise<void>;
  createNewMnemonic: () => Promise<void>;
}
