// Copyright 2021 @earthwallet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useContext } from 'react';

import { ToastContext } from '../components/contexts';

export default function useToast (): {show: (message: string) => void} {
  return useContext(ToastContext);
}
