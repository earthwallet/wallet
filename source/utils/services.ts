import { decodeTokenId } from '@earthwallet/assets';
import axios, { AxiosRequestConfig } from 'axios';
import { keyable } from '~scripts/Background/types/IAssetsController';
import { BigNumber, ethers } from 'ethers';
import {
  ALCHEMY_ETH_API_KEY,
  ALCHEMY_POLYGON_API_KEY,
  ETHERSCAN_API_KEY,
  ETH_MAINNET_ALCHEMY_URL,
  POLYGONSCAN_API_KEY,
  POLY_ALCHEMY_URL,
} from '~global/config';
import { hexToNumber, hexToNumberString } from 'web3-utils';
//@ts-ignore
import IERC721 from './abi/IERC721';
//@ts-ignore
import IERC20 from './abi/IERC20';

import { Interface } from 'ethers/lib/utils';
import { unsResolveName } from './unstoppable';

var web3 = require('web3');

const AIRDROP_FIREBASE_URL =
  'https://us-central1-earthwallet-1f3ab.cloudfunctions.net';

export const registerExtensionAndAccounts = async (
  extensionId: string,
  accounts: keyable
) => {
  if (accounts.length == 0) {
    return 'Not enough accounts';
  }

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
    url: `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_POLYGON_API_KEY}`,
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
    params: ['0x0000000000000000000000000000000000000000', 'DEFAULT_TOKENS'],
    id: 42,
  });

  const config: AxiosRequestConfig = {
    method: 'post',
    url: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_ETH_API_KEY}`,
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
      url: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_ETH_API_KEY}`,
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
  }
  return serverRes;
};

export const getBalanceERC20 = async (
  address: string,
  symbol: string,
  tokens?: keyable
) => {
  const data = JSON.stringify({
    jsonrpc: '2.0',
    method: 'alchemy_getTokenBalances',
    headers: {
      'Content-Type': 'application/json',
    },
    params: [address, tokens || 'DEFAULT_TOKENS'],
    id: 42,
  });

  const config: AxiosRequestConfig = {
    method: 'post',
    url:
      symbol == 'ETH'
        ? `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_ETH_API_KEY}`
        : `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_POLYGON_API_KEY}`,
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
  const balances = response?.data?.result;

  defaultTokenBalances = balances['tokenBalances'].map((token: keyable) => ({
    ...token,
    tokenBalance: hexToNumberString(token.tokenBalance),
  }));

  let i = 0;

  for (const token of defaultTokenBalances) {
    let balance = token['tokenBalance'];

    serverRes[i] = {
      ...token,
      ...{ balance },
    };
    i++;
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

export const getERC20Meta = async (address: string, symbol: string) => {
  const metadataParams = JSON.stringify({
    jsonrpc: '2.0',
    method: 'alchemy_getTokenMetadata',
    params: [`${address}`],
    id: 42,
  });

  //  const config: AxiosRequestConfig = {

  const metadataConfig: AxiosRequestConfig = {
    method: 'post',
    url:
      symbol == 'ETH'
        ? `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_ETH_API_KEY}`
        : `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_POLYGON_API_KEY}`,
    headers: {
      'Content-Type': 'application/json',
    },
    data: metadataParams,
  };

  const respo2 = await axios(metadataConfig);
  const metadata = respo2?.data?.result;

  return metadata;
};

export const getERC20TokensListFromTxs = async (
  address: string,
  symbol?: string
) => {
  const config: AxiosRequestConfig = {
    method: 'get',
    url:
      symbol == 'ETH'
        ? `https://api.etherscan.io/api?module=account&action=tokentx&address=${address}&page=1&offset=100&startblock=0&endblock=99999999&sort=asc&apikey=${ETHERSCAN_API_KEY}`
        : `https://api.polygonscan.com/api?module=account&action=tokentx&address=${address}&page=1&offset=100&startblock=0&endblock=99999999&sort=asc&apikey=${POLYGONSCAN_API_KEY}`,
    headers: {},
  };

  let serverRes;
  try {
    const response = await axios(config);
    serverRes = response.data?.result?.map((a: keyable) => a.contractAddress);
  } catch (error) {
    serverRes = error;
  }
  return serverRes;
};

export const transferERC721 = async (
  contractAddress: string,
  recipientAddress: string,
  fromAddress: string,
  tokenId: number,
  mnemonic: string,
  symbol: string,
  maxPriorityFeePerGas: string,
  maxFeePerGas: string
) => {
  const provider = new ethers.providers.AlchemyProvider(
    symbol == 'MATIC' ? 'matic' : 'homestead',
    symbol == 'MATIC' ? ALCHEMY_POLYGON_API_KEY : ALCHEMY_ETH_API_KEY
  );
  const wallet = ethers.Wallet.fromMnemonic(mnemonic);
  const sendingWallet = new ethers.Wallet(wallet.privateKey, provider);

  const erc721Contract = new ethers.Contract(
    contractAddress,
    IERC721.abi,
    sendingWallet
  );
  let transaction;
  // //Estimate gas limit
 
  const gasLimit = await erc721Contract.estimateGas[
    'safeTransferFrom(address,address,uint256)'
  ](fromAddress, recipientAddress, BigNumber.from(tokenId));
  console.log(gasLimit, 'gasLimit transferERC721');
  transaction = await erc721Contract[
    'safeTransferFrom(address,address,uint256)'
  ](fromAddress, recipientAddress, BigNumber.from(tokenId), {
    maxPriorityFeePerGas: ethers.utils.parseUnits(
      parseFloat(maxPriorityFeePerGas).toString(),
      'gwei'
    ),
    maxFeePerGas: ethers.utils.parseUnits(
      parseFloat(maxFeePerGas).toString(),
      'gwei'
    ),
  });
  return transaction;
};

export const transferERC20 = async (
  contractAddress: string,
  recipientAddress: string,
  amount: string,
  mnemonic: string,
  symbol: string,
  maxPriorityFeePerGas: string,
  maxFeePerGas: string,
  decimals: number
) => {
  const provider = new ethers.providers.AlchemyProvider(
    symbol == 'MATIC' ? 'matic' : 'homestead',
    symbol == 'MATIC' ? ALCHEMY_POLYGON_API_KEY : ALCHEMY_ETH_API_KEY
  );
  const wallet = ethers.Wallet.fromMnemonic(mnemonic);
  const sendingWallet = new ethers.Wallet(wallet.privateKey, provider);

  const erc20Contract = new ethers.Contract(
    contractAddress,
    IERC20.abi,
    sendingWallet
  );

  const transaction = await erc20Contract.transfer(
    recipientAddress,
    ethers.utils.parseUnits(amount.toString(), decimals.toString()),
    {
      maxPriorityFeePerGas: ethers.utils.parseUnits(
        maxPriorityFeePerGas,
        'gwei'
      ),
      maxFeePerGas: ethers.utils.parseUnits(maxFeePerGas, 'gwei'),
    }
  );

  return transaction;
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
    url: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_ETH_API_KEY}`,
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

//https://ethereum.stackexchange.com/questions/23430/how-to-calculate-the-amount-to-transfer-to-completely-empty-an-account/23431
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

      ////Total transaction fee = gas units (limit) x (base fee + tip)
      //totalGas for a txn = (maxPriorityFeePerGas + baseFee) * estimateGas
      // maxFeePerGas = web3.utils.fromWei(priorityFees['fast']['maxFee'], 'gwei') * estimateGas
      fees = [
        {
          label: 'Low',
          ...serverRes?.low,
          gas: totalSafeLowGas / Math.pow(10, 9),
          estimateGas,
          maxFee:
            (estimateGas * parseFloat(serverRes?.low.suggestedMaxFeePerGas)) /
            Math.pow(10, 9),
          totalGas:
            (estimateGas * parseFloat(serverRes?.low.suggestedMaxFeePerGas)) /
            Math.pow(10, 9),
        },
        {
          label: 'Standard',
          ...serverRes?.medium,
          estimateGas,
          gas: totalStandardGas / Math.pow(10, 9),
          maxFee:
            (estimateGas *
              parseFloat(serverRes?.medium.suggestedMaxFeePerGas)) /
            Math.pow(10, 9),
          totalGas:
            (estimateGas *
              parseFloat(serverRes?.medium.suggestedMaxFeePerGas)) /
            Math.pow(10, 9),
        },
        {
          label: 'Fast',
          ...serverRes?.high,
          estimateGas,
          gas: totalFastGas / Math.pow(10, 9),
          maxFee:
            (estimateGas * parseFloat(serverRes?.high.suggestedMaxFeePerGas)) /
            Math.pow(10, 9),
          totalGas:
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
        (serverRes?.estimatedBaseFee +
          parseFloat(serverRes?.safeLow?.maxPriorityFee.toFixed(5)));
      const totalStandardGas =
        estimateGas *
        (serverRes?.estimatedBaseFee +
          parseFloat(serverRes?.standard?.maxPriorityFee.toFixed(5)));
      const totalFastGas =
        estimateGas *
        (serverRes?.estimatedBaseFee +
          parseFloat(serverRes?.fast?.maxPriorityFee.toFixed(5)));

      fees = [
        {
          label: 'Low',
          ...serverRes?.safeLow,
          estimateGas,
          gas: totalSafeLowGas / Math.pow(10, 9),
          suggestedMaxFeePerGas: serverRes?.safeLow?.maxFee.toFixed(5),
          suggestedMaxPriorityFeePerGas:
            serverRes?.safeLow?.maxPriorityFee.toFixed(5),
          totalGas: totalSafeLowGas / Math.pow(10, 9),
        },
        {
          label: 'Standard',
          ...serverRes?.standard,
          estimateGas,
          gas: totalStandardGas / Math.pow(10, 9),
          suggestedMaxFeePerGas: serverRes?.standard?.maxFee.toFixed(5),
          suggestedMaxPriorityFeePerGas:
            serverRes?.standard?.maxPriorityFee.toFixed(5),
          totalGas: totalStandardGas / Math.pow(10, 9),
        },
        {
          label: 'Fast',
          ...serverRes?.fast,
          estimateGas,
          gas: totalFastGas / Math.pow(10, 9),
          suggestedMaxFeePerGas: serverRes?.fast?.maxFee.toFixed(5),
          suggestedMaxPriorityFeePerGas:
            serverRes?.fast?.maxPriorityFee.toFixed(5),
          totalGas: totalFastGas / Math.pow(10, 9),
        },
      ];
    } catch (error) {
      serverRes = error;
    }
  }

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

export const getTransactions_ETH_MATIC = async (
  address: string,
  symbol: string
) => {
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
    url: symbol == 'MATIC' ? POLY_ALCHEMY_URL : ETH_MAINNET_ALCHEMY_URL,
  };
  const toConfig: AxiosRequestConfig = {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    data: toTransfersData,
    url: symbol == 'MATIC' ? POLY_ALCHEMY_URL : ETH_MAINNET_ALCHEMY_URL,
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
    return;
  }
  const txns = serverRes
    ?.map((tx: { blockNum: any }) => ({
      ...tx,
      block: web3.utils.hexToNumberString(tx.blockNum),
    }))
    .sort((a: { block: number }, b: { block: number }) => b.block - a.block);
  return txns;
};

export const getERC721 = async (address: string, symbol?: string) => {
  const config: AxiosRequestConfig = {
    method: 'get',
    url:
      symbol == 'MATIC'
        ? `https://api.polygonscan.com/api?module=account&action=tokennfttx&address=${address}&sort=asc&apikey=${POLYGONSCAN_API_KEY}`
        : `https://api.etherscan.io/api?module=account&action=tokennfttx&address=${address}&sort=asc&apikey=${ETHERSCAN_API_KEY}`,
    headers: {},
  };

  let serverRes: keyable;
  try {
    const response = await axios(config);
    serverRes = response.data?.result;
  } catch (error: any) {
    serverRes = error;
    serverRes.error = true;
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
    const configAlch: AxiosRequestConfig = {
      method: 'GET',
      url: `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_ETH_API_KEY}/getNFTMetadata?contractAddress=${asset.contractAddress}&tokenId=${asset.tokenIndex}`,
      headers: {},
    };
    try {
      const responseAlch = await axios(configAlch);
      serverRes = responseAlch.data;
    } catch (error) {
      serverRes = error;
    }
  }
  return serverRes;
};

//https://docs.opensea.io/reference/retrieving-a-single-asset
export const getETHAssetInfo_MATIC = async (asset: keyable) => {
  //alert(ALCHEMY_ETH_API_KEY + ' getETHAssetInfo_MATIC');
  const config: AxiosRequestConfig = {
    method: 'GET',
    url: `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_POLYGON_API_KEY}/getNFTMetadata?contractAddress=${asset.contractAddress}&tokenId=${asset.tokenIndex}`,
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

//https://github.com/ethers-io/ethers.js/issues/478
export const getERC20TransferGasLimit = async (
  contractAddress: string,
  fromAddress: string,
  toAddress: string,
  symbol: string,
  amount?: string,
  decimals?: any
) => {
  const erc20Interface = new Interface(IERC20.abi);
  const hexData = erc20Interface.encodeFunctionData('transfer', [
    toAddress || '0x0000000000000000000000000000000000000000',
    amount == undefined
      ? 100000
      : ethers.utils.parseUnits(amount.toString(), decimals.toString()),
  ]);

  const data = JSON.stringify({
    jsonrpc: '2.0',
    method: 'eth_estimateGas',
    params: [
      {
        from: fromAddress,
        to: contractAddress,
        data: hexData,
      },
    ],
    id: 1,
  });

  const config: AxiosRequestConfig = {
    method: 'post',
    url: symbol == 'MATIC' ? POLY_ALCHEMY_URL : ETH_MAINNET_ALCHEMY_URL,
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
  const gasLimit =
    serverRes.result == undefined ? 65000 : hexToNumber(serverRes.result);
  return gasLimit;
};

//https://github.com/ethers-io/ethers.js/issues/478
//https://abi.hashex.org/
//remove multiple name
//https://lab.miguelmota.com/ethereum-input-data-decoder/example/

export const getERC721TransferGasLimit = async (
  contractAddress: string,
  fromAddress: string,
  toAddress: string,
  symbol: string,
  tokenId: number
) => {
  const erc721Interface = new Interface(IERC721.abi);
  const hexData = erc721Interface.encodeFunctionData(
    'safeTransferFrom(address,address,uint256)',
    [
      fromAddress,
      toAddress || '0x0000000000000000000000000000000000000000',
      BigNumber.from(tokenId),
    ]
  );
  const data = JSON.stringify({
    jsonrpc: '2.0',
    method: 'eth_estimateGas',
    params: [
      {
        from: fromAddress,
        to: contractAddress,
        data: hexData,
      },
    ],
    id: 1,
  });

  const config: AxiosRequestConfig = {
    method: 'post',
    url: symbol == 'MATIC' ? POLY_ALCHEMY_URL : ETH_MAINNET_ALCHEMY_URL,
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
    console.log(error, 'getERC721TransferGasLimit error');
    serverRes = error;
  }
  const gasLimit =
    serverRes.result == undefined ? 85000 : hexToNumber(serverRes.result);
  return gasLimit;
};

export const transferUniswap = async (
  uniswap: keyable,
  myAddress: string,
  mnemonic: string,
  symbol: string
) => {
  const V3_SWAP_ROUTER_ADDRESS = '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45';

  const provider = new ethers.providers.AlchemyProvider(
    symbol == 'MATIC' ? 'matic' : 'homestead',
    symbol == 'MATIC' ? ALCHEMY_POLYGON_API_KEY : ALCHEMY_ETH_API_KEY
  );

  const wallet = ethers.Wallet.fromMnemonic(mnemonic);
  const sendingWallet = new ethers.Wallet(wallet.privateKey, provider);
  const eth_value_to_swap = ethers.utils.parseUnits(uniswap.inputAmount, 18);
  let transaction;
  // notes: gasLimit is multiplied by 1.5 factor. Otherwise, contract execution may get cancelled

  if (uniswap?.outputToken == 'ETH') {
    //    gasPrice: BigNumber.from(route.gasPriceWei).add(1),

    transaction = {
      data: uniswap.methodParameters.calldata,
      to: V3_SWAP_ROUTER_ADDRESS,
      value: BigNumber.from(uniswap.methodParameters.value),
      from: myAddress,
      gasPrice: BigNumber.from(uniswap.gasPriceWeiTxt).add(1),
      gasLimit: ethers.utils.hexlify(
        Math.ceil(uniswap.estimatedGasUsedTxt * 1.5 || 150000)
      ),
    };

    const approvalAmount = eth_value_to_swap.toString();
    const rETHAddress = '0xae78736Cd615f374D3085123A210448E74Fc6393';
    const rETHContract = new ethers.Contract(rETHAddress, IERC20.abi, provider);

    await rETHContract
      .connect(sendingWallet)
      .approve(V3_SWAP_ROUTER_ADDRESS, approvalAmount, {
        gasPrice: BigNumber.from(uniswap.gasPriceWeiTxt),
      });

    //toastCallback && toastCallback("Approve done! Submitting transaction..")
    //await res.wait();
  } else {
    transaction = {
      data: uniswap.methodParameters.calldata,
      to: V3_SWAP_ROUTER_ADDRESS,
      value: BigNumber.from(eth_value_to_swap),
      from: myAddress,
      gasPrice: BigNumber.from(uniswap.gasPriceWeiTxt),
      gasLimit: ethers.utils.hexlify(
        Math.ceil(uniswap.estimatedGasUsedTxt * 1.5 || 150000)
      ),
    };
  }
  const result = await sendingWallet.sendTransaction(transaction);

  return result;
};

export const rocketPoolInfo = async () => {
  const STATS_URL = 'https://api.rocketpool.net/api/mainnet/network/stats';
  const APR_URL = 'https://api.rocketpool.net/api/mainnet/apr';

  const config: AxiosRequestConfig = {
    method: 'get',
    url: STATS_URL,
    headers: {},
  };
  const aprconfig: AxiosRequestConfig = {
    method: 'get',
    url: APR_URL,
    headers: {},
  };
  let serverRes;
  try {
    const response = await axios(config);
    const aprResponse = await axios(aprconfig);

    serverRes = response.data;
    serverRes = { ...serverRes, ...aprResponse.data };
  } catch (error) {
    serverRes = error;
  }

  return serverRes;
};

export const getMaxAmount_ETH = (ethAmount: string, feeObj: keyable) => {
  const gasFeesInETH: string = feeObj?.totalGas.toString();

  const maxAmountThatCanBeSent: number =
    Number(ethAmount) - Number(gasFeesInETH);
  return maxAmountThatCanBeSent;
};

export const getAddressFromENSName = async (ens: string, symbol:string, type: string) => {
  const web3Provider = new ethers.providers.AlchemyProvider(
    'homestead',
    ALCHEMY_ETH_API_KEY
  );
  var address = null;
  try {
    address = await web3Provider.resolveName(ens);
  } catch (error) {
    address = null;
  }
  if (address == null) {
    let respo = [];
    try {
      respo = await unsResolveName(ens, symbol, type);
      if (respo[0] != '') {
        address = respo[0];
      } else {
        address = null;
      }
    } catch (error) {
      address = null;
    }
  }
  return { address, ens };
};
