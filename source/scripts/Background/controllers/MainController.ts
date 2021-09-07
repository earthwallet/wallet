import { browser } from 'webextension-polyfill-ts';
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
    //this.accounts.createAccounts(this.assets.usedAssetSymbols());
  }

  async createPopup(windowId: string) {
    const _window = await browser.windows.getCurrent();
    if (!_window || !_window.width) return null;

    return await browser.windows.create({
      url: `/dapp.html#${windowId}`,
      width: 375,
      height: 600,
      type: 'popup',
      top: 0,
      left: _window.width - 375,
    });
  }
}
