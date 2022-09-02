import { decodeTokenId } from '@earthwallet/assets';
import axios, { AxiosRequestConfig } from 'axios';
import { keyable } from '~scripts/Background/types/IAssetsController';
var web3 = require('web3');

const ETHERSCAN_API_KEY = 'C64M8N55WWFJHHT4WF3ZNVU7SYDXFG4QT1';
const ALCHEMY_API_KEY = 'WGaCcGcGiHHQrxew6bZZ9r2qMsP8JS80';

const AIRDROP_FIREBASE_URL =
  'https://us-central1-earthwallet-1f3ab.cloudfunctions.net';

export const registerExtensionAndAccounts = async (
  extensionId: string,
  accounts: keyable
) => {
  if (accounts.length == 0) {
    return 'Not enough accounts';
  }

  console.log(accounts.join('&accounts='), 'registerExtensionForAirdrop');
  const config: AxiosRequestConfig = {
    method: 'get',
    url: `${AIRDROP_FIREBASE_URL}/register?extensionId=${extensionId}&accounts=${accounts.join(
      '&accounts='
    )}`,
    headers: {},
  };

  let serverRes;
  try {
    const response = await axios(config);
    serverRes = response.data;
  } catch (error) {
    serverRes = error;
  }

  return serverRes;
};

export const statusExtension = async (extensionId: string) => {
  const config: AxiosRequestConfig = {
    method: 'get',
    url: `${AIRDROP_FIREBASE_URL}/status?extensionId=${extensionId}`,
    headers: {},
  };
  let serverRes;
  try {
    const response = await axios(config);
    serverRes = response.data;
  } catch (error) {
    serverRes = error;
  }

  return serverRes;
};

export const verifyExtension = async (extensionId: string) => {
  const config: AxiosRequestConfig = {
    method: 'get',
    url: `${AIRDROP_FIREBASE_URL}/verify?extensionId=${extensionId}`,
    headers: {},
  };
  let serverRes;
  try {
    const response = await axios(config);
    serverRes = response.data;
  } catch (error) {
    serverRes = error;
  }

  return serverRes;
};

export const isAirDropEnabled = async () => {
  const config: AxiosRequestConfig = {
    method: 'get',
    url: `${AIRDROP_FIREBASE_URL}/airdropEnabled`,
    headers: {},
  };
  let serverRes;
  try {
    const response = await axios(config);
    serverRes = response.data;
  } catch (error) {
    serverRes = error;
  }
  return serverRes;
};

export const getCTA = async (address: string) => {
  const config: AxiosRequestConfig = {
    method: 'get',
    url: `${AIRDROP_FIREBASE_URL}/getCTA?address=${address}`,
    headers: {},
  };

  let serverRes;
  try {
    const response = await axios(config);
    serverRes = response.data;
  } catch (error) {
    serverRes = error;
  }
  return serverRes;
};

export const getBalanceMatic = async (address: string) => {
  const data = JSON.stringify({
    jsonrpc: '2.0',
    method: 'eth_getBalance',
    params: [address, 'latest'],
    id: 0,
  });

  const config: AxiosRequestConfig = {
    method: 'post',
    url: 'https://polygon-mainnet.g.alchemy.com/v2/WQY8CJqsPNCqhjPqPfnPApgc_hXpnzGc',
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
  };

  let serverRes;
  try {
    const response = await axios(config);
    serverRes = response.data;
  } catch (error) {
    serverRes = error;
  }
  const balance = web3.utils.hexToNumberString(serverRes.result);

  return balance;
};

export const getDefaultTokensErc20_ETH = async () => {
  const data = JSON.stringify({
    jsonrpc: '2.0',
    method: 'alchemy_getTokenBalances',
    headers: {
      'Content-Type': 'application/json',
    },
    params: ['0x29bc7f4bfc7301b3ddb5c9c4348360fc0ad52ca8', 'DEFAULT_TOKENS'],
    id: 42,
  });

  const config: AxiosRequestConfig = {
    method: 'post',
    url: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
  };
  var defaultTokens = [];
  var metadata: keyable;
  var serverRes = [];
  // Make the request and print the formatted response:
  const response = await axios(config);

  const balances = response['data']['result'];

  defaultTokens = balances['tokenBalances'];

  // Counter for SNo of final output
  let i = 0;

  // Loop through all tokens with non-zero balance
  for (const token of defaultTokens) {
    // Get balance of token

    const metadataParams = JSON.stringify({
      jsonrpc: '2.0',
      method: 'alchemy_getTokenMetadata',
      params: [`${token['contractAddress']}`],
      id: 42,
    });

    //  const config: AxiosRequestConfig = {

    const metadataConfig: AxiosRequestConfig = {
      method: 'post',
      url: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: metadataParams,
    };

    const respo2 = await axios(metadataConfig);
    metadata = respo2.data.result;
    // Compute token balance in human-readable format

    serverRes[i] = {
      ...token,
      ...metadata,
    };
    i++;
    // Print name, balance, and symbol of token
    console.log(
      `${i}. ${metadata['name']}: ${metadata['symbol']}`,
      'getDefaultTokensErc20_ETH'
    );
  }
  return serverRes;
};

export const getBalanceERC20_ETH = async (address: string) => {
  const data = JSON.stringify({
    jsonrpc: '2.0',
    method: 'alchemy_getTokenBalances',
    headers: {
      'Content-Type': 'application/json',
    },
    params: [
      address,
      'DEFAULT_TOKENS',
    ],
    id: 42,
  });

  const config: AxiosRequestConfig = {
    method: 'post',
    url: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
  };
  var defaultTokenBalances = [];
  var serverRes = [];
  // Make the request and print the formatted response:
  const response = await axios(config);

  // Get balances
  const balances = response['data']['result'];

  // Remove tokens with zero balance
  defaultTokenBalances = balances['tokenBalances'].map((token: keyable) => ({
    ...token,
    tokenBalance: web3.utils.hexToNumberString(token.tokenBalance),
  }));

  // Counter for SNo of final output
  let i = 0;

  // Loop through all tokens with non-zero balance
  for (const token of defaultTokenBalances) {
    // Get balance of token
    let balance = token['tokenBalance'];

    serverRes[i] = {
      ...token,
      ...{ balance },
    };
    i++;
    // Print name, balance, and symbol of token
    console.log(`${i}. ${balance} getBalanceERC20_ETH`);
  }
  return serverRes;
};

export const getBalance_ETH = async (address: string) => {
  const data = JSON.stringify({
    jsonrpc: '2.0',
    method: 'eth_getBalance',
    params: [address, 'latest'],
    id: 0,
  });

  const config: AxiosRequestConfig = {
    method: 'post',
    url: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
  };

  let serverRes;
  try {
    const response = await axios(config);
    serverRes = response.data;
  } catch (error) {
    serverRes = error;
  }
  const balance = web3.utils.hexToNumberString(serverRes.result);

  return balance;
};

export const getFeesExtended = async (symbol: string, estimateGas = 21000) => {
  let serverRes;
  let fees: keyable[] = [];

  if (symbol == 'ETH') {
    const config: AxiosRequestConfig = {
      method: 'get',
      url: 'https://gas-api.metaswap.codefi.network/networks/1/suggestedGasFees',
      headers: {},
    };

    try {
      const response = await axios(config);
      serverRes = response.data;

      const totalSafeLowGas =
        estimateGas *
        (parseFloat(serverRes?.estimatedBaseFee) +
          parseFloat(serverRes?.low?.suggestedMaxPriorityFeePerGas));
      const totalStandardGas =
        estimateGas *
        (parseFloat(serverRes?.estimatedBaseFee) +
          parseFloat(serverRes?.medium?.suggestedMaxPriorityFeePerGas));
      const totalFastGas =
        estimateGas *
        (parseFloat(serverRes?.estimatedBaseFee) +
          parseFloat(serverRes?.high?.suggestedMaxPriorityFeePerGas));
      console.log(response, config, 'getFeesExtended');
      console.log(
        totalSafeLowGas,
        serverRes?.low?.suggestedMaxPriorityFeePerGas,
        'getFeesExtended'
      );

      //totalGas for a txn = (maxPriorityFeePerGas + baseFee) * estimateGas
      // maxFeePerGas = web3.utils.fromWei(priorityFees['fast']['maxFee'], 'gwei') * estimateGas
      fees = [
        {
          label: 'Low',
          ...serverRes?.low,
          gas: totalSafeLowGas / Math.pow(10, 9),
          maxFee:
            (estimateGas * parseFloat(serverRes?.low.suggestedMaxFeePerGas)) /
            Math.pow(10, 9),
        },
        {
          label: 'Standard',
          ...serverRes?.medium,
          gas: totalStandardGas / Math.pow(10, 9),
          maxFee:
            (estimateGas *
              parseFloat(serverRes?.medium.suggestedMaxFeePerGas)) /
            Math.pow(10, 9),
        },
        {
          label: 'Fast',
          ...serverRes?.high,
          gas: totalFastGas / Math.pow(10, 9),
          maxFee:
            (estimateGas * parseFloat(serverRes?.high.suggestedMaxFeePerGas)) /
            Math.pow(10, 9),
        },
      ];
    } catch (error) {
      serverRes = error;
      console.log(error, 'getFeesExtended');
    }
  } else if (symbol == 'MATIC') {
    const config: AxiosRequestConfig = {
      method: 'get',
      url: 'https://gasstation-mainnet.matic.network/v2',
      headers: {},
    };

    try {
      const response = await axios(config);
      serverRes = response.data;
      const totalSafeLowGas =
        estimateGas *
        (serverRes?.estimatedBaseFee + serverRes?.low?.maxPriorityFee);
      const totalStandardGas =
        estimateGas *
        (serverRes?.estimatedBaseFee + serverRes?.standard?.maxPriorityFee);
      const totalFastGas =
        estimateGas *
        (serverRes?.estimatedBaseFee + serverRes?.fast?.maxPriorityFee);

      //totalGas for a txn = (maxPriorityFeePerGas + baseFee) * estimateGas
      // maxFeePerGas = web3.utils.fromWei(priorityFees['fast']['maxFee'], 'gwei') * estimateGas
      fees = [
        {
          label: 'Low',
          ...serverRes?.safeLow,
          gas: totalSafeLowGas / Math.pow(10, 9),
        },
        {
          label: 'Standard',
          ...serverRes?.standard,
          gas: totalStandardGas / Math.pow(10, 9),
        },
        {
          label: 'Fast',
          ...serverRes?.fast,
          gas: totalFastGas / Math.pow(10, 9),
        },
      ];
    } catch (error) {
      serverRes = error;
    }
  }

  console.log(serverRes);
  //Calculating the total transaction fee works as follows: Gas units (limit) * (Base fee + Tip)

  return fees;
};

export const getFeesExtended_MATIC = async () => {
  let serverRes;

  const config: AxiosRequestConfig = {
    method: 'get',
    url: 'https://gasstation-mainnet.matic.network/v2',
    headers: {},
  };

  try {
    const response = await axios(config);
    serverRes = response.data;
  } catch (error) {
    serverRes = error;
  }

  return serverRes;
};

export const getTransactions_ETH = async (address: string) => {
  const data = JSON.stringify({
    jsonrpc: '2.0',
    id: 0,
    method: 'alchemy_getAssetTransfers',
    params: [
      {
        fromBlock: '0x0',
        fromAddress: address,
        excludeZeroValue: false,
        category: ['external'],
      },
    ],
  });
  const toTransfersData = {
    jsonrpc: '2.0',
    id: 0,
    method: 'alchemy_getAssetTransfers',
    params: [
      {
        fromBlock: '0x0',
        toAddress: address,
        excludeZeroValue: false,
        category: ['external'],
      },
    ],
  };
  const config: AxiosRequestConfig = {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: data,
    url: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
  };
  const toConfig: AxiosRequestConfig = {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: toTransfersData,
    url: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_API_KEY}`,
  };

  let serverRes: any = [];
  try {
    const response = await axios(config);
    serverRes = response.data?.result?.transfers;
  } catch (error) {
    serverRes = error;
  }
  try {
    const responseTo = await axios(toConfig);
    if (responseTo.data?.result?.transfers != undefined) {
      serverRes = [...serverRes, ...responseTo.data?.result?.transfers];
    }
  } catch (error) {
    serverRes = error;
  }
  const txns = serverRes
    .map((tx: { blockNum: any }) => ({
      ...tx,
      block: web3.utils.hexToNumberString(tx.blockNum),
    }))
    .sort((a: { block: number }, b: { block: number }) => b.block - a.block);
  console.log(serverRes, 'getTransactions');
  return txns;
};

export const getERC721_ETH = async (address: string) => {
  const config: AxiosRequestConfig = {
    method: 'get',
    url: `https://api.etherscan.io/api?module=account&action=tokennfttx&address=${address}&sort=asc&apikey=${ETHERSCAN_API_KEY}`,
    headers: {},
  };

  let serverRes;
  try {
    const response = await axios(config);
    serverRes = response.data?.result;
  } catch (error) {
    serverRes = error;
  }
  return serverRes;
};

export const getERC20Info_ETH = async (address: string) => {
  const config: AxiosRequestConfig = {
    method: 'get',
    url: `https://api.coingecko.com/api/v3/coins/ethereum/contract/${address}`,
    headers: {},
  };

  let serverRes;
  try {
    const response = await axios(config);
    serverRes = response.data;
  } catch (error) {
    serverRes = error;
  }
  return serverRes;
};

//https://docs.opensea.io/reference/retrieving-a-single-asset
export const getETHAssetInfo = async (asset: keyable) => {
  const config: AxiosRequestConfig = {
    method: 'GET',
    url: `https://eth-mainnet.g.alchemy.com/nft/v2/${ALCHEMY_API_KEY}/getNFTMetadata?contractAddress=${asset.contractAddress}&tokenId=${asset.tokenIndex}`,
    headers: {},
  };

  let serverRes;
  try {
    const response = await axios(config);
    serverRes = response.data;
  } catch (error) {
    serverRes = error;
  }
  return serverRes;
};

export const getTokenInfoFromTokenId = (nftId: string) => {
  if (nftId.includes('_WITH_')) {
    const index = nftId.split('_WITH_', 2)[1];
    const contractAddress = nftId.split('_WITH_', 2)[0];
    return { index, contractAddress, canister: '' };
  } else {
    return decodeTokenId(nftId);
  }
};
