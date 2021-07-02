// Copyright 2021 @earthwallet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ThemeProps } from '../../types';

import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import BG_MNEMONIC from '../../assets/bg_mnemonic.png';
import { AccountContext, ActionContext, SelectedAccountContext } from '../../components';
import AccountNamePasswordCreation from '../../components/AccountNamePasswordCreation';
import useTranslation from '../../hooks/useTranslation';
import { createAccountSuri } from '../../messaging';
import { HeaderWithSteps } from '../../partials';
import SeedAndPath from './SeedAndPath';

export interface AccountInfo {
  address: string;
  genesis?: string;
  suri: string;
}

interface Props extends ThemeProps {
  className?: string;
}

function ImportSeed({ className }: Props): React.ReactElement {
  const { t } = useTranslation();
  const { accounts } = useContext(AccountContext);
  const onAction = useContext(ActionContext);
  const [isBusy, setIsBusy] = useState(false);
  const [account, setAccount] = useState<AccountInfo | null>(null);
  const [_name, setName] = useState<string | null>(null);
  const [step1, setStep1] = useState(true);
  const history = useHistory();

  const { setSelectedAccount } = useContext(SelectedAccountContext);

  useEffect((): void => {
    !accounts.length && onAction();
  }, [accounts, onAction]);

  const _onCreate = useCallback((name: string, password: string): void => {
    // this should always be the case
    if (_name && password && account) {
      setIsBusy(true);

      createAccountSuri(_name, password, account.suri, undefined, account.genesis, account.genesis === 'the_icp' ? 'ICP' : undefined)
        .then(() => {
          setSelectedAccount({ ...account, name: _name, genesis: 'the_icp', symbol: 'ICP' });
          history.replace('/wallet/home');
        }).catch((error): void => {
          setIsBusy(false);
          console.error(error);
        });
    }
  }, [account, history, _name, setSelectedAccount]);

  const _onNextStep = useCallback(() => { setStep1(false); }, []);
  const _onBackClick = useCallback(() => { setStep1(true); }, []);

  return (
    <div className={className}>
      <HeaderWithSteps
        backOverride={step1 ? undefined : _onBackClick}
        step={step1 ? 1 : 2}
        text={t<string>('Import account')}
      />
      {step1
        ? <div>
          <div className='earthInputCont'>
            <div className='labelText'>Enter your Mnemonic Seed phrase</div>
            <SeedAndPath
              onAccountChange={setAccount}
              onNextStep={_onNextStep}
            />
          </div>

        </div>

        : <AccountNamePasswordCreation
          buttonLabel={t<string>('Add account')}
          isBusy={isBusy}
          onBackClick={_onBackClick}
          onCreate={_onCreate}
          onNameChange={setName}
        />

      }
    </div>
  );
}

export default styled(ImportSeed)(({ theme }: Props) => `
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
    padding: 0 27px;
    
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
    margin: 24px 0;
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
