// Copyright 2021 @earthwallet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ThemeProps } from '../types';

import { TokenJson } from '@earthwallet/extension-base/background/types';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { SelectedTokenContext, TokenContext } from '../components';
import useOutsideClick from '../hooks/useOutsideClick';
import generateRandomColor from '../Popup/Utils/CommonUtils';

interface Props extends ThemeProps {
  className?: string;
}

const AddressSelector = function ({ className }: Props): React.ReactElement<Props> {
  const [showDropDown, setShowDropDown] = useState(false);
  const { tokens } = useContext(TokenContext);
  const { selectedToken, setSelectedToken } = useContext(SelectedTokenContext);

  const dropDownRef = useRef(null);

  useOutsideClick(dropDownRef, (): void => {
    showDropDown && setShowDropDown(!showDropDown);
  });

  const [selectedAddressText, setSelectedAddressText] = useState<string>();

  const _onChangePrefix = (token: TokenJson) => {
    setSelectedAddressText(token.text);
    setSelectedToken(token);
    setShowDropDown(false);
  };

  useEffect(() => {
    setSelectedAddressText(selectedToken.text);
  }, [selectedToken]);

  return (<div className={className}
    ref={dropDownRef}
  >
    {selectedAddressText && <div className='selectedAddressDiv'>
      <div className='selectedAddress'
        onClick={() => setShowDropDown((status) => !status)}>
        <div className='addressColor'
          style={{ backgroundColor: generateRandomColor(selectedAddressText) }} />
        {selectedAddressText}
        <FontAwesomeIcon
          className='dropDownIcon'
          color='#303030'
          icon={showDropDown ? faAngleDown : faAngleUp}
          size='sm'
        />
      </div>
    </div>}
    {showDropDown && <div className='addressSelector'>
      {
        tokens.map((token) => {
          return (<div className='addressItem'
            key={token.value}
            onClick={() => _onChangePrefix(token)}>
            <div className='addressColor'
              style={{ backgroundColor: generateRandomColor(token.text) }}/>
            {token.text}
          </div>);
        })
      }
    </div>}

  </div>);
};

export default styled(AddressSelector)(({ theme }: Props) => `
  width: 100%;
  display: flex;
  justify-content: center;

  .selectedAddressDiv {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .addressColor {
      height: 10px;
      width: 10px;
      border-radius: 50%;
      margin-right: 6px;
  }

  .dropDownIcon {
    margin-left: 6px;
  }
  
  .selectedAddress {
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${theme.labelColor};
    font-family: ${theme.fontFamily};
    text-align: center;
    padding: 2px 8px;
    border-radius: 18px;
    border: 1px solid ${theme.boxBorderColor};
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
    &:hover {
            background-color: ${theme.buttonBackgroundHover};
            cursor: pointer;
    }
  }
`);
