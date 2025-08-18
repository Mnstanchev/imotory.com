"use client";

import MiniMap from "./MiniMap";
import { useLanguage } from "@/contexts/language-context";

export default function MapCard({ address, lat, lng }: { address?: any; lat?: number; lng?: number }) {
  const { currentLanguage } = useLanguage();
  const addressText = typeof address === 'string' ? address : (address?.[currentLanguage] || address?.en || "");
  return (
    <div className="bg-white border border-gray-200 rounded-md shadow-sm">
      <div className="px-4 pt-4 text-gray-900 font-medium">Map location</div>
      <div className="p-4 grid grid-cols-2 gap-3 text-sm text-gray-700">
        <div className="col-span-2">{addressText || "Address not provided"}</div>
      </div>
      <div className="h-72 w-full border-t border-gray-200 rounded-b-md overflow-hidden">
        <MiniMap lat={lat} lng={lng} query={addressText} />
      </div>
    </div>
  );
}


