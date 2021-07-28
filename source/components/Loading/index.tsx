// Copyright 2021 @earthwallet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';


interface Props {
  children?: React.ReactNode;
}

export default function Loading ({ children }: Props): React.ReactElement<Props> {

  if (!children) {
    return (
      <div>{'... loading ...'}</div>
    );
  }

  return (
    <>{children}</>
  );
}
