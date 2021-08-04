import React, { useEffect, useState } from 'react';
import styles from './index.scss';
import ICON_CARET from '~assets/images/icon_caret.svg';
import ICON_FAILED from '~assets/images/icon_failed.svg';
import ICON_FORWARD from '~assets/images/icon_forward.svg';
import ICON_RECV from '~assets/images/icon_receive.svg';
import ICON_SEND from '~assets/images/icon_send_status.svg';
import { useHistory } from 'react-router-dom';
import { RouteComponentProps, withRouter } from 'react-router';

import { getBalance } from '@earthwallet/sdk';
import moment from 'moment-mini';
import { getShortAddress } from '~utils/common';

interface Props extends RouteComponentProps<{ address: string }> {
  className?: string;
}
interface keyable {
  [key: string]: any;
}
const Transactions = ({
  match: {
    params: {
      address = 'd3e13d4777e22367532053190b6c6ccf57444a61337e996242b1abfb52cf92c8',
    },
  },
}: Props) => {
  const history = useHistory();
  const [walletTransactions, setWalletTransactions] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [usdValue, setUsdValue] = useState<number>(0);

  console.log(loading, address);

  const getTransactionDetail = (transaction: any): any => {
    const operations = transaction.transaction.operations
      .filter((operation: { type: string }) => operation.type === 'TRANSACTION')
      .filter(
        (operation: { account: any }) => operation.account.address === address
      );

    return operations[0];
  };

  const getTransactionTime = (transaction: any): any => {
    const timestamp: number = transaction.transaction.metadata.timestamp;

    return moment(timestamp / 1000000).format('MMM DD');
  };

  const getTransactionWithDetail = (transaction: any): any => {
    const operations = transaction.transaction.operations
      .filter((operation: { type: string }) => operation.type === 'TRANSACTION')
      .filter(
        (operation: { account: any }) => operation.account.address !== address
      );

    return operations[0];
  };

  const getICPUSDValue = async () => {
    const fetchHeaders = new Headers();

    fetchHeaders.append('accept', 'application/json');

    const requestOptions: RequestInit = {
      method: 'GET',
      headers: fetchHeaders,
      redirect: 'follow',
    };

    const factor: keyable = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=internet-computer&vs_currencies=usd',
      requestOptions
    )
      .then((response) => response.json())
      .catch((error) => console.log('error', error));

    setUsdValue(parseFloat(factor['internet-computer'].usd));
  };

  useEffect(() => {
    const loadBalance = async (address: string) => {
      console.log(address);
      setLoading(true);
      const balance: keyable = await getBalance(address, 'ICP');
      // const balance: keyable = {};
      console.log(balance, 'balance');
      setLoading(false);

      if (balance && balance?.balances != null) {
        getICPUSDValue();
      }
    };

    if (address) {
      loadBalance(address);
      loadTransactions(address);
    }
  }, [address]);

  const loadTransactions = async (address: string) => {
    console.log(address);

    const transactions = {
      transactions: [
        {
          block_identifier: {
            index: 140946,
            hash: 'f462f2fd58ddfd957def7991fab2a1404875f99c67389d67d48ff4f7bd49026c',
          },
          transaction: {
            transaction_identifier: {
              hash: 'd11b7b678638c34e67dfa35026ab35208860ef62da68ddaf5fc23e57d68b30e7',
            },
            operations: [
              {
                operation_identifier: {
                  index: 0,
                },
                type: 'TRANSACTION',
                status: 'COMPLETED',
                account: {
                  address:
                    'd3e13d4777e22367532053190b6c6ccf57444a61337e996242b1abfb52cf92c8',
                },
                amount: {
                  value: '-10951000',
                  currency: {
                    symbol: 'ICP',
                    decimals: 8,
                  },
                },
              },
              {
                operation_identifier: {
                  index: 1,
                },
                type: 'TRANSACTION',
                status: 'COMPLETED',
                account: {
                  address:
                    '07b1b5f1f023eaa457a6d63fe00cea8cae5c943461350de455cb2d1f3dec8992',
                },
                amount: {
                  value: '10951000',
                  currency: {
                    symbol: 'ICP',
                    decimals: 8,
                  },
                },
              },
              {
                operation_identifier: {
                  index: 2,
                },
                type: 'FEE',
                status: 'COMPLETED',
                account: {
                  address:
                    'd3e13d4777e22367532053190b6c6ccf57444a61337e996242b1abfb52cf92c8',
                },
                amount: {
                  value: '-10000',
                  currency: {
                    symbol: 'ICP',
                    decimals: 8,
                  },
                },
              },
            ],
            metadata: {
              block_height: 140946,
              memo: 8313622071006371696,
              timestamp: 1623151038000816251,
            },
          },
        },
      ],
      total_count: 7,
    };

    setWalletTransactions(transactions);
  };

  const statusToIcon = (status: string) => {
    switch (status) {
      case 'Receive':
        return [<img src={ICON_RECV} />];
      case 'Send':
        return [<img src={ICON_SEND} />];
      case 'Failed':
        return [<img src={ICON_FAILED} />];
      default:
        return <div />;
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.transCont}>
        <div
          className={styles.backTransButton}
          onClick={() => history.goBack()}
        >
          <img src={ICON_CARET} />

          <div className={styles.transTitle}>Transactions</div>
        </div>

        <div className={styles.transItems}>
          {walletTransactions &&
            walletTransactions?.transactions &&
            walletTransactions?.transactions
              ?.sort(
                (a: keyable, b: keyable) =>
                  getTransactionTime(a) - getTransactionTime(b)
              )
              .reverse()
              .map((transaction: keyable, index: number) => (
                <div
                  className={styles.transItem}
                  key={index}
                  onClick={() =>
                    history.push(
                      `/wallet/transaction/${transaction?.transaction?.transaction_identifier?.hash}`
                    )
                  }
                >
                  <div className={styles.transColIcon}>
                    {statusToIcon(
                      (
                        getTransactionDetail(transaction) &&
                        getTransactionDetail(transaction).amount
                      ).value > 0
                        ? 'Receive'
                        : 'Send'
                    )}
                  </div>
                  <div className={styles.transColStatus}>
                    <div>
                      {(
                        getTransactionDetail(transaction) &&
                        getTransactionDetail(transaction).amount
                      ).value > 0
                        ? 'Receive'
                        : 'Send'}
                    </div>
                    <div className={styles.transSubColTime}>
                      <div>{getTransactionTime(transaction) || 'Jun 7'}</div>
                      <div className={styles.transSubColDot}></div>
                      <div>
                        to{' '}
                        {getShortAddress(
                          getTransactionWithDetail(transaction)?.account
                            .address || 'Self'
                        )}
                      </div>
                    </div>
                  </div>

                  <div className={styles.transColValue}>
                    <div>
                      {(
                        getTransactionDetail(transaction) &&
                        getTransactionDetail(transaction).amount
                      ).value /
                        Math.pow(
                          10,
                          (
                            getTransactionDetail(transaction) &&
                            getTransactionDetail(transaction).amount
                          ).currency.decimals
                        )}{' '}
                      ICP
                    </div>
                    <div className={styles.transSubColPrice}>
                      $
                      {(
                        ((
                          getTransactionDetail(transaction) &&
                          getTransactionDetail(transaction).amount
                        ).value /
                          Math.pow(
                            10,
                            (
                              getTransactionDetail(transaction) &&
                              getTransactionDetail(transaction).amount
                            ).currency.decimals
                          )) *
                        usdValue
                      ).toFixed(3)}
                    </div>
                  </div>
                  <div className={styles.transColAction}>
                    <img src={ICON_FORWARD} />
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default withRouter(Transactions);
