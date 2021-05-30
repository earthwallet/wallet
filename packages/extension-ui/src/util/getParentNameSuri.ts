// Copyright 2021 @earthwallet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

export default function (parentName?: string | null, suri?: string): string {
  return `${parentName || ''}  ${suri || ''}`;
}
