// Copyright 2021 @earthwallet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ThemeProps } from '../types';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

import { InputWithLabel, ValidatedInput } from '../components';
import useTranslation from '../hooks/useTranslation';
import { allOf, isNotShorterThan, isSameAs, Validator } from '../util/validators';

interface Props {
  className?: string;
  isFocussed?: boolean;
  onChange: (password: string | null) => void;
}

const MIN_LENGTH = 6;

function Password ({ className, isFocussed, onChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [pass1, setPass1] = useState<string | null>(null);
  const [pass2, setPass2] = useState<string | null>(null);
  const isFirstPasswordValid = useMemo(() => isNotShorterThan(MIN_LENGTH, t<string>('Password is too short')), [t]);
  const isSecondPasswordValid = useCallback((firstPassword: string): Validator<string> => allOf(
    isNotShorterThan(MIN_LENGTH, t<string>('Password is too short')),
    isSameAs(firstPassword, t<string>('Passwords do not match'))
  ), [t]);

  useEffect((): void => {
    onChange(pass1 && pass2 ? pass1 : null);
  }, [onChange, pass1, pass2]);

  return (
    <>
      <ValidatedInput
        className={className}
        component={InputWithLabel}
        data-input-password
        isFocused={isFocussed}
        label={t<string>('A new password for this account')}
        onValidatedChange={setPass1}
        placeholder={'REQUIRED'}
        type='password'
        validator={isFirstPasswordValid}
      />
      {pass1 && (
        <ValidatedInput
          className={className}
          component={InputWithLabel}
          data-input-repeat-password
          label={t<string>('Repeat password for verification')}
          onValidatedChange={setPass2}
          placeholder="REQUIRED"
          type='password'
          validator={isSecondPasswordValid(pass1)}
        />
      )}
    </>
  );
}

export default styled(Password)(({ theme }: ThemeProps) => `
padding: 0 24px; 
`);
