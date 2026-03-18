import { createContext } from 'preact';
import { useCallback, useEffect, useMemo, useState } from 'preact/hooks';
import { messages, SUPPORTED_LANGUAGES } from '../i18n/messages';

const DEFAULT_LANGUAGE = 'vi';
const STORAGE_KEY = 'app:language';

function isSupportedLanguage(lang) {
  return SUPPORTED_LANGUAGES.includes(lang);
}

function getInitialLanguage() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (isSupportedLanguage(stored)) return stored;

  const browserLang = (navigator.language || '').slice(0, 2).toLowerCase();
  if (isSupportedLanguage(browserLang)) return browserLang;

  return DEFAULT_LANGUAGE;
}

function getByPath(source, path) {
  return path.split('.').reduce((value, key) => {
    if (!value || typeof value !== 'object') return undefined;
    return value[key];
  }, source);
}

function interpolate(template, params = {}) {
  return Object.keys(params).reduce(
    (result, key) => result.replaceAll(`{${key}}`, String(params[key])),
    template
  );
}

export const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [language, setLanguage] = useState(getInitialLanguage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
    document.title = messages[language]?.app?.name || messages[DEFAULT_LANGUAGE].app.name;
  }, [language]);

  const t = useCallback(
    (key, params) => {
      const current = getByPath(messages[language], key);
      const fallback = getByPath(messages[DEFAULT_LANGUAGE], key);
      const raw = typeof current === 'string' ? current : typeof fallback === 'string' ? fallback : key;
      return interpolate(raw, params);
    },
    [language]
  );

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === 'vi' ? 'en' : 'vi'));
  }, []);

  const value = useMemo(
    () => ({ language, setLanguage, toggleLanguage, t }),
    [language, toggleLanguage, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

