import { browser, Runtime } from 'webextension-polyfill-ts';
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
  const listener = async (message: Message, connection: Runtime.Port) => {
    try {
      const response = await listenerHandler(message, connection);

      if (response) {
        const { id, result } = response;
        port.postMessage({ id, data: { result } });
      }
    } catch (e) {
      console.log('messagesHandler.ERROR', e.type, e.message, e.detail);
      console.log(JSON.stringify(e, null, 2));
      port.postMessage({ id: e.type, data: { error: e.detail } });
    }
  };

  const listenerHandler = async (
    message: Message,
    connection: Runtime.Port
  ) => {
    if (browser.runtime.lastError) return Promise.reject('Runtime Last Error');

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
    } else if (message.type === 'ENABLE_REQUEST') {
      //
      return Promise.resolve({ id: message.id, result: origin && allowed });
    } else if (message.type === 'CAL_REQUEST') {
      const { method, args } = message.data;
      console.log('CAL_REQUEST.method', method, args);
      let result: any = undefined;
      if (method === 'wallet.isConnected') {
        result = { connected: !!allowed };
      } else if (method === 'wallet.getAddress') {
        result = mainController.provider.getAddress();
      } else if (method === 'wallet.getNetwork') {
        result = mainController.provider.getNetwork();
      } else if (method === 'wallet.getBalance') {
        result = mainController.provider.getBalance();
      } else if (method === 'wallet.signMessage') {
        //
      }

      if (result !== undefined) {
        return Promise.resolve({ id: message.id, result });
      }

      return sendError('Unknown request');
    } else {
      return Promise.resolve({
        id: message.id,
        result: 'Hi from content script',
      });
    }

    return Promise.resolve(null);
  };

  port.onMessage.addListener(listener);
};