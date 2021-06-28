// Copyright 2021 @earthwallet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ThemeProps } from '../types';

import { validateMnemonic } from 'bip39';
import { saveAs } from 'file-saver';
import React, { useCallback, useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import StringCrypto from 'string-crypto';
import styled from 'styled-components';

import BG_MNEMONIC from '../assets/bg_mnemonic.png';
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
  const { show } = useToast();

  const onPassChange = useCallback(
    (password: string) => {
      setPass(password);
      setError('');
    }
    , []);

  const _onExportButtonClick = useCallback(
    (): void => {
      setIsBusy(true);
      const mnemonicSecret = decryptString(window.localStorage.getItem(address + '_mnemonic'), pass);

      if (validateMnemonic(mnemonicSecret)) {
        const blob = new Blob([mnemonicSecret], {
          type: 'text/plain;charset=utf-8'
        });

        saveAs(blob, `${address}.txt`);

        show('Downloading mnemonic to file');
      } else {
        setError('Wrong password! Please try again');
        setIsBusy(false);
      }

      /*    exportAccount(address, pass)
        .then(({ exportedJson }) => {
          const blob = new Blob([JSON.stringify(exportedJson)], { type: 'application/json; charset=utf-8' });

          saveAs(blob, `${address}.json`);

          onAction('/');
        })
        .catch((error: Error) => {
          console.error(error);
          setError(error.message);
          setIsBusy(false);
        }); */
    },
    [address, pass, show]
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
