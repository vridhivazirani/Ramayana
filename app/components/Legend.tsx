'use client';

import { StatusType, STATUS_CONFIG } from '@/types';

interface LegendProps {
  activeFilters: Set<StatusType>;
  onToggle: (status: StatusType) => void;
}

const STATUS_TYPES: StatusType[] = ['traditional', 'disputed', 'archaeological'];

export default function Legend({ activeFilters, onToggle }: LegendProps) {
  return (
    <div
      id="map-legend"
      className="absolute bottom-8 left-4 z-[900] bg-mist/95 backdrop-blur-sm rounded-xl shadow-panel border border-stone-lighter overflow-hidden"
      style={{ backdropFilter: 'blur(8px)' }}
    >
      <div className="px-4 py-3 border-b border-stone-lighter bg-parchment/60">
        <p className="text-[10px] font-semibold text-stone uppercase tracking-widest">
          Site Classification
        </p>
      </div>
      <div className="px-4 py-3 space-y-2.5">
        {STATUS_TYPES.map((status) => {
          const config = STATUS_CONFIG[status];
          const isActive = activeFilters.has(status);
          return (
            <button
              key={status}
              id={`legend-toggle-${status}`}
              onClick={() => onToggle(status)}
              className={`
                flex items-center gap-2.5 w-full text-left rounded-lg px-2 py-1.5 transition-all duration-200 group
                ${isActive ? 'opacity-100' : 'opacity-40 hover:opacity-60'}
              `}
              aria-pressed={isActive}
              title={config.description}
            >
              {/* Marker icon */}
              <span className="flex-shrink-0 relative">
                <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
                  <path
                    d="M8 0C3.58 0 0 3.58 0 8c0 5.25 8 12 8 12s8-6.75 8-12c0-4.42-3.58-8-8-8z"
                    fill={isActive ? config.color : '#8B7355'}
                  />
                  <circle cx="8" cy="8" r="3" fill="white" fillOpacity="0.9" />
                </svg>
              </span>
              <span className={`text-xs font-medium ${isActive ? 'text-ink' : 'text-stone'}`}>
                {config.label}
              </span>
              {!isActive && (
                <span className="ml-auto text-[10px] text-stone-light">hidden</span>
              )}
            </button>
          );
        })}
      </div>
      <div className="px-4 py-2 border-t border-stone-lighter bg-parchment/40">
        <p className="text-[9px] text-stone leading-snug">
          Click to show/hide layers
        </p>
      </div>
    </div>
  );
}
