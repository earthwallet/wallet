import React, { useEffect, useState } from 'react';

import styles from './index.scss';

import moment from 'moment-mini';
import clsx from 'clsx';

import { RouteComponentProps, withRouter } from 'react-router';

import ICON_COPY from '~assets/images/icon_copy_details.svg';
import ICON_ICP_DETAILS from '~assets/images/icon_icp_details.png';
import ICON_OPEN from '~assets/images/icon_open_new.svg';
import Header from '~components/Header';
import { getShortAddress } from '~utils/common';
import { i18nT } from '~i18n/index';

interface Props extends RouteComponentProps<{ txnId: string }> {
  className?: string;
}
interface keyable {
  [key: string]: any;
}

const Details = ({
  match: {
    params: { txnId },
  },
}: Props) => {

  const [loading, setLoading] = useState<boolean>(false);
  const [usdValue, setUsdValue] = useState<number>(0);
  const [transDetail, setTransDetail] = useState<any | null>(null);


  const fetchTransactionDetail = async (transactionId: string) => {
    const myHeaders = new Headers();

    myHeaders.append('accept', 'application/json, text/plain, */*');
    myHeaders.append('content-type', 'application/json;charset=UTF-8');

    const raw: BodyInit = JSON.stringify({
      network_identifier: {
        blockchain: 'Internet Computer',
        network: '00000000000000020101',
      },
      transaction_identifier: {
        hash: transactionId,
      },
    });

    const requestOptions: RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    const transDetail: keyable = await fetch(
      'https://rosetta-api.internetcomputer.org/search/transactions',
      requestOptions
    )
      .then((response) => response.json())
      .catch((error) => console.log('error', error));

    return transDetail;
  };

  const getTransactionDetail = (transaction: any): any => {
    const operations = transaction.transaction.operations;

    const timestamp: number = transaction.transaction.metadata.timestamp;

    return {
      from:
        operations[0].amount?.value < 0
          ? operations[0].account.address
          : operations[1].account.address,
      to:
        operations[0].amount?.value > 0
          ? operations[0].account.address
          : operations[1].account.address,
      amount: Math.abs(
        operations[0].amount.value /
        Math.pow(10, operations[0].amount.currency.decimals)
      ),
      fees: Math.abs(
        operations[2].amount.value /
        Math.pow(10, operations[2].amount.currency.decimals)
      ),
      time: moment(timestamp / 1000000).format('mm:ss on MMM DD YY'),
    };
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
    const loadTransactionDetails = async (txnId: string) => {
      setLoading(true);
      getICPUSDValue();

      const transactionDetail: keyable = await fetchTransactionDetail(txnId);

      if (
        transactionDetail.transactions[0] !== undefined &&
        transactionDetail.transactions[0] !== null
      ) {
        setTransDetail(getTransactionDetail(transactionDetail.transactions[0]));
      }

      setLoading(false);
    };

    if (txnId) {
      loadTransactionDetails(txnId);
    }
  }, [txnId]);

  if ((transDetail === undefined || transDetail === null) && loading !== true) {
    return (
      <div className={styles.page}>
        <div className={clsx(styles.transCont, styles.transErrorCont)}>
          {i18nT('transactionDetails.pleaseCheck')}
          <div className={styles.transError}>{txnId}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.transCont}>
        <Header
          showBackArrow
          className={styles.header}
          showAccountsDropdown={false}
          text={i18nT('transactionDetails.header')}
          type={'details'}
        >
          <div className={styles.headerIcons}>
            <div className={clsx(styles.headerIcon, styles.headerIconFirst)}>
              <img src={ICON_COPY} />
            </div>
            <div
              className={clsx(styles.headerIcon, styles.headerIconSecond)}
              onClick={() =>
                window.open(
                  `https://dashboard.internetcomputer.org/transaction/${txnId}`,
                  '_blank'
                )
              }
            >
              <img src={ICON_OPEN} />
            </div>
          </div>
        </Header>

        <div className={styles.transItems}>
          <div className={styles.transHeader}>
            <div>
              <div className={styles.transAccount}>{i18nT('transactionDetails.from')}</div>
              <div className={styles.transAddressCont}>
                <img className={styles.transIcon} src={ICON_ICP_DETAILS} />
                <div className={styles.transAddress}>
                  {getShortAddress(transDetail?.from || '')}
                </div>
              </div>
            </div>
            <div>
              <div className={styles.transAccount}>{i18nT('transactionDetails.to')}</div>
              <div className={styles.transAddressCont}>
                <img className={styles.transIcon} src={ICON_ICP_DETAILS} />
                <div className={styles.transAddress}>
                  {getShortAddress(transDetail?.to || '')}
                </div>
              </div>
            </div>
            <div>
              <div className={styles.transAccount}>{i18nT('transactionDetails.transaction')}</div>
              <div className={styles.transRow}>
                <div className={styles.transCol1}>{i18nT('transactionDetails.amount')}</div>
                <div className={styles.transCol2}>
                  {transDetail?.amount?.toFixed(4)} ICP
                </div>
              </div>
              <div className={styles.transRow}>
                <div className={styles.transCol1}>{i18nT('transactionDetails.value')}</div>
                <div className={styles.transCol2}>
                  {(transDetail?.amount * usdValue).toFixed(4)} USD
                </div>
              </div>
              <div className={styles.transRow}>
                <div className={styles.transCol1}>{i18nT('transactionDetails.txnFees')}</div>
                <div className={styles.transCol2}>
                  {transDetail?.fees?.toFixed(4)} ICP
                </div>
              </div>
              <div className={styles.transRow}>
                <div className={styles.transCol1}>{i18nT('transactionDetails.total')}</div>
                <div className={styles.transCol2}>
                  {(
                    parseFloat(transDetail?.fees || 0) +
                    parseFloat(transDetail?.amount || 0)
                  )?.toFixed(4)}{' '}
                  ICP
                </div>
              </div>
            </div>
            <div>
              <div className={styles.transAccount}>{i18nT('transactionDetails.activityLog')}</div>
              <div className={styles.transActivity}>
                {i18nT('transactionDetails.activityLog') + ` ${(
                  parseFloat(transDetail?.fees || 0) +
                  parseFloat(transDetail?.amount || 0)
                )?.toFixed(4)} ICP at ${transDetail?.time}.`}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Details);
