// Copyright 2021 @earthwallet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback } from 'react';

import Label from './Label';
import { TextArea } from './TextInputs';

interface Props {
  className?: string;
  isError?: boolean;
  isFocused?: boolean;
  isReadOnly?: boolean;
  rowsCount?: number;
  label: string;
  onChange?: (value: string) => void;
  value?: string;
  placeholder?: string;
}

export default function TextAreaWithLabel ({ className, isError, isFocused, isReadOnly, label, onChange, placeholder, rowsCount, value }: Props): React.ReactElement<Props> {
  const _onChange = useCallback(
    ({ target: { value } }: React.ChangeEvent<HTMLTextAreaElement>): void => {
      onChange && onChange(value);
    },
    [onChange]
  );

  return (
    <Label
      className={className}
      label={label}
    >
      <TextArea
        autoCapitalize='off'
        autoCorrect='off'
        autoFocus={isFocused}
        onChange={_onChange}
        placeholder={placeholder}
        readOnly={isReadOnly}
        rows={rowsCount || 2}
        spellCheck={false}
        value={value}
        withError={isError}

      />
    </Label>
  );
}
