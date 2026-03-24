'use client';

import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LanguageTabsProps {
  activeLanguage: 'bg' | 'en' | 'ru';
  onLanguageChange: (language: 'bg' | 'en' | 'ru') => void;
  className?: string;
}

export function LanguageTabs({
  activeLanguage,
  onLanguageChange,
  className
}: LanguageTabsProps) {
  return (
    <div className={cn("flex space-x-2 mb-4", className)}>
      <button
        type="button"
        onClick={() => onLanguageChange('bg')}
        className={cn(
          "flex items-center justify-center w-10 h-7 rounded border",
          activeLanguage === 'bg' 
            ? "border-gray-900 dark:border-gray-50 shadow-sm" 
            : "border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900"
        )}
        title="Bulgarian"
      >
        <Image
          src="/images/flags/bg.svg"
          alt="Bulgarian"
          width={20}
          height={15}
          className="rounded-sm"
        />
      </button>
      <button
        type="button"
        onClick={() => onLanguageChange('en')}
        className={cn(
          "flex items-center justify-center w-10 h-7 rounded border",
          activeLanguage === 'en' 
            ? "border-gray-900 dark:border-gray-50 shadow-sm" 
            : "border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900"
        )}
        title="English"
      >
        <Image
          src="/images/flags/gb.svg"
          alt="English"
          width={20}
          height={15}
          className="rounded-sm"
        />
      </button>
      <button
        type="button"
        onClick={() => onLanguageChange('ru')}
        className={cn(
          "flex items-center justify-center w-10 h-7 rounded border",
          activeLanguage === 'ru' 
            ? "border-gray-900 dark:border-gray-50 shadow-sm" 
            : "border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900"
        )}
        title="Russian"
      >
        <Image
          src="/images/flags/ru.svg"
          alt="Russian"
          width={20}
          height={15}
          className="rounded-sm"
        />
      </button>
    </div>
  );
}