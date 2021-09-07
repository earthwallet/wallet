import { Windows } from 'webextension-polyfill-ts';
import { EarthProvider } from '~scripts/Provider/EarthProvider';
import { IAccountsController } from './IAccountsController';
import { IAssetsController } from './IAssetsController';
import { IDAppController } from './IDAppController';

export interface IMainController {
  accounts: Readonly<IAccountsController>;
  assets: Readonly<IAssetsController>;
  dapp: Readonly<IDAppController>;
  provider: Readonly<EarthProvider>;
  preloadState: () => Promise<void>;
  accountsInfo: () => Promise<void>;
  createPopup: (windowId: string) => Promise<Windows.Window | null>;
}
