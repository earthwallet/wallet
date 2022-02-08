import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import useQuery from '~hooks/useQuery';
import styles from './index.scss';
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

  return (
    <div className={styles.page}>
      <div className={styles.internetCompWrapContainer}>
        <div className={styles.ethIconContainer}></div>
        <div className={styles.ethTextContainer}>
          <span className={styles.ethereumText}>{nftId}</span>
          <span className={styles.ethVal}>{price / Math.pow(10, 8)} ICP</span>
          <span className={styles.usdText}>$10,092.22</span>
        </div>
        <div className={styles.earthFeeContainer}>
          <span className={styles.earthFeeText}>Network Fee</span>
          <div className={styles.earthFeeRightSideContainer}>
            <span className={styles.earthVal}>0.0001 ICP</span>
            <span className={styles.convertedVal}>$0.25</span>
          </div>
        </div>
        <div className={styles.gasFeeContainer}>
          <div className={styles.leftSideContainer}>
            <span className={styles.gasFeeText}>Wallet Fee</span>
            <button className={styles.editButton}>Edit</button>
          </div>
          <div className={styles.rightSideContainer}>
            <span className={styles.earthText}>{price / Math.pow(10, 10)} ICP</span>
            <span className={styles.convertedVal}>$0.25</span>
          </div>
        </div>

        <div className={styles.totalContainer}>
          <span className={styles.totalText}>Total</span>
          <div className={styles.rightSideTotalContainer}>
            <span className={styles.totalEarthVal}>500 EARTH</span>
            <span className={styles.totalUSDVal}>$4,018.41</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(NFTSettle);
