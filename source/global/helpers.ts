import { keyable } from '~scripts/Background/types/IAssetsController';

export const shortenAddress = (address: string, startCut = 7, endCut = 4) => {
  return (
    address.substring(0, startCut) +
    '...' +
    address.substring(address.length - endCut, address.length)
  );
};

export const parseBigIntObj = (obj: keyable) =>
  JSON.parse(stringifyWithBigInt(obj));

export const stringifyWithBigInt = (obj: keyable) =>
  JSON.stringify(obj, (_, value) =>
    typeof value === 'bigint' ? value.toString() : value
  );
