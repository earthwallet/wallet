// Copyright 2021 @earthwallet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ThemeProps } from '../../types';

import { Header } from '@earthwallet/extension-ui/partials';
import QRCode from 'qrcode.react';
import React from 'react';
import styled from 'styled-components';

import { Link } from '../../components';

interface Props extends ThemeProps {
  className?: string;
}

// eslint-disable-next-line space-before-function-paren
const WalletReceiveTokens = function ({ className }: Props): React.ReactElement<Props> {
  return (
    <>
      <Header showAccountsDropdown
        showMenu />
      <div className={className}>
        <div className='topBarDiv'>
          <div className='topBarDivSideItem'/>
          <div className='topBarDivCenterItem'>Receive Tokens</div>
          <div className='topBarDivSideItem topBarDivCancelItem'>
            <Link className='topBarDivCancelItem'
              to='/'>
                          Cancel
            </Link>
          </div>

          <QRCode value="http://facebook.github.io/react/" />,
        </div>

      </div>
    </>
  );
};

export default styled(WalletReceiveTokens)(({ theme }: Props) => `
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
`);
