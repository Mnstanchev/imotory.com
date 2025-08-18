import { Bath, Bed, Calendar, Car, Home, Ruler, ThermometerSun, Sofa, Gauge, Building2, Layers } from "lucide-react";

type BadgeItem = { key: string; label: string; value?: string | number };

// Map icons by stable keys, not translated labels
const keyToIcon: Record<string, any> = {
  size: Ruler,
  price_per_m2: Gauge,
  type: Home,
  year_built: Calendar,
  rooms: Sofa,
  baths: Bath,
  beds: Bed,
  floor_total: Layers,
  furnished: Sofa,
  elevator: Building2,
  heating_type: ThermometerSun,
  garage: Car,
};

export default function OverviewBadges({ items }: { items: BadgeItem[] }) {
  const visibleItems = (items || []).filter((it) => {
    const v = it.value as unknown as string | number | undefined;
    if (v === undefined || v === null) return false;
    if (typeof v === "string" && v.trim() === "") return false;
    return true;
  });
  if (!visibleItems.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-md shadow-sm">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
        {visibleItems.map((it, i) => {
          const Icon = keyToIcon[it.key] || Home;
          return (
            <div key={i} className="flex items-start gap-2 text-gray-700">
              <Icon className="h-4 w-4 text-gray-600 mt-0.5" aria-hidden />
              <div>
                <div className="text-xs text-gray-500 leading-none mb-1">{it.label}</div>
                <div className="text-gray-900 font-medium">{it.value}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


