import { EarthProvider } from '~scripts/Provider/EarthProvider';
import type { IAccountsController } from '../types/IAccountsController';
import type { IAssetsController } from '../types/IAssetsController';
import { IDAppController } from '../types/IDAppController';
import AccountsController from './AccountsController';
import AssetsController from './AssetsController';
import DAppController from './DAppController';
import store from '~state/store';
import { preloadStateAsync } from '~state/app';
export default class MainController {
  accounts: Readonly<IAccountsController>;
  assets: Readonly<IAssetsController>;
  dapp: Readonly<IDAppController>;
  provider: Readonly<EarthProvider>;

  constructor() {
    this.accounts = Object.freeze(new AccountsController());
    this.assets = Object.freeze(new AssetsController());
    this.dapp = Object.freeze(new DAppController());
    this.provider = Object.freeze(new EarthProvider());
  }

  async preloadState() {
    await store.dispatch(preloadStateAsync() as any);
  }

  async accountsInfo() {
    this.accounts.createAccounts(this.assets.usedAssetSymbols());
  }
}
