'use client';

import { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import EmailTemplatesTable from '@/components/admin/email-templates/email-templates-table';
import CreateEmailTemplateDialog from '@/components/admin/email-templates/create-email-template-dialog';
import { useLanguage } from '@/contexts/language-context';

export default function EmailTemplatesPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">{t('pages.email_templates')}</h1>
        <Button 
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-gray-900 text-white hover:bg-gray-800"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('pages.create_template')}
        </Button>
      </div>

      <Card className="p-4 border-gray-200 bg-white shadow-sm">
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <Input
              placeholder={t('pages.search_templates')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm pl-10 border-gray-200"
            />
          </div>
          <Button 
            variant="outline" 
            className="border-gray-200 hover:bg-gray-50 text-gray-700"
          >
            <Filter className="w-4 h-4 mr-2" />
            {t('pages.filter')}
          </Button>
        </div>

        <EmailTemplatesTable searchTerm={searchTerm} />
      </Card>

      <CreateEmailTemplateDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
}