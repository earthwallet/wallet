import { browser } from 'webextension-polyfill-ts';

export function useController() {
  return browser.extension.getBackgroundPage().controller;
}

export function useFetchAssetPrice() {
  const controller = useController();

  return controller.assets.fetchFiatPrice();
}

export function useNewMnemonic() {
  const controller = useController();

  return controller.accounts.createNewMnemonic();
}
