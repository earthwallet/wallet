// Copyright 2021 @earthwallet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ThemeProps } from '../types';

import { saveAs } from 'file-saver';
import React, { useCallback, useContext, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import styled from 'styled-components';

import {  ActionContext, EarthAddress, NextStepButton, InputWithLabel, Warning } from '../components';
import useTranslation from '../hooks/useTranslation';
import { exportAccount } from '../messaging';
import { Header } from '../partials';
import BG_MNEMONIC from '../assets/bg_mnemonic.png';


const MIN_LENGTH = 6;

interface Props extends RouteComponentProps<{address: string}>, ThemeProps {
  className?: string;
}

function Export ({ className, match: { params: { address } } }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const onAction = useContext(ActionContext);
  const [isBusy, setIsBusy] = useState(false);
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  const _goHome = useCallback(
    () => onAction('/'),
    [onAction]
  );

  const onPassChange = useCallback(
    (password: string) => {
      setPass(password);
      setError('');
    }
    , []);

  const _onExportButtonClick = useCallback(
    (): void => {
      setIsBusy(true);

      exportAccount(address, pass)
        .then(({ exportedJson }) => {
          const blob = new Blob([JSON.stringify(exportedJson)], { type: 'application/json; charset=utf-8' });

          saveAs(blob, `${address}.json`);

          onAction('/');
        })
        .catch((error: Error) => {
          console.error(error);
          setError(error.message);
          setIsBusy(false);
        });
    },
    [address, onAction, pass]
  );

  return (
    <>
    
      <div className={className}>
      <Header
        showBackArrow
        type={'wallet'}
        text={t<string>('Export account')}
      ><div style={{width: 39}}></div></Header>
        <EarthAddress address={address || 'f78f75b401011ea77b498e4f7aac096b2ffd892e3dd2cea7da24a64d4229aa85'}></EarthAddress>

       {/*    <Warning className='movedWarning'>
            {t<string>("You are exporting your account. Keep it safe and don't share it with anyone.")}
          </Warning> */}
          <div className='actionArea'>
            <InputWithLabel
              data-export-password
              disabled={isBusy}
              isError={pass.length < MIN_LENGTH || !!error}
              label={t<string>('password for this account')}
              onChange={onPassChange}
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
            <div className={'nextCont'}>
            <NextStepButton
              className='export-button'
              data-export-button
              isBusy={isBusy}
              isDanger
              isDisabled={pass.length === 0 || !!error}
              onClick={_onExportButtonClick}
            >
              {t<string>('Confirm')}
            </NextStepButton>
            </div>
          </div>
      </div>
    </>
  );
}

export default withRouter(styled(Export)`
background: url(${BG_MNEMONIC}); 
    height: 600px;

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
