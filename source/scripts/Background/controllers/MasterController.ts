import { IAccountsController } from '../types/IAccountsController';
import { IAssetsController } from '../types/IAssetsController';
import AccountsController from './AccountsController';
import AssetsController from './AssetsController';

export default class MasterController {
  accounts: Readonly<IAccountsController>;
  assets: Readonly<IAssetsController>;

  constructor() {
    this.accounts = Object.freeze(new AccountsController());
    this.assets = Object.freeze(new AssetsController());
  }
}
