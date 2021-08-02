export interface IAccountsController {
  checkPassword: (pwd: string) => void;
  unlock: (pwd: string) => void;
  lock: (pwd: string) => void;
  createAccounts: (symbols: string[]) => Promise<void>;
}
