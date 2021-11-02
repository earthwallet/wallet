import { DAppInfo } from '~global/types';
import { EarthKeyringPair } from '@earthwallet/keyring';
import { keyable } from './IAssetsController';

export interface SignatureRequest {
  address: string;
  message: string;
  origin: string;
}

export interface IDAppController {
  getCurrent: () => DAppInfo;
  fromUserConnectDApp: (origin: string, dapp: DAppInfo) => void;
  fromPageConnectDApp: (origin: string, title: string) => boolean;
  setSignatureRequest: (req: keyable) => void;
  getSignatureRequest: () => keyable;
  addSignRequest: (request: any, id: string) => void;
  setActiveAccount: (account: EarthKeyringPair & { id: string }) => void;
}
