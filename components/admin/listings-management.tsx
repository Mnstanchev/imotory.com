'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { CreateListingDialog } from '@/components/admin/listings/create-listing-dialog';
import { Building, Plus, Search, Filter, Edit, Trash2, Eye, MoreVertical, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useListings, useDeleteListing, useToggleListingStatus } from '@/hooks/use-listings';

interface Listing {
  id: string;
  title: { en: string; bg?: string; ru?: string };
  price: number;
  currency: string;
  propertyType: string;
  listingType: string;
  isActive: boolean;
  agent: { 
    id: string;
    name: { en: string; bg?: string; ru?: string };
    email: string;
    phone: string;
    avatar?: string;
    isActive: boolean;
  };
  location: { 
    id: string;
    name: { en: string; bg?: string; ru?: string };
    slug: string;
    type: string;
  };
  category: { 
    id: string;
    name: { en: string; bg?: string; ru?: string };
    slug: string;
  };
  createdAt: string;
  slug: string;
  bedrooms?: number;
  bathrooms?: number;
  size?: number;
  images?: string[];
}

interface ListingsResponse {
  listings: Listing[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export function ListingsManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingListingId, setEditingListingId] = useState<string | null>(null);
  const router = useRouter();
  const { t, currentLanguage } = useLanguage();

  // TanStack Query hooks
  const { data, isLoading, error } = useListings({ 
    page: currentPage, 
    limit: 10, 
    search: searchTerm 
  });
  const deleteListingMutation = useDeleteListing();
  const toggleStatusMutation = useToggleListingStatus();

  // Extract data with defaults
  const listings = data?.listings || [];
  const pagination = data?.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  };

  // Helper function to get localized text
  const getLocalizedText = (textObj: any) => {
    if (!textObj) return '';
    return textObj[currentLanguage] || textObj.en || textObj.bg || '';
  };

  // Filtered listings for immediate client-side response
  const filteredListings = useMemo(() => {
    if (!searchTerm) return listings;
    return listings.filter(listing =>
      getLocalizedText(listing.title).toLowerCase().includes(searchTerm.toLowerCase()) ||
      getLocalizedText(listing.agent?.name).toLowerCase().includes(searchTerm.toLowerCase()) ||
      getLocalizedText(listing.location?.name).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [listings, searchTerm, currentLanguage]);
  const handleDelete = (listing: Listing) => {
    setSelectedListing(listing);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedListing) return;
    
    deleteListingMutation.mutate(selectedListing.id, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        setSelectedListing(null);
      }
    });
  };

  const toggleStatus = (id: string) => {
    const currentListing = listings.find(l => l.id === id);
    if (!currentListing) return;

    // Prevent multiple rapid clicks
    if (toggleStatusMutation.isPending) return;

    toggleStatusMutation.mutate({ 
      id, 
      isActive: !currentListing.isActive 
    });
  };


  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('admin.listings.title')}</h1>
        <p className="text-gray-600 mt-2">
          Manage property listings and their details
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
            <Input
              placeholder={t('admin.table.search_placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64 border-gray-200"
            />
          </div>
          <Button variant="outline" size="sm" className="border-gray-200 hover:bg-gray-50 text-gray-700">
            <Filter className="w-4 h-4 mr-2" />
            {t('common.filter')}
          </Button>
        </div>
        <Button 
          onClick={() => { setEditingListingId(null); setCreateDialogOpen(true); }}
          className="bg-gray-900 text-white hover:bg-gray-800"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('admin.listings.create')}
        </Button>
      </div>

      <Card className="border-gray-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">{t('admin.listings.title')}</CardTitle>
          <CardDescription className="text-gray-600">
            {isLoading ? t('common.loading') : `${pagination.total} ${t('admin.listings.total')}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
              <span className="ml-2 text-gray-600">{t('admin.table.loading')}</span>
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-12">
              <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t('admin.table.no_data')}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? t('admin.listings.try_adjusting_search') : t('admin.listings.get_started_first')}
              </p>
                <Button 
                  onClick={() => { setEditingListingId(null); setCreateDialogOpen(true); }}
                className="bg-gray-900 text-white hover:bg-gray-800"
              >
                <Plus className="w-4 h-4 mr-2" />
                {t('admin.listings.create')}
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('common.title')}</TableHead>
                      <TableHead>{t('common.price')}</TableHead>
                      <TableHead>{t('common.type')}</TableHead>
                      <TableHead>{t('common.location')}</TableHead>
                      <TableHead>{t('admin.listings.fields.agent')}</TableHead>
                      <TableHead>{t('common.status')}</TableHead>
                      <TableHead>{t('common.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredListings.map((listing) => (
                      <TableRow key={listing.id}>
                        <TableCell className="font-medium max-w-xs">
                          <div>
                            <div className="font-medium text-gray-900">
                              {getLocalizedText(listing.title) || 'Untitled'}
                            </div>
                            <div className="text-sm text-gray-500">
                              {getLocalizedText(listing.category?.name) || 'Uncategorized'}
                            </div>
                            {listing.bedrooms && (
                              <div className="text-xs text-gray-400">
                                {listing.bedrooms} bed, {listing.bathrooms} bath
                                {listing.size && ` • ${listing.size}m²`}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium text-gray-900">
                          {formatPrice(listing.price, listing.currency)}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <Badge variant="outline" className="capitalize">
                              {listing.propertyType.toLowerCase()}
                            </Badge>
                            <div className="text-xs text-gray-500">
                              {listing.listingType}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {getLocalizedText(listing.location.name)}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          <div>
                            <div className="font-medium">{getLocalizedText(listing.agent.name)}</div>
                            <div className="text-xs text-gray-400">{listing.agent.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={listing.isActive ? 'default' : 'secondary'}
                            className={listing.isActive ? 'bg-gray-900 text-white' : 'text-gray-700 border-gray-200'}
                          >
                            {listing.isActive ? t('common.active') : t('common.inactive')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white border border-gray-200 shadow-md">
                              <DropdownMenuItem onClick={() => router.push(`/admin/listings/${listing.id}`)} className="text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                                <Eye className="w-4 h-4 mr-2" />
                                {t('common.view')}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => { setEditingListingId(listing.id); setCreateDialogOpen(true); }} className="text-gray-700 hover:bg-gray-50 hover:text-gray-900">
                                <Edit className="w-4 h-4 mr-2" />
                                {t('common.edit')}
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => toggleStatus(listing.id)}
                                disabled={toggleStatusMutation.isPending}
                                className="disabled:opacity-50 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                              >
                                {toggleStatusMutation.isPending ? (
                                  <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    {t('admin.forms.processing')}
                                  </>
                                ) : (
                                  listing.isActive ? 'Deactivate' : 'Activate'
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600 hover:bg-gray-50 hover:text-red-700"
                                onClick={() => handleDelete(listing)}
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
                    {pagination.total} {t('admin.table.entries')}
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(pagination.page - 1)}
                      disabled={!pagination.hasPrev}
                      className="border-gray-200 hover:bg-gray-50 text-gray-700"
                    >
                      {t('common.previous')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(pagination.page + 1)}
                      disabled={!pagination.hasNext}
                      className="border-gray-200 hover:bg-gray-50 text-gray-700"
                    >
                      {t('common.next')}
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-white border border-gray-200 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-gray-900">{t('admin.listings.messages.confirm_delete')}</DialogTitle>
            <DialogDescription className="text-gray-600">
              Are you sure you want to delete "{getLocalizedText(selectedListing?.title)}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(false)}
              className="border-gray-200 hover:bg-gray-50 text-gray-700"
            >
              {t('common.cancel')}
            </Button>
            <Button 
              variant="outline" 
              onClick={confirmDelete}
              className="border-gray-200 bg-gray-900 text-white hover:bg-gray-800"
            >
              {t('common.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CreateListingDialog 
        open={createDialogOpen}
        onOpenChange={(o) => { if (!o) setEditingListingId(null); setCreateDialogOpen(o); }}
        onSuccess={() => {
          setCreateDialogOpen(false);
          setEditingListingId(null);
          // TanStack Query will automatically refetch due to cache invalidation in the mutation
        }}
        listingId={editingListingId}
      />
    </div>
  );
}