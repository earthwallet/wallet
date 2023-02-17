import { NetworkSymbol, NETWORK_TITLE } from './types';
import ICON_ETH from '~assets/images/icon_eth.png';
import ICON_ICP from '~assets/images/icon_icp_details.png';
import ICON_ICP_ED25519 from '~assets/images/icon_icp_ed25519.png';
import ICON_DOT from '~assets/images/icon_mini_dot.png';
import ICON_KSM from '~assets/images/icon_mini_ksm.png';
import ICON_BTC from '~assets/images/icon_btc_mini.png';
import ICON_LTC from '~assets/images/icon_mini_ltc.png';
import ICON_BCH from '~assets/images/icon_mini_bch.png';
import ICON_BNB from '~assets/images/icon_mini_bnb.png';
import ICON_BTG from '~assets/images/icon_btg.png';
import ICON_AVAX from '~assets/images/icon_avalanche.svg';
import ICON_DOGE from '~assets/images/icon_doge.png';
import ICON_MATIC from '~assets/images/icon_matic.png';

export const STATE_PORT = 'EARTH_WALLET';

export const TEST_NETWORKS = [
  NETWORK_TITLE[NetworkSymbol.BitcoinTestnet],
  NETWORK_TITLE[NetworkSymbol.Rinkeby],
];

/* Attribution: API provided by https://www.coingecko.com/en/api/documentation */

/* Attribution: API provided by https://www.coingecko.com/en/api/documentation */

export const CGECKO_PRICE_API = 'https://api.coingecko.com/api/v3/simple/price';

export const DEFAULT_GROUP_SYMBOL = 'BTC';

// once a symbol is marked isLive true, it shouldnt be marked as isLive false
// isActive networks will be marked active for user on create or import

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
    isActive: true,
  },
  {
    name: 'Internet Computer',
    icon: ICON_ICP,
    symbol: 'ICP',
    coinGeckoId: 'internet-computer',
    isLive: true,
    preGenerate: true,
    order: 0,
    addressTitle: 'Account Id',
    addressType: 'accountId',
    isActive: true,
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
    isLive: true,
    preGenerate: true,
    order: 2,
    isActive: true,
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
    name: "Polygon",
    icon: ICON_MATIC,
    symbol: "MATIC",
    coinGeckoId: "matic-network",
    isLive: true,
    isActive: true,
    preGenerate: true,
    order: 9,
    evmChain: true,
    chainId: 137,
  },
];

export const GROUP_ID_SYMBOL = 'BTC';

export const PREGENERATE_SYMBOLS = DEFAULT_SYMBOLS.filter(
  (symbolObj) => symbolObj.preGenerate
)
  .sort((a, b) => a.order - b.order)
  .map((symbolObj) => symbolObj.symbol);

export const ACTIVE_SYMBOLS = DEFAULT_SYMBOLS.filter(
  (symbolObj) => symbolObj.isActive
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

export const getInfoBySymbol = (symbol: string) =>
  DEFAULT_SYMBOLS.filter((symbolObj) => symbolObj.isLive)
    .sort((a, b) => a.order - b.order)
    .map((symbolObj) => symbolObj)
    .filter((symbolObj) => symbolObj.symbol === symbol)[0];

export const LIVE_SYMBOLS_GECKOIDs = DEFAULT_SYMBOLS.filter(
  (symbolObj) => symbolObj.isLive
)
  .sort((a, b) => a.order - b.order)
  .map((symbolObj) => symbolObj.coinGeckoId);

export const DEFAULT_ICP_FEES = 0.0001;
