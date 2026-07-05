'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

type Phase = 'flipping' | 'title' | 'bow' | 'fadeout';

const PHOTO_FRAMES = [
  { src: '/intro/ayodhya.png',        label: 'Ayodhya — The Golden Kingdom' },
  { src: '/intro/rama_bow.png',       label: 'Rama — The Divine Archer' },
  { src: '/intro/hanuman_flying.png', label: 'Hanuman — Messenger of the Gods' },
  { src: '/intro/ram_setu.png',       label: 'Ram Setu — Bridge Across the Sea' },
  { src: '/intro/lanka_burning.png',  label: 'Lanka — The Fall of Darkness' },
];

interface SplashIntroProps {
  onComplete: () => void;
  forcePlay?: boolean;
}

export default function SplashIntro({ onComplete, forcePlay = false }: SplashIntroProps) {
  const [phase, setPhase]         = useState<Phase>('flipping');
  const [frameIndex, setFrameIndex] = useState(0);
  const [bowZoom, setBowZoom]     = useState(false);
  const [bowFlash, setBowFlash]   = useState(false);

  // Skip if already played
  useEffect(() => {
    if (!forcePlay && process.env.NODE_ENV === 'production') {
      if (sessionStorage.getItem('ramayana_intro_played') === 'true') onComplete();
    }
  }, [onComplete, forcePlay]);

  // ── Phase: flipping ─────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'flipping') return;
    setFrameIndex(0);

    const interval = setInterval(() => {
      setFrameIndex(prev => {
        if (prev + 1 >= PHOTO_FRAMES.length) { clearInterval(interval); return prev; }
        return prev + 1;
      });
    }, 420);

    const timer = setTimeout(() => setPhase('title'), 2600);
    return () => { clearInterval(interval); clearTimeout(timer); };
  }, [phase]);

  // ── Phase: title ─────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'title') return;
    const timer = setTimeout(() => setPhase('bow'), 1600);
    return () => clearTimeout(timer);
  }, [phase]);

  // ── Phase: bow ───────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'bow') return;
    const t1 = setTimeout(() => setBowZoom(true),  500);
    const t2 = setTimeout(() => setBowFlash(true), 1300);
    const t3 = setTimeout(() => setPhase('fadeout'), 1700);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [phase]);

  // ── Phase: fadeout ───────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'fadeout') return;
    const timer = setTimeout(() => {
      sessionStorage.setItem('ramayana_intro_played', 'true');
      onComplete();
    }, 600);
    return () => clearTimeout(timer);
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
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden select-none"
          style={{ backgroundColor: '#080604' }}
        >
          {/* ── Scan lines ── */}
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: 'linear-gradient(rgba(0,0,0,0) 50%, rgba(0,0,0,0.18) 50%)',
            backgroundSize: '100% 4px', opacity: 0.5, zIndex: 30,
          }} />
          {/* ── Vignette ── */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'radial-gradient(ellipse at center, transparent 35%, rgba(4,2,1,0.88) 100%)',
            zIndex: 31,
          }} />

          {/* ── Skip ── */}
          <button onClick={handleSkip}
            className="absolute top-6 right-6 text-xs tracking-widest uppercase rounded-full px-4 py-1.5 backdrop-blur-sm transition-all duration-300"
            style={{ zIndex: 50, border: '1px solid rgba(196,135,42,0.3)', color: 'rgba(196,135,42,0.65)', backgroundColor: 'rgba(8,6,4,0.75)' }}>
            Skip Intro
          </button>

          {/* ════════════════════════════════════════════════════
              PHASE 1 — PHOTO FLIPBOOK (full-bleed bg + SVG text mask)
          ════════════════════════════════════════════════════ */}
          <AnimatePresence>
            {phase === 'flipping' && (
              <motion.div
                key="flipping"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex flex-col items-center justify-center"
                style={{ zIndex: 10 }}
              >
                {/* Full-bleed photo behind everything */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={frameIndex}
                    initial={{ opacity: 0, scale: 1.06 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={PHOTO_FRAMES[frameIndex].src}
                      alt={PHOTO_FRAMES[frameIndex].label}
                      fill priority className="object-cover"
                      style={{ filter: 'brightness(0.38) saturate(1.3)' }}
                    />
                    <div className="absolute inset-0" style={{
                      background: 'linear-gradient(to top, rgba(8,6,4,0.95) 0%, rgba(8,6,4,0.15) 50%, rgba(8,6,4,0.5) 100%)',
                    }} />
                  </motion.div>
                </AnimatePresence>

                {/* RAMAYANA text mask — photo shows INSIDE the letters */}
                <div className="relative w-full flex flex-col items-center" style={{ zIndex: 5 }}>
                  <svg
                    viewBox="0 0 1000 200"
                    style={{ width: 'min(860px, 88vw)', height: 'auto', filter: 'drop-shadow(0 0 24px rgba(44,24,16,0.7))' }}
                  >
                    <defs>
                      <mask id="flip-mask">
                        <rect width="1000" height="200" fill="black" />
                        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central"
                          fill="white"
                          style={{ fontSize: '112px', fontWeight: 900, letterSpacing: '0.15em', fontFamily: 'serif' }}>
                          RAMAYANA
                        </text>
                      </mask>
                      <filter id="flip-glow">
                        <feGaussianBlur stdDeviation="3" result="b" />
                        <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                      </filter>
                    </defs>

                    {/* Photo cropped into text shape */}
                    <g mask="url(#flip-mask)">
                      <image
                        href={PHOTO_FRAMES[frameIndex].src}
                        x="0" y="0" width="1000" height="200"
                        preserveAspectRatio="xMidYMid slice"
                        style={{ filter: 'brightness(1.5) saturate(1.5) contrast(1.1)' }}
                      />
                    </g>

                    {/* Subtle outer glow on the text shape */}
                    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central"
                      fill="none" stroke="rgba(196,135,42,0.35)" strokeWidth="1.5"
                      filter="url(#flip-glow)"
                      style={{ fontSize: '112px', fontWeight: 900, letterSpacing: '0.15em', fontFamily: 'serif' }}>
                      RAMAYANA
                    </text>
                  </svg>

                  {/* Caption below */}
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={frameIndex}
                      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 0.7, y: 0 }} exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-5 font-serif text-xs tracking-[0.28em] uppercase text-center"
                      style={{ color: '#C4872A' }}
                    >
                      {PHOTO_FRAMES[frameIndex].label}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ════════════════════════════════════════════════════
              PHASE 2 — GOLDEN TITLE REVEAL
          ════════════════════════════════════════════════════ */}
          <AnimatePresence>
            {phase === 'title' && (
              <motion.div
                key="title"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex flex-col items-center justify-center"
                style={{ zIndex: 10 }}
              >
                {/* Last photo dimmed behind */}
                <Image src={PHOTO_FRAMES[PHOTO_FRAMES.length - 1].src} alt="" fill className="object-cover"
                  style={{ filter: 'brightness(0.1) saturate(0.4)' }} />
                <div className="absolute inset-0" style={{
                  background: 'radial-gradient(ellipse at center, rgba(8,6,4,0.1) 0%, rgba(8,6,4,0.94) 65%)',
                }} />

                <motion.div
                  initial={{ scale: 1.12, filter: 'blur(5px)', opacity: 0 }}
                  animate={{ scale: 1, filter: 'blur(0px)', opacity: 1 }}
                  transition={{ duration: 0.9, ease: 'easeOut' }}
                  className="relative flex flex-col items-center gap-4"
                  style={{ zIndex: 5 }}
                >
                  <svg viewBox="0 0 1000 200" style={{ width: 'min(860px, 88vw)', height: 'auto' }}>
                    <defs>
                      <mask id="title-mask">
                        <rect width="1000" height="200" fill="black" />
                        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central"
                          fill="white"
                          style={{ fontSize: '112px', fontWeight: 900, letterSpacing: '0.15em', fontFamily: 'serif' }}>
                          RAMAYANA
                        </text>
                      </mask>
                      <linearGradient id="gold-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%"   stopColor="#FDEFC0" />
                        <stop offset="30%"  stopColor="#ECC068" />
                        <stop offset="65%"  stopColor="#C4872A" />
                        <stop offset="100%" stopColor="#7A2E10" />
                      </linearGradient>
                      <linearGradient id="sweep-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%"   stopColor="rgba(255,255,255,0)" />
                        <stop offset="50%"  stopColor="rgba(255,255,255,0.5)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                      </linearGradient>
                      <filter id="title-glow">
                        <feGaussianBlur stdDeviation="4" result="b" />
                        <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                      </filter>
                    </defs>
                    <g mask="url(#title-mask)">
                      <rect width="1000" height="200" fill="url(#gold-grad)" />
                      <motion.rect
                        initial={{ x: -700 }} animate={{ x: 1500 }}
                        transition={{ duration: 1.2, ease: 'easeInOut', delay: 0.15 }}
                        y="0" width="500" height="200" fill="url(#sweep-grad)"
                      />
                    </g>
                    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central"
                      fill="none" stroke="#F0C060" strokeWidth="1.2"
                      filter="url(#title-glow)"
                      style={{ fontSize: '112px', fontWeight: 900, letterSpacing: '0.15em', fontFamily: 'serif', opacity: 0.55 }}>
                      RAMAYANA
                    </text>
                  </svg>

                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 0.8, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.7 }}
                    className="font-serif tracking-[0.38em] uppercase text-sm text-center"
                    style={{ color: 'rgba(181,160,128,0.85)' }}
                  >
                    Digital Humanities Atlas
                  </motion.p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ════════════════════════════════════════════════════
              PHASE 3 — BOW FINALE
          ════════════════════════════════════════════════════ */}
          <AnimatePresence>
            {phase === 'bow' && (
              <motion.div
                key="bow"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0"
                style={{ zIndex: 10 }}
              >
                {/* Bow photo — zooms into center */}
                <motion.div
                  className="absolute inset-0"
                  initial={{ scale: 1 }}
                  animate={{ scale: bowZoom ? 1.4 : 1 }}
                  transition={{ duration: 1.2, ease: 'easeIn' }}
                >
                  <Image
                    src="/intro/bow_closeup.png"
                    alt="Divine Bow"
                    fill className="object-cover"
                    style={{ filter: 'brightness(0.7) saturate(1.4) contrast(1.1)' }}
                  />
                  <div className="absolute inset-0" style={{
                    background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.75) 100%)',
                  }} />
                </motion.div>

                {/* White flash on release */}
                {bowFlash && (
                  <motion.div
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.4 }}
                    style={{ backgroundColor: '#FFF8E0', zIndex: 20 }}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
