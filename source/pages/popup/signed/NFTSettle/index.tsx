import { decodeTokenId } from '@earthwallet/assets';
import React from 'react';
import { useSelector } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import Header from '~components/Header';
import { getTokenImageURL } from '~global/nfts';
import useQuery from '~hooks/useQuery';
import { keyable } from '~scripts/Background/types/IMainController';
import { selectAssetBySymbol } from '~state/assets';
import { getSymbol } from '~utils/common';
import styles from './index.scss';
import NextStepButton from '~components/NextStepButton';

//import logo from '~assets/images/ew.svg';
//import downArrow from '~assets/images/downArrow.svg';
interface Props extends RouteComponentProps<{ nftId: string }> {
}
const NFTSettle = ({
  match: {
    params: { nftId },
  },
}: Props) => {
  const queryParams = useQuery();
  const price: number = parseInt(queryParams.get('price') || '');
  const canisterId = decodeTokenId(nftId).canister;
  const index = decodeTokenId(nftId).index;

  const asset: keyable = { canisterId, id: nftId, tokenIdentifier: nftId };
  const currentUSDValue: keyable = useSelector(selectAssetBySymbol(getSymbol("ICP")?.coinGeckoId || ''));
  const usdValue = currentUSDValue?.usd;
  return (
    <div className={styles.page}>
      <Header
        className={styles.header}
        showMenu
        type={'wallet'}
        text={'Confirm Buy'}
      ><div className={styles.empty} /></Header>
      <div className={styles.internetCompWrapContainer}>
        <div className={styles.imgCont}>
          <img src={getTokenImageURL(asset)} className={styles.ethIconContainer}></img>
        </div>
        <div className={styles.ethTextContainer}>
          <span className={styles.ethereumText}>{index}</span>
          <span className={styles.ethVal}>{price / Math.pow(10, 8)} ICP</span>
          <span className={styles.usdText}>${(price * usdValue / Math.pow(10, 8)).toFixed(3)}</span>
        </div>
        <div className={styles.earthFeeContainer}>
          <span className={styles.earthFeeText}>Network Fee</span>
          <div className={styles.earthFeeRightSideContainer}>
            <span className={styles.earthVal}>0.0001 ICP</span>
            <span className={styles.convertedVal}>${(0.0001 * usdValue).toFixed(3)}</span>
          </div>
        </div>
        <div className={styles.gasFeeContainer}>
          <div className={styles.leftSideContainer}>
            <span className={styles.gasFeeText}>Wallet Fee</span>
            <button className={styles.editButton}>Edit</button>
          </div>
          <div className={styles.rightSideContainer}>
            <span className={styles.earthText}>{price / Math.pow(10, 10)} ICP</span>
            <span className={styles.convertedVal}>${(price * usdValue / Math.pow(10, 10)).toFixed(3)}</span>
          </div>
        </div>

        <div className={styles.totalContainer}>
          <span className={styles.totalText}>Total</span>
          <div className={styles.rightSideTotalContainer}>
            <span className={styles.totalEarthVal}>{price / Math.pow(10, 8)} ICP</span>
            <span className={styles.totalUSDVal}>${(price * usdValue / Math.pow(10, 8)).toFixed(3)}</span>
          </div>
        </div>
      </div>
      <div
        style={{
          margin: '0 30px 30px 30px',
          position: 'absolute',
          bottom: 0,
          left: 0,
        }}
      >
        <NextStepButton
          disabled={true}
          onClick={() =>
            console.log('Buy')
          }
        >
          {'Buy NFT'}
        </NextStepButton>
      </div>
    </div >
  );
};

export default withRouter(NFTSettle);
