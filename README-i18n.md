# Internationalization (i18n) System

This document describes the comprehensive internationalization system implemented for the Property Website admin panel.

## Overview

The i18n system supports three languages:
- **Bulgarian (bg)** - Default language
- **English (en)** - Fallback language
- **Russian (ru)**

## Features

- 🌐 **Language Selector**: Globe icon dropdown in admin header
- 🏗️ **Context-based Architecture**: React Context for state management
- 💾 **Persistent Settings**: Language preference stored in localStorage
- 🔄 **Automatic Fallback**: Falls back to English if translation is missing
- 🎯 **Type-safe**: Full TypeScript support with proper typing
- 🎨 **Consistent UI**: Follows monochromatic design system

## File Structure

```
backend/
├── data/
│   └── translations/
│       ├── bg.json      # Bulgarian translations
│       ├── en.json      # English translations
│       └── ru.json      # Russian translations
├── contexts/
│   └── language-context.tsx  # Language context provider
└── components/
    └── language-selector.tsx  # Language dropdown component
```

## Usage

### 1. Using Translations in Components

```tsx
import { useLanguage } from '@/contexts/language-context';

function MyComponent() {
  const { t, currentLanguage } = useLanguage();
  
  return (
    <div>
      <h1>{t('admin.panel')}</h1>
      <p>{t('admin.listings.title')}</p>
      <span>{t('admin.forms.min_length', { count: 5 })}</span>
    </div>
  );
}
```

### 2. Translation Key Structure

Translations use dot notation for nested keys:

```json
{
  "admin": {
    "panel": "Admin Panel",
    "listings": {
      "title": "Listings Management",
      "create": "Create New Listing"
    }
  }
}
```

### 3. Parameter Interpolation

Support for dynamic values in translations:

```tsx
// Translation file
{
  "admin": {
    "forms": {
      "min_length": "Minimum {count} characters"
    }
  }
}

// Component usage
t('admin.forms.min_length', { count: 5 })
// Result: "Minimum 5 characters"
```

## Language Context API

### `useLanguage()` Hook

Returns an object with:

- `currentLanguage: Language` - Current active language ('bg' | 'en' | 'ru')
- `setLanguage: (language: Language) => void` - Function to change language
- `t: (key: string, params?: Record<string, string | number>) => string` - Translation function
- `translations: Record<string, any>` - Current language translations object

### Utility Functions

- `getLanguageFlag(language: Language): string` - Returns flag emoji for language
- `getLanguageName(language: Language): string` - Returns native language name

## Adding New Translations

### 1. Add to Translation Files

Add the new key to all three language files:

```json
// bg.json
{
  "admin": {
    "new_feature": "Нова функция"
  }
}

// en.json
{
  "admin": {
    "new_feature": "New Feature"
  }
}

// ru.json
{
  "admin": {
    "new_feature": "Новая функция"
  }
}
```

### 2. Use in Components

```tsx
function NewComponent() {
  const { t } = useLanguage();
  
  return <h1>{t('admin.new_feature')}</h1>;
}
```

## Language Selector Component

The `LanguageSelector` component provides a dropdown menu with language options:

```tsx
<LanguageSelector 
  variant="outline"     // 'default' | 'outline' | 'ghost'
  size="icon"          // 'default' | 'sm' | 'lg' | 'icon'
  className="custom-styles"
/>
```

## Implementation Details

### Default Language
- **Bulgarian** is set as the default language
- Language preference is stored in `localStorage` as `'preferred-language'`

### Fallback System
- If a translation key is missing in the current language, it falls back to English
- If the key is also missing in English, it returns the key itself
- Console warnings are logged for missing translations in development

### Monochromatic Design
The language selector follows the established monochromatic color palette:

- **Background**: `bg-white` with `border-gray-200`
- **Hover**: `hover:bg-gray-50`
- **Text**: `text-gray-700` / `text-gray-900`
- **Active**: `bg-gray-100`

## Integration

### Root Layout Integration

The `LanguageProvider` is integrated into the app's root layout:

```tsx
// app/layout.tsx
import { LanguageProvider } from '@/contexts/language-context';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <LanguageProvider>
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </LanguageProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
```

### Admin Header Integration

The language selector is positioned before the user avatar in the admin header:

```tsx
{/* Language Selector */}
<LanguageSelector 
  variant="outline" 
  size="icon" 
  className="border-gray-800 dark:border-gray-200 bg-gray-900 dark:bg-gray-50"
/>

{/* Dark Mode Toggle */}
<DropdownMenu>
  {/* ... */}
</DropdownMenu>

{/* User Profile */}
<DropdownMenu>
  {/* ... */}
</DropdownMenu>
```

## Translation Coverage

The current translation files include comprehensive coverage for:

- **Common UI Elements**: Save, Cancel, Delete, Edit, etc.
- **Admin Navigation**: Dashboard, Listings, Agents, Categories, etc.
- **Form Elements**: Validation messages, field labels
- **Table Components**: Pagination, sorting, filtering
- **Dialog Components**: Confirm, cancel, save actions
- **Listings Management**: All property-related fields and actions
- **Agents Management**: Agent profiles and management
- **Categories Management**: Category organization
- **Locations Management**: Geographic data management
- **Email Templates**: Template management system

## Best Practices

1. **Consistent Key Structure**: Use dot notation for nested keys
2. **Descriptive Keys**: Make keys self-explanatory (`admin.listings.create` vs `btn1`)
3. **Parameter Usage**: Use parameters for dynamic content instead of concatenation
4. **Fallback Handling**: Always provide English translations as fallback
5. **Context Grouping**: Group related translations under common prefixes
6. **Testing**: Test all languages to ensure proper display and functionality

## Future Enhancements

Potential improvements for the i18n system:

1. **Pluralization Support**: Handle singular/plural forms
2. **Date/Number Formatting**: Locale-specific formatting
3. **RTL Support**: Right-to-left language support
4. **Lazy Loading**: Load translations on demand
5. **Translation Management**: Admin interface for managing translations
6. **Validation**: Runtime validation of translation keys

## Troubleshooting

### Common Issues

1. **Missing Translation Warning**: Check console for missing keys and add them to translation files
2. **Language Not Persisting**: Verify localStorage is working and not being cleared
3. **Fallback Not Working**: Ensure English translations exist for all keys
4. **Component Not Updating**: Verify component is wrapped in `LanguageProvider`

### Debug Mode

Enable debug logging by adding console.log statements in the translation function to track key resolution.

## Contributing

When adding new features or components:

1. Add translation keys to all three language files
2. Use the `useLanguage` hook for text content
3. Follow the established key naming conventions
4. Test with all three languages
5. Update this documentation if adding new patterns or features
