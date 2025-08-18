"use client";

import OverviewBadges from "./OverviewBadges";
import DetailsTable from "./DetailsTable";
import FeaturesChecklist from "./FeaturesChecklist";
import { useLanguage } from "@/contexts/language-context";

export default function LocalizedListingSections({ listing, displayId }: { listing: any; displayId?: string }) {
  const { t, currentLanguage } = useLanguage();

  const pricePerM2 = (() => {
    const ppm = listing?.pricePerSqM ?? (listing?.price && listing?.size ? Math.round((listing.price / listing.size) * 100) / 100 : undefined);
    return ppm !== undefined ? `${ppm} €/m²` : undefined;
  })();

  return (
    <>
      <section>
        <h2 className="text-lg font-medium text-gray-900 mb-2">{t('listing.description')}</h2>
        <p className="text-gray-700 whitespace-pre-line">{listing?.description?.[currentLanguage] || listing?.description?.en || t('listing.no_description')}</p>
      </section>
      <section>
        <h2 className="text-lg font-medium text-gray-900 mb-2">{t('listing.key_features')}</h2>
        <OverviewBadges
          items={[
            { key: 'size', label: t('listing.size'), value: listing?.size ? `${listing.size} m²` : undefined },
            { key: 'price_per_m2', label: t('listing.price_per_m2'), value: pricePerM2 },
            { key: 'type', label: t('listing.type'), value: listing?.propertyType ? t(`enums.propertyType.${listing.propertyType}`) : undefined },
            { key: 'year_built', label: t('listing.year_built'), value: listing?.yearBuilt },
            { key: 'rooms', label: t('listing.rooms'), value: listing?.livingRooms },
            { key: 'baths', label: t('listing.baths'), value: listing?.bathrooms },
            { key: 'beds', label: t('listing.beds'), value: listing?.bedrooms },
            { key: 'floor_total', label: t('listing.floor_total'), value: listing?.floor ? `${listing.floor}${listing?.totalFloors ? `/${listing.totalFloors}` : ""}` : undefined },
            { key: 'furnished', label: t('listing.furnished'), value: listing?.furnished ? t('listing.yes') : undefined },
            { key: 'elevator', label: t('listing.elevator'), value: listing?.elevator ? t('listing.yes') : undefined },
            { key: 'heating_type', label: t('listing.heating_type'), value: (listing as any)?.heatingType ? t(`enums.heatingType.${(listing as any).heatingType}`) : undefined },
            { key: 'garage', label: t('listing.garage'), value: listing?.garage ? 1 : 0 },
          ]}
        />
      </section>
      <DetailsTable
        rows={[
          { key: 'id', label: t('listing.id'), value: displayId?.replace(/^#/, "") },
          { key: 'building_type', label: t('listing.building_type'), value: (listing as any)?.buildingType ? t(`enums.buildingType.${(listing as any).buildingType}`) : undefined },
           { key: 'building_condition', label: t('listing.building_condition'), value: (listing as any)?.buildingCondition?.[currentLanguage] || (listing as any)?.buildingCondition?.en },
          { key: 'energy_rating', label: t('listing.energy_rating'), value: (listing as any)?.energyRating },
          { key: 'parking_spots', label: t('listing.parking_spots'), value: listing?.parkingSpots },
          { key: 'balcony', label: t('listing.balcony'), value: listing?.balkony ? t('listing.yes') : (listing?.balcony ? t('listing.yes') : undefined) },
          { key: 'garden_size', label: t('listing.garden_size'), value: listing?.gardenSize ? `${listing.gardenSize} m²` : undefined },
          { key: 'terrace_size', label: t('listing.terrace_size'), value: (listing as any)?.terraceSize ? `${(listing as any).terraceSize} m²` : undefined },
          { key: 'air_conditioning', label: t('listing.air_conditioning'), value: listing?.airConditioning ? t('listing.yes') : undefined },
          { key: 'maintenance_fee', label: t('listing.maintenance_fee'), value: (listing as any)?.maintenanceFee },
          { key: 'mortgage_possible', label: t('listing.mortgage_possible'), value: (listing as any)?.mortgagePossible ? t('listing.yes') : undefined },
          { key: 'ownership_type', label: t('listing.ownership_type'), value: (listing as any)?.ownershipType ? t(`enums.ownershipType.${(listing as any).ownershipType}`) : undefined },
          { key: 'kitchens', label: t('listing.kitchens'), value: listing?.kitchens },
          { key: 'postal_code', label: t('listing.postal_code'), value: listing?.postalCode },
          { key: 'latitude', label: t('listing.latitude'), value: listing?.latitude },
          { key: 'longitude', label: t('listing.longitude'), value: listing?.longitude },
           { key: 'tags', label: t('listing.tags'), value: Array.isArray((listing as any)?.tags?.[currentLanguage]) && ((listing as any)?.tags?.[currentLanguage] as string[])?.length ? (listing as any)?.tags?.[currentLanguage].join(', ') : (Array.isArray((listing as any)?.tags?.en) && (listing as any)?.tags?.en.length ? (listing as any)?.tags?.en.join(', ') : undefined) },
          { key: 'video_tour', label: t('listing.video_tour'), value: (listing as any)?.videoUrl ? t('listing.available') : undefined },
          { key: 'virtual_tour', label: t('listing.virtual_tour'), value: (listing as any)?.virtualTourUrl ? t('listing.available') : undefined },
        ].filter((r) => r.value !== undefined && r.value !== null && (typeof r.value !== 'string' || r.value.trim() !== ''))}
      />

      <FeaturesChecklist
        groups={[
          {
            title: t('listing.outdoor_features'),
            items: [
              { label: t('listing.swimming_pool'), checked: !!listing?.pool },
              { label: t('listing.balcony'), checked: !!listing?.balcony },
              { label: t('listing.undercover_parking'), checked: !!listing?.parkingSpots },
              { label: t('listing.outdoor_area'), checked: !!listing?.gardenSize },
            ],
          },
          {
            title: t('listing.indoor_features'),
            items: [
              { label: t('listing.elevator'), checked: !!listing?.elevator },
              { label: t('listing.furnished'), checked: !!listing?.furnished },
              { label: t('listing.air_conditioning'), checked: !!listing?.airConditioning },
              { label: t('listing.broadband'), checked: true },
            ],
          },
        ]}
      />
    </>
  );
}


