export interface IAssetsController {
  fetchFiatPrice: (currency?: string) => Promise<void>;
  fetchFiatPrices: (symbols: keyable, currency?: string) => Promise<void>;
  getAssetsOfAccountsGroup: (accounts: keyable[][]) => Promise<void>;
  updateTokenCollectionDetails: (asset: keyable) => Promise<void>;
  getCollectionStats: () => Promise<void>;
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
    price,
  }: {
    id: string;
    address: string;
    price?: number;
  }) => Promise<void>;
  buyNft: (
    txnId: string,
    identityJSON: string,
    nftId: string,
    price: number,
    address: string,
    callback?: (path: string) => void
  ) => Promise<void>;
}

export interface keyable {
  [key: string]: any;
}
