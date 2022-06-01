import { decodeTokenId } from '@earthwallet/assets';
import axios, { AxiosRequestConfig } from 'axios';
import { keyable } from '~scripts/Background/types/IAssetsController';
var web3 = require('web3');

const AIRDROP_FIREBASE_URL =
  'https://us-central1-test-earth-art.cloudfunctions.net';

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

export const getBalanceETH = async (address: string) => {
  const data = JSON.stringify({
    jsonrpc: '2.0',
    method: 'eth_getBalance',
    params: [address, 'latest'],
    id: 0,
  });

  const config: AxiosRequestConfig = {
    method: 'post',
    url: 'https://eth-mainnet.alchemyapi.io/v2/WGaCcGcGiHHQrxew6bZZ9r2qMsP8JS80',
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

export const getFeesExtended = async (symbol: string) => {
  let serverRes;
  let fees: keyable[] = [];
  const estimateGas = 21000;

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

export const getERC721 = async (address: string) => {
  const config: AxiosRequestConfig = {
    method: 'get',
    url: `https://api.etherscan.io/api?module=account&action=tokennfttx&address=${address}&sort=asc&apikey=C64M8N55WWFJHHT4WF3ZNVU7SYDXFG4QT1`,
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

//https://docs.opensea.io/reference/retrieving-a-single-asset
export const getETHAssetInfo = async (asset: keyable) => {
  const config: AxiosRequestConfig = {
    method: 'GET',
    url: `https://api.opensea.io/api/v1/asset/${asset.contractAddress}/${asset.tokenIndex}/`,
    params: { include_orders: 'false' },
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
