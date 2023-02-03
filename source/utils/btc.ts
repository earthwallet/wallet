import axios, { AxiosRequestConfig } from 'axios';
import { BTC_DOGE_MAINNET_KEY } from '~global/config';
import { keyable } from '~scripts/Background/types/IMainController';
import BigNumber from 'bignumber.js';

import * as Bitcoin from 'bitcoinjs-lib';
import { mnemonicToSeedSync } from 'bip39';
// @ts-ignore
import accumulative from 'coinselect/accumulative';
import { DOGE_SLIP_PATH, dogeNetwork } from './doge';

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

export const getFeeRateAndFees_BTC_DOGE = async (
  symbol: string
): Promise<keyable> => {
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
        console.log('Error: broadcastTxn_BTC_DOGE', error.response);
        serverRes.errorMessage = error.response.data.data?.error_message;
      }
      return serverRes;
    });
  return serverRes;
};

export const getKeypairAndNetwork_BTC_DOGE = async (
  mnemonic: string,
  symbol: string
) => {
  const seed = mnemonicToSeedSync(mnemonic);
  const btcNetwork = Bitcoin.networks.bitcoin;

  const network: Bitcoin.Network = symbol == 'BTC' ? btcNetwork : dogeNetwork;
  const derivePath = symbol == 'BTC' ? `84'/0'/0'/0/0` : DOGE_SLIP_PATH;
  const master = Bitcoin.bip32.fromSeed(seed, network).derivePath(derivePath);
  // @ts-ignore
  const keyPair = Bitcoin.ECPair.fromPrivateKey(master.privateKey, {
    network: network,
  });
  const { address } =
    symbol == 'DOGE'
      ? Bitcoin.payments.p2pkh({
          pubkey: keyPair.publicKey,
          network: network,
        })
      : Bitcoin.payments.p2wpkh({
          pubkey: keyPair.publicKey,
          network: network,
        });
  return { keyPair, network, address };
};
export const createTransaction_BTC_DOGE = async (
  mnemonic: string,
  toAddress: string,
  fromAddress: string,
  amount: string,
  feeRate: number,
  utxos: keyable[],
  symbol: string
) => {
  const { keyPair, network, address } = await getKeypairAndNetwork_BTC_DOGE(
    mnemonic,
    symbol
  );
  if (
    address &&
    address.toLocaleLowerCase() != fromAddress.toLocaleLowerCase()
  ) {
    return;
  }
  try {
    const targetOutputs = [];
    targetOutputs.push({
      address: toAddress,
      value: new BigNumber(amount).shiftedBy(BTC_DECIMAL).toNumber(),
    });

    let parsedUtxos:
      | {
          hash: any;
          index: any;
          value: number;
          witnessUtxo: { value: number; script: Buffer };
        }[]
      | { hash: any; index: any; value: number; nonWitnessUtxo: Buffer }[] = [];

    if (symbol == 'BTC') {
      parsedUtxos = utxos.map((utxo) => ({
        hash: utxo.hash,
        index: utxo.index,
        value: new BigNumber(utxo.value).shiftedBy(BTC_DECIMAL).toNumber(),
        witnessUtxo: {
          value: new BigNumber(utxo.value).shiftedBy(BTC_DECIMAL).toNumber(),
          script: Buffer.from(utxo.script, 'hex'),
        },
      }));
    } else if (symbol == 'DOGE') {
      parsedUtxos = utxos.map((utxo) => ({
        hash: utxo.hash,
        index: utxo.index,
        value: new BigNumber(utxo.value).shiftedBy(BTC_DECIMAL).toNumber(),
        nonWitnessUtxo: Buffer.from(utxo.tx_hex, 'hex'),
      }));
    }
    const { inputs, outputs, fee } = accumulative(
      parsedUtxos,
      targetOutputs,
      feeRate
    );

    if (!inputs || !outputs) {
      console.log('Error: Not enough funds to complete the transaction' + fee);
      return {
        error: true,
        errorMessage:
          'Not enough funds as there are many UTXOs. Required fee: ' +
          fee / Math.pow(10, 8),
      };
    }

    const psbt = new Bitcoin.Psbt({ network: network }); // Network-specific
    // psbt add input from accumulative inputs
    if (symbol == 'BTC') {
      inputs.forEach((utxo: { hash: any; index: any; witnessUtxo: any }) =>
        psbt.addInput({
          hash: utxo.hash,
          index: utxo.index,
          witnessUtxo: utxo.witnessUtxo,
        })
      );
    } else {
      // doge
      // for doge setMaximumFeeRate
      // for doge nonWitnessUtxo
      psbt.setMaximumFeeRate(7500000);
      inputs.forEach((utxo: { hash: any; index: any; nonWitnessUtxo: any }) =>
        psbt.addInput({
          hash: utxo.hash,
          index: utxo.index,
          nonWitnessUtxo: utxo.nonWitnessUtxo,
        })
      );
    }
    outputs.forEach((output: Bitcoin.PsbtTxOutput) => {
      if (!output.address) {
        //an empty address means this is the  change address
        output.address = fromAddress;
      }
      if (!output.script) {
        psbt.addOutput(output);
      }
    });
    psbt.signAllInputs(keyPair); // Sign all inputs
    psbt.finalizeAllInputs(); // Finalise inputs
    const txHex = psbt.extractTransaction().toHex(); // TX extracted and formatted to hex

    return {
      error: false,
      txHex,
    };
  } catch (error) {
    console.log('Error while creating transaction:', error);
    return {
      error: true,
      errorMessage: 'Error while creating transaction:' + JSON.stringify(error),
    };
  }
};

export const getMaxAmount_BTC_DOGE = (
  address: string,
  utxos: keyable[],
  feeRate: any
) => {
  try {
    const { outputs, fee } = accumulative(
      utxos,
      [
        {
          address: address,
          value: 0,
        },
      ],
      feeRate
    );

    if (!outputs) {
      console.log('Error: Not enough funds.');
      return;
    }

    const maxAmount = outputs.reduce(
      (sum: any, output: { address: string; value: any }) => {
        return output.address === address ? sum + output.value : sum;
      },
      0
    );

    return maxAmount - fee;
  } catch (error) {
    console.log('Error: ', error);
    return;
  }
};
