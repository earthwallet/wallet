// Copyright 2021 @earthwallet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ThemeProps } from '../../types';

import { AuthUrlInfo } from '@earthwallet/extension-base/background/handlers/State';
import { Switch } from '@earthwallet/extension-ui/components';
import React, { useCallback } from 'react';
import styled from 'styled-components';

import useTranslation from '../../hooks/useTranslation';

interface Props extends ThemeProps {
  className?: string;
  info: AuthUrlInfo;
  toggleAuth: (url: string) => void
  url: string;
}

function WebsiteEntry ({ className = '', info, toggleAuth, url }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const switchAccess = useCallback(() => {
    toggleAuth(url);
  }, [toggleAuth, url]);

  return (
    <div className={`${className} ${info.isAllowed ? 'allowed' : 'denied'}`}>
      <div className='url'>
        {url}
      </div>
      <Switch
        checked={info.isAllowed}
        checkedLabel={t<string>('allowed')}
        className='info'
        onChange={switchAccess}
        uncheckedLabel={t<string>('denied')}
      />
    </div>
  );
}

export default styled(WebsiteEntry)(({ theme }: Props) => `
  display: flex;
  align-items: center;

  .url{
    flex: 1;
  }

  &.denied {
    .slider::before {
        background-color: ${theme.backButtonBackground};
      }
  }
`);
