import { DAppInfo } from '~global/types';
import { keyable } from './IAssetsController';

export interface SignatureRequest {
  address: string;
  message: string;
  origin: string;
}

export interface IDAppController {
  getCurrent: () => DAppInfo;
  getCurrentDappAddress: () => string;
  fromUserConnectDApp: (origin: string, dapp: DAppInfo) => void;
  fromPageConnectDApp: (origin: string, title: string) => boolean;
  setSignatureRequest: (req: keyable, requestId: string) => void;
  getSignatureRequest: () => keyable;
  addSignRequest: (request: any, id: string) => void;
  setDappConnectedAddress: (address: string, origin: string) => void;
  setApprovedIdentityJSON: (identityJSON: string) => void;
  getApprovedIdentityJSON: () => any;
  deleteOriginAndRequests: (origin: string, call?: () => void) => void;
}
