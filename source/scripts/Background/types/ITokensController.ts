//import { EarthKeyringPair } from '@earthwallet/keyring';

export interface ITokensController {
  getTokens: (callback?: (address: string) => void) => Promise<void>;
}
