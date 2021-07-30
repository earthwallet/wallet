import { AppStateProps } from './app/types';
import { WalletStateProps } from './wallet/types';

export interface StoreInterface {
  app: AppStateProps;
  wallet: WalletStateProps;
}
