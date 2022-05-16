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
