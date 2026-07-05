'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

// Cinematic photo frames — each shows for ~400ms
const PHOTO_FRAMES = [
  { src: '/intro/ayodhya.png',        label: 'Ayodhya — The Golden Kingdom' },
  { src: '/intro/rama_bow.png',       label: 'Rama — The Divine Archer' },
  { src: '/intro/hanuman_flying.png', label: 'Hanuman — Messenger of the Gods' },
  { src: '/intro/ram_setu.png',       label: 'Ram Setu — Bridge Across the Sea' },
  { src: '/intro/lanka_burning.png',  label: 'Lanka — The Fall of Darkness' },
];

// Selected Sanskrit verses from the Valmiki Ramayana
const SANSKRIT_VERSES = [
  'रामाय रामभद्राय रामचन्द्राय वेधसे । रघुनाथाय नाथाय सीतायाः पतये नमः ॥',
  'धर्मो रक्षति रक्षितः ।',
  'जननी जन्मभूमिश्च स्वर्गादपि गरीयसी ॥',
];

interface SplashIntroProps {
  onComplete: () => void;
  forcePlay?: boolean;
}

export default function SplashIntro({ onComplete, forcePlay = false }: SplashIntroProps) {
  const [frameIndex, setFrameIndex] = useState(0);
  const [phase, setPhase] = useState<'flipping' | 'reveal' | 'fadeout'>('flipping');
  const [verseIndex, setVerseIndex] = useState(0);

  // Skip if already played this session
  useEffect(() => {
    if (!forcePlay && process.env.NODE_ENV === 'production') {
      const hasPlayed = sessionStorage.getItem('ramayana_intro_played');
      if (hasPlayed === 'true') onComplete();
    }
  }, [onComplete, forcePlay]);

  // Photo flipbook — cycles through all 5 images then holds last
  useEffect(() => {
    if (phase !== 'flipping') return;

    // Each frame shows for 420ms, total ~2.1s for all 5
    const interval = setInterval(() => {
      setFrameIndex((prev) => {
        const next = prev + 1;
        if (next >= PHOTO_FRAMES.length) {
          clearInterval(interval);
          return prev; // hold last frame
        }
        return next;
      });
    }, 420);

    // After all frames + a brief hold, go to golden reveal
    const timer = setTimeout(() => {
      setPhase('reveal');
    }, 2400);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [phase]);

  // Cycle verses during reveal
  useEffect(() => {
    if (phase !== 'reveal') return;
    const interval = setInterval(() => {
      setVerseIndex((prev) => (prev + 1) % SANSKRIT_VERSES.length);
    }, 600);
    const timer = setTimeout(() => setPhase('fadeout'), 1600);
    return () => { clearInterval(interval); clearTimeout(timer); };
  }, [phase]);

  useEffect(() => {
    if (phase === 'fadeout') {
      const timer = setTimeout(() => {
        sessionStorage.setItem('ramayana_intro_played', 'true');
        onComplete();
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [phase, onComplete]);

  const handleSkip = () => {
    sessionStorage.setItem('ramayana_intro_played', 'true');
    onComplete();
  };

  return (
    <AnimatePresence>
      {phase !== 'fadeout' && (
        <motion.div
          id="splash-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          style={{ backgroundColor: '#0a0806', position: 'fixed', inset: 0, zIndex: 9999 }}
          className="flex flex-col items-center justify-center select-none overflow-hidden"
        >
          {/* ── Background: full-bleed photo during flipping ── */}
          <AnimatePresence mode="wait">
            {phase === 'flipping' && (
              <motion.div
                key={frameIndex}
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="absolute inset-0"
              >
                <Image
                  src={PHOTO_FRAMES[frameIndex].src}
                  alt={PHOTO_FRAMES[frameIndex].label}
                  fill
                  priority
                  className="object-cover"
                  style={{ filter: 'brightness(0.45) saturate(1.2)' }}
                />
                {/* Dark gradient overlay so text is legible */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(10,8,6,0.92) 0%, rgba(10,8,6,0.3) 50%, rgba(10,8,6,0.55) 100%)',
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Background: deep dark for golden reveal ── */}
          {phase === 'reveal' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0"
              style={{ backgroundColor: '#0a0806' }}
            >
              {/* Last photo dimmed behind the title */}
              <Image
                src={PHOTO_FRAMES[PHOTO_FRAMES.length - 1].src}
                alt=""
                fill
                className="object-cover"
                style={{ filter: 'brightness(0.12) saturate(0.6)' }}
              />
              <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(10,8,6,0.2) 0%, rgba(10,8,6,0.95) 70%)' }} />
            </motion.div>
          )}

          {/* ── Cinematic scan-lines ── */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(rgba(18,16,15,0) 50%, rgba(0,0,0,0.22) 50%)',
              backgroundSize: '100% 4px',
              opacity: 0.5,
              zIndex: 1,
            }}
          />

          {/* ── Vignette ── */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 35%, rgba(5,3,2,0.85) 100%)',
              zIndex: 2,
            }}
          />

          {/* ── Photo caption during flipping ── */}
          {phase === 'flipping' && (
            <motion.p
              key={`caption-${frameIndex}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 0.7, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-16 left-0 right-0 text-center font-serif tracking-[0.22em] uppercase text-xs"
              style={{ color: '#C4872A', zIndex: 10, letterSpacing: '0.25em' }}
            >
              {PHOTO_FRAMES[frameIndex].label}
            </motion.p>
          )}

          {/* ── Skip button ── */}
          <button
            onClick={handleSkip}
            className="absolute top-8 right-8 rounded-full px-4 py-1.5 text-xs transition-all duration-300 backdrop-blur-sm"
            style={{
              zIndex: 50,
              border: '1px solid rgba(196,135,42,0.25)',
              color: 'rgba(196,135,42,0.7)',
              backgroundColor: 'rgba(10,8,6,0.7)',
            }}
          >
            Skip Intro
          </button>

          {/* ── Main title ── */}
          <div
            className="relative w-full max-w-4xl px-4 flex flex-col items-center justify-center"
            style={{ zIndex: 20 }}
          >
            <motion.div
              initial={{ scale: 1.1, filter: 'blur(4px)' }}
              animate={
                phase === 'reveal'
                  ? { scale: 1, filter: 'blur(0px)' }
                  : { scale: 1.02, filter: 'blur(0px)' }
              }
              transition={
                phase === 'reveal'
                  ? { duration: 1.2, ease: 'easeOut' }
                  : { duration: 2.4, ease: 'linear' }
              }
              className="w-full flex items-center justify-center"
            >
              {/* SVG mask: text shape filled with content */}
              <svg
                className="w-full drop-shadow-2xl"
                style={{ height: 'clamp(80px, 18vw, 220px)' }}
                viewBox="0 0 1000 220"
              >
                <defs>
                  <mask id="ramayana-text-mask" x="0" y="0" width="1000" height="220">
                    <rect x="0" y="0" width="1000" height="220" fill="black" />
                    <text
                      x="50%"
                      y="50%"
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="white"
                      style={{
                        fontSize: '115px',
                        fontWeight: 900,
                        letterSpacing: '0.16em',
                        fontFamily: 'serif',
                      }}
                    >
                      RAMAYANA
                    </text>
                  </mask>

                  {/* Golden gradient for reveal */}
                  <linearGradient id="gold-shimmer" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%"   stopColor="#F8F5EE" />
                    <stop offset="35%"  stopColor="#E8B566" />
                    <stop offset="70%"  stopColor="#C4872A" />
                    <stop offset="100%" stopColor="#8C3D22" />
                  </linearGradient>

                  {/* Shimmer sweep */}
                  <linearGradient id="shimmer-sweep" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%"   stopColor="rgba(255,255,255,0)" />
                    <stop offset="50%"  stopColor="rgba(255,255,255,0.45)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                  </linearGradient>

                  {/* Glow filter */}
                  <filter id="gold-glow">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Layer 1: Photo or gold inside text mask */}
                <g mask="url(#ramayana-text-mask)">
                  {phase === 'flipping' ? (
                    /* Show current photo cropped to text shape */
                    <image
                      href={PHOTO_FRAMES[frameIndex].src}
                      x="0" y="0" width="1000" height="220"
                      preserveAspectRatio="xMidYMid slice"
                      style={{ filter: 'brightness(1.3) saturate(1.4)' }}
                    />
                  ) : (
                    /* Golden plate on reveal */
                    <rect x="0" y="0" width="1000" height="220" fill="url(#gold-shimmer)" />
                  )}
                </g>

                {/* Layer 2: Shimmer sweep on reveal */}
                {phase === 'reveal' && (
                  <g mask="url(#ramayana-text-mask)">
                    <motion.rect
                      initial={{ x: -1000 }}
                      animate={{ x: 1200 }}
                      transition={{ duration: 1.4, ease: 'easeInOut' }}
                      x="0" y="0" width="600" height="220"
                      fill="url(#shimmer-sweep)"
                    />
                  </g>
                )}

                {/* Layer 3: Golden glow border on reveal */}
                {phase === 'reveal' && (
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="none"
                    stroke="#E8B566"
                    strokeWidth="1.5"
                    filter="url(#gold-glow)"
                    style={{
                      fontSize: '115px',
                      fontWeight: 900,
                      letterSpacing: '0.16em',
                      fontFamily: 'serif',
                      opacity: 0.65,
                      pointerEvents: 'none',
                    }}
                  >
                    RAMAYANA
                  </text>
                )}
              </svg>
            </motion.div>

            {/* Subtitle + verse on reveal */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={phase === 'reveal' ? { opacity: 1, y: 0 } : { opacity: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="mt-6 flex flex-col items-center gap-3"
            >
              <p
                className="font-serif text-sm sm:text-base tracking-[0.32em] uppercase text-center"
                style={{ color: 'rgba(181,160,128,0.85)' }}
              >
                Digital Humanities Atlas
              </p>
              <AnimatePresence mode="wait">
                <motion.p
                  key={verseIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.55 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="font-serif text-center max-w-lg px-4 text-xs"
                  style={{ color: '#C4872A', letterSpacing: '0.05em', lineHeight: 1.8 }}
                >
                  {SANSKRIT_VERSES[verseIndex]}
                </motion.p>
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Ambient golden particles on reveal */}
          {phase === 'reveal' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(circle, rgba(196,135,42,0.07) 1px, transparent 1px)',
                backgroundSize: '24px 24px',
                zIndex: 3,
              }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
