// Copyright 2021 @earthwallet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ThemeProps } from '../../types';
import type { AccountInfo } from '.';

import { validateSeed } from '@earthwallet/extension-ui/messaging';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { NextStepButton, TextAreaWithLabel, Warning } from '../../components';
import useTranslation from '../../hooks/useTranslation';

interface Props {
  className?: string;
  onNextStep: () => void;
  onAccountChange: (account: AccountInfo | null) => void;
}

function SeedAndPath ({ className, onAccountChange, onNextStep }: Props): React.ReactElement {
  const { t } = useTranslation();
  const [address, setAddress] = useState('');
  const [seed, setSeed] = useState<string | null>(null);
  const [error, setError] = useState('');
  const genesis = 'the_icp';

  useEffect(() => {
    // No need to validate an empty seed
    // we have a dedicated error for this
    if (!seed) {
      onAccountChange(null);

      return;
    }

    const suri = `${seed || ''}${''}`;

    validateSeed(suri, 'ethereum', 'ICP').then((validatedAccount) => {
      setError('');
      setAddress(validatedAccount.address);
      // a spread operator here breaks tests, using Object.assign as a workaround
      const newAccount: AccountInfo = Object.assign(validatedAccount, { genesis });

      onAccountChange(newAccount);
    }).catch(() => {
      setAddress('');
      onAccountChange(null);
      setError(t<string>('Invalid mnemonic seed'));
    });
  }, [t, seed, onAccountChange, genesis]);

  return (
    <div className={className}>
      <>
        <div className={'wrap'} >
        <TextAreaWithLabel
          className='seedInput'
          isError={!!error}
          isFocused
          label={''}
          onChange={setSeed}
          rowsCount={2}
          value={seed || ''}
          placeholder="paste the mnemonic seed phrase here"
          />
          <div className='mnemonicHelp'>
        <div className='mnemonicHelpTitle'>
        To restore your account, paste your saved mnemonic phrase here
          </div>
          <div className='mnemonicHelpSubTitle'>
              Please write down your wallet’s mnemonic seed and keep it in a safe place.
        </div>
        </div>
        </div>
        
        {!!error && !seed && (
          <Warning
            className='seedError'
            isBelowInput
            isDanger
          >
            {t<string>('Mnemonic needs to contain 12, 15, 18, 21, 24 words')}
          </Warning>
        )}
      {/*   <Dropdown
          className='genesisSelection'
          label={t<string>('Network')}
          onChange={setGenesis}
          options={genesisOptions}
          value={genesis}
        /> */}
        {!!error && !!seed && (
          <Warning
            isDanger
          >
            {error}
          </Warning>
        )}
      </>
      <div className='nextCont'>
      <NextStepButton
          isDisabled={!address || !!error}
          onClick={onNextStep}
        >
          {t<string>('Next')}
        </NextStepButton>
      </div>
        
     </div>
  );
}

export default styled(SeedAndPath)(({ theme }: ThemeProps) => `
  .advancedToggle {
    color: ${theme.textColor};
    cursor: pointer;
    line-height: ${theme.lineHeight};
    letter-spacing: 0.04em;
    opacity: 0.65;
    text-transform: uppercase;

    > span {
      font-size: ${theme.inputLabelFontSize};
      margin-left: .5rem;
      vertical-align: middle;
    }
  }

  .nextButtonCont {
    margin: 0 27px;
  }

  .mnemonicHelp {
    padding: 16px;
  }

  .nextCont {
    padding: 0 27px;
    margin-top: 200px;
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
  
  .mnemonicHelpTitle {
    font-weight: 500;
    font-size: 12px;
    line-height: 129%;
    /* or 21px */

    text-align: center;

    color: #DBE4F2;
    margin-bottom: 12px;
  }
  

  .wrap {
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), rgba(36, 150, 255, 0.47);
    backdrop-filter: blur(5px);
    /* Note: backdrop-filter has minimal browser support */

    border-radius: 14px;
    margin: 14px 24px;
      }

  .genesisSelection {
    margin-bottom: ${theme.fontSize};
  }

  .seedInput {
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
    textarea {
      height: unset;
    }
  }

  .seedError {
    margin-bottom: 1rem;
  }
`);
