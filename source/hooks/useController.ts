import { browser } from 'webextension-polyfill-ts';

export function useController() {
  return browser.extension.getBackgroundPage().controller;
}

export function useFetchAssetPrice() {
  const controller = useController();

  return controller.assets.fetchFiatPrice();
}
