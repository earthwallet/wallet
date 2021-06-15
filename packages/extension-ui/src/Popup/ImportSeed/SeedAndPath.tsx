// Copyright 2021 @earthwallet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ThemeProps } from '../../types';
import type { AccountInfo } from '.';

import { validateSeed } from '@earthwallet/extension-ui/messaging';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { ButtonArea, Dropdown, NextStepButton, TextAreaWithLabel, VerticalSpace, Warning } from '../../components';
import useGenesisHashOptions from '../../hooks/useGenesisHashOptions';
import useTranslation from '../../hooks/useTranslation';

interface Props {
  className?: string;
  onNextStep: () => void;
  onAccountChange: (account: AccountInfo | null) => void;
}

function SeedAndPath ({ className, onAccountChange, onNextStep }: Props): React.ReactElement {
  const { t } = useTranslation();
  const genesisOptions = useGenesisHashOptions();
  const [address, setAddress] = useState('');
  const [seed, setSeed] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [genesis, setGenesis] = useState('the_icp');

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
    <>
      <div className={className}>
        <TextAreaWithLabel
          className='seedInput'
          isError={!!error}
          isFocused
          label={t<string>('existing 12 or 24-word mnemonic seed')}
          onChange={setSeed}
          rowsCount={2}
          value={seed || ''}
        />
        {!!error && !seed && (
          <Warning
            className='seedError'
            isBelowInput
            isDanger
          >
            {t<string>('Mnemonic needs to contain 12, 15, 18, 21, 24 words')}
          </Warning>
        )}
        <Dropdown
          className='genesisSelection'
          label={t<string>('Network')}
          onChange={setGenesis}
          options={genesisOptions}
          value={genesis}
        />
        {!!error && !!seed && (
          <Warning
            isDanger
          >
            {error}
          </Warning>
        )}
      </div>
      <VerticalSpace />
      <ButtonArea>
        <NextStepButton
          isDisabled={!address || !!error}
          onClick={onNextStep}
        >
          {t<string>('Next')}
        </NextStepButton>
      </ButtonArea>
    </>
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

  .genesisSelection {
    margin-bottom: ${theme.fontSize};
  }

  .seedInput {
    margin-bottom: ${theme.fontSize};
    textarea {
      height: unset;
    }
  }

  .seedError {
    margin-bottom: 1rem;
  }
`);
