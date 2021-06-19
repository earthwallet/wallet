// Copyright 2021 @earthwallet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import type { ThemeProps } from '../types';

import React from 'react';
import styled from 'styled-components';

import Header from './Header';

interface Props extends ThemeProps {
  className?: string;
  step: number;
  text: string;
  backOverride?: any;
}

function HeaderWithSteps ({ backOverride, className, step, text }: Props): React.ReactElement<Props> {
  // const onAction = useContext(ActionContext);

  return (
    <Header
      backOverride={backOverride}
      className={className}
      text={text}
      type={'wallet'}
    >
      <div className='steps'>
        <div>
          <span className='current'>{step}</span>
          <span className='total'>/2</span>
        </div>

      </div>
    </Header>
  );
}

export default React.memo(styled(HeaderWithSteps)(({ theme }: Props) => `
  .current {
    font-size: ${theme.labelFontSize};
    line-height: ${theme.labelLineHeight};
    color: ${theme.primaryColor};
    margin-right: 6px;
  }

  .total {
    letter-spacing: 6px;
  }

  .steps {
    align-items: center;
    display: flex;
    justify-content: flex-end;
    flex-grow: 1;
    padding-left: 1em;
    margin-top: 3px;
  }

  .total {
    font-size: ${theme.labelFontSize};
    line-height: ${theme.labelLineHeight};
    color: ${theme.textColor};
  }
`));
