// Copyright 2021 @earthwallet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ThemeProps } from '../types';

import React from 'react';
import styled from 'styled-components';

interface Props {
  children: React.ReactNode;
  className?: string;
  label: string;
}

function Label ({ children, className, label }: Props): React.ReactElement<Props> {
  return (
    <div className={className}>
      { label !== '' && <label>{label}</label>}
      {children}
    </div>
  );
}

export default styled(Label)(({ theme }: ThemeProps) => `
  color: ${theme.textColor};

  label {
    font-size: ${theme.inputLabelFontSize};
    line-height: 14px;
    letter-spacing: 0.04em;
    margin-bottom: 12px;
    text-transform: uppercase;
    font-family: "DM Sans";
    font-style: normal;
    font-weight: 700;
    font-size: 12px;
    line-height: 150%;
    letter-spacing: 0.05em;
    color: #dbe4f2; //#dbe4f2
    margin-bottom: 10px;
    text-transform: uppercase;
    margin: 25px 0 10px 0;
    display: block;
  }
`);
