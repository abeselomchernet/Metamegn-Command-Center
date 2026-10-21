import React, { createContext, useContext, useState, useEffect } from 'react';
import { Locale, Translations } from './types';
import { enTranslations } from './en';
import { amTranslations } from './am';
import { omTranslations } from './om';

interface I18nContextType {
  locale: Locale;
  setLocale: (loc: Locale) => void;
  t: Translations;
}

const dictionaries: Record<Locale, Translations> = {
  en: enTranslations,
  am: amTranslations,
  om: omTranslations,
};

const I18nContext = createContext<I18nContextType>({
  locale: 'en',
  setLocale: () => {},
  t: enTranslations,
});

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('metamegn_locale');
      if (saved === 'en' || saved === 'am' || saved === 'om') {
        setLocaleState(saved);
      }
    } catch {
      // ignore
    }
  }, []);

  const setLocale = (newLoc: Locale) => {
    setLocaleState(newLoc);
    try {
      localStorage.setItem('metamegn_locale', newLoc);
    } catch {
      // ignore
    }
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t: dictionaries[locale] }}>
      <div className={locale === 'am' ? 'font-ethiopic' : 'font-sans'}>
        {children}
      </div>
    </I18nContext.Provider>
  );
};

export const useTranslation = () => useContext(I18nContext);
