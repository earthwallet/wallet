import type { EarthKeyringPair } from '@earthwallet/sdk';
import type {
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
