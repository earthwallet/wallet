// Copyright 2021 @earthwallet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ThemeProps } from '../types';

import React, { useContext } from 'react';
import styled from 'styled-components';

import logo from '../assets/icon.png';
import stars from '../assets/stars.png';
import twinkling from '../assets/twinkling.png';
import { ActionContext, Button } from '../components';
import useTranslation from '../hooks/useTranslation';

interface Props extends ThemeProps {
  className?: string;
}

const Welcome = function ({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const onAction = useContext(ActionContext);

  const _onClick = (): void => {
    window.localStorage.setItem('welcome_read', 'ok');
    onAction();
  };

  return (
    <>

      <div className={className}
      >

        <div className="stars"></div>
        <div className="twinkling"></div>

        <div className='container-div'>
          <div className='welcome-h1-text'>EARTH</div>
          <div className='welcome-h2-text'>Wallet</div>

          <img
            className='welcome-logo'
            src={logo}
          />
          <div className='welcomeInfo'>Connecting you to Earth Wallet and The Internet Computer.</div>
          <Button className='continueButton'
            onClick={_onClick}>{t<string>('Continue')}</Button>
        </div>
      </div>
    </>
  );
};

export default styled(Welcome)(({ theme }: Props) => `
    background-color:'#000';
    height:100%;

  .container-div {
    top:0;
    left:0;
    right:0;
    bottom:0;
    display: flex;
    height: 100%;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    position:absolute;
    z-index:2;
    background-color:'#000';
    padding: 16px 26px;
  }

  .welcome-logo {
    height: 220px;
    width: 220px;
    margin-top: 36px;
    }

  .welcome-h1-text {
    color: ${theme.textColor};
    font-family: ${theme.fontFamily};
    font-size: 68px;
    margin-top: 16px;
    text-align: center;
  }
  
  .welcome-h2-text {
    color: ${theme.textColor};
    font-family: ${theme.fontFamily};
    font-size: 22px;
    margin-top: 16px;
    text-align: center;
  }

  .welcomeInfo {
    color: ${theme.subTextColor};
    font-family: ${theme.fontFamily};
    font-size: ${theme.fontSize};
    margin-bottom: 16px;
    margin-top: 36px;
    text-align: center;
  }
    
    @keyframes move-twink-back {
    from {background-position:0 0;}
    to {background-position:-10000px 5000px;}
    }

    @-webkit-keyframes move-twink-back {
        from {background-position:0 0;}
        to {background-position:-10000px 5000px;}
    }

    @-moz-keyframes move-twink-back {
        from {background-position:0 0;}
        to {background-position:-10000px 5000px;}
    }

    @-ms-keyframes move-twink-back {
        from {background-position:0 0;}
        to {background-position:-10000px 5000px;}
    }

    .stars, .twinkling {
    position:absolute;
    top:0;
    left:0;
    right:0;
    bottom:0;
    width:100%;
    height:100%;
    display:block;
    }

    .stars {
    background: #000 url(${stars}) repeat top center;
    z-index:0;
    }

    .twinkling{
    background:transparent url(${twinkling}) repeat top center;
    z-index:1;

    -moz-animation:move-twink-back 200s linear infinite;
    -ms-animation:move-twink-back 200s linear infinite;
    -o-animation:move-twink-back 200s linear infinite;
    -webkit-animation:move-twink-back 200s linear infinite;
    animation:move-twink-back 200s linear infinite;
    }

`);
