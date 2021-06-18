// Copyright 2021 @earthwallet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ThemeProps } from '../types';

import React, { useCallback, useContext } from 'react';
import styled from 'styled-components';

import { ActionContext, ActionText } from '../components';
import Header from './Header';

interface Props extends ThemeProps {
  className?: string;
  step: number;
  text: string;
}

function HeaderWithSteps ({ className, step, text }: Props): React.ReactElement<Props> {
  const onAction = useContext(ActionContext);
 
  return (
    <Header
      type={'wallet'}
      className={className}
      text={text}
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
