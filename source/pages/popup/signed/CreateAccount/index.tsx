/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-key */
/* eslint-disable camelcase */

import React, { useState, useEffect, useCallback } from 'react';
import styles from './index.scss';
//import { saveAs } from 'file-saver';
//import { useHistory } from 'react-router-dom';
//import BG_MNEMONIC from '~assets/images/bg_mnemonic.png';
import ICON_CHECKED from '~assets/images/icon_checkbox_checked.svg';
import ICON_UNCHECKED from '~assets/images/icon_checkbox_unchecked.svg';
import ICON_COPY from '~assets/images/icon_copy.svg';
import ICON_DOWNLOAD from '~assets/images/icon_download.svg';
import CopyToClipboard from 'react-copy-to-clipboard';
//import Loading from '~components/Loading';
import NextStepButton from '~components/NextStepButton';
import HeaderWithSteps from '~components/HeaderWithSteps';
import Password from '~components/Password';
import clsx from 'clsx';

import { useController } from '~hooks/useController';
import { IWalletState } from '~state/wallet/types';
import { AppState } from '~state/store';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

const Page = () => {
  const controller = useController();

  const { newMnemonic }: IWalletState = useSelector(
    (state: AppState) => state.wallet
  );

  const history = useHistory();

  const [isBusy, setIsBusy] = useState(false);
  const [checked, setChecked] = useState(false);
  const [secondChecked, setSecondChecked] = useState(false);
  //const { setSelectedAccount } = useContext(SelectedAccountContext);

  const [step, setStep] = useState(1);
  //const type = 'DEFAULT_TYPE';
  const [name, setName] = useState('');
  const [password, setPassword] = useState<string | null>(null);
  console.log(setStep, setIsBusy);
  //const history = useHistory();

  //const genesis = "ICP";

  //const show = console.log;
  const _onCopy = () => console.log();

  const _onCreate = useCallback((): void => {
    console.log('createAccount');

    // this should always be the case
    if (name && password && newMnemonic) {
      console.log('createAccount');
      setIsBusy(true);
      const callback = (address: string) => history.replace('/account/details/' + address);
      controller.accounts
        .createOrUpdateAccount(newMnemonic, 'ICP', name, password, callback)
        .then(() => {
        });
    }
  }, [name, password, newMnemonic]);

  const backupKeystore = () => console.log();

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
        text={'Create an account'}
      />
      {newMnemonic !== '' &&
        (step === 1 ? (
          <div>
            <div className={styles.earthInputCont}>
              <div className={styles.labelText}>
                Account name
              </div>
              <input
                autoCapitalize="off"
                autoCorrect="off"
                autoFocus={true}
                className={clsx(styles.earthName, styles.earthInput)}
                onChange={(e) => setName(e.target.value)}
                placeholder="REQUIRED"
                required
              />
            </div>
            <div
              className={clsx(styles.earthInputCont, styles.mnemonicInputCont)}
            >
              <div className={styles.labelText}>Mnemonic Seed</div>
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
                        <div>COPY</div>
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
                      <div>DOWNLOAD</div>
                    </div>
                  </div>
                </div>
                <div className={styles.mnemonicHelp}>
                  <div className={styles.mnemonicHelpTitle}>
                    This is a generated 12-word
                    mnemonic seed.
                    {/* <small>
                      Please write down your wallet’s mnemonic seed and keep it
                      in a safe place. The mnemonic can be used to restore your
                      wallet.
                    </small> */}
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
                  I have saved my mnemonic seed safely.
                </div>
              </div>
              <div className={styles.nextCont}>
                <NextStepButton
                  disabled={!checked}
                  onClick={!checked ? console.log : _onNextStep}
                >
                  {'Next step'}
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
              <Password onChange={setPassword} />
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
                    I understand that I will lose access to the account if I
                    lose this mnemonic phrase.
                  </div>
                </div>
                <NextStepButton
                  loading={isBusy}
                  disabled={!secondChecked || !password}
                  onClick={!secondChecked ? console.log : _onCreate}
                >
                  {'Create an Account'}
                </NextStepButton>
              </div>
            </div>
          </>
        ))}
    </div>
  );
};

export default Page;
