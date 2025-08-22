'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

import bgTranslations from '@/data/translations/bg.json';
import enTranslations from '@/data/translations/en.json';
import ruTranslations from '@/data/translations/ru.json';

export type Language = 'bg' | 'en' | 'ru';

type LanguageContextType = {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  getLocalizedText: (textObj: any) => string;
  translations: Record<string, any>;
};

const ALL_TRANSLATIONS = {
  bg: bgTranslations,
  en: enTranslations,
  ru: ruTranslations,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('bg');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('preferred-language') as Language | null;
      if (saved && (['bg', 'en', 'ru'] as Language[]).includes(saved)) {
        setCurrentLanguage(saved);
      }
    } catch {}
  }, []);

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);
    try {
      localStorage.setItem('preferred-language', language);
    } catch {}
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: any = ALL_TRANSLATIONS[currentLanguage];
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        value = ALL_TRANSLATIONS['en'];
        for (const fk of keys) {
          if (value && typeof value === 'object' && fk in value) {
            value = value[fk];
          } else {
            return key;
          }
        }
        break;
      }
    }
    if (typeof value !== 'string') return key;
    if (params) {
      return value.replace(/\{(\w+)\}/g, (m, p1) => (params[p1]?.toString() ?? m));
    }
    return value;
  };

  const getLocalizedText = (textObj: any): string => {
    if (!textObj) return '';
    return (
      textObj[currentLanguage] || textObj.en || textObj.bg || textObj.ru || ''
    );
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        t,
        getLocalizedText,
        translations: ALL_TRANSLATIONS[currentLanguage],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
}


