import { validateMnemonic } from '@earthwallet/keyring';
import { saveAs } from 'file-saver';
import React, { useCallback, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { RouteComponentProps, withRouter } from 'react-router';
import { useHistory } from 'react-router-dom';
import styles from './index.scss';
import { useSelector } from 'react-redux';
import { selectAccountById } from '~state/wallet';
import ICON_CHECKED from '~assets/images/icon_checkbox_checked.svg';

import ICON_UNCHECKED from '~assets/images/icon_checkbox_unchecked.svg';
import ICON_COPY from '~assets/images/icon_copy.svg';
import Warning from '~components/Warning';
import InputWithLabel from '~components/InputWithLabel';

import NextStepButton from '~components/NextStepButton';
import Header from '~components/Header';
import { getShortAddress } from '~utils/common';
import { decryptString } from '~utils/vault';
import useToast from '~hooks/useToast';
import StringCrypto from 'string-crypto';
import { i18nT } from '~i18n/index';

const {
  decryptString: decryptString_PBKDF2
} = new StringCrypto();
const MIN_LENGTH = 6;

interface Props extends RouteComponentProps<{ accountId: string }> { }

function Export({
  match: {
    params: { accountId },
  },
}: Props): React.ReactElement<Props> {
  const selectedAccount = useSelector(selectAccountById(accountId));
  const { address } = selectedAccount;

  const [isBusy, setIsBusy] = useState(false);
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [checked, setChecked] = useState(false);
  const [mnemonic, setMnemonic] = useState<string | null>(null);
  const history = useHistory();

  const { show } = useToast();

  const _onCopy = useCallback((): void => show('Copied'), [show]);


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
      mnemonicSecret = selectedAccount?.vault.encryptionType === 'PBKDF2'
        ? decryptString_PBKDF2(
          selectedAccount?.vault.encryptedMnemonic,
          pass
        ) : decryptString(
          selectedAccount?.vault.encryptedMnemonic,
          pass
        );
    } catch (error) {
      setError(i18nT('common.wrongPass'));
      setIsBusy(false);
    }

    if (validateMnemonic(mnemonicSecret)) {
      setMnemonic(mnemonicSecret);
    } else {
      setError(i18nT('common.wrongPass'));
      setIsBusy(false);
    }
  }, [address, pass]);

  return (
    <>
      <div className={styles.page}>
        <Header showBackArrow text={i18nT('export.header')} type={'wallet'}>
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
                label={i18nT('common.passwordForAc')}
                onChange={onPassChange}
                placeholder={i18nT('common.requiredPlaceholder')}
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
                  {i18nT('export.checkTitle')}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className={styles.labelText}>{i18nT('export.secretMnemonicLabel')}</div>
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
                        <div>{i18nT('export.copy')}</div>
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
                      <div>{i18nT('export.download')}</div>
                    </div>
                  </div>
                </div>
                <div className={styles.mnemonicHelp}>
                  <div className={styles.mnemonicHelpTitle}>
                    {i18nT('export.never')}
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
                {i18nT('export.confirm')}
              </NextStepButton>
            ) : (
              <NextStepButton
                className={styles.exportbutton}
                data-export-button
                disabled={false}
                onClick={() => history.goBack()}
              >
                {i18nT('export.done')}
              </NextStepButton>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default withRouter(Export);
