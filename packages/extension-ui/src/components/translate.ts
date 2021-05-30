// Copyright 2021 @earthwallet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useTranslation as useTranslationBase, UseTranslationResponse, withTranslation } from 'react-i18next';

export function useTranslation (): UseTranslationResponse<string> {
  return useTranslationBase();
}

export default withTranslation();
