// Copyright 2021 @earthwallet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ThemeProps } from '../types';

import { validateMnemonic } from 'bip39';
import { saveAs } from 'file-saver';
import React, { useCallback, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { RouteComponentProps, withRouter } from 'react-router';
import { useHistory } from 'react-router-dom';
import StringCrypto from 'string-crypto';
import styled from 'styled-components';

import BG_MNEMONIC from '../assets/bg_mnemonic.png';
import ICON_CHECKED from '../assets/icon_checkbox_checked.svg';
import ICON_UNCHECKED from '../assets/icon_checkbox_unchecked.svg';
import ICON_COPY from '../assets/icon_copy.svg';
import { EarthAddress, InputWithLabel, NextStepButton, Warning } from '../components';
import useToast from '../hooks/useToast';
import useTranslation from '../hooks/useTranslation';
import { Header } from '../partials';

const { decryptString } = new StringCrypto();

const MIN_LENGTH = 6;

interface Props extends RouteComponentProps<{address: string}>, ThemeProps {
  className?: string;
}

function Export ({ className, match: { params: { address } } }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [isBusy, setIsBusy] = useState(false);
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [checked, setChecked] = useState(false);
  const [mnemonic, setMnemonic] = useState<string|null>(null);
  const history = useHistory();

  const { show } = useToast();
  const _onCopy = useCallback((): void => show('Copied'), [show]);

  const onPassChange = useCallback(
    (password: string) => {
      setPass(password);
      setError('');
    }
    , []);

  const backupKeystore = () => {
    setIsBusy(true);
    const meId = address;
    const blob = new Blob([mnemonic || ''], {
      type: 'text/plain;charset=utf-8'
    });

    saveAs(
      blob,
      `${meId}.txt`
    );
    setIsBusy(false);
  };

  const _onExportButtonClick = useCallback(
    (): void => {
      setIsBusy(true);
      const mnemonicSecret = decryptString(window.localStorage.getItem(address + '_mnemonic'), pass);

      if (validateMnemonic(mnemonicSecret)) {
        setMnemonic(mnemonicSecret);
      } else {
        setError('Wrong password! Please try again');
        setIsBusy(false);
      }
    },
    [address, pass]
  );

  return (
    <>

      <div className={className}>
        <Header
          showBackArrow
          text={t<string>('Export account')}
          type={'wallet'}
        ><div style={{ width: 39 }}></div></Header>
        <EarthAddress address={address} ></EarthAddress>
        <div className='actionArea'>
          {mnemonic === null
            ? <div>

              <InputWithLabel
                data-export-password
                disabled={isBusy}
                isError={pass.length < MIN_LENGTH || !!error}
                label={t<string>('password for this account')}
                onChange={onPassChange}
                placeholder='REQUIRED'
                type='password'
              />
              {error && (
                <Warning
                  isBelowInput
                  isDanger
                >
                  {error}
                </Warning>
              )}
              <div className='checkboxCont'>
                { checked
                  ? <img
                    className='checkboxIcon'
                    onClick={() => setChecked(false)}
                    src={ICON_CHECKED} />
                  : <img
                    className='checkboxIcon'
                    onClick={() => setChecked(true)}
                    src={ICON_UNCHECKED} />
                }

                <div className='checkboxTitle'>I understand that I will loose access to the account if
                    I disclose my private keys.</div>
              </div>

            </div>
            : <div>

              <div className='labelText'>Secret Mnemonic</div>
              <div className='mnemonicContWrap'>
                <div className='mnemonicCont'>
                  { mnemonic.split(' ').map((word, index) => <div className='mnemonicWords'
                    key={index}>
                    {word}
                  </div>)}
                  <div className='mnemonicActionsCont'>
                    <CopyToClipboard
                      text={mnemonic || ''}
                    >
                      <div
                        className='mnemonicAction'
                        onClick={_onCopy}><img className='mnemonicActionIcon'
                          src={ICON_COPY}/>
                        <div>COPY</div>
                      </div>
                    </CopyToClipboard>

                    <div className='mnemonicAction'
                      onClick={() => backupKeystore()}>
                      <img className='mnemonicActionIcon'
                        src={ICON_COPY}/>
                      <div>DOWNLOAD</div>
                    </div>
                  </div>
                </div>
                <div className='mnemonicHelp'>
                  <div className='mnemonicHelpTitle'>
                      Never disclose this secret. Anyone with this phrase can steal any assets in your account.
                  </div>
                </div>
              </div>
            </div>}
          <div className={'nextCont'}>
            {mnemonic === null
              ? <NextStepButton
                className='export-button'
                data-export-button
                isBusy={isBusy}
                isDanger
                isDisabled={(pass.length === 0 || !!error || !checked) }
                onClick={_onExportButtonClick}
              >
              Confirm
              </NextStepButton>
              : <NextStepButton
                className='export-button'
                data-export-button
                isBusy={isBusy}
                isDanger
                isDisabled={false}
                onClick={() => history.goBack()}
              >
          Done
              </NextStepButton>
            }
          </div>
        </div>
      </div>
    </>
  );
}

export default withRouter(styled(Export)`
  background: url(${BG_MNEMONIC}); 
  height: 600px;
  position: relative;


  .checkboxTitle {
    font-weight: normal;
    font-size: 13px;
    line-height: 150%;
    color: #FFFFFF; 
    margin-left: 12px;
  }
  .checkboxIcon {
    cursor: pointer;
    user-select: none;
  }
  .checkboxCont {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 135px 0px 24px 0;
  }

  .labelText {

    font-family: DM Sans;
    font-style: normal;
    font-weight: 700;
    font-size: 12px;
    line-height: 150%;
    /* identical to box height, or 18px */

    letter-spacing: 0.05em;
    text-transform: uppercase;

    color: #DBE4F2;
    margin-bottom: 10px;
    margin-top: 16px;
    
  }
 


  .mnemonicCont {

    background: rgba(36, 150, 255, 0.22);
    backdrop-filter: blur(8px);
    /* Note: backdrop-filter has minimal browser support */
    
    border-radius: 14px;
    flex-wrap: wrap;
    display: flex;
    padding: 16px;
    border: 1px solid #3A60D4;
  }

  .mnemonicContWrap {
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), rgba(36, 150, 255, 0.47);
    backdrop-filter: blur(5px);
    /* Note: backdrop-filter has minimal browser support */

    border-radius: 14px;
  }

  .mnemonicHelpTitle {
    font-weight: 500;
    font-size: 12px;
    line-height: 129%;
    /* or 21px */

    text-align: center;

    color: #DBE4F2;
    margin-bottom: 12px;
  }
  
  .mnemonicHelpSubTitle {
    font-weight: normal;
    font-size: 10px;
    line-height: 150%;
    /* or 18px */

    text-align: center;
    letter-spacing: 0.02em;

    color: #DBE4F2;

    opacity: 0.8;
  }
  .mnemonicActionsCont {
    display: flex;
    flex-direction: row;
    margin-top: 16px;
  }
  .mnemonicActionIcon {
    height: 16px;
    width: 16px;
    margin-right: 10px;
  }
  .mnemonicAction{
    border: 1px solid rgba(255, 255, 255, 0.8);
    border-radius: 3px;
    padding: 4px 9px;

    flex: none;
    order: 0;
    flex-grow: 0;
    margin-right: 16px;
    font-weight: 500;
    font-size: 13px;
    line-height: 12px;
    /* identical to box height, or 92% */

    text-align: center;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    justify-content: center;

    color: #FFFFFF;
    cursor: pointer;
    user-select: none;
    &:active {
      opacity : 0.7;
    }

  }

  .mnemonicHelp {
    padding: 16px;
  }

  .mnemonicWords {
    background: rgba(0, 0, 0, 0.31);
    border-radius: 5px;
    
    /* Inside Auto Layout */
    
    flex: none;
    order: 0;
    flex-grow: 0;
    margin: 0px 8px 5px 0px;
    padding: 4px 13px;
    font-family: DM Mono;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 12px;
    /* identical to box height, or 100% */

    text-align: center;

    color: #FFFFFF;

  }

  .actionArea {
    padding: 10px 24px;
  }

  .center {
    margin: auto;
  }

  .nextCont{
    position: absolute;
    left: 0;
    bottom: 0;
    margin: 20px 30px;
  }

  .export-button {
    margin-top: 6px;
  }

  .movedWarning {
    margin-top: 8px;
  }

  .withMarginTop {
    margin-top: 4px;
  }
`);
