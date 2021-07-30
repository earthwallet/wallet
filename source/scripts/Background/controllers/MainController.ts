import { IAccountsController } from '../types/IAccountsController';
import { IAssetsController } from '../types/IAssetsController';
import AccountsController from './AccountsController';
import AssetsController from './AssetsController';

export default class MainController {
  accounts: Readonly<IAccountsController>;
  assets: Readonly<IAssetsController>;

  constructor() {
    this.accounts = Object.freeze(new AccountsController());
    this.assets = Object.freeze(new AssetsController());
  }

  async accountsInfo() {
    return await this.accounts.createAccounts(this.assets.usedAssetSymbols());
  }
}
