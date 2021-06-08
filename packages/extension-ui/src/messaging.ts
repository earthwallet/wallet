// Copyright 2021 @earthwallet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountJson, AllowedPath, AuthorizeRequest, MessageTypes, MessageTypesWithNoSubscriptions, MessageTypesWithNullRequest, MessageTypesWithSubscriptions, MetadataRequest, RequestTypes, ResponseAuthorizeList, ResponseDeriveValidate, ResponseJsonGetAccountInfo, ResponseSigningIsLocked, ResponseTypes, SeedLengths, SigningRequest, SubscriptionMessageTypes } from '@earthwallet/extension-base/background/types';
import type { Message } from '@earthwallet/extension-base/types';
import type { Chain } from '@earthwallet/extension-chains/types';
import type { KeyringPairs$Json } from '@earthwallet/ui-keyring/types';
import type { KeyringPair$Json } from '@polkadot/keyring/types';
import type { KeypairType } from '@polkadot/util-crypto/types';

import { PORT_EXTENSION } from '@earthwallet/extension-base/defaults';
import { metadataExpand } from '@earthwallet/extension-chains';
import chrome from '@earthwallet/extension-inject/chrome';
import { MetadataDef } from '@earthwallet/extension-inject/types';

import allChains from './util/chains';
import { getSavedMeta, setSavedMeta } from './MetadataCache';

interface Handler {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resolve: (data: any) => void;
  reject: (error: Error) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subscriber?: (data: any) => void;
}

type Handlers = Record<string, Handler>;

const port = chrome.runtime.connect({ name: PORT_EXTENSION });
const handlers: Handlers = {};
let idCounter = 0;

// setup a listener for messages, any incoming resolves the promise
port.onMessage.addListener((data: Message['data']): void => {
  if (data.origin !== 'earthwallet') {
    console.warn('Unknown origin: ' + data.origin);

    return;
  }

  const handler = handlers[data.id];

  if (!handler) {
    console.warn(`Unknown response: ${JSON.stringify(data)}`);

    return;
  }

  if (!handler.subscriber) {
    delete handlers[data.id];
  }

  if (data.subscription) {
    // eslint-disable-next-line @typescript-eslint/ban-types
    (handler.subscriber as Function)(data.subscription);
  } else if (data.error) {
    handler.reject(new Error(data.error));
  } else {
    handler.resolve(data.response);
  }
});

function sendMessage<TMessageType extends MessageTypesWithNullRequest>(message: TMessageType): Promise<ResponseTypes[TMessageType]>;
function sendMessage<TMessageType extends MessageTypesWithNoSubscriptions>(message: TMessageType, request: RequestTypes[TMessageType]): Promise<ResponseTypes[TMessageType]>;
function sendMessage<TMessageType extends MessageTypesWithSubscriptions>(message: TMessageType, request: RequestTypes[TMessageType], subscriber: (data: SubscriptionMessageTypes[TMessageType]) => void): Promise<ResponseTypes[TMessageType]>;
function sendMessage<TMessageType extends MessageTypes> (message: TMessageType, request?: RequestTypes[TMessageType], subscriber?: (data: unknown) => void): Promise<ResponseTypes[TMessageType]> {
  return new Promise((resolve, reject): void => {
    const id = `${Date.now()}.${++idCounter}`;

    handlers[id] = { reject, resolve, subscriber };

    port.postMessage({ id, message, request: request || {}, origin: 'earthwallet' });
  });
}

export async function editAccount (address: string, name: string): Promise<boolean> {
  return sendMessage('ewpri(accounts.edit)', { address, name });
}

export async function showAccount (address: string, isShowing: boolean): Promise<boolean> {
  return sendMessage('ewpri(accounts.show)', { address, isShowing });
}

export async function tieAccount (address: string, genesisHash: string | null): Promise<boolean> {
  return sendMessage('ewpri(accounts.tie)', { address, genesisHash });
}

export async function exportAccount (address: string, password: string): Promise<{ exportedJson: KeyringPair$Json }> {
  return sendMessage('ewpri(accounts.export)', { address, password });
}

export async function exportAccounts (addresses: string[], password: string): Promise<{ exportedJson: KeyringPairs$Json }> {
  return sendMessage('ewpri(accounts.batchExport)', { addresses, password });
}

export async function validateAccount (address: string, password: string): Promise<boolean> {
  return sendMessage('ewpri(accounts.validate)', { address, password });
}

export async function forgetAccount (address: string): Promise<boolean> {
  return sendMessage('ewpri(accounts.forget)', { address });
}

export async function approveAuthRequest (id: string): Promise<boolean> {
  return sendMessage('ewpri(authorize.approve)', { id });
}

export async function approveMetaRequest (id: string): Promise<boolean> {
  return sendMessage('ewpri(metadata.approve)', { id });
}

export async function cancelSignRequest (id: string): Promise<boolean> {
  return sendMessage('ewpri(signing.cancel)', { id });
}

export async function isSignLocked (id: string): Promise<ResponseSigningIsLocked> {
  return sendMessage('ewpri(signing.isLocked)', { id });
}

export async function approveSignPassword (id: string, savePass: boolean, password?: string): Promise<boolean> {
  return sendMessage('ewpri(signing.approve.password)', { id, password, savePass });
}

export async function approveSignSignature (id: string, signature: string): Promise<boolean> {
  return sendMessage('ewpri(signing.approve.signature)', { id, signature });
}

export async function createAccountExternal (name: string, address: string, genesisHash: string): Promise<boolean> {
  return sendMessage('ewpri(accounts.create.external)', { address, genesisHash, name });
}

export async function createAccountHardware (address: string, hardwareType: string, accountIndex: number, addressOffset: number, name: string, genesisHash: string): Promise<boolean> {
  return sendMessage('ewpri(accounts.create.hardware)', { accountIndex, address, addressOffset, genesisHash, hardwareType, name });
}

export async function createAccountSuri (name: string, password: string, suri: string, type?: KeypairType, genesisHash?: string, symbol?: string): Promise<boolean> {
//   console.log('createAccountSuri', genesisHash, name, password, suri, type);
  return sendMessage('ewpri(accounts.create.suri)', { genesisHash, name, password, suri, type, symbol });
}

export async function createSeed (length?: SeedLengths, type?: KeypairType): Promise<{ address: string; seed: string }> {
  return sendMessage('ewpri(seed.create)', { length, type });
}

export async function getAllMetadata (): Promise<MetadataDef[]> {
  return sendMessage('ewpri(metadata.list)');
}

export async function getMetadata (genesisHash?: string | null, isPartial = false): Promise<Chain | null> {
  if (!genesisHash) {
    return null;
  }

  let request = getSavedMeta(genesisHash);

  if (!request) {
    request = sendMessage('ewpri(metadata.get)', genesisHash || null);
    setSavedMeta(genesisHash, request);
  }

  const def = await request;

  if (def) {
    return metadataExpand(def, isPartial);
  } else if (isPartial) {
    const chain = allChains.find((chain) => chain.genesisHash === genesisHash);

    if (chain) {
      return metadataExpand({
        ...chain,
        specVersion: 0,
        tokenDecimals: 15,
        tokenSymbol: 'Unit',
        types: {}
      }, isPartial);
    }
  }

  return null;
}

export async function rejectAuthRequest (id: string): Promise<boolean> {
  return sendMessage('ewpri(authorize.reject)', { id });
}

export async function rejectMetaRequest (id: string): Promise<boolean> {
  return sendMessage('ewpri(metadata.reject)', { id });
}

export async function subscribeAccounts (cb: (accounts: AccountJson[]) => void): Promise<boolean> {
  return sendMessage('ewpri(accounts.subscribe)', null, cb);
}

export async function subscribeAuthorizeRequests (cb: (accounts: AuthorizeRequest[]) => void): Promise<boolean> {
  return sendMessage('ewpri(authorize.requests)', null, cb);
}

export async function getAuthList (): Promise<ResponseAuthorizeList> {
  return sendMessage('ewpri(authorize.list)');
}

export async function toggleAuthorization (url: string): Promise<ResponseAuthorizeList> {
  return sendMessage('ewpri(authorize.toggle)', url);
}

export async function subscribeMetadataRequests (cb: (accounts: MetadataRequest[]) => void): Promise<boolean> {
  return sendMessage('ewpri(metadata.requests)', null, cb);
}

export async function subscribeSigningRequests (cb: (accounts: SigningRequest[]) => void): Promise<boolean> {
  return sendMessage('ewpri(signing.requests)', null, cb);
}

export async function validateSeed (suri: string, type?: KeypairType): Promise<{ address: string; suri: string }> {
  return sendMessage('ewpri(seed.validate)', { suri, type });
}

export async function validateDerivationPath (parentAddress: string, suri: string, parentPassword: string): Promise<ResponseDeriveValidate> {
  return sendMessage('ewpri(derivation.validate)', { parentAddress, parentPassword, suri });
}

export async function deriveAccount (parentAddress: string, suri: string, parentPassword: string, name: string, password: string, genesisHash: string | null): Promise<boolean> {
  return sendMessage('ewpri(derivation.create)', { genesisHash, name, parentAddress, parentPassword, password, suri });
}

export async function windowOpen (path: AllowedPath): Promise<boolean> {
  return sendMessage('ewpri(window.open)', path);
}

export async function jsonGetAccountInfo (json: KeyringPair$Json): Promise<ResponseJsonGetAccountInfo> {
  return sendMessage('ewpri(json.account.info)', json);
}

export async function jsonRestore (file: KeyringPair$Json, password: string): Promise<void> {
  return sendMessage('ewpri(json.restore)', { file, password });
}

export async function batchRestore (file: KeyringPairs$Json, password: string): Promise<void> {
  return sendMessage('ewpri(json.batchRestore)', { file, password });
}
