import { IAccountsController } from './IAccountsController';
import { IAssetsController } from './IAssetsController';

export interface IMasterController {
  accounts: Readonly<IAccountsController>;
  assets: Readonly<IAssetsController>;
}
