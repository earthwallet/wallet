export interface IAccountsController {
  checkPassowrd: (pwd: string) => void;
  unlock: (pwd: string) => void;
  lock: (pwd: string) => void;
}
