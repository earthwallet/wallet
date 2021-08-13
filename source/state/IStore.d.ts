import { IAppState } from './app/types';
import { IWalletState } from './wallet/types';
import { IEntityState } from './entities/types';

export interface StoreInterface {
  app: IAppState;
  wallet: IWalletState;
  entities: IEntityState;
}
