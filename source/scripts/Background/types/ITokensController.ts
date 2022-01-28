//import { EarthKeyringPair } from '@earthwallet/keyring';

import { keyable } from './IAssetsController';

export interface ITokensController {
  getTokenBalances: (address: string) => Promise<void>;
  getTokens: (callback?: (address: string) => void) => Promise<void>;
  updateTokensOfNetwork: (
    groupId: string,
    symbols: string[],
    status: boolean,
    callback?: (address?: string) => void
  ) => Promise<void>;
  getPair: (token1: string, token2: string) => Promise<keyable>;
  mint: (token1: string, token2: string) => Promise<keyable>;

}
