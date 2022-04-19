import axios, { AxiosRequestConfig } from 'axios';
import { keyable } from '~scripts/Background/types/IAssetsController';

const AIRDROP_FIREBASE_URL =
  'https://us-central1-test-earth-art.cloudfunctions.net';

export const registerExtensionAndAccounts = (
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
  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      serverRes = response.data;
    })
    .catch(function (error) {
      console.log(error);
      serverRes = error;
    });
  return serverRes;
};

export const verifyExtension = (extensionId: string) => {
  const config: AxiosRequestConfig = {
    method: 'get',
    url: `${AIRDROP_FIREBASE_URL}/verify?extensionId=${extensionId}`,
    headers: {},
  };
  let serverRes;

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data), 'registerExtensionForAirdrop');
      serverRes = response.data;
    })
    .catch(function (error) {
      console.log(error);
      serverRes = error;
    });
  return serverRes;
};

export const isAirDropEnabled = () => {
  const config: AxiosRequestConfig = {
    method: 'get',
    url: `${AIRDROP_FIREBASE_URL}/airdropEnabled`,
    headers: {},
  };
  let serverRes;

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      serverRes = response.data;
    })
    .catch(function (error) {
      console.log(error);
      serverRes = error;
    });
  return serverRes;
};

export const getCTA = (address: string) => {
  const config: AxiosRequestConfig = {
    method: 'get',
    url: `${AIRDROP_FIREBASE_URL}/getCTA?address=${address}`,
    headers: {},
  };

  let serverRes;

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
      serverRes = response.data;
    })
    .catch(function (error) {
      console.log(error);
      serverRes = error;
    });
  return serverRes;
};
