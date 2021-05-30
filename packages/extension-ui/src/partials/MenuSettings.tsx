// Copyright 2021 @earthwallet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ThemeProps } from '../types';

import { faExpand, faTasks } from '@fortawesome/free-solid-svg-icons';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';

import settings from '@polkadot/ui-settings';

import { ActionContext, ActionText, Checkbox, Menu, MenuDivider, MenuItem, Svg } from '../components';
import useIsPopup from '../hooks/useIsPopup';
import useTranslation from '../hooks/useTranslation';
import { windowOpen } from '../messaging';

interface Props extends ThemeProps {
  className?: string;
  reference: React.MutableRefObject<null>;
}

function MenuSettings ({ className, reference }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [camera, setCamera] = useState(settings.camera === 'on');
  const isPopup = useIsPopup();
  const onAction = useContext(ActionContext);

  useEffect(() => {
    settings.set({ camera: camera ? 'on' : 'off' });
  }, [camera]);

  const _onWindowOpen = useCallback(
    () => windowOpen('/'),
    []
  );

  const _goToAuthList = useCallback(
    () => {
      onAction('auth-list');
    }, [onAction]
  );

  return (
    <Menu
      className={className}
      reference={reference}
    >
      <MenuItem className='setting'>
        <ActionText
          className='manageWebsiteAccess'
          icon={faTasks}
          onClick={_goToAuthList}
          text={t<string>('Manage Website Access')}
        />
      </MenuItem>
      <MenuDivider/>
      <MenuItem
        className='setting'
        title={t<string>('External accounts and Access')}
      >
        <Checkbox
          checked={camera}
          className='checkbox camera'
          label={t<string>('Allow QR Camera Access')}
          onChange={setCamera}
        />
      </MenuItem>
      {isPopup && (
        <>
          <MenuDivider />
          <MenuItem className='setting'>
            <ActionText
              className='openWindow'
              icon={faExpand}
              onClick={_onWindowOpen}
              text={t<string>('Open extension in new window')}
            />
          </MenuItem>
        </>
      )}
    </Menu>
  );
}

export default React.memo(styled(MenuSettings)(({ theme }: Props) => `
  margin-top: 50px;
  right: 24px;
  user-select: none;

  .openWindow, .manageWebsiteAccess{
    span {
      color: ${theme.textColor};
      font-size: ${theme.fontSize};
      line-height: ${theme.lineHeight};
      text-decoration: none;
      vertical-align: middle;
    }

    ${Svg} {
      background: ${theme.textColor};
      height: 20px;
      top: 4px;
      width: 20px;
    }
  }

  > .setting {
    > .checkbox {
      color: ${theme.textColor};
      line-height: 20px;
      font-size: ${theme.fontSize};
      margin-bottom: 0;

      &.ledger {
        margin-top: 0.2rem;
      }

      label {
        color: ${theme.textColor};
      }
    }

    > .dropdown {
      background: ${theme.background};
      margin-bottom: 0;
      margin-top: 9px;
      margin-right: 0;
      width: 100%;
    }
  }
`));
