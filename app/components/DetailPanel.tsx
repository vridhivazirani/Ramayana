'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Location, STATUS_CONFIG } from '@/types';
import { X, MapPin, BookOpen } from 'lucide-react';

interface DetailPanelProps {
  location: Location | null;
  onClose: () => void;
  isMobile: boolean;
}

const KANDA_COLORS: Record<string, string> = {
  'Bala Kanda': '#7B5EA7',
  'Ayodhya Kanda': '#3B82F6',
  'Aranya Kanda': '#10B981',
  'Kishkindha Kanda': '#F59E0B',
  'Sundara Kanda': '#EC4899',
  'Yuddha Kanda': '#EF4444',
  'Uttara Kanda': '#6B7280',
};

export default function DetailPanel({ location, onClose, isMobile }: DetailPanelProps) {
  if (!location) return null;

  const statusConfig = STATUS_CONFIG[location.status];
  const kandaColor = KANDA_COLORS[location.kanda] || '#8B7355';

  const panelVariants = isMobile
    ? {
        initial: { y: '100%', opacity: 0 },
        animate: { y: 0, opacity: 1 },
        exit: { y: '100%', opacity: 0 },
      }
    : {
        initial: { x: '100%', opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: '100%', opacity: 0 },
      };

  return (
    <AnimatePresence>
      {location && (
        <>
          {/* Backdrop — mobile only */}
          {isMobile && (
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-ink/40 z-[1100]"
              onClick={onClose}
            />
          )}

          <motion.aside
            key="panel"
            variants={panelVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 35 }}
            className={`
              fixed z-[1200] bg-mist overflow-y-auto
              ${isMobile
                ? 'bottom-0 left-0 right-0 rounded-t-2xl max-h-[82vh] shadow-panel'
                : 'top-14 right-0 w-[420px] bottom-0 border-l border-stone-lighter shadow-panel'
              }
            `}
            id="detail-panel"
          >
            {/* Drag handle — mobile */}
            {isMobile && (
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 bg-stone-lighter rounded-full" />
              </div>
            )}

            {/* Header */}
            <div className="sticky top-0 bg-mist/95 backdrop-blur-sm z-10 border-b border-stone-lighter">
              <div className="flex items-start justify-between px-5 py-4">
                <div className="flex-1 pr-4">
                  {/* Kanda badge */}
                  <span
                    className="kanda-badge inline-block mb-2 px-2 py-0.5 rounded text-white text-[10px]"
                    style={{ backgroundColor: kandaColor }}
                  >
                    {location.kanda}
                  </span>
                  <h2 className="font-serif text-2xl text-ink font-semibold leading-tight">
                    {location.name}
                  </h2>
                  <p className="flex items-center gap-1.5 text-stone text-sm mt-1">
                    <MapPin size={13} />
                    {location.modernIdentification}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  id="close-detail-panel"
                  className="flex-shrink-0 p-1.5 rounded-full hover:bg-stone-lighter/50 text-stone hover:text-ink transition-colors"
                  aria-label="Close panel"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Status chip */}
              <div className="px-5 pb-3">
                <span className={`status-chip ${location.status}`}>
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: statusConfig.color }}
                  />
                  {statusConfig.label}
                </span>
              </div>
            </div>

            {/* Body */}
            <div className="px-5 py-5 space-y-6">
              {/* Description */}
              <section>
                <p className="text-sm leading-relaxed text-charcoal">
                  {location.description}
                </p>
              </section>

              {/* Alternate theory note */}
              {location.alternateTheory && (
                <section className="academic-note">
                  <p className="text-xs font-semibold text-ochre uppercase tracking-wider mb-1.5">
                    Alternate Identification
                  </p>
                  <p className="text-xs leading-relaxed text-charcoal">
                    {location.alternateTheory}
                  </p>
                </section>
              )}

              {/* Status explanation */}
              <section className="bg-parchment rounded-lg p-4 border border-parchment-dark">
                <p className="text-xs font-semibold text-stone uppercase tracking-wider mb-1">
                  Status: {statusConfig.label}
                </p>
                <p className="text-xs text-stone leading-relaxed">
                  {statusConfig.description}
                </p>
              </section>

              {/* Sources */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen size={14} className="text-ochre" />
                  <h3 className="font-sans text-xs font-semibold text-stone uppercase tracking-wider">
                    Sources & Citations
                  </h3>
                </div>
                <ul className="space-y-2.5">
                  {location.sources.map((source, i) => (
                    <li key={i} className="source-citation">
                      {source}
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
