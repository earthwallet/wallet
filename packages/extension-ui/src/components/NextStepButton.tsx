// Copyright 2021 @earthwallet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import type { ThemeProps } from '../types';

import React from 'react';
import styled from 'styled-components';
import { ClipLoader } from "react-spinners";

import Button from './Button';

type Props = React.ComponentProps<typeof Button>;

function NextStepButton ({ children, ...props }: Props): React.ReactElement<Props> {
  return (
    <div className={props.className}>
      <div
        className={(props.isDisabled ? 'buttonDisabledCont' : props.loading ? 'buttonCont buttonContLoading' : 'buttonCont') }
        onClick={props.onClick}
      >
        <div className={props.isDisabled ? 'buttonDisabled' :  'button'} >
          {props.loading ? <ClipLoader size={15} color={'#fffff'} />
        : children }
        </div>
      </div>
    </div>
  );
}

export default styled(NextStepButton)(({ theme }: ThemeProps) => `

.buttonCont{
  width: 317px;
    height: 56px;
    filter: drop-shadow(0px 0px 30px rgba(8, 52, 137, 0.8));
  
    background: linear-gradient(0deg, #297dc9 0%, #6ca9e2 100%);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    cursor: pointer;
    /* identical to box height */
  
    text-align: center;

    &:active {
      opacity: 0.7;
    }
}
    
  .buttonDisabledCont {
    pointer-events: none;
    width: 317px;
    height: 56px;
    filter: drop-shadow(0px 0px 30px rgba(8, 52, 137, 0.8));
  
    background: linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 100%);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    user-select: none;
    /* identical to box height */
  
    text-align: center;
  }

  .button { 
    width: 313px;
    height: 52px;
    background: linear-gradient(101.54deg, #2496FF 10.81%, #1B63A6 139.52%);
    border-radius: 6px;
    line-height: 52px;
    box-shadow: inset 0px 0px 30px rgba(35, 110, 255, 0.5);

    /* Brand / Moonlight Grey / 20% */
    text-shadow: 0px 2px 3px rgba(8, 52, 137, 0.2);

    color: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
   }

  .buttonDisabled {
    width: 313px;
    height: 52px;
    pointer-events: none;
    background: #000000;
    border-radius: 6px;
    line-height: 52px;
    box-shadow: inset 0px 0px 30px rgba(35, 110, 255, 0.5);

    /* Brand / Moonlight Grey / 20% */
    text-shadow: 0px 2px 3px rgba(8, 52, 137, 0.8);

    color: #fafbfb4d;
    cursor: no-drop;

  }
  
  .buttonContLoading {
    opacity: 0.7;
    pointer-events: none;
    }
   
`);
