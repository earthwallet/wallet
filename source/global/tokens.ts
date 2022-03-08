const TOKENS = [
  {
    usesPrincipal: true,
    type: 'DIP20',
    isLive: true,
    decimals: 12,
    id: 'qlttm-2yaaa-aaaak-qafvq-cai',
    name: 'Special Drawing Rights',
    symbol: 'SDR',
    tokenCanisterId: 'qlttm-2yaaa-aaaak-qafvq-cai',
    totalSupply: 'Infinite',
    logo: undefined,
  },
  {
    usesPrincipal: true,
    type: 'DIP20',
    isLive: true,
    decimals: 8,
    id: 'utozz-siaaa-aaaam-qaaxq-cai',
    name: 'Wrapped ICP',
    symbol: 'WICP',
    tokenCanisterId: 'utozz-siaaa-aaaam-qaaxq-cai',
    totalSupply: 'Infinite',
    logo: undefined,
  },
];

export const getTokenInfo = (tokenCanisterId: string) =>
  TOKENS.filter((token) => token.id === tokenCanisterId)[0] || {};

export default TOKENS;
