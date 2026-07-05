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

  // Check if already played in session to skip automatically
  useEffect(() => {
    if (!forcePlay) {
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
    }, 1200); // Golden shine display duration

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
        <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-stone-900 border border-ochre/20">
          <p className="text-ochre-light font-serif text-lg md:text-2xl font-bold leading-relaxed mb-4 max-w-lg filter drop-shadow">
            {SANSKRIT_VERSES[verseIndex]}
          </p>
          <div className="w-12 h-[1px] bg-ochre/30" />
        </div>
      );
    }

    // SVG graphics representing different elements of the epic
    switch (index % 6) {
      case 1: // Bow & Arrow
        return (
          <div className="w-full h-full flex items-center justify-center bg-stone-950">
            <svg className="w-1/2 h-1/2 text-ochre/40" viewBox="0 0 100 100" fill="currentColor">
              <path d="M50 10 C 25 35, 25 65, 50 90 M 50 10 L 50 90 M 15 50 L 85 50 M 80 47 L 85 50 L 80 53" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </svg>
          </div>
        );
      case 2: // Temple/Fortress Silhouette
        return (
          <div className="w-full h-full flex items-center justify-center bg-stone-900">
            <svg className="w-1/2 h-1/2 text-terracotta/40" viewBox="0 0 100 100" fill="currentColor">
              <path d="M10 90 L90 90 L90 70 L80 70 L80 50 L50 20 L20 50 L20 70 L10 70 Z M50 20 L50 10 M47 10 L53 10" stroke="currentColor" strokeWidth="2" fill="none" />
              <circle cx="50" cy="50" r="6" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
          </div>
        );
      case 3: // Hanuman carrying Dronagiri Mountain
        return (
          <div className="w-full h-full flex items-center justify-center bg-stone-950">
            <svg className="w-1/2 h-1/2 text-sage/40" viewBox="0 0 100 100" fill="currentColor">
              <path d="M20 75 C 30 75, 35 60, 40 50 C 45 40, 50 30, 65 35 C 75 40, 80 55, 75 75 Z M 55 35 L 75 15 L 85 25 Z" stroke="currentColor" strokeWidth="2" fill="none" />
              <path d="M65 35 L 70 30 L 75 35" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
          </div>
        );
      case 4: // Rama's Chariot Wheel
        return (
          <div className="w-full h-full flex items-center justify-center bg-stone-900">
            <svg className="w-1/2 h-1/2 text-ochre/30 animate-spin" style={{ animationDuration: '6s' }} viewBox="0 0 100 100" fill="currentColor">
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
            <svg className="w-1/2 h-1/2 text-terracotta/30" viewBox="0 0 100 100" fill="currentColor">
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
          {/* Subtle cinematic scanning lines background */}
          <div className="absolute inset-0 bg-scanlines opacity-5 pointer-events-none" />

          {/* Vignette shadow overlay */}
          <div className="absolute inset-0 bg-radial-vignette pointer-events-none" />

          {/* Red/Gold frame flash border */}
          <motion.div
            initial={{ opacity: 0.3 }}
            animate={phase === 'reveal' ? { 
              opacity: [0.3, 1, 0.3], 
              borderColor: ['rgba(196,135,42,0.2)', 'rgba(184,92,56,0.8)', 'rgba(196,135,42,0.2)']
            } : {}}
            transition={{ duration: 1.2 }}
            className="absolute inset-4 border border-ochre/20 rounded-md pointer-events-none"
          />

          {/* Skip Intro button */}
          <button
            onClick={handleSkip}
            className="absolute top-8 right-8 z-50 border border-stone-800 hover:border-ochre/50 rounded-full px-4 py-1.5 text-xs text-stone hover:text-ochre-light transition-all duration-300 bg-stone-950/80 hover:bg-stone-900 backdrop-blur-sm"
          >
            Skip Intro
          </button>

          {/* Main Title Container */}
          <div className="relative flex flex-col items-center justify-center w-full max-w-5xl px-4">
            {/* The Cinematic Zooming Logo */}
            <motion.div
              initial={{ scale: 1.15, filter: 'blur(2px)' }}
              animate={phase === 'reveal' 
                ? { scale: 1, filter: 'blur(0px)' } 
                : { scale: 1.05, filter: 'blur(0px)' }
              }
              transition={phase === 'reveal' 
                ? { duration: 1.2, ease: 'easeOut' }
                : { duration: 2.2, ease: 'linear' }
              }
              className="relative w-full text-center"
            >
              {/* Masked Flipbook Title */}
              <h1
                className={`
                  font-sans font-black text-6xl sm:text-8xl md:text-9xl 
                  tracking-[0.18em] uppercase select-none transition-all duration-500
                  ${phase === 'reveal' 
                    ? 'text-transparent bg-clip-text bg-gradient-to-b from-[#F5EDD6] via-[#C4872A] to-[#8C3D22] drop-shadow-[0_0_35px_rgba(196,135,42,0.45)]' 
                    : 'text-transparent bg-clip-text bg-stone-800'
                  }
                `}
                style={{
                  backgroundImage: phase === 'flipping' ? 'none' : undefined,
                  WebkitTextStroke: phase === 'flipping' ? '1px rgba(196,135,42,0.45)' : 'none',
                }}
              >
                Ramayana
              </h1>

              {/* Clip mask content for the flipbook frames */}
              {phase === 'flipping' && (
                <div
                  className="absolute inset-0 flex items-center justify-center mx-auto pointer-events-none mix-blend-screen"
                  style={{
                    clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                    WebkitClipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                  }}
                >
                  {/* Outer container mirroring size, using text as mask */}
                  <h1
                    className="font-sans font-black text-6xl sm:text-8xl md:text-9xl tracking-[0.18em] uppercase text-transparent bg-clip-text select-none w-full"
                    style={{
                      WebkitBackgroundClip: 'text',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    {/* Flipping canvas renders behind the text mask using absolute positioning */}
                    <div className="absolute inset-0 w-full h-full z-0 opacity-80 scale-110">
                      {renderFrameContent(frameIndex)}
                    </div>
                    Ramayana
                  </h1>
                </div>
              )}

              {/* Shimmer golden light sweep effect during reveal */}
              {phase === 'reveal' && (
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 1.2, ease: 'easeInOut' }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 pointer-events-none mix-blend-overlay"
                />
              )}
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={phase === 'reveal' ? { opacity: 0.8, y: 0 } : { opacity: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="mt-6 text-stone-light font-serif text-sm sm:text-base tracking-[0.3em] uppercase text-center filter drop-shadow"
            >
              Digital Humanities Atlas
            </motion.p>
          </div>

          {/* Epic ambient dust particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {phase === 'reveal' && (
              <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(196,135,42,0.06)_1px,_transparent_1px)] bg-[size:24px_24px] opacity-40 animate-pulse" />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
