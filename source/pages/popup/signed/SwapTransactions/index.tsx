import React from 'react';
import styles from './index.scss';
import swapCircle from '~assets/images/swapLoadingCircle.svg';

const SwapTransactions = () => {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
      <img src={swapCircle} className={styles.swapCircleImg} />
        <span className={styles.quoteText}>Quote 3 of 7</span>
        <span className={styles.submittingText}>Submitting Transaction</span>
        <div className={styles.progressBar}>
          <div className={styles.leftSide}></div>
          <div className={styles.rightSide}></div>
        </div>
      </div>
    </div>
  );
};

export default SwapTransactions;
