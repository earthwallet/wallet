import { DAppInfo } from '~global/types';
import { EarthKeyringPair } from '@earthwallet/keyring';


export interface SignatureRequest {
  address: string;
  message: string;
  origin: string;
}

export interface IDAppController {
  getCurrent: () => DAppInfo;
  fromUserConnectDApp: (origin: string, dapp: DAppInfo) => void;
  fromPageConnectDApp: (origin: string, title: string) => boolean;
  setSignatureRequest: (req: SignatureRequest) => void;
  getSignatureRequest: () => SignatureRequest;
  setActiveAccount: (account: EarthKeyringPair & { id: string }) => void;
}
