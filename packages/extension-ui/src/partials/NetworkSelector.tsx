// Copyright 2021 @earthwallet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ThemeProps } from '../types';

import { NetworkJson } from '@earthwallet/extension-base/background/types';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { NetworkContext, SelectedNetworkContext } from '../components';
import useOutsideClick from '../hooks/useOutsideClick';
import generateRandomColor from '../Popup/Utils/CommonUtils';

interface Props extends ThemeProps {
  className?: string;
}

const NetworkSelector = function ({ className }: Props): React.ReactElement<Props> {
  const [showDropDown, setShowDropDown] = useState(false);
  const { networks } = useContext(NetworkContext);
  const { selectedNetwork, setSelectedNetwork } = useContext(SelectedNetworkContext);

  const dropDownRef = useRef(null);

  useOutsideClick(dropDownRef, (): void => {
    showDropDown && setShowDropDown(!showDropDown);
  });

  const [selectedNetworkText, setSelectedNetworkText] = useState<string>();

  const _onChangePrefix = (token: NetworkJson) => {
    setSelectedNetworkText(token.text);
    setSelectedNetwork(token);
    setShowDropDown(false);
  };

  useEffect(() => {
    setSelectedNetworkText(selectedNetwork.text);
  }, [selectedNetwork]);

  return (<div className={className}
    ref={dropDownRef}
  >
    {selectedNetworkText && <div className='selectedNetworkDiv'>
      <div className='selectedNetwork'
        onClick={() => setShowDropDown((status) => !status)}>
        <div className='networkColor'
          style={{ backgroundColor: generateRandomColor(selectedNetworkText) }} />
        {selectedNetworkText}
        <FontAwesomeIcon
          className='dropDownIcon'
          color='#F4F5F8'
          icon={showDropDown ? faAngleDown : faAngleUp}
          size='sm'
        />
      </div>
    </div>}
    {showDropDown && <div className='networkSelector'>
      {
        networks.map((token) => {
          return (<div className='networkItem'
            key={token.value}
            onClick={() => _onChangePrefix(token)}>
            <div className='networkColor'
              style={{ backgroundColor: generateRandomColor(token.text) }}/>
            {token.text}
          </div>);
        })
      }
    </div>}

  </div>);
};

export default styled(NetworkSelector)(({ theme }: Props) => `
  width: 100%;
  display: flex;
  justify-content: center;

  .selectedNetworkDiv {
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
  
  .selectedNetwork {
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${theme.labelColor};
    font-family: ${theme.fontFamily};
    text-align: center;
    padding: 2px 8px;
    border-radius: 18px;
    border: 1px solid ${theme.identiconBackground};
    &:hover {
        cursor: pointer;
    }
  }

  .networkSelector {
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

  .networkItem {
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
