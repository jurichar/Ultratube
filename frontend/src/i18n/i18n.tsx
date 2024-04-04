import i18next from 'i18next';
import translationFr from './locales/fr/translations.json';
import translationEn from './locales/en/translations.json';
import translationEs from './locales/es/translations.json';

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
};

i18next.use(initReactI18next).init({
  resources,
  lng: 'en', // default language
});

export default i18next;
