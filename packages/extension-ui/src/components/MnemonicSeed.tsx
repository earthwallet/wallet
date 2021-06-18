// Copyright 2021 @earthwallet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ThemeProps } from '../types';

import { faCopy } from '@fortawesome/free-regular-svg-icons';
import React, { MouseEventHandler } from 'react';
import styled from 'styled-components';

import useTranslation from '../hooks/useTranslation';
import ActionText from './ActionText';
import TextAreaWithLabel from './TextAreaWithLabel';

interface Props {
  seed: string;
  onCopy: MouseEventHandler<HTMLDivElement>;
  className?: string;
}

function MnemonicSeed ({ className, onCopy, seed }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <div className={className}>
      <TextAreaWithLabel
        className='mnemonicDisplay'
        isReadOnly
        label={''}
        value={seed}
      />
      <div className='buttonsRow'>
        <ActionText
          className='copyBtn'
          data-seed-action='copy'
          icon={faCopy}
          onClick={onCopy}
          text={t<string>('Copy to clipboard')}
        />
      </div>
    </div>
  );
}

export default styled(MnemonicSeed)(({ theme }: ThemeProps) => `
  margin-bottom: 21px;

  .buttonsRow {
    display: flex;
    flex-direction: row;

    .copyBtn {
      margin-right: 32px;
      font-size: ${theme.fontSize};
    }
  }

  .mnemonicDisplay {
    textarea {
      color: ${theme.primaryColor};
      font-size: ${theme.fontSize};
      height: unset;
      letter-spacing: -0.01em;
      margin-bottom: 10px;
      padding: 6px;
      background: rgba(36, 150, 255, 0.22);
      backdrop-filter: blur(8px);
      /* Note: backdrop-filter has minimal browser support */

      border-radius: 14px;
    }
  }
`);
