// Copyright 2021 @earthwallet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0
import type { ThemeProps } from '../../types';

import { genesisSymbolMap } from '@earthwallet/extension-ui/util/chains';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';

import { ActionContext, Address, Loading } from '../../components';
import AccountNamePasswordCreation from '../../components/AccountNamePasswordCreation';
import useTranslation from '../../hooks/useTranslation';
import { createAccountSuri, createSeed } from '../../messaging';
import { HeaderWithSteps } from '../../partials';
import { DEFAULT_TYPE } from '../../util/defaultType';
import Mnemonic from './Mnemonic';
import BG_MNEMONIC from '../../assets/bg_mnemonic.png';
import { NextStepButton } from '../../components';

interface Props extends ThemeProps {
  className?: string;
}

function CreateAccount({ className }: Props): React.ReactElement {
  const { t } = useTranslation();
  const onAction = useContext(ActionContext);
  const [isBusy, setIsBusy] = useState(false);
  const [step, setStep] = useState(1);
  const [account, setAccount] = useState<null | { address: string; seed: string }>(null);
  const type = DEFAULT_TYPE;
  const [name, setName] = useState('');
  const genesis = genesisSymbolMap.ICP;

  useEffect((): void => {
    createSeed(undefined, type, 'ICP')
      .then(setAccount)
      .catch((error: Error) => console.error(error));
  }, [type]);

  const _onCreate = useCallback(
    (name: string, password: string): void => {
      // this should always be the case
      if (name && password && account) {
        setIsBusy(true);

        createAccountSuri(name, password, account.seed, undefined, genesis, genesis === 'the_icp' ? 'ICP' : undefined)
          .then(() => onAction('/'))
          .catch((error: Error): void => {
            setIsBusy(false);
            console.error(error);
          });
      }
    },
    [account, genesis, onAction]
  );

  const _onNextStep = useCallback(() => setStep((step) => step + 1), []);
  const _onPreviousStep = useCallback(() => setStep((step) => step - 1), []);

  return (
    <div className={className}>
      <HeaderWithSteps step={step}
        text={t<string>('Create an account')} />
      <Loading>
        <div className='earthInputCont'>
          <div className='labelText'>Account name</div>
              <input
              autoCapitalize='off'
              autoCorrect='off'
              autoFocus={true}
              className='recipientAddress earthInput'
              onChange={(e) => console.log(e.target.value)}
              placeholder="REQUIRED"
              required
            />
        </div>
        {account &&
          (step === 1
            ? (
              <div className='earthInputCont'>
                  <div className='labelText'>Mnemonic Seed</div>
                  <div className='mnemonicCont'>
                  { account.seed.split(" ").map((word, index )=> <div  className='mnemonicWords' key={index}>
                   {word}
                 </div>)}</div> 
                 
                 {/* 
                         <NextStepButton
                            isDisabled={!isMnemonicSaved}
                            onClick={onNextStep}
                          >
                            {t<string>('Next step')}
                          </NextStepButton> */}
               </div>
              
            )
            : (
              <>
                <AccountNamePasswordCreation
                  buttonLabel={t<string>('Add Account')}
                  isBusy={isBusy}
                  onBackClick={_onPreviousStep}
                  onCreate={_onCreate}
                  onNameChange={setName}
                />
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

  .mnemonicCont{

    background: rgba(36, 150, 255, 0.22);
    backdrop-filter: blur(8px);
    /* Note: backdrop-filter has minimal browser support */
    
    border-radius: 14px;
    flex-wrap: wrap;
    display: flex;
    padding: 16px;
    border: 1px solid #3A60D4;
  }

  .mnemonicWords{
    background: rgba(0, 0, 0, 0.31);
    border-radius: 5px;
    
    /* Inside Auto Layout */
    
    flex: none;
    order: 0;
    flex-grow: 0;
    margin: 0px 8px 5px 8px;
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
  .mnemonicWords{

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

