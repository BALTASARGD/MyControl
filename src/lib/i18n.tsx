'use client';

import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';
import es from '@/locales/es.json';
import en from '@/locales/en.json';
import de from '@/locales/de.json';

type Locale = 'es' | 'en' | 'de';

const translations: Record<Locale, any> = { es, en, de };

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Helper function to get nested keys
const getNestedValue = (obj: any, key: string) => {
  return key.split('.').reduce((acc, part) => acc && acc[part], obj);
};

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('es');

  const t = useMemo(() => (key: string) => {
    return getNestedValue(translations[locale], key) || key;
  }, [locale]);

  const value = { locale, setLocale, t };

  return (
    <I18nContext.Provider value={value}>
        {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
