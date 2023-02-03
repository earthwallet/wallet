import axios, { AxiosRequestConfig } from 'axios';
import { BTC_DOGE_MAINNET_KEY } from '~global/config';
import { keyable } from '~scripts/Background/types/IMainController';

const BTC_DECIMAL = 8;
const DOGE_DECIMAL = 8;
export const getBalance_BTC_DOGE = async (
  address: string,
  symbol: string
): Promise<keyable> => {
  let serverRes =
    symbol == 'BTC'
      ? {
          value: 0,
          error: false,
          currency: {
            symbol: 'BTC',
            decimals: BTC_DECIMAL,
          },
        }
      : {
          value: 0,
          error: false,
          currency: {
            symbol: 'DOGE',
            decimals: DOGE_DECIMAL,
          },
        };

  const config: AxiosRequestConfig = {
    method: 'get',
    url: `https://chain.so/api/v3/balance/${symbol}/${address}`,
    headers: {
      'API-KEY': BTC_DOGE_MAINNET_KEY,
    },
  };
  await axios(config)
    .then(function (response) {
      serverRes.value =
        (parseFloat(response?.data?.data?.confirmed) +
          parseFloat(response?.data?.data?.unconfirmed)) *
        Math.pow(10, 8);
    })
    .catch(function (error) {
      console.log(error, 'getBalance_BTC');
      serverRes.error = true;
    });
  return serverRes;
};

export const getTransactions_BTC_DOGE = async (
  address: string,
  symbol: string,
  page = 1
) => {
  let serverRes: keyable[] = [];

  const config: AxiosRequestConfig = {
    method: 'get',
    url: `https://chain.so/api/v3/transactions/${symbol}/${address}/${page}`,
    headers: {
      'API-KEY': BTC_DOGE_MAINNET_KEY,
    },
  };

  await axios(config)
    .then(function (response) {
      serverRes = response.data.data.transactions;
    })
    .catch(function (error) {
      console.log(error, 'getTransactions_BTC');
      return;
    });
  console.log(serverRes, 'serverRes');
  return serverRes;
};

export const getAllUnspentTransactions = async (
  address: string,
  symbol: string
) => {
  // @ts-ignore
  async function getUnspentTransactions(address: string, page: number) {
    try {
      const response = await axios.get(
        `https://chain.so/api/v3/unspent_outputs/${symbol}/${address}/${page}`,
        {
          headers: {
            'API-KEY': BTC_DOGE_MAINNET_KEY,
          },
        }
      );
      if (response.data.status !== 'success') {
        throw new Error('Failed to retrieve UTXOs');
      }
      const { outputs } = response.data.data;
      if (outputs.length === 0) {
        return [];
      }
      const unspentTransactions = outputs.map((output: keyable) =>
        symbol == 'BTC'
          ? {
              hash: output.hash,
              index: output.index,
              address: output.address,
              script: output.script,
              value: output.value,
            }
          : {
              hash: output.hash,
              index: output.index,
              address: output.address,
              script: output.script,
              value: output.value,
              tx_hex: output.tx_hex,
            }
      );
      if (unspentTransactions.length == 10)
        return unspentTransactions.concat(
          await getUnspentTransactions(address, page + 1)
        );
      else return unspentTransactions;
    } catch (error) {
      console.error(error);
      return [];
    }
  }
  return await getUnspentTransactions(address, 1);
};

export const getFeeRateAndFees_BTC_DOGE = async (symbol: string) => {
  const BYTES_FOR_ONE_INPUT_TWO_OUTPUTS = 400;
  const offlineFeeRate = symbol == 'BTC' ? 7 : 1000;
  try {
    const response = await axios.get(
      `https://chain.so/api/v3/network_info/${symbol}`,
      {
        headers: { 'API-KEY': BTC_DOGE_MAINNET_KEY },
      }
    );
    const blocks = response.data.data.mempool.blocks;
    let totalFeeRate = 0;
    for (const block of blocks) {
      totalFeeRate += block.median_fee_rate;
    }
    // medianSpeed * fast factor 1.5
    const averageFeeRate = Math.ceil((totalFeeRate / blocks.length) * 1.5);
    return {
      feeRate: averageFeeRate,
      fees:
        (averageFeeRate * BYTES_FOR_ONE_INPUT_TWO_OUTPUTS) / Math.pow(10, 8),
    };
  } catch (error) {
    console.error(error);
    return {
      feeRate: offlineFeeRate,
      fees:
        (offlineFeeRate * BYTES_FOR_ONE_INPUT_TWO_OUTPUTS) / Math.pow(10, 8),
    };
  }
};

export const broadcastTxn_BTC_DOGE = async (txHex: string, symbol: string) => {
  var data = JSON.stringify({
    tx_hex: txHex,
  });

  var config = {
    method: 'post',
    url: `https://chain.so/api/v3/broadcast_transaction/${symbol}`,
    headers: {
      'Content-Type': 'application/json',
      'API-KEY': BTC_DOGE_MAINNET_KEY,
    },
    data: data,
  };

  let serverRes = { hash: '', error: false, errorMessage: '' };
  await axios(config)
    .then(function (response) {
      serverRes.hash = response?.data?.data?.hash;
      return serverRes;
    })
    .catch(function (error) {
      serverRes.error = true;
      if (error.response) {
        console.log(error.response, 'broadcastTxn_BTC_DOGE');
        serverRes.errorMessage = error.response.data.data?.error_message;
      }
      return serverRes;
    });
  return serverRes;
};
