"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN as string | undefined;
if (MAPBOX_TOKEN) {
  mapboxgl.accessToken = MAPBOX_TOKEN;
}

// Disable Mapbox telemetry to prevent analytics requests
if (typeof window !== 'undefined') {
  (mapboxgl as any).getEventBuffer = () => ({ flush: () => {} });
}

export default function MiniMap({ lat, lng, query }: { lat?: number; lng?: number; query?: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current || !MAPBOX_TOKEN) return;
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/light-v11",
      center: [lng ?? 23.3219, lat ?? 42.6977],
      zoom: lat && lng ? 13 : 11,
      attributionControl: false,
    });
    mapRef.current = map;
    map.addControl(new mapboxgl.NavigationControl({ showZoom: true }), "top-right");
    map.scrollZoom.disable();

    async function placeMarker() {
      let coordinates: [number, number] | null = null;
      if (typeof lat === "number" && typeof lng === "number") {
        coordinates = [lng, lat];
      } else if (query) {
        try {
          const url = new URL(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`);
          url.searchParams.set("access_token", MAPBOX_TOKEN!);
          url.searchParams.set("limit", "1");
          const res = await fetch(url.toString());
          const data = (await res.json()) as any;
          const feat = data?.features?.[0];
          if (feat?.center) coordinates = feat.center as [number, number];
        } catch {}
      }
      if (coordinates && map) {
        map.setCenter(coordinates);
        map.setZoom(13);
        // Replace existing marker if present
        try { markerRef.current?.remove(); } catch {}
        markerRef.current = new mapboxgl.Marker({ color: "#111827" }).setLngLat(coordinates).addTo(map);
      }
    }
    if (map.loaded()) {
      placeMarker();
    } else {
      map.once('load', placeMarker);
    }

    return () => {
      try { markerRef.current?.remove(); } catch {}
      try { map.remove(); } catch {}
      markerRef.current = null;
      mapRef.current = null;
    };
  }, [lat, lng, query]);

  // Update marker when inputs change after map is created
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !MAPBOX_TOKEN) return;
    // If map container is not attached, skip
    const container = (map as any).getCanvasContainer?.() || (map as any).getContainer?.();
    if (!container || !(container as HTMLElement).appendChild || !(container as HTMLElement).isConnected) return;
    let cancelled = false;
    (async () => {
      let coordinates: [number, number] | null = null;
      if (typeof lat === 'number' && typeof lng === 'number') {
        coordinates = [lng, lat];
      } else if (query) {
        try {
          const url = new URL(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`);
          url.searchParams.set('access_token', MAPBOX_TOKEN!);
          url.searchParams.set('limit', '1');
          const res = await fetch(url.toString());
          const data = (await res.json()) as any;
          const feat = data?.features?.[0];
          if (feat?.center) coordinates = feat.center as [number, number];
        } catch {}
      }
      if (!cancelled && coordinates && mapRef.current === map) {
        const containerNow = (map as any).getCanvasContainer?.() || (map as any).getContainer?.();
        if (!containerNow || !(containerNow as HTMLElement).isConnected) return;
        map.setCenter(coordinates);
        map.setZoom(13);
        try { markerRef.current?.remove(); } catch {}
        markerRef.current = new mapboxgl.Marker({ color: '#111827' }).setLngLat(coordinates).addTo(map);
      }
    })();
    return () => { cancelled = true; };
  }, [lat, lng, query]);

  if (!MAPBOX_TOKEN) {
    return (
      <div className="h-64 bg-gray-100 flex items-center justify-center text-gray-700 border-t border-gray-200 rounded-b-md">
        Set NEXT_PUBLIC_MAPBOX_TOKEN to show map
      </div>
    );
  }

  return <div ref={containerRef} className="w-full h-full" />;
}


