'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Grid3X3, Plus, Search, Edit, Trash2, Eye, MoreVertical, Loader2, ArrowUpDown } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CreateCategoryDialog } from '@/components/admin/categories/create-category-dialog';
import { useCategories, useDeleteCategory, useToggleCategoryStatus } from '@/hooks/use-categories';

interface Category {
  id: string;
  name: { en: string; bg?: string; ru?: string };
  slug: string;
  description?: { en?: string; bg?: string; ru?: string };
  icon?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  _count: {
    listings: number;
  };
}

interface CategoriesResponse {
  categories: Category[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export function CategoriesManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const { t, currentLanguage } = useLanguage();

  // Helper function to get localized text
  const getLocalizedText = (textObj: any) => {
    if (!textObj) return '';
    return textObj[currentLanguage] || textObj.en || textObj.bg || '';
  };

  // TanStack Query hooks
  const { data, isLoading, error } = useCategories({ 
    page: currentPage, 
    limit: 10, 
    search: searchTerm 
  });
  const deleteCategoryMutation = useDeleteCategory();
  const toggleStatusMutation = useToggleCategoryStatus();

  // Extract data with defaults
  const categories = data?.categories || [];
  const pagination = data?.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  };

  // Filtered categories for immediate client-side response
  const filteredCategories = useMemo(() => {
    if (!searchTerm) return categories;
    return categories.filter(category =>
      category.name?.en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.slug?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  const handleDelete = (category: Category) => {
    setSelectedCategory(category);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedCategory) return;
    
    deleteCategoryMutation.mutate(selectedCategory.id, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        setSelectedCategory(null);
      }
    });
  };

  const toggleStatus = (id: string) => {
    const currentCategory = categories.find(c => c.id === id);
    if (!currentCategory) return;

    // Prevent multiple rapid clicks
    if (toggleStatusMutation.isPending) return;

    toggleStatusMutation.mutate({ 
      id, 
      isActive: !currentCategory.isActive 
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('admin.categories.title')}</h1>
        <p className="text-gray-600 mt-2">
          {t('admin.categories.description')}
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
          {t('admin.categories.create')}
        </Button>
      </div>

      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">{t('admin.categories.title')}</CardTitle>
          <CardDescription className="text-gray-600">
            {isLoading ? t('common.loading') : `${pagination.total} ${t('admin.categories.total')}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
              <span className="ml-2 text-gray-600">{t('admin.table.loading')}</span>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12">
              <Grid3X3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t('admin.table.no_data')}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? t('admin.categories.try_adjusting_search') : t('admin.categories.get_started_first')}
              </p>
              <Button 
                onClick={() => setCreateDialogOpen(true)}
                className="bg-gray-900 text-white hover:bg-gray-800"
              >
                <Plus className="w-4 h-4 mr-2" />
                {t('admin.categories.create_first')}
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('common.category')}</TableHead>
                      <TableHead>{t('common.slug')}</TableHead>
                      <TableHead>{t('admin.listings.title')}</TableHead>
                      <TableHead>{t('admin.categories.sort_order')}</TableHead>
                      <TableHead>{t('common.status')}</TableHead>
                      <TableHead>{t('common.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(categories || []).map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-lg">
                              {category.icon ? (
                                <span className="text-lg">{category.icon}</span>
                              ) : (
                                <Grid3X3 className="w-5 h-5 text-gray-600" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {getLocalizedText(category.name)}
                              </div>
                              {category.description && (
                                <div className="text-sm text-gray-500 max-w-xs truncate">
                                  {getLocalizedText(category.description)}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600 font-mono text-sm">
                          {category.slug}
                        </TableCell>
                        <TableCell className="font-medium text-gray-900">
                          <div className="text-center">
                            <div className="text-xl font-bold">{category._count.listings}</div>
                            <div className="text-xs text-gray-500">{t('admin.categories.active_listings')}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600">
                          <div className="flex items-center space-x-1">
                            <ArrowUpDown className="w-3 h-3" />
                            <span>{category.sortOrder}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={category.isActive ? 'default' : 'outline'}
                            className={category.isActive ? 'bg-gray-900 text-white' : 'border-gray-200 text-gray-700'}
                          >
                            {category.isActive ? t('common.active') : t('common.inactive')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" className="h-8 w-8 p-0 border-gray-200 hover:bg-gray-50">
                                <span className="sr-only">Open menu</span>
                                <MoreVertical className="h-4 w-4 text-gray-600" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white border border-gray-200 shadow-md">
                              <DropdownMenuItem onClick={() => router.push(`/admin/categories/${category.id}`)} className="text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                                <Eye className="w-4 h-4 mr-2" />
                                {t('common.view')}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => router.push(`/admin/categories/${category.id}/edit`)} className="text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                                <Edit className="w-4 h-4 mr-2" />
                                {t('common.edit')}
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => toggleStatus(category.id)} 
                                disabled={toggleStatusMutation.isPending}
                                className="text-gray-700 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-50"
                              >
                                {toggleStatusMutation.isPending ? (
                                  <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    {t('admin.forms.processing')}
                                  </>
                                ) : (
                                  category.isActive ? t('admin.categories.deactivate') : t('admin.categories.activate')
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600 hover:bg-gray-50 hover:text-red-700"
                                onClick={() => handleDelete(category)}
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                {t('common.delete')}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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
            <DialogTitle className="text-gray-900">{t('admin.categories.messages.confirm_delete')}</DialogTitle>
            <DialogDescription className="text-gray-600">
              {t('admin.categories.messages.confirm_delete')} "{getLocalizedText(selectedCategory?.name)}"? {t('admin.categories.confirm_delete_warning')}
              {selectedCategory?._count?.listings && selectedCategory._count.listings > 0 && (
                <span className="block mt-2 text-gray-900 font-medium">
                  {t('admin.categories.confirm_delete_listings_warning', { count: selectedCategory._count.listings })}
                </span>
              )}
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

      <CreateCategoryDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </div>
  );
}