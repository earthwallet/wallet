import React from 'react';

import styles from './index.scss';
import { useHistory } from 'react-router-dom';

const StarterPage = () => {
  const history = useHistory();

  return <div className={styles.page}>
    <h1> Welcome to Earth Wallet Page </h1>
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
      onClick={() => history.push(`/wallet/transactions/d3e13d4777e22367532053190b6c6ccf57444a61337e996242b1abfb52cf92c8`)}
    >
      Transactions
    </div>
    <div
      className={styles.link}
      onClick={() => history.push(`/wallet/transaction/25cc95c15f11b46a316fa4112056ec8b142a5b82a4ad1dce5cabefa8baf05eb9`)}
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
