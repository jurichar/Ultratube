import i18next from 'i18next';
import translationFr from './locales/fr/translations.json';
import translationEn from './locales/en/translations.json';
import translationEs from './locales/es/translations.json';
import translationDe from './locales/de/translations.json';
import translationIt from './locales/it/translations.json';
import translationJp from './locales/jp/translations.json';
import translationRu from './locales/ru/translations.json';

import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: translationEn,
  },
  fr: {
    translation: translationFr,
  },
  es: {
    translation: translationEs,
  },
  de: {
    translation: translationDe,
  },
  it: {
    translation: translationIt,
  },
  jp: {
    translation: translationJp,
  },
  ru: {
    translation: translationRu,
  },
};

i18next.use(initReactI18next).init({
  resources,
  lng: 'en', // default language
});

export default i18next;
