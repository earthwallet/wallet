// Copyright 2021 @earthwallet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ThemeProps } from '../types';

import { faArrowLeft, faCog, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useCallback, useRef, useState } from 'react';
import styled from 'styled-components';

import logo from '../assets/icon.png';
import Link from '../components/Link';
import useOutsideClick from '../hooks/useOutsideClick';
import AddressSelector from './AddressSelector';
import MenuAdd from './MenuAdd';
import MenuSettings from './MenuSettings';

interface Props extends ThemeProps {
  children?: React.ReactNode;
  className?: string;
  showAdd?: boolean;
  showMenu?: boolean;
  showBackArrow?: boolean;
  showSettings?: boolean;
  smallMargin?: boolean;
  showAddressDropdown?: boolean;
  text?: React.ReactNode;
}

function Header ({ children, className = '', showAdd, showAddressDropdown, showBackArrow, showMenu, showSettings, smallMargin = false, text }: Props): React.ReactElement<Props> {
  const [isAddOpen, setShowAdd] = useState(false);
  const [isSettingsOpen, setShowSettings] = useState(false);
  const addRef = useRef(null);
  const setRef = useRef(null);

  useOutsideClick(addRef, (): void => {
    isAddOpen && setShowAdd(!isAddOpen);
  });

  useOutsideClick(setRef, (): void => {
    isSettingsOpen && setShowSettings(!isSettingsOpen);
  });

  const _toggleAdd = useCallback(
    (): void => setShowAdd((isAddOpen) => !isAddOpen),
    []
  );

  const _toggleSettings = useCallback(
    (): void => setShowSettings((isSettingsOpen) => !isSettingsOpen),
    []
  );

  // const blob = new Blob([toSvg('value', 100)], { type: 'image/svg+xml' });
  //   const url = URL.createObjectURL(blob);

  return (
    <div className={`${className} ${smallMargin ? 'smallMargin' : ''}`}>
      <div className='container'>
        <div className='branding'>
          {showBackArrow
            ? (
              <Link
                className='backlink'
                to='/'
              >
                <FontAwesomeIcon
                  className='arrowLeftIcon'
                  icon={faArrowLeft}
                />
              </Link>
            )
            : (
              <img
                className='header-logo'
                src={logo}
              />
            )
          }

          {text && <span className='logoText'>{text || 'Earth Wallet'}</span>}
        </div>

        {showAddressDropdown && (<AddressSelector/>)}

        <div className='popupMenus'>
          {showAdd && (
            <div
              className='popupToggle'
              onClick={_toggleAdd}
            >
              <FontAwesomeIcon
                className={`plusIcon ${isAddOpen ? 'selected' : ''}`}
                icon={faEllipsisV}
                size='lg'
              />
            </div>
          )}
          {showSettings && (
            <div
              className='popupToggle'
              data-toggle-settings
              onClick={_toggleSettings}
            >
              <FontAwesomeIcon
                className={`cogIcon ${isSettingsOpen ? 'selected' : ''}`}
                icon={faCog}
                size='lg'
              />
            </div>
          )}
          {showMenu && (
            <div
              className='popupToggle'
              data-toggle-settings
              onClick={_toggleSettings}
            >
              <FontAwesomeIcon
                className={`cogIcon ${isSettingsOpen ? 'selected' : ''}`}
                icon={faEllipsisV}
                size='lg'
              />
            </div>
          )}
        </div>
        {isAddOpen && (
          <MenuAdd reference={addRef}/>
        )}
        {isSettingsOpen && (
          <MenuSettings reference={setRef}/>
        )}
        {children}
      </div>
    </div>
  );
}

export default React.memo(styled(Header)(({ theme }: Props) => `
  max-width: 100%;
  box-sizing: border-box;
  font-weight: normal;
  margin: 0;
  position: relative;
  margin-bottom: 25px;

  background: linear-gradient(101.54deg, #000204 10.81%, #1B63A6 139.52%);
  box-shadow: 0px 0px 8px #236EFF, 0px 0px 13px rgba(43, 115, 255, 0.8), 0px 0px 54px rgba(71, 134, 255, 0.8);
  border-radius: 0px 0px 20px 20px;

  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none;

  && {
    padding: 0 0 0;
  }

  > .container {
    display: flex;
    justify-content: space-between;
    width: 100%;
    min-height: 70px;

    .branding {
      display: flex;
      justify-content: center;
      align-items: center;
      color: ${theme.labelColor};
      font-family: ${theme.fontFamily};
      text-align: center;
      margin-left: 24px;

      .logoText {
        color: ${theme.textColor};
        font-family: ${theme.fontFamily};
        font-size: 18px;
        margin-left: 12px;
      }

      .header-logo {
        height: 28px;
        width: 28px;
        }
    }

    .addressDropdown select{
    border-radius: 32px;
    }

    .popupMenus {
      align-self: center;

      .popupToggle {
        display: inline-block;
        vertical-align: middle;

        &:last-child {
          margin-right: 24px;
        }

        &:hover {
          cursor: pointer;
        }
      }

      .popupToggle+.popupToggle {
        margin-left: 8px;
      }
    }
  }

  .plusIcon, .cogIcon {
    color: ${theme.iconNeutralColor};

    &.selected {
      color: ${theme.primaryColor};
    }
  }

  .arrowLeftIcon {
    color: ${theme.labelColor};
    margin-right: 1rem;
  }

  .backlink {
    color: ${theme.labelColor};
    min-height: 52px;
    text-decoration: underline;
    width: min-content;

    &:visited {
      color: ${theme.labelColor};
    }
  }

  &.smallMargin {
    margin-bottom: 15px;
  }
`));
