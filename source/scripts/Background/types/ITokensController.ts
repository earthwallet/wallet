//import { EarthKeyringPair } from '@earthwallet/keyring';

export interface ITokensController {
  getTokenBalances: (address: string) => Promise<void>;
  getTokens: (callback?: (address: string) => void) => Promise<void>;
  updateTokensOfNetwork: (
    groupId: string,
    symbols: string[],
    status: boolean,
    callback?: (address?: string) => void
  ) => Promise<void>;
}
