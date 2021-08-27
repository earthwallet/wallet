import { WalletAssets } from '~global/types';

export interface IAssetState {
  assetList: WalletAssets;
  activeAssetId: string | null;
  fetchingPrices: boolean;
}
