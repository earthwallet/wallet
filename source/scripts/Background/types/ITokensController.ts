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
  swap: (token1: string, token2: string, amount: number) => Promise<keyable>;
  stake: (
    token1: string,
    token2: string,
    amount: number,
    callback?: (message?: string) => void
  ) => Promise<keyable>;
}
