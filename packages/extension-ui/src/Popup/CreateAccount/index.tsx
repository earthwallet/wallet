// Copyright 2021 @earthwallet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-key */
/* eslint-disable camelcase */

import type { ThemeProps } from '../../types';

import { genesisSymbolMap } from '@earthwallet/extension-ui/util/chains';
import { saveAs } from 'file-saver';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import styled from 'styled-components';

// import Mnemonic from './Mnemonic';
import BG_MNEMONIC from '../../assets/bg_mnemonic.png';
import ICON_CHECKED from '../../assets/icon_checkbox_checked.svg';
import ICON_UNCHECKED from '../../assets/icon_checkbox_unchecked.svg';
import ICON_COPY from '../../assets/icon_copy.svg';
import { ActionContext, Loading, NextStepButton, SelectedAccountContext } from '../../components';
//  // NextStepButton
import useToast from '../../hooks/useToast';
import useTranslation from '../../hooks/useTranslation';
import { createAccountSuri, createSeed } from '../../messaging';
import { HeaderWithSteps } from '../../partials';
import { DEFAULT_TYPE } from '../../util/defaultType';

interface Props extends ThemeProps {
  className?: string;
}

function CreateAccount({ className }: Props): React.ReactElement {
  const { t } = useTranslation();
  const onAction = useContext(ActionContext);
  const [isBusy, setIsBusy] = useState(false);
  const [checked, setChecked] = useState(false);
  const [secondChecked, setSecondChecked] = useState(false);
  const { setSelectedAccount } = useContext(SelectedAccountContext);

  const [step, setStep] = useState(1);
  const [account, setAccount] = useState<null | { address: string; seed: string }>(null);
  const type = DEFAULT_TYPE;
  const [_name, setName] = useState('');
  const [_password, setPassword] = useState<string>('');
  const [_reptPassword, setReptPassword] = useState<string>('');

  const genesis = genesisSymbolMap.ICP;

  const { show } = useToast();
  const _onCopy = useCallback((): void => show('Copied'), [show]);

  useEffect((): void => {
    createSeed(undefined, type, 'ICP')
      .then(setAccount)
      .catch((error: Error) => console.error(error));
  }, [type]);

  const _onCreate = useCallback(
    (): void => {
      console.log(_reptPassword);

      // this should always be the case
      if (_name && _password && account) {
        setIsBusy(true);

        createAccountSuri(_name, _password, account.seed, undefined, genesis, genesis === 'the_icp' ? 'ICP' : undefined)
          .then(() => {
            setSelectedAccount({ ...account, name: _name, genesis: 'the_icp', symbol: 'ICP' });
            onAction('/wallet/home');
          })
          .catch((error: Error): void => {
            setIsBusy(false);
            console.error(error);
          });
      }
    },
    [account, genesis, onAction, _name, _password, _reptPassword, setSelectedAccount]
  );

  const backupKeystore = () => {
    setIsBusy(true);
    const meId = account?.address;
    const blob = new Blob([account?.seed || ''], {
      type: 'text/plain;charset=utf-8'
    });

    saveAs(
      blob,
      `${meId}.txt`
    );
    setIsBusy(false);
  };

  const _onNextStep = useCallback(() => setStep((step) => step + 1), []);
  const _onPreviousStep = useCallback(() => setStep((step) => step - 1), []);

  return (
    <div className={className}>
      <HeaderWithSteps backOverride={step === 1 ? undefined : _onPreviousStep}
        step={step}
        text={t<string>('Create an account')}
      />
      <Loading>

        {account &&
          (step === 1
            ? (
              <>
                <div className='earthInputCont'>
                  <div className='labelText'>Account name</div>
                  <input
                    autoCapitalize='off'
                    autoCorrect='off'
                    autoFocus={true}
                    className='earthName earthInput'
                    onChange={(e) => setName(e.target.value)}
                    placeholder="REQUIRED"
                    required
                  />
                </div>
                <div className='earthInputCont mnemonicInputCont'>
                  <div className='labelText'>Mnemonic Seed</div>
                  <div className='mnemonicContWrap'>
                    <div className='mnemonicCont'>
                      { account.seed.split(' ').map((word, index) => <div className='mnemonicWords'
                        key={index}>
                        {word}
                      </div>)}
                      <div className='mnemonicActionsCont'>
                        <CopyToClipboard
                          text={account.seed || ''}
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
                    This is a generated 12-word mnemonic seed.
                      </div>
                      {/*         <div className='mnemonicHelpSubTitle'>
                     Please write down your wallet’s mnemonic seed and keep it in a safe place.
                     </div> */}
                    </div>
                  </div>
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

                    <div className='checkboxTitle'>I have saved my mnemonic seed safely.</div>
                  </div>
                  <div>
                  </div>
                  <NextStepButton
                    isDisabled={!checked}
                    onClick={!checked ? console.log : _onNextStep}
                  >
                    {t<string>('Next step')}
                  </NextStepButton>
                </div>
              </>
            )
            : (
              <>
                <div className='earthInputCont'>
                  <div className='labelText'>Password {_password}</div>
                  <input
                    autoCapitalize='off'
                    autoCorrect='off'
                    autoFocus={true}
                    className='earthPassword earthInput'
                    defaultValue={''}
                    key='password'
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="REQUIRED"
                    required
                    type={'password'}
                  />
                </div>
                <div className='earthInputCont'>
                  <div className='labelText'>Repeat Password</div>
                  <input
                    autoCapitalize='off'
                    autoCorrect='off'
                    className='earthPassword earthInput'
                    key='reptpassword'
                    onChange={(e) => setReptPassword(e.target.value)}
                    placeholder="REQUIRED"
                    required
                    type={'password'}
                  />
                  <div className='helpPassword'>
               Minimum 8 characters for password
                  </div>
                  <div className='checkboxCont'>
                    { secondChecked
                      ? <img
                        className='checkboxIcon'
                        onClick={() => setSecondChecked(false)}
                        src={ICON_CHECKED} />
                      : <img
                        className='checkboxIcon'
                        onClick={() => setSecondChecked(true)}
                        src={ICON_UNCHECKED} />
                    }

                    <div className='checkboxTitle'>I understand that I will loose access to the account if I loose thise mnemonic phrase.</div>
                  </div>

                  <NextStepButton
                    isDisabled={!secondChecked}
                    loading={isBusy}
                    onClick={!secondChecked ? console.log : _onCreate}
                  >
                    {t<string>('Create an Account')}
                  </NextStepButton>
                </div>
              </>
            ))}
      </Loading>
    </div>
  );
}

export default styled(CreateAccount)(({ theme }: Props) => `
  background: url(${BG_MNEMONIC}); 
  height: 600px;
  width: ${theme.appWidth};

  .helpPassword{
    font-family: DM Sans;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 140%;
    /* or 20px */


    color: #FFFFFF;
    opacity: 0.5;
    margin: 20px 0;
  }
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
    margin: 24px 0px;  
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
    
  }

  .mnemonicWords {

    font-family: DM Mono;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 12px;
    /* identical to box height, or 100% */

    text-align: center;

    color: #FFFFFF;

  }
  .earthInputCont {
    padding: 0 27px;
    margin: 20px 0;
  }

  .earthInput {
    width: 100%;
    background-image:none;
    background-color:transparent;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
    box-shadow: none;
    background: linear-gradient(0deg, rgba(8, 25, 39, 0.6), rgba(8, 25, 39, 0.6));
    border: 2px solid rgba(36, 150, 255, 0.5);
    box-sizing: border-box;
    border-radius: 8px;
    padding: 16px 12px;
    color: #fff;
    font-weight: 600;
    font-size: 16px;
    line-height: 19px;
    /* identical to box height */
    letter-spacing: 0.025em;
     &:focus-visible {
      outline: none;
   }  
    &::placeholder {
     
      color: #DBE4F2;
      opacity: 0.25;
    }

  }
  `);
