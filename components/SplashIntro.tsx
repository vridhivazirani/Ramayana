'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

type Phase = 'hanuman' | 'photos' | 'title' | 'bow' | 'fadeout';

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
  const [phase, setPhase] = useState<Phase>('hanuman');
  const [chestOpen, setChestOpen]     = useState(false);
  const [lightBurst, setLightBurst]   = useState(false);
  const [frameIndex, setFrameIndex]   = useState(0);
  const [arrowDrawn, setArrowDrawn]   = useState(false);
  const [arrowFired, setArrowFired]   = useState(false);

  // Skip if already played
  useEffect(() => {
    if (!forcePlay && process.env.NODE_ENV === 'production') {
      if (sessionStorage.getItem('ramayana_intro_played') === 'true') onComplete();
    }
  }, [onComplete, forcePlay]);

  // ── Phase: hanuman ──────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'hanuman') return;
    // chest opens after 1.2s
    const t1 = setTimeout(() => setChestOpen(true), 1200);
    // light burst after chest opens
    const t2 = setTimeout(() => setLightBurst(true), 1900);
    // move to photos
    const t3 = setTimeout(() => setPhase('photos'), 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [phase]);

  // ── Phase: photos ───────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'photos') return;
    setFrameIndex(0);
    const interval = setInterval(() => {
      setFrameIndex(prev => {
        if (prev + 1 >= PHOTO_FRAMES.length) { clearInterval(interval); return prev; }
        return prev + 1;
      });
    }, 450);
    const timer = setTimeout(() => setPhase('title'), 2800);
    return () => { clearInterval(interval); clearTimeout(timer); };
  }, [phase]);

  // ── Phase: title ────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'title') return;
    const timer = setTimeout(() => setPhase('bow'), 1800);
    return () => clearTimeout(timer);
  }, [phase]);

  // ── Phase: bow ──────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'bow') return;
    // bow appears, then arrow draws back
    const t1 = setTimeout(() => setArrowDrawn(true), 700);
    // arrow fires
    const t2 = setTimeout(() => setArrowFired(true), 1400);
    // screen tears open → fadeout
    const t3 = setTimeout(() => setPhase('fadeout'), 2000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [phase]);

  // ── Phase: fadeout ──────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'fadeout') return;
    const timer = setTimeout(() => {
      sessionStorage.setItem('ramayana_intro_played', 'true');
      onComplete();
    }, 700);
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
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden select-none"
          style={{ backgroundColor: '#080604' }}
        >
          {/* ── Scan lines ── */}
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: 'linear-gradient(rgba(0,0,0,0) 50%, rgba(0,0,0,0.18) 50%)',
            backgroundSize: '100% 4px', opacity: 0.6, zIndex: 30,
          }} />

          {/* ── Vignette ── */}
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'radial-gradient(ellipse at center, transparent 30%, rgba(4,2,1,0.88) 100%)',
            zIndex: 31,
          }} />

          {/* ── Skip ── */}
          <button onClick={handleSkip} className="absolute top-6 right-6 text-xs tracking-widest uppercase rounded-full px-4 py-1.5 backdrop-blur-sm transition-all duration-300 hover:opacity-100" style={{
            zIndex: 50, border: '1px solid rgba(196,135,42,0.3)',
            color: 'rgba(196,135,42,0.6)', backgroundColor: 'rgba(8,6,4,0.75)',
          }}>
            Skip Intro
          </button>

          {/* ══════════════════════════════════════════════════════════════
              PHASE 1 — HANUMAN HEART
          ══════════════════════════════════════════════════════════════ */}
          <AnimatePresence>
            {phase === 'hanuman' && (
              <motion.div
                key="hanuman-scene"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex items-center justify-center"
                style={{ zIndex: 10 }}
              >
                {/* Ambient golden radial glow behind Hanuman */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={lightBurst
                    ? { opacity: [0.3, 0.9, 0.5], scale: [1, 2.5, 2] }
                    : { opacity: 0.15, scale: 1 }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  className="absolute rounded-full pointer-events-none"
                  style={{
                    width: 340, height: 340,
                    background: 'radial-gradient(circle, rgba(255,180,40,0.55) 0%, rgba(196,100,20,0.2) 45%, transparent 75%)',
                    filter: 'blur(18px)',
                  }}
                />

                {/* HANUMAN SVG */}
                <svg
                  viewBox="0 0 300 420"
                  style={{ width: 'min(320px, 60vw)', height: 'auto', position: 'relative', zIndex: 2 }}
                  fill="none"
                >
                  {/* ─── Body silhouette (simplified Hanuman in devotee pose) ─── */}

                  {/* Head with crown */}
                  <motion.ellipse cx="150" cy="60" rx="35" ry="38"
                    initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    fill="#2a1800" stroke="#C4872A" strokeWidth="1.5"
                  />
                  {/* Crown spikes */}
                  {[130, 140, 150, 160, 170].map((x, i) => (
                    <motion.path key={i} d={`M${x} 26 L${x - 3} 10 L${x + 3} 10 Z`}
                      initial={{ opacity: 0, scaleY: 0 }} animate={{ opacity: 1, scaleY: 1 }}
                      transition={{ delay: 0.2 + i * 0.05, duration: 0.4 }}
                      fill="#C4872A"
                    />
                  ))}
                  {/* Face halo */}
                  <motion.circle cx="150" cy="60" r="44"
                    initial={{ opacity: 0 }} animate={{ opacity: 0.4 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    stroke="#E8B566" strokeWidth="1" fill="none"
                    strokeDasharray="4 6"
                  />

                  {/* Torso */}
                  <motion.path d="M105 95 Q90 120 92 180 Q95 220 105 240 L195 240 Q205 220 208 180 Q210 120 195 95 Z"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    fill="#1e1008" stroke="#C4872A" strokeWidth="1.5"
                  />

                  {/* Arms raised in prayer */}
                  <motion.path d="M105 110 Q70 95 55 80 Q45 70 50 60 Q55 50 65 58 Q80 75 105 100"
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    fill="#1e1008" stroke="#C4872A" strokeWidth="1.5"
                  />
                  <motion.path d="M195 110 Q230 95 245 80 Q255 70 250 60 Q245 50 235 58 Q220 75 195 100"
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    fill="#1e1008" stroke="#C4872A" strokeWidth="1.5"
                  />
                  {/* Hands clasped */}
                  <motion.ellipse cx="150" cy="55" rx="18" ry="12"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                    fill="#2a1800" stroke="#C4872A" strokeWidth="1.5"
                  />

                  {/* Legs */}
                  <motion.path d="M115 240 Q110 290 108 340 Q108 360 120 362 Q132 364 135 340 Q138 300 150 270"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    fill="#1e1008" stroke="#C4872A" strokeWidth="1.5"
                  />
                  <motion.path d="M185 240 Q190 290 192 340 Q192 360 180 362 Q168 364 165 340 Q162 300 150 270"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    fill="#1e1008" stroke="#C4872A" strokeWidth="1.5"
                  />
                  {/* Tail curling up */}
                  <motion.path d="M185 230 Q220 240 235 215 Q248 190 230 175 Q215 162 205 178 Q198 190 210 195 Q220 200 218 190"
                    initial={{ opacity: 0, pathLength: 0 }} animate={{ opacity: 1, pathLength: 1 }}
                    transition={{ delay: 0.4, duration: 1.2, ease: 'easeOut' }}
                    stroke="#C4872A" strokeWidth="2.5" fill="none" strokeLinecap="round"
                  />

                  {/* ─── CHEST DOORS ─── */}
                  {/* Left chest door */}
                  <motion.path
                    d="M110 110 Q108 130 108 160 Q108 185 112 200 L150 200 L150 110 Z"
                    initial={{ x: 0 }}
                    animate={{ x: chestOpen ? -38 : 0 }}
                    transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                    fill="#2d1a06" stroke="#C4872A" strokeWidth="1.5"
                    style={{ originX: '110px', originY: '155px' }}
                  />
                  {/* Right chest door */}
                  <motion.path
                    d="M150 110 L188 110 Q192 130 192 160 Q192 185 188 200 L150 200 Z"
                    initial={{ x: 0 }}
                    animate={{ x: chestOpen ? 38 : 0 }}
                    transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                    fill="#2d1a06" stroke="#C4872A" strokeWidth="1.5"
                  />

                  {/* ─── INSIDE CHEST: Rama & Sita ─── */}
                  {chestOpen && (
                    <g>
                      {/* Golden glow core */}
                      <motion.ellipse
                        cx="150" cy="155" rx="30" ry="38"
                        initial={{ opacity: 0, scaleX: 0.3, scaleY: 0.3 }}
                        animate={{ opacity: 1, scaleX: 1, scaleY: 1 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        fill="url(#heartGlow)"
                      />
                      {/* Rama silhouette (right, slightly taller) */}
                      <motion.g
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                      >
                        {/* Rama body */}
                        <ellipse cx="155" cy="142" rx="5" ry="6" fill="#FFF5DC" />
                        <path d="M150 148 Q148 158 149 168 L161 168 Q162 158 160 148 Z" fill="#FFF5DC" />
                        {/* Bow hint */}
                        <path d="M162 150 Q167 155 162 162" stroke="#E8B566" strokeWidth="1" fill="none" />
                        <line x1="162" y1="150" x2="162" y2="162" stroke="#E8B566" strokeWidth="0.8" />
                      </motion.g>
                      {/* Sita silhouette (left, smaller) */}
                      <motion.g
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                      >
                        <ellipse cx="143" cy="144" rx="4" ry="5" fill="#FFF5DC" />
                        <path d="M139 149 Q138 158 139 167 L147 167 Q148 158 147 149 Z" fill="#FFF5DC" />
                        {/* Hair */}
                        <path d="M139 141 Q143 136 147 141" stroke="#FFF5DC" strokeWidth="1.5" fill="none" />
                      </motion.g>
                      {/* Rays from chest */}
                      {[...Array(8)].map((_, i) => {
                        const angle = (i / 8) * 360;
                        const rad = (angle * Math.PI) / 180;
                        const x2 = 150 + 55 * Math.cos(rad);
                        const y2 = 155 + 55 * Math.sin(rad);
                        return (
                          <motion.line key={i}
                            x1="150" y1="155" x2={x2} y2={y2}
                            stroke="#F8D080" strokeWidth="1"
                            initial={{ opacity: 0, scaleX: 0 }}
                            animate={{ opacity: [0, 0.7, 0.3], scaleX: 1 }}
                            transition={{ delay: 0.2 + i * 0.04, duration: 0.8 }}
                            style={{ transformOrigin: '150px 155px' }}
                          />
                        );
                      })}
                    </g>
                  )}

                  {/* Gradient defs */}
                  <defs>
                    <radialGradient id="heartGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#FFE566" stopOpacity="0.95" />
                      <stop offset="50%" stopColor="#F8A020" stopOpacity="0.7" />
                      <stop offset="100%" stopColor="#C4872A" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                </svg>

                {/* Caption */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={chestOpen ? { opacity: 0.8, y: 0 } : { opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="absolute font-serif tracking-widest text-xs uppercase text-center"
                  style={{ bottom: '12%', color: '#E8B566', letterSpacing: '0.28em' }}
                >
                  In his heart lives Rama & Sita
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ══════════════════════════════════════════════════════════════
              PHASE 2 — PHOTO FLIPBOOK
          ══════════════════════════════════════════════════════════════ */}
          <AnimatePresence>
            {phase === 'photos' && (
              <motion.div
                key="photos-scene"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
                style={{ zIndex: 10 }}
              >
                {/* Current photo */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={frameIndex}
                    initial={{ opacity: 0, scale: 1.07 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.38, ease: 'easeInOut' }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={PHOTO_FRAMES[frameIndex].src}
                      alt={PHOTO_FRAMES[frameIndex].label}
                      fill priority
                      className="object-cover"
                      style={{ filter: 'brightness(0.42) saturate(1.3)' }}
                    />
                    <div className="absolute inset-0" style={{
                      background: 'linear-gradient(to top, rgba(8,6,4,0.95) 0%, rgba(8,6,4,0.25) 55%, rgba(8,6,4,0.5) 100%)',
                    }} />
                  </motion.div>
                </AnimatePresence>
                {/* Caption */}
                <motion.p
                  key={`cap-${frameIndex}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 0.75, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute bottom-14 left-0 right-0 text-center font-serif text-xs uppercase tracking-widest"
                  style={{ color: '#C4872A', zIndex: 20 }}
                >
                  {PHOTO_FRAMES[frameIndex].label}
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ══════════════════════════════════════════════════════════════
              PHASE 3 — RAMAYANA TITLE
          ══════════════════════════════════════════════════════════════ */}
          <AnimatePresence>
            {phase === 'title' && (
              <motion.div
                key="title-scene"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex flex-col items-center justify-center"
                style={{ zIndex: 10 }}
              >
                {/* Dimmed last photo behind */}
                <Image
                  src={PHOTO_FRAMES[PHOTO_FRAMES.length - 1].src}
                  alt="" fill
                  className="object-cover"
                  style={{ filter: 'brightness(0.1) saturate(0.4)' }}
                />
                <div className="absolute inset-0" style={{
                  background: 'radial-gradient(ellipse at center, rgba(8,6,4,0.1) 0%, rgba(8,6,4,0.92) 70%)',
                }} />

                <motion.div
                  initial={{ scale: 1.15, filter: 'blur(6px)', opacity: 0 }}
                  animate={{ scale: 1, filter: 'blur(0px)', opacity: 1 }}
                  transition={{ duration: 1.0, ease: 'easeOut' }}
                  className="relative"
                  style={{ zIndex: 5 }}
                >
                  <svg
                    viewBox="0 0 1000 200"
                    style={{ width: 'min(860px, 88vw)', height: 'auto' }}
                  >
                    <defs>
                      <mask id="title-mask">
                        <rect width="1000" height="200" fill="black" />
                        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central"
                          fill="white"
                          style={{ fontSize: '120px', fontWeight: 900, letterSpacing: '0.15em', fontFamily: 'serif' }}
                        >RAMAYANA</text>
                      </mask>
                      <linearGradient id="gold-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%"   stopColor="#FDF6E3" />
                        <stop offset="30%"  stopColor="#ECC068" />
                        <stop offset="65%"  stopColor="#C4872A" />
                        <stop offset="100%" stopColor="#8C3D22" />
                      </linearGradient>
                      <linearGradient id="sweep-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%"   stopColor="rgba(255,255,255,0)" />
                        <stop offset="50%"  stopColor="rgba(255,255,255,0.5)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                      </linearGradient>
                      <filter id="glow-filter">
                        <feGaussianBlur stdDeviation="3.5" result="b" />
                        <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                      </filter>
                    </defs>
                    {/* Gold fill */}
                    <g mask="url(#title-mask)">
                      <rect width="1000" height="200" fill="url(#gold-grad)" />
                      {/* Shimmer sweep */}
                      <motion.rect
                        initial={{ x: -600 }} animate={{ x: 1400 }}
                        transition={{ duration: 1.4, ease: 'easeInOut', delay: 0.2 }}
                        y="0" width="600" height="200"
                        fill="url(#sweep-grad)"
                      />
                    </g>
                    {/* Glow border */}
                    <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central"
                      fill="none" stroke="#E8B566" strokeWidth="1.5"
                      filter="url(#glow-filter)"
                      style={{ fontSize: '120px', fontWeight: 900, letterSpacing: '0.15em', fontFamily: 'serif', opacity: 0.6 }}
                    >RAMAYANA</text>
                  </svg>

                  {/* Subtitle */}
                  <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 0.8, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.7 }}
                    className="text-center font-serif text-sm tracking-[0.35em] uppercase mt-4"
                    style={{ color: 'rgba(181,160,128,0.85)' }}
                  >
                    Digital Humanities Atlas
                  </motion.p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ══════════════════════════════════════════════════════════════
              PHASE 4 — BOW FIRES
          ══════════════════════════════════════════════════════════════ */}
          <AnimatePresence>
            {phase === 'bow' && (
              <motion.div
                key="bow-scene"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 flex items-center justify-center"
                style={{ zIndex: 10, backgroundColor: '#080604' }}
              >
                {/* Flash on fire */}
                {arrowFired && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.85, 0] }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                    style={{ backgroundColor: '#FFF8E0', zIndex: 20 }}
                  />
                )}

                {/* BOW SVG */}
                <svg
                  viewBox="0 0 500 400"
                  style={{ width: 'min(500px, 80vw)', height: 'auto', overflow: 'visible' }}
                >
                  <defs>
                    <linearGradient id="bow-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%"   stopColor="#8C3D22" />
                      <stop offset="50%"  stopColor="#E8B566" />
                      <stop offset="100%" stopColor="#8C3D22" />
                    </linearGradient>
                    <linearGradient id="arrow-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%"   stopColor="#C4872A" />
                      <stop offset="100%" stopColor="#FFF5DC" />
                    </linearGradient>
                    <filter id="bow-glow">
                      <feGaussianBlur stdDeviation="4" result="b" />
                      <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                    <filter id="arrow-glow">
                      <feGaussianBlur stdDeviation="3" result="b" />
                      <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                  </defs>

                  {/* Bow arc — appears with pathLength animation */}
                  <motion.path
                    d="M250 60 C 130 80, 80 160, 80 200 C 80 240, 130 320, 250 340"
                    stroke="url(#bow-grad)" strokeWidth="10" fill="none"
                    strokeLinecap="round" filter="url(#bow-glow)"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                  />
                  {/* Decorative bow grip center */}
                  <motion.ellipse
                    cx="82" cy="200" rx="12" ry="20"
                    fill="#C4872A" filter="url(#bow-glow)"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6, duration: 0.3 }}
                  />

                  {/* Bowstring */}
                  <motion.path
                    d={arrowDrawn
                      ? "M250 60 L 148 200 L 250 340"
                      : "M250 60 L 80 200 L 250 340"}
                    stroke="#E8D5A0" strokeWidth="2" fill="none"
                    strokeLinecap="round" opacity={0.85}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  />

                  {/* Arrow body */}
                  {!arrowFired && (
                    <motion.g
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.55, duration: 0.3 }}
                    >
                      {/* Arrow shaft */}
                      <motion.line
                        x1={arrowDrawn ? 148 : 80}
                        y1="200"
                        x2={arrowDrawn ? 340 : 260}
                        y2="200"
                        stroke="url(#arrow-grad)" strokeWidth="4"
                        strokeLinecap="round" filter="url(#arrow-glow)"
                        animate={{
                          x1: arrowDrawn ? 148 : 80,
                          x2: arrowDrawn ? 340 : 260,
                        }}
                        transition={{ duration: 0.35, ease: 'easeOut' }}
                      />
                      {/* Arrowhead */}
                      <motion.polygon
                        points={`${arrowDrawn ? 340 : 260},196 ${arrowDrawn ? 360 : 278},200 ${arrowDrawn ? 340 : 260},204`}
                        fill="#FFF5DC" filter="url(#arrow-glow)"
                        animate={{
                          points: arrowDrawn
                            ? '340,196 360,200 340,204'
                            : '260,196 278,200 260,204',
                        }}
                        transition={{ duration: 0.35 }}
                      />
                      {/* Fletching (tail feathers) */}
                      <motion.path
                        d={`M${arrowDrawn ? 148 : 80} 200 L${arrowDrawn ? 136 : 68} 193 M${arrowDrawn ? 148 : 80} 200 L${arrowDrawn ? 136 : 68} 207`}
                        stroke="#C4872A" strokeWidth="2.5" strokeLinecap="round"
                      />
                    </motion.g>
                  )}

                  {/* Arrow fired — shoots right */}
                  {arrowFired && (
                    <motion.g
                      initial={{ x: 0, opacity: 1 }}
                      animate={{ x: 800, opacity: 0 }}
                      transition={{ duration: 0.4, ease: 'easeIn' }}
                    >
                      <line x1="148" y1="200" x2="380" y2="200"
                        stroke="url(#arrow-grad)" strokeWidth="4" strokeLinecap="round" filter="url(#arrow-glow)" />
                      <polygon points="380,196 400,200 380,204" fill="#FFF5DC" filter="url(#arrow-glow)" />
                      {/* Motion trail */}
                      <line x1="100" y1="200" x2="148" y2="200"
                        stroke="#E8B566" strokeWidth="2" opacity="0.4" strokeLinecap="round" />
                    </motion.g>
                  )}

                  {/* Bow vibration on fire */}
                  {arrowFired && (
                    <motion.path
                      d="M250 60 L 80 200 L 250 340"
                      stroke="#E8D5A0" strokeWidth="2" fill="none" opacity={0.6}
                      animate={{ d: [
                        'M250 60 L 80 200 L 250 340',
                        'M250 60 L 86 200 L 250 340',
                        'M250 60 L 80 200 L 250 340',
                        'M250 60 L 84 200 L 250 340',
                        'M250 60 L 80 200 L 250 340',
                      ]}}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                  )}
                </svg>

                {/* "Enter the Atlas" text */}
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={arrowDrawn && !arrowFired ? { opacity: 0.7, y: 0 } : { opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute font-serif text-xs tracking-[0.4em] uppercase"
                  style={{ bottom: '12%', color: '#C4872A' }}
                >
                  The epic begins…
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
