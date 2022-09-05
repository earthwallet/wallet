//should be synced with webView/src/js/config.ts
export const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
export const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY;

export const ALCHEMY_ETH_API_KEY = process.env.ALCHEMY_ETH_API_KEY;
export const ALCHEMY_POLYGON_API_KEY = process.env.ALCHEMY_POLYGON_API_KEY;

export const AIRDROP_FIREBASE_URL =
  'https://us-central1-test-earth-art.cloudfunctions.net';
export const RINKEBY_CODIFY_GAS_API =
  'https://gas-api.metaswap.codefi.network/networks/4/suggestedGasFees';
export const ETH_MAINNET_CODIFY_GAS_API =
  'https://gas-api.metaswap.codefi.network/networks/1/suggestedGasFees';
export const MATIC_MAINNET_CODIFY_GAS_API =
  'https://gas-api.metaswap.codefi.network/networks/137/suggestedGasFees';

export const POLY_ALCHEMY = `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_POLYGON_API_KEY}`;
export const ETH_MAINNET_ALCHEMY = `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_ETH_API_KEY}`;
