'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Upload } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCreateCategory } from '@/hooks/use-categories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { LanguageTabs } from '@/components/ui/language-tabs';
import { ImageUpload } from '@/components/admin/image-upload';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/language-context';

interface CreateCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface CategoryFormData {
  name: { en: string; bg?: string; ru?: string };
  slug: string;
  description?: { en?: string; bg?: string; ru?: string };
  icon?: string;
  isActive: boolean;
  sortOrder: number;
}

const initialFormData: CategoryFormData = {
  name: { en: '' },
  slug: '',
  description: { en: '' },
  isActive: true,
  sortOrder: 0,
};

export function CreateCategoryDialog({ open, onOpenChange }: CreateCategoryDialogProps) {
  const [formData, setFormData] = useState<CategoryFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [currentLang, setCurrentLang] = useState<'en' | 'bg' | 'ru'>('en');
  const router = useRouter();
  const { t } = useLanguage();

  // Generate slug from English name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name.en?.trim()) {
      toast.error(t('admin.categories.name_required'));
      return;
    }
    if (!formData.slug?.trim()) {
      toast.error(t('admin.categories.slug_required'));
      return;
    }
    
    try {
      setLoading(true);

      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          description: Object.keys(formData.description || {}).length > 0 
            ? formData.description 
            : undefined,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        if (response.status === 400) {
          toast.error(error.message || t('admin.categories.check_form_errors'));
          return;
        }
        throw new Error(error.message || t('admin.categories.failed_to_create_category'));
      }

      toast.success(t('admin.categories.category_created_success'));
      router.refresh();
      onOpenChange(false);
      setFormData(initialFormData);
    } catch (error) {

      toast.error(error instanceof Error ? error.message : t('admin.categories.failed_to_create_category'));
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (urls: string[]) => {
    if (urls.length > 0) {
      setFormData(prev => ({ ...prev, icon: urls[0] }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">{t('admin.categories.add_new_category')}</DialogTitle>
          <DialogDescription className="text-gray-600">
            {t('admin.categories.create_category_description')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Icon Upload */}
          <div className="space-y-2">
            <Label className="text-gray-700">{t('admin.categories.category_icon')}</Label>
            <ImageUpload
              onImagesChange={handleImageUpload}
              initialImages={formData.icon ? [formData.icon] : []}
              maxImages={1}
              entityType="categories"
            />
          </div>

          {/* Name with Language Tabs */}
          <div className="space-y-2">
            <Label className="text-gray-700">
              {t('common.name')} <span className="text-red-500">*</span>
            </Label>
            <div className="space-y-2">
              <LanguageTabs
                activeLanguage={currentLang}
                onLanguageChange={setCurrentLang}
                className="mt-2"
              />
              {currentLang === 'en' && (
                <Input
                  placeholder={t('admin.categories.name_placeholder_en')}
                  value={formData.name.en}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData(prev => ({
                      ...prev,
                      name: { ...prev.name, en: value },
                      // Auto-generate slug from English name if slug is empty
                      slug: prev.slug === '' ? generateSlug(value) : prev.slug
                    }));
                  }}
                  className="border-gray-200 focus:border-gray-400 focus:ring-gray-400"
                />
              )}
              {currentLang === 'bg' && (
                <Input
                  placeholder={t('admin.categories.name_placeholder_bg')}
                  value={formData.name.bg}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    name: { ...prev.name, bg: e.target.value }
                  }))}
                  className="border-gray-200 focus:border-gray-400 focus:ring-gray-400"
                />
              )}
              {currentLang === 'ru' && (
                <Input
                  placeholder={t('admin.categories.name_placeholder_ru')}
                  value={formData.name.ru}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    name: { ...prev.name, ru: e.target.value }
                  }))}
                  className="border-gray-200 focus:border-gray-400 focus:ring-gray-400"
                />
              )}
            </div>
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label className="text-gray-700">
              {t('common.slug')} <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder={t('admin.categories.slug_placeholder')}
              value={formData.slug}
              onChange={(e) => setFormData(prev => ({ ...prev, slug: generateSlug(e.target.value) }))}
              className="border-gray-200 focus:border-gray-400 focus:ring-gray-400 font-mono"
            />
            <p className="text-sm text-gray-500">
              {t('admin.categories.slug_description')}
            </p>
          </div>

          {/* Description with Language Tabs */}
          <div className="space-y-2">
            <Label className="text-gray-700 text-lg font-medium">{t('common.description')}</Label>
            <div className="space-y-2">
              <LanguageTabs
                activeLanguage={currentLang}
                onLanguageChange={setCurrentLang}
                className="mt-2"
              />
              {currentLang === 'en' && (
                <Textarea
                  placeholder={t('admin.categories.description_placeholder_en')}
                  value={formData.description?.en}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    description: { ...prev.description, en: e.target.value }
                  }))}
                  className="min-h-[100px] border-gray-200 focus:border-gray-400 focus:ring-gray-400"
                />
              )}
              {currentLang === 'bg' && (
                <Textarea
                  placeholder={t('admin.categories.description_placeholder_bg')}
                  value={formData.description?.bg}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    description: { ...prev.description, bg: e.target.value }
                  }))}
                  className="min-h-[100px] border-gray-200 focus:border-gray-400 focus:ring-gray-400"
                />
              )}
              {currentLang === 'ru' && (
                <Textarea
                  placeholder={t('admin.categories.description_placeholder_ru')}
                  value={formData.description?.ru}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    description: { ...prev.description, ru: e.target.value }
                  }))}
                  className="min-h-[100px] border-gray-200 focus:border-gray-400 focus:ring-gray-400"
                />
              )}
            </div>
          </div>

          {/* Sort Order */}
          <div className="space-y-2">
            <Label className="text-gray-700">{t('admin.categories.sort_order')}</Label>
            <Input
              type="number"
              min={0}
              value={formData.sortOrder}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                sortOrder: parseInt(e.target.value) || 0 
              }))}
              className="border-gray-200 focus:border-gray-400 focus:ring-gray-400 w-32"
            />
            <p className="text-sm text-gray-500">
              {t('admin.categories.sort_order_description')}
            </p>
          </div>

          {/* Active Status */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked: boolean) => 
                  setFormData(prev => ({ ...prev, isActive: checked }))
                }
                className="border-gray-200 data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900"
              />
              <Label 
                htmlFor="isActive" 
                className="text-gray-700 font-medium cursor-pointer select-none"
              >
                {t('admin.categories.active_category')}
              </Label>
            </div>
            <p className="text-sm text-gray-500 ml-6">
              {t('admin.categories.active_category_description')}
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-gray-200 hover:bg-gray-50 text-gray-700"
            >
              {t('common.cancel')}
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gray-900 text-white hover:bg-gray-800"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t('admin.categories.creating')}
                </>
              ) : (
                t('admin.categories.create_category')
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}