// Copyright 2021 @earthwallet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ThemeProps } from '../types';

import { toSvg } from 'jdenticon';
import React from 'react';
import styled from 'styled-components';

interface Props {
  className?: string;
  isExternal?: boolean | null;
  onCopy?: () => void;
  prefix?: number;
  value?: string | null;
}

function Identicon({ className, value }: Props): React.ReactElement<Props> {
  const blob = new Blob([toSvg(value, 100)], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);

  return (
    <div className={className}>
      <img
        className='icon'
        src={url}
      />
    </div>
  );
}

export default styled(Identicon)(({ theme }: ThemeProps) => `
  background: rgba(192, 192, 292, 0.25);
  display: flex;
  justify-content: center;

  .container:before {
    box-shadow: none;
    background: ${theme.identiconBackground};
  }

  .icon {
      height: 64px;
      width: 64px;
  }
`);
