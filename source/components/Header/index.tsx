// Copyright 2021 @earthwallet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
//import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import React from 'react';
import { useHistory } from 'react-router-dom';

import ICON_BACK from '~assets/images/icon_back.svg';
import { Link } from 'react-router-dom';
import AccountSelector from '../AccountSelector';
import classNames from 'classnames';
import styles from './index.scss';

interface Props {
  children?: React.ReactNode;
  className?: string;
  showAdd?: boolean;
  showMenu?: boolean;
  showBackArrow?: boolean;
  showSettings?: boolean;
  smallMargin?: boolean;
  type?: string;
  showNetworkDropdown?: boolean;
  text?: React.ReactNode;
  showAccountsDropdown?: boolean;
  backOverride?: any;
  centerText?: boolean;
}

function Header({ backOverride, centerText, children, className = '', showAccountsDropdown, showBackArrow, smallMargin = false, text, type = '' }: Props): React.ReactElement<Props> {
  const history = useHistory();

  return (
    <div 
    className={classNames(className, smallMargin && styles.smallMargin, type === 'wallet' && styles.walletDiv)}>      {type !== 'wallet' && type !== 'details'
        ? <div className={styles.container}>
          <div className={styles.branding}>
            {showBackArrow
              ? (
                <Link
                  className={styles.backlink}
                  to='/'
                >
                  {/*  <FontAwesomeIcon
                    className='arrowLeftIcon'
                    icon={faArrowLeft}
                  /> */}
                </Link>
              )
              : (
                <div />
              )
            }
            {text && <span className={styles.logoText}>{text || 'Earth Wallet'}</span>}
          </div>
          {showAccountsDropdown && (<AccountSelector />)}
          {children}
        </div>
        : type === 'details'
          ? <div 
          className={classNames(styles.container, styles.containerDetails)}>
            <div
              className={classNames(styles.backButtonCont, styles.backButtonContDetails)}
              onClick={() => history.goBack()}>
              <div className={classNames(styles.backButtonIcon, styles.backButtonIconDetails)}>
                <img src={ICON_BACK} /> <div className={styles.backText}>Back</div>
              </div>
            </div>
            {text && <div className={classNames(styles.headerText, centerText && styles.headerTextCenter)}>{text}</div>}
            {children}
          </div>
          : <div className={styles.container}>
            {backOverride === undefined
              ? <div
                className={styles.backButtonCont}
                onClick={() => history.goBack()}>
                <div className={styles.backButtonIcon}>
                  <img src={ICON_BACK} />
                </div>
              </div>
              : <div
                className={styles.backButtonCont}
                onClick={() => backOverride()}>
                <div className={styles.backButtonIcon}>
                  <img src={ICON_BACK} />
                </div>
              </div>
            }
            {text && <div className={classNames(styles.headerText, centerText && styles.headerTextCenter)}>{text}</div>}
            {centerText && <div />}
            {children}
            {showAccountsDropdown && (<AccountSelector />)}
          </div>
      }
    </div>
  );
}

export default Header;
