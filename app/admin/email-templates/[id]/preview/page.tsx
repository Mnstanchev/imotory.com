'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface EmailTemplate {
  id: string;
  name: string;
  type: string;
  subject: Record<string, string>;
  body: Record<string, string>;
  variables: string[];
  isActive: boolean;
}

interface PreviewData {
  subject: Record<string, string>;
  body: Record<string, string>;
}

export default function PreviewEmailTemplatePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [template, setTemplate] = useState<EmailTemplate | null>(null);
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [testEmail, setTestEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);

  useEffect(() => {
    const resolveParamsAndFetch = async () => {
      const resolved = await params;
      setResolvedParams(resolved);
      fetchTemplate(resolved.id);
    };
    resolveParamsAndFetch();
  }, [params]);

  const fetchTemplate = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/email-templates/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch template');
      }
      const data = await response.json();
      setTemplate(data);
      
      // Initialize variables state
      const initialVariables = data.variables.reduce((acc: Record<string, string>, variable: string) => {
        acc[variable] = '';
        return acc;
      }, {});
      setVariables(initialVariables);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching template:', error);
      toast.error('Failed to fetch template');
      router.push('/admin/email-templates');
    }
  };

  const handlePreview = async () => {
    if (!template || !resolvedParams) return;

    try {
      const response = await fetch(`/api/admin/email-templates/${resolvedParams.id}/preview`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: template.subject,
          body: template.body,
          variables,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate preview');
      }

      const data = await response.json();
      setPreviewData(data.preview);
    } catch (error) {
      console.error('Error generating preview:', error);
      toast.error('Failed to generate preview');
    }
  };

  const handleSendTest = async () => {
    if (!testEmail || !resolvedParams) {
      toast.error('Please enter a test email address');
      return;
    }

    try {
      setSending(true);
      const response = await fetch(
        `/api/admin/email-templates/${resolvedParams.id}/preview?email=${encodeURIComponent(testEmail)}`,
        { method: 'PUT' }
      );

      if (!response.ok) {
        throw new Error('Failed to send test email');
      }

      toast.success('Test email sent successfully');
    } catch (error) {
      console.error('Error sending test email:', error);
      toast.error('Failed to send test email');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!template) {
    return <div>Template not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.push('/admin/email-templates')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">{template.name} - Preview</h1>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card className="p-4 space-y-4">
          <h2 className="text-lg font-semibold">Variables</h2>
          <div className="grid gap-4">
            {template.variables.map((variable) => (
              <div key={variable} className="space-y-2">
                <Label htmlFor={variable}>{variable}</Label>
                <Input
                  id={variable}
                  value={variables[variable]}
                  onChange={(e) =>
                    setVariables({ ...variables, [variable]: e.target.value })
                  }
                  placeholder={`Enter value for ${variable}`}
                />
              </div>
            ))}
          </div>
          <Button onClick={handlePreview} className="w-full">
            Generate Preview
          </Button>
        </Card>

        <Card className="p-4 space-y-4">
          <h2 className="text-lg font-semibold">Send Test Email</h2>
          <div className="space-y-2">
            <Label htmlFor="testEmail">Test Email Address</Label>
            <Input
              id="testEmail"
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="Enter test email address"
            />
          </div>
          <Button onClick={handleSendTest} disabled={sending} className="w-full">
            <Send className="w-4 h-4 mr-2" />
            {sending ? 'Sending...' : 'Send Test Email'}
          </Button>
        </Card>
      </div>

      {previewData && (
        <Card className="p-4 space-y-4">
          <h2 className="text-lg font-semibold">Preview</h2>
          <Tabs defaultValue="en">
            <TabsList>
              <TabsTrigger value="en">English</TabsTrigger>
              <TabsTrigger value="bg">Bulgarian</TabsTrigger>
              <TabsTrigger value="ru">Russian</TabsTrigger>
            </TabsList>

            <TabsContent value="en" className="space-y-4">
              <div className="space-y-2">
                <Label>Subject</Label>
                <div className="p-2 bg-gray-50 rounded">{previewData.subject.en}</div>
              </div>
              <div className="space-y-2">
                <Label>Body</Label>
                <div
                  className="p-2 bg-gray-50 rounded whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: previewData.body.en }}
                />
              </div>
            </TabsContent>

            <TabsContent value="bg" className="space-y-4">
              <div className="space-y-2">
                <Label>Subject</Label>
                <div className="p-2 bg-gray-50 rounded">{previewData.subject.bg}</div>
              </div>
              <div className="space-y-2">
                <Label>Body</Label>
                <div
                  className="p-2 bg-gray-50 rounded whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: previewData.body.bg }}
                />
              </div>
            </TabsContent>

            <TabsContent value="ru" className="space-y-4">
              <div className="space-y-2">
                <Label>Subject</Label>
                <div className="p-2 bg-gray-50 rounded">{previewData.subject.ru}</div>
              </div>
              <div className="space-y-2">
                <Label>Body</Label>
                <div
                  className="p-2 bg-gray-50 rounded whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: previewData.body.ru }}
                />
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      )}
    </div>
  );
}