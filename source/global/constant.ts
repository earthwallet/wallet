import { NetworkType } from './types';

//['ETH', 'ICP',  'DOT', 'KSM','BTC', 'LTC', 'BCH', 'BNB',];
import ICON_ETH from '~assets/images/icon_eth_mini.png';
import ICON_ICP from '~assets/images/icon_icp_details.png';
import ICON_DOT from '~assets/images/icon_mini_dot.png';
import ICON_KSM from '~assets/images/icon_mini_ksm.png';
import ICON_BTC from '~assets/images/icon_btc_mini.png';
import ICON_LTC from '~assets/images/icon_mini_ltc.png';
import ICON_BCH from '~assets/images/icon_mini_bch.png';
import ICON_BNB from '~assets/images/icon_mini_bnb.png';

export const STATE_PORT = 'EARTH_WALLET';

export const TEST_NETWORKS = [NetworkType.BitcoinTestnet, NetworkType.Rinkeby];

export const CGECKO_PRICE_API = 'https://api.coingecko.com/api/v3/simple/price';

export const DEFAULT_SYMBOL = 'ETH';

export const DEFAULT_SYMBOLS = [
  {
    name: 'Ethereum',
    icon: ICON_ETH,
    symbol: 'ETH',
    primary: true,
    coinGeckoId: 'ethereum',
    isLive: false,
  },
  {
    name: 'Internet Computer',
    icon: ICON_ICP,
    symbol: 'ICP',
    coinGeckoId: 'internet-computer',
    isLive: true,
  },
  {
    name: 'Polkadot',
    icon: ICON_DOT,
    symbol: 'DOT',
    coinGeckoId: 'polkadot',
  },
  {
    name: 'Kusama',
    icon: ICON_KSM,
    symbol: 'KSM',
    coinGeckoId: 'kusama',
  },
  {
    name: 'Bitcoin',
    icon: ICON_BTC,
    symbol: 'BTC',
    coinGeckoId: 'bitcoin',
    isLive: true,
  },
  {
    name: 'Litecoin',
    icon: ICON_LTC,
    symbol: 'LTC',
    coinGeckoId: 'litecoin',
  },
  {
    name: 'Bitcoin Cash',
    icon: ICON_BCH,
    symbol: 'BCH',
    coinGeckoId: 'bitcoin-cash',
    isLive: false,
  },
  {
    name: 'Binance',
    icon: ICON_BNB,
    symbol: 'BNB',
    coinGeckoId: 'binancecoin',
    isLive: false,
  },
];

export const LIVE_SYMBOLS = DEFAULT_SYMBOLS.filter(
  (symbolObj) => symbolObj.isLive
).map((symbolObj) => symbolObj.symbol);

export const LIVE_SYMBOLS_OBJS = DEFAULT_SYMBOLS.filter(
  (symbolObj) => symbolObj.isLive
).map((symbolObj) => symbolObj);

export const LIVE_SYMBOLS_GECKOIDs = DEFAULT_SYMBOLS.filter(
  (symbolObj) => symbolObj.isLive
).map((symbolObj) => symbolObj.coinGeckoId);
