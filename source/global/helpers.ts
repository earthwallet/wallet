export const shortenAddress = (address: string, startCut = 7, endCut = 4) => {
  return (
    address.substring(0, startCut) +
    '...' +
    address.substring(address.length - endCut, address.length)
  );
};
