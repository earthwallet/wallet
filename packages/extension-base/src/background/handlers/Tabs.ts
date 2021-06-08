// Copyright 2021 @earthwallet/extension authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { InjectedAccount, InjectedMetadataKnown, MetadataDef, ProviderMeta } from '@earthwallet/extension-inject/types';
import type { SubjectInfo } from '@earthwallet/ui-keyring/observable/types';
import type { KeyringPair } from '@polkadot/keyring/types';
import type { JsonRpcResponse } from '@polkadot/rpc-provider/types';
import type { SignerPayloadJSON, SignerPayloadRaw } from '@polkadot/types/types';
import type { MessageTypes, RequestAccountList, RequestAuthorizeTab, RequestRpcSend, RequestRpcSubscribe, RequestRpcUnsubscribe, RequestTypes, ResponseRpcListProviders, ResponseSigning, ResponseTypes, SubscriptionMessageTypes } from '../types';

import { PHISHING_PAGE_REDIRECT } from '@earthwallet/extension-base/defaults';
import { canDerive } from '@earthwallet/extension-base/utils';
import keyring from '@earthwallet/ui-keyring';
import { accounts as accountsObservable } from '@earthwallet/ui-keyring/observable/accounts';

import { checkIfDenied } from '@polkadot/phishing';
import { assert, isNumber } from '@polkadot/util';

import RequestBytesSign from '../RequestBytesSign';
import RequestExtrinsicSign from '../RequestExtrinsicSign';
import State from './State';
import { createSubscription, unsubscribe } from './subscriptions';

function transformAccounts (accounts: SubjectInfo, anyType = false): InjectedAccount[] {
  return Object
    .values(accounts)
    .filter(({ json: { meta: { isHidden } } }) => !isHidden)
    .filter(({ type }) => anyType ? true : canDerive(type))
    .sort((a, b) => (a.json.meta.whenCreated || 0) - (b.json.meta.whenCreated || 0))
    .map(({ json: { address, meta: { genesisHash, name } }, type }): InjectedAccount => ({
      address,
      genesisHash,
      name,
      type
    }));
}

export default class Tabs {
  readonly #state: State;

  constructor (state: State) {
    this.#state = state;
  }

  private authorize (url: string, request: RequestAuthorizeTab): Promise<boolean> {
    return this.#state.authorizeUrl(url, request);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private accountsList (url: string, { anyType }: RequestAccountList): InjectedAccount[] {
    return transformAccounts(accountsObservable.subject.getValue(), anyType);
  }

  // FIXME This looks very much like what we have in Extension
  private accountsSubscribe (url: string, id: string, port: chrome.runtime.Port): boolean {
    const cb = createSubscription<'ewpub(accounts.subscribe)'>(id, port);
    const subscription = accountsObservable.subject.subscribe((accounts: SubjectInfo): void =>
      cb(transformAccounts(accounts))
    );

    port.onDisconnect.addListener((): void => {
      unsubscribe(id);
      subscription.unsubscribe();
    });

    return true;
  }

  private getSigningPair (address: string): KeyringPair {
    const pair = keyring.getPair(address);

    assert(pair, 'Unable to find keypair');

    return pair;
  }

  private bytesSign (url: string, request: SignerPayloadRaw): Promise<ResponseSigning> {
    const address = request.address;
    const pair = this.getSigningPair(address);

    return this.#state.sign(url, new RequestBytesSign(request), { address, ...pair.meta });
  }

  private extrinsicSign (url: string, request: SignerPayloadJSON): Promise<ResponseSigning> {
    const address = request.address;
    const pair = this.getSigningPair(address);

    return this.#state.sign(url, new RequestExtrinsicSign(request), { address, ...pair.meta });
  }

  private metadataProvide (url: string, request: MetadataDef): Promise<boolean> {
    return this.#state.injectMetadata(url, request);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private metadataList (url: string): InjectedMetadataKnown[] {
    return this.#state.knownMetadata.map(({ genesisHash, specVersion }) => ({
      genesisHash,
      specVersion
    }));
  }

  private rpcListProviders (): Promise<ResponseRpcListProviders> {
    return this.#state.rpcListProviders();
  }

  private rpcSend (request: RequestRpcSend, port: chrome.runtime.Port): Promise<JsonRpcResponse> {
    return this.#state.rpcSend(request, port);
  }

  private rpcStartProvider (key: string, port: chrome.runtime.Port): Promise<ProviderMeta> {
    return this.#state.rpcStartProvider(key, port);
  }

  private async rpcSubscribe (request: RequestRpcSubscribe, id: string, port: chrome.runtime.Port): Promise<boolean> {
    const innerCb = createSubscription<'ewpub(rpc.subscribe)'>(id, port);
    const cb = (_error: Error | null, data: SubscriptionMessageTypes['ewpub(rpc.subscribe)']): void => innerCb(data);
    const subscriptionId = await this.#state.rpcSubscribe(request, cb, port);

    port.onDisconnect.addListener((): void => {
      unsubscribe(id);
      this.rpcUnsubscribe({ ...request, subscriptionId }, port).catch(console.error);
    });

    return true;
  }

  private rpcSubscribeConnected (request: null, id: string, port: chrome.runtime.Port): Promise<boolean> {
    const innerCb = createSubscription<'ewpub(rpc.subscribeConnected)'>(id, port);
    const cb = (_error: Error | null, data: SubscriptionMessageTypes['ewpub(rpc.subscribeConnected)']): void => innerCb(data);

    this.#state.rpcSubscribeConnected(request, cb, port);

    port.onDisconnect.addListener((): void => {
      unsubscribe(id);
    });

    return Promise.resolve(true);
  }

  private async rpcUnsubscribe (request: RequestRpcUnsubscribe, port: chrome.runtime.Port): Promise<boolean> {
    return this.#state.rpcUnsubscribe(request, port);
  }

  private redirectPhishingLanding (phishingWebsite: string): void {
    const encodedWebsite = encodeURIComponent(phishingWebsite);
    const url = `${chrome.extension.getURL('index.html')}#${PHISHING_PAGE_REDIRECT}/${encodedWebsite}`;

    chrome.tabs.query({ url: phishingWebsite }, (tabs) => {
      tabs
        .map(({ id }) => id)
        .filter((id): id is number => isNumber(id))
        .forEach((id) => chrome.tabs.update(id, { url }));
    });
  }

  private async redirectIfPhishing (url: string): Promise<boolean> {
    const isInDenyList = await checkIfDenied(url);

    if (isInDenyList) {
      this.redirectPhishingLanding(url);

      return true;
    }

    return false;
  }

  public async handle<TMessageType extends MessageTypes> (id: string, type: TMessageType, request: RequestTypes[TMessageType], url: string, port: chrome.runtime.Port): Promise<ResponseTypes[keyof ResponseTypes]> {
    if (type === 'ewpub(phishing.redirectIfDenied)') {
      return this.redirectIfPhishing(url);
    }

    if (type !== 'ewpub(authorize.tab)') {
      this.#state.ensureUrlAuthorized(url);
    }

    switch (type) {
      case 'ewpub(authorize.tab)':
        return this.authorize(url, request as RequestAuthorizeTab);

      case 'ewpub(accounts.list)':
        return this.accountsList(url, request as RequestAccountList);

      case 'ewpub(accounts.subscribe)':
        return this.accountsSubscribe(url, id, port);

      case 'ewpub(bytes.sign)':
        return this.bytesSign(url, request as SignerPayloadRaw);

      case 'ewpub(extrinsic.sign)':
        return this.extrinsicSign(url, request as SignerPayloadJSON);

      case 'ewpub(metadata.list)':
        return this.metadataList(url);

      case 'ewpub(metadata.provide)':
        return this.metadataProvide(url, request as MetadataDef);

      case 'ewpub(rpc.listProviders)':
        return this.rpcListProviders();

      case 'ewpub(rpc.send)':
        return this.rpcSend(request as RequestRpcSend, port);

      case 'ewpub(rpc.startProvider)':
        return this.rpcStartProvider(request as string, port);

      case 'ewpub(rpc.subscribe)':
        return this.rpcSubscribe(request as RequestRpcSubscribe, id, port);

      case 'ewpub(rpc.subscribeConnected)':
        return this.rpcSubscribeConnected(request as null, id, port);

      case 'ewpub(rpc.unsubscribe)':
        return this.rpcUnsubscribe(request as RequestRpcUnsubscribe, port);

      default:
        return console.log(`Unable to handle message of type ${type}`);
    }
  }
}
