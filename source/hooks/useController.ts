import { browser } from 'webextension-polyfill-ts';

export function useController() {
  return browser.extension.getBackgroundPage().controller;
}

export function useNewMnemonic() {
  const controller = useController();

  return controller.accounts.createNewMnemonic();
}

export function useCurrentDapp() {
  const controller = useController();

  return controller.dapp.getCurrent();
}

export function useCurrentDappAddress() {
  const controller = useController();
  return controller.dapp.getCurrentDappAddress();
}

export function useConnectWalletToDApp() {
  const controller = useController();
  const current = controller.dapp.getCurrent();
  const origin = current && current.origin;

  return async () => {
    controller.dapp.fromUserConnectDApp(origin, current);
    const background = await browser.runtime.getBackgroundPage();
    background.dispatchEvent(
      new CustomEvent('connectWallet', { detail: window.location.hash })
    );
  };
}

export function useSignApprove() {
  return async () => {
    const background = await browser.runtime.getBackgroundPage();
    background.dispatchEvent(
      new CustomEvent('signApproval', {
        detail: window.location.hash,
      })
    );
  };
}

export function useEthSignApprove() {
  return async () => {
    const background = await browser.runtime.getBackgroundPage();
    background.dispatchEvent(
      new CustomEvent('signTypedData', {
        detail: window.location.hash,
      })
    );
  };
}

export function useUnsignedApprove() {
  return async () => {
    const background = await browser.runtime.getBackgroundPage();
    background.dispatchEvent(
      new CustomEvent('unsignedApproval', {
        detail: window.location.hash,
      })
    );
  };
}

export function useUpdateActiveAccount(address: string, origin: string) {
  const controller = useController();
  return async () => {
    controller.dapp.setDappConnectedAddress(address, origin);
    const background = await browser.runtime.getBackgroundPage();

    background.dispatchEvent(
      new CustomEvent('setDappConnectedAddress', {
        detail: window.location.hash,
      })
    );
  };
}
