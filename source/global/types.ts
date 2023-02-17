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

export const NETWORK_TITLE: { [key: string]: string } = {
  ICP: 'Internet Computer',
  BTC: 'Bitcoin',
  'BTC-T': 'Bitcoin Testnet',
  ETH: 'Ethereum',
  'RNK-T': 'Rinkeby',
  MATIC: 'Polygon',
};

export enum NetworkSymbol {
  ICP = 'ICP',
  Bitcoin = 'BTC',
  BitcoinTestnet = 'BTC-T',
  Ethereum = 'ETH',
  Rinkeby = 'RNK-T',
  Polygon = 'MATIC',
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
  amount: string;
  timestamp: number;
}

export interface ActiveAcccountState {
  id: string;
  address: string;
  label: string;
  balance: string;
  network: string;
  transactions: AccountTransactionState[];
}

export interface WalletAssetDetail {
  id: string;
  network: string;
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
  address?: string;
}

export interface ConnectedDApps {
  [dappId: string]: DAppInfo;
}
