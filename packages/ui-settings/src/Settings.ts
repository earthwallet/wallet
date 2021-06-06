// Copyright 2017-2021 @earthwallet/ui-settings authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option, SettingsStruct } from './types';

import EventEmitter from 'eventemitter3';
import store from 'store';

import { isUndefined } from '@polkadot/util';

import { CAMERA, CAMERA_DEFAULT, CRYPTOS, CRYPTOS_ETH, CRYPTOS_LEDGER, ENDPOINT_DEFAULT, ENDPOINTS, ICON_DEFAULT, ICONS, LANGUAGE_DEFAULT, LEDGER_CONN, LEDGER_CONN_DEFAULT, LOCKING, LOCKING_DEFAULT, PREFIX_DEFAULT, PREFIXES, UIMODE_DEFAULT, UIMODES, UITHEME_DEFAULT, UITHEMES } from './defaults';

type ChangeCallback = (settings: SettingsStruct) => void;
type OnTypes = 'change';

function withDefault (options: Option[], option: string | undefined, fallback: string): string {
  const _option = option || fallback;

  return options.some(({ value }) => value === _option)
    ? _option
    : fallback;
}

export class Settings implements SettingsStruct {
  readonly #emitter: EventEmitter;

  #apiUrl: string;

  #camera: string;

  #i18nLang: string;

  #icon: string;

  #ledgerConn: string;

  #locking: string;

  #prefix: number;

  #uiMode: string;

  #uiTheme: string;

  constructor () {
    const settings = (store.get('settings') as SettingsStruct) || {};

    this.#emitter = new EventEmitter();

    this.#apiUrl = (typeof settings.apiUrl === 'string' && settings.apiUrl) || process.env.WS_URL || (ENDPOINT_DEFAULT.value as string);
    this.#camera = withDefault(CAMERA, settings.camera, CAMERA_DEFAULT);
    this.#ledgerConn = withDefault(LEDGER_CONN, settings.ledgerConn, LEDGER_CONN_DEFAULT);
    this.#i18nLang = settings.i18nLang || LANGUAGE_DEFAULT;
    this.#icon = settings.icon || ICON_DEFAULT;
    this.#locking = settings.locking || LOCKING_DEFAULT;
    this.#prefix = isUndefined(settings.prefix) ? PREFIX_DEFAULT : settings.prefix;
    this.#uiMode = settings.uiMode || UIMODE_DEFAULT;
    this.#uiTheme = settings.uiTheme || UITHEME_DEFAULT;
  }

  public get camera (): string {
    return this.#camera;
  }

  public get apiUrl (): string {
    return this.#apiUrl;
  }

  public get i18nLang (): string {
    return this.#i18nLang;
  }

  public get icon (): string {
    return this.#icon;
  }

  public get ledgerConn (): string {
    return this.#ledgerConn;
  }

  public get locking (): string {
    return this.#locking;
  }

  public get prefix (): number {
    return this.#prefix;
  }

  public get uiMode (): string {
    return this.#uiMode;
  }

  public get uiTheme (): string {
    return this.#uiTheme;
  }

  public get availableCamera (): Option[] {
    return CAMERA;
  }

  public get availableCryptos (): Option[] {
    return CRYPTOS;
  }

  public get availableCryptosEth (): Option[] {
    return CRYPTOS_ETH;
  }

  public get availableCryptosLedger (): Option[] {
    return CRYPTOS_LEDGER;
  }

  public get availableIcons (): Option[] {
    return ICONS;
  }

  public get availableLedgerConn (): Option[] {
    return LEDGER_CONN;
  }

  public get availableLocking (): Option[] {
    return LOCKING;
  }

  public get availableNodes (): Option[] {
    return ENDPOINTS;
  }

  public get availablePrefixes (): Option[] {
    return PREFIXES;
  }

  public get availableUIModes (): Option[] {
    return UIMODES;
  }

  public get availableUIThemes (): Option[] {
    return UITHEMES;
  }

  public get (): SettingsStruct {
    return {
      apiUrl: this.#apiUrl,
      camera: this.#camera,
      i18nLang: this.#i18nLang,
      icon: this.#icon,
      ledgerConn: this.#ledgerConn,
      locking: this.#locking,
      prefix: this.#prefix,
      uiMode: this.#uiMode,
      uiTheme: this.#uiTheme
    };
  }

  public set (settings: Partial<SettingsStruct>): void {
    this.#apiUrl = settings.apiUrl || this.#apiUrl;
    this.#camera = settings.camera || this.#camera;
    this.#ledgerConn = settings.ledgerConn || this.#ledgerConn;
    this.#i18nLang = settings.i18nLang || this.#i18nLang;
    this.#icon = settings.icon || this.#icon;
    this.#locking = settings.locking || this.#locking;
    this.#prefix = isUndefined(settings.prefix) ? this.#prefix : settings.prefix;
    this.#uiMode = settings.uiMode || this.#uiMode;
    this.#uiTheme = settings.uiTheme || this.#uiTheme;

    const newValues = this.get();

    store.set('settings', newValues);
    this.#emitter.emit('change', newValues);
  }

  public on (type: OnTypes, cb: ChangeCallback): void {
    this.#emitter.on(type, cb);
  }
}

export const settings = new Settings();
