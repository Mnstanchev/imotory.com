'use client';

import React, { useState, useMemo } from 'react';
// LocationType is now defined inline as the union type in the Location interface
import { useTheme } from 'next-themes';
import { useLanguage } from '@/contexts/language-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CreateLocationDialog } from './locations/create-location-dialog';
import { useLocations, useDeleteLocation, useToggleLocationStatus, useCreateLocation, useUpdateLocation } from '@/hooks/use-locations';

// Define Location type to match the hook's interface
interface Location {
  id: string;
  name: { en: string; bg?: string; ru?: string };
  slug: string;
  type: 'COUNTRY' | 'REGION' | 'MUNICIPALITY' | 'CITY' | 'NEIGHBORHOOD';
  parentId?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  _count: {
    listings: number;
    children: number;
  };
  parent?: Location;
  children?: Location[];
}

export function LocationsManagement() {
  const { theme, resolvedTheme } = useTheme();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const { t, currentLanguage } = useLanguage();

  // Helper function to get localized text
  const getLocalizedText = (textObj: any) => {
    if (!textObj) return '';
    return textObj[currentLanguage] || textObj.en || textObj.bg || '';
  };
  
  // Default to light mode - only show dark if explicitly set to 'dark'
  const actuallyDark = resolvedTheme === 'dark';
  
  // TanStack Query hooks
  const { data, isLoading, error } = useLocations({ limit: 100 }); // Get all locations
  const createLocationMutation = useCreateLocation();
  const updateLocationMutation = useUpdateLocation();
  const deleteLocationMutation = useDeleteLocation();
  const toggleStatusMutation = useToggleLocationStatus();

  // Extract data with defaults
  const locations = data?.locations || [];

  // Handle error state
  if (error) {
    console.error('Error fetching locations:', error);
  }

  const handleSubmitLocation = async (data: any) => {
    try {
      if (editingLocation) {
        await updateLocationMutation.mutateAsync({
          id: editingLocation.id,
          data
        });
      } else {
        await createLocationMutation.mutateAsync(data);
      }
      setEditingLocation(null);
    } catch (error) {
      throw error;
    }
  };

  const handleDelete = (location: Location) => {
    if (confirm(`${t('admin.locations.messages.confirm_delete')} "${getLocalizedText(location.name)}"?`)) {
      deleteLocationMutation.mutate(location.id, {
        onError: (error: any) => {
          console.error('Delete error:', error);
          // Handle specific error messages from the API
          if (error.message.includes('associated children or listings')) {
            alert(t('admin.locations.messages.delete_error_has_children'));
          } else {
            alert(t('admin.locations.messages.delete_error'));
          }
        }
      });
    }
  };

  const toggleStatus = (id: string) => {
    const currentLocation = locations.find(l => l.id === id);
    if (!currentLocation) return;

    // Prevent multiple rapid clicks
    if (toggleStatusMutation.isPending) return;

    toggleStatusMutation.mutate({ 
      id, 
      isActive: !currentLocation.isActive 
    });
  };

  const getParentName = (location: Location) => {
    if (!location.parentId || !Array.isArray(locations)) return '-';
    const parent = locations.find(loc => loc.id === location.parentId);
    return parent ? getLocalizedText(parent.name) : '-';
  };

  const renderLocationRows = (parentId: string | null = null, level: number = 0): React.ReactNode[] => {
    // Safety check: ensure locations is an array
    if (!Array.isArray(locations)) {
      return [];
    }
    
    // Start at root: if parentId is null, render top-level items (no parent)
    return locations
      .filter(location => (parentId === null ? !location.parentId : location.parentId === parentId))
      .map(location => (
        <React.Fragment key={location.id}>
          <TableRow 
            className="transition-colors duration-150"
            style={{ 
              backgroundColor: 'transparent',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = actuallyDark ? '#2A2A2A' : '#F0F0F0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <TableCell 
              className="font-medium" 
              style={{ 
                paddingLeft: `${level * 2}rem`,
                color: actuallyDark ? '#F5F5F5' : '#0A0A0A'
              }}
            >
              {getLocalizedText(location.name)}
            </TableCell>
            <TableCell style={{ color: actuallyDark ? '#D0D0D0' : '#404040' }}>
              {location.name.bg || '-'}
            </TableCell>
            <TableCell style={{ color: actuallyDark ? '#D0D0D0' : '#404040' }}>
              {location.name.ru || '-'}
            </TableCell>
            <TableCell style={{ color: actuallyDark ? '#D0D0D0' : '#404040' }}>
              {location.type.charAt(0) + location.type.slice(1).toLowerCase()}
            </TableCell>
            <TableCell style={{ color: actuallyDark ? '#A0A0A0' : '#606060' }}>
              {getParentName(location)}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="transition-all duration-150 hover:opacity-80"
                  style={{ 
                    color: actuallyDark ? '#D0D0D0' : '#404040',
                    backgroundColor: 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = actuallyDark ? '#2A2A2A' : '#F0F0F0';
                    e.currentTarget.style.color = actuallyDark ? '#F5F5F5' : '#0A0A0A';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = actuallyDark ? '#D0D0D0' : '#404040';
                  }}
                  onClick={() => {
                    setEditingLocation(location);
                    setIsDialogOpen(true);
                  }}
                >
                  {t('common.edit')}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={toggleStatusMutation.isPending}
                  onClick={() => toggleStatus(location.id)}
                  className={`${location.isActive ? 'text-green-600 hover:text-green-700' : 'text-red-600 hover:text-red-700'} disabled:opacity-50`}
                >
                  {toggleStatusMutation.isPending ? t('admin.forms.processing') : (location.isActive ? t('common.active') : t('common.inactive'))}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(location)}
                  className="text-red-600 hover:text-red-700"
                >
                  {t('common.delete')}
                </Button>
              </div>
            </TableCell>
          </TableRow>
          {renderLocationRows(location.id, level + 1)}
        </React.Fragment>
      ));
  };

  return (
    <Card 
      className="border border-gray-200 dark:border-gray-700"
      style={{ backgroundColor: actuallyDark ? '#1A1A1A' : '#FAFAFA' }}
    >
      <CardHeader 
        className="flex flex-row items-center justify-between"
        style={{ backgroundColor: actuallyDark ? '#1A1A1A' : '#FAFAFA' }}
      >
        <CardTitle 
          className="font-semibold"
          style={{ color: actuallyDark ? '#F5F5F5' : '#0A0A0A' }}
        >
          {t('admin.locations.title')}
        </CardTitle>
        <Button 
          onClick={() => setIsDialogOpen(true)}
          className="font-medium hover:opacity-90 transition-opacity"
          style={{ 
            backgroundColor: actuallyDark ? '#F5F5F5' : '#0A0A0A',
            color: actuallyDark ? '#0A0A0A' : '#F5F5F5'
          }}
        >
          {locations.length === 0 ? t('admin.locations.create_first') : t('admin.locations.create')}
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div 
            className="text-center py-4"
            style={{ color: actuallyDark ? '#A0A0A0' : '#606060' }}
          >
            {t('admin.table.loading')}
          </div>
        ) : locations.length === 0 ? (
          <div 
            className="text-center py-4"
            style={{ color: actuallyDark ? '#909090' : '#707070' }}
          >
            {t('admin.locations.no_data')}
          </div>
        ) : (
          <div className="rounded-md border border-gray-200 dark:border-gray-700">
            <Table>
              <TableHeader>
                <TableRow 
                  style={{ backgroundColor: actuallyDark ? '#2A2A2A' : '#F0F0F0' }}
                >
                  <TableHead 
                    className="font-medium"
                    style={{ color: actuallyDark ? '#D0D0D0' : '#404040' }}
                  >
                    {t('common.name')}
                  </TableHead>
                  <TableHead 
                    className="font-medium"
                    style={{ color: actuallyDark ? '#D0D0D0' : '#404040' }}
                  >
                    {t('languages.bulgarian')}
                  </TableHead>
                  <TableHead 
                    className="font-medium"
                    style={{ color: actuallyDark ? '#D0D0D0' : '#404040' }}
                  >
                    {t('languages.russian')}
                  </TableHead>
                  <TableHead 
                    className="font-medium"
                    style={{ color: actuallyDark ? '#D0D0D0' : '#404040' }}
                  >
                    {t('common.type')}
                  </TableHead>
                  <TableHead 
                    className="font-medium"
                    style={{ color: actuallyDark ? '#D0D0D0' : '#404040' }}
                  >
                    {t('admin.locations.parent')}
                  </TableHead>
                  <TableHead 
                    className="text-right font-medium"
                    style={{ color: actuallyDark ? '#D0D0D0' : '#404040' }}
                  >
                    {t('common.actions')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {renderLocationRows()}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <CreateLocationDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setEditingLocation(null);
        }}
        onSubmit={handleSubmitLocation}
        locations={locations.map(loc => ({ 
          id: loc.id, 
          name: loc.name, 
          type: loc.type as any 
        }))}
        editingLocation={editingLocation ? {
          id: editingLocation.id,
          name: editingLocation.name,
          type: editingLocation.type as any,
          parentId: editingLocation.parentId
        } : null}
      />
    </Card>
  );
}