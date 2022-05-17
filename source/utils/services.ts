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

export const getFeesExtended = async (symbol: string, tokenId?: string) => {
  let serverRes;
  if (symbol == 'ETH') {
    if (tokenId == null) {
      //get eth fees
    } else {
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
    }
  }

  console.log(serverRes);
  //Calculating the total transaction fee works as follows: Gas units (limit) * (Base fee + Tip)
  const estimateGas = 21000;
  const totalSafeLowGas =
    estimateGas *
    (serverRes?.estimatedBaseFee + serverRes?.safeLow?.maxPriorityFee);
  const totalStandardGas =
    estimateGas *
    (serverRes?.estimatedBaseFee + serverRes?.standard?.maxPriorityFee);
  const totalFastGas =
    estimateGas *
    (serverRes?.estimatedBaseFee + serverRes?.fast?.maxPriorityFee);

  //totalGas for a txn = (maxPriorityFeePerGas + baseFee) * estimateGas
  // maxFeePerGas = web3.utils.fromWei(priorityFees['fast']['maxFee'], 'gwei') * estimateGas
  const fees = [
    {
      label: 'Safe Low',
      ...serverRes?.safeLow,
      gas: totalSafeLowGas / Math.pow(10, 9),
    },
    {
      label: 'Standard',
      ...serverRes?.safeLow,
      gas: totalStandardGas / Math.pow(10, 9),
    },
    {
      label: 'Fast',
      ...serverRes?.fast,
      gas: totalFastGas / Math.pow(10, 9),
    },
  ];
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
