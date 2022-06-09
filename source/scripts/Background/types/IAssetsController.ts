export interface IAssetsController {
  fetchFiatPrices: (symbols: keyable, currency?: string) => Promise<void>;
  fetchListingsByUser: (
    address: string,
    collectionId?: string
  ) => Promise<void>;
  getAssetsOfAccountsGroup: (accounts: keyable[][]) => Promise<void>;
  updateTokenCollectionDetails: (asset: keyable) => Promise<void>;
  registerExtensionForAirdrop: () => Promise<void>;
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
    asset: keyable,
    price: number,
    address: string,
    callback?: (path: string) => void
  ) => Promise<void>;
  transferEarthArt: (
    identityJSON: string,
    collectionId: string,
    recipient: string,
    amount: number,
    address: string,
    callback?: (path: string) => void
  ) => Promise<void>;
  updateETHAssetInfo: (asset: keyable) => Promise<void>;
}

export interface keyable {
  [key: string]: any;
}
