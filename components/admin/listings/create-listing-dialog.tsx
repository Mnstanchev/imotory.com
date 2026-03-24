'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/language-context';
import { LanguageTabs } from '@/components/ui/language-tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { PropertyType, ListingType, LocationType } from '@prisma/client';
import { toast } from 'sonner';

// Enum constants
const HEATING_TYPES = ['NONE', 'CENTRAL', 'ELECTRIC', 'GAS', 'WOOD', 'SOLAR', 'HEATPUMP'] as const;
const OWNERSHIP_TYPES = ['FREEHOLD', 'LEASEHOLD', 'COOPERATIVE'] as const;
const BUILDING_TYPES = ['PANEL', 'BRICK', 'NEW_BUILD', 'MONOLITHIC', 'WOOD', 'PREFAB'] as const;
const LISTING_STATUSES = ['ACTIVE', 'RESERVED', 'SOLD', 'INACTIVE', 'UNDER_CONSTRUCTION'] as const;
import { ImageUpload } from '@/components/admin/image-upload';

interface CreateListingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  listingId?: string | null;
}

export function CreateListingDialog({ open, onOpenChange, onSuccess, listingId }: CreateListingDialogProps) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState<'bg' | 'en' | 'ru'>('bg');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [featuresByLang, setFeaturesByLang] = useState<{ bg: string[]; en: string[]; ru: string[] }>({ bg: [], en: [], ru: [] });
  const [tagsByLang, setTagsByLang] = useState<{ bg: string[]; en: string[]; ru: string[] }>({ bg: [], en: [], ru: [] });
  const [titlesByLang, setTitlesByLang] = useState<{ bg: string; en: string; ru: string }>({ bg: '', en: '', ru: '' });
  const [descriptionsByLang, setDescriptionsByLang] = useState<{ bg: string; en: string; ru: string }>({ bg: '', en: '', ru: '' });
  const [addressesByLang, setAddressesByLang] = useState<{ bg: string; en: string; ru: string }>({ bg: '', en: '', ru: '' });
  const [buildingConditionByLang, setBuildingConditionByLang] = useState<{ bg: string; en: string; ru: string }>({ bg: '', en: '', ru: '' });
  const [locationQuery, setLocationQuery] = useState('');
  const [initialData, setInitialData] = useState<any | null>(null);
  const [formSeed, setFormSeed] = useState(0);
  interface Location {
    id: string;
    name: {
      en: string;
      bg: string;
      ru: string;
    };
    type: LocationType;
    parentId: string | null;
  }

  interface Category {
    id: string;
    name: {
      en: string;
      bg: string;
      ru: string;
    };
    slug: string;
    isActive: boolean;
  }

  interface Agent {
    id: string;
    name: {
      en: string;
      bg: string;
      ru: string;
    };
    email: string;
    isActive: boolean;
  }

  const [agents, setAgents] = useState<Agent[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);

  const handleFeatureKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const value = input.value.trim();

    if ((e.key === 'Enter' || e.key === ',') && value) {
      e.preventDefault();
      setFeaturesByLang(prev => {
        const arr = prev[activeLanguage] || [];
        if (arr.includes(value)) return prev;
        return { ...prev, [activeLanguage]: [...arr, value] } as typeof prev;
      });
      input.value = '';
    }
  };

  const removeFeature = (featureToRemove: string) => {
    setFeaturesByLang(prev => ({
      ...prev,
      [activeLanguage]: (prev[activeLanguage] || []).filter(f => f !== featureToRemove),
    }));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const value = input.value.trim();

    if ((e.key === 'Enter' || e.key === ',') && value) {
      e.preventDefault();
      setTagsByLang(prev => {
        const arr = prev[activeLanguage] || [];
        if (arr.includes(value)) return prev;
        return { ...prev, [activeLanguage]: [...arr, value] } as typeof prev;
      });
      input.value = '';
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTagsByLang(prev => ({
      ...prev,
      [activeLanguage]: (prev[activeLanguage] || []).filter(t => t !== tagToRemove),
    }));
  };

  // Fetch required data on component mount
  const fetchRequiredData = async () => {
    try {
      // Fetch all required data
      const [agentsRes, categoriesRes, locationsRes] = await Promise.all([
        fetch('/api/agents'),
        fetch('/api/categories'),
        fetch('/api/locations?limit=100'),
      ]);

      // Check response status
      const responses = {
        agents: agentsRes,
        categories: categoriesRes,
        locations: locationsRes
      };



      // Check if any response is not ok
      for (const [name, response] of Object.entries(responses)) {
        if (!response.ok) {
          const errorText = await response.text();

          throw new Error(`${name} API request failed: ${response.statusText}`);
        }
      }

      // Parse JSON responses
      const [agentsData, categoriesData, locationsData] = await Promise.all([
        agentsRes.json().catch(error => {
          return [];
        }),
        categoriesRes.json().catch(error => {
          return [];
        }),
        locationsRes.json().catch(error => {
          return [];
        }),
      ]);



      // Update state with type checking
      if (agentsData?.data?.agents && Array.isArray(agentsData.data.agents)) {
        setAgents(agentsData.data.agents);
      } else {

        setAgents([]);
      }

      if (categoriesData?.data?.categories && Array.isArray(categoriesData.data.categories)) {
        setCategories(categoriesData.data.categories);
      } else {

        setCategories([]);
      }

      if (locationsData?.data?.locations && Array.isArray(locationsData.data.locations)) {
        setLocations(locationsData.data.locations);
      } else {

        setLocations([]);
      }
    } catch (error) {

      toast.error('Failed to load required data');
    }
  };

  useEffect(() => {
    if (open) {
      fetchRequiredData();
    }
  }, [open]);

  // Load listing data when editing
  useEffect(() => {
    const run = async () => {
      if (!open) return;
      if (!listingId) {
        setInitialData(null);
        setUploadedImages([]);
        setFeaturesByLang({ bg: [], en: [], ru: [] });
        setTagsByLang({ bg: [], en: [], ru: [] });
        setTitlesByLang({ bg: '', en: '', ru: '' });
        setDescriptionsByLang({ bg: '', en: '', ru: '' });
        setAddressesByLang({ bg: '', en: '', ru: '' });
        setBuildingConditionByLang({ bg: '', en: '', ru: '' });
        setActiveLanguage('bg');
        return;
      }
      try {
        const res = await fetch(`/api/listings/${listingId}`);
        if (!res.ok) return;
        const data = await res.json();
        setInitialData(data);
        setUploadedImages(Array.isArray(data.images) ? data.images : []);
        setFeaturesByLang({
          bg: Array.isArray(data?.features?.bg) ? data.features.bg : (Array.isArray(data?.features) ? data.features : []),
          en: Array.isArray(data?.features?.en) ? data.features.en : [],
          ru: Array.isArray(data?.features?.ru) ? data.features.ru : [],
        });
        setTagsByLang({
          bg: Array.isArray(data?.tags?.bg) ? data.tags.bg : (Array.isArray(data?.tags) ? data.tags : []),
          en: Array.isArray(data?.tags?.en) ? data.tags.en : [],
          ru: Array.isArray(data?.tags?.ru) ? data.tags.ru : [],
        });
        setTitlesByLang({
          bg: (data?.title?.bg || data?.title?.BG || '') as string,
          en: (data?.title?.en || data?.title?.EN || '') as string,
          ru: (data?.title?.ru || data?.title?.RU || '') as string,
        });
        setDescriptionsByLang({
          bg: (data?.description?.bg || data?.description?.BG || '') as string,
          en: (data?.description?.en || data?.description?.EN || '') as string,
          ru: (data?.description?.ru || data?.description?.RU || '') as string,
        });
        setAddressesByLang({
          bg: (data?.address?.bg || data?.address?.BG || '') as string,
          en: (data?.address?.en || data?.address?.EN || '') as string,
          ru: (data?.address?.ru || data?.address?.RU || '') as string,
        });
        setBuildingConditionByLang({
          bg: (data?.buildingCondition?.bg || data?.buildingCondition?.BG || '') as string,
          en: (data?.buildingCondition?.en || data?.buildingCondition?.EN || '') as string,
          ru: (data?.buildingCondition?.ru || data?.buildingCondition?.RU || '') as string,
        });
        setFormSeed((s) => s + 1);
        // Choose a language that has content
        const hasBg = !!data?.title?.bg || !!data?.description?.bg;
        const hasEn = !!data?.title?.en || !!data?.description?.en;
        const hasRu = !!data?.title?.ru || !!data?.description?.ru;
        if (hasBg) setActiveLanguage('bg');
        else if (hasEn) setActiveLanguage('en');
        else if (hasRu) setActiveLanguage('ru');
      } catch (e) {
        // ignore
      }
    };
    run();
  }, [open, listingId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        title: titlesByLang,
        description: descriptionsByLang,
        price: formData.get('price') ? parseFloat(formData.get('price') as string) : 0,
        pricePerSqM: formData.get('pricePerSqM') ? parseFloat(formData.get('pricePerSqM') as string) : undefined,
        currency: formData.get('currency'),
        
        propertyType: formData.get('propertyType'),
        listingType: formData.get('listingType'),
        
        locationId: formData.get('locationId'),
        categoryId: formData.get('categoryId'),
        agentId: formData.get('agentId'),
        
        // Address and coordinates
        address: addressesByLang,
        postalCode: formData.get('postalCode') || undefined,
        latitude: formData.get('latitude') ? parseFloat(formData.get('latitude') as string) : undefined,
        longitude: formData.get('longitude') ? parseFloat(formData.get('longitude') as string) : undefined,
        
        // Room details
        bedrooms: formData.get('bedrooms') ? parseInt(formData.get('bedrooms') as string) : undefined,
        bathrooms: formData.get('bathrooms') ? parseInt(formData.get('bathrooms') as string) : undefined,
        livingRooms: formData.get('livingRooms') ? parseInt(formData.get('livingRooms') as string) : undefined,
        kitchens: formData.get('kitchens') ? parseInt(formData.get('kitchens') as string) : undefined,
        parkingSpots: formData.get('parkingSpots') ? parseInt(formData.get('parkingSpots') as string) : undefined,
        
        // Amenities
        garage: formData.get('garage') === 'on',
        balcony: formData.get('balcony') === 'on',
        pool: formData.get('pool') === 'on',
        elevator: formData.get('elevator') === 'on',
        furnished: formData.get('furnished') === 'on',
        airConditioning: formData.get('airConditioning') === 'on',
        
        // Outdoor spaces
        gardenSize: formData.get('gardenSize') ? parseInt(formData.get('gardenSize') as string) : undefined,
        terraceSize: formData.get('terraceSize') ? parseInt(formData.get('terraceSize') as string) : undefined,
        
        // Property details
        size: formData.get('size') ? parseInt(formData.get('size') as string) : undefined,
        floor: formData.get('floor') ? parseInt(formData.get('floor') as string) : undefined,
        totalFloors: formData.get('totalFloors') ? parseInt(formData.get('totalFloors') as string) : undefined,
        yearBuilt: formData.get('yearBuilt') ? parseInt(formData.get('yearBuilt') as string) : undefined,
        
        // Building information
        buildingType: formData.get('buildingType') || undefined,
        buildingCondition: buildingConditionByLang,
        maintenanceFee: formData.get('maintenanceFee') ? parseFloat(formData.get('maintenanceFee') as string) : undefined,
        
        // Climate and ownership
        heatingType: formData.get('heatingType') || undefined,
        ownershipType: formData.get('ownershipType') || undefined,
        mortgagePossible: formData.get('mortgagePossible') === 'on',
        
        // Status and availability
        status: formData.get('status') || 'ACTIVE',
        availableFrom: formData.get('availableFrom') || undefined,
        
        // Media and features
        features: featuresByLang,
        tags: tagsByLang,
        images: uploadedImages,
        videoUrl: formData.get('videoUrl') || undefined,
        virtualTourUrl: formData.get('virtualTourUrl') || undefined,
        
        // Visibility
        isActive: formData.get('isActive') === 'on' || formData.get('isActive') === 'true',
        isFeatured: formData.get('isFeatured') === 'on' || formData.get('isFeatured') === 'true',
      };

      const response = await fetch(listingId ? `/api/listings/${listingId}` : '/api/listings', {
        method: listingId ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create listing');
      }

      toast.success(listingId ? 'Listing updated successfully' : 'Listing created successfully');
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast.error(listingId ? 'Failed to update listing' : 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) {
          setInitialData(null);
          setUploadedImages([]);
          setFeaturesByLang({ bg: [], en: [], ru: [] });
          setTagsByLang({ bg: [], en: [], ru: [] });
        }
        onOpenChange(o);
      }}
    >
      <DialogContent className="w-[99vw] md:w-[90vw] lg:w-[90vw] xl:w-[90vw] max-w-[1600px] h-[95vh] md:h-[90vh] overflow-y-auto bg-white p-3 md:p-4">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg font-bold text-gray-900">{listingId ? t('common.edit') : t('admin.listings.dialog.add_new')}</DialogTitle>
          <DialogDescription className="text-gray-600 text-sm">
            {t('admin.listings.dialog.add_new_description')}
          </DialogDescription>
        </DialogHeader>

        <form key={(listingId ? `edit-${listingId}` : 'create') + '-' + formSeed} onSubmit={handleSubmit} className="space-y-4">
          {/* Compact Header Section */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
              {/* Language Tabs - Compact */}
              <div className="md:col-span-1">
                <LanguageTabs
                  activeLanguage={activeLanguage}
                  onLanguageChange={setActiveLanguage}
                />
              </div>
              
              {/* Essential Fields Row */}
              <div className="space-y-1">
                <Label htmlFor="price" className="text-xs font-medium">{t('admin.listings.dialog.form.price')} *</Label>
                <div className="flex gap-2">
                   <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder={t('admin.listings.dialog.form.placeholders.price')}
                    required
                     className="h-8 text-sm"
                     defaultValue={initialData?.price ?? ''}
                  />
                   <Select name="currency" defaultValue={initialData?.currency || 'EUR'}>
                    <SelectTrigger className="w-16 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200 shadow-md">
                      <SelectItem value="EUR" className="text-gray-700 hover:bg-gray-50">{t('admin.listings.dialog.form.currencies.EUR')}</SelectItem>
                      <SelectItem value="USD" className="text-gray-700 hover:bg-gray-50">{t('admin.listings.dialog.form.currencies.USD')}</SelectItem>
                      <SelectItem value="BGN" className="text-gray-700 hover:bg-gray-50">{t('admin.listings.dialog.form.currencies.BGN')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="propertyType" className="text-xs font-medium">{t('admin.listings.dialog.form.property_type')} *</Label>
                <Select name="propertyType" required defaultValue={initialData?.propertyType}>
                  <SelectTrigger className="h-8 text-sm">
                                            <SelectValue placeholder={t('admin.listings.dialog.form.placeholders.building_type')} />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-md">
                                            {Object.values(PropertyType).map((type) => (
                          <SelectItem key={type} value={type} className="text-gray-700 hover:bg-gray-50">
                            {t(`admin.listings.dialog.form.property_types.${type.toLowerCase()}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="listingType" className="text-xs font-medium">{t('admin.listings.dialog.form.listing_type')} *</Label>
                <Select name="listingType" required defaultValue={initialData?.listingType}>
                  <SelectTrigger className="h-8 text-sm">
                                            <SelectValue placeholder={t('admin.listings.dialog.form.placeholders.building_type')} />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200 shadow-md">
                                            {Object.values(ListingType).map((type) => (
                          <SelectItem key={type} value={type} className="text-gray-700 hover:bg-gray-50">
                            {t(`admin.listings.dialog.form.listing_types.${type.toLowerCase()}`)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Main Content - 3 Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            
            {/* Left Column - Basic Info (4/12) */}
            <div className="lg:col-span-4 space-y-4">
              {/* Title and Description */}
              <div className="bg-white border border-gray-200 rounded-lg p-3 space-y-3">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">{t('admin.listings.dialog.sections.basic_info')}</h3>
                
                <div className="space-y-2">
                  <Label htmlFor={`title${activeLanguage.toUpperCase()}`} className="text-xs font-medium">
                    {t('admin.listings.dialog.form.title_in_lang', { lang: activeLanguage.toUpperCase() })} *
                  </Label>
                  <Input
                    id={`title${activeLanguage.toUpperCase()}`}
                    name={`title${activeLanguage.toUpperCase()}`}
                    placeholder={t('admin.listings.dialog.form.placeholders.title')}
                    required={activeLanguage === 'bg'}
                    className="h-8 text-sm"
                    value={titlesByLang[activeLanguage] || ''}
                    onChange={(e) => setTitlesByLang(prev => ({ ...prev, [activeLanguage]: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`description${activeLanguage.toUpperCase()}`} className="text-xs font-medium">
                    {t('admin.listings.dialog.form.description_in_lang', { lang: activeLanguage.toUpperCase() })} *
                  </Label>
                  <Textarea
                    id={`description${activeLanguage.toUpperCase()}`}
                    name={`description${activeLanguage.toUpperCase()}`}
                    placeholder={t('admin.listings.dialog.form.placeholders.description')}
                    required={activeLanguage === 'bg'}
                    className="h-20 text-sm resize-none"
                    value={descriptionsByLang[activeLanguage] || ''}
                    onChange={(e) => setDescriptionsByLang(prev => ({ ...prev, [activeLanguage]: e.target.value }))}
                  />
                </div>

                {/* Location, Category, Agent - Compact */}
                <div className="grid grid-cols-1 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor="locationId" className="text-xs font-medium">{t('admin.listings.dialog.form.location')} *</Label>
                    <Input
                      id="locationSearch"
                      placeholder="Search locations..."
                      className="h-8 text-sm mb-1"
                      value={locationQuery}
                      onChange={(e) => setLocationQuery(e.target.value)}
                    />
                    <Select name="locationId" required defaultValue={(initialData?.locationId as string) || initialData?.location?.id}>
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue placeholder={t('admin.listings.dialog.form.placeholders.select_location')} />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-md">
                        {locations
                          .filter((l) => {
                            if (!locationQuery.trim()) return true;
                            const q = locationQuery.toLowerCase();
                            const nEn = (l.name?.en || '').toLowerCase();
                            const nBg = (l.name?.bg || '').toLowerCase();
                            const nRu = (l.name?.ru || '').toLowerCase();
                            return nEn.includes(q) || nBg.includes(q) || nRu.includes(q);
                          })
                          .sort((a, b) => {
                            const typeOrder: Partial<Record<LocationType, number>> = {
                              COUNTRY: 1,
                              REGION: 2,
                              // Optional enum member depending on schema
                              ...(Object.prototype.hasOwnProperty.call(LocationType, 'MUNICIPALITY') ? { MUNICIPALITY: 3 } : {}),
                              CITY: 4,
                              NEIGHBORHOOD: 5
                            } as any;
                            const av = (typeOrder as any)[a.type] ?? 999;
                            const bv = (typeOrder as any)[b.type] ?? 999;
                            return av - bv;
                          })
                          .map((location) => {
                            const parent = location.parentId 
                              ? locations.find(l => l.id === location.parentId)
                              : null;
                            
                            const indent = location.type === 'COUNTRY' ? ''
                              : location.type === 'REGION' ? '  '
                              : location.type === 'CITY' ? '    '
                              : '      ';
                            
                            const displayName = parent
                              ? `${indent}${location.name.en} (${parent.name.en})`
                              : `${location.name.en}`;

                            return (
                              <SelectItem key={location.id} value={location.id} className="text-gray-700 hover:bg-gray-50">
                                {displayName}
                              </SelectItem>
                            );
                          })}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="categoryId" className="text-xs font-medium">{t('admin.listings.dialog.form.category')} *</Label>
                    <Select name="categoryId" required defaultValue={(initialData?.categoryId as string) || initialData?.category?.id}>
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue placeholder={t('admin.listings.dialog.form.placeholders.select_category')} />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-md">
                        {categories
                          .filter(category => category.isActive)
                          .map(category => (
                          <SelectItem key={category.id} value={category.id} className="text-gray-700 hover:bg-gray-50">
                            {category.name.en}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="agentId" className="text-xs font-medium">{t('admin.listings.dialog.form.agent')} *</Label>
                    <Select name="agentId" required defaultValue={(initialData?.agentId as string) || initialData?.agent?.id}>
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue placeholder={t('admin.listings.dialog.form.placeholders.select_agent')} />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-md">
                        {agents
                          .filter(agent => agent.isActive)
                          .map(agent => (
                          <SelectItem key={agent.id} value={agent.id} className="text-gray-700 hover:bg-gray-50">
                            {agent.name.en}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Status Checkboxes */}
                <div className="space-y-2">
                  <Label className="text-xs font-medium">Status</Label>
                  <div className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isActive"
                        name="isActive"
                        defaultChecked={initialData?.isActive ?? true}
                        className="data-[state=checked]:bg-gray-900 data-[state=checked]:text-white h-4 w-4"
                      />
                      <Label htmlFor="isActive" className="text-xs text-gray-700">{t('admin.listings.dialog.form.active')}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isFeatured"
                        name="isFeatured"
                        defaultChecked={!!initialData?.isFeatured}
                        className="data-[state=checked]:bg-gray-900 data-[state=checked]:text-white h-4 w-4"
                      />
                      <Label htmlFor="isFeatured" className="text-xs text-gray-700">{t('admin.listings.dialog.form.featured')}</Label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Image Upload */}
              <div className="bg-white border border-gray-200 rounded-lg p-3">
                <Label className="text-sm font-semibold text-gray-900 mb-2 block">{t('admin.listings.dialog.form.image_upload.title')}</Label>
                <ImageUpload
                  onImagesChange={setUploadedImages}
                  initialImages={uploadedImages}
                  maxImages={10}
                  entityType="listings"
                  entityId={listingId || undefined}
                  disabled={loading}
                  dragDropText={t('admin.listings.dialog.form.image_upload.drag_drop')}
                  fileTypesText={t('admin.listings.dialog.form.image_upload.file_types')}
                  remainingText={t('admin.listings.dialog.form.image_upload.remaining')}
                  chooseFilesText={t('admin.listings.dialog.form.image_upload.choose_files')}
                />
              </div>
            </div>

            {/* Middle Column - Property Details (4/12) */}
            <div className="lg:col-span-4 space-y-4">
              
              {/* Property Specifications */}
              <div className="bg-white border border-gray-200 rounded-lg p-3 space-y-3">
                <h3 className="text-sm font-semibold text-gray-900">{t('admin.listings.dialog.sections.property_details')}</h3>
                
                {/* Size and Price per m² */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor="size" className="text-xs font-medium">{t('admin.listings.dialog.form.size')}</Label>
                    <Input
                      id="size"
                      name="size"
                      type="number"
                      min="0"
                      placeholder={t('admin.listings.dialog.form.placeholders.size')}
                      className="h-8 text-sm"
                      defaultValue={initialData?.size ?? ''}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="pricePerSqM" className="text-xs font-medium">{t('admin.listings.dialog.form.price_per_sqm')}</Label>
                    <Input
                      id="pricePerSqM"
                      name="pricePerSqM"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder={t('admin.listings.dialog.form.placeholders.price_per_sqm')}
                      className="h-8 text-sm"
                      defaultValue={initialData?.pricePerSqM ?? ''}
                    />
                  </div>
                </div>

                {/* Room Details */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor="bedrooms" className="text-xs font-medium">{t('admin.listings.dialog.form.bedrooms')}</Label>
                    <Input
                      id="bedrooms"
                      name="bedrooms"
                      type="number"
                      min="0"
                      placeholder={t('admin.listings.dialog.form.placeholders.bedrooms')}
                      className="h-8 text-sm"
                      defaultValue={initialData?.bedrooms ?? ''}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="bathrooms" className="text-xs font-medium">{t('admin.listings.dialog.form.bathrooms')}</Label>
                    <Input
                      id="bathrooms"
                      name="bathrooms"
                      type="number"
                      min="0"
                      placeholder={t('admin.listings.dialog.form.placeholders.bathrooms')}
                      className="h-8 text-sm"
                      defaultValue={initialData?.bathrooms ?? ''}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor="livingRooms" className="text-xs font-medium">{t('admin.listings.dialog.form.living_rooms')}</Label>
                    <Input
                      id="livingRooms"
                      name="livingRooms"
                      type="number"
                      min="0"
                      placeholder={t('admin.listings.dialog.form.placeholders.living_rooms')}
                      className="h-8 text-sm"
                      defaultValue={initialData?.livingRooms ?? ''}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="kitchens" className="text-xs font-medium">{t('admin.listings.dialog.form.kitchens')}</Label>
                    <Input
                      id="kitchens"
                      name="kitchens"
                      type="number"
                      min="0"
                      placeholder={t('admin.listings.dialog.form.placeholders.kitchens')}
                      className="h-8 text-sm"
                      defaultValue={initialData?.kitchens ?? ''}
                    />
                  </div>
                </div>

                {/* Building Info */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor="floor" className="text-xs font-medium">{t('admin.listings.dialog.form.floor')}</Label>
                    <Input
                      id="floor"
                      name="floor"
                      type="number"
                      min="0"
                      placeholder={t('admin.listings.dialog.form.placeholders.floor')}
                      className="h-8 text-sm"
                      defaultValue={initialData?.floor ?? ''}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="totalFloors" className="text-xs font-medium">{t('admin.listings.dialog.form.total_floors')}</Label>
                    <Input
                      id="totalFloors"
                      name="totalFloors"
                      type="number"
                      min="0"
                      placeholder={t('admin.listings.dialog.form.placeholders.total_floors')}
                      className="h-8 text-sm"
                      defaultValue={initialData?.totalFloors ?? ''}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor="yearBuilt" className="text-xs font-medium">{t('admin.listings.dialog.form.year_built')}</Label>
                    <Input
                      id="yearBuilt"
                      name="yearBuilt"
                      type="number"
                      min="1800"
                      max={new Date().getFullYear()}
                      placeholder={t('admin.listings.dialog.form.placeholders.year_built')}
                      className="h-8 text-sm"
                      defaultValue={initialData?.yearBuilt ?? ''}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="parkingSpots" className="text-xs font-medium">{t('admin.listings.dialog.form.parking')}</Label>
                    <Input
                      id="parkingSpots"
                      name="parkingSpots"
                      type="number"
                      min="0"
                      placeholder={t('admin.listings.dialog.form.placeholders.parking')}
                      className="h-8 text-sm"
                      defaultValue={initialData?.parkingSpots ?? ''}
                    />
                  </div>
                </div>

                {/* Outdoor Spaces */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor="gardenSize" className="text-xs font-medium">{t('admin.listings.dialog.form.garden')}</Label>
                    <Input
                      id="gardenSize"
                      name="gardenSize"
                      type="number"
                      min="0"
                      placeholder={t('admin.listings.dialog.form.placeholders.garden')}
                      className="h-8 text-sm"
                      defaultValue={initialData?.gardenSize ?? ''}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="terraceSize" className="text-xs font-medium">{t('admin.listings.dialog.form.terrace')}</Label>
                    <Input
                      id="terraceSize"
                      name="terraceSize"
                      type="number"
                      min="0"
                      placeholder={t('admin.listings.dialog.form.placeholders.terrace')}
                      className="h-8 text-sm"
                      defaultValue={initialData?.terraceSize ?? ''}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="maintenanceFee" className="text-xs font-medium">{t('admin.listings.dialog.form.maintenance_fee')}</Label>
                  <Input
                    id="maintenanceFee"
                    name="maintenanceFee"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder={t('admin.listings.dialog.form.placeholders.maintenance_fee')}
                    className="h-8 text-sm"
                    defaultValue={initialData?.maintenanceFee ?? ''}
                  />
                </div>
              </div>

              {/* Address Information */}
              <div className="bg-white border border-gray-200 rounded-lg p-3 space-y-3">
                <h3 className="text-sm font-semibold text-gray-900">{t('admin.listings.dialog.sections.address_location')}</h3>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor={`address${activeLanguage.toUpperCase()}`} className="text-xs font-medium">{t('admin.listings.dialog.form.address_in_lang', { lang: activeLanguage.toUpperCase() })}</Label>
                    <Input
                      id={`address${activeLanguage.toUpperCase()}`}
                      name={`address${activeLanguage.toUpperCase()}`}
                      placeholder={t('admin.listings.dialog.form.placeholders.address')}
                      className="h-8 text-sm"
                      value={addressesByLang[activeLanguage] || ''}
                      onChange={(e) => setAddressesByLang(prev => ({ ...prev, [activeLanguage]: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="postalCode" className="text-xs font-medium">{t('admin.listings.dialog.form.postal_code')}</Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      placeholder={t('admin.listings.dialog.form.placeholders.postal_code')}
                      className="h-8 text-sm"
                      defaultValue={initialData?.postalCode ?? ''}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor="latitude" className="text-xs font-medium">{t('admin.listings.dialog.form.latitude')}</Label>
                    <Input
                      id="latitude"
                      name="latitude"
                      type="number"
                      step="any"
                      placeholder={t('admin.listings.dialog.form.placeholders.latitude')}
                      className="h-8 text-sm"
                      defaultValue={initialData?.latitude ?? ''}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="longitude" className="text-xs font-medium">{t('admin.listings.dialog.form.longitude')}</Label>
                    <Input
                      id="longitude"
                      name="longitude"
                      type="number"
                      step="any"
                      placeholder={t('admin.listings.dialog.form.placeholders.longitude')}
                      className="h-8 text-sm"
                      defaultValue={initialData?.longitude ?? ''}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Features & Settings (4/12) */}
            <div className="lg:col-span-4 space-y-4">
              
              {/* Building & Property Types */}
              <div className="bg-white border border-gray-200 rounded-lg p-3 space-y-3">
                <h3 className="text-sm font-semibold text-gray-900">{t('admin.listings.dialog.sections.building_ownership')}</h3>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor="status" className="text-xs font-medium">{t('admin.listings.dialog.form.status')}</Label>
                    <Select name="status" defaultValue={initialData?.status || 'ACTIVE'}>
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue placeholder={t('admin.listings.dialog.form.placeholders.status')} />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-md">
                        {LISTING_STATUSES.map((status) => (
                          <SelectItem key={status} value={status} className="text-gray-700 hover:bg-gray-50">
                            {t(`admin.listings.dialog.form.listing_statuses.${status.toLowerCase()}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="buildingType" className="text-xs font-medium">{t('admin.listings.dialog.form.building_type_label')}</Label>
                    <Select name="buildingType" defaultValue={initialData?.buildingType || undefined}>
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue placeholder={t('admin.listings.dialog.form.placeholders.select_type')} />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-md">
                        {BUILDING_TYPES.map((type) => (
                          <SelectItem key={type} value={type} className="text-gray-700 hover:bg-gray-50">
                            {t(`admin.listings.dialog.form.building_types.${type.toLowerCase()}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor="heatingType" className="text-xs font-medium">{t('admin.listings.dialog.form.heating_label')}</Label>
                    <Select name="heatingType" defaultValue={initialData?.heatingType || undefined}>
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue placeholder={t('admin.listings.dialog.form.placeholders.select_type')} />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-md">
                        {HEATING_TYPES.map((type) => (
                          <SelectItem key={type} value={type} className="text-gray-700 hover:bg-gray-50">
                            {t(`admin.listings.dialog.form.heating_types.${type.toLowerCase()}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="ownershipType" className="text-xs font-medium">{t('admin.listings.dialog.form.ownership_label')}</Label>
                    <Select name="ownershipType" defaultValue={initialData?.ownershipType || undefined}>
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue placeholder={t('admin.listings.dialog.form.placeholders.select_type')} />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 shadow-md">
                        {OWNERSHIP_TYPES.map((type) => (
                          <SelectItem key={type} value={type} className="text-gray-700 hover:bg-gray-50">
                            {t(`admin.listings.dialog.form.ownership_types.${type.toLowerCase()}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor={`buildingCondition${activeLanguage.toUpperCase()}`} className="text-xs font-medium">{t('admin.listings.dialog.form.condition_in_lang', { lang: activeLanguage.toUpperCase() })}</Label>
                    <Input
                      id={`buildingCondition${activeLanguage.toUpperCase()}`}
                      name={`buildingCondition${activeLanguage.toUpperCase()}`}
                      placeholder={t('admin.listings.dialog.form.placeholders.condition')}
                      className="h-8 text-sm"
                      value={buildingConditionByLang[activeLanguage] || ''}
                      onChange={(e) => setBuildingConditionByLang(prev => ({ ...prev, [activeLanguage]: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="availableFrom" className="text-xs font-medium">{t('admin.listings.dialog.form.available_from')}</Label>
                    <Input
                      id="availableFrom"
                      name="availableFrom"
                      type="date"
                      className="h-8 text-sm"
                      defaultValue={initialData?.availableFrom ? new Date(initialData.availableFrom).toISOString().slice(0,10) : ''}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="mortgagePossible"
                    name="mortgagePossible"
                    className="data-[state=checked]:bg-gray-900 data-[state=checked]:text-white h-4 w-4"
                    defaultChecked={!!initialData?.mortgagePossible}
                  />
                  <Label htmlFor="mortgagePossible" className="text-xs text-gray-700">{t('admin.listings.dialog.form.mortgage_possible')}</Label>
                </div>
              </div>

              {/* Amenities */}
              <div className="bg-white border border-gray-200 rounded-lg p-3 space-y-3">
                <h3 className="text-sm font-semibold text-gray-900">{t('admin.listings.dialog.sections.amenities.title')}</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="garage"
                      name="garage"
                      className="data-[state=checked]:bg-gray-900 data-[state=checked]:text-white h-4 w-4"
                      defaultChecked={!!initialData?.garage}
                    />
                    <Label htmlFor="garage" className="text-xs text-gray-700">{t('admin.listings.dialog.sections.amenities.garage')}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="elevator"
                      name="elevator"
                      className="data-[state=checked]:bg-gray-900 data-[state=checked]:text-white h-4 w-4"
                      defaultChecked={!!initialData?.elevator}
                    />
                    <Label htmlFor="elevator" className="text-xs text-gray-700">{t('admin.listings.dialog.sections.amenities.elevator')}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="balcony"
                      name="balcony"
                      className="data-[state=checked]:bg-gray-900 data-[state=checked]:text-white h-4 w-4"
                      defaultChecked={!!initialData?.balcony}
                    />
                    <Label htmlFor="balcony" className="text-xs text-gray-700">{t('admin.listings.dialog.sections.amenities.balcony')}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="furnished"
                      name="furnished"
                      className="data-[state=checked]:bg-gray-900 data-[state=checked]:text-white h-4 w-4"
                      defaultChecked={!!initialData?.furnished}
                    />
                    <Label htmlFor="furnished" className="text-xs text-gray-700">{t('admin.listings.dialog.sections.amenities.furnished')}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="pool"
                      name="pool"
                      className="data-[state=checked]:bg-gray-900 data-[state=checked]:text-white h-4 w-4"
                      defaultChecked={!!initialData?.pool}
                    />
                    <Label htmlFor="pool" className="text-xs text-gray-700">{t('admin.listings.dialog.sections.amenities.pool')}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="airConditioning"
                      name="airConditioning"
                      className="data-[state=checked]:bg-gray-900 data-[state=checked]:text-white h-4 w-4"
                      defaultChecked={!!initialData?.airConditioning}
                    />
                    <Label htmlFor="airConditioning" className="text-xs text-gray-700">{t('admin.listings.dialog.sections.amenities.air_conditioning')}</Label>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="bg-white border border-gray-200 rounded-lg p-3 space-y-3">
                <h3 className="text-sm font-semibold text-gray-900">{t('admin.listings.dialog.sections.features')}</h3>
                <Input
                  id="features"
                  name="features"
                  placeholder={t('admin.listings.dialog.form.placeholders.features')}
                  onKeyDown={handleFeatureKeyDown}
                  className="h-8 text-sm"
                />
                {featuresByLang[activeLanguage]?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {featuresByLang[activeLanguage].map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs"
                      >
                        <span>{feature}</span>
                        <button
                          type="button"
                          onClick={() => removeFeature(feature)}
                          className="text-gray-500 hover:text-gray-700 text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className="bg-white border border-gray-200 rounded-lg p-3 space-y-3">
                <h3 className="text-sm font-semibold text-gray-900">{t('admin.listings.dialog.sections.tags')}</h3>
                <Input
                  id="tags"
                  name="tags"
                  placeholder={t('admin.listings.dialog.form.placeholders.tags')}
                  onKeyDown={handleTagKeyDown}
                  className="h-8 text-sm"
                />
                {tagsByLang[activeLanguage]?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {tagsByLang[activeLanguage].map((tag, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-gray-500 hover:text-gray-700 text-xs"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Media URLs */}
              <div className="bg-white border border-gray-200 rounded-lg p-3 space-y-3">
                <h3 className="text-sm font-semibold text-gray-900">{t('admin.listings.dialog.sections.media_links.title')}</h3>
                <div className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="videoUrl" className="text-xs font-medium">{t('admin.listings.dialog.sections.media_links.video_url')}</Label>
                    <Input
                      id="videoUrl"
                      name="videoUrl"
                      type="url"
                      placeholder={t('admin.listings.dialog.form.placeholders.video_url')}
                      className="h-8 text-sm"
                      defaultValue={initialData?.videoUrl ?? ''}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="virtualTourUrl" className="text-xs font-medium">{t('admin.listings.dialog.sections.media_links.virtual_tour_url')}</Label>
                    <Input
                      id="virtualTourUrl"
                      name="virtualTourUrl"
                      type="url"
                      placeholder={t('admin.listings.dialog.form.placeholders.virtual_tour_url')}
                      className="h-8 text-sm"
                      defaultValue={initialData?.virtualTourUrl ?? ''}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-3 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto border-gray-200 hover:bg-gray-50 text-gray-700"
            >
              {t('admin.listings.dialog.form.cancel')}
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-gray-900 text-white hover:bg-gray-800"
            >
              {loading ? t('admin.listings.dialog.form.creating') : t('admin.listings.dialog.form.create')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}