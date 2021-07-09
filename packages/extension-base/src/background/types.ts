// Copyright 2021 @earthwallet/extension authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable no-use-before-define */

import type { InjectedAccount, InjectedMetadataKnown, ProviderList, ProviderMeta } from '@earthwallet/sdk/build/main/inject/types';
import type { KeyringPairs$Json } from '@earthwallet/ui-keyring/types';
import type { KeyringPair, KeyringPair$Json, KeyringPair$Meta } from '@earthwallet/ui-keyring/types_extended';
import type { JsonRpcResponse } from '@polkadot/rpc-provider/types';
import type { SignerPayloadJSON, SignerPayloadRaw } from '@polkadot/types/types';
import type { KeypairType } from '@polkadot/util-crypto/types';

import { TypeRegistry } from '@polkadot/types';

import { ALLOWED_PATH } from '../defaults';
import { AuthUrls } from './handlers/State';

type KeysWithDefinedValues<T> = {
  [K in keyof T]: T[K] extends undefined ? never : K
}[keyof T];

type NoUndefinedValues<T> = {
  [K in KeysWithDefinedValues<T>]: T[K]
};

type IsNull<T, K extends keyof T> = { [K1 in Exclude<keyof T, K>]: T[K1] } & T[K] extends null ? K : never;

type NullKeys<T> = { [K in keyof T]: IsNull<T, K> }[keyof T];

export type SeedLengths = 12 | 24;

export interface AccountJson extends KeyringPair$Meta {
  address: string;
  genesisHash?: string | null;
  isExternal?: boolean;
  isHardware?: boolean;
  isHidden?: boolean;
  name?: string;
  parentAddress?: string;
  suri?: string;
  type?: KeypairType;
  whenCreated?: number;
}

export type AccountWithChildren = AccountJson & {
  children?: AccountWithChildren[];
}

export type AccountsContext = {
  accounts: AccountJson[];
  hierarchy: AccountWithChildren[];
  master?: AccountJson;
}

type SelectedAccountSetter = (selectedAccount: AccountJson) => void;

export type SelectedAccountStruct = {
  selectedAccount?: AccountJson;
  setSelectedAccount: SelectedAccountSetter;
}
export interface NetworkJson {
  text: string;
  symbol: string;
  value: number;
  genesisHash: string;
}

export type NetworksContext = {
  networks: NetworkJson[];
}

type SelectedNetworkSetter = (selectedNetwork: NetworkJson) => void;

export type SelectedNetworkStruct = {
  selectedNetwork: NetworkJson;
  setSelectedNetwork: SelectedNetworkSetter;
}
export interface AuthorizeRequest {
  id: string;
  request: RequestAuthorizeTab;
  url: string;
}

export interface SigningRequest {
  account: AccountJson;
  id: string;
  request: RequestSign;
  url: string;
}

// [MessageType]: [RequestType, ResponseType, SubscriptionMessageType?]
export interface RequestSignatures {
  // private/internal requests, i.e. from a popup
  'ewpri(accounts.create.external)': [RequestAccountCreateExternal, boolean];
  'ewpri(accounts.create.hardware)': [RequestAccountCreateHardware, boolean];
  'ewpri(accounts.create.suri)': [RequestAccountCreateSuri, boolean];
  'ewpri(accounts.edit)': [RequestAccountEdit, boolean];
  'ewpri(accounts.export)': [RequestAccountExport, ResponseAccountExport];
  'ewpri(accounts.batchExport)': [RequestAccountBatchExport, ResponseAccountsExport]
  'ewpri(accounts.forget)': [RequestAccountForget, boolean];
  'ewpri(accounts.show)': [RequestAccountShow, boolean];
  'ewpri(accounts.tie)': [RequestAccountTie, boolean];
  'ewpri(accounts.subscribe)': [RequestAccountSubscribe, boolean, AccountJson[]];
  'ewpri(accounts.validate)': [RequestAccountValidate, boolean];
  'ewpri(accounts.changePassword)': [RequestAccountChangePassword, boolean];
  'ewpri(authorize.approve)': [RequestAuthorizeApprove, boolean];
  'ewpri(authorize.list)': [null, ResponseAuthorizeList];
  'ewpri(authorize.reject)': [RequestAuthorizeReject, boolean];
  'ewpri(authorize.requests)': [RequestAuthorizeSubscribe, boolean, AuthorizeRequest[]];
  'ewpri(authorize.toggle)': [string, ResponseAuthorizeList];
  'ewpri(derivation.create)': [RequestDeriveCreate, boolean];
  'ewpri(derivation.validate)': [RequestDeriveValidate, ResponseDeriveValidate];
  'ewpri(json.restore)': [RequestJsonRestore, void];
  'ewpri(json.batchRestore)': [RequestBatchRestore, void];
  'ewpri(json.account.info)': [KeyringPair$Json, ResponseJsonGetAccountInfo];
  'ewpri(seed.create)': [RequestSeedCreate, ResponseSeedCreate];
  'ewpri(seed.validate)': [RequestSeedValidate, ResponseSeedValidate];
  'ewpri(signing.approve.password)': [RequestSigningApprovePassword, boolean];
  'ewpri(signing.approve.signature)': [RequestSigningApproveSignature, boolean];
  'ewpri(signing.cancel)': [RequestSigningCancel, boolean];
  'ewpri(signing.isLocked)': [RequestSigningIsLocked, ResponseSigningIsLocked];
  'ewpri(signing.requests)': [RequestSigningSubscribe, boolean, SigningRequest[]];
  'ewpri(window.open)': [AllowedPath, boolean];
  // public/external requests, i.e. from a page
  'ewpub(accounts.list)': [RequestAccountList, InjectedAccount[]];
  'ewpub(accounts.subscribe)': [RequestAccountSubscribe, boolean, InjectedAccount[]];
  'ewpub(authorize.tab)': [RequestAuthorizeTab, null];
  'ewpub(bytes.sign)': [SignerPayloadRaw, ResponseSigning];
  'ewpub(extrinsic.sign)': [SignerPayloadJSON, ResponseSigning];
  'ewpub(metadata.list)': [null, InjectedMetadataKnown[]];
  'ewpub(phishing.redirectIfDenied)': [null, boolean];
  'ewpub(rpc.listProviders)': [void, ResponseRpcListProviders];
  'ewpub(rpc.send)': [RequestRpcSend, JsonRpcResponse];
  'ewpub(rpc.startProvider)': [string, ProviderMeta];
  'ewpub(rpc.subscribe)': [RequestRpcSubscribe, number, JsonRpcResponse];
  'ewpub(rpc.subscribeConnected)': [null, boolean, boolean];
  'ewpub(rpc.unsubscribe)': [RequestRpcUnsubscribe, boolean];
}

export type MessageTypes = keyof RequestSignatures;

// Requests

export type RequestTypes = {
  [MessageType in keyof RequestSignatures]: RequestSignatures[MessageType][0]
};

export type MessageTypesWithNullRequest = NullKeys<RequestTypes>

export interface TransportRequestMessage<TMessageType extends MessageTypes> {
  id: string;
  message: TMessageType;
  origin: 'page' | 'extension';
  request: RequestTypes[TMessageType];
}

export interface RequestAuthorizeTab {
  origin: string;
}

export interface RequestAuthorizeApprove {
  id: string;
}

export interface RequestAuthorizeReject {
  id: string;
}

export type RequestAuthorizeSubscribe = null;

export interface RequestAccountCreateExternal {
  address: string;
  genesisHash?: string | null;
  name: string;
}

export interface RequestAccountCreateSuri {
  name: string;
  genesisHash?: string | null;
  password: string;
  suri: string;
  type?: KeypairType;
  symbol?: string;
}

export interface RequestAccountCreateHardware {
  accountIndex: number;
  address: string;
  addressOffset: number;
  genesisHash: string;
  hardwareType: string;
  name: string;
}

export interface RequestAccountChangePassword {
  address: string;
  oldPass: string;
  newPass: string;
}

export interface RequestAccountEdit {
  address: string;
  genesisHash?: string | null;
  name: string;
}

export interface RequestAccountForget {
  address: string;
}

export interface RequestAccountShow {
  address: string;
  isShowing: boolean;
}

export interface RequestAccountTie {
  address: string;
  genesisHash: string | null;
}

export interface RequestAccountValidate {
  address: string;
  password: string;
}

export interface RequestDeriveCreate {
  name: string;
  genesisHash?: string | null;
  suri: string;
  parentAddress: string;
  parentPassword: string;
  password: string;
}

export interface RequestDeriveValidate {
  suri: string;
  parentAddress: string;
  parentPassword: string;
}

export interface RequestAccountExport {
  address: string;
  password: string;
}

export interface RequestAccountBatchExport {
  addresses: string[];
  password: string;
}

export interface RequestAccountList {
  anyType?: boolean;
}

export type RequestAccountSubscribe = null;

export interface RequestRpcSend {
  method: string;
  params: unknown[];
}

export interface RequestRpcSubscribe extends RequestRpcSend {
  type: string;
}

export interface RequestRpcUnsubscribe {
  method: string;
  subscriptionId: number | string;
  type: string;
}

export interface RequestSigningApprovePassword {
  id: string;
  password?: string;
  savePass: boolean;
}

export interface RequestSigningApproveSignature {
  id: string;
  signature: string;
}

export interface RequestSigningCancel {
  id: string;
}

export interface RequestSigningIsLocked {
  id: string;
}

export interface ResponseSigningIsLocked {
  isLocked: boolean;
  remainingTime: number;
}

export type RequestSigningSubscribe = null;

export interface RequestSeedCreate {
  length?: SeedLengths;
  type?: KeypairType;
  symbol?: string;
}

export interface RequestSeedValidate {
  suri: string;
  type?: KeypairType;
  symbol?: string;
}

// Responses

export type ResponseTypes = {
  [MessageType in keyof RequestSignatures]: RequestSignatures[MessageType][1]
};

export type ResponseType<TMessageType extends keyof RequestSignatures> = RequestSignatures[TMessageType][1];

interface TransportResponseMessageSub<TMessageType extends MessageTypesWithSubscriptions> {
  error?: string;
  id: string;
  response?: ResponseTypes[TMessageType];
  subscription?: SubscriptionMessageTypes[TMessageType];
}

interface TransportResponseMessageNoSub<TMessageType extends MessageTypesWithNoSubscriptions> {
  error?: string;
  id: string;
  response?: ResponseTypes[TMessageType];
}

export type TransportResponseMessage<TMessageType extends MessageTypes> =
  TMessageType extends MessageTypesWithNoSubscriptions
    ? TransportResponseMessageNoSub<TMessageType>
    : TMessageType extends MessageTypesWithSubscriptions
      ? TransportResponseMessageSub<TMessageType>
      : never;

export interface ResponseSigning {
  id: string;
  signature: string;
}

export interface ResponseDeriveValidate {
  address: string;
  suri: string;
}

export interface ResponseSeedCreate {
  address: string;
  seed: string;
}

export interface ResponseSeedValidate {
  address: string;
  suri: string;
}

export interface ResponseAccountExport {
  exportedJson: KeyringPair$Json;
}

export interface ResponseAccountsExport {
  exportedJson: KeyringPairs$Json;
}

export type ResponseRpcListProviders = ProviderList;

// Subscriptions

export type SubscriptionMessageTypes = NoUndefinedValues<{
  [MessageType in keyof RequestSignatures]: RequestSignatures[MessageType][2]
}>;

export type MessageTypesWithSubscriptions = keyof SubscriptionMessageTypes;
export type MessageTypesWithNoSubscriptions = Exclude<MessageTypes, keyof SubscriptionMessageTypes>

export interface RequestSign {
  readonly payload: SignerPayloadJSON | SignerPayloadRaw;

  sign (registry: TypeRegistry, pair: KeyringPair): { signature: string };
}

export interface RequestJsonRestore {
  file: KeyringPair$Json;
  password: string;
}

export interface RequestBatchRestore {
  file: KeyringPairs$Json;
  password: string;
}

export interface ResponseJsonRestore {
  error: string | null;
}

export type AllowedPath = typeof ALLOWED_PATH[number];

export interface ResponseJsonGetAccountInfo {
  address: string;
  name: string;
  genesisHash: string;
  type: KeypairType;
}

export interface ResponseAuthorizeList {
  list: AuthUrls;
}
