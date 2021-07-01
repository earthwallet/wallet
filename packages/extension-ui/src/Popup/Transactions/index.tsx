// [object Object]
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-key */
/* eslint-disable camelcase */
/* eslint-disable  header/header */

import type { ThemeProps } from '../../types';

import { getBalance, getTransactions } from '@earthwallet/sdk';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import bg_wallet_details from '../../assets/bg_wallet_details.png';
// import { ActionContext } from '../../components';
import ICON_CARET from '../../assets/icon_caret.svg';
import ICON_FAILED from '../../assets/icon_failed.svg';
import ICON_FORWARD from '../../assets/icon_forward.svg';
import ICON_RECV from '../../assets/icon_receive.svg';
import ICON_SEND from '../../assets/icon_send_status.svg';
import { getShortAddress } from '../Utils/CommonUtils';

interface Props extends RouteComponentProps<{address: string}>, ThemeProps {
  className?: string;
}
interface keyable {
  [key: string]: any
}

const Transactions = ({ className, match: { params: { address } } }: Props) => {
  // const onAction = useContext(ActionContext);
  const history = useHistory();
  const [walletTransactions, setWalletTransactions] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [usdValue, setUsdValue] = useState<number>(0);

  console.log(loading);

  const getTransactionDetail = (transaction: any): any => {
    const operations = transaction.transaction.operations
      .filter((operation: { type: string; }) => operation.type === 'TRANSACTION')
      .filter((operation: { account: any; }) => operation.account.address === address);

    return operations[0];
  };

  const getTransactionTime = (transaction: any): any => {
    const timestamp: number = transaction.transaction.metadata.timestamp;

    return moment((timestamp / 1000000)).format('MMM DD');
  };

  const getTransactionWithDetail = (transaction: any): any => {
    const operations = transaction.transaction.operations
      .filter((operation: { type: string; }) => operation.type === 'TRANSACTION')
      .filter((operation: { account: any; }) => operation.account.address !== address);

    return operations[0];
  };

  const getICPUSDValue = async () => {
    const fetchHeaders = new Headers();

    fetchHeaders.append('accept', 'application/json');

    const requestOptions: RequestInit = {
      method: 'GET',
      headers: fetchHeaders,
      redirect: 'follow'
    };

    const factor: keyable = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=internet-computer&vs_currencies=usd', requestOptions)
      .then((response) => response.json())
      .catch((error) => console.log('error', error));

    setUsdValue(parseFloat(factor['internet-computer'].usd));
  };

  useEffect(() => {
    const loadBalance = async (address: string) => {
      setLoading(true);
      const balance: keyable = await getBalance(address, 'ICP');

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
    const transactions = await getTransactions(address, 'ICP');

    setWalletTransactions(transactions);
  };

  const statusToIcon = (status: string) => {
    switch (status) {
      case 'Receive':
        return ([
          <img src={ICON_RECV} />
        ]);
      case 'Send':
        return ([
          <img src={ICON_SEND} />
        ]);
      case 'Failed':
        return ([
          <img src={ICON_FAILED} />
        ]);
      default:
        return <div />;
    }
  };

  return (
    <div className={className}>
      {/*        <Header
            text={'Transactions'}
            className={'header'}
            showAccountsDropdown
            showMenu
            type={'wallet'} /> */}

      <div className={'transCont'}>
        <div
          className={'backTransButton'}

          onClick={() => history.goBack()}>
          <img src={ICON_CARET} />

          <div className={'transTitle'}>Transactions</div>
        </div>
        {/*   <div className="transactions-div">
            {walletTransactions &&
                  walletTransactions?.transactions &&
                  walletTransactions?.transactions?.reverse().map(
                    (transaction: { block_identifier: { hash: string } }) => {
                      return (
                        <div className="transaction-item-div">

                          <div className='transaction-detail-div'>
                            <div className='transaction-type'>{(getTransactionDetail(transaction) && getTransactionDetail(transaction).amount).value > 0 ? 'Receive' : 'Send'}</div>
                            <div className='transaction-detail'>{`${getTransactionWithDetail(transaction)?.amount?.value > 0 ? 'To:' : 'From:'} ${getShortAddress(getTransactionWithDetail(transaction)?.account.address || 'Self')}`}</div>
                          </div>
                          <div className='transaction-amount'>{`${(getTransactionDetail(transaction) && getTransactionDetail(transaction).amount).value / Math.pow(10, (getTransactionDetail(transaction) && getTransactionDetail(transaction).amount).currency.decimals)}` + ` ${(getTransactionDetail(transaction) && getTransactionDetail(transaction).amount).currency.symbol}`}</div>

                        </div>
                      );
                    }
                  )}
            {walletTransactions &&
                  !walletTransactions?.transactions?.length && (
              <div className="transaction-item-div">
                      No Transaction History
              </div>
            )}
          </div> */}
        <div className={'transItems'}>
          {walletTransactions &&
                  walletTransactions?.transactions &&
                  walletTransactions?.transactions?.sort((a: keyable, b: keyable) => getTransactionTime(a) - getTransactionTime(b)).reverse().map(
                    (transaction: keyable, index: number) => <div className={'transItem'}
                      key={index}
                      onClick={() => history.push(`/wallet/transaction/${transaction?.transaction?.transaction_identifier?.hash}`)}
                    >
                      <div className={'transColIcon'}>
                        {statusToIcon((getTransactionDetail(transaction) && getTransactionDetail(transaction).amount).value > 0 ? 'Receive' : 'Send')}
                      </div>
                      <div className={'transColStatus'}>
                        <div>{(getTransactionDetail(transaction) && getTransactionDetail(transaction).amount).value > 0 ? 'Receive' : 'Send'}</div>
                        <div className={'transSubColTime'}>
                          <div>{getTransactionTime(transaction) || 'Jun 7'}</div>
                          <div className={'transSubColDot'}></div>
                          <div>to {getShortAddress(getTransactionWithDetail(transaction)?.account.address || 'Self')}</div>
                        </div>
                      </div>

                      <div className={'transColValue'}>
                        <div>
                          {(getTransactionDetail(transaction) && getTransactionDetail(transaction).amount).value / Math.pow(10, (getTransactionDetail(transaction) && getTransactionDetail(transaction).amount).currency.decimals)} ICP
                        </div>
                        <div className={'transSubColPrice'}>
                        ${((getTransactionDetail(transaction) && getTransactionDetail(transaction).amount).value / Math.pow(10, (getTransactionDetail(transaction) && getTransactionDetail(transaction).amount).currency.decimals) * usdValue).toFixed(3)}
                        </div>
                      </div>
                      <div className={'transColAction'}>
                        <img src={ICON_FORWARD} />
                      </div>

                    </div>)}
        </div>
      </div>
    </div>
  );
};

export default withRouter(styled(Transactions)`
width: auto;
display: flex;
flex-direction: column;
align-items: center;
height: -webkit-fill-available;
background: url(${bg_wallet_details});

.backTransButton {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    user-select: none;
}

.backTransButton:active {
    opacity: 0.7;
}

.transColIcon {
    margin-right: 8px;
    margin-top: 2px;
}

.transCont {
    backdrop-filter: blur(7px);
    height: 568px;
    width: 343px;
    margin: 16px;
    border: 1px solid #2496FF;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: column;
    box-sizing: border-box;
    padding: 12px;
    overflow: hidden;
};

.transTitle {
    font-weight: 500;
    font-size: 16px;
    line-height: 150%;
    /* identical to box height, or 24px */
    
    text-align: center;
    
    /* Brand / Moonlight Grey / 100% */
    color: #E6E9ED;
    }

    .transItem {
        border-bottom : 1px solid #FFFFFF1A;
        padding: 23px 0;
        display: flex;
        width: calc(340px - 32px);
        overflow: hidden;
        cursor: pointer;
        user-select: none;

        &:active {
          opacity: 0.7;
        }
    }

    .transColStatus {
     display: flex;
     flex-direction: column;
     width: 150px;
     margin-right: 21px;
    }
    .transSubColTime {
        display: flex;
        flex-direction: row;
        font-style: normal;
        font-weight: normal;
        font-size: 12px;
        line-height: 12px;
        /* identical to box height, or 100% */


        color: #FAFBFB;

        opacity: 0.54;
        display: flex;
        align-items: center;
    }

    .transSubColPrice {

        font-style: normal;
        font-weight: normal;
        font-size: 12px;
        line-height: 12px;
        /* identical to box height, or 100% */


        color: #FAFBFB;

        opacity: 0.54;
    }

    .transColAction {
       display: flex;
       align-self: center;
    }

    .transColValue {
        align-items: flex-end;
        margin-right: 16px;
        display: flex;
        flex-direction: column;
        text-align: end;
        flex: 1;
    }
    .transSubColDot { 
        width: 2px;
        height: 2px;
        margin: 0 3px;
        border-radius : 6px;
        background: #989DA9;
    }

    .transItems {
        height: 502px;
        overflow: hidden scroll;
    }
`);
