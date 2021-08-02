import { EarthKeyringPair } from '@earthwallet/sdk';
import {
  ActiveAcccountState,
  NetworkType,
  // WalletAccounts,
} from '~global/types';

export interface IWalletState {
  // accounts: WalletAccounts;
  accounts: EarthKeyringPair[];
  activeAccount: ActiveAcccountState | null;
  activeNetwork: NetworkType;
}
