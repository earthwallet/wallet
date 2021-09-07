import { validateMnemonic } from '@earthwallet/keyring';
import { saveAs } from 'file-saver';
import React, { useCallback, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { RouteComponentProps, withRouter } from 'react-router';
import { useHistory } from 'react-router-dom';
import styles from './index.scss';
import { useSelector } from 'react-redux';
import { selectAccountById } from '~state/wallet';

//import BG_MNEMONIC from '~assets/images/bg_mnemonic.png';
import ICON_CHECKED from '~assets/images/icon_checkbox_checked.svg';

import ICON_UNCHECKED from '~assets/images/icon_checkbox_unchecked.svg';
import ICON_COPY from '~assets/images/icon_copy.svg';
import Warning from '~components/Warning';
import InputWithLabel from '~components/InputWithLabel';

import NextStepButton from '~components/NextStepButton';
import Header from '~components/Header';
import { getShortAddress } from '~utils/common';
import { decryptString } from '~utils/vault';

const MIN_LENGTH = 6;

interface Props extends RouteComponentProps<{ address: string }> { }

function Export({
  match: {
    params: { address },
  },
}: Props): React.ReactElement<Props> {
  const selectedAccount = useSelector(selectAccountById(address));

  const [isBusy, setIsBusy] = useState(false);
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [checked, setChecked] = useState(false);
  const [mnemonic, setMnemonic] = useState<string | null>(null);
  const history = useHistory();

  const _onCopy = useCallback((): void => console.log('Copied'), []);

  const onPassChange = useCallback((password: string) => {
    setPass(password);
    setError('');
  }, []);

  const backupKeystore = () => {
    setIsBusy(true);
    const meId = address;
    const blob = new Blob([mnemonic || ''], {
      type: 'text/plain;charset=utf-8',
    });

    saveAs(blob, `${meId}.txt`);
    setIsBusy(false);
  };

  const _onExportButtonClick = useCallback((): void => {
    setIsBusy(true);
    let mnemonicSecret = '';
    try {
      mnemonicSecret = decryptString(
        selectedAccount?.vault.encryptedMnemonic,
        pass
      );
    } catch (error) {
      setError('Wrong password! Please try again');
      setIsBusy(false);
    }

    if (validateMnemonic(mnemonicSecret)) {
      setMnemonic(mnemonicSecret);
    } else {
      setError('Wrong password! Please try again');
      setIsBusy(false);
    }
  }, [address, pass]);

  return (
    <>
      <div className={styles.page}>
        <Header showBackArrow text={'Export account'} type={'wallet'}>
          <div style={{ width: 39 }}></div>
        </Header>
        {selectedAccount?.id && (
          <div className={styles.addressDisplay}>
            {getShortAddress(selectedAccount?.id)}
            <CopyToClipboard text={selectedAccount?.id}>
              <img
                src={ICON_COPY}
                className={styles.copyIcon}
                onClick={_onCopy}
              />
            </CopyToClipboard>
          </div>
        )}

        <div className={styles.actionArea}>
          {mnemonic === null ? (
            <div>
              <InputWithLabel
                data-export-password
                disabled={isBusy}
                isError={pass.length < MIN_LENGTH || !!error}
                label={'password for this account'}
                onChange={onPassChange}
                placeholder="REQUIRED"
                type="password"
              />
              {error && (
                <Warning isBelowInput isDanger>
                  {error}
                </Warning>
              )}
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
                  I understand that I may lose access to digital assets if I
                  disclose my private keys.
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className={styles.labelText}>Secret Mnemonic</div>
              <div className={styles.mnemonicContWrap}>
                <div className={styles.mnemonicCont}>
                  {mnemonic.split(' ').map((word, index) => (
                    <div className={styles.mnemonicWords} key={index}>
                      {word}
                    </div>
                  ))}
                  <div className={styles.mnemonicActionsCont}>
                    <CopyToClipboard text={mnemonic || ''}>
                      <div className={styles.mnemonicAction} onClick={_onCopy}>
                        <img className="mnemonicActionIcon" src={ICON_COPY} />
                        <div>COPY</div>
                      </div>
                    </CopyToClipboard>

                    <div
                      className={styles.mnemonicAction}
                      onClick={() => backupKeystore()}
                    >
                      <img
                        className={styles.mnemonicActionIcon}
                        src={ICON_COPY}
                      />
                      <div>DOWNLOAD</div>
                    </div>
                  </div>
                </div>
                <div className={styles.mnemonicHelp}>
                  <div className={styles.mnemonicHelpTitle}>
                    Never disclose this secret. Anyone with this phrase can
                    steal any assets in your account.
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className={styles.nextCont}>
            {mnemonic === null ? (
              <NextStepButton
                className={styles.exportbutton}
                data-export-button
                disabled={pass.length === 0 || !!error || !checked}
                loading={isBusy}
                onClick={_onExportButtonClick}
              >
                Confirm
              </NextStepButton>
            ) : (
              <NextStepButton
                className={styles.exportbutton}
                data-export-button
                disabled={false}
                onClick={() => history.goBack()}
              >
                Done
              </NextStepButton>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default withRouter(Export);
