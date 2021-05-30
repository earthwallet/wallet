// Copyright 2021 @earthwallet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ThemeProps } from '../types';

import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import settings from '@polkadot/ui-settings';

import useOutsideClick from '../hooks/useOutsideClick';
import generateRandomColor from '../Popup/Utils/CommonUtils';

interface Props extends ThemeProps {
  className?: string;
}

const AddressSelector = function ({ className }: Props): React.ReactElement<Props> {
  const [showDropDown, setShowDropDown] = useState(false);
  const dropDownRef = useRef(null);

  useOutsideClick(dropDownRef, (): void => {
    showDropDown && setShowDropDown(!showDropDown);
  });

  const [selectedAddressText, setSelectedAddressText] = useState<string>();

  const prefixOptions = settings.availablePrefixes
    .filter(({ value }) => value !== -1);

  const _onChangePrefix = (text: string, value: string) => {
    setSelectedAddressText(text);
    settings.set({ prefix: parseInt(value, 10) });
  };

  useEffect(() => {
    if (settings.prefix === -1) {
      settings.set({ prefix: parseInt('42', 10) });
    }

    settings.availablePrefixes.forEach(({ text, value }) => {
      console.log('filter', text, value);

      if (value === settings.prefix) { setSelectedAddressText(text); }
    });
  }, []);

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
        prefixOptions.map(({ text, value }) => {
          return (<div className='addressItem'
            key={value}
            onClick={() => _onChangePrefix(text, `${value}`)}>
            <div className='addressColor'
              style={{ backgroundColor: generateRandomColor(text) }}/>
            {text}
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
