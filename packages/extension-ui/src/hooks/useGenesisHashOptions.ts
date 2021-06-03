// Copyright 2021 @earthwallet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useEffect, useMemo, useState } from 'react';

import { getAllMetadata } from '../messaging';
import chains from '../util/chains';

interface Option {
  text: string;
  value: string;
}

const RELAY_CHAIN = 'Relay Chain';

export default function(): Option[] {
  const [metadataChains, setMetadataChains] = useState<Option[]>([]);

  useEffect(() => {
    getAllMetadata()
      .then((metadataDefs) => {
        const res = metadataDefs.map((metadata) => ({ text: metadata.chain, value: metadata.genesisHash }));

        setMetadataChains(res);
      })
      .catch(console.error);
  }, []);

  console.log('chains', chains);

  const hashes = useMemo(
    () => [
      // put the relay chains at the top
      ...chains
        .filter(({ chain }) => chain.includes(RELAY_CHAIN))
        .map(({ chain, genesisHash }) => ({
          text: chain,
          value: genesisHash
        })),
      ...chains
        .map(({ chain, genesisHash }) => ({
          text: chain,
          value: genesisHash
        }))
        // remove the relay chains, they are at the top already
        .filter(({ text }) => !text.includes(RELAY_CHAIN))
        .concat(
          // get any chain present in the metadata and not already part of chains
          ...metadataChains.filter(({ value }) => {
            return !chains.find(({ genesisHash }) => genesisHash === value);
          })
        )
        .sort((a, b) => a.text.localeCompare(b.text))
    ],
    [metadataChains]
  );

  return hashes;
}
