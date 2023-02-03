//should be synced with webView/src/js/config.ts
export const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
export const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY;

export const ALCHEMY_ETH_API_KEY = process.env.ALCHEMY_ETH_API_KEY;
export const ALCHEMY_POLYGON_API_KEY = process.env.ALCHEMY_POLYGON_API_KEY;
export const BTC_DOGE_MAINNET_KEY = process.env.BTC_DOGE_SOHO_API || '';

export const AIRDROP_FIREBASE_URL =
  'https://us-central1-test-earth-art.cloudfunctions.net';
export const RINKEBY_CODIFY_GAS_API =
  'https://gas-api.metaswap.codefi.network/networks/4/suggestedGasFees';
export const ETH_MAINNET_CODIFY_GAS_API =
  'https://gas-api.metaswap.codefi.network/networks/1/suggestedGasFees';
export const MATIC_MAINNET_CODIFY_GAS_API =
  'https://gas-api.metaswap.codefi.network/networks/137/suggestedGasFees';

export const POLY_ALCHEMY_URL = `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_POLYGON_API_KEY}`;
export const ETH_MAINNET_ALCHEMY_URL = `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_ETH_API_KEY}`;
export const ETH_GOERLI_TEST_ALCHEMY_URL = process.env.GOERLI_TEST_URL;
export const UNSTOPPABLE_DOMAIN_API = process.env.UNSTOPPABLE_DOMAIN_API;
