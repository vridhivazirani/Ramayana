'use client';

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Location, StatusType, STATUS_CONFIG } from '@/types';

// Fix Leaflet default icon issue in Next.js
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Create custom SVG pin marker for each status
function createMarkerIcon(status: StatusType, isSelected: boolean): L.DivIcon {
  const color = STATUS_CONFIG[status].color;
  const scale = isSelected ? 1.3 : 1;
  const shadowOpacity = isSelected ? 0.4 : 0.2;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${Math.round(28 * scale)}" height="${Math.round(36 * scale)}" viewBox="0 0 28 36">
      <filter id="shadow-${status}" x="-40%" y="-20%" width="180%" height="180%">
        <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="${color}" flood-opacity="${shadowOpacity}"/>
      </filter>
      <path
        d="M14 1C7.37 1 2 6.37 2 13c0 8.75 12 22 12 22s12-13.25 12-22C26 6.37 20.63 1 14 1z"
        fill="${color}"
        stroke="white"
        stroke-width="${isSelected ? '2.5' : '1.5'}"
        filter="url(#shadow-${status})"
      />
      <circle cx="14" cy="13" r="${isSelected ? '5.5' : '4.5'}" fill="white" fill-opacity="0.92"/>
      ${isSelected ? `<circle cx="14" cy="13" r="2.5" fill="${color}"/>` : ''}
    </svg>
  `;

  return L.divIcon({
    html: svg,
    className: `marker-${status}`,
    iconSize: [Math.round(28 * scale), Math.round(36 * scale)],
    iconAnchor: [Math.round(14 * scale), Math.round(36 * scale)],
    popupAnchor: [0, -Math.round(36 * scale)],
  });
}

// Component to fly to a selected location
function MapFlyTo({ location }: { location: Location | null }) {
  const map = useMap();
  useEffect(() => {
    if (location) {
      map.flyTo(location.coordinates, Math.max(map.getZoom(), 8), {
        duration: 1.2,
        easeLinearity: 0.5,
      });
    }
  }, [location, map]);
  return null;
}

interface MapProps {
  locations: Location[];
  activeFilters: Set<StatusType>;
  selectedLocation: Location | null;
  onSelectLocation: (loc: Location) => void;
}

export default function MapView({
  locations,
  activeFilters,
  selectedLocation,
  onSelectLocation,
}: MapProps) {
  const mapRef = useRef<L.Map | null>(null);

  const filteredLocations = locations.filter((loc) => activeFilters.has(loc.status));

  return (
    <MapContainer
      center={[20.5937, 78.9629]}
      zoom={5}
      style={{ width: '100%', height: '100%' }}
      zoomControl={false}
      ref={mapRef}
      id="main-map"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={18}
      />

      {/* Zoom control repositioned to top-right to avoid legend overlap */}
      <MapZoomControl />

      <MapFlyTo location={selectedLocation} />

      {filteredLocations.map((loc) => {
        const isSelected = selectedLocation?.id === loc.id;
        return (
          <Marker
            key={loc.id}
            position={loc.coordinates}
            icon={createMarkerIcon(loc.status, isSelected)}
            eventHandlers={{
              click: () => onSelectLocation(loc),
            }}
            zIndexOffset={isSelected ? 1000 : 0}
          />
        );
      })}
    </MapContainer>
  );
}

// Separate component to add zoom control with correct position
function MapZoomControl() {
  const map = useMap();
  useEffect(() => {
    L.control.zoom({ position: 'topright' }).addTo(map);
    return () => {
      map.eachLayer(() => {}); // no-op cleanup; zoom control lives on map
    };
  }, [map]);
  return null;
}
