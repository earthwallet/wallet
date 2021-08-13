import type { EarthKeyringPair } from '@earthwallet/sdk';
import type {
  NetworkType,
  // WalletAccounts,
} from '~global/types';

export interface IWalletState {
  // accounts: WalletAccounts;
  accounts: EarthKeyringPair[];
  activeAccount: EarthKeyringPair | null;
  activeNetwork: NetworkType;
  newMnemonic: string;
  error: string;
  loading: boolean;
}
