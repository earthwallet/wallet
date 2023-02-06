import React, { useState, useEffect, useCallback } from 'react';
import styles from './index.scss';
import ICON_CHECKED from '~assets/images/icon_checkbox_checked.svg';
import ICON_UNCHECKED from '~assets/images/icon_checkbox_unchecked.svg';
import ICON_COPY from '~assets/images/icon_copy.svg';
import ICON_DOWNLOAD from '~assets/images/icon_download.svg';
import CopyToClipboard from 'react-copy-to-clipboard';
import NextStepButton from '~components/NextStepButton';
import HeaderWithSteps from '~components/HeaderWithSteps';
import Password from '~components/Password';
import clsx from 'clsx';

import { useController } from '~hooks/useController';
import { IWalletState } from '~state/wallet/types';
import { AppState } from '~state/store';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { ACTIVE_SYMBOLS, PREGENERATE_SYMBOLS } from '~global/constant';
import useToast from '~hooks/useToast';
import { i18nT } from '~i18n/index';

const Page = () => {
  const controller = useController();

  const { newMnemonic }: IWalletState = useSelector(
    (state: AppState) => state.wallet
  );

  const history = useHistory();

  const [isBusy, setIsBusy] = useState(false);
  const [checked, setChecked] = useState(false);
  const [secondChecked, setSecondChecked] = useState(false);

  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [password, setPassword] = useState<string | null>(null);

  const { show } = useToast();

  const _onCopy = useCallback((): void => show('Copied'), [show]);

  const _onCreate = useCallback((): void => {
    if (name && password && newMnemonic) {
      setIsBusy(true);
      const callback = (address: string) => history.replace('/accounts?hightlight=' + address);
      controller.accounts
        .createOrUpdateAccounts(newMnemonic, PREGENERATE_SYMBOLS, name, password, ACTIVE_SYMBOLS, callback)
        .then(() => {
        });
    }
  }, [name, password, newMnemonic]);

  const backupKeystore = () => {
    setIsBusy(true);
    const meId = parseInt((new Date().getTime() / 1000).toFixed(0));
    const blob = new Blob([newMnemonic || ''], {
      type: 'text/plain;charset=utf-8',
    });

    saveAs(blob, `${meId}.txt`);
    setIsBusy(false);
  };

  const _onNextStep = useCallback(() => setStep((step) => step + 1), []);
  const _onPreviousStep = useCallback(() => setStep((step) => step - 1), []);

  useEffect(() => {
    controller.accounts.createNewMnemonic();
  }, []);

  return (
    <div className={styles.page}>
      <HeaderWithSteps
        backOverride={step === 1 ? undefined : _onPreviousStep}
        step={step}
        text={i18nT('createAccount.header')}
      />
      {newMnemonic !== '' &&
        (step === 1 ? (
          <div>
            <div className={styles.earthInputCont}>
              <div className={styles.labelText}>
                {i18nT('createAccount.accountName')}
              </div>
              <input
                autoCapitalize="off"
                autoCorrect="off"
                autoFocus={true}
                className={clsx(styles.earthName, styles.earthInput)}
                onChange={(e) => setName(e.target.value)}
                placeholder={i18nT('common.requiredPlaceholder')}
                required
              />
            </div>
            <div
              className={clsx(styles.earthInputCont, styles.mnemonicInputCont)}
            >
              <div className={styles.labelText}>{i18nT('createAccount.mnemonicLabel')}</div>
              <div className={styles.mnemonicContWrap}>
                <div className={styles.mnemonicCont}>
                  {newMnemonic.split(' ').map((word, index) => (
                    <div className={styles.mnemonicWords} key={index}>
                      {word}
                    </div>
                  ))}
                  <div className={styles.mnemonicActionsCont}>
                    <CopyToClipboard text={newMnemonic || ''}>
                      <div className={styles.mnemonicAction} onClick={_onCopy}>
                        <img
                          className={styles.mnemonicActionIcon}
                          src={ICON_COPY}
                        />
                        <div>{i18nT('createAccount.copy')}</div>
                      </div>
                    </CopyToClipboard>
                    <div
                      className={styles.mnemonicAction}
                      onClick={() => backupKeystore()}
                    >
                      <img
                        className={styles.mnemonicActionIcon}
                        src={ICON_DOWNLOAD}
                      />
                      <div>{i18nT('createAccount.download')}</div>
                    </div>
                  </div>
                </div>
                <div className={styles.mnemonicHelp}>
                  <div className={styles.mnemonicHelpTitle}>
                    {i18nT('createAccount.generated')}
                  </div>
                </div>
              </div>
              <div className={styles.checkboxCont}>
                {checked ? (
                  <img
                    className={styles.checkboxIcon}
                    onClick={() => setChecked(false)}
                    src={ICON_CHECKED}
                  />
                ) : (
                  <img
                    className={styles.checkboxIcon}
                    onClick={() => setChecked(true)}
                    src={ICON_UNCHECKED}
                  />
                )}

                <div className={styles.checkboxTitle}>
                  {i18nT('createAccount.saved')}
                </div>
              </div>
              <div className={styles.nextCont}>
                <NextStepButton
                  disabled={!checked || name === ''}
                  onClick={!checked ? console.log : _onNextStep}
                >
                  {i18nT('createAccount.nextStep')}
                </NextStepButton>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div
              className={clsx(
                styles.earthInputCont,
                styles.earthInputContPassword
              )}
            >
              <Password className={styles.password} onChange={setPassword} />
              <div className={styles.nextCont}>
                <div className={styles.checkboxCont}>
                  {secondChecked ? (
                    <img
                      className={styles.checkboxIcon}
                      onClick={() => setSecondChecked(false)}
                      src={ICON_CHECKED}
                    />
                  ) : (
                    <img
                      className={styles.checkboxIcon}
                      onClick={() => setSecondChecked(true)}
                      src={ICON_UNCHECKED}
                    />
                  )}

                  <div className={styles.checkboxTitle}>
                    {i18nT('createAccount.checkBox')}
                  </div>
                </div>
                <NextStepButton
                  loading={isBusy}
                  disabled={!secondChecked || !password}
                  onClick={!secondChecked ? console.log : _onCreate}
                >
                  {i18nT('createAccount.cta')}
                </NextStepButton>
              </div>
            </div>
          </>
        ))}
    </div>
  );
};

export default Page;