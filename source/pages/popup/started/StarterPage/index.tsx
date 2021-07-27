import React from 'react';

import styles from './index.scss';
import { useHistory } from 'react-router-dom';

const StarterPage = () => {
  const history = useHistory();

  return <div className={styles.page}>
    <h1> Welcome to Starter Page </h1>
    <div
      className={styles.link}
      onClick={() => history.push(`/accounts`)}
    >
      Accounts
    </div>
    <div
      className={styles.link}
      onClick={() => history.push(`/account/create`)}
    >
      Create Account
    </div>
    <div
      className={styles.link}
      onClick={() => history.push(`/account/export/5xxxx`)}
    >
      Export Account
    </div>
    <div
      className={styles.link}
      onClick={() => history.push(`/account/import-seed`)}
    >
      Import Seed
    </div>
    <div
      className={styles.link}
      onClick={() => history.push(`/wallet/details`)}
    >
      Account Details
    </div>
    <div
      className={styles.link}
      onClick={() => history.push(`/wallet/transactions/5xxxx`)}
    >
            Transactions
    </div>
    <div
      className={styles.link}
      onClick={() => history.push(`/wallet/transaction/6xxxx`)}
    >
      Transactions Details
    </div>
 
    <div
      className={styles.link}
      onClick={() => history.push(`/wallet/send`)}
    >
      WalletSendTokens
    </div>
    <div
      className={styles.link}
      onClick={() => history.push(`/wallet/receive`)}
    >
      WalletReceiveTokens
    </div>
    <div
      className={styles.link}
      onClick={() => history.push(`/portfolio`)}
    >
      Portfolio
    </div>
  </div>;
};

export default StarterPage;
