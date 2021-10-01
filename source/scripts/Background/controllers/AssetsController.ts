import { CGECKO_PRICE_API } from '~global/constant';
import { updateFiatPrice } from '~state/assets';
import { IAssetState } from '~state/assets/types';
import store from '~state/store';
import type { IAssetsController, keyable } from '../types/IAssetsController';
import { storeEntities } from '~state/entities';
import { getNFTsFromCanisterExt } from '@earthwallet/assets';
import { parseBigIntToString } from '~utils/common';
export default class AssetsController implements IAssetsController {
  fetchFiatPrice = async (currency = 'USD') => {
    try {
      const assetState: IAssetState = store.getState().assets;
      const { activeAssetId } = assetState;

      if (!activeAssetId) {
        return;
      }

      const data = await (
        await fetch(
          `${CGECKO_PRICE_API}?ids=${activeAssetId},bitcoin&vs_currencies=${currency}&include_24hr_change=true`
        )
      ).json();

      store.dispatch(
        updateFiatPrice({
          id: activeAssetId,
          price: data[activeAssetId][currency],
          priceChange: data[activeAssetId][`${currency}_24h_change`],
        })
      );
      return;
    } catch (error) {
      console.log('fecthing CGECKO_PRICE_API error => ', error);
      return;
    }
  };

  fetchFiatPrices = async (symbols: keyable, currency = 'USD') => {
    try {
      const activeAssetIds = symbols.toString();

      store.dispatch(
        storeEntities({
          entity: 'prices',
          data: symbols.map((symbol: string) => {
            return { id: symbol, loading: true, error: false };
          }),
        })
      );
      const data = await (
        await fetch(
          `${CGECKO_PRICE_API}?ids=${activeAssetIds}&vs_currencies=${currency}&include_24hr_change=true`
        )
      ).json();
      store.dispatch(
        storeEntities({
          entity: 'prices',
          data: Object.keys(data).map((coinGeckoId) => {
            return {
              id: coinGeckoId,
              ...data[coinGeckoId],
              loading: false,
              error: false,
            };
          }),
        })
      );
      return;
    } catch (error) {
      console.log('fecthing CGECKO_PRICE_API error => ', error);
    }
    return;
  };

  getAssetsOfAccount = async (account: keyable) => {
    console.log('getAssetsOfAccount', account);
    const fetchAssets = async (account: keyable) => {
      let canisterId = 'owuqd-dyaaa-aaaah-qapxq-cai';
      const tokens: keyable = await getNFTsFromCanisterExt(
        canisterId,
        account.address
      );

      console.log(
        account.address,
        tokens,
        account.symbol === 'ICP_Ed25519' ? 'ICP' : account.symbol
      );

      const parsedTokens = tokens.map((token: keyable) => ({
        id: token.tokenIdentifier,
        address: account.address,
        canisterId,
        ...parseBigIntToString(token),
      }));

      console.log(parsedTokens, 'parsedTokens');
      return parsedTokens;
    };
    try {
      
      const tokens: keyable = await fetchAssets(account);

      if (tokens.length === 0) {
        store.dispatch(
          storeEntities({
            entity: 'assetsCount',
            data: [{ id: account.address, symbol: account.symbol, count: 0 }],
          })
        );
      } else {
        store.dispatch(
          storeEntities({
            entity: 'assetsCount',
            data: [
              {
                id: account.address,
                symbol: account.symbol,
                count: tokens.length,
              },
            ],
          })
        );
        //cache the assets
        tokens.map((token: keyable) =>
          store.dispatch(
            storeEntities({
              entity: 'assets',
              data: [token],
            })
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  getAssetsOfAccountsGroup = async (accountsGroup: keyable[][]) => {
    for (const accounts of accountsGroup) {
      for (const account of accounts.filter(
        (account) => account.symbol === 'ICP'
      )) {
        await this.getAssetsOfAccount(account);
      }
    }
  };
}
