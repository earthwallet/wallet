// Copyright 2021 @earthwallet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ThemeProps } from '../types';

import styled, { css } from 'styled-components';

interface Props extends ThemeProps {
  withError?: boolean;
  type?: string;
}

const TextInput = css(({ theme, type, withError }: Props) => `
  background: #0c3254;
  border-radius: ${theme.borderRadius};
  border: 1px solid #0c3254;
  border-color: ${withError ? theme.errorBorderColor : '#0c3254'};
  box-sizing: border-box;
  color: ${withError ? theme.errorColor : theme.textColor};
  display: block;
  font-family: ${theme.fontFamily};
  font-size: ${theme.fontSize};
  height: 45px;
  outline: none;
  padding: 0.5rem 0.75rem;
  resize: none;
  width: 100%;
  &::placeholder {
    color: #DBE4F2;
    opacity: 0.25;
  }

  &:read-only {
    background: ${theme.readonlyInputBackground};
    box-shadow: none;
    outline: none;
  }
`);

export const TextArea = styled.textarea<Props>`${TextInput}`;
export const Input = styled.input<Props>`${TextInput}`;
