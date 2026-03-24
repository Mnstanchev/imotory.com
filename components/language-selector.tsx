'use client';

import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useLanguage, Language, getLanguageFlag, getLanguageName } from '@/contexts/language-context';

interface LanguageSelectorProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export function LanguageSelector({ 
  variant = 'outline', 
  size = 'icon',
  className = ''
}: LanguageSelectorProps) {
  const { currentLanguage, setLanguage, t } = useLanguage();

  const languages: Language[] = ['bg', 'en', 'ru'];

  const handleLanguageChange = (language: Language) => {
    setLanguage(language);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant} 
          size={size} 
          className={`border-gray-200 hover:bg-gray-50 text-gray-700 ${className}`}
          aria-label={t('languages.select')}
        >
          <Globe className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="bg-white border border-gray-200 shadow-md"
      >
        {languages.map((language) => (
          <DropdownMenuItem
            key={language}
            onClick={() => handleLanguageChange(language)}
            className={`text-gray-700 hover:bg-gray-50 hover:text-gray-900 cursor-pointer ${
              currentLanguage === language ? 'bg-gray-100 text-gray-900' : ''
            }`}
          >
            <span className="mr-2 text-lg">
              {getLanguageFlag(language)}
            </span>
            <span>{getLanguageName(language)}</span>
            {currentLanguage === language && (
              <span className="ml-auto text-gray-500">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
