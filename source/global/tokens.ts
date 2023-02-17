import ICON_SDR from '~assets/images/icon_SDR.png';
import ICON_BNB from '~assets/images/icon_mini_bnb.png';
import ICON_AVAX from '~assets/images/icon_avalanche.svg';


const TOKENS_LIST = [
  {
    networkSymbol: 'ICP',
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
    networkSymbol: 'ICP',
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
  {
    id: '56',
    networkSymbol: 'ETH',
    name: 'Binance Smart',
    type: 'ERC20',
    icon: ICON_BNB,
    symbol: 'BSC',
    coinGeckoId: 'binancecoin',
    isLive: false,
    preGenerate: false,
    order: 8,
    evmChain: true,
    chainId: 56,
    fees: 0, // ??
    sendFees: 0,
  },
  {
    id: '43114',
    networkSymbol: 'ETH',
    name: 'Avalanche C Chain',
    type: 'ERC20',
    icon: ICON_AVAX,
    symbol: 'AVAC',
    coinGeckoId: 'avalanche',
    isLive: false,
    preGenerate: false,
    order: 14,
    evmChain: true,
    chainId: 43114,
    fees: 0,
    sendFees: 0,
  },
];

export const getTokenInfo = (tokenCanisterId: string) =>
  TOKENS_LIST.filter((token) => token.id === tokenCanisterId)[0] || {};

const LIVE_TOKENS = TOKENS_LIST.filter((token) => token.isLive);
export const getLiveTokensByNetworkSymbol = (networkSymbol: string) =>
  TOKENS_LIST.filter((token) => token.networkSymbol == networkSymbol).filter(
    (token) => token.isLive
  );

export const LIVE_TOKENS_GECKOIDs = TOKENS_LIST.filter(
  (tokenObj) => tokenObj.isLive && tokenObj.coinGeckoId != undefined
).map((tokenObj) => tokenObj.coinGeckoId);
export default LIVE_TOKENS;

export const ROCKETPOOL_CONTRACT_ADDR =
  "0xae78736Cd615f374D3085123A210448E74Fc6393".toLowerCase();