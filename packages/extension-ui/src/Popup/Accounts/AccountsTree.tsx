// Copyright 2021 @earthwallet/extension authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountWithChildren } from '@earthwallet/extension-base/background/types';

import React, { useEffect } from 'react';

import Account from './Account';

interface Props extends AccountWithChildren {
  parentName?: string;
}

export default function AccountsTree({ parentName, suri, ...account }: Props): React.ReactElement<Props> {
  useEffect(() => {
    console.log('account', account);
    console.log('suri', suri);
    console.log('parentName', parentName);
  }, [account, parentName, suri]);

  return (
    <>
      <Account
        {...account}
        parentName={parentName}
        suri={suri}
      />
      {account?.children?.map((child, index) => (
        <AccountsTree
          key={`${index}:${child.address}`}
          {...child}
          parentName={account.name}
        />
      ))}
    </>
  );
}
