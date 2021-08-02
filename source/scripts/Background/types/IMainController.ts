import { IAccountsController } from './IAccountsController';
import { IAssetsController } from './IAssetsController';

export interface IMainController {
  accounts: Readonly<IAccountsController>;
  assets: Readonly<IAssetsController>;
  accountsInfo: () => Promise<void>;
}
