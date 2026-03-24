'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Import translation files
import bgTranslations from '@/data/translations/bg.json';
import enTranslations from '@/data/translations/en.json';
import ruTranslations from '@/data/translations/ru.json';

export type Language = 'bg' | 'en' | 'ru';

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  translations: Record<string, any>;
}

const translations = {
  bg: bgTranslations,
  en: enTranslations,
  ru: ruTranslations,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('bg'); // Bulgarian by default

  // Load language preference from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred-language') as Language;
    if (savedLanguage && ['bg', 'en', 'ru'].includes(savedLanguage)) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  // Save language preference to localStorage when it changes
  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);
    localStorage.setItem('preferred-language', language);
  };

  // Translation function with nested key support and parameter interpolation
  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let value: any = translations[currentLanguage];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English if key not found in current language
        value = translations['en'];
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            // If not found in English either, return the key itself
            console.warn(`Translation key "${key}" not found`);
            return key;
          }
        }
        break;
      }
    }

    if (typeof value !== 'string') {
      console.warn(`Translation key "${key}" does not resolve to a string`);
      return key;
    }

    // Handle parameter interpolation
    if (params) {
      return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
        return params[paramKey]?.toString() || match;
      });
    }

    return value;
  };

  const value: LanguageContextType = {
    currentLanguage,
    setLanguage,
    t,
    translations: translations[currentLanguage],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Utility function to get language flag
export function getLanguageFlag(language: Language): string {
  const flags = {
    bg: '🇧🇬',
    en: '🇬🇧',
    ru: '🇷🇺',
  };
  return flags[language] || '🌐';
}

// Utility function to get language name in its own language
export function getLanguageName(language: Language): string {
  const names = {
    bg: 'Български',
    en: 'English',
    ru: 'Русский',
  };
  return names[language] || language;
}
