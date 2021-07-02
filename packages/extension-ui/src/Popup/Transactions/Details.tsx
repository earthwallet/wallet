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

import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import styled from 'styled-components';

import bg_wallet_details from '../../assets/bg_wallet_details.png';
// import { ActionContext } from '../../components';
import ICON_COPY from '../../assets/icon_copy_details.svg';
import ICON_ICP_DETAILS from '../../assets/icon_icp_details.png';
import ICON_OPEN from '../../assets/icon_open_new.svg';
import Header from '../../partials/Header';
// import ICON_FAILED from '../../assets/icon_failed.svg';
// import ICON_FORWARD from '../../assets/icon_forward.svg';
// import ICON_RECV from '../../assets/icon_receive.svg';
import { getShortAddress } from '../Utils/CommonUtils';

interface Props extends RouteComponentProps<{txnId: string}>, ThemeProps {
  className?: string;
}
interface keyable {
  [key: string]: any
}

const Details = ({ className, match: { params: { txnId = '25cc95c15f11b46a316fa4112056ec8b142a5b82a4ad1dce5cabefa8baf05eb9' } } }: Props) => {
  // const onAction = useContext(ActionContext);

  const [loading, setLoading] = useState<boolean>(false);
  const [usdValue, setUsdValue] = useState<number>(0);
  const [transDetail, setTransDetail] = useState<any|null>(null);

  console.log(loading, usdValue);

  const fetchTransactionDetail = async (transactionId: string) => {
    const myHeaders = new Headers();

    myHeaders.append('accept', 'application/json, text/plain, */*');
    myHeaders.append('content-type', 'application/json;charset=UTF-8');

    const raw: BodyInit = JSON.stringify({
      network_identifier: {
        blockchain: 'Internet Computer',
        network: '00000000000000020101'
      },
      transaction_identifier: {
        hash: transactionId
      }
    });

    const requestOptions: RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    const transDetail: keyable = await fetch('https://rosetta-api.internetcomputer.org/search/transactions', requestOptions)
      .then((response) => response.json())
      .catch((error) => console.log('error', error));

    return transDetail;
  };

  const getTransactionDetail = (transaction: any): any => {
    const operations = transaction.transaction.operations;

    const timestamp: number = transaction.transaction.metadata.timestamp;

    return { from: operations[0].amount?.value < 0 ? operations[0].account.address : operations[1].account.address,
      to: operations[0].amount?.value > 0 ? operations[0].account.address : operations[1].account.address,
      amount: Math.abs(operations[0].amount.value / Math.pow(10, operations[0].amount.currency.decimals)),
      fees: Math.abs(operations[2].amount.value / Math.pow(10, operations[2].amount.currency.decimals)),
      time: moment((timestamp / 1000000)).format('mm:ss on MMM DD YY') };
  };

  /* const getTransactionTime = (transaction: any): any => {
    const timestamp: number = transaction.transaction.metadata.timestamp;

    return moment((timestamp / 1000000)).format('MMM DD');
  };

  const getTransactionWithDetail = (transaction: any): any => {
    const operations = transaction.transaction.operations
      .filter((operation: { type: string; }) => operation.type === 'TRANSACTION')
      .filter((operation: { account: any; }) => operation.account.address !== address);

    return operations[0];
  }; */

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
    const loadTransactionDetails = async (txnId: string) => {
      setLoading(true);
      getICPUSDValue();

      const transactionDetail: keyable = await fetchTransactionDetail(txnId);

      if (transactionDetail.transactions[0] !== undefined && transactionDetail.transactions[0] !== null) {
        setTransDetail(getTransactionDetail(transactionDetail.transactions[0]));
      }

      setLoading(false);
    };

    if (txnId) {
      loadTransactionDetails(txnId);
    }
  }, [txnId]);

  if ((transDetail === undefined || transDetail === null) && loading !== true) {
    return (<div className={className}>
      <div className={'transCont transErrorCont'}>
        Please check transaction Id
        <div className={'transError'}>{txnId}</div>
      </div>
    </div>);
  }

  return (
    <div className={className}>
      <div className={'transCont'}>
        <Header
          className={'header'}
          showAccountsDropdown={false}
          text={'Details'}
          type={'details'} >
          <div className={'headerIcons'}>
            <div className={'headerIcon headerIconFirst'}>
              <img src={ICON_COPY} />
            </div>
            <div
              className={'headerIcon headerIconSecond'}
              onClick={() => window.open(`https://dashboard.internetcomputer.org/transaction/${txnId}`, '_blank')}>
              <img src={ICON_OPEN} />
            </div>
          </div>

        </Header>

        <div className={'transItems'}>
          <div className={'transHeader'}>
            <div>
              <div className={'transAccount'}>From</div>
              <div className={'transAddressCont'}>
                <img src={ICON_ICP_DETAILS} />
                <div className={'transAddress'}>{getShortAddress(transDetail?.from || '')}</div>
              </div>
            </div>
            <div>
              <div className={'transAccount'}>To</div>
              <div className={'transAddressCont'}>
                <img src={ICON_ICP_DETAILS} />
                <div className={'transAddress'}>{getShortAddress(transDetail?.to || '')}</div>
              </div>
            </div>
            <div>
              <div className={'transAccount'}>Transaction</div>
              <div className={'transRow'}>
                <div className={'transCol1'}>Amount</div>
                <div className={'transCol2'}>{transDetail?.amount?.toFixed(4)} ICP</div>
              </div>
              <div className={'transRow'}>
                <div className={'transCol1'}>Value</div>
                <div className={'transCol2'}>{(transDetail?.amount * usdValue).toFixed(4)} USD</div>
              </div>
              <div className={'transRow'}>
                <div className={'transCol1'}>Transaction Fees</div>
                <div className={'transCol2'}>{(transDetail?.fees)?.toFixed(4)} ICP</div>
              </div>
              <div className={'transRow'}>
                <div className={'transCol1'}>Total</div>
                <div className={'transCol2'}>{(parseFloat(transDetail?.fees || 0) + parseFloat(transDetail?.amount || 0))?.toFixed(4)} ICP</div>
              </div>
            </div>
            <div>
              <div className={'transAccount'}>Activity Log</div>
              <div className={'transActivity'}>
                {`Transaction created with a value of ${(parseFloat(transDetail?.fees || 0) + parseFloat(transDetail?.amount || 0))?.toFixed(4)} ICP at ${transDetail?.time}.`}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(styled(Details)`
width: auto;
display: flex;
flex-direction: column;
align-items: center;
height: -webkit-fill-available;
background: url(${bg_wallet_details});

.headerIcon{
position: static;
width: 33px;
height: 33px;

background: rgba(255, 255, 255, 0.17);
border-radius: 21px;

/* Inside Auto Layout */

flex: none;
order: 0;
flex-grow: 0;
display: flex;
align-items: center;
justify-content: center;
border: 2px solid #131A28;
cursor: pointer;
user-select: none;
}

.headerIconFirst {
    margin-left: 10px;
    margin-right: 10px;
    visibility: hidden;

}
.headerIconSecond {

}

.headerIcons{
    display: flex;
    flex-shrink:0;
    flex-direction: row;
}

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
        width: 317px;
    }

    .transAccount {
        margin-top: 24px;
        margin-bottom: 8px;
        font-family: Poppins;
        font-style: normal;
        font-weight: normal;
        font-size: 16px;
        line-height: 24px;
        color: #FFFFFF;
    }

    .transAddress {
        font-family: DM Mono;
        font-style: normal;
        font-weight: normal;
        font-size: 12px;
        line-height: 12px;
        /* identical to box height, or 100% */


        color: #FAFBFB;

        opacity: 0.54;
    }

    .transAddressCont {
        display: flex;
        align-items: center;
    }

    .transAddress {
        margin-left: 10px;
    }

    .transCol1, .transCol2 {
        font-family: Poppins;
        font-style: normal;
        font-weight: normal;
        font-size: 14px;
        line-height: 21px;
        /* identical to box height */


        color: #FFFFFF;

        opacity: 0.54;
    }

    .transRow {
        display: flex;
        justify-content: space-between;
        height: 40px;
        border-bottom: 1px solid #ffffff1a;
        align-items: center;
    }

    .transError {
        font-family: Poppins;
        font-style: normal;
        font-weight: normal;
        font-size: 12px;
        line-height: 21px;
        /* identical to box height */


        color: #FFFFFF;

        opacity: 0.54;
        word-break:break-all;

    }

    .transErrorCont {
        display: flex;
        align-items: center;
        justify-content: center;
    }
`);
