'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface CreateEmailTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TEMPLATE_TYPES = [
  { value: 'booking_confirmation', label: 'Booking Confirmation' },
  { value: 'agent_notification', label: 'Agent Notification' },
  { value: 'contact_form', label: 'Contact Form' },
  { value: 'welcome_email', label: 'Welcome Email' },
  { value: 'password_reset', label: 'Password Reset' },
];

export default function CreateEmailTemplateDialog({
  open,
  onOpenChange,
}: CreateEmailTemplateDialogProps) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [subject, setSubject] = useState({ en: '', bg: '', ru: '' });
  const [body, setBody] = useState({ en: '', bg: '', ru: '' });
  const [variables, setVariables] = useState('');

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const response = await fetch('/api/admin/email-templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          type,
          subject,
          body,
          variables: variables.split(',').map(v => v.trim()).filter(Boolean),
          isActive: true,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create template');
      }

      toast.success('Email template created successfully');
      onOpenChange(false);
      resetForm();
    } catch (error) {

      toast.error('Failed to create template');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setType('');
    setSubject({ en: '', bg: '', ru: '' });
    setBody({ en: '', bg: '', ru: '' });
    setVariables('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Create Email Template</DialogTitle>
          <DialogDescription>
            Create a new email template with multilingual support.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Template Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Booking Confirmation Email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Template Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {TEMPLATE_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="variables">Variables (comma-separated)</Label>
            <Input
              id="variables"
              value={variables}
              onChange={(e) => setVariables(e.target.value)}
              placeholder="e.g., userName, bookingDate, listingTitle"
            />
          </div>

          <Tabs defaultValue="en" className="w-full">
            <TabsList>
              <TabsTrigger value="en">English</TabsTrigger>
              <TabsTrigger value="bg">Bulgarian</TabsTrigger>
              <TabsTrigger value="ru">Russian</TabsTrigger>
            </TabsList>

            <TabsContent value="en">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject-en">Subject (English)</Label>
                  <Input
                    id="subject-en"
                    value={subject.en}
                    onChange={(e) => setSubject({ ...subject, en: e.target.value })}
                    placeholder="Enter subject in English"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="body-en">Body (English)</Label>
                  <Textarea
                    id="body-en"
                    value={body.en}
                    onChange={(e) => setBody({ ...body, en: e.target.value })}
                    placeholder="Enter email body in English"
                    rows={10}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="bg">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject-bg">Subject (Bulgarian)</Label>
                  <Input
                    id="subject-bg"
                    value={subject.bg}
                    onChange={(e) => setSubject({ ...subject, bg: e.target.value })}
                    placeholder="Enter subject in Bulgarian"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="body-bg">Body (Bulgarian)</Label>
                  <Textarea
                    id="body-bg"
                    value={body.bg}
                    onChange={(e) => setBody({ ...body, bg: e.target.value })}
                    placeholder="Enter email body in Bulgarian"
                    rows={10}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="ru">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject-ru">Subject (Russian)</Label>
                  <Input
                    id="subject-ru"
                    value={subject.ru}
                    onChange={(e) => setSubject({ ...subject, ru: e.target.value })}
                    placeholder="Enter subject in Russian"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="body-ru">Body (Russian)</Label>
                  <Textarea
                    id="body-ru"
                    value={body.ru}
                    onChange={(e) => setBody({ ...body, ru: e.target.value })}
                    placeholder="Enter email body in Russian"
                    rows={10}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Creating...' : 'Create Template'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}