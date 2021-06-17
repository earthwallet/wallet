// Copyright 2021 @earthwallet/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

const darkTheme = {
  accountBackground: '#000',
  accountDotsIconColor: '#8E8E8E',
  addAccountImageBackground: '#1A1B20',
  backButtonBackground: '#3A3B41',
  backButtonBackgroundHover: '#3a3b41ad',
  backButtonTextColor: '#FFFFFF',
  background: '#040A0E',
  bodyColor: '#000',
  borderRadius: '4px',
  boxBorderColor: '#303030',
  boxMargin: '0.75rem 0',
  boxPadding: '0 0.25rem',
  boxShadow: 'rgba(0, 0, 0, 0.86)',
  buttonBackground: '#2496FF',
  buttonBackgroundDanger: '#AF1111',
  buttonBackgroundDangerHover: '#D93B3B',
  buttonBackgroundHover: '#1B63A6',
  buttonTextColor: '#FFFFFF',
  errorBorderColor: '#7E3530',
  errorColor: '#E42F2F',
  fontFamily: 'Poppins, sans-serif',
  fontFamilyMono: 'DM Mono, monospace',
  fontSize: '14px',
  highlightedAreaBackground: '#212226',
  iconDangerColor: '#AF1111',
  iconNeutralColor: '#8E8E8E',
  iconWarningColor: '#2496FF',
  id: 'dark',
  identiconBackground: '#F4F5F8',
  inputBackground: '#111218',
  inputBorderColor: '#43444B',
  inputLabelFontSize: '10px',
  labelColor: '#9F9E99',
  labelFontSize: '13px',
  labelLineHeight: '18px',
  lineHeight: '26px',
  parentLabelColor: '#4A7463',
  popupBackground: '#38393FEE',
  primaryColor: '#2496FF',
  readonlyInputBackground: '#1A1B20',
  subTextColor: '#DDD',
  textColor: '#FFFFFF',
  textColorDanger: '#FF8686',
  tokenLogoBackground: '#FFFFFF',
  moonLightGrey: '#FAFBFB',
  usdBalance: '#7f8284'

};

export declare type Theme = typeof darkTheme;

export const themes = {
  dark: darkTheme,
  light: darkTheme
};

export declare type AvailableThemes = keyof typeof themes;

export function chooseTheme(): AvailableThemes {
  const preferredTheme = localStorage.getItem('theme');

  if (preferredTheme) {
    return preferredTheme === 'dark' ? 'dark' : 'light';
  }

  return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}
