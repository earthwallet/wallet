export interface IAccountsController {
  createAccounts: (
    mnemonic: string,
    symbols: string[],
    name: string,
    password: string,
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
}
