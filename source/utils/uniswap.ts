import { AlphaRouter } from '@uniswap/smart-order-router';
import { Token, CurrencyAmount, Percent, Ether } from '@uniswap/sdk-core';
import * as ethers from 'ethers';
const JSBI = require('jsbi');
import { TradeType } from '@uniswap/sdk-core';
import { ALCHEMY_ETH_API_KEY } from '~global/config';
import { keyable } from '~scripts/Background/types/IAssetsController';
// rETH to ETH

export const swapFromReth = async (
  myAddress: string,
  typedValueParsed: string,
  outputToken: string
) => {
  const web3Provider = new ethers.providers.AlchemyProvider(
    'homestead',
    ALCHEMY_ETH_API_KEY
  );

  const chainId = 1;
  // @ts-ignore
  const router = new AlphaRouter({ chainId: chainId, provider: web3Provider });

  const rETH = new Token(
    1,
    '0xae78736Cd615f374D3085123A210448E74Fc6393',
    18,
    'rETH',
    'Rocket Pool ETH'
  );

  const ETH = Ether.onChain(chainId);

  const inputParse = ethers.utils.parseUnits(typedValueParsed, 18);
  const inputAmount = CurrencyAmount.fromRawAmount(
    rETH,
    JSBI.BigInt(inputParse)
  );
  let route: keyable | null = {};
  try {
    route = await router.route(inputAmount, ETH, TradeType.EXACT_INPUT, {
      recipient: myAddress,
      slippageTolerance: new Percent(5, 100),
      deadline: Math.floor(Date.now() / 1000 + 1800),
    });
  } catch (error) {
    return { error, success: true, info: 'more info error' };
  }
  if (route == null) {
    return { success: true, error: 'Route is undefined' };
  }
  route.estimatedGasUsedUSDTxt = route.estimatedGasUsedUSD.toFixed(10);
  route.inputAmount = route.trade.swaps[0].inputAmount.toExact();
  route.outputAmount = route.trade.swaps[0].outputAmount.toExact();
  route.estimatedGasUsedTxt = route.estimatedGasUsed?.toString();
  route.gasPriceWeiTxt = route.gasPriceWei.toString();
  route.outputToken = outputToken;
  route.typedValueParsed = typedValueParsed;
  route.myAddress = myAddress;
 
  return { uniswap: route, success: true };
};

// ETH to rETH
export const swapToReth = async (
  myAddress: string,
  typedValueParsed: string,
  outputToken: string
) => {
  const web3Provider = new ethers.providers.AlchemyProvider(
    'homestead',
    ALCHEMY_ETH_API_KEY
  );

  const chainId = 1;
    // @ts-ignore
  const router = new AlphaRouter({ chainId: chainId, provider: web3Provider });

  const ETH = Ether.onChain(chainId);

  const rETH = new Token(
    1,
    '0xae78736Cd615f374D3085123A210448E74Fc6393',
    18,
    'rETH',
    'Rocket Pool ETH'
  );

  const inputParse = ethers.utils.parseUnits(typedValueParsed, 18);
  const inputAmount = CurrencyAmount.fromRawAmount(
    ETH,
    JSBI.BigInt(inputParse)
  );
  let route: keyable | null = {};
  try {
    route = await router.route(inputAmount, rETH, TradeType.EXACT_INPUT, {
      recipient: myAddress,
      slippageTolerance: new Percent(5, 100),
      deadline: Math.floor(Date.now() / 1000 + 1800),
    });
  } catch (error) {
    return { error, success: true, info: 'more info error' };
  }
  if (route == null) {
    return { success: true, error: 'Route is undefined' };
  }
  route.estimatedGasUsedUSDTxt = route.estimatedGasUsedUSD.toFixed(10);
  route.inputAmount = route.trade.swaps[0].inputAmount.toExact();
  route.outputAmount = route.trade.swaps[0].outputAmount.toExact();
  route.estimatedGasUsedTxt = route.estimatedGasUsed?.toString();
  route.gasPriceWeiTxt = route.gasPriceWei.toString();
  route.outputToken = outputToken;
  route.typedValueParsed = typedValueParsed;
  route.myAddress = myAddress;

  return { uniswap: route, success: true };
};
