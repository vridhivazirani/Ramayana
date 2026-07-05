'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { Location, StatusType } from '@/types';
import DetailPanel from '@/components/DetailPanel';
import Legend from '@/components/Legend';
import locationsData from '@/data/locations.json';

// Dynamic import with SSR disabled — Leaflet requires browser APIs
const MapView = dynamic(() => import('@/components/MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-parchment flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-ochre border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-stone text-sm font-sans">Loading map…</p>
      </div>
    </div>
  ),
});

const ALL_STATUSES: Set<StatusType> = new Set(['traditional', 'disputed', 'archaeological'] as StatusType[]);

export default function HomePage() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [activeFilters, setActiveFilters] = useState<Set<StatusType>>(new Set(ALL_STATUSES));
  const [isMobile, setIsMobile] = useState(false);

  const locations = locationsData as Location[];

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const handleToggleFilter = (status: StatusType) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(status)) {
        if (next.size === 1) return prev; // keep at least one active
        next.delete(status);
      } else {
        next.add(status);
      }
      return next;
    });
  };

  const handleSelectLocation = (loc: Location) => {
    setSelectedLocation(loc);
  };

  const handleClosePanel = () => {
    setSelectedLocation(null);
  };

  return (
    <main className="fixed inset-0 top-14" id="map-page">
      {/* Map fills viewport below nav */}
      <div className="map-wrapper w-full h-full">
        <MapView
          locations={locations}
          activeFilters={activeFilters}
          selectedLocation={selectedLocation}
          onSelectLocation={handleSelectLocation}
        />
        <Legend activeFilters={activeFilters} onToggle={handleToggleFilter} />
      </div>

      {/* Location count indicator */}
      <div
        id="location-count"
        className="absolute bottom-8 right-4 z-[900] bg-mist/90 border border-stone-lighter rounded-lg px-3 py-2 text-xs text-stone"
        style={{ backdropFilter: 'blur(6px)' }}
      >
        <span className="font-semibold text-ink">{locations.filter(l => activeFilters.has(l.status)).length}</span>
        <span> of {locations.length} sites shown</span>
      </div>

      {/* Detail panel */}
      <DetailPanel
        location={selectedLocation}
        onClose={handleClosePanel}
        isMobile={isMobile}
      />
    </main>
  );
}
