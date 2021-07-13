// Copyright 2021 @earthwallet/extension authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubjectInfo } from '@earthwallet/ui-keyring/observable/types';
import type { EarthKeyringPair, KeyringPair, KeyringPair$Json, KeyringPair$Meta } from '@earthwallet/ui-keyring/types_extended';
import type { SignerPayloadJSON, SignerPayloadRaw } from '@polkadot/types/types';
import type { AccountJson, AllowedPath, AuthorizeRequest, MessageTypes, RequestAccountBatchExport, RequestAccountChangePassword, RequestAccountCreateSuri, RequestAccountEdit, RequestAccountExport, RequestAccountForget, RequestAccountShow, RequestAccountTie, RequestAccountValidate, RequestAuthorizeApprove, RequestAuthorizeReject, RequestBatchRestore, RequestDeriveCreate, RequestDeriveValidate, RequestJsonRestore, RequestSeedCreate, RequestSeedValidate, RequestSigningApprovePassword, RequestSigningApproveSignature, RequestSigningCancel, RequestSigningIsLocked, RequestTypes, ResponseAccountExport, ResponseAccountsExport, ResponseAuthorizeList, ResponseDeriveValidate, ResponseJsonGetAccountInfo, ResponseSeedCreate, ResponseSeedValidate, ResponseSigningIsLocked, ResponseType, SigningRequest } from '../types';

import { ALLOWED_PATH, PASSWORD_EXPIRY_MS } from '@earthwallet/extension-base/defaults';
import chrome from '@earthwallet/sdk/build/main/inject/chrome';
import keyring from '@earthwallet/ui-keyring';
import { accounts as accountsObservable } from '@earthwallet/ui-keyring/observable/accounts';

import { TypeRegistry } from '@polkadot/types';
import { assert, isHex } from '@polkadot/util';
import { keyExtractSuri, mnemonicGenerate, mnemonicValidate } from '@polkadot/util-crypto';

import State from './State';
import { createSubscription, unsubscribe } from './subscriptions';

type CachedUnlocks = Record<string, number>;

const SEED_DEFAULT_LENGTH = 12;
const SEED_LENGTHS = [12, 15, 18, 21, 24];

// a global registry to use internally
const registry = new TypeRegistry();

function transformAccounts (accounts: SubjectInfo): AccountJson[] {
  return Object.values(accounts).map(({ json: { address, meta }, type }): AccountJson => ({
    address,
    ...meta,
    type
  }));
}

function isJsonPayload (value: SignerPayloadJSON | SignerPayloadRaw): value is SignerPayloadJSON {
  return (value as SignerPayloadJSON).genesisHash !== undefined;
}

export default class Extension {
  readonly #cachedUnlocks: CachedUnlocks;

  readonly #state: State;

  constructor (state: State) {
    this.#cachedUnlocks = {};
    this.#state = state;
  }

  private accountsCreateSuri ({ genesisHash, name, password, suri, symbol, type }: RequestAccountCreateSuri): boolean {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    keyring.addUri(suri, password, { genesisHash, name }, type, symbol).then(() => true);

    return true;
  }

  private accountsChangePassword ({ address, newPass, oldPass }: RequestAccountChangePassword): boolean {
    const pair = keyring.getPair(address);

    assert(pair, 'Unable to find pair');

    try {
      if (!pair.isLocked) {
        pair.lock();
      }

      pair.decodePkcs8(oldPass);
    } catch (error) {
      throw new Error('oldPass is invalid');
    }

    keyring.encryptAccount(pair, newPass);

    return true;
  }

  private accountsEdit ({ address, name }: RequestAccountEdit): boolean {
    const pair = keyring.getPair(address);

    assert(pair, 'Unable to find pair');

    keyring.saveAccountMeta(pair, { ...pair.meta, name });

    return true;
  }

  private accountsExport ({ address, password }: RequestAccountExport): ResponseAccountExport {
    return { exportedJson: keyring.backupAccount(keyring.getPair(address), password) };
  }

  private async accountsBatchExport ({ addresses, password }: RequestAccountBatchExport): Promise<ResponseAccountsExport> {
    return {
      exportedJson: await keyring.backupAccounts(addresses, password)
    };
  }

  private accountsForget ({ address }: RequestAccountForget): boolean {
    keyring.forgetAccount(address);

    return true;
  }

  private refreshAccountPasswordCache (pair: KeyringPair): number {
    const { address } = pair;

    const savedExpiry = this.#cachedUnlocks[address] || 0;
    const remainingTime = savedExpiry - Date.now();

    if (remainingTime < 0) {
      this.#cachedUnlocks[address] = 0;
      pair.lock();

      return 0;
    }

    return remainingTime;
  }

  private accountsShow ({ address, isShowing }: RequestAccountShow): boolean {
    const pair = keyring.getPair(address);

    assert(pair, 'Unable to find pair');

    keyring.saveAccountMeta(pair, { ...pair.meta, isHidden: !isShowing });

    return true;
  }

  private accountsTie ({ address, genesisHash }: RequestAccountTie): boolean {
    const pair = keyring.getPair(address);

    assert(pair, 'Unable to find pair');

    keyring.saveAccountMeta(pair, { ...pair.meta, genesisHash });

    return true;
  }

  private accountsValidate ({ address, password }: RequestAccountValidate): boolean {
    try {
      keyring.backupAccount(keyring.getPair(address), password);

      return true;
    } catch (e) {
      return false;
    }
  }

  // FIXME This looks very much like what we have in Tabs
  private accountsSubscribe (id: string, port: chrome.runtime.Port): boolean {
    const cb = createSubscription<'ewpri(accounts.subscribe)'>(id, port);
    const subscription = accountsObservable.subject.subscribe((accounts: SubjectInfo): void =>
      cb(transformAccounts(accounts))
    );

    port.onDisconnect.addListener((): void => {
      unsubscribe(id);
      subscription.unsubscribe();
    });

    return true;
  }

  private authorizeApprove ({ id }: RequestAuthorizeApprove): boolean {
    const queued = this.#state.getAuthRequest(id);

    assert(queued, 'Unable to find request');

    const { resolve } = queued;

    resolve(true);

    return true;
  }

  private getAuthList (): ResponseAuthorizeList {
    return { list: this.#state.authUrls };
  }

  private authorizeReject ({ id }: RequestAuthorizeReject): boolean {
    const queued = this.#state.getAuthRequest(id);

    assert(queued, 'Unable to find request');

    const { reject } = queued;

    reject(new Error('Rejected'));

    return true;
  }

  // FIXME This looks very much like what we have in accounts
  private authorizeSubscribe (id: string, port: chrome.runtime.Port): boolean {
    const cb = createSubscription<'ewpri(authorize.requests)'>(id, port);
    const subscription = this.#state.authSubject.subscribe((requests: AuthorizeRequest[]): void =>
      cb(requests)
    );

    port.onDisconnect.addListener((): void => {
      unsubscribe(id);
      subscription.unsubscribe();
    });

    return true;
  }

  private jsonRestore ({ file, password }: RequestJsonRestore): void {
    try {
      keyring.restoreAccount(file, password);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  private batchRestore ({ file, password }: RequestBatchRestore): void {
    try {
      keyring.restoreAccounts(file, password);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  private jsonGetAccountInfo (json: KeyringPair$Json): ResponseJsonGetAccountInfo {
    try {
      const { address, meta: { genesisHash, name }, type } = keyring.createFromJson(json);

      return {
        address,
        genesisHash,
        name,
        type
      } as ResponseJsonGetAccountInfo;
    } catch (e) {
      console.error(e);
      throw new Error((e as Error).message);
    }
  }

  private async seedCreate ({ length = SEED_DEFAULT_LENGTH, symbol, type }: RequestSeedCreate): Promise<ResponseSeedCreate> {
    const seed = mnemonicGenerate(length);

    return {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      address: (await keyring.createFromUri(seed, {}, type, symbol)).address,
      seed
    };
  }

  private async seedValidate ({ suri, symbol, type }: RequestSeedValidate): Promise<ResponseSeedValidate> {
    const { phrase } = keyExtractSuri(suri);

    if (isHex(phrase)) {
      assert(isHex(phrase, 256), 'Hex seed needs to be 256-bits');
    } else {
      // sadly isHex detects as string, so we need a cast here
      assert(SEED_LENGTHS.includes((phrase as string).split(' ').length), `Mnemonic needs to contain ${SEED_LENGTHS.join(', ')} words`);
      assert(mnemonicValidate(phrase), 'Not a valid mnemonic seed');
    }

    return {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      address: (await keyring.createFromUri(suri, {}, type, symbol)).address,
      suri
    };
  }

  private signingApprovePassword ({ id, password, savePass }: RequestSigningApprovePassword): boolean {
    const queued = this.#state.getSignRequest(id);

    assert(queued, 'Unable to find request');

    const { reject, request, resolve } = queued;
    const pair = keyring.getPair(queued.account.address);

    // unlike queued.account.address the following
    // address is encoded with the default prefix
    // which what is used for password caching mapping
    const { address } = pair;

    if (!pair) {
      reject(new Error('Unable to find pair'));

      return false;
    }

    this.refreshAccountPasswordCache(pair);

    // if the keyring pair is locked, the password is needed
    if (pair.isLocked && !password) {
      reject(new Error('Password needed to unlock the account'));
    }

    if (pair.isLocked) {
      pair.decodePkcs8(password);
    }

    const { payload } = request;

    if (isJsonPayload(payload)) {
      // set the registry before calling the sign function
      registry.setSignedExtensions(payload.signedExtensions, undefined);
    }

    const result = request.sign(registry, pair);

    if (savePass) {
      this.#cachedUnlocks[address] = Date.now() + PASSWORD_EXPIRY_MS;
    } else {
      pair.lock();
    }

    resolve({
      id,
      ...result
    });

    return true;
  }

  private signingApproveSignature ({ id, signature }: RequestSigningApproveSignature): boolean {
    const queued = this.#state.getSignRequest(id);

    assert(queued, 'Unable to find request');

    const { resolve } = queued;

    resolve({ id, signature });

    return true;
  }

  private signingCancel ({ id }: RequestSigningCancel): boolean {
    const queued = this.#state.getSignRequest(id);

    assert(queued, 'Unable to find request');

    const { reject } = queued;

    reject(new Error('Cancelled'));

    return true;
  }

  private signingIsLocked ({ id }: RequestSigningIsLocked): ResponseSigningIsLocked {
    const queued = this.#state.getSignRequest(id);

    assert(queued, 'Unable to find request');

    const address = queued.request.payload.address;
    const pair = keyring.getPair(address);

    assert(pair, 'Unable to find pair');

    const remainingTime = this.refreshAccountPasswordCache(pair);

    return {
      isLocked: pair.isLocked,
      remainingTime
    };
  }

  // FIXME This looks very much like what we have in authorization
  private signingSubscribe (id: string, port: chrome.runtime.Port): boolean {
    const cb = createSubscription<'ewpri(signing.requests)'>(id, port);
    const subscription = this.#state.signSubject.subscribe((requests: SigningRequest[]): void =>
      cb(requests)
    );

    port.onDisconnect.addListener((): void => {
      unsubscribe(id);
      subscription.unsubscribe();
    });

    return true;
  }

  private windowOpen (path: AllowedPath): boolean {
    const url = `${chrome.extension.getURL('index.html')}#${path}`;

    if (!ALLOWED_PATH.includes(path)) {
      console.error('Not allowed to open the url:', url);

      return false;
    }

    const callback = () => console.log('open', url);

    chrome.tabs.create({ url }, callback);

    return true;
  }

  private derive (parentAddress: string, suri: string, password: string, metadata: KeyringPair$Meta): KeyringPair {
    const parentPair = keyring.getPair(parentAddress);

    try {
      parentPair.decodePkcs8(password);
    } catch (e) {
      throw new Error('invalid password');
    }

    try {
      return parentPair.derive(suri, metadata);
    } catch (err) {
      throw new Error(`"${suri}" is not a valid derivation path`);
    }
  }

  private derivationValidate ({ parentAddress, parentPassword, suri }: RequestDeriveValidate): ResponseDeriveValidate {
    const childPair = this.derive(parentAddress, suri, parentPassword, {});

    return {
      address: childPair.address,
      suri
    };
  }

  private derivationCreate ({ genesisHash, name, parentAddress, parentPassword, password, suri }: RequestDeriveCreate): boolean {
    const childPair = this.derive(parentAddress, suri, parentPassword, {
      genesisHash,
      name,
      parentAddress,
      suri
    });

    keyring.addPair(childPair as EarthKeyringPair, password);

    return true;
  }

  private toggleAuthorization (url: string): ResponseAuthorizeList {
    return { list: this.#state.toggleAuthorization(url) };
  }

  // Weird thought, the eslint override is not needed in Tabs
  // eslint-disable-next-line @typescript-eslint/require-await
  public async handle<TMessageType extends MessageTypes> (id: string, type: TMessageType, request: RequestTypes[TMessageType], port: chrome.runtime.Port): Promise<ResponseType<TMessageType>> {
    switch (type) {
      case 'ewpri(authorize.approve)':
        return this.authorizeApprove(request as RequestAuthorizeApprove);

      case 'ewpri(authorize.list)':
        return this.getAuthList();

      case 'ewpri(authorize.reject)':
        return this.authorizeReject(request as RequestAuthorizeReject);

      case 'ewpri(authorize.toggle)':
        return this.toggleAuthorization(request as string);

      case 'ewpri(authorize.requests)':
        return this.authorizeSubscribe(id, port);

      case 'ewpri(accounts.create.suri)':
        return this.accountsCreateSuri(request as RequestAccountCreateSuri);

      case 'ewpri(accounts.changePassword)':
        return this.accountsChangePassword(request as RequestAccountChangePassword);

      case 'ewpri(accounts.edit)':
        return this.accountsEdit(request as RequestAccountEdit);

      case 'ewpri(accounts.export)':
        return this.accountsExport(request as RequestAccountExport);

      case 'ewpri(accounts.batchExport)':
        return this.accountsBatchExport(request as RequestAccountBatchExport);

      case 'ewpri(accounts.forget)':
        return this.accountsForget(request as RequestAccountForget);

      case 'ewpri(accounts.show)':
        return this.accountsShow(request as RequestAccountShow);

      case 'ewpri(accounts.subscribe)':
        return this.accountsSubscribe(id, port);

      case 'ewpri(accounts.tie)':
        return this.accountsTie(request as RequestAccountTie);

      case 'ewpri(accounts.validate)':
        return this.accountsValidate(request as RequestAccountValidate);

      case 'ewpri(derivation.create)':
        return this.derivationCreate(request as RequestDeriveCreate);

      case 'ewpri(derivation.validate)':
        return this.derivationValidate(request as RequestDeriveValidate);

      case 'ewpri(json.restore)':
        return this.jsonRestore(request as RequestJsonRestore);

      case 'ewpri(json.batchRestore)':
        return this.batchRestore(request as RequestBatchRestore);

      case 'ewpri(json.account.info)':
        return this.jsonGetAccountInfo(request as KeyringPair$Json);

      case 'ewpri(seed.create)':
        return this.seedCreate(request as RequestSeedCreate);

      case 'ewpri(seed.validate)':
        return this.seedValidate(request as RequestSeedValidate);

      case 'ewpri(signing.approve.password)':
        return this.signingApprovePassword(request as RequestSigningApprovePassword);

      case 'ewpri(signing.approve.signature)':
        return this.signingApproveSignature(request as RequestSigningApproveSignature);

      case 'ewpri(signing.cancel)':
        return this.signingCancel(request as RequestSigningCancel);

      case 'ewpri(signing.isLocked)':
        return this.signingIsLocked(request as RequestSigningIsLocked);

      case 'ewpri(signing.requests)':
        return this.signingSubscribe(id, port);

      case 'ewpri(window.open)':
        return this.windowOpen(request as AllowedPath);

      default:
        return console.log(`Unable to handle message of type ${type}`);
    }
  }
}
