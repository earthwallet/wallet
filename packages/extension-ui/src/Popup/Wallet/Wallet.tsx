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
import { ICP } from '@earthwallet/sdk';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import styled from 'styled-components';

import bg_wallet_details from '../../assets/bg_wallet_details.png';
import icon_copy from '../../assets/icon_copy.svg';
import icon_rec from '../../assets/icon_rec.svg';
import icon_send from '../../assets/icon_send.svg';
import icpLogo from '../../assets/icp-logo.png';
import { Link, SelectedAccountContext } from '../../components';
import useToast from '../../hooks/useToast';
import { getShortAddress } from '../Utils/CommonUtils';

// import bg_wallet_details_2x from '../../assets/bg_wallet_details@2x.png';

interface Props extends ThemeProps {
  className?: string;
}
interface keyable {
  [key: string]: any
}

// eslint-disable-next-line space-before-function-paren
const Wallet = function ({ className }: Props): React.ReactElement<Props> {
  const [selectedTab, setSelectedTab] = useState('Transactions');
  const { selectedAccount } = useContext(SelectedAccountContext);
  const [walletBalance, setWalletBalance] = useState<any|null>(null);
  const [walletTransactions, setWalletTransactions] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [usdValue, setUsdValue] = useState<number>(0);

  const { show } = useToast();

  const _onCopy = useCallback((): void => show('Copied'), [show]);

  const getBalanceInUSD = async (walletBalance: keyable) => {
    const balance = walletBalance?.balances[0]?.value;
    const decimals = walletBalance?.balances[0]?.currency?.decimals;

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

    setUsdValue((balance / Math.pow(10, decimals)) * parseFloat(factor['internet-computer'].usd));
  };

  const loadTransactions = async (address: string) => {
    const transactions = await ICP.getTransactions(address);

    console.log('transactions', transactions);
    setWalletTransactions(transactions);
  };

  useEffect(() => {
    const loadBalance = async (address: string) => {
      setLoading(true);
      const balance: keyable = await ICP.getBalance(address);

      setLoading(false);

      if (balance && balance?.balances != null) {
        setWalletBalance(balance);
        getBalanceInUSD(balance);
      }
    };

    if (selectedAccount && selectedAccount?.address) {
      loadBalance(selectedAccount?.address);
      loadTransactions(selectedAccount?.address);
    }
  }, [selectedAccount]);

  const getNetworkLogo = () => {
    if (selectedAccount?.genesisHash == null) { return icpLogo; }

    if (symbolGenesisMap().get(selectedAccount?.genesisHash) === 'ICP') return icpLogo;

    return icpLogo;
  };

  return (
    <>
      <div className={className}>
        <Header
          className={'header'}
          showAccountsDropdown
          showMenu
          type={'wallet'} />
        <img
          className='network-logo'
          src={getNetworkLogo()}
        />
        <div className='network-text'>Internet Computer</div>
        <div className='primaryBalanceLabel'>
          { loading
            ? <SkeletonTheme color="#222"
              highlightColor="#000">
              <Skeleton width={150} />
            </SkeletonTheme>
            : <div className='primaryBalanceLabel'>{walletBalance && walletBalance?.balances[0] &&
                  `${walletBalance?.balances[0]?.value / Math.pow(10, walletBalance?.balances[0]?.currency?.decimals)} ${walletBalance?.balances[0]?.currency?.symbol}`
            }</div>
          }</div>
        <div className='secondaryBalanceLabel'>
          { loading
            ? <SkeletonTheme color="#222"
              highlightColor="#000">
              <Skeleton width={100} />
            </SkeletonTheme>
            : <span className='secondaryBalanceLabel'>${usdValue.toFixed(3)}</span>}
        </div>

        <CopyToClipboard
          text={selectedAccount?.address || ''} >
          <div
            className='copyActionsView'
            onClick={_onCopy}>
            <div className='copyCont'>
              <div className='copyName'>{selectedAccount?.name}</div>
              <div className='copyAddress'>{getShortAddress(selectedAccount?.address || '')}</div>
            </div>
            <div className='copyButton'>
              <img
                className='iconCopy'
                src={icon_copy}
              />
            </div>
          </div>
        </CopyToClipboard>

        <div className='walletActionsView'>
          <div
            className='tokenActionView receiveTokenAction'
          >
            <Link to='/wallet/receive'>
              <div
                className='tokenActionButton'
              >
                <img
                  className='iconActions'
                  src={icon_rec}
                />
                <div className='tokenActionLabel'>Receive</div>
              </div>

            </Link>

          </div>

          <div
            className='tokenActionView sendTokenAction'
          >
            <Link to='/wallet/send'>
              <div
                className='tokenActionButton'
              >
                <img
                  className='iconActions'
                  src={icon_send}
                />
                <div className='tokenActionLabel'>Send</div>
              </div>
            </Link>
          </div>
        </div>

        <Link to={`/wallet/transactions/${selectedAccount?.address}`} >

          <div className='assetsAndActivityDiv'>
            <div className='tabsPill'></div>
            <div className='tabsView'>
              <div
                className={'tabView ' + (selectedTab === 'Transactions' ? 'selectedTabView' : '') }
                onClick={() => setSelectedTab('Transactions')}
              >
             Transactions {walletTransactions?.transactions?.length === 0 || walletTransactions?.transactions === undefined ? '' : `(${walletTransactions?.transactions?.length})` }
              </div>
            </div>
          </div>
        </Link>
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
    background: url(${bg_wallet_details});
    
    .header {
      width: ${theme.appWidth}
    }
    
    .iconCopy{
      width: 17px;
      height: 20px;
    }

    .tabsPill{
      width: 29px;
      height: 3px;
      background: #175b99;
      border-radius: 29px;
      display: flex;
      flex-basis: 3px;
      min-height: 3px;
      margin-top: 9px;
    }

    .copyButton {
      width: 41.86px;
      height: 41.86px;
      background: #0d3151;
      display: flex;
      border-radius: 52.9397px;
      flex-basis: 42px;
      min-height: 42px;
      min-width: 42px;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      user-select: none;
      &:hover {
        opacity: 0.95;
        cursor: pointer;
      }
      &:active {
        opacity: 0.65;
        cursor: pointer;
      }
    }

    .copyCont {
      overflow: hidden;
      height: 42px;
      min-height: 42px;
    }

    .copyName {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1; /* number of lines to show */
      -webkit-box-orient: vertical;
    }

    .copyAddress{
      font-family: DM Mono;
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      line-height: 150%;
      letter-spacing: 0.615578px;
      color: #E6E9ED;
    }

    .copyName {
      font-family: Poppins;
      font-style: normal;
      font-weight: normal;
      font-size: 12px;
      line-height: 150%;
      text-align: left;
      color: #FAFBFB;
      opacity: 0.51;
    }

    .copyActionsView {
      border: 2px solid #2496FF40;
      box-sizing: border-box;
      border-radius: 49.2462px;
      width: 245px;
      height: 52px;
      padding: 0px 3px 0 15px;
      min-height: 52px;
      align-items: left;
      justify-content: space-between;
      flex-direction: row;
      display: flex;
      align-items: center;
      margin-top: 12px;

     }

    .iconActions {
      margin-right: 10px;
    }
    .network-text {
      font-family: Poppins;
      font-style: normal;
      font-weight: normal;
      font-size: 15px;
      line-height: 150%;
      text-align: center;
      color: ${theme.moonLightGrey};
      opacity: 0.7;
    }

    .network-logo {
      height: 50px;
      width: 50px;
      margin-bottom: 16px;
      border-radius: 50%;
      border: 1px solid ${theme.subTextColor};
      background-color: ${theme.tokenLogoBackground};
      object-fit: contain;
      object-position: center;
      margin-top: 90px;
    }

    .primaryBalanceLabel {
      color: ${theme.textColor};
      font-family: ${theme.fontFamilyMono};
      font-size: 34px;
      line-height: 44px;
      height: 44px;
      text-align: center;
      margin: 3px;
      text-shadow: 0px 0px 11.4544px rgba(177, 204, 255, 0.89);
    }

    .secondaryBalanceLabel {
      color: ${theme.usdBalance};
      font-family: ${theme.fontFamilyMono};
      font-size: 16px;
      line-height: 150%;
      opacity: 0.8;
      height: 21px;
    }

  .walletActionsView {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 18px;
    margin-bottom: 22px;
    margin-top: 46px;
    }

  .tokenActionView {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    }

  .tokenActionButton {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #2496FF;
    border-radius: 29px;
    background-color: ${theme.buttonBackground};
    padding: 8px 20px;
    &:hover {
        background-color: ${theme.buttonBackgroundHover};
        cursor: pointer;
      }
    }

  .tokenActionLabel {
    color: #fff;
    font-family: ${theme.fontFamily};
    font-size: ${theme.fontSize};
    line-height: 150%;
    }

  .sendTokenAction {
        margin-left: 7px;
    }

  .assetsAndActivityDiv {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 16px;
    height: 64px;
    display: flex;
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), rgba(36, 150, 255, 0.32);
    box-sizing: border-box;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    cursor: pointer;
    background: linear-gradient(0deg, #071A28, #071A28), linear-gradient(0deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), rgba(36, 150, 255, 0.32);
    justify-content: space-between; 
    border: 1px solid #2496FF;
    border-bottom: 0px;
  }

  .tabsView {
    width: 340px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin: 12px 0px 24px;
  }

  

    .selectedTabView {

    font-family: Poppins;
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 16px;
 
    text-align: center;
    color: #E6E9ED;
    opacity: 0.75;

    }

    .transactions-div {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: scroll;
    height: 270px;
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
