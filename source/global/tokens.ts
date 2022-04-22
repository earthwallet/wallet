import ICON_SDR from '~assets/images/icon_SDR.png';

const TOKENS_LIST = [
  {
    usesPrincipal: true,
    type: 'DIP20',
    isLive: true,
    decimals: 12,
    id: 'cyiep-riaaa-aaaam-qadnq-cai',
    name: 'SDR',
    symbol: 'SDR',
    wrappedSymbol: 'XDR',
    tokenCanisterId: 'cyiep-riaaa-aaaam-qadnq-cai',
    totalSupply: 'Infinite',
    icon: ICON_SDR,
    fees: 0.0002,
    mintMethod: 'mint_by_icp',
    addressType: 'principal',
    addressTitle: 'Principal Id',
    sendFees: 0.002,
  },
  {
    usesPrincipal: true,
    type: 'DIP20',
    isLive: false,
    decimals: 8,
    id: 'utozz-siaaa-aaaam-qaaxq-cai',
    name: 'Wrapped ICP',
    symbol: 'WICP',
    wrappedSymbol: 'ICP',
    tokenCanisterId: 'utozz-siaaa-aaaam-qaaxq-cai',
    totalSupply: 'Infinite',
    icon: undefined,
    fees: 0.0001,
    mintMethod: 'mint',
    addressType: 'principal',
    addressTitle: 'Principal Id',
    sendFees: 0,
  },
];

export const getTokenInfo = (tokenCanisterId: string) =>
  TOKENS_LIST.filter((token) => token.id === tokenCanisterId)[0] || {};

const LIVE_TOKENS = TOKENS_LIST.filter((token) => token.isLive);

export default LIVE_TOKENS;
