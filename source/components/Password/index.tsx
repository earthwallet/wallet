import React, { useCallback, useEffect, useMemo, useState } from 'react';
import InputWithLabel from '../InputWithLabel';
import ValidatedInput from '../ValidatedInput';
import {
  allOf,
  isNotShorterThan,
  isSameAs,
  Validator,
} from '~utils/validators';

interface Props {
  className?: string;
  isFocussed?: boolean;
  onChange: (password: string | null) => void;
}

const MIN_LENGTH = 6;

function Password({
  className,
  isFocussed,
  onChange,
}: Props): React.ReactElement<Props> {
  const [pass1, setPass1] = useState<string | null>(null);
  const [pass2, setPass2] = useState<string | null>(null);
  const isFirstPasswordValid = useMemo(
    () => isNotShorterThan(MIN_LENGTH, 'Password is too short'),
    []
  );
  const isSecondPasswordValid = useCallback(
    (firstPassword: string): Validator<string> =>
      allOf(
        isNotShorterThan(MIN_LENGTH, 'Password is too short'),
        isSameAs(firstPassword, 'Passwords do not match')
      ),
    []
  );

  useEffect((): void => {
    onChange(pass1 && pass2 ? pass1 : null);
  }, [onChange, pass1, pass2]);

  return (
    <>
      <ValidatedInput
        className={className}
        component={InputWithLabel}
        data-input-password
        isFocussed={isFocussed}
        label={'A new password for this account'}
        onValidatedChange={setPass1}
        placeholder={'REQUIRED'}
        type="password"
        validator={isFirstPasswordValid}
      />
      {pass1 && (
        <ValidatedInput
          className={className}
          component={InputWithLabel}
          data-input-repeat-password
          label={'Repeat password for verification'}
          onValidatedChange={setPass2}
          placeholder="REQUIRED"
          type="password"
          validator={isSecondPasswordValid(pass1)}
        />
      )}
    </>
  );
}

export default Password;
