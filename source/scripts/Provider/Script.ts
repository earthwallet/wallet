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
            window.dispatchEvent(
              new CustomEvent(id, { detail: stringifyWithBigInt(result) })
            );
          });
        } else {
          this.emitter.once(id, (result) => {
            window.dispatchEvent(
              new CustomEvent(id, { detail: stringifyWithBigInt(result) })
            );
          });
        }

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
    this.emitter.emit(id, data);
  }
}
