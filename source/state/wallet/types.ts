import {
  ActiveAcccountState,
  NetworkType,
  WalletAccounts,
} from '~global/types';

export interface IWalletState {
  accounts: WalletAccounts;
  activeAccount: ActiveAcccountState | null;
  activeNetwork: NetworkType;
}
