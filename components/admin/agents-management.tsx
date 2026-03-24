'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Plus, Search, Edit, Trash2, Mail, Phone, Loader2, Eye } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CreateAgentDialog } from '@/components/admin/agents/create-agent-dialog';
import { useAgents, useDeleteAgent, useToggleAgentStatus } from '@/hooks/use-agents';

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
  _count: {
    listings: number;
  };
}

export function AgentsManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const { t, currentLanguage } = useLanguage();

  // Helper function to get localized text
  const getLocalizedText = (textObj: any) => {
    if (!textObj) return '';
    return textObj[currentLanguage] || textObj.en || textObj.bg || '';
  };

  // TanStack Query hooks
  const { data, isLoading, error } = useAgents({ 
    page: currentPage, 
    limit: 10, 
    search: searchTerm 
  });
  const deleteAgentMutation = useDeleteAgent();
  const toggleStatusMutation = useToggleAgentStatus();

  // Memoized filtered agents (client-side filtering for immediate response)
  const agents = data?.agents || [];
  const pagination = data?.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  };

  // Filtered agents for immediate client-side response
  const filteredAgents = useMemo(() => {
    if (!searchTerm) return agents;
    return agents.filter(agent =>
      agent.name?.en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [agents, searchTerm]);

  const handleDelete = (agent: Agent) => {
    setSelectedAgent(agent);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedAgent) return;
    
    deleteAgentMutation.mutate(selectedAgent.id, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        setSelectedAgent(null);
      }
    });
  };

  const toggleStatus = (id: string) => {
    // Get the current agent state from the cache to avoid stale closures
    const currentAgent = agents.find(a => a.id === id);
    if (!currentAgent) return;

    // Prevent multiple rapid clicks
    if (toggleStatusMutation.isPending) return;

    toggleStatusMutation.mutate({ 
      id, 
      isActive: !currentAgent.isActive 
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('admin.agents.title')}</h1>
        <p className="text-gray-600 mt-2">
          {t('admin.agents.description')}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder={t('admin.table.search_placeholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-64 border-gray-200 focus:border-gray-400 focus:ring-gray-400"
          />
        </div>
        <Button 
          onClick={() => setCreateDialogOpen(true)}
          className="bg-gray-900 text-white hover:bg-gray-800"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('admin.agents.create')}
        </Button>
      </div>

      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">{t('admin.agents.title')}</CardTitle>
          <CardDescription className="text-gray-600">
            {isLoading ? t('common.loading') : `${pagination.total} ${t('admin.agents.total')}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
              <span className="ml-2 text-gray-600">{t('admin.table.loading')}</span>
            </div>
          ) : agents.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t('admin.table.no_data')}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? t('admin.agents.try_adjusting_search') : t('admin.agents.get_started_first')}
              </p>
              <Button 
                onClick={() => setCreateDialogOpen(true)}
                className="bg-gray-900 text-white hover:bg-gray-800"
              >
                <Plus className="w-4 h-4 mr-2" />
                {t('admin.agents.create_first')}
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('admin.agents.title')}</TableHead>
                      <TableHead>{t('admin.agents.fields.contact')}</TableHead>
                      <TableHead>{t('admin.listings.title')}</TableHead>
                      <TableHead>{t('common.status')}</TableHead>
                      <TableHead>{t('common.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAgents.map((agent) => (
                      <TableRow key={agent.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10 ring-2 ring-white shadow-md">
                              <AvatarImage src={agent.avatar} alt={getLocalizedText(agent.name) || 'Agent'} />
                              <AvatarFallback className="bg-gray-900 text-white">
                                {getLocalizedText(agent.name)?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'A'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-gray-900">
                                {getLocalizedText(agent.name) || 'Unknown Agent'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {t('admin.agents.joined_on', { date: new Date(agent.createdAt).toLocaleDateString() })}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Mail className="w-3 h-3" />
                              <span>{agent.email}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Phone className="w-3 h-3" />
                              <span>{agent.phone}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium text-gray-900">
                          <div className="text-center">
                            <div className="text-2xl font-bold">{agent._count.listings}</div>
                             <div className="text-xs text-gray-500">{t('admin.agents.properties')}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={agent.isActive ? 'default' : 'outline'}
                            className={agent.isActive ? 'bg-gray-900 text-white' : 'border-gray-200 text-gray-700'}
                          >
                            {agent.isActive ? t('common.active') : t('common.inactive')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push(`/admin/agents/${agent.id}`)}
                              className="border-gray-200 hover:bg-gray-50 text-gray-700"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push(`/admin/agents/${agent.id}/edit`)}
                              className="border-gray-200 hover:bg-gray-50 text-gray-700"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleStatus(agent.id)}
                              disabled={toggleStatusMutation.isPending}
                              className="border-gray-200 hover:bg-gray-50 text-gray-700 disabled:opacity-50"
                            >
                              {toggleStatusMutation.isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                agent.isActive ? t('admin.agents.deactivate') : t('admin.agents.activate')
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(agent)}
                              className="border-gray-200 hover:bg-gray-50 text-gray-900"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-gray-600">
                    {t('admin.table.showing')} {((pagination.page - 1) * pagination.limit) + 1} {t('admin.table.to')}{' '}
                    {Math.min(pagination.page * pagination.limit, pagination.total)} {t('admin.table.of')}{' '}
                    {pagination.total} {t('admin.table.results')}
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(pagination.page - 1)}
                      disabled={!pagination.hasPrev}
                      className="border-gray-200 hover:bg-gray-50 text-gray-700"
                    >
                      {t('admin.table.previous')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(pagination.page + 1)}
                      disabled={!pagination.hasNext}
                      className="border-gray-200 hover:bg-gray-50 text-gray-700"
                    >
                      {t('admin.table.next')}
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-white border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-gray-900">{t('admin.agents.messages.confirm_delete')}</DialogTitle>
            <DialogDescription className="text-gray-600">
              {t('admin.agents.messages.confirm_delete')} "{selectedAgent?.name.en}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} className="border-gray-200 hover:bg-gray-50 text-gray-700">
              {t('common.cancel')}
            </Button>
            <Button variant="default" onClick={confirmDelete} className="bg-gray-900 text-white hover:bg-gray-800">
              {t('common.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CreateAgentDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onAgentCreated={() => {
          setCreateDialogOpen(false);
          // TanStack Query will automatically refetch due to cache invalidation in the mutation
        }}
      />
    </div>
  );
}