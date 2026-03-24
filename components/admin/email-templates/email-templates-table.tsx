'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Edit, Trash2, Eye, MoreVertical, Send } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/language-context';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface EmailTemplate {
  id: string;
  name: string;
  type: string;
  subject: Record<string, string>;
  body: Record<string, string>;
  variables: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface EmailTemplatesTableProps {
  searchTerm: string;
}

export default function EmailTemplatesTable({ searchTerm }: EmailTemplatesTableProps) {
  const { t } = useLanguage();
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchTemplates();
  }, [searchTerm]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/email-templates');
      if (!response.ok) {
        throw new Error('Failed to fetch templates');
      }
      const data = await response.json();
      if (data?.templates && Array.isArray(data.templates)) {
        setTemplates(data.templates);
      } else {
  
        setTemplates([]);
      }
    } catch (error) {

      toast.error(t('admin.email_templates.messages.error_loading'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedTemplate) return;

    try {
      const response = await fetch(`/api/admin/email-templates/${selectedTemplate.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete template');
      }

      toast.success(t('admin.email_templates.messages.deleted'));
      fetchTemplates();
    } catch (error) {

      toast.error(t('admin.email_templates.messages.error_deleting'));
    } finally {
      setDeleteDialogOpen(false);
      setSelectedTemplate(null);
    }
  };

  const handleEdit = (template: EmailTemplate) => {
    router.push(`/admin/email-templates/${template.id}`);
  };

  const handlePreview = (template: EmailTemplate) => {
    router.push(`/admin/email-templates/${template.id}/preview`);
  };

  if (loading) {
    return <div>{t('admin.table.loading')}</div>;
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('admin.email_templates.fields.name')}</TableHead>
            <TableHead>{t('admin.email_templates.fields.type')}</TableHead>
            <TableHead>{t('common.status')}</TableHead>
            <TableHead>{t('admin.email_templates.fields.last_used')}</TableHead>
            <TableHead className="text-right">{t('common.actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {templates.map((template) => (
            <TableRow key={template.id}>
              <TableCell className="font-medium">{template.name}</TableCell>
              <TableCell>{template.type}</TableCell>
              <TableCell>
                <Badge 
                  variant={template.isActive ? 'default' : 'secondary'}
                  className={template.isActive ? 'bg-green-600 hover:bg-green-700' : ''}
                >
                  {template.isActive ? t('common.active') : t('common.inactive')}
                </Badge>
              </TableCell>
              <TableCell>{new Date(template.updatedAt).toLocaleDateString()}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                   <DropdownMenuContent align="end" className="bg-white border border-gray-200 shadow-md">
                    <DropdownMenuItem onClick={() => handleEdit(template)} className="text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                      <Edit className="mr-2 h-4 w-4" />
                      {t('common.edit')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handlePreview(template)} className="text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                      <Eye className="mr-2 h-4 w-4" />
                      {t('common.preview')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(template)} className="text-red-600 hover:bg-gray-50 hover:text-red-700">
                      <Trash2 className="mr-2 h-4 w-4" />
                      {t('common.delete')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-white border border-gray-200 shadow-md">
          <DialogHeader>
            <DialogTitle className="text-gray-900">{t('admin.email_templates.messages.confirm_delete')}</DialogTitle>
            <DialogDescription className="text-gray-600">
              {t('admin.email_templates.messages.confirm_delete')} "{selectedTemplate?.name}"?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} className="border-gray-200 hover:bg-gray-50 text-gray-700">
              {t('common.cancel')}
            </Button>
            <Button variant="destructive" onClick={confirmDelete} className="bg-gray-900 hover:bg-gray-800 text-white">
              {t('common.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}