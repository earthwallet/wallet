import { recoverPersonalSignature } from '@metamask/eth-sig-util';
import { ethers } from 'ethers';
import { v4 as uuid } from 'uuid';
import { browser, Runtime } from 'webextension-polyfill-ts';
import { ALCHEMY_ETH_API_KEY, ETH_GOERLI_TEST_ALCHEMY_URL } from '~global/config';
import { parseObjWithOutBigInt } from '~global/helpers';
import { NetworkSymbol } from '~global/types';
import { IMainController } from '../types/IMainController';

type Message = {
  id: string;
  type: string;
  data: { asset: string; method: string; args: any[] };
};

//https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1193.md
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
    } else if (message.type === 'EARTH_ETH_MESSAGE') {
      console.log(message, 'EARTH_ETH_MESSAGE');
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
      const popup = await mainController.createPopup(
        windowId,
        undefined,
        message.data.asset as NetworkSymbol
      );
      pendingWindow = true;

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
      console.log(method, args, 'messageHandler');
      const params = args[0];
      //console.log('CAL_REQUEST.method', method, args);
      let result: any = undefined;
      if (method === 'wallet.isConnected') {
        result = { connected: !!allowed };
      } else if (method === 'eth_jsonrpc') {
        const provider = new ethers.providers.AlchemyProvider(
          'homestead',
          ALCHEMY_ETH_API_KEY
        );
        result = await provider.send(args[0], args[1]);
        //console.log(method, result, args[0], args[1], 'messageHandler');
      } else if (
        method === 'wallet.signMessage' ||
        method === 'wallet.sendTransaction'
      ) {
        mainController.dapp.setSignatureType(args[0].method);
        const signatureRequest =
          args[0].method == 'person_sign' ||
          args[0].method == 'eth_sendTransaction'
            ? args[0].params[0]
            : args[0].params[1];
        const windowId = uuid();
        mainController.dapp.setSignatureRequest(signatureRequest, windowId);
        const popup = await mainController.createPopup(windowId, 'sign');
        pendingWindow = true;
        window.addEventListener(
          'signTypedData',
          async (ev: any) => {
            if (ev.detail.substring(1) === windowId) {
              const result = mainController.dapp.getApprovedIdentityJSON();
              await mainController.provider.ethSign(windowId, result);
              
              port.postMessage({
                id: message.id,
                data: {
                  result:
                    method === 'wallet.sendTransaction'
                      ? JSON.parse(result).hash
                      : result,
                },
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
      } else if (method === 'wallet.eth_chainId') {
        console.log(method, args, 'messageHandler');
        const provider = new ethers.providers.AlchemyProvider(
          'homestead',
          ALCHEMY_ETH_API_KEY
        );
        result = await provider.send('eth_chainId', []);
      } else if (method === 'wallet.eth_getBlockByNumber') {
        console.log(method, args, 'messageHandler');
        const provider = new ethers.providers.AlchemyProvider(
          'homestead',
          ALCHEMY_ETH_API_KEY
        );
        result = await provider.send('eth_getBlockByNumber', args[0].params);
        console.log(method, args, result, 'messageHandler');
      } else if (method === 'wallet.net_version' || method == 'eth_chainId') {
        console.log(method, args, 'messageHandler');

        const provider = new ethers.providers.AlchemyProvider(
          'homestead',
          ALCHEMY_ETH_API_KEY
        );
        result = await provider.send('eth_chainId', []);
        console.log(method, args, result, 'messageHandler');
      } else if (method === 'wallet.anyMethod') {
        console.log(method, args, 'messageHandler');
      } else if (method === 'wallet.ecRecover') {
        result = recoverPersonalSignature({
          data: args[0],
          signature: args[1],
        });
      } else if (method === 'wallet.signTypedData') {
        if (pendingWindow) {
          return Promise.resolve(null);
        }
        let signatureRequest;
        if (args[0].method === 'eth_signTypedData') {
          signatureRequest = args[0].params[0];
        } else if (args[0].method === 'eth_signTypedData_v3') {
          signatureRequest = args[0].params[1];
        } else if (args[0].method === 'eth_signTypedData_v4') {
          signatureRequest = args[0].params[1];
        }
        const windowId = uuid();
        mainController.dapp.setSignatureType(args[0].method);
        mainController.dapp.setSignatureRequest(signatureRequest, windowId);
        const popup = await mainController.createPopup(windowId, 'sign');
        pendingWindow = true;
        window.addEventListener(
          'signTypedData',
          async (ev: any) => {
            if (ev.detail.substring(1) === windowId) {
              const result = mainController.dapp.getApprovedIdentityJSON();
              await mainController.provider.ethSign(windowId, result);
              port.postMessage({
                id: message.id,
                data: { result },
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
      } else if (method === 'wallet.getAddress') {
        result = mainController.provider.getAddressForDapp(origin, params);
      } else if (method === 'wallet.getNetwork') {
        result = mainController.provider.getNetwork();
      } else if (method === 'wallet.getBalance') {
        result = mainController.provider.getBalance();
      } else if (method === 'wallet.getAddressMeta') {
        result = mainController.provider.getAddressMeta(origin);
      } else if (method === 'wallet.getActiveAddress') {
        result = mainController.provider.getActiveAddress(origin);
      } else if (method === 'wallet.sessionSign') {
        result = await mainController.provider.sessionSign(
          {
            ...params,
          },
          origin
        );
      } else if (method === 'wallet.generateSessionId') {
        result = mainController.provider.generateSessionId();
      } else if (method === 'wallet.isSessionActive') {
        result = mainController.provider.isSessionActive(params, origin);
      } else if (method === 'wallet.closeSession') {
        result = mainController.provider.closeSession(origin);
      } else if (
        method === 'wallet.sign' ||
        method === 'wallet.signRaw' ||
        method === 'wallet.createSession'
      ) {
        if (pendingWindow) {
          return Promise.resolve(null);
        }
        const signatureRequest =
          method === 'wallet.createSession'
            ? { ...params, type: 'createSession' }
            : method === 'wallet.signRaw'
            ? { message: params, type: 'signRaw' }
            : params;
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

              mainController.dapp.setSignatureType(null);
              if (method === 'wallet.createSession') {
                result = await mainController.provider.createSession(
                  signatureRequest,
                  approvedIdentityJSON,
                  windowId
                );
              } else if (method === 'wallet.signRaw') {
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
      } else if (
        method === 'wallet.updateSession' ||
        method === 'wallet.disconnect'
      ) {
        if (pendingWindow) {
          return Promise.resolve(null);
        }
        const signatureRequest =
          method === 'wallet.updateSession'
            ? { ...params, type: 'updateSession' }
            : method === 'wallet.disconnect'
            ? { message: params, type: 'disconnect' }
            : params;
        const windowId = uuid();
        mainController.dapp.setSignatureRequest(signatureRequest, windowId);
        const popup = await mainController.createPopup(windowId, 'approve');
        pendingWindow = true;
        window.addEventListener(
          'unsignedApproval',
          async (ev: any) => {
            if (ev.detail.substring(1) === windowId) {
              //https://forum.dfinity.org/t/mismatching-dfinity-agent-versions-can-cause-hashing-issues/7359/5
              const approvedIdentityJSON =
                mainController.dapp.getApprovedIdentityJSON();
              if (method === 'wallet.updateSession') {
                result = await mainController.provider.updateSession(
                  signatureRequest,
                  origin
                );
              } else if (method === 'wallet.disconnect') {
                await mainController.dapp.deleteOriginAndRequests(origin);
                result = {
                  type: 'success',
                  message: 'Disconnected successfully!',
                };
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

  const checkAllowedOrigins = (origin: string) => {
    if (origin == '') {
      return;
    }
    const allowed = mainController.dapp.isPageOriginAllowed(origin);
    if (origin && allowed) {
      browser.browserAction.setIcon({
        path: '/assets/images/icon-38-glow.png',
      });
    } else {
      browser.browserAction.setIcon({
        path: '/assets/images/icon-38.png',
      });
    }
    if (!mainController.isHydrated()) {
      //hydrate app if not hydrated
      mainController.preloadState();
    }
  };
  browser.tabs.onActivated.addListener(function (activeInfo) {
    chrome.tabs.get(activeInfo.tabId, function (tab) {
      const url = tab?.url;
      const origin = url && new URL(url as string).origin;
      checkAllowedOrigins(origin || '');
    });
  });

  browser.tabs.onUpdated.addListener((_, change, tab) => {
    if (tab.active && change.url) {
      const url = change?.url;
      const origin = url && new URL(url as string).origin;
      checkAllowedOrigins(origin || '');
    }
  });

  port.onMessage.addListener(listener);
};
