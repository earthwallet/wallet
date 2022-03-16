const TOKENS = [
  {
    usesPrincipal: true,
    type: 'DIP20',
    isLive: true,
    decimals: 12,
    id: 'cyiep-riaaa-aaaam-qadnq-cai',
    name: 'Cycles-Special Drawing Rights',
    symbol: 'SDR',
    wrappedSymbol: 'XDR',
    tokenCanisterId: 'cyiep-riaaa-aaaam-qadnq-cai',
    totalSupply: 'Infinite',
    logo: undefined,
    fees: 0.0002,
    mintMethod: 'mint_by_icp',
  },
  {
    usesPrincipal: true,
    type: 'DIP20',
    isLive: true,
    decimals: 8,
    id: 'utozz-siaaa-aaaam-qaaxq-cai',
    name: 'Wrapped ICP',
    symbol: 'WICP',
    wrappedSymbol: 'ICP',
    tokenCanisterId: 'utozz-siaaa-aaaam-qaaxq-cai',
    totalSupply: 'Infinite',
    logo: undefined,
    fees: 0.0001,
    mintMethod: 'mint',
  },
];

export const getTokenInfo = (tokenCanisterId: string) =>
  TOKENS.filter((token) => token.id === tokenCanisterId)[0] || {};

export default TOKENS;
