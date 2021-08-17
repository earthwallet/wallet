import { NetworkType } from './types';

//['ETH', 'ICP',  'DOT', 'KSM','BTC', 'LTC', 'BCH', 'BNB',];
import ICON_ETH from '~assets/images/icon_eth_mini.png';
import ICON_ICP from '~assets/images/icon_icp_details.png';
import ICON_DOT from '~assets/images/icon_icp_details.png';
import ICON_KSM from '~assets/images/icon_icp_details.png';
import ICON_BTC from '~assets/images/icon_icp_details.png';
import ICON_LTC from '~assets/images/icon_icp_details.png';
import ICON_BCH from '~assets/images/icon_icp_details.png';
import ICON_BNB from '~assets/images/icon_icp_details.png';

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
    coingeckoid: 'ethereum'
  },
  {
    name: 'Internet Computer',
    icon: ICON_ICP,
    symbol: 'ICP',
    coingeckoid: 'internet-computer'
  },
  {
    name: 'Polkadot',
    icon: ICON_DOT,
    symbol: 'DOT',
    coingeckoid: 'polkadot'
  },
  {
    name: 'Kusama',
    icon: ICON_KSM,
    symbol: 'KSM',
    coingeckoid: 'kusama'
  },
  {
    name: 'Bitcoin',
    icon: ICON_BTC,
    symbol: 'BTC',
    coingeckoid: 'bitcoin'
  },
  {
    name: 'Litecoin',
    icon: ICON_LTC,
    symbol: 'LTC',
    coingeckoid: 'litecoin'
  },
  {
    name: 'Bitcoin Cash',
    icon: ICON_BCH,
    symbol: 'BCH',
    coingeckoid: 'bitcoin-cash'
  },
  {
    name: 'Binance',
    icon: ICON_BNB,
    symbol: 'BNB',
    coingeckoid: 'binancecoin'
  },
];
