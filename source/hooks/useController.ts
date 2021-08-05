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

export function useCreateAccount(mnemonic: string, symbol: string) {
  const controller = useController();

  return controller.accounts.createAccount(mnemonic, symbol);
}
