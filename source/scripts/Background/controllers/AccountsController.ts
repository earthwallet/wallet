import { createWallet } from '@earthwallet/sdk';
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

  async createAccounts(symbols: string[]) {
    let newAccounts = [];

    for (const symbol of symbols) {
      const keypair = await createWallet(
        'open jelly jeans corn ketchup supreme brief element armed lens vault weather original scissors rug priority vicious lesson raven spot gossip powder person volcano',
        symbol
      );
      newAccounts.push(keypair);
    }

    return newAccounts;
  }
}
