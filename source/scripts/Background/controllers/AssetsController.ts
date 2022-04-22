import { CGECKO_PRICE_API } from '~global/constant';
import store from '~state/store';
import type { IAssetsController, keyable } from '../types/IAssetsController';
import { createEntity, storeEntities, updateEntities } from '~state/entities';
import { decodeTokenId, getNFTsFromCanisterExt } from '@earthwallet/assets';
import { parseBigIntToString } from '~utils/common';
import LIVE_ICP_NFT_LIST_CANISTER_IDS, {
  getAirDropNFTInfo,
} from '~global/nfts';
import { canisterAgentApi, getTokenIdentifier } from '@earthwallet/assets';
import { isArray } from 'lodash';
import Secp256k1KeyIdentity from '@earthwallet/keyring/build/main/util/icp/secpk256k1/identity';
import { send } from '@earthwallet/keyring';
import { parseObjWithOutBigInt } from '~global/helpers';
import getBrowserFingerprint from 'get-browser-fingerprint';
import { registerExtensionAndAccounts, statusExtension } from '~utils/services';
import { updateExtensionId } from '~state/wallet';
export default class AssetsController implements IAssetsController {
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
          `${CGECKO_PRICE_API}?ids=${activeAssetIds}&vs_currencies=${currency}&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true`
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

  fetchEarthEXTCollection = async (collectionId: string) => {
    console.log('fetchEarthEXTCollection');
    //const state = store.getState();

    let response;
    let responseListing;

    response = await canisterAgentApi(collectionId, 'getRegistry');
    response.map((item: keyable) =>
      store.dispatch(
        storeEntities({
          entity: 'assets',
          data: [
            {
              id: getTokenIdentifier(collectionId, item[0]),
              index: item[0],
              tokenIndex: item[0],
              tokenIdentifier: getTokenIdentifier(collectionId, item[0]),
              canisterId: collectionId,
              address: item[1],
              image: `https://${collectionId}.raw.ic0.app/?cc=0&type=thumbnail&tokenid=${getTokenIdentifier(
                collectionId,
                item[0]
              )}`,
            },
          ],
        })
      )
    );

    /*   store.dispatch(
      storeEntities({
        entity: 'collections',
        data: [{ id: collectionId, loading: true }],
      })
    ); */
    responseListing = await canisterAgentApi(collectionId, 'listings');

    responseListing.map((item: keyable) =>
      store.dispatch(
        updateEntities({
          entity: 'assets',
          key: getTokenIdentifier(collectionId, item[0]),
          data: {
            forSale: item[1] && item[1].price.toString() ? true : false,
            price: item[1] && item[1].price.toString(),
          },
        })
      )
    );
    /*     store.dispatch(
      storeEntities({
        entity: 'collections',
        data: [{ id: collectionId, loading: false }],
      })
    ); */
  };

  fetchEarthNFT = async (collectionId: string, tokenId: number) => {
    store.dispatch(
      updateEntities({
        entity: 'assets',
        key: getTokenIdentifier(collectionId, tokenId),
        data: {
          loading: true,
        },
      })
    );
    const response = await canisterAgentApi(
      collectionId,
      'getListingByTokenID',
      tokenId
    );
    const forSale = response[0] == null ? false : true;

    store.dispatch(
      updateEntities({
        entity: 'assets',
        key: getTokenIdentifier(collectionId, tokenId),
        data: {
          loading: false,
          forSale,
          info: {
            price:
              response[0] == null
                ? 0
                : typeof response[0][1].price == 'bigint'
                ? response[0][1].price.toString()
                : response[0][1].price,
          },
        },
      })
    );
  };
  getCollectionStats = async () => {
    let allStats: keyable = [];
    const state = store.getState();

    if (state.entities.collectionStats == null) {
      store.dispatch(createEntity({ entity: 'collectionStats' }));
    }
    for (const [
      index,
      canisterId,
    ] of LIVE_ICP_NFT_LIST_CANISTER_IDS.entries()) {
      let response: keyable = [];
      try {
        store.dispatch(
          storeEntities({
            entity: 'collectionStats',
            data: [
              {
                id: canisterId,
                loading: true,
              },
            ],
          })
        );
        const response: keyable = await canisterAgentApi(canisterId, 'stats');
        allStats[index] = response;
      } catch (error) {
        store.dispatch(
          storeEntities({
            entity: 'collectionStats',
            data: [
              {
                id: canisterId,
                error: 'Error with method stats',
                loading: false,
              },
            ],
          })
        );
        console.log(error);
      }

      if (isArray(response) && response?.length > 0) {
        const stats = {
          total: (Number(response[0] / 1000000n) / 100).toFixed(2),
          high: (Number(response[1] / 1000000n) / 100).toFixed(2),
          low: (Number(response[2] / 1000000n) / 100).toFixed(2),
          floor: (Number(response[3] / 1000000n) / 100).toFixed(2),
          listings: Number(response[4]),
          tokens: Number(response[5]),
          sales: Number(response[6]),
          average: Number(response[6])
            ? (Number(response[0] / (response[6] * 1000000n)) / 100).toFixed(2)
            : '-',
        };
        const _stats = parseObjWithOutBigInt(stats);
        store.dispatch(
          storeEntities({
            entity: 'collectionStats',
            data: [
              {
                id: canisterId,
                ..._stats,
                loading: false,
              },
            ],
          })
        );
      }
    }
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
        if (canisterId === 'ntwio-byaaa-aaaak-qaama-cai') {
          const response = await canisterAgentApi(
            canisterId,
            'tokens_ext',
            account.address
          );

          allTokens[index] = response.map((_token: any[]) => {
            const id = getTokenIdentifier(canisterId, _token[0]);
            this.fetchEarthNFT(canisterId, _token[0]);
            return {
              id,
              tokenIdentifier: id,
              address: _token[1],
              tokenIndex: _token[0],
              canisterId,
            };
          });
        } else {
          allTokens[index] = await this.fetchICPAssets(account, canisterId);
        }
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

        const state = store.getState();
        const existingAssets =
          state.entities.assets?.byId &&
          Object.keys(state.entities.assets?.byId)
            ?.map((id) => state.entities.assets.byId[id])
            .filter((assets) => assets.address === account.address);
        const existingCount = existingAssets?.length;

        if (existingCount != tokens?.length) {
          existingAssets?.map((token: keyable) =>
            store.dispatch(
              storeEntities({
                entity: 'assets',
                data: [{ ...token, ...{ address: '' } }],
              })
            )
          );
        }
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
    if (asset?.canisterId === 'ntwio-byaaa-aaaak-qaama-cai') {
      this.fetchEarthNFT(asset?.canisterId, asset?.tokenIndex);
      return;
    }

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
    if (price === undefined || price === null) {
      store.dispatch(
        updateEntities({
          entity: 'assets',
          key: id,
          data: { address },
        })
      );
    } else if (price === 0) {
      store.dispatch(
        updateEntities({
          entity: 'assets',
          key: id,
          data: {
            address,
            forSale: false,
          },
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

  buyNft = async (
    txnId: string,
    identityJSON: string,
    nftId: string,
    price: number,
    address: string,
    callback?: (path: string) => void
  ) => {
    const state = store.getState();

    if (state.entities.txnRequests == null) {
      store.dispatch(createEntity({ entity: 'txnRequests' }));
    }

    store.dispatch(
      storeEntities({
        entity: 'txnRequests',
        data: [
          {
            id: txnId,
            loading: true,
            address: address,
            createdAt: new Date().getTime(),
            status: 'Making Offer',
            current: 1,
            total: 3,
            type: 'buyNft',
            nftId,
          },
        ],
      })
    );
    const currentIdentity = Secp256k1KeyIdentity.fromJSON(identityJSON);
    const canisterId = decodeTokenId(nftId).canister;
    let lockAddressRes: any;
    const _getRandomBytes = () => {
      var bs = [];
      for (var i = 0; i < 32; i++) {
        bs.push(Math.floor(Math.random() * 256));
      }
      return bs;
    };
    try {
      lockAddressRes = await canisterAgentApi(
        canisterId,
        'lock',
        [nftId, price, address, _getRandomBytes()],
        currentIdentity
      );
    } catch (error: any) {
      console.log(error);
      store.dispatch(
        storeEntities({
          entity: 'txnRequests',
          data: [
            {
              id: txnId,
              loading: false,
              status: '',
              error: error?.message,
              current: 1,
              total: 3,
              type: 'buyNft',
              nftId,
            },
          ],
        })
      );
      return;
    }

    const lockAddress = lockAddressRes?.ok;

    if (lockAddress == undefined) {
      store.dispatch(
        storeEntities({
          entity: 'txnRequests',
          data: [
            {
              id: txnId,
              loading: false,
              status: '',
              error: lockAddressRes?.err.Other,
              current: 1,
              total: 3,
              type: 'buyNft',
              nftId,
            },
          ],
        })
      );
      return;
    }
    store.dispatch(
      storeEntities({
        entity: 'txnRequests',
        data: [
          {
            id: txnId,
            loading: true,
            status: 'Transferring ICP',
            current: 2,
            total: 3,
            type: 'buyNft',
            nftId,
          },
        ],
      })
    );
    //show('Sending..');
    const selectedAmount = parseFloat((price / Math.pow(10, 8)).toFixed(8));
    let index: BigInt = 0n;
    try {
      index = await send(
        currentIdentity,
        lockAddress,
        address,
        selectedAmount,
        'ICP'
      );
      console.log(index);
    } catch (error: any) {
      store.dispatch(
        storeEntities({
          entity: 'txnRequests',
          data: [
            {
              id: txnId,
              loading: false,
              status: '',
              error: error?.message,
              current: 2,
              total: 3,
              type: 'buyNft',
              nftId,
              sendIndex: index?.toString(),
            },
          ],
        })
      );
      return;
    }

    //show('Settling..');
    store.dispatch(
      storeEntities({
        entity: 'txnRequests',
        data: [
          {
            id: txnId,
            loading: true,
            status: 'Settling Transaction',
            current: 3,
            total: 3,
            type: 'buyNft',
            nftId,
          },
        ],
      })
    );
    const settle = await canisterAgentApi(
      canisterId,
      'settle',
      nftId,
      currentIdentity
    );

    //show('Purchase complete');
    this.getICPAssetsOfAccount({ address, symbol: 'ICP' });
    if (settle?.err?.Other == 'Insufficient funds sent') {
      // setIsBusy(false);
      store.dispatch(
        storeEntities({
          entity: 'txnRequests',
          data: [
            {
              id: txnId,
              loading: false,
              status: '',
              error: 'Insufficient funds sent',
              current: 3,
              total: 3,
              type: 'buyNft',
              nftId,
            },
          ],
        })
      );
    } else {
      store.dispatch(
        storeEntities({
          entity: 'txnRequests',
          data: [
            {
              id: txnId,
              loading: false,
              status: '',
              current: 3,
              total: 3,
              type: 'buyNft',
              nftId,
            },
          ],
        })
      );
      callback && callback(`/nft/bought/${nftId}?address=${address}`);
      //setIsBusy(false);
    }
  };

  registerExtensionForAirdrop = async () => {
    const fingerprint = getBrowserFingerprint();
    console.log(fingerprint, 'registerExtensionForAirdrop');

    const state = store.getState();
    let extensionId;
    if (state.wallet?.extensionId == '') {
      extensionId = fingerprint.toString();
      store.dispatch(updateExtensionId(extensionId));
    } else {
      extensionId = state.wallet.extensionId;
    }
    const ICPAccounts =
      state.entities.accounts?.byId &&
      Object.keys(state.entities.accounts?.byId)
        ?.map((id) => state.entities.accounts.byId[id])
        .filter((account) => account.symbol == 'ICP' && account.active)
        .map((account) => account.address);

    if (ICPAccounts.length == 0) {
      return;
    }
    const earthdayAirdrop = getAirDropNFTInfo();
    if (state.entities.airdrops == null) {
      store.dispatch(createEntity({ entity: 'airdrops' }));
    }

    store.dispatch(
      updateEntities({
        entity: 'airdrops',
        key: earthdayAirdrop?.id,
        data: {
          loading: true,
        },
      })
    );
    const status = await statusExtension(extensionId);
    if (!status?.airdropEnabled) {
      store.dispatch(
        updateEntities({
          entity: 'airdrops',
          key: earthdayAirdrop.id,
          data: {
            airdropEnabled: false,
            loading: false,
          },
        })
      );
      return;
    } else {
      store.dispatch(
        updateEntities({
          entity: 'airdrops',
          key: earthdayAirdrop?.id,
          data: {
            ctaObj: status?.ctaObj,
            totalVerifications: status?.totalVerifications,
            airdropEnabled: true,
            accountIdVerified: status?.accountIdVerified,
            loading: false,
          },
        })
      );
    }
    if (status?.accountIds?.length != ICPAccounts.length) {
      const response = await registerExtensionAndAccounts(
        fingerprint.toString(),
        ICPAccounts
      );
      if (response.status == 'success') {
        store.dispatch(
          updateEntities({
            entity: 'airdrops',
            key: earthdayAirdrop?.id,
            data: {
              registered: true,
            },
          })
        );
      }
    }
  };
}
