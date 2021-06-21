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
/* eslint-disable  @typescript-eslint/no-var-requires */
/* eslint-disable  @typescript-eslint/restrict-plus-operands */

import type { ThemeProps } from '../../types';

import { Ed25519KeyIdentity } from '@dfinity/identity';
import useOutsideClick from '@earthwallet/extension-ui/hooks/useOutsideClick';
import { Header } from '@earthwallet/extension-ui/partials';
import { ICP } from '@earthwallet/sdk';
// import { faAngleUp } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext, useEffect, useRef, useState } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import styled from 'styled-components';

import logo from '../../assets/icp-logo.png';
import { Button, ButtonArea, Link, SelectedAccountContext, VerticalSpace } from '../../components';
import useTranslation from '../../hooks/useTranslation';

const { address_to_hex } = require('@dfinity/rosetta-client');

// import icon_send from '../../assets/icon_send.svg';

interface Props extends ThemeProps {
  className?: string;
}

interface keyable {
  [key: string]: any
}

// eslint-disable-next-line space-before-function-paren
const WalletSendTokens = function ({ className }: Props): React.ReactElement<Props> {
  const [showTokenDropDown, setShowTokenDropDown] = useState(false);
  const selectedNetwork = 'ICP';
  const { selectedAccount } = useContext(SelectedAccountContext);
  const [selectedRecp, setSelectedRecp] = useState<string>('');
  const [selectedAmount, setSelectedAmount] = useState<number>(0);

  const dropDownRef = useRef(null);
  const { t } = useTranslation();
  const [walletBalance, setWalletBalance] = useState<any|null|keyable>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingSend, setLoadingSend] = useState<boolean>(false);
  const [paymentHash, setPaymentHash] = useState<string>('');

  const loadBalance = async (address: string) => {
    setLoading(true);
    const balance: keyable = await ICP.getBalance(address);

    setLoading(false);

    if (balance && balance?.balances != null) { setWalletBalance(balance); }
  };

  useEffect(() => {
    if (selectedAccount && selectedAccount?.address) {
      loadBalance(selectedAccount?.address);
    }
  }, [selectedAccount]);

  useOutsideClick(dropDownRef, (): void => {
    showTokenDropDown && setShowTokenDropDown(!showTokenDropDown);
  });

  /*  const onTokenSelected = (token: string) => {
    setSelectedNetwork(token);
  }; */

  /*   const getTokenSelectionDropDownItem = (tokenSymbol: string) => {
    return (<div className='tokenSelectionDropDownItem'
      onClick={() => onTokenSelected(tokenSymbol)}>
      <img
        className='tokenLogo'
        src={logo}
      />
      <div className='tokenSelectionLabelDiv'>
        <div className='tokenLabel'>{tokenSymbol}</div>
        <div className='tokenBalance'>{`Balance: 9 ${tokenSymbol}`}</div>
      </div>
    </div>);
  }; */

  const sendIcp = async () => {
    const currentAddress = selectedAccount?.address || '';
    const json_secret = window.localStorage.getItem(currentAddress) || '';

    const currentIdentity = Ed25519KeyIdentity.fromJSON(json_secret);
    const address = address_to_hex(
      ICP.principal_id_to_address(currentIdentity.getPrincipal())
    );

    setLoadingSend(true);

    try {
      console.log(selectedAmount, typeof selectedAmount, 'selectedAmount');

      if (selectedAmount === 0) {
        alert('Amount cannot be 0');
      }

      const hash: any = await ICP.sendICP(
        currentIdentity,
        selectedRecp,
        address,
        selectedAmount
      );

      await loadBalance(address);
      setLoadingSend(false);
      setPaymentHash(hash || '');
    } catch (error) {
      console.log(error);
      setLoadingSend(false);
    }

    return true;
  };

  return (
    <>
      <Header showAccountsDropdown
      type={'wallet'}
      text={'Send'}
      centerText
      showMenu />
      <div className={className}
        ref={dropDownRef}
      >
        {!(paymentHash === undefined || paymentHash === '') && <div className='paymentDone'>
          Payment done. Check at <a
            className='earthlink'
            href={`https://dashboard.internetcomputer.org/transaction/${paymentHash}`}
            rel="noreferrer"
            target="_blank">explorer</a>
        </div>}
        <input
          autoCapitalize='off'
          autoCorrect='off'
          autoFocus={true}
          className='recipientAddress earthinput'
          onChange={(e) => setSelectedRecp(e.target.value)}
          placeholder="Recipient address"
          required
        />
        <input
          autoCapitalize='off'
          autoCorrect='off'
          autoFocus={false}
          className='recipientAddress earthinput'
          max="1.00"
          min="0.00"
          onChange={(e) => setSelectedAmount(parseFloat(e.target.value))}
          placeholder="amount up to 8 decimal places"
          required
          step="0.001"
          type="number"
        />

        <div className='transactionDetail'>

          <div className='assetSelectionDiv'>
            <div className='assetSelectionLabel'>
              Asset:
            </div>
            <div className='tokenSelectionDiv'>
              <div className='selectedNetworkDiv'>
                <img
                  className='tokenLogo'
                  src={logo}
                />
                <div className='tokenSelectionLabelDiv'>
                  <div className='tokenLabel'>{selectedNetwork}</div>
                  <div className='tokenBalance'>
                    { loading
                      ? <SkeletonTheme color="#222"
                        highlightColor="#000">
                        <Skeleton width={150} />
                      </SkeletonTheme>
                      : <span>{walletBalance && walletBalance?.balances[0] &&
                         `${walletBalance?.balances[0]?.value / Math.pow(10, walletBalance?.balances[0]?.currency?.decimals)} 
                         ${walletBalance?.balances[0]?.currency?.symbol}`
                      }</span>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={'sendBg'}></div>
      </div>
      <VerticalSpace />
      <ButtonArea>
        {loadingSend
          ? <Button onClick={() => sendIcp()}>
            {t<string>('Sending...')}
          </Button>
          : <Button onClick={() => sendIcp()}>
            {t<string>('Send')}
          </Button>}
      </ButtonArea>
    </>
  );
};

export default styled(WalletSendTokens)(({ theme }: Props) => `
    width: auto;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding 0;

    .sendBg {
      position: absolute;
      width: 375px;
      height: 446px;
      left: 0px;
      bottom: 0px;
      background: linear-gradient(0deg, rgba(71, 134, 255, 0.4) 0%, rgba(71, 134, 255, 0) 100%);
      }

    .topBarDiv {
        width: 100%;
        display: flex;
        flex-direction: rows;
        align-items: center;
        justify-content: center;
    }
    .paymentDone {
      width: calc(100% - 58px);
      text-align: center;
      border: 1px solid #216321;
      margin: 12px;
      padding: 4px;
      border-radius: 5px;
    }

    .earthlink{
      font-size: 14px;
      background: rgb(8,1,128);
      background: linear-gradient(0deg, rgba(126,43,217,1) 0%, rgba(23,23,224,1) 35%, rgba(0,212,255,1) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .earthinput {
      background-image:none;
      background-color:transparent;
      -webkit-box-shadow: none;
      -moz-box-shadow: none;
      box-shadow: none;
      border: 1px solid rgb(67, 68, 75);
      padding: 16px 12px;
      border-radius: 2px;
      &:focus-visible {
        outline: none;
     }
    }

    .topBarDivCenterItem {
        display: flex;
        align-items: center;
        justify-content: center;
        flex:.5;
        color: ${theme.subTextColor};
        font-family: ${theme.fontFamily};
        font-size: 20px;
    }

    .topBarDivSideItem {
        display: flex;
        align-items: center;
        justify-content: center;
        flex:.25;
    }

    .topBarDivCancelItem {
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: ${theme.buttonBackground};
        font-family: ${theme.fontFamily};
        font-size: 12px;
        &:hover {
            color: ${theme.buttonBackgroundHover};
            }
    }

    .recipientAddress {
        color: ${theme.subTextColor};
        font-family: ${theme.fontFamily};
        font-size: ${theme.fontSize};
        width: -webkit-fill-available;
        margin: 12px 24px;
    }

    .transactionDetail {
        display: flex;
        flex-direction: column;
         width: 100%;
        padding: 16px;
     }

    .assetSelectionDiv {
        width: -webkit-fill-available;
        display: flex;
        flex-direction: row;
        flex-flow: row:
        margin: 0px 24px;
        align-items: center;
        justify-content: space-between;
        height: fit-content;
    }

    .assetSelectionLabel {
        color: ${theme.subTextColor};
        font-family: ${theme.fontFamily};
        font-size: 16px;
        margin: 0px 34px;
    }

    .tokenSelectionDiv {
        display: flex;
        flex-direction: row;
        margin-right: 24px;
        align-items: center;
    }

    .selectedNetworkDiv {
        display: flex;
        flex-direction: row;
        align-items: center;
        width:240px;
        border-radius: 4px;
        border: 1px solid rgb(67, 68, 75);
        padding: 0 6px;
        height: 52px;
    }

    .tokenLogo {
        height: 24px;
        width: 24px;
        margin: 0 12px;
        border-radius: 50%;
        border: 1px solid ${theme.subTextColor};
        padding: 4px;
        background-color: ${theme.tokenLogoBackground};
    }

    .tokenSelectionLabelDiv {
        display: flex;
        flex-direction: Column;
        flex: 1;
    }

    .tokenLabel {
        color: ${theme.subTextColor};
        font-family: ${theme.fontFamily};
        line-height: 1.2;
        font-size: 20px;
    }

    .tokenBalance {
        color: ${theme.subTextColor};
        font-family: ${theme.fontFamily};
        line-height: 1;
        font-size: 14px;
    }

    .cancelButton {
        background: ${theme.backButtonBackground};
        &:not(:disabled):hover {
            background: ${theme.backButtonBackgroundHover};
        }
    }

    .dropDownIcon{
        margin: 6px;
    }

    .tokenSelectionDropDown {
    background: ${theme.addAccountImageBackground};
    border-radius: 4px;
    border: 1px solid ${theme.boxBorderColor};
    box-sizing: border-box;
    box-shadow: 0 0 10px ${theme.boxShadow};
    margin-top: 0px;
    position: absolute;
    max-height: 300px;
    overflow: auto;
    z-index: 2;
    display: flex;
    flex-direction: Column;
  }

  .tokenSelectionDropDownItem {
        display: flex;
        flex-direction: row;
        padding: 4px;
        width:240px;
        height: 52px;
        align-items: center;
        padding: 6px;
         &:hover {
            background-color: ${theme.buttonBackgroundHover};
            cursor: pointer;
        }
    }
`);
