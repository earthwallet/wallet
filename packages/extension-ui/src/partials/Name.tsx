// Copyright 2021 @earthwallet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ThemeProps } from '../types';

import React, { useContext, useMemo } from 'react';
import styled from 'styled-components';

import { AccountContext, InputWithLabel, ValidatedInput } from '../components';
import useTranslation from '../hooks/useTranslation';
import { isNotShorterThan } from '../util/validators';

interface Props {
  address?: string;
  className?: string;
  isFocused?: boolean;
  label?: string;
  onBlur?: () => void;
  onChange: (name: string | null) => void;
  value?: string | null;
}

function Name ({ address, className, isFocused, label, onBlur, onChange, value }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { accounts } = useContext(AccountContext);
  const isNameValid = useMemo(() => isNotShorterThan(3, t<string>('Account name is too short')), [t]);

  const account = accounts.find((account) => account.address === address);
  const startValue = value || account?.name;

  return (
    <ValidatedInput
      className={className}
      component={InputWithLabel}
      data-input-name
      defaultValue={startValue}
      isFocused={isFocused}
      label={label || t<string>('A descriptive name for your account')}
      onBlur={onBlur}
      onEnter={onBlur}
      onValidatedChange={onChange}
      placeholder="REQUIRED"
      type='text'
      validator={isNameValid}
    />
  );
}

export default styled(Name)(({ theme }: ThemeProps) => `
   padding: 0 16px; 
   `);
