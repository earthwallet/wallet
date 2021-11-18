import { EventEmitter } from 'events';
import { browser, Runtime } from 'webextension-polyfill-ts';
import { parseObjWithOutBigInt, stringifyWithBigInt } from '~global/helpers';

export class Script {
  private emitter = new EventEmitter();
  private backgroundPort: Runtime.Port;

  constructor() {
    this.emitter = new EventEmitter();
    this.backgroundPort = browser.runtime.connect(undefined, {
      name: 'earth',
    });
    this.backgroundPort.onMessage.addListener((message) =>
      this.onMessage(message)
    );
  }

  start() {
    window.addEventListener(
      'message',
      (event) => {
        if (event.source !== window) return;
        if (!event.data) return;

        const { id, type, data } = event.data;
        if (!id || !type) return;

        if (type === 'EARTH_EVENT_MESSAGE') {
          this.emitter.on(id, (result) => {
            //console.log('Script - emitter', id, result);
            window.dispatchEvent(
              new CustomEvent(id, { detail: stringifyWithBigInt(result) })
            );
          });
        } else {
          this.emitter.once(id, (result) => {
            //console.log('Script - emitter.once', id, result);
            window.dispatchEvent(
              new CustomEvent(id, { detail: stringifyWithBigInt(result) })
            );
          });
        }

        //console.log('Script - ', id, type, parseObjWithOutBigInt(data));
        this.backgroundPort.postMessage({
          id,
          type,
          data: parseObjWithOutBigInt(data),
        });
      },
      false
    );
  }

  onMessage({ id, data }: { id: string; data: string }) {
    //console.log('Script - onMessage', id, data);
    this.emitter.emit(id, data);
  }
}
