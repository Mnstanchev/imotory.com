# Complete Translation Implementation Guide

## ✅ COMPLETED COMPONENTS

The following components have been fully translated and updated:

### 🎯 Core System Components
- ✅ **Language Context Provider** (`backend/contexts/language-context.tsx`)
- ✅ **Language Selector Component** (`backend/components/language-selector.tsx`)
- ✅ **Root Layout Integration** (`backend/app/layout.tsx`)

### 🏢 Admin Interface Components
- ✅ **Admin Header** (`backend/components/admin/admin-header.tsx`)
- ✅ **Admin Sidebar** (`backend/components/admin/admin-sidebar.tsx`)
- ✅ **Admin Navigation Tabs** (`backend/components/admin/admin-nav-tabs.tsx`)
- ✅ **Listings Management** (`backend/components/admin/listings-management.tsx`)
- ✅ **Agents Management** (`backend/components/admin/agents-management.tsx`)
- ✅ **Categories Management** (`backend/components/admin/categories-management.tsx`)

### 📊 Translation Files
- ✅ **Bulgarian (bg.json)** - Default language with comprehensive translations
- ✅ **English (en.json)** - Fallback language
- ✅ **Russian (ru.json)** - Third language option

## 🔄 PATTERN FOR UPDATING REMAINING COMPONENTS

Here's the standardized pattern to follow for translating the remaining components:

### Step 1: Import the Language Hook

```tsx
// At the top of the component file
import { useLanguage } from '@/contexts/language-context';

// Inside the component function
export function YourComponent() {
  const { t, currentLanguage } = useLanguage();
  
  // Helper function for localized text objects
  const getLocalizedText = (textObj: any) => {
    if (!textObj) return '';
    return textObj[currentLanguage] || textObj.en || textObj.bg || '';
  };
```

### Step 2: Replace Hard-coded Text

Replace all hard-coded strings with translation keys:

```tsx
// ❌ Before
<h1 className="text-3xl font-bold">Locations Management</h1>
<p className="text-gray-600">Manage all locations and areas</p>
<Button>Add Location</Button>

// ✅ After
<h1 className="text-3xl font-bold">{t('admin.locations.title')}</h1>
<p className="text-gray-600">Manage all locations and areas</p>
<Button>{t('admin.locations.create')}</Button>
```

### Step 3: Update Form Elements

```tsx
// ❌ Before
<Input placeholder="Search locations..." />

// ✅ After
<Input placeholder={t('admin.table.search_placeholder')} />
```

### Step 4: Update Table Headers

```tsx
// ❌ Before
<TableHead>Name</TableHead>
<TableHead>Type</TableHead>
<TableHead>Status</TableHead>
<TableHead>Actions</TableHead>

// ✅ After
<TableHead>{t('common.name')}</TableHead>
<TableHead>{t('common.type')}</TableHead>
<TableHead>{t('common.status')}</TableHead>
<TableHead>{t('common.actions')}</TableHead>
```

### Step 5: Update Status Badges and Action Buttons

```tsx
// ❌ Before
<Badge>{location.isActive ? 'Active' : 'Inactive'}</Badge>

// ✅ After
<Badge>{location.isActive ? t('common.active') : t('common.inactive')}</Badge>

// ❌ Before
<DropdownMenuItem>
  <Edit className="w-4 h-4 mr-2" />
  Edit
</DropdownMenuItem>

// ✅ After
<DropdownMenuItem className="text-gray-700 hover:bg-gray-50 hover:text-gray-900">
  <Edit className="w-4 h-4 mr-2" />
  {t('common.edit')}
</DropdownMenuItem>
```

### Step 6: Update Dialogs and Modals

```tsx
// ❌ Before
<DialogTitle>Confirm Deletion</DialogTitle>
<DialogDescription>
  Are you sure you want to delete this item?
</DialogDescription>
<Button>Cancel</Button>
<Button>Delete</Button>

// ✅ After
<DialogTitle className="text-gray-900">{t('admin.locations.messages.confirm_delete')}</DialogTitle>
<DialogDescription className="text-gray-600">
  Are you sure you want to delete "{getLocalizedText(selectedItem?.name)}"?
</DialogDescription>
<Button className="border-gray-200 hover:bg-gray-50 text-gray-700">{t('common.cancel')}</Button>
<Button className="bg-gray-900 text-white hover:bg-gray-800">{t('common.delete')}</Button>
```

### Step 7: Handle Localized Data Objects

For data that comes from the API with multiple language versions:

```tsx
// ❌ Before
<div>{location.name.en}</div>

// ✅ After
<div>{getLocalizedText(location.name)}</div>
```

### Step 8: Apply Monochromatic Design

Ensure all components follow the monochromatic color palette:

```tsx
// ✅ Correct styling
<DropdownMenuContent className="bg-white border border-gray-200 shadow-md">
  <DropdownMenuItem className="text-gray-700 hover:bg-gray-50 hover:text-gray-900">
    {/* Content */}
  </DropdownMenuItem>
</DropdownMenuContent>

<Card className="border-gray-200 bg-white shadow-sm">
  <CardTitle className="text-gray-900">{/* Title */}</CardTitle>
  <CardDescription className="text-gray-600">{/* Description */}</CardDescription>
</Card>

<Button className="bg-gray-900 text-white hover:bg-gray-800">
  {/* Primary button */}
</Button>

<Button variant="outline" className="border-gray-200 hover:bg-gray-50 text-gray-700">
  {/* Secondary button */}
</Button>
```

## 📋 REMAINING COMPONENTS TO UPDATE

### High Priority Components
1. **Locations Management** (`backend/components/admin/locations-management.tsx`)
2. **Email Templates Management** (`backend/components/admin/email-templates/`)
3. **Admin Dashboard** (`backend/components/admin/admin-dashboard.tsx`) - Complete the remaining text

### Form Components & Dialogs
4. **Create Listing Dialog** (`backend/components/admin/listings/create-listing-dialog.tsx`)
5. **Create Agent Dialog** (`backend/components/admin/agents/create-agent-dialog.tsx`)
6. **Create Category Dialog** (`backend/components/admin/categories/create-category-dialog.tsx`)
7. **Create Location Dialog** (`backend/components/admin/locations/create-location-dialog.tsx`)
8. **Create Email Template Dialog** (`backend/components/admin/email-templates/create-email-template-dialog.tsx`)

### Page Components
9. **Individual Detail Pages** (`backend/app/admin/*/[id]/page.tsx`)
10. **Edit Pages** (`backend/app/admin/*/[id]/edit/page.tsx`)

## 🔧 AVAILABLE TRANSLATION KEYS

### Common Keys
```json
{
  "common": {
    "save": "Save/Запази/Сохранить",
    "cancel": "Cancel/Отказ/Отмена", 
    "delete": "Delete/Изтрий/Удалить",
    "edit": "Edit/Редактирай/Редактировать",
    "create": "Create/Създай/Создать",
    "add": "Add/Добави/Добавить",
    "view": "View/Виж/Просмотр",
    "search": "Search/Търси/Поиск",
    "filter": "Filter/Филтрирай/Фильтр",
    "loading": "Loading.../Зареждане.../Загрузка...",
    "active": "Active/Активен/Активный",
    "inactive": "Inactive/Неактивен/Неактивный",
    "status": "Status/Статус/Статус",
    "actions": "Actions/Действия/Действия",
    "name": "Name/Име/Имя",
    "title": "Title/Заглавие/Заголовок",
    "description": "Description/Описание/Описание",
    "price": "Price/Цена/Цена",
    "location": "Location/Местоположение/Местоположение",
    "type": "Type/Тип/Тип",
    "previous": "Previous/Предишен/Предыдущий",
    "next": "Next/Напред/Далее"
  }
}
```

### Admin-Specific Keys
```json
{
  "admin": {
    "panel": "Admin Panel/Администраторски панел/Панель администратора",
    "navigation": {
      "dashboard": "Dashboard/Табло/Панель управления",
      "listings": "Listings/Обяви/Объявления",
      "agents": "Agents/Агенти/Агенты",
      "categories": "Categories/Категории/Категории",
      "locations": "Locations/Местоположения/Местоположения",
      "email_templates": "Email Templates/Имейл шаблони/Шаблоны электронной почты"
    },
    "table": {
      "search_placeholder": "Search.../Търси.../Поиск...",
      "no_data": "No data to display/Няма данни за показване/Нет данных для отображения",
      "loading": "Loading data.../Зареждане на данни.../Загрузка данных...",
      "showing": "Showing/Показване на/Показано",
      "to": "to/до/до", 
      "of": "of/от/из",
      "entries": "entries/записа/записей"
    }
  }
}
```

## 🎨 MONOCHROMATIC DESIGN SYSTEM

All components must follow this color palette:

### Background Colors
- `bg-white` - Primary background
- `bg-gray-50` - Subtle background, hover states
- `bg-gray-100` - Stronger background, active states
- `bg-gray-900` - Dark background for contrast

### Text Colors
- `text-gray-900` - Primary text
- `text-gray-700` - Secondary text
- `text-gray-600` - Tertiary text
- `text-gray-500` - Muted text

### Border Colors
- `border-gray-200` - Primary border
- `border-gray-300` - Stronger border

### Interactive Elements
- **Primary Button**: `bg-gray-900 text-white hover:bg-gray-800`
- **Secondary Button**: `border-gray-200 hover:bg-gray-50 text-gray-700`
- **Dropdown**: `bg-white border border-gray-200 shadow-md`
- **Hover States**: `hover:bg-gray-50 hover:text-gray-900`

## 📝 IMPLEMENTATION CHECKLIST

For each component you update:

- [ ] Import `useLanguage` hook
- [ ] Add `getLocalizedText` helper function
- [ ] Replace all hard-coded text with `t()` calls
- [ ] Update form placeholders
- [ ] Update table headers
- [ ] Update button text
- [ ] Update dialog/modal text
- [ ] Handle localized data objects with `getLocalizedText()`
- [ ] Apply monochromatic design classes
- [ ] Remove dark mode classes
- [ ] Test with all three languages
- [ ] Verify responsive design

## 🚀 QUICK START EXAMPLE

Here's a complete example of updating a component:

```tsx
'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/language-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';

export function LocationsManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const { t, currentLanguage } = useLanguage();
  
  const getLocalizedText = (textObj: any) => {
    if (!textObj) return '';
    return textObj[currentLanguage] || textObj.en || textObj.bg || '';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('admin.locations.title')}</h1>
        <p className="text-gray-600 mt-2">
          Manage all locations and geographical areas
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder={t('admin.table.search_placeholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-64 border-gray-200"
          />
        </div>
        <Button className="bg-gray-900 text-white hover:bg-gray-800">
          <Plus className="w-4 h-4 mr-2" />
          {t('admin.locations.create')}
        </Button>
      </div>

      <Card className="border-gray-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">{t('admin.locations.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Table and other content with translations */}
        </CardContent>
      </Card>
    </div>
  );
}
```

## 🎯 FINAL RESULT

When complete, your admin interface will:

- ✅ **Support 3 Languages**: Bulgarian (default), English (fallback), Russian
- ✅ **Globe Icon Language Selector**: Positioned before user avatar in header
- ✅ **Persistent Language Choice**: Stored in localStorage
- ✅ **Automatic Fallback**: Falls back to English if translation missing
- ✅ **Consistent Design**: Monochromatic color palette throughout
- ✅ **Localized Content**: All data objects show in selected language
- ✅ **Type-Safe**: Full TypeScript support with proper typing
- ✅ **Performance Optimized**: Context-based state management

Follow this guide to complete the translation of all remaining components!
