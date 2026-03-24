'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { LanguageTabs } from '@/components/ui/language-tabs';
import { ImageUpload } from '@/components/admin/image-upload';
import { useCreateAgent } from '@/hooks/use-agents';
import { useLanguage } from '@/contexts/language-context';

interface CreateAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAgentCreated?: () => void;
}

interface AgentFormData {
  name: { en: string; bg?: string; ru?: string };
  email: string;
  phone: string;
  bio: { en: string; bg?: string; ru?: string };
  avatar?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  isActive: boolean;
}

const initialFormData: AgentFormData = {
  name: { en: '' },
  email: '',
  phone: '',
  bio: { en: '' },
  socialLinks: {
    facebook: '',
    twitter: '',
    linkedin: '',
    instagram: '',
  },
  isActive: true,
};

export function CreateAgentDialog({ open, onOpenChange, onAgentCreated }: CreateAgentDialogProps) {
  const [formData, setFormData] = useState<AgentFormData>(initialFormData);
  const [currentLang, setCurrentLang] = useState<'en' | 'bg' | 'ru'>('en');
  const router = useRouter();
  const createAgentMutation = useCreateAgent();
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name.en?.trim()) {
      toast.error(t('admin.agents.dialog.validation.name_required'));
      return;
    }
    if (!formData.email?.trim()) {
      toast.error(t('admin.agents.dialog.validation.email_required'));
      return;
    }
    if (!formData.phone?.trim()) {
      toast.error(t('admin.agents.dialog.validation.phone_required'));
      return;
    }
    if (!formData.bio.en?.trim()) {
      toast.error(t('admin.agents.dialog.validation.bio_required'));
      return;
    }
    
    // Filter out empty social links
    const socialLinks = Object.entries(formData.socialLinks || {}).reduce((acc, [key, value]) => {
      if (value) acc[key] = value;
      return acc;
    }, {} as Record<string, string>);

    createAgentMutation.mutate({
      ...formData,
      socialLinks: Object.keys(socialLinks).length > 0 ? socialLinks : undefined,
    }, {
      onSuccess: () => {
        onOpenChange(false);
        setFormData(initialFormData);
        if (onAgentCreated) {
          onAgentCreated();
        }
      }
    });
  };

  const handleImageUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload/agents/avatar', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      setFormData(prev => ({ ...prev, avatar: data.url }));
      toast.success(t('admin.agents.dialog.success.image_uploaded'));
    } catch (error) {
      
      toast.error(t('admin.agents.dialog.errors.image_upload_failed'));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">{t('admin.agents.dialog.title')}</DialogTitle>
          <DialogDescription className="text-gray-600">
            {t('admin.agents.dialog.description')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Upload */}
          <div className="space-y-2">
            <Label className="text-gray-700">{t('admin.agents.dialog.profile_photo')}</Label>
            <ImageUpload
              onImagesChange={(urls) => setFormData(prev => ({ ...prev, avatar: urls[0] }))}
              initialImages={formData.avatar ? [formData.avatar] : []}
              maxImages={1}
              entityType="agents"

            />
          </div>

          {/* Name with Language Tabs */}
          <div className="space-y-2">
            <Label className="text-gray-700">
              {t('admin.agents.dialog.name')} <span className="text-red-500">*</span>
            </Label>
            <div className="space-y-2">
              <LanguageTabs
                activeLanguage={currentLang}
                onLanguageChange={setCurrentLang}
                className="mt-2"
              />
              {currentLang === 'en' && (
                <Input
                  placeholder={t('admin.agents.dialog.name_placeholder.en')}
                  value={formData.name.en}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    name: { ...prev.name, en: e.target.value }
                  }))}
                  className="border-gray-200 focus:border-gray-400 focus:ring-gray-400"
                />
              )}
              {currentLang === 'bg' && (
                <Input
                  placeholder={t('admin.agents.dialog.name_placeholder.bg')}
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
                  placeholder={t('admin.agents.dialog.name_placeholder.ru')}
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

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-700">
                {t('admin.agents.dialog.email')} <span className="text-red-500">*</span>
              </Label>
              <Input
                type="email"
                placeholder={t('admin.agents.dialog.email_placeholder')}
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="border-gray-200 focus:border-gray-400 focus:ring-gray-400"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-700">
                {t('admin.agents.dialog.phone')} <span className="text-red-500">*</span>
              </Label>
              <Input
                type="tel"
                placeholder={t('admin.agents.dialog.phone_placeholder')}
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="border-gray-200 focus:border-gray-400 focus:ring-gray-400"
              />
            </div>
          </div>

          {/* Bio with Language Tabs */}
          <div className="space-y-2 mt-6">
            <Label className="text-gray-700 text-lg font-medium">
              {t('admin.agents.dialog.bio')} <span className="text-red-500">*</span>
            </Label>
            <p className="text-sm text-gray-500 mt-1">{t('admin.agents.dialog.bio_description')}</p>
            <div className="space-y-2">
              <LanguageTabs
                activeLanguage={currentLang}
                onLanguageChange={setCurrentLang}
                className="mt-2"
              />
              {currentLang === 'en' && (
                <Textarea
                  placeholder={t('admin.agents.dialog.bio_placeholder.en')}
                  value={formData.bio.en}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    bio: { ...prev.bio, en: e.target.value }
                  }))}
                  className="min-h-[150px] border-gray-200 focus:border-gray-400 focus:ring-gray-400 text-base"
                />
              )}
              {currentLang === 'bg' && (
                <Textarea
                  placeholder={t('admin.agents.dialog.bio_placeholder.bg')}
                  value={formData.bio.bg}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    bio: { ...prev.bio, bg: e.target.value }
                  }))}
                  className="min-h-[150px] border-gray-200 focus:border-gray-400 focus:ring-gray-400 text-base"
                />
              )}
              {currentLang === 'ru' && (
                <Textarea
                  placeholder={t('admin.agents.dialog.bio_placeholder.ru')}
                  value={formData.bio.ru}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    bio: { ...prev.bio, ru: e.target.value }
                  }))}
                  className="min-h-[150px] border-gray-200 focus:border-gray-400 focus:ring-gray-400 text-base"
                />
              )}
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <Label className="text-gray-700">{t('admin.agents.dialog.social_links')}</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(formData.socialLinks || {}).map(([platform, value]) => (
                <div key={platform} className="space-y-2">
                  <Label className="capitalize text-gray-700">{t(`admin.agents.dialog.social_platforms.${platform}`) || platform}</Label>
                  <Input
                    placeholder={t('admin.agents.dialog.social_placeholder', { platform: t(`admin.agents.dialog.social_platforms.${platform}`) || platform })}
                    value={value}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      socialLinks: {
                        ...prev.socialLinks,
                        [platform]: e.target.value
                      }
                    }))}
                    className="border-gray-200 focus:border-gray-400 focus:ring-gray-400"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Active Status */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked: boolean) => 
                  setFormData(prev => ({ ...prev, isActive: checked as boolean }))
                }
                className="border-gray-200 data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900"
              />
              <Label 
                htmlFor="isActive" 
                className="text-gray-700 font-medium cursor-pointer select-none"
              >
                {t('admin.agents.dialog.active_agent')}
              </Label>
            </div>
            <p className="text-sm text-gray-500 ml-6">
              {t('admin.agents.dialog.active_description')}
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
              {t('admin.agents.dialog.cancel')}
            </Button>
            <Button
              type="submit"
              disabled={createAgentMutation.isPending}
              className="bg-gray-900 text-white hover:bg-gray-800"
            >
              {createAgentMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t('admin.agents.dialog.creating')}
                </>
              ) : (
                t('admin.agents.dialog.create')
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}