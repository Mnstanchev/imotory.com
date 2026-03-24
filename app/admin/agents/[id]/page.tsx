'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Edit, Mail, Phone, Globe, Facebook, Instagram, Linkedin, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/language-context';

interface Agent {
  id: string;
  name: { en: string; bg?: string; ru?: string };
  email: string;
  phone: string;
  bio?: { en?: string; bg?: string; ru?: string };
  avatar?: string;
  socialLinks?: { [key: string]: string };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  listings: any[];
  _count: {
    listings: number;
  };
}

export default function AgentDetailPage() {
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const agentId = params.id as string;
  const { t, currentLanguage } = useLanguage();
  
  // Helper function to get localized text
  const getLocalizedText = (textObj: any) => {
    if (!textObj) return '';
    return textObj[currentLanguage] || textObj.en || textObj.bg || '';
  };

  useEffect(() => {
    fetchAgent();
  }, [agentId]);

  const fetchAgent = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/agents/${agentId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch agent');
      }
      const result = await response.json();
      setAgent(result.data || result);
    } catch (error) {
      console.error('Error fetching agent:', error);
      toast.error('Failed to load agent details');
      router.push('/admin/agents');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading agent details...</div>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Agent not found</div>
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
            <h1 className="text-3xl font-bold text-gray-900">Agent Details</h1>
            <p className="text-gray-600 mt-1">View agent profile and information</p>
          </div>
        </div>
        <Button
          onClick={() => router.push(`/admin/agents/${agent.id}/edit`)}
          className="bg-gray-900 text-white hover:bg-gray-800"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit Agent
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agent Profile Card */}
        <div className="lg:col-span-1">
          <Card className="border-gray-200">
            <CardHeader className="text-center">
              <Avatar className="h-24 w-24 mx-auto ring-4 ring-white shadow-lg">
                <AvatarImage src={agent.avatar} alt={agent.name?.en || 'Agent'} />
                <AvatarFallback className="bg-gray-900 text-white text-xl">
                  {agent.name?.en?.split(' ').map(n => n[0]).join('').toUpperCase() || 'A'}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2 mt-4">
                <CardTitle className="text-xl text-gray-900">{agent.name?.en}</CardTitle>
                <Badge
                  variant={agent.isActive ? 'default' : 'outline'}
                  className={agent.isActive ? 'bg-gray-900 text-white' : 'border-gray-200 text-gray-700'}
                >
                  {agent.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Contact Information */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{agent.email}</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">{agent.phone}</span>
                </div>
              </div>

              {/* Social Links */}
              {agent.socialLinks && Object.keys(agent.socialLinks).length > 0 && (
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-3">Social Links</h4>
                  <div className="space-y-2">
                    {Object.entries(agent.socialLinks).map(([platform, url]) => {
                      if (!url) return null;
                      const Icon = platform === 'facebook' ? Facebook :
                                  platform === 'instagram' ? Instagram :
                                  platform === 'linkedin' ? Linkedin : Globe;
                      return (
                        <a
                          key={platform}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-3 text-gray-600 hover:text-gray-900 transition-colors"
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-sm capitalize">{platform}</span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="pt-4 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{agent._count.listings}</div>
                  <div className="text-sm text-gray-500">{t('forms.active_listings')}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Details and Bio */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bio Card */}
          {getLocalizedText(agent.bio) && (
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-gray-900">{t('forms.biography')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {getLocalizedText(agent.bio)}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Listings */}
          <Card className="border-gray-200">
            <CardHeader>
              <CardTitle className="text-gray-900">{t('forms.recent_listings')}</CardTitle>
              <CardDescription>Latest properties managed by this agent</CardDescription>
            </CardHeader>
            <CardContent>
              {agent.listings && agent.listings.length > 0 ? (
                <div className="space-y-4">
                  {agent.listings.slice(0, 5).map((listing: any) => (
                    <div key={listing.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{listing.title?.en}</h4>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                          <span>{listing.propertyType}</span>
                          <span>•</span>
                          <span>{listing.listingType}</span>
                          {listing.location && (
                            <>
                              <span>•</span>
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-3 h-3" />
                                <span>{listing.location.name?.en}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">
                          €{listing.price?.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(listing.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-lg font-medium mb-2">No listings yet</div>
                  <p className="text-sm">This agent hasn't created any listings.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}