'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LanguageTabs } from '@/components/ui/language-tabs';
import { ImageUpload } from '@/components/admin/image-upload';
import { useQuery } from '@tanstack/react-query';
import { useUpdateAgent } from '@/hooks/use-agents';
import { useLanguage } from '@/contexts/language-context';

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

export default function EditAgentPage() {
  const [formData, setFormData] = useState<AgentFormData>({
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
  });
  const [currentLang, setCurrentLang] = useState<'en' | 'bg' | 'ru'>('en');
  const router = useRouter();
  const params = useParams();
  const agentId = params.id as string;
  const { t } = useLanguage();
  
  // TanStack Query hooks
  const updateAgentMutation = useUpdateAgent();
  const { data: agent, isLoading, error } = useQuery({
    queryKey: ['agent', agentId],
    queryFn: async () => {
      const response = await fetch(`/api/agents/${agentId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch agent');
      }
      const result = await response.json();
      return result.data || result;
    },
  });

  // Update form data when agent is loaded
  useEffect(() => {
    if (agent) {
      setFormData({
        name: agent.name || { en: '' },
        email: agent.email || '',
        phone: agent.phone || '',
        bio: agent.bio || { en: '' },
        avatar: agent.avatar || '',
        socialLinks: agent.socialLinks || {
          facebook: '',
          twitter: '',
          linkedin: '',
          instagram: '',
        },
        isActive: agent.isActive ?? true,
      });
    }
  }, [agent]);

  // Handle error state
  if (error) {
    toast.error(t('api_errors.failed_to_load_agent'));
    router.push('/admin/agents');
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name.en?.trim()) {
      toast.error('Name in English is required');
      return;
    }
    if (!formData.email?.trim()) {
      toast.error('Email is required');
      return;
    }
    if (!formData.phone?.trim()) {
      toast.error('Phone number is required');
      return;
    }
    
    // Filter out empty social links
    const socialLinks = Object.entries(formData.socialLinks || {}).reduce((acc, [key, value]) => {
      if (value) acc[key] = value;
      return acc;
    }, {} as Record<string, string>);

    updateAgentMutation.mutate({
      id: agentId,
      data: {
        ...formData,
        socialLinks: Object.keys(socialLinks).length > 0 ? socialLinks : undefined,
      }
    }, {
      onSuccess: () => {
        // Navigate back to agents table with immediate updates
        router.push('/admin/agents');
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading agent details...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="border-gray-200 hover:bg-gray-50 text-gray-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Agent</h1>
            <p className="text-gray-600 mt-1">Update agent profile and information</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl">
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Agent Information</CardTitle>
            <CardDescription>Update the agent's profile details and contact information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar Upload */}
            <div className="space-y-2">
              <Label className="text-gray-700">Profile Photo</Label>
              <ImageUpload
                onImagesChange={(urls) => setFormData(prev => ({ ...prev, avatar: urls[0] }))}
                initialImages={formData.avatar ? [formData.avatar] : []}
                maxImages={1}
                entityType="agents"
                entityId={agentId}
              />
            </div>

            {/* Name with Language Tabs */}
            <div className="space-y-2">
              <Label className="text-gray-700">
                Name <span className="text-red-500">*</span>
              </Label>
              <div className="space-y-2">
                <LanguageTabs
                  activeLanguage={currentLang}
                  onLanguageChange={setCurrentLang}
                  className="mt-2"
                />
                {currentLang === 'en' && (
                  <Input
                    placeholder="Enter name in English"
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
                    placeholder="Въведете име на български"
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
                    placeholder="Введите имя на русском"
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
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="email"
                  placeholder="agent@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="border-gray-200 focus:border-gray-400 focus:ring-gray-400"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-700">
                  Phone <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="tel"
                  placeholder="+1234567890"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  className="border-gray-200 focus:border-gray-400 focus:ring-gray-400"
                />
              </div>
            </div>

            {/* Bio with Language Tabs */}
            <div className="space-y-2 mt-6">
              <Label className="text-gray-700 text-lg font-medium">{t('forms.bio')}</Label>
              <p className="text-sm text-gray-500 mt-1">{t('forms.bio_description')}</p>
              <div className="space-y-2">
                <LanguageTabs
                  activeLanguage={currentLang}
                  onLanguageChange={setCurrentLang}
                  className="mt-2"
                />
                {currentLang === 'en' && (
                  <Textarea
                    placeholder={t('forms.enter_bio_english')}
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
                    placeholder={t('forms.enter_bio_bulgarian')}
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
                    placeholder={t('forms.enter_bio_russian')}
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
              <Label className="text-gray-700">Social Links</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(formData.socialLinks || {}).map(([platform, value]) => (
                  <div key={platform} className="space-y-2">
                    <Label className="capitalize text-gray-700">{platform}</Label>
                    <Input
                      placeholder={`${platform} profile URL`}
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
                  Active Agent
                </Label>
              </div>
              <p className="text-sm text-gray-500 ml-6">
                Active agents are visible on the website and can be assigned to listings
              </p>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="border-gray-200 hover:bg-gray-50 text-gray-700"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateAgentMutation.isPending}
                className="bg-gray-900 text-white hover:bg-gray-800"
              >
                {updateAgentMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}