'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { Location, STATUS_CONFIG } from '@/types';
import locationsData from '@/data/locations.json';
import { ChevronLeft, ChevronRight, MapPin, BookOpen } from 'lucide-react';

// Dynamic map import (SSR disabled)
const TimelineMap = dynamic(() => import('@/components/TimelineMap'), { ssr: false });

const KANDA_COLORS: Record<string, string> = {
  'Bala Kanda': '#7B5EA7',
  'Ayodhya Kanda': '#3B82F6',
  'Aranya Kanda': '#10B981',
  'Kishkindha Kanda': '#F59E0B',
  'Sundara Kanda': '#EC4899',
  'Yuddha Kanda': '#EF4444',
  'Uttara Kanda': '#6B7280',
};

export default function TimelinePage() {
  const locations = (locationsData as Location[]).sort(
    (a, b) => a.sequenceOrder - b.sequenceOrder,
  );

  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const playIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentLocation = locations[currentStep];
  const progress = ((currentStep + 1) / locations.length) * 100;

  // Auto-play
  useEffect(() => {
    if (isPlaying) {
      playIntervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= locations.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2500);
    }
    return () => {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    };
  }, [isPlaying, locations.length]);

  // Scroll active card into view
  useEffect(() => {
    const el = document.getElementById(`step-card-${currentStep}`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [currentStep]);

  const goToStep = (i: number) => {
    setCurrentStep(i);
    setIsPlaying(false);
  };

  const stepForward = () => {
    if (currentStep < locations.length - 1) setCurrentStep(currentStep + 1);
    setIsPlaying(false);
  };

  const stepBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
    setIsPlaying(false);
  };

  const statusConfig = STATUS_CONFIG[currentLocation.status];
  const kandaColor = KANDA_COLORS[currentLocation.kanda] || '#8B7355';

  return (
    <div className="min-h-screen bg-mist pt-14 flex flex-col">
      {/* Page header */}
      <header className="page-header px-6 py-5 text-center">
        <p className="text-ochre font-sans text-[10px] uppercase tracking-widest mb-1">
          Rama&apos;s Journey
        </p>
        <h1 className="font-serif text-parchment text-2xl md:text-3xl font-semibold">
          Timeline of the Ramayana
        </h1>
        <p className="text-stone-light text-xs mt-2 max-w-xl mx-auto">
          Trace Rama&apos;s route across the subcontinent, kanda by kanda, from Ayodhya to Lanka and back.
        </p>
      </header>

      {/* Progress bar */}
      <div className="w-full h-1 bg-stone-lighter">
        <motion.div
          className="h-full bg-ochre"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Main layout: map + detail card side by side on desktop */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">

        {/* Map panel */}
        <div className="relative h-56 md:h-auto md:flex-1 border-b md:border-b-0 md:border-r border-stone-lighter">
          <TimelineMap
            locations={locations}
            currentStep={currentStep}
            onSelectStep={goToStep}
          />
        </div>

        {/* Detail panel */}
        <div className="w-full md:w-[380px] flex flex-col bg-mist overflow-hidden">
          {/* Step indicator */}
          <div className="px-5 pt-4 pb-2 border-b border-stone-lighter flex items-center justify-between">
            <p className="text-xs text-stone font-sans">
              Stop <span className="font-semibold text-ink">{currentStep + 1}</span> of{' '}
              <span className="font-semibold text-ink">{locations.length}</span>
            </p>
            <div className="flex gap-1.5">
              {/* Play button */}
              <button
                id="timeline-play-pause"
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-3 py-1 rounded text-xs font-medium bg-ochre/10 hover:bg-ochre/20 text-ochre-dark border border-ochre/20 transition-colors"
              >
                {isPlaying ? '⏸ Pause' : '▶ Play'}
              </button>
            </div>
          </div>

          {/* Animated location card */}
          <div className="flex-1 overflow-y-auto p-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3 }}
              >
                {/* Kanda + sequence */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="kanda-badge px-2 py-0.5 rounded text-white"
                    style={{ backgroundColor: kandaColor }}
                  >
                    {currentLocation.kanda}
                  </span>
                  <span className="text-xs text-stone">
                    #{currentLocation.sequenceOrder}
                  </span>
                </div>

                <h2 className="font-serif text-2xl text-ink font-semibold mb-1">
                  {currentLocation.name}
                </h2>

                <p className="flex items-center gap-1.5 text-stone text-xs mb-4">
                  <MapPin size={12} />
                  {currentLocation.modernIdentification}
                </p>

                <span className={`status-chip ${currentLocation.status} mb-4 inline-flex`}>
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: statusConfig.color }}
                  />
                  {statusConfig.label}
                </span>

                <p className="text-sm leading-relaxed text-charcoal mt-3">
                  {currentLocation.description}
                </p>

                {currentLocation.alternateTheory && (
                  <div className="academic-note mt-4">
                    <p className="text-[10px] font-semibold text-ochre uppercase tracking-wider mb-1">
                      Alternate Identification
                    </p>
                    <p className="text-xs leading-relaxed text-charcoal">
                      {currentLocation.alternateTheory}
                    </p>
                  </div>
                )}

                {/* Sources */}
                <div className="mt-5">
                  <div className="flex items-center gap-1.5 mb-2">
                    <BookOpen size={12} className="text-ochre" />
                    <p className="text-[10px] font-semibold text-stone uppercase tracking-wider">
                      Sources
                    </p>
                  </div>
                  <ul className="space-y-1.5">
                    {currentLocation.sources.map((src, i) => (
                      <li key={i} className="source-citation">
                        {src}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Prev / Next controls */}
          <div className="border-t border-stone-lighter px-5 py-3 flex items-center gap-3">
            <button
              id="timeline-prev"
              onClick={stepBack}
              disabled={currentStep === 0}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border border-stone-lighter bg-parchment hover:border-ochre hover:text-ochre-dark disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={15} />
              Prev
            </button>

            {/* Dot indicators */}
            <div className="flex-1 flex items-center justify-center gap-1 overflow-hidden">
              {locations.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToStep(i)}
                  className={`rounded-full transition-all duration-200 ${
                    i === currentStep
                      ? 'w-4 h-2 bg-ochre'
                      : 'w-2 h-2 bg-stone-lighter hover:bg-stone-light'
                  }`}
                  aria-label={`Go to stop ${i + 1}`}
                />
              ))}
            </div>

            <button
              id="timeline-next"
              onClick={stepForward}
              disabled={currentStep === locations.length - 1}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border border-stone-lighter bg-parchment hover:border-ochre hover:text-ochre-dark disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Next
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable strip of all stops */}
      <div
        className="border-t border-stone-lighter bg-parchment/60 overflow-x-auto"
        ref={cardRef}
      >
        <div className="flex gap-2 px-4 py-3 w-max">
          {locations.map((loc, i) => (
            <button
              key={loc.id}
              id={`step-card-${i}`}
              onClick={() => goToStep(i)}
              className={`
                flex-shrink-0 w-36 text-left rounded-xl px-3 py-2.5 border transition-all duration-200 timeline-card
                ${i === currentStep ? 'active border-ochre' : 'border-stone-lighter'}
              `}
            >
              <p
                className="text-[9px] font-bold uppercase tracking-wider mb-0.5"
                style={{ color: KANDA_COLORS[loc.kanda] || '#8B7355' }}
              >
                {loc.kanda.replace(' Kanda', '')}
              </p>
              <p className="text-xs font-semibold text-ink truncate">{loc.name}</p>
              <p className="text-[10px] text-stone truncate mt-0.5">{loc.modernIdentification.split(',')[0]}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
