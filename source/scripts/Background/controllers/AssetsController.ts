import { CGECKO_PRICE_API } from '~global/constant';
import { updateFiatPrice } from '~state/assets';
import { IAssetState } from '~state/assets/types';
import store from '~state/store';
import type { IAssetsController } from '../types/IAssetsController';

export default class AssetsController implements IAssetsController {
  async fetchFiatPrice(currency = 'USD') {
    try {
      const assetState: IAssetState = store.getState().assets;
      const { activeAssetId } = assetState;

      if (!activeAssetId) {
        return false;
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
      return true;
    } catch (error) {
      console.log('fecthing CGECKO_PRICE_API error => ', error);
      return false;
    }
  }

  usedAssetSymbols() {
    // TODO: These asset info should be added first to the Redux State and currently mockup info is used
    return ['ICP', 'KSM', 'DOT', 'ETH', 'BNB', 'BTC', 'LTC', 'BCH'];
  }
}
