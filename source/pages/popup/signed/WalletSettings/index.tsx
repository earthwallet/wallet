import React, { useEffect, useReducer } from 'react';
import styles from './index.scss';
import ICON_FORWARD from '~assets/images/icon_forward.svg';
import ICON_CHECKED from '~assets/images/icon_checkbox_checked.svg';
import ICON_UNCHECKED from '~assets/images/icon_checkbox_unchecked.svg';

import Header from '~components/Header';
import clsx from 'clsx';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectConnectedDapps } from '~state/dapp';
import { AppState } from '~state/store';
import { useController } from '~hooks/useController';
import ICON_LANG from '~assets/images/icon_lang.svg';
import ICON_DAPPS from '~assets/images/icon_dapps.svg';
import i18n, { i18nT } from '~i18n/index';

const WalletSettings = () => {
  const history = useHistory();
  const dapps = useSelector(selectConnectedDapps);
  const { overrideEthereum } = useSelector((state: AppState) => state.wallet);
  const controller = useController();
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  const toggleClickOverride = () => {
    controller.updateOverrideEthereum(!overrideEthereum);
  };

  useEffect(() => {
    forceUpdate();
  }, [i18n.locale]);



  return (
    <div className={styles.page}>
      <Header type={'wallet'} text={''}>
        <div className={styles.empty} />
      </Header>
      <div className={styles.myAc}>
        {i18nT('walletSettings.header')}
      </div>
      <div className={styles.container}>
        <div className={styles.earthInputCont}>
          <div
            onClick={() =>
              toggleClickOverride()
            }
            className={styles.checkboxCont}
          >
            <div className={styles.checkOverride}>
              <div className={styles.overrideLabel}>
                {i18nT('walletSettings.checkbox')}
              </div>
              {overrideEthereum ? (
                <img
                  className={styles.checkboxIcon}
                  onClick={() => toggleClickOverride()}
                  src={ICON_CHECKED}
                />
              ) : (
                <img
                  className={styles.checkboxIcon}
                  onClick={() => toggleClickOverride()}
                  src={ICON_UNCHECKED}
                />
              )}
            </div>
          </div>
        </div>
        <div className={styles.earthInputCont}>
          <div
            onClick={() =>
              history.push(
                '/langsettings'
              )
            }
            className={clsx(styles.checkboxCont, styles.optionCont)}
          >
            <div className={styles.checkboxContent}>
              <img src={ICON_LANG} className={styles.networkIcon} />
              <div className={styles.midCont}>
                <div className={styles.checkboxTitle}>
                  {i18nT('walletSettings.language')}
                </div>
                <div className={styles.subinfo}>{i18n.locale?.toLocaleUpperCase()}</div>
              </div>
            </div>
            <img src={ICON_FORWARD} />
          </div>
          <div
            onClick={() =>
              history.push(
                '/trusteddapps'
              )
            }
            className={clsx(styles.checkboxCont, styles.optionCont)}
          >
            <div className={styles.checkboxContent}>
              <img src={ICON_DAPPS} className={styles.networkIcon} />
              <div className={styles.midCont}>
                <div className={styles.checkboxTitle}>
                  {i18nT('walletSettings.trustedDapps')}
                </div>
                <div className={styles.subinfo}>{dapps.length}</div>
              </div>
            </div>
            <img src={ICON_FORWARD} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletSettings;
