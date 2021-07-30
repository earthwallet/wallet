import { IAccountsController } from '../types/IAccountsController';

export default class AccountsController implements IAccountsController {
  private password: string;

  constructor() {
    this.password = '';
  }

  checkPassowrd(pwd: string) {
    return this.password === pwd;
  }

  unlock(pwd: string) {
    // TODO: unlock logic should be implemented
    const isValidPassword = true;

    if (isValidPassword) {
      this.password = pwd;
      return true;
    }
    return false;
  }

  lock() {
    this.password = '';
  }
}
