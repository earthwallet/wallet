// Copyright 2021 @earthwallet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ThemeProps } from '../../types';

import { Header } from '@earthwallet/extension-ui/partials';
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import styled from 'styled-components';

import logo from '../../assets/polkadot-new-dot-logo.svg';
import { Link } from '../../components';

interface Props extends ThemeProps {
  className?: string;
}

// eslint-disable-next-line space-before-function-paren
const Wallet = function ({ className }: Props): React.ReactElement<Props> {
  const [selectedTab, setSelectedTab] = useState('Assets');

  return (
    <>
      <Header
        showAddressDropdown
        showMenu />
      <div className={className}>
        <img
          className='tokenLogo'
          src={logo}
        />
        <div className='primaryBalanceLabel'>$56,8812.98 USD</div>
        <div className='secondaryBalanceLabel'>12.32 DOT</div>
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

        <div className='tabsView'>
          <div
            className={'tabView ' + (selectedTab === 'Assets' ? 'selectedTabView' : '') }
            onClick={() => setSelectedTab('Assets')}
          >
                  Assets
          </div>
          <div
            className={'tabView ' + (selectedTab === 'Transactions' ? 'selectedTabView' : '') }
            onClick={() => setSelectedTab('Transactions')}
          >
         Transactions
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
    
    .tokenLogo {
    height: 28px;
    width: 28px;
    margin-bottom: 16px;
    border-radius: 50%;
    border: 1px solid ${theme.subTextColor};
    padding: 4px;
    background-color: ${theme.tokenLogoBackground};
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

    .tabsView {
    height: 46px;
    width: 382px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-top: 16px;
    }

    .tabView {
    flex: 1;
    height: 46px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    box-shadow: inset 0 -1px 0 ${theme.buttonBackground};
     &:hover {
        background-color: ${theme.buttonBackgroundHover};
        cursor: pointer;
    }
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

`);
