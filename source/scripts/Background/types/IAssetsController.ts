export interface IAssetsController {
  fetchFiatPrice: (currency?: string) => void;
  fetchFiatPrices: (symbols: keyable, currency?: string) => void;
}

export interface keyable {
  [key: string]: any;
}
