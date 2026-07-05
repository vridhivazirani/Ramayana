'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Selected Sanskrit verses from the Valmiki Ramayana
const SANSKRIT_VERSES = [
  'रामाय रामभद्राय रामचन्द्राय वेधसे । रघुनाथाय नाथाय सीतायाः पतये नमः ॥',
  'धर्मो रक्षति रक्षितः ।',
  'जननी जन्मभूमिश्च स्वर्गादपि गरीयसी ॥',
  'कूजन्तं राम रामेति मधुरं मधुराक्षरम् । आरुह्य कविताशाखां वन्दे वाल्मीकिकोकिलम् ॥',
  'सत्यमेवेश्वरो लोके सत्यं पद्मा समाश्रिता । सत्यमूलानि सर्वाणि सत्यान्नास्ति परं पदम् ॥',
  'न भीतो मरणादस्मि केवलं दूषितं यशः ।',
];

interface SplashIntroProps {
  onComplete: () => void;
  forcePlay?: boolean;
}

export default function SplashIntro({ onComplete, forcePlay = false }: SplashIntroProps) {
  const [frameIndex, setFrameIndex] = useState(0);
  const [phase, setPhase] = useState<'flipping' | 'reveal' | 'fadeout'>('flipping');

  // Check session storage to skip intro in production (always play in development for debugging)
  useEffect(() => {
    if (!forcePlay && process.env.NODE_ENV === 'production') {
      const hasPlayed = sessionStorage.getItem('ramayana_intro_played');
      if (hasPlayed === 'true') {
        onComplete();
      }
    }
  }, [onComplete, forcePlay]);

  // Flipbook Frame Interval (runs every 65ms)
  useEffect(() => {
    if (phase !== 'flipping') return;

    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % 18); // 18 frames in total cycle
    }, 65);

    // After 2.2 seconds, transition to the golden reveal phase
    const timer = setTimeout(() => {
      setPhase('reveal');
      clearInterval(interval);
    }, 2200);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [phase]);

  // Handle the end of the reveal phase (fade out splash screen)
  useEffect(() => {
    if (phase !== 'reveal') return;

    const timer = setTimeout(() => {
      setPhase('fadeout');
    }, 1400); // Golden shine display duration

    return () => clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase === 'fadeout') {
      const timer = setTimeout(() => {
        sessionStorage.setItem('ramayana_intro_played', 'true');
        onComplete();
      }, 500); // Fade animation duration

      return () => clearTimeout(timer);
    }
  }, [phase, onComplete]);

  const handleSkip = () => {
    sessionStorage.setItem('ramayana_intro_played', 'true');
    onComplete();
  };

  // Render the background image/silhouette/text for the current flipbook frame
  const renderFrameContent = (index: number) => {
    const verseIndex = index % SANSKRIT_VERSES.length;
    const isTextFrame = index % 3 === 0;

    if (isTextFrame) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-stone-900 border border-ochre/25">
          <p className="text-ochre-light font-serif text-lg md:text-xl font-bold leading-relaxed max-w-xl px-4 select-none filter drop-shadow-md">
            {SANSKRIT_VERSES[verseIndex]}
          </p>
        </div>
      );
    }

    // SVG graphics representing different elements of the epic
    switch (index % 6) {
      case 1: // Bow & Arrow
        return (
          <div className="w-full h-full flex items-center justify-center bg-stone-950">
            <svg className="w-1/3 h-1/3 text-ochre/40" viewBox="0 0 100 100" fill="currentColor">
              <path d="M50 10 C 25 35, 25 65, 50 90 M 50 10 L 50 90 M 15 50 L 85 50 M 80 47 L 85 50 L 80 53" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </svg>
          </div>
        );
      case 2: // Temple/Fortress Silhouette
        return (
          <div className="w-full h-full flex items-center justify-center bg-stone-900">
            <svg className="w-1/3 h-1/3 text-terracotta/40" viewBox="0 0 100 100" fill="currentColor">
              <path d="M10 90 L90 90 L90 70 L80 70 L80 50 L50 20 L20 50 L20 70 L10 70 Z M50 20 L50 10 M47 10 L53 10" stroke="currentColor" strokeWidth="2" fill="none" />
              <circle cx="50" cy="50" r="6" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
          </div>
        );
      case 3: // Hanuman carrying Dronagiri Mountain
        return (
          <div className="w-full h-full flex items-center justify-center bg-stone-950">
            <svg className="w-1/3 h-1/3 text-sage/40" viewBox="0 0 100 100" fill="currentColor">
              <path d="M20 75 C 30 75, 35 60, 40 50 C 45 40, 50 30, 65 35 C 75 40, 80 55, 75 75 Z M 55 35 L 75 15 L 85 25 Z" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M65 35 L 70 30 L 75 35" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </div>
        );
      case 4: // Rama's Chariot Wheel
        return (
          <div className="w-full h-full flex items-center justify-center bg-stone-900">
            <svg className="w-1/3 h-1/3 text-ochre/30 animate-spin" style={{ animationDuration: '8s' }} viewBox="0 0 100 100" fill="currentColor">
              <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="3" fill="none" />
              <circle cx="50" cy="50" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
              {Array.from({ length: 8 }).map((_, i) => {
                const angle = (i * Math.PI) / 4;
                const x2 = 50 + 40 * Math.cos(angle);
                const y2 = 50 + 40 * Math.sin(angle);
                return <line key={i} x1="50" y1="50" x2={x2} y2={y2} stroke="currentColor" strokeWidth="2" />;
              })}
            </svg>
          </div>
        );
      case 5: // Rama's footprints / Lotus
        return (
          <div className="w-full h-full flex items-center justify-center bg-stone-950">
            <svg className="w-1/3 h-1/3 text-terracotta/30" viewBox="0 0 100 100" fill="currentColor">
              <path d="M50 15 C45 35 30 45 50 85 C70 45 55 35 50 15 Z" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M50 35 C35 45 25 60 50 85 C75 60 65 45 50 35 Z" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <path d="M50 55 C40 60 35 70 50 85 C65 70 60 60 50 55 Z" stroke="currentColor" strokeWidth="1" fill="none" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {phase !== 'fadeout' && (
        <motion.div
          id="splash-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-stone-950 select-none overflow-hidden"
        >
          {/* Cinematic Scanning Lines background */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,15,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[size:100%_4px,6px_100%] pointer-events-none opacity-40" />

          {/* Vignette Shadow Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(12,10,9,0.9)_100%)] pointer-events-none" />

          {/* Golden Flash Border */}
          <motion.div
            initial={{ opacity: 0.2 }}
            animate={phase === 'reveal' ? { 
              opacity: [0.2, 0.9, 0.2], 
              borderColor: ['rgba(196,135,42,0.15)', 'rgba(196,135,42,0.65)', 'rgba(196,135,42,0.15)']
            } : {}}
            transition={{ duration: 1.4 }}
            className="absolute inset-4 border border-ochre/20 rounded-md pointer-events-none"
          />

          {/* Skip Button */}
          <button
            onClick={handleSkip}
            className="absolute top-8 right-8 z-50 border border-stone-800 hover:border-ochre/50 rounded-full px-4 py-1.5 text-xs text-stone hover:text-ochre-light transition-all duration-300 bg-stone-950/80 hover:bg-stone-900 backdrop-blur-sm"
          >
            Skip Intro
          </button>

          {/* Main Title Container */}
          <div className="relative w-full max-w-4xl px-4 flex flex-col items-center justify-center">
            {/* The Cinematic Zooming Logo */}
            <motion.div
              initial={{ scale: 1.12, filter: 'blur(3px)' }}
              animate={phase === 'reveal' 
                ? { scale: 1, filter: 'blur(0px)' } 
                : { scale: 1.04, filter: 'blur(0px)' }
              }
              transition={phase === 'reveal' 
                ? { duration: 1.4, ease: 'easeOut' }
                : { duration: 2.2, ease: 'linear' }
              }
              className="w-full flex items-center justify-center"
            >
              {/* SVG mask architecture ensures 100% browser compatibility (including Safari) */}
              <svg className="w-full h-32 sm:h-44 md:h-56 filter drop-shadow-[0_0_20px_rgba(44,24,16,0.6)]" viewBox="0 0 1000 220">
                <defs>
                  {/* Text mask: Only white content displays */}
                  <mask id="ramayana-text-mask" x="0" y="0" width="1000" height="220">
                    <rect x="0" y="0" width="1000" height="220" fill="black" />
                    <text
                      x="50%"
                      y="50%"
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="white"
                      className="font-sans"
                      style={{
                        fontSize: '115px',
                        fontWeight: 900,
                        letterSpacing: '0.16em',
                        textTransform: 'uppercase',
                      }}
                    >
                      Ramayana
                    </text>
                  </mask>

                  {/* Golden color gradient for the final reveal */}
                  <linearGradient id="gold-shimmer" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#F8F5EE" />
                    <stop offset="35%" stopColor="#E8B566" />
                    <stop offset="70%" stopColor="#C4872A" />
                    <stop offset="100%" stopColor="#8C3D22" />
                  </linearGradient>

                  {/* Golden border glow filter */}
                  <filter id="gold-glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>

                  {/* Shimmer light sweep */}
                  <linearGradient id="shimmer-sweep" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                    <stop offset="50%" stopColor="rgba(255,255,255,0.4)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                  </linearGradient>
                </defs>

                {/* Layer 1: The masked content group */}
                <g mask="url(#ramayana-text-mask)">
                  {/* Default back plate */}
                  <rect x="0" y="0" width="1000" height="220" fill="#1c1917" />

                  {/* Flipping canvas inside text mask */}
                  {phase === 'flipping' && (
                    <foreignObject x="0" y="0" width="1000" height="220">
                      <div className="w-full h-full relative overflow-hidden bg-stone-950 scale-105">
                        {renderFrameContent(frameIndex)}
                      </div>
                    </foreignObject>
                  )}

                  {/* Golden plate reveal */}
                  {phase !== 'flipping' && (
                    <rect x="0" y="0" width="1000" height="220" fill="url(#gold-shimmer)" />
                  )}
                </g>

                {/* Layer 2: Shimmer overlay sweep on reveal */}
                {phase === 'reveal' && (
                  <g mask="url(#ramayana-text-mask)">
                    <motion.rect
                      initial={{ x: -1000 }}
                      animate={{ x: 1000 }}
                      transition={{ duration: 1.4, ease: 'easeInOut' }}
                      x="0"
                      y="0"
                      width="1000"
                      height="220"
                      fill="url(#shimmer-sweep)"
                      className="mix-blend-overlay"
                    />
                  </g>
                )}

                {/* Layer 3: Subtle vector border glow when golden reveal occurs */}
                {phase !== 'flipping' && (
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="none"
                    stroke="#E8B566"
                    strokeWidth="1.5"
                    filter="url(#gold-glow)"
                    className="font-sans pointer-events-none"
                    style={{
                      fontSize: '115px',
                      fontWeight: 900,
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      opacity: 0.7,
                    }}
                  >
                    Ramayana
                  </text>
                )}
              </svg>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={phase === 'reveal' ? { opacity: 0.8, y: 0 } : { opacity: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mt-6 text-stone-light font-serif text-sm sm:text-base tracking-[0.32em] uppercase text-center filter drop-shadow-md"
            >
              Digital Humanities Atlas
            </motion.p>
          </div>

          {/* Ambient golden dust particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {phase === 'reveal' && (
              <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(196,135,42,0.06)_1px,_transparent_1px)] bg-[size:20px_20px] opacity-40 animate-pulse" />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

