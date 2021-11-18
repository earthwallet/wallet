import { v4 as uuid } from 'uuid';
import { browser, Runtime } from 'webextension-polyfill-ts';
import { parseObjWithOutBigInt } from '~global/helpers';
import { IMainController } from '../types/IMainController';

type Message = {
  id: string;
  type: string;
  data: { asset: string; method: string; args: any[] };
};

export const messagesHandler = (
  port: Runtime.Port,
  mainController: IMainController
) => {
  let pendingWindow = false;

  const listener = async (message: Message, connection: Runtime.Port) => {
    try {
      const response = await listenerHandler(message, connection);

      if (response) {
        const { id, result } = response;
        port.postMessage({ id, data: { result } });
      }
    } catch (e: any) {
      //console.log('messagesHandler.ERROR', e.type, e.message, e.detail);
      //console.log(JSON.stringify(e, null, 2));
      port.postMessage({ id: e.type, data: { error: e.detail } });
    }
  };

  const listenerHandler = async (
    message: Message,
    connection: Runtime.Port
  ) => {
    if (browser.runtime.lastError) return Promise.reject('Runtime Last Error');

    if (!mainController.isHydrated()) {
      //hydrate app if not hydrated
      await mainController.preloadState();
    }

    const sendError = (error: string) => {
      return Promise.reject(new CustomEvent(message.id, { detail: error }));
    };

    const url = connection.sender?.url as string;
    const title = connection.sender?.tab?.title as string;
    const origin = url && new URL(url as string).origin;

    const allowed = mainController.dapp.fromPageConnectDApp(origin, title);

    if (message.type === 'EARTH_EVENT_MESSAGE') {
      if (message.data && message.data.method) {
        //
      }
    } else if (message.type === 'CONNECT_REQUEST') {
      if (origin && allowed) {
        return Promise.resolve({ id: message.id, result: origin && allowed });
      }

      if (pendingWindow) {
        return Promise.resolve(null);
      }
      const windowId = uuid();
      const popup = await mainController.createPopup(windowId);
      pendingWindow = true;

      console.log(popup, 'popup', pendingWindow);
      if (popup) {
        window.addEventListener(
          'connectWallet',
          (ev: any) => {
            //console.log('Connect window addEventListener', ev.detail);
            if (ev.detail.substring(1) === windowId) {
              port.postMessage({ id: message.id, data: { result: true } });
              pendingWindow = false;
            }
          },
          { once: true, passive: true }
        );

        browser.windows.onRemoved.addListener((id) => {
          if (id === popup.id) {
            port.postMessage({ id: message.id, data: { result: false } });
            //console.log('Connect window is closed');
            pendingWindow = false;
          }
        });
        return Promise.resolve(null);
      }
      return Promise.resolve({ id: message.id, result: origin && allowed });
    } else if (message.type === 'CAL_REQUEST') {
      const { method, args } = message.data;
      console.log('CAL_REQUEST.method', method, args);
      let result: any = undefined;
      if (method === 'wallet.isConnected') {
        result = { connected: !!allowed };
      } else if (method === 'wallet.getAddress') {
        result = mainController.provider.getAddressForDapp(origin);
      } else if (method === 'wallet.getNetwork') {
        result = mainController.provider.getNetwork();
      } else if (method === 'wallet.getBalance') {
        result = mainController.provider.getBalance();
      } else if (method === 'wallet.getAddressMeta') {
        result = mainController.provider.getAddressMeta(origin);
      } else if (
        method === 'wallet.sign' ||
        method === 'wallet.signRaw'
      ) {
        if (pendingWindow) {
          return Promise.resolve(null);
        }

        const signatureRequest =
          method === 'wallet.signRaw'
            ? { message: args[0], type: 'signRaw' }
            : args[0];
        const windowId = uuid();
        mainController.dapp.setSignatureRequest(signatureRequest, windowId);
        const popup = await mainController.createPopup(windowId, 'sign');
        pendingWindow = true;
        window.addEventListener(
          'signApproval',
          async (ev: any) => {
            if (ev.detail.substring(1) === windowId) {
              //https://forum.dfinity.org/t/mismatching-dfinity-agent-versions-can-cause-hashing-issues/7359/5
              const approvedIdentityJSON =
                mainController.dapp.getApprovedIdentityJSON();
              if (method === 'wallet.signRaw') {
                result = await mainController.provider.signRaw(
                  signatureRequest,
                  approvedIdentityJSON,
                  windowId
                );
              } else {
                result = await mainController.provider.sign(
                  signatureRequest,
                  approvedIdentityJSON,
                  windowId
                );
              }

              const parsedResult = parseObjWithOutBigInt(result);
              port.postMessage({
                id: message.id,
                data: { result: parsedResult },
              });
              pendingWindow = false;
            }
          },
          {
            once: true,
            passive: true,
          }
        );

        browser.windows.onRemoved.addListener((id) => {
          if (popup && id === popup.id) {
            port.postMessage({
              id: message.id,
              data: { result: 'USER_REJECTED' },
            });
            pendingWindow = false;
          }
        });

        return Promise.resolve(null);
      }

      if (result !== undefined) {
        return Promise.resolve({ id: message.id, result });
      }

      return sendError('Unknown request');
    } else {
      return Promise.resolve({
        id: message.id,
        result: 'Content script',
      });
    }

    return Promise.resolve(null);
  };

  port.onMessage.addListener(listener);
};
