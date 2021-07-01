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
import { getBalance, send } from '@earthwallet/sdk';
import { principal_id_to_address } from '@earthwallet/sdk/build/main/util/icp';
// import { faAngleUp } from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import StringCrypto from 'string-crypto';
import styled from 'styled-components';

import ICON_ICP_DETAILS from '../../assets/icon_icp_details.png';
import { InputWithLabel, NextStepButton, SelectedAccountContext, Warning } from '../../components';
import { isJsonString } from '../../Popup/Utils/CommonUtils';

const { address_to_hex } = require('@dfinity/rosetta-client');

const { decryptString } = new StringCrypto();

// import icon_send from '../../assets/icon_send.svg';

interface Props extends ThemeProps {
  className?: string;
}

interface keyable {
  [key: string]: any
}

const MIN_LENGTH = 6;

// eslint-disable-next-line space-before-function-paren
const WalletSendTokens = function ({ className }: Props): React.ReactElement<Props> {
  const [showTokenDropDown, setShowTokenDropDown] = useState(false);
  const selectedNetwork = 'ICP';
  const { selectedAccount } = useContext(SelectedAccountContext);
  const [isBusy, setIsBusy] = useState(false);
  const [selectedRecp, setSelectedRecp] = useState<string>('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [step1, setStep1] = useState(true);

  const [selectedAmount, setSelectedAmount] = useState<number>(0);

  const dropDownRef = useRef(null);
  const [walletBalance, setWalletBalance] = useState<any|null|keyable>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingSend, setLoadingSend] = useState<boolean>(false);
  const [paymentHash, setPaymentHash] = useState<string>('');
  const [usdValue, setUsdValue] = useState<number>(0);

  const loadBalance = async (address: string) => {
    setLoading(true);
    const balance: keyable = await getBalance(address, 'ICP');

    setLoading(false);

    if (balance && balance?.balances != null) { setWalletBalance(balance); }
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

  const onPassChange = useCallback(
    (password: string) => {
      setPass(password);
      setError('');
      const currentAddress = selectedAccount?.address || '';
      const json_secret = decryptString(window.localStorage.getItem(currentAddress + '_icpjson'), password);

      if (!isJsonString(json_secret)) {
        setError('Wrong password! Please try again');
      }
    }
    , [selectedAccount]);

  useEffect(() => {
    if (selectedAccount && selectedAccount?.address) {
      loadBalance(selectedAccount?.address);
      getICPUSDValue();
    }
  }, [selectedAccount]);

  useOutsideClick(dropDownRef, (): void => {
    showTokenDropDown && setShowTokenDropDown(!showTokenDropDown);
  });

  const onNextStep = useCallback(() => { setStep1(false); }, []);
  const onBackClick = useCallback(() => { setStep1(true); }, []);

  const sendTx = async () => {
    setIsBusy(true);

    const currentAddress = selectedAccount?.address || '';
    const json_secret = decryptString(window.localStorage.getItem(currentAddress + '_icpjson'), pass);

    if (isJsonString(json_secret)) {
      const currentIdentity = Ed25519KeyIdentity.fromJSON(json_secret);
      const address = address_to_hex(
        principal_id_to_address(currentIdentity.getPrincipal())
      );

      setLoadingSend(true);

      try {
        if (selectedAmount === 0) {
          alert('Amount cannot be 0');
        }

        const hash: any = await send(
          currentIdentity,
          selectedRecp,
          address,
          selectedAmount,
          'ICP'
        );

        await loadBalance(address);
        setLoadingSend(false);
        setPaymentHash(hash || '');
        setIsBusy(false);
      } catch (error) {
        console.log(error);
        setLoadingSend(false);
        setIsBusy(false);
      }
    } else {
      setError('Wrong password! Please try again');
      setIsBusy(false);
    }

    return true;
  };

  return (
    <>
      <Header
        backOverride={step1 ? undefined : paymentHash === '' ? onBackClick : undefined}
        centerText
        showMenu
        text={'Send'}
        type={'wallet'} />
      <div className={className}
        ref={dropDownRef}
      >
        {!(paymentHash === undefined || paymentHash === '') && <div className='paymentDone'>
          Payment Done! Check transactions for more details.
        </div>}
        { step1
          ? <div style={{ width: '100vw' }}>
            <div className={'earthInputLabel'}>Add recipient</div>
            <input
              autoCapitalize='off'
              autoCorrect='off'
              autoFocus={true}
              className='recipientAddress earthinput'
              key={'recp'}
              onChange={(e) => setSelectedRecp(e.target.value)}
              placeholder="Recipient address"
              required
              value={selectedRecp}
            />
            <div className='assetSelectionDivCont'>
              <div className='earthInputLabel'>
              Asset
              </div>
              <div className='tokenSelectionDiv'>
                <div className='selectedNetworkDiv'>
                  <img
                    className='tokenLogo'
                    src={ICON_ICP_DETAILS}
                  />
                  <div className='tokenSelectionLabelDiv'>
                    <div className='tokenLabel'>{selectedNetwork}</div>
                    <div className='tokenBalance'>
                      { loading
                        ? <SkeletonTheme color="#222"
                          highlightColor="#000">
                          <Skeleton width={150} />
                        </SkeletonTheme>
                        : <span className='tokenBalanceText'>Balance: {walletBalance && walletBalance?.balances[0] &&
                         `${walletBalance?.balances[0]?.value / Math.pow(10, walletBalance?.balances[0]?.currency?.decimals)} 
                         ${walletBalance?.balances[0]?.currency?.symbol}`
                        }</span>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='earthInputLabel'>
              Amount
            </div>
            <input
              autoCapitalize='off'
              autoCorrect='off'
              autoFocus={false}
              className='recipientAddress earthinput'
              key={'amount'}
              max="1.00"
              min="0.00"
              onChange={(e) => setSelectedAmount(parseFloat(e.target.value))}
              placeholder="amount up to 8 decimal places"
              required
              step="0.001"
              type="number"
              value={selectedAmount}
            />
          </div>
          : <div className={'confirmPage'}>
            <div className={'confirmAmountCont'}>
              <img
                className='tokenLogo tokenLogoConfirm'
                src={ICON_ICP_DETAILS}
              />
              <div className={'tokenText'}>Internet Computer</div>
              <div className={'tokenAmount'}>{selectedAmount} ICP</div>
              <div className={'tokenValue'}>${(selectedAmount * usdValue).toFixed(3)}</div>

            </div>
            <InputWithLabel
              data-export-password
              disabled={isBusy}
              isError={pass.length < MIN_LENGTH || !!error}
              label={'password for this account'}
              onChange={onPassChange}
              placeholder='REQUIRED'
              type='password'
            />
            {error && (
              <Warning
                isBelowInput
                isDanger
              >
                {error}
              </Warning>
            )}
          </div>}
      </div>
      <div style={{ padding: '0 27px',
        marginBottom: 30,
        position: 'absolute',
        bottom: 0,
        left: 0 }}>
        { step1
          ? <NextStepButton
            isDisabled={loadingSend || !selectedRecp }
            loading={isBusy}
            onClick={onNextStep}>
            {'Next'}
          </NextStepButton>

          : <NextStepButton
            isDisabled={loadingSend || !!error || pass.length < MIN_LENGTH}
            loading={isBusy || loadingSend}
            onClick={() => sendTx()}>
            {'Send'}
          </NextStepButton>}
      </div>
    </>
  );
};

export default styled(WalletSendTokens)(({ theme }: Props) => `
    width: auto;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding 0;
    background: linear-gradient(0deg, rgba(71, 134, 255, 0.4) 0%, rgba(71, 134, 255, 0) 100%);


    .assetSelectionDivCont {
      width: 100%;
    }

    .buttonCont {
      display: flex;
      flex-direction: row;
      /* background: #212226; */
      /* border-top: 1px solid #43444b; */
      padding: 12px 24px;
      margin-left: 50px;
      margin-right: 50px;
      position: fixed;
      width: calc(100% - 50px);
      bottom: 0;
    }

    .topBarDiv {
        width: 100%;
        display: flex;
        flex-direction: rows;
        align-items: center;
        justify-content: center;
    }

    .earthInputLabel {
      font-family: Poppins;
      font-style: normal;
      font-weight: normal;
      font-size: 16px;
      line-height: 24px;
      /* identical to box height */
      
      
      color: #FFFFFF;
      text-align: left;
      width: calc(100% - 48px);
      padding: 27px 24px 13px;
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
      -webkit-box-shadow: none;
      -moz-box-shadow: none;
      box-shadow: none;
      background: rgba(8, 25, 39, 0.65);
      border: 2px solid rgba(36, 150, 255, 0.5);
      padding: 16px 12px;
      border-radius: 8px;
      
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
        margin: 0px 24px;
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
        margin-left: 24px;
        align-items: center;
    }

    .selectedNetworkDiv {
        display: flex;
        flex-direction: row;
        align-items: center;
        width:240px;
        border-radius: 4px;
        padding: 0 6px;
        background: #5a597e63;
        backdrop-filter: blur(7px);
        border-radius: 14px;
        height: 72px;
        width: calc(100% - 40px);
    }

    .tokenLogo {
      height: 50px;
      width: 50px;
      margin: 0px 12px;
    }
    .tokenLogoConfirm { 
      margin: 0px 12px 6px;

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
    .tokenBalanceText {
      opacity: 0.54;
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

    .tokenText {
      font-family: Poppins;
      font-style: normal;
      font-weight: normal;
      font-size: 15px;
      line-height: 150%;
      text-align: center;
      color: #FAFBFB;
      opacity: 0.7;
      margin-bottom: 3px;
    }
    .tokenAmount {
      font-family: DM Mono;
      font-style: normal;
      font-weight: 500;
      font-size: 34px;
      line-height: 44px;
      text-align: center;
      color: #FAFBFB;
      text-shadow: 0px 0px 11.4544px rgba(177, 204, 255, 0.89);
      margin-bottom: 3px;

    }
    .confirmPage {
      padding: 0 24px;
      width: 100vw;
      box-sizing: border-box;
    }
    .confirmAmountCont{
      width: 327px;
      

      background: rgba(90, 89, 126, 0.39);
      backdrop-filter: blur(7px);

      border-radius: 14px;
      margin-top: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 27px 0 24px 0;
    }
    .tokenValue {
      font-family: DM Mono;
      font-style: normal;
      font-weight: normal;
      font-size: 16px;
      line-height: 150%;
      /* identical to box height, or 24px */

      text-align: center;

      /* Brand / Moonlight Grey / 20% */

      color: #FAFBFB;

      opacity: 0.51;
    }
`);
