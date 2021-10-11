import { CGECKO_PRICE_API } from '~global/constant';
import { updateFiatPrice } from '~state/assets';
import { IAssetState } from '~state/assets/types';
import store from '~state/store';
import type { IAssetsController, keyable } from '../types/IAssetsController';
import { storeEntities, updateEntities } from '~state/entities';
import { getNFTsFromCanisterExt } from '@earthwallet/assets';
import { parseBigIntToString } from '~utils/common';
import LIVE_ICP_NFT_LIST_CANISTER_IDS from '~global/nfts';
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

  fetchICPAssets = async (account: keyable, canisterId: string) => {
    const tokens: keyable = await getNFTsFromCanisterExt(
      canisterId,
      account.address
    );
    const parsedTokens = tokens.map((token: keyable) => ({
      id: token.tokenIdentifier,
      address: account.address,
      canisterId,
      ...parseBigIntToString(token),
    }));

    return parsedTokens;
  };

  getICPAssetsOfAccount = async (account: keyable) => {
    let allTokens: keyable = [];
    store.dispatch(
      storeEntities({
        entity: 'assetsCount',
        data: [
          {
            id: account.address,
            symbol: account.symbol,
            loading: true,
            error: false,
          },
        ],
      })
    );

    try {
      for (const [
        index,
        canisterId,
      ] of LIVE_ICP_NFT_LIST_CANISTER_IDS.entries()) {
        allTokens[index] = await this.fetchICPAssets(account, canisterId);
      }

      let tokens = allTokens.flat();
      if (tokens.length === 0) {
        store.dispatch(
          storeEntities({
            entity: 'assetsCount',
            data: [
              {
                id: account.address,
                symbol: account.symbol,
                count: 0,
                loading: false,
              },
            ],
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
                loading: false,
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
      console.log('Unable to load assets', error);
      store.dispatch(
        storeEntities({
          entity: 'assetsCount',
          data: [
            {
              id: account.address,
              symbol: account.symbol,
              count: 0,
              loading: false,
              errorMessage: 'Unable to load assets',
              error: true,
            },
          ],
        })
      );
    }
  };

  getAssetsOfAccountsGroup = async (accountsGroup: keyable[][]) => {
    for (const accounts of accountsGroup) {
      for (const account of accounts.filter(
        (account) => account.symbol === 'ICP'
      )) {
        await this.getICPAssetsOfAccount(account);
      }
    }
  };

  updateTokenCollectionDetails = async (asset: keyable) => {
    const allTokens: keyable = await this.fetchICPAssets(
      asset.address,
      asset.canisterId
    );

    let tokens = allTokens.flat();
    tokens.map((token: keyable) =>
      store.dispatch(
        storeEntities({
          entity: 'assets',
          data: [token],
        })
      )
    );
  };
  updateTokenDetails = async ({
    id,
    address,
    price,
  }: {
    id: string;
    address: string;
    price?: number;
  }) => {
    if (price == undefined) {
      store.dispatch(
        updateEntities({
          entity: 'assets',
          key: id,
          data: { address },
        })
      );
    } else {
      store.dispatch(
        updateEntities({
          entity: 'assets',
          key: id,
          data: {
            address,
            forSale: true,
            info: { price: price * 100000000 },
          },
        })
      );
    }
  };
}
