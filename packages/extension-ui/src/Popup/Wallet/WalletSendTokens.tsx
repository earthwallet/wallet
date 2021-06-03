// Copyright 2021 @earthwallet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ThemeProps } from '../../types';

import useOutsideClick from '@earthwallet/extension-ui/hooks/useOutsideClick';
import { Header } from '@earthwallet/extension-ui/partials';
import { faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';

import logo from '../../assets/polkadot-new-dot-logo.svg';
import { Button, ButtonArea, Link, TextArea, VerticalSpace } from '../../components';
import useTranslation from '../../hooks/useTranslation';

interface Props extends ThemeProps {
  className?: string;
}

// eslint-disable-next-line space-before-function-paren
const WalletSendTokens = function ({ className }: Props): React.ReactElement<Props> {
  const [showTokenDropDown, setShowTokenDropDown] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<string>('DOT');
  const dropDownRef = useRef(null);
  const { t } = useTranslation();

  useOutsideClick(dropDownRef, (): void => {
    showTokenDropDown && setShowTokenDropDown(!showTokenDropDown);
  });

  const onTokenSelected = (token: string) => {
    setSelectedNetwork(token);
  };

  return (
    <>
      <Header showAccountsDropdown
        showMenu />
      <div className={className}
        ref={dropDownRef}
      >
        <div className='topBarDiv'>
          <div className='topBarDivSideItem'/>
          <div className='topBarDivCenterItem'>Add Recipient</div>
          <div className='topBarDivSideItem topBarDivCancelItem'>
            <Link className='topBarDivCancelItem'
              to='/'>
                          Cancel
            </Link>
          </div>
        </div>

        <TextArea
          autoCapitalize='off'
          autoCorrect='off'
          autoFocus={true}
          className='recipientAddress'
          placeholder="public address"
        />

        <div className='transactionDetail'>

          <div className='assetSelectionDiv'>
            <div className='assetSelectionLabel'>
                          Asset:
            </div>
            <div className='tokenSelectionDiv'
              onClick={() => setShowTokenDropDown((status) => !status)}
            >
              <img
                className='tokenLogo'
                src={logo}
              />
              <div className='tokenSelectionLabelDiv'>
                <div className='tokenLabel'>{selectedNetwork}</div>
                <div className='tokenBalance'>{`Balance: 100${selectedNetwork}`}</div>
              </div>
              <FontAwesomeIcon
                className='dropDownIcon'
                color='#303030'
                icon={faAngleUp}
                size='lg'
              />
              {showTokenDropDown && <div className='tokenSelectionDropDown'>

                <div className='tokenSelectionDropDownItem'
                  onClick={() => onTokenSelected('DOT')}>
                  <img
                    className='tokenLogo'
                    src={logo}
                  />
                  <div className='tokenSelectionLabelDiv'>
                    <div className='tokenLabel'>DOT</div>
                    <div className='tokenBalance'>Balance: 100DOT</div>
                  </div>
                </div>

                <div className='tokenSelectionDropDownItem'
                  onClick={() => onTokenSelected('ICP')}>
                  <img
                    className='tokenLogo'
                    src={logo}
                  />
                  <div className='tokenSelectionLabelDiv'>
                    <div className='tokenLabel'>ICP</div>
                    <div className='tokenBalance'>Balance: 100ICP</div>
                  </div>
                </div>

              </div>}
            </div>
          </div>

        </div>

      </div>

      <VerticalSpace />
      <ButtonArea>
        <Button className='cancelButton'>
          {t<string>('Cancel')}
        </Button>

        <Button>
          {t<string>('Next')}
        </Button>
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

    .topBarDiv {
        width: 100%;
        display: flex;
        flex-direction: rows;
        align-items: center;
        justify-content: center;
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
        font-size:  ${theme.fontSize};
        width: -webkit-fill-available;
        margin: 24px;
    }

    .transactionDetail {
        display: flex;
        flex-direction: column:
        flex: 1;
        height: 283px;
        width: 100%;
        padding: 16px;
        background: ${theme.addAccountImageBackground};
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
        border-radius: 4px;
        border: 1px solid rgb(67, 68, 75);
        padding: 4px;
        flex: 1;
        height: 52px;
        margin-right: 24px;
        align-items: center;
        padding: 0 6px;

         &:hover {
            background-color: ${theme.buttonBackgroundHover};
            cursor: pointer;
        }
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
    margin-top: 170px;
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
        flex: 1;
        height: 52px;
        align-items: center;
        padding: 6px;
         &:hover {
            background-color: ${theme.buttonBackgroundHover};
            cursor: pointer;
        }
    }
`);
