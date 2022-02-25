const TOKENS = [
  {
    usesPrincipal: true,
    type: 'DIP20',
    isLive: true,
    decimals: 8,
    fee: '1',
    feeTo: 'ait2m-zxajw-p2dgm-alxbb-yaqkq-s56u5-hwoi6-xq2ws-blrxy-i4en3-gae',
    id: 'qlttm-2yaaa-aaaak-qafvq-cai',
    name: 'Special Drawing Rights',
    owner: 'ait2m-zxajw-p2dgm-alxbb-yaqkq-s56u5-hwoi6-xq2ws-blrxy-i4en3-gae',
    symbol: 'SDR',
    tokenCanisterId: 'qlttm-2yaaa-aaaak-qafvq-cai',
    totalSupply: '12910005000000',
  },
];

export const getTokenInfo = (tokenCanisterId: string) =>
  TOKENS.filter((token) => token.id === tokenCanisterId)[0] || {};

export default TOKENS;
