import React from 'react';
import { useHistory } from 'react-router-dom';

import ICON_BACK from '~assets/images/icon_back.svg';
import { Link } from 'react-router-dom';
import AccountSelector from '../AccountSelector';
import clsx from 'clsx';
import styles from './index.scss';
import { keyable } from '~scripts/Background/types/IAssetsController';

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
  selectedAccount?: keyable;
}

function Header({
  backOverride,
  centerText,
  children,
  className = '',
  showAccountsDropdown,
  showBackArrow,
  smallMargin = false,
  text,
  type = '',
  selectedAccount
}: Props): React.ReactElement<Props> {
  const history = useHistory();

  return (
    <>
      {type !== 'wallet' && type !== 'details' ? (
        <div
          className={clsx(
            className,
            styles.container,
            smallMargin && styles.smallMargin,
            type === 'wallet' && styles.walletDiv
          )}
        >
          <div className={styles.branding}>
            {showBackArrow ? (
              <Link className={styles.backlink} to="/">
                {/*  <FontAwesomeIcon
                    className='arrowLeftIcon'
                    icon={faArrowLeft}
                  /> */}
              </Link>
            ) : (
              <div />
            )}
            {text && (
              <span className={styles.logoText}>{text || 'Earth Wallet'}</span>
            )}
          </div>
          {showAccountsDropdown && selectedAccount && <AccountSelector selectedAccount={selectedAccount} />}
          {children}
        </div>
      ) : type === 'details' ? (
        <div
          className={clsx(styles.container, styles.containerDetails, className)}
        >
          {showBackArrow ? <div
            className={clsx(
              styles.backButtonCont,
              styles.backButtonContDetails
            )}
            onClick={() => history.goBack()}
          >
            <div
              className={clsx(
                styles.backButtonIcon,
                styles.backButtonIconDetails
              )}
            >
              <img src={ICON_BACK} />{' '}
              <div className={styles.backText}>Back</div>
            </div>
          </div>
            : <div className={clsx(
              styles.backButtonIconNoop
            )} />}
          {text && (
            <div
              className={clsx(
                styles.headerText,
                centerText && styles.headerTextCenter
              )}
            >
              {text}
            </div>
          )}
          {children}
        </div>
      ) : (
        <div className={styles.container}>
          {backOverride === undefined ? (
            <div
              className={styles.backButtonCont}
              onClick={() => history.goBack()}
            >
              <div className={styles.backButtonIcon}>
                <img src={ICON_BACK} />
              </div>
            </div>
          ) : (
            <div
              className={styles.backButtonCont}
              onClick={() => backOverride()}
            >
              <div className={styles.backButtonIcon}>
                <img src={ICON_BACK} />
              </div>
            </div>
          )}
          {text && (
            <div
              className={clsx(
                styles.headerText,
                centerText && styles.headerTextCenter
              )}
            >
              {text}
            </div>
          )}
          {centerText && <div />}
          {children}
          {showAccountsDropdown && selectedAccount && <AccountSelector selectedAccount={selectedAccount} />}
        </div>
      )}
    </>
  );
}

export default Header;
