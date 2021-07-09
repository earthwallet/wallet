// Copyright 2021 @earthwallet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Call, ExtrinsicEra, ExtrinsicPayload } from '@polkadot/types/interfaces';
import type { AnyJson, SignerPayloadJSON } from '@polkadot/types/types';

import { TFunction } from 'i18next';
import React, { useMemo, useRef } from 'react';

import { bnToBn, formatNumber } from '@polkadot/util';

import { Table } from '../../components';
import useTranslation from '../../hooks/useTranslation';

interface Decoded {
  args: AnyJson | null;
  method: Call | null;
}

interface Props {
  className?: string;
  payload: ExtrinsicPayload;
  request: SignerPayloadJSON;
  url: string;
}

function renderMethod (data: string, { args, method }: Decoded, t: TFunction): React.ReactNode {
  if (!args || !method) {
    return (
      <tr>
        <td className='label'>{t<string>('method data')}</td>
        <td className='data'>{data}</td>
      </tr>
    );
  }

  return (
    <>
      <tr>
        <td className='label'>{t<string>('method')}</td>
        <td className='data'>
          <details>
            <summary>{method.section}.{method.method}{
              method.meta
                ? `(${method.meta.args.map(({ name }) => name).join(', ')})`
                : ''
            }</summary>
            <pre>{JSON.stringify(args, null, 2)}</pre>
          </details>
        </td>
      </tr>
      {method.meta && (
        <tr>
          <td className='label'>{t<string>('info')}</td>
          <td className='data'>
            <details>
              <summary>{method.meta.documentation.map((d) => d.toString().trim()).join(' ')}</summary>
            </details>
          </td>
        </tr>
      )}
    </>
  );
}

function mortalityAsString (era: ExtrinsicEra, hexBlockNumber: string, t: TFunction): string {
  if (era.isImmortalEra) {
    return t<string>('immortal');
  }

  const blockNumber = bnToBn(hexBlockNumber);
  const mortal = era.asMortalEra;

  return t<string>('mortal, valid from {{birth}} to {{death}}', {
    replace: {
      birth: formatNumber(mortal.birth(blockNumber)),
      death: formatNumber(mortal.death(blockNumber))
    }
  });
}

function Extrinsic ({ className, payload: { era, nonce, tip }, request: { blockNumber, genesisHash, method, specVersion: hexSpec }, url }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const specVersion = useRef(bnToBn(hexSpec)).current;
  const decoded = useMemo(
    () => ({ args: null, method: null }),
    []
  );

  return (
    <Table
      className={className}
      isFull
    >
      <tr>
        <td className='label'>{t<string>('from')}</td>
        <td className='data'>{url}</td>
      </tr>
      <tr>
        <td className='label'>{t<string>('version')}</td>
        <td className='data'>{specVersion.toNumber()}</td>
      </tr>
      <tr>
        <td className='label'>{t<string>('nonce')}</td>
        <td className='data'>{formatNumber(nonce)}</td>
      </tr>
      {!tip.isEmpty && (
        <tr>
          <td className='label'>{t<string>('tip')}</td>
          <td className='data'>{formatNumber(tip)}</td>
        </tr>
      )}
      {renderMethod(method, decoded, t)}
      <tr>
        <td className='label'>{t<string>('lifetime')}</td>
        <td className='data'>{mortalityAsString(era, blockNumber, t)}</td>
      </tr>
    </Table>
  );
}

export default React.memo(Extrinsic);
