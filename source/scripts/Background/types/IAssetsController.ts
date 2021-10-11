export interface IAssetsController {
  fetchFiatPrice: (currency?: string) => Promise<void>;
  fetchFiatPrices: (symbols: keyable, currency?: string) => Promise<void>;
  getAssetsOfAccountsGroup: (accounts: keyable[][]) => Promise<void>;
  updateTokenCollectionDetails: (asset: keyable) => Promise<void>;
  getICPAssetsOfAccount: ({
    address,
    symbol,
  }: {
    address: string;
    symbol: string;
  }) => Promise<void>;
  updateTokenDetails: ({
    id,
    address,
  }: {
    id: string;
    address: string;
  }) => Promise<void>;
}

export interface keyable {
  [key: string]: any;
}
