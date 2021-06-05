// Copyright 2021 @earthwallet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ThemeProps } from '../../types';

import useToast from '@earthwallet/extension-ui/hooks/useToast';
import { Header } from '@earthwallet/extension-ui/partials';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//@ts-ignore
import QRCode from 'qrcode.react';
import React, { useCallback, useContext } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import styled from 'styled-components';

import { Link, SelectedAccountContext } from '../../components';

interface Props extends ThemeProps {
  className?: string;
}

// eslint-disable-next-line space-before-function-paren
const WalletReceiveTokens = function ({ className }: Props): React.ReactElement<Props> {
  const { show } = useToast();

  const { selectedAccount } = useContext(SelectedAccountContext);
  const getShortAddress = (address: string) => address.substring(0, 8) + '.....' + address.substring(address.length - 8);
  const _onCopy = useCallback((): void => show('Copied'), [show]);

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
              to='/wallet/home'>Cancel</Link>
          </div>
        </div>
        <div className='accountDetail'>

          {selectedAccount?.address && <div className='addressDisplay'>
            {getShortAddress(selectedAccount?.address)}
            <CopyToClipboard
              text={selectedAccount?.address} >
              <FontAwesomeIcon
                className='copyIcon'
                icon={faCopy}
                onClick={_onCopy}
                size='sm'

                title={'copy address'}
              />
            </CopyToClipboard> </div>}

          <QRCode bgColor='#0000'
            fgColor='#DDD'
            size={220}
            value={selectedAccount?.address} />

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
        padding: 16px 0;
        border-bottom: 1px solid ${theme.addAccountImageBackground}
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

     .accountDetail {
        display: flex;
        flex-direction: column;
        flex: 1;
        height: 420px;
        width: 100%;
        padding: 16px;
         align-items: center;
        justify-content: center;
    }

    .addressDisplay{
        margin-bottom:16px;
    }
    .copyIcon{
        margin-left: 4px;
    }
`);
