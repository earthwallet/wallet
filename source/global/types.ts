export enum ChainId {
  Mainnet = 1,
  Ropsten = 3,
  Rinkeby = 4,
  Goerli = 5,
  Kovan = 42,
  BSC = 56,
  xDai = 100,
  Polygon = 137,
  Mumbai = 80001,
  Harmony = 1666600000,
}

export enum NetworkType {
  ICP = 'Internet Computer',
  Bitcoin = 'Bitcoin',
  BitcoinTestnet = 'Bitcoin Testnet',
  Ethereum = 'Ethereum',
  Rinkeby = 'Rinkeby',
}

export enum WalletType {
  StandardWallet = 'SW',
  HardwareWallet = 'HW',
}

export interface WalletAccountState {
  id: string;
  label: string;
  type: WalletType;
}

export interface WalletAccounts {
  [id: string]: WalletAccountState;
}

export interface AccountTransactionState {
  // TODO: Need to declare more properties
  amount: string;
  timestamp: number;
}

export interface ActiveAcccountState {
  id: string;
  address: string;
  label: string;
  balance: string;
  network: NetworkType;
  transactions: AccountTransactionState[];
}

export interface WalletAssetDetail {
  id: string;
  network: NetworkType;
  label: string;
  symbol: string;
  decimals: number;
  price?: number;
  priceChange?: number;
  logo?: string;
  address?: string | null;
}

export interface WalletAssets {
  [id: string]: WalletAssetDetail;
}

export interface WalletDappState {
  id: string;
  origin: string;
  logo: string;
  title: string;
}

export interface WalletDapps {
  [id: string]: WalletDappState; // array of connected account ids
}

export interface AssetPriceInfo {
  id: string;
  price: number;
  priceChange: number;
}

export interface DAppInfo {
  origin: string;
  logo: string;
  title: string;
}

export interface ConnectedDApps {
  [dappId: string]: DAppInfo;
}
