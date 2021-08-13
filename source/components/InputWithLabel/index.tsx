import React, { useCallback, useState } from 'react';

import Label from './Label';
import { Input } from './TextInputs';
import Warning from '../Warning';
import styles from './index.scss';
import clsx from 'clsx';

export interface Props {
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

function InputWithLabel({
  className,
  defaultValue,
  disabled,
  isError,
  isFocused,
  isReadOnly,
  label = '',
  onBlur,
  onChange,
  onEnter,
  placeholder,
  type = 'text',
  value,
  withoutMargin,
}: Props): React.ReactElement<Props> {
  const [isCapsLock, setIsCapsLock] = useState(false);

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
      className={clsx(
        className,
        withoutMargin ? styles.withoutMargin : styles.noop,
        styles.labelStyle
      )}
      label={label}
    >
      <div className={styles.inputCont}>
        <Input
          autoCapitalize="off"
          autoCorrect="off"
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
      {isCapsLock && (
        <Warning className={styles.warning} isBelowInput>{'Warning: Caps lock is on'}</Warning>
      )}
    </Label>
  );
}

export default InputWithLabel;
