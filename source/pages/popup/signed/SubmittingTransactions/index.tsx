import React from 'react';
import styles from './index.scss';

const SubmittingTransactions = () => {
  return (
    <div className={styles.page}>
      <div>
        <div className={styles.submittingTransactionSubContainer}>
          <div className={styles.transactionContainer}>
            <div className={styles.imgContainer}></div>
            <span className={styles.transactionText}>
              Submitting Transaction
            </span>
            <div className={styles.progressBar}>
              <div className={styles.leftSide}></div>
              <div className={styles.rightSide}></div>
            </div>
          </div>
          <span className={styles.subText}>
            You <span className={styles.ethText}>ETH</span> will be added to
            your account once this transaction has processed
          </span>
          <span className={styles.viewText}>View on Internet Computer</span>
        </div>
      </div>
    </div>
  );
};

export default SubmittingTransactions;
