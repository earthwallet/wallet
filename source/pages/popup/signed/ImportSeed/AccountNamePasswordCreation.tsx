// Copyright 2021 @earthwallet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useState } from 'react';
import Name from '~components/Name';
import Password from '~components/Password';
import NextStepButton from '~components/NextStepButton';

interface Props {
  buttonLabel: string;
  isBusy: boolean;
  onBackClick: () => void;
  onCreate: (name: string, password: string) => void | Promise<void | boolean>;
  onNameChange: (name: string) => void;
}

function AccountNamePasswordCreation ({ buttonLabel, isBusy, onCreate, onNameChange }: Props): React.ReactElement<Props> {
  const [name, setName] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);

  const _onCreate = useCallback(
    () => name && password && onCreate(name, password),
    [name, password, onCreate]
  );

  const _onNameChange = useCallback(
    (name: string | null) => {
      onNameChange(name || '');
      setName(name);
    },
    [onNameChange]
  );

  return (
    <>
      <Name
        isFocused
        onChange={_onNameChange}
      />
      <Password onChange={setPassword} />
      <div style={{ padding: '0 27px',
        marginBottom: 30,
        position: 'absolute',
        bottom: 0,
        left: 0 }}>
        <NextStepButton
          data-button-action='add new root'
          disabled={!password || !name}
          loading={isBusy}
          onClick={_onCreate}
        >
          {buttonLabel}
        </NextStepButton>
      </div>

    </>
  );
}

export default React.memo(AccountNamePasswordCreation);
