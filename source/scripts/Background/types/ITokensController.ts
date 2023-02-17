
import { keyable } from './IAssetsController';

export interface ITokensController {
  getTokenBalances: (address: string) => Promise<void>;
  updateERC20PriceAndMeta: (
    contractAddress: string,
    symbol: string
  ) => Promise<void>;
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
  createMintTx: ({
    from,
    to,
    fromAmount,
    address,
    pairRatio,
  }: {
    from: string;
    to: string;
    fromAmount: string;
    address: string;
    pairRatio: string;
  }) => Promise<string>;
  mintToken: (
    txnId: string,
    identityJSON: string,
    callback?: (path: string) => void
  ) => Promise<void>;
  transferToken: (
    identityJSON: string,
    tokenId: string,
    recipient: string,
    amount: number,
    address: string,
    callback?: (path: string) => void
  ) => Promise<keyable>;
}
