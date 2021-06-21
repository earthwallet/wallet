// Copyright 2021 @earthwallet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useState } from 'react';
import styled from 'styled-components';

import useTranslation from '../hooks/useTranslation';
import Label from './Label';
import { Input } from './TextInputs';
import Warning from './Warning';

interface Props {
  className?: string;
  defaultValue?: string | null;
  disabled?: boolean;
  isError?: boolean;
  isFocused?: boolean;
  isReadOnly?: boolean;
  label: string;
  onBlur?: () => void;
  onChange?: (value: string) => void;
  onEnter?: () => void;
  placeholder?: string;
  type?: 'text' | 'password';
  value?: string;
  withoutMargin?: boolean;
}

function InputWithLabel ({ className, defaultValue, disabled, isError, isFocused, isReadOnly, label = '', onBlur, onChange, onEnter, placeholder, type = 'text', value, withoutMargin }: Props): React.ReactElement<Props> {
  const [isCapsLock, setIsCapsLock] = useState(false);
  const { t } = useTranslation();

  const _checkKey = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>): void => {
      onEnter && event.key === 'Enter' && onEnter();

      if (type === 'password') {
        if (event.getModifierState('CapsLock')) {
          setIsCapsLock(true);
        } else {
          setIsCapsLock(false);
        }
      }
    },
    [onEnter, type]
  );

  const _onChange = useCallback(
    ({ target: { value } }: React.ChangeEvent<HTMLInputElement>): void => {
      onChange && onChange(value);
    },
    [onChange]
  );

  return (
    <Label
      className={`${className || ''} ${withoutMargin ? 'withoutMargin' : ''} ' labelStyle'`}
      label={label}
    >
      <div className={'inputCont'}>
        <Input
          autoCapitalize='off'
          autoCorrect='off'
          autoFocus={isFocused}
          defaultValue={defaultValue || undefined}
          disabled={disabled}
          onBlur={onBlur}
          onChange={_onChange}
          onKeyPress={_checkKey}
          placeholder={placeholder}
          readOnly={isReadOnly}
          spellCheck={false}
          type={type}
          value={value}
          withError={isError}
        />
      </div>
      { isCapsLock && (
        <Warning isBelowInput>{t<string>('Warning: Caps lock is on')}</Warning>
      )}
    </Label>
  );
}

export default styled(InputWithLabel)`
  margin-bottom: 16px;
  .inputCont {
    border: 2px solid #175b98;
    border-radius: 8px;
  }

  .labelStyle {

     opacity: 0.65;
     font-family: "DM Sans";
    font-style: normal;
    font-weight: 700;
    font-size: 12px;
    line-height: 150%;
    letter-spacing: 0.05em;
    color: #dbe4f2; //#dbe4f2
    margin-bottom: 10px;
    text-transform: uppercase;

  }
  
  &.withoutMargin {
    margin-bottom: 0px;

   + .danger {
      margin-top: 6px;
    }
  }
`;
