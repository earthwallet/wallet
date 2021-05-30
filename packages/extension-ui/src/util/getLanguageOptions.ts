// Copyright 2021 @earthwallet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

interface Option {
  info?: string;
  isDisabled?: boolean;
  isHeader?: boolean;
  text: React.ReactNode;
  value: string | number;
}

export default function getLanguageOptions (): Option[] {
  return [
    // default/native
    {
      text: 'English',
      value: 'en'
    },
    {
      text: '汉语',
      value: 'zh'
    },
    {
      text: 'Français',
      value: 'fr'
    },
    {
      text: 'Türkce',
      value: 'tr'
    }
  ];
}
