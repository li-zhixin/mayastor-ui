import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { resources } from './resources';

export const supportedLanguages = ['en', 'zh-CN'] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];

const LANGUAGE_STORAGE_KEY = 'mayastor-ui-language';

function normalizeLanguage(language: string | null | undefined): SupportedLanguage {
  if (!language) return 'en';

  const normalized = language.toLowerCase();
  if (normalized.startsWith('zh')) {
    return 'zh-CN';
  }

  return 'en';
}

function getInitialLanguage(): SupportedLanguage {
  if (typeof window === 'undefined') {
    return 'en';
  }

  const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (storedLanguage) {
    return normalizeLanguage(storedLanguage);
  }

  return normalizeLanguage(window.navigator.language);
}

void i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getInitialLanguage(),
    fallbackLng: 'en',
    supportedLngs: supportedLanguages,
    load: 'currentOnly',
    interpolation: {
      escapeValue: false,
    },
  });

i18n.on('languageChanged', (language) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, normalizeLanguage(language));
});

export default i18n;
