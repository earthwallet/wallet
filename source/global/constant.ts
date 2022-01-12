import { NetworkType } from './types';
import ICON_ETH from '~assets/images/icon_eth_mini.png';
import ICON_ICP from '~assets/images/icon_icp_details.png';
import ICON_ICP_ED25519 from '~assets/images/icon_icp_ed25519.png';
import ICON_DOT from '~assets/images/icon_mini_dot.png';
import ICON_KSM from '~assets/images/icon_mini_ksm.png';
import ICON_BTC from '~assets/images/icon_btc_mini.png';
import ICON_LTC from '~assets/images/icon_mini_ltc.png';
import ICON_BCH from '~assets/images/icon_mini_bch.png';
import ICON_BNB from '~assets/images/icon_mini_bnb.png';
import ICON_BTG from '~assets/images/icon_btg.png';
import ICON_MATIC from '~assets/images/icon_matic.png';
import ICON_AVAX from '~assets/images/icon_avalanche.svg';
import ICON_DOGE from '~assets/images/icon_doge.png';
import ICON_EARTH from '~assets/images/icon-512.png';

export const STATE_PORT = 'EARTH_WALLET';

export const TEST_NETWORKS = [NetworkType.BitcoinTestnet, NetworkType.Rinkeby];

export const CGECKO_PRICE_API = 'https://api.coingecko.com/api/v3/simple/price';

export const DEFAULT_SYMBOL = 'ETH';

export const DEFAULT_SYMBOLS = [
  {
    name: 'Bitcoin',
    icon: ICON_BTC,
    symbol: 'BTC',
    coinGeckoId: 'bitcoin',
    isLive: true,
    preGenerate: true,
    primary: true,
    order: 1,
  },
  {
    name: 'Internet Computer',
    icon: ICON_ICP,
    symbol: 'ICP',
    coinGeckoId: 'internet-computer',
    isLive: true,
    preGenerate: true,
    order: 0,
  },
  {
    name: 'ICP Ed25519',
    icon: ICON_ICP_ED25519,
    symbol: 'ICP_Ed25519',
    coinGeckoId: 'internet-computer',
    isLive: false,
    preGenerate: false,
    order: -1,
  },
  {
    name: 'Ethereum',
    icon: ICON_ETH,
    symbol: 'ETH',
    coinGeckoId: 'ethereum',
    isLive: false,
    preGenerate: true,
    order: 2,
  },
  {
    name: 'Polkadot',
    icon: ICON_DOT,
    symbol: 'DOT',
    coinGeckoId: 'polkadot',
    isLive: false,
    preGenerate: true,
    order: 3,
  },
  {
    name: 'Kusama',
    icon: ICON_KSM,
    symbol: 'KSM',
    coinGeckoId: 'kusama',
    isLive: false,
    preGenerate: true,
    order: 4,
  },
  {
    name: 'Litecoin',
    icon: ICON_LTC,
    symbol: 'LTC',
    coinGeckoId: 'litecoin',
    isLive: false,
    preGenerate: true,
    order: 5,
  },
  {
    name: 'Bitcoin Cash',
    icon: ICON_BCH,
    symbol: 'BCH',
    coinGeckoId: 'bitcoin-cash',
    isLive: false,
    preGenerate: true,
    order: 6,
  },
  {
    name: 'Binance',
    icon: ICON_BNB,
    symbol: 'BNB',
    coinGeckoId: 'binancecoin',
    isLive: false,
    preGenerate: true,
    order: 7,
  },
  {
    name: 'Binance Smart',
    icon: ICON_BNB,
    symbol: 'BSC',
    coinGeckoId: 'binancecoin',
    isLive: false,
    preGenerate: false,
    order: 8,
    evmChain: true,
  },
  {
    name: 'Polygon',
    icon: ICON_MATIC,
    symbol: 'MATIC',
    coinGeckoId: 'polygon',
    isLive: false,
    preGenerate: false,
    order: 9,
    evmChain: true,
  },
  {
    name: 'Bitcoin Gold',
    icon: ICON_BTG,
    symbol: 'BTG',
    coinGeckoId: 'bitcoin-gold',
    isLive: false,
    preGenerate: true,
    order: 10,
  },
  {
    name: 'Avalanche',
    icon: ICON_AVAX,
    symbol: 'AVAX',
    coinGeckoId: 'avalanche',
    isLive: false,
    preGenerate: true,
    order: 11,
  },
  {
    name: 'Dogecoin',
    icon: ICON_DOGE,
    symbol: 'DOGE',
    coinGeckoId: 'dogecoin',
    isLive: false,
    preGenerate: true,
    order: 12,
  },
  {
    name: 'Avalanche P Chain',
    icon: ICON_AVAX,
    symbol: 'AVAP',
    coinGeckoId: 'avalanche',
    isLive: false,
    preGenerate: true,
    order: 13,
  },
  {
    name: 'Avalanche C Chain',
    icon: ICON_AVAX,
    symbol: 'AVAC',
    coinGeckoId: 'avalanche',
    isLive: false,
    preGenerate: false,
    order: 14,
    evmChain: true,
  },
  {
    name: 'Earth',
    icon: ICON_EARTH,
    symbol: 'EARTH',
    coinGeckoId: 'avalanche',
    isLive: true,
    preGenerate: false,
    order: 15,
    icpChain: true,
  },
];

export const GROUP_ID_SYMBOL = 'BTC';

export const PREGENERATE_SYMBOLS = DEFAULT_SYMBOLS.filter(
  (symbolObj) => symbolObj.preGenerate
)
  .sort((a, b) => a.order - b.order)
  .map((symbolObj) => symbolObj.symbol);

export const LIVE_SYMBOLS = DEFAULT_SYMBOLS.filter(
  (symbolObj) => symbolObj.isLive
)
  .sort((a, b) => a.order - b.order)
  .map((symbolObj) => symbolObj.symbol);

export const LIVE_SYMBOLS_OBJS = DEFAULT_SYMBOLS.filter(
  (symbolObj) => symbolObj.isLive
)
  .sort((a, b) => a.order - b.order)
  .map((symbolObj) => symbolObj);

export const LIVE_SYMBOLS_GECKOIDs = DEFAULT_SYMBOLS.filter(
  (symbolObj) => symbolObj.isLive
)
  .sort((a, b) => a.order - b.order)
  .map((symbolObj) => symbolObj.coinGeckoId);

export const DEFAULT_ICP_FEES = 0.0001;
