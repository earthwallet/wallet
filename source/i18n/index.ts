import { I18n, Scope, TranslateOptions } from 'i18n-js';

import en from './en';

//https://github.com/ladjs/i18n-locales

const translations = {
  en: en,
};

export const translationsLabels = {
  ar: 'Arabic | العربية',
  bn: 'Bengali | বাংলা',
  en: 'English',
  es: 'Spanish | español',
  fr: 'French | français',
  hi: 'Hindi | हिंदी',
  mr: 'Marathi | मराठी',
  ru: 'Russian | русский',
  sw: 'Kiswahili',
  ta: 'Tamil:தமிழ்',
  te: 'Telugu | తెలుగు',
  th: 'Thai | ไทย',
  ur: 'Urdu | اُردو',
  vi: 'Vietnamese | tiếng Việt',
  zh: 'Chinese | 中文',
};

const i18n = new I18n(translations);

//The translation will fall back to the defaultValue translation
i18n.defaultLocale = 'en';

i18n.missingBehavior = 'guess';
if (chrome && chrome.i18n && chrome.i18n.getUILanguage())
  i18n.locale = chrome.i18n
    .getUILanguage()
    ?.substring(0, 2)
    .toLocaleLowerCase();

console.log(chrome.i18n.getUILanguage(), 'chrome.i18n.getUILanguage()');
i18n.enableFallback = true;

export const i18nT = (value: Scope, param?: TranslateOptions) =>
  i18n.t(value, param);

export default i18n;
