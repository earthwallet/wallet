// Copyright 2021 @earthwallet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ThemeProps } from '../types';

import { AccountJson } from '@earthwallet/extension-base/background/types';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { AccountContext, SelectedAccountContext } from '../components';
import useOutsideClick from '../hooks/useOutsideClick';
import generateRandomColor from '../Popup/Utils/CommonUtils';

interface Props extends ThemeProps {
  className?: string;
}

const AccountSelector = function ({ className }: Props): React.ReactElement<Props> {
  const { selectedAccount, setSelectedAccount } = useContext(SelectedAccountContext);
  const [showDropDown, setShowDropDown] = useState(false);
  const { accounts } = useContext(AccountContext);
  const dropDownRef = useRef(null);

  useOutsideClick(dropDownRef, (): void => {
    showDropDown && setShowDropDown(!showDropDown);
  });

  const [selectedAccountText, setSelectedAccountText] = useState<string>();

  const _onChangePrefix = (account: AccountJson) => {
    setSelectedAccountText(account.address);
    setSelectedAccount(account);
    setShowDropDown(false);
  };

  useEffect(() => {
    setSelectedAccountText(selectedAccount?.address);
  }, [selectedAccount]);

  const getShortAddress = (address: string) => address.substring(0, 6) + '...' + address.substring(address.length - 5);

  return (<div className={className}
    ref={dropDownRef}
  >
    {selectedAccountText && <div className='selectedAccountDiv'>
      <div className='selectedAccount'
        onClick={() => accounts.length > 1 ? setShowDropDown((status) => !status) : {}}>
        {selectedAccount?.genesisHash && <div className='networkColor'
          style={{ backgroundColor: generateRandomColor(selectedAccount?.genesisHash) }}/>}
        {getShortAddress(selectedAccountText)}
        {accounts.length > 1 && (<FontAwesomeIcon
          className='dropDownIcon'
          color='#F4F5F8'
          icon={showDropDown ? faAngleDown : faAngleUp}
          size='sm'
        />)}
      </div>
    </div>}
    {showDropDown && <div className='addressSelector'>
      {
        accounts.map((account) => {
          return (<div className='addressItem'
            key={account.address}
            onClick={() => _onChangePrefix(account)}>
            {account?.genesisHash && <div className='networkColor'
              style={{ backgroundColor: generateRandomColor(account?.genesisHash) }}/>}
            {getShortAddress(account.address)}
          </div>);
        })
      }
    </div>}

  </div>);
};

export default styled(AccountSelector)(({ theme }: Props) => `
  width: 100%;
  display: flex;
  justify-content: center;

  .selectedAccountDiv {
    display: flex;
    justify-content: center;
    align-items: center;
  }

    .networkColor {
      height: 10px;
      width: 10px;
      border-radius: 50%;
      margin-right: 6px;
  }


  .dropDownIcon {
    margin-left: 6px;
  }
  
  .selectedAccount {
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${theme.labelColor};
    font-family: ${theme.fontFamily};
    text-align: center;
    padding: 2px 8px;
    border-radius: 18px;
    border: 1px solid ${theme.identiconBackground};
    font-size: 12px;
    &:hover {
        cursor: pointer;
    }
  }

  .addressSelector {
    border-radius: 4px;
    border: 1px solid ${theme.boxBorderColor};
    box-sizing: border-box;
    box-shadow: 0 0 10px ${theme.boxShadow};
    margin-top: 60px;
    position: absolute;
    max-height: 300px;
    overflow: auto;
    z-index: 2;
  }

  .addressItem {
    display: flex;
    align-items: center;
    padding: 8px 16px;
    background: ${theme.popupBackground};
    font-size: 12px;
    &:hover {
            background-color: ${theme.buttonBackgroundHover};
            cursor: pointer;
    }
  }
`);
