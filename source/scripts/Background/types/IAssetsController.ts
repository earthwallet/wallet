export interface IAssetsController {
  fetchFiatPrice: (currency?: string) => void;
  usedAssetSymbols: () => string[];
}
