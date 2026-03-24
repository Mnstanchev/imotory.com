'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LanguageTabs } from '@/components/ui/language-tabs';
import { LocationType } from '@prisma/client';
import { useLanguage } from '@/contexts/language-context';

const locationSchema = z.object({
  name: z.object({
    en: z.string().min(2, 'Name in English is required'),
    bg: z.string().min(2, 'Name in Bulgarian is required'),
    ru: z.string().min(2, 'Name in Russian is required'),
  }),
  type: z.nativeEnum(LocationType),
  parentId: z.string().optional(),
});

type LocationFormData = z.infer<typeof locationSchema>;

interface CreateLocationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LocationFormData) => Promise<void>;
  locations?: { id: string; name: any; type: LocationType }[];
  editingLocation?: { id: string; name: any; type: LocationType; parentId?: string | null } | null;
}

export function CreateLocationDialog({ isOpen, onClose, onSubmit, locations = [], editingLocation }: CreateLocationDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState<'en' | 'bg' | 'ru'>('en');
  const { t } = useLanguage();

  const form = useForm<LocationFormData>({
    mode: 'onChange',
    resolver: zodResolver(locationSchema),
    defaultValues: {
      name: editingLocation?.name || {
        en: '',
        bg: '',
        ru: '',
      },
      type: editingLocation?.type || LocationType.COUNTRY,
      parentId: editingLocation?.parentId === null ? undefined : editingLocation?.parentId,
    },
  });

  // Reset form when editing location changes
  useEffect(() => {
    if (editingLocation) {
      form.reset({
        name: editingLocation.name,
        type: editingLocation.type,
        parentId: editingLocation.parentId || undefined,
      });
    } else {
      form.reset({
        name: {
          en: '',
          bg: '',
          ru: '',
        },
        type: LocationType.COUNTRY,
      });
    }
  }, [editingLocation, form]);

  const handleSubmit = async (data: LocationFormData) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
      form.reset();
      onClose();
      toast.success(t('forms.location_created_success'));
    } catch (error) {

      toast.error(t('forms.failed_to_create_location'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasMunicipality = Object.prototype.hasOwnProperty.call(LocationType, 'MUNICIPALITY');
  const parentForCity = hasMunicipality ? [(LocationType as any).MUNICIPALITY] : [LocationType.REGION];
  const availableParentTypes: Partial<Record<LocationType, LocationType[]>> = {
    [LocationType.COUNTRY]: [],
    [LocationType.REGION]: [LocationType.COUNTRY],
    ...(hasMunicipality ? { [(LocationType as any).MUNICIPALITY]: [LocationType.REGION] } : {}),
    [LocationType.CITY]: parentForCity,
    [LocationType.NEIGHBORHOOD]: [LocationType.CITY],
  } as any;

  const selectedType = form.watch('type');
  const filteredParentLocations = locations.filter(
    (location) => ((availableParentTypes as any)[selectedType] || []).includes(location.type)
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white border border-gray-200 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-gray-900">{editingLocation ? t('forms.edit_location') : t('forms.create_new_location')}</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div>
              <LanguageTabs activeLanguage={activeLanguage} onLanguageChange={setActiveLanguage} />
              
              {(['en', 'bg', 'ru'] as const).map((lang) => (
                <div
                  key={lang}
                  className={`mt-2 ${activeLanguage === lang ? 'block' : 'hidden'}`}
                >
                  <Input
                    placeholder={`Name in ${lang.toUpperCase()}`}
                    {...form.register(`name.${lang}` as const)}
                    className="w-full border-gray-200"
                  />
                  {form.formState.errors.name?.[lang] && (
                    <p className="text-sm text-red-500 mt-1">
                      {form.formState.errors.name[lang]?.message}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Select
                value={form.watch('type')}
                onValueChange={(value) => {
                  form.setValue('type', value as LocationType);
                  form.setValue('parentId', undefined); // Reset parent when type changes
                }}
              >
                <SelectTrigger className="border-gray-200">
                  <SelectValue placeholder={t('forms.select_location_type')} />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-md">
                  {Object.values(LocationType).map((type) => (
                    <SelectItem key={type} value={type} className="text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                      {type.charAt(0) + type.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.type && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.type.message}
                </p>
              )}
            </div>

            {filteredParentLocations.length > 0 && (
              <div className="space-y-2">
                <Select
                  value={form.watch('parentId')}
                  onValueChange={(value) => form.setValue('parentId', value)}
                >
                  <SelectTrigger className="border-gray-200">
                    <SelectValue placeholder={t('forms.select_parent_location')} />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-md">
                    {filteredParentLocations.map((location) => (
                      <SelectItem key={location.id} value={location.id} className="text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                        {location.name.en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.parentId && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.parentId.message}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="border-gray-200 hover:bg-gray-50 text-gray-700"
            >
              {t('common.cancel')}
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-gray-900 text-white hover:bg-gray-800"
            >
              {isSubmitting ? t('forms.saving') : editingLocation ? t('forms.save_changes') : t('forms.create_location')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}