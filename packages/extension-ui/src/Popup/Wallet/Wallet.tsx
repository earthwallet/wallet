// Copyright 2021 @earthwallet/extension-ui authors & contributors
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

import type { ThemeProps } from '../../types';

import { Header } from '@earthwallet/extension-ui/partials';
import { symbolGenesisMap } from '@earthwallet/extension-ui/util/chains';
import { getBalance,
  getTransactions } from '@earthwallet/sdk/build/main/util/icp';
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';

import icpLogo from '../../assets/icp-logo.png';
import ksmLogo from '../../assets/kusama-ksm-logo.svg';
import dotLogo from '../../assets/polkadot-new-dot-logo.svg';
import { Link, SelectedAccountContext } from '../../components';

interface Props extends ThemeProps {
  className?: string;
}

// eslint-disable-next-line space-before-function-paren
const Wallet = function ({ className }: Props): React.ReactElement<Props> {
  const [selectedTab, setSelectedTab] = useState('Transactions');
  const { selectedAccount } = useContext(SelectedAccountContext);
  const [walletBalance, setWalletBalance] = useState<any>();
  const [walletTransactions, setWalletTransactions] = useState<any>();

  const getValueInUSD = (balance: number, symbol: string): string => {
    if (symbol === 'ICP') return `${balance * 80}`;
    if (symbol === 'DOT') return `${balance * 20}`;
    if (symbol === 'KSM') return `${balance * 120}`;

    return `${balance}`;
  };

  const loadBalance = async (address: string) => {
    const balance = await getBalance(address);

    setWalletBalance(balance);
  };

  const loadTransactions = async (address: string) => {
    const transactions = await getTransactions(address);

    console.log('transactions', transactions);
    setWalletTransactions(transactions);
  };

  const getTransactionDetail = (transaction: any): any => {
    const operations = transaction.transaction.operations
      .filter((operation: { type: string; }) => operation.type === 'TRANSACTION')
      .filter((operation: { account: any; }) => operation.account.address === selectedAccount?.address);

    console.log('operations', operations);

    return operations[0];
  };

  useEffect(() => {
    if (selectedAccount && selectedAccount?.address) {
      loadBalance(selectedAccount?.address);
      loadTransactions(selectedAccount?.address);
    }
  }, [selectedAccount]);

  const getNetworkLogo = () => {
    if (selectedAccount?.genesisHash == null) { return icpLogo; }

    if (symbolGenesisMap().get(selectedAccount.genesisHash) === 'ICP') return icpLogo;
    if (symbolGenesisMap().get(selectedAccount.genesisHash) === 'DOT') return dotLogo;
    if (symbolGenesisMap().get(selectedAccount.genesisHash) === 'KSM') return ksmLogo;

    return icpLogo;
  };

  return (
    <>
      <Header
        showAccountsDropdown
        showMenu />
      <div className={className}>
        <Link className='topCancelButton'
          to='/'>BACK</Link>
        <img
          className='network-logo'
          src={getNetworkLogo()}
        />
        <div className='primaryBalanceLabel'>{walletBalance?.balances[0] &&
                  `${walletBalance?.balances[0]?.value} ${walletBalance?.balances[0]?.currency?.symbol}`
        }</div>
        <div className='secondaryBalanceLabel'>{walletBalance?.balances[0] && ('$' +
                getValueInUSD(
                  walletBalance?.balances[0]?.value,
                  walletBalance?.balances[0]?.currency?.symbol
                ))}</div>
        <div className='walletActionsView'>

          <div
            className='tokenActionView receiveTokenAction'
          >
            <Link to='/wallet/receive'>
              <FontAwesomeIcon
                className='tokenActionButton'
                color='#fff'
                icon={faArrowDown}
                size='lg'
              />
            </Link>
            <div className='tokenActionLabel'>Receive</div>
          </div>

          <div
            className='tokenActionView sendTokenAction'
          >
            <Link to='/wallet/send'>
              <FontAwesomeIcon
                className='tokenActionButton'
                color='#fff'
                icon={faArrowUp}
                size='lg'
              />
            </Link>
            <div className='tokenActionLabel'>Send</div>
          </div>
        </div>

        <div className='assetsAndActivityDiv'>
          <div className='tabsView'>
            <div
              className={'tabView ' + (selectedTab === 'Transactions' ? 'selectedTabView' : '') }
              onClick={() => setSelectedTab('Transactions')}
            >
         Transactions
            </div>
          </div>

          <div className="transactions-div">
            {walletTransactions &&
                  walletTransactions?.transactions &&
                  walletTransactions?.transactions?.map(
                    (transaction: { block_identifier: { hash: string } }) => {
                      return (
                        <div className="transaction-item-div">
                          <FontAwesomeIcon
                            className='transaction-type-icon'
                            color='#fff'
                            icon={getTransactionDetail(transaction).amount.value > 0 ? faArrowDown : faArrowUp }
                            size='lg'
                          />
                          <div className='transaction-detail-div'>
                            <div className='transaction-type'>{getTransactionDetail(transaction).amount.value > 0 ? 'Receive' : 'Send'}</div>
                          </div>
                          <div className='transaction-amount'>{`${getTransactionDetail(transaction).amount.value / Math.pow(10, getTransactionDetail(transaction).amount.currency.decimals)}` + ` ${getTransactionDetail(transaction).amount.currency.symbol}`}</div>

                        </div>
                      );
                    }
                  )}
            {walletTransactions &&
                  !walletTransactions?.transactions?.length && (
              <div className="transaction-item-div">
                      No Transactions History
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default styled(Wallet)(({ theme }: Props) => `
    width: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: -webkit-fill-available;

    .topCancelButton {
        cursor: pointer;
        color: ${theme.buttonBackground};
        font-family: ${theme.fontFamily};
        font-size: 12px;
        align-self: flex-end;
        &:hover {
            color: ${theme.buttonBackgroundHover};
        }
    }
    
    .network-logo {
    height: 28px;
    width: 28px;
    margin-bottom: 16px;
    border-radius: 50%;
    border: 1px solid ${theme.subTextColor};
    padding: 4px;
    background-color: ${theme.tokenLogoBackground};
    object-fit: contain;
    object-position: center;
    }

    .primaryBalanceLabel {
    color: ${theme.textColor};
    font-family: ${theme.fontFamily};
    font-size: 30px;
    margin: 12px;
    }

    .secondaryBalanceLabel {
    color: ${theme.subTextColor};
    font-family: ${theme.fontFamily};
    font-size: 20px;
    }

    .walletActionsView {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 18px;
    }

    .tokenActionView {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    }

    .tokenActionButton {
    height: 26px;
    width: 26px;
    background-color: ${theme.buttonBackground};
    padding: 10px;
    border-radius: 50%;
    &:hover {
        background-color: ${theme.buttonBackgroundHover};
        cursor: pointer;
      }
    }

    .tokenActionLabel {
    color: ${theme.buttonBackground};
    font-family: ${theme.fontFamily};
    font-size: ${theme.fontSize};
    margin-top: 6px;
    }

    .receiveTokenAction {
        margin-right: 18px;
    }

    .sendTokenAction {
        margin-left: 18px;
    }

    .assetsAndActivityDiv{
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 16px;
    height: 100%;
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), rgba(36, 150, 255, 0.32);
    border: 1px solid #2496FF;
    box-sizing: border-box;
    border-top-left-radius: 32px;
    border-top-right-radius: 32px;
    }

    .tabsView {
    height: 46px;
    width: 340px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    }

    .tabView {
    flex: 1;
    height: 46px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    box-shadow: inset 0 -1px 0 ${theme.buttonBackground};
    border-top-left-radius: 32px;
    border-top-right-radius: 32px;
    }

    .selectedTabView {
    flex: 1;
    height: 46px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    box-shadow: inset 0 -3px 0 ${theme.buttonBackground};
    }

    .transactions-div {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: scroll;
    height: 160px;
    }

    .transaction-item-div {
    display: flex;
    flex-direction: row;
    padding: 8px 12px;
    font-size: 12px;
    border-bottom: 1px solid #1b63a677;
    align-items: center;
    }

    .transaction-type-icon{
    height: 16px;
    width: 16px;
    border: 1px solid #1b63a677;
    padding: 10px;
    border-radius: 50%;
    margin-right: 12px;
    }

    .transaction-detail-div {
    display: flex;
    flex-direction: column;
    flex: 1;
    }

    .transaction-type {
        font-size: 16px;
    }

    .transaction-amount {
        font-size: 18px;
    }

`);
