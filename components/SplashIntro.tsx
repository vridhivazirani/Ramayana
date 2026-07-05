'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

// The full cinematic sequence — each scene shown as a full-bleed photo
const SCENES = [
  {
    src: '/intro/hanuman_heart.png',
    duration: 2800,
    caption: 'In his heart, Rama & Sita reside forever',
    zoom: 1.06,
  },
  {
    src: '/intro/ayodhya.png',
    duration: 900,
    caption: 'Ayodhya — The Golden Kingdom',
    zoom: 1.08,
  },
  {
    src: '/intro/rama_bow.png',
    duration: 900,
    caption: 'Rama — The Divine Archer',
    zoom: 1.05,
  },
  {
    src: '/intro/hanuman_flying.png',
    duration: 900,
    caption: 'Hanuman — Messenger of the Gods',
    zoom: 1.07,
  },
  {
    src: '/intro/ram_setu.png',
    duration: 900,
    caption: 'Ram Setu — Bridge Across the Sea',
    zoom: 1.06,
  },
  {
    src: '/intro/lanka_burning.png',
    duration: 900,
    caption: 'Lanka — The Fall of Darkness',
    zoom: 1.08,
  },
  {
    src: '/intro/bow_closeup.png',
    duration: 1800,
    caption: '',
    zoom: 1.12,
    isBowScene: true,
  },
];

interface SplashIntroProps {
  onComplete: () => void;
  forcePlay?: boolean;
}

export default function SplashIntro({ onComplete, forcePlay = false }: SplashIntroProps) {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [showTitle, setShowTitle] = useState(false);
  const [bowZoom, setBowZoom] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [done, setDone] = useState(false);

  // Skip if already played
  useEffect(() => {
    if (!forcePlay && process.env.NODE_ENV === 'production') {
      if (sessionStorage.getItem('ramayana_intro_played') === 'true') onComplete();
    }
  }, [onComplete, forcePlay]);

  // Drive the scene sequence
  useEffect(() => {
    if (done) return;

    const scene = SCENES[sceneIndex];

    // Show title text after first scene settles
    if (sceneIndex === 0) {
      const t = setTimeout(() => setShowTitle(true), 600);
      return () => clearTimeout(t);
    }

    // Bow scene — zoom in and then fade out
    if (scene.isBowScene) {
      const t1 = setTimeout(() => setBowZoom(true), 400);
      const t2 = setTimeout(() => setFadeOut(true), 1400);
      const t3 = setTimeout(() => {
        sessionStorage.setItem('ramayana_intro_played', 'true');
        setDone(true);
        onComplete();
      }, 2100);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
    }

    // Normal scene — advance after duration
    const t = setTimeout(() => {
      setShowTitle(false);
      setSceneIndex(prev => Math.min(prev + 1, SCENES.length - 1));
    }, scene.duration);

    return () => clearTimeout(t);
  }, [sceneIndex, done, onComplete]);

  const handleSkip = () => {
    sessionStorage.setItem('ramayana_intro_played', 'true');
    onComplete();
  };

  const scene = SCENES[sceneIndex];

  if (done) return null;

  return (
    <AnimatePresence>
      {!fadeOut ? (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[9999] overflow-hidden"
          style={{ backgroundColor: '#000' }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* ── SCENE PHOTO ── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={sceneIndex}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: scene.isBowScene ? 0.3 : 0.55, ease: 'easeInOut' }}
            >
              <motion.div
                className="absolute inset-0"
                initial={{ scale: 1 }}
                animate={{ scale: scene.isBowScene && bowZoom ? 1.35 : scene.zoom }}
                transition={{ duration: scene.duration / 1000, ease: 'easeOut' }}
              >
                <Image
                  src={scene.src}
                  alt={scene.caption}
                  fill
                  priority
                  className="object-cover"
                  style={{
                    filter: scene.isBowScene
                      ? 'brightness(0.75) saturate(1.4) contrast(1.1)'
                      : 'brightness(0.5) saturate(1.25)',
                  }}
                />
              </motion.div>

              {/* Bottom gradient for text legibility */}
              <div className="absolute inset-0" style={{
                background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.1) 45%, rgba(0,0,0,0.45) 100%)',
              }} />
              {/* Side vignette */}
              <div className="absolute inset-0" style={{
                background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)',
              }} />
            </motion.div>
          </AnimatePresence>

          {/* ── FILM GRAIN OVERLAY ── */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat', backgroundSize: '256px 256px', zIndex: 5,
          }} />

          {/* ── SCAN LINES ── */}
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: 'linear-gradient(transparent 50%, rgba(0,0,0,0.12) 50%)',
            backgroundSize: '100% 3px', zIndex: 6, opacity: 0.5,
          }} />

          {/* ── HANUMAN SCENE — title & caption ── */}
          {sceneIndex === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-20" style={{ zIndex: 20 }}>
              <AnimatePresence>
                {showTitle && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="flex flex-col items-center gap-3"
                  >
                    <p className="font-serif text-center text-sm tracking-[0.35em] uppercase"
                      style={{ color: 'rgba(232, 181, 102, 0.9)' }}>
                      {scene.caption}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* ── STORY SCENES — caption ── */}
          {sceneIndex > 0 && !scene.isBowScene && (
            <AnimatePresence mode="wait">
              <motion.div
                key={`cap-${sceneIndex}`}
                className="absolute bottom-16 left-0 right-0 flex justify-center"
                style={{ zIndex: 20 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.45 }}
              >
                <p className="font-serif text-xs tracking-[0.28em] uppercase text-center"
                  style={{ color: 'rgba(196, 135, 42, 0.85)' }}>
                  {scene.caption}
                </p>
              </motion.div>
            </AnimatePresence>
          )}

          {/* ── BOW SCENE — RAMAYANA title zooms in with bow ── */}
          {scene.isBowScene && (
            <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ zIndex: 20 }}>
              <motion.div
                className="flex flex-col items-center gap-4"
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: bowZoom ? 1.08 : 1 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              >
                {/* RAMAYANA golden title */}
                <svg viewBox="0 0 900 160" style={{ width: 'min(820px, 85vw)', height: 'auto' }}>
                  <defs>
                    <mask id="bow-title-mask">
                      <rect width="900" height="160" fill="black" />
                      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central"
                        fill="white"
                        style={{ fontSize: '108px', fontWeight: 900, letterSpacing: '0.15em', fontFamily: 'serif' }}>
                        RAMAYANA
                      </text>
                    </mask>
                    <linearGradient id="bow-gold" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#FDEFC0" />
                      <stop offset="30%" stopColor="#ECC068" />
                      <stop offset="70%" stopColor="#C4872A" />
                      <stop offset="100%" stopColor="#7A2E10" />
                    </linearGradient>
                    <linearGradient id="bow-sweep" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                      <stop offset="50%" stopColor="rgba(255,255,255,0.55)" />
                      <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                    </linearGradient>
                    <filter id="bow-glow">
                      <feGaussianBlur stdDeviation="4" result="b" />
                      <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                  </defs>
                  {/* Gold fill masked to text */}
                  <g mask="url(#bow-title-mask)">
                    <rect width="900" height="160" fill="url(#bow-gold)" />
                    <motion.rect
                      initial={{ x: -700 }} animate={{ x: 1400 }}
                      transition={{ duration: 1.2, ease: 'easeInOut', delay: 0.2 }}
                      y="0" width="500" height="160" fill="url(#bow-sweep)"
                    />
                  </g>
                  {/* Glow stroke */}
                  <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central"
                    fill="none" stroke="#F0C060" strokeWidth="1.2"
                    filter="url(#bow-glow)"
                    style={{ fontSize: '108px', fontWeight: 900, letterSpacing: '0.15em', fontFamily: 'serif', opacity: 0.5 }}>
                    RAMAYANA
                  </text>
                </svg>

                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 0.8, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.7 }}
                  className="font-serif tracking-[0.38em] uppercase text-sm text-center"
                  style={{ color: 'rgba(181,160,128,0.85)' }}
                >
                  Digital Humanities Atlas
                </motion.p>
              </motion.div>
            </div>
          )}

          {/* ── SKIP BUTTON ── */}
          <button
            onClick={handleSkip}
            className="absolute top-6 right-6 text-xs tracking-widest uppercase rounded-full px-4 py-1.5 backdrop-blur-sm transition-all duration-300"
            style={{
              zIndex: 50,
              border: '1px solid rgba(196,135,42,0.3)',
              color: 'rgba(196,135,42,0.65)',
              backgroundColor: 'rgba(0,0,0,0.6)',
            }}
          >
            Skip Intro
          </button>

          {/* ── PROGRESS DOTS ── */}
          <div className="absolute bottom-7 left-0 right-0 flex justify-center gap-2" style={{ zIndex: 20 }}>
            {SCENES.map((_, i) => (
              <motion.div
                key={i}
                className="rounded-full"
                animate={{
                  width: i === sceneIndex ? 20 : 6,
                  backgroundColor: i === sceneIndex ? '#C4872A' : 'rgba(255,255,255,0.25)',
                }}
                transition={{ duration: 0.35 }}
                style={{ height: 4 }}
              />
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="fadeout"
          className="fixed inset-0 z-[9999]"
          style={{ backgroundColor: '#000' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
        />
      )}
    </AnimatePresence>
  );
}
