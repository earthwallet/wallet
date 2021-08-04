// Copyright 2021 @earthwallet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';

import useIsMounted from '~hooks/useIsMounted';
import { Result, Validator } from '~utils/validators';
import Warning from '../Warning';
import { Props as InputProps } from '../InputWithLabel';

type Props = {
  className?: string;
  component: React.ComponentType<InputProps>;
  defaultValue?: string;
  onValidatedChange: (value: string | null) => void;
  validator: Validator<string>;
  isError?: boolean;
  value?: string | null;
  onChange?: (value: string) => void;
  isFocussed?: boolean;
  label: string;
  placeholder?: string;
} & InputProps;

const ValidatedInput = ({
  className,
  component: Input,
  defaultValue,
  onValidatedChange,
  validator,
  label,
  ...props
}: Props) => {
  const [value, setValue] = useState(defaultValue || '');
  const [validationResult, setValidationResult] = useState<Result<string>>(
    Result.ok('')
  );
  const isMounted = useIsMounted();

  useEffect(() => {
    if (defaultValue) {
      setValue(defaultValue);
    }
  }, [defaultValue]);

  useEffect(() => {
    // Do not show any error on first mount
    if (!isMounted) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    (async (): Promise<void> => {
      const result = await validator(value);

      setValidationResult(result);
      onValidatedChange(Result.isOk(result) ? value : null);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, validator, onValidatedChange]);

  return (
    <div className={className}>
      <Input
        {...(props as InputProps)}
        isError={Result.isError(validationResult)}
        onChange={setValue}
        value={value}
        label={label}
      />
      {Result.isError(validationResult) && (
        <Warning isBelowInput isDanger>
          {validationResult.error.errorDescription}
        </Warning>
      )}
    </div>
  );
};

export default ValidatedInput;
