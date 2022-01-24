//import { EarthKeyringPair } from '@earthwallet/keyring';

export interface ITokensController {
  getTokens: (callback?: (address: string) => void) => Promise<void>;
  updateTokensOfNetwork: (
    groupId: string,
    symbols: string[],
    status: boolean,
    callback?: (address?: string) => void
  ) => Promise<void>;
}
