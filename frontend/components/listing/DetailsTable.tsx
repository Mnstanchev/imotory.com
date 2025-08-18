import { Building2, BrickWall, Leaf, Lightbulb, ThermometerSnowflake, Car, ParkingCircle, Package, Ruler, Tag, MapPin, Globe2, Film, Video, Hash } from "lucide-react";

type Row = { key: string; label: string; value?: string | number };

// Map icons by stable keys so they don't change with translations
const keyToIcon: Record<string, any> = {
  id: Hash,
  building_type: BrickWall,
  building_condition: Package,
  energy_rating: Lightbulb,
  parking_spots: ParkingCircle,
  balcony: Building2,
  garden_size: Leaf,
  terrace_size: Ruler,
  air_conditioning: ThermometerSnowflake,
  maintenance_fee: Ruler,
  mortgage_possible: Tag,
  ownership_type: Tag,
  kitchens: Package,
  postal_code: MapPin,
  latitude: Globe2,
  longitude: Globe2,
  tags: Tag,
  video_tour: Film,
  virtual_tour: Video,
};

export default function DetailsTable({ rows }: { rows: Row[] }) {
  if (!rows?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-md shadow-sm">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-3 p-4 text-sm">
        {rows.map((r, i) => {
          const Icon = keyToIcon[r.key] || Tag;
          return (
            <div key={i} className="flex items-start gap-2">
              <Icon className="h-4 w-4 text-gray-600 mt-0.5" aria-label={r.label} title={r.label} />
              <div>
                <div className="text-xs text-gray-500 leading-none mb-1">{r.label}</div>
                <div className="text-gray-900 font-medium">{r.value ?? "-"}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


