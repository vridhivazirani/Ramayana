'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Location, StatusType, STATUS_CONFIG } from '@/types';

// Fix default icon
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function createTimelineIcon(status: StatusType, isActive: boolean, isPast: boolean): L.DivIcon {
  const color = isActive
    ? STATUS_CONFIG[status].color
    : isPast
    ? '#B5A080'
    : '#D4C5A9';
  const size = isActive ? 18 : 12;

  return L.divIcon({
    html: `<div style="
      width:${size}px;height:${size}px;border-radius:50%;
      background:${color};border:2px solid white;
      box-shadow:0 2px 6px rgba(0,0,0,0.3);
      transition:all 0.3s;
    "></div>`,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function MapFlyTo({ location }: { location: Location }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(location.coordinates, Math.max(map.getZoom(), 6), {
      duration: 1,
      easeLinearity: 0.5,
    });
  }, [location, map]);
  return null;
}

interface TimelineMapProps {
  locations: Location[];
  currentStep: number;
  onSelectStep: (i: number) => void;
}

export default function TimelineMap({ locations, currentStep, onSelectStep }: TimelineMapProps) {
  // Build route up to current step
  const routeCoords = locations
    .slice(0, currentStep + 1)
    .map((l) => l.coordinates);

  const fullRoute = locations.map((l) => l.coordinates);

  return (
    <MapContainer
      center={[15, 80]}
      zoom={4}
      style={{ width: '100%', height: '100%' }}
      zoomControl={false}
      id="timeline-map"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Full route (ghost) */}
      <Polyline
        positions={fullRoute}
        pathOptions={{
          color: '#D4C5A9',
          weight: 2,
          dashArray: '6,6',
          opacity: 0.5,
        }}
      />

      {/* Traveled route (active) */}
      {routeCoords.length > 1 && (
        <Polyline
          positions={routeCoords}
          pathOptions={{
            color: '#C4872A',
            weight: 3,
            opacity: 0.9,
            lineCap: 'round',
            lineJoin: 'round',
          }}
        />
      )}

      {/* Markers */}
      {locations.map((loc, i) => (
        <Marker
          key={loc.id}
          position={loc.coordinates}
          icon={createTimelineIcon(loc.status, i === currentStep, i < currentStep)}
          eventHandlers={{ click: () => onSelectStep(i) }}
          zIndexOffset={i === currentStep ? 1000 : 0}
        />
      ))}

      <MapFlyTo location={locations[currentStep]} />
    </MapContainer>
  );
}
