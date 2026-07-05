'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { href: '/', label: 'Map', icon: '🗺' },
  { href: '/timeline', label: 'Timeline', icon: '⏳' },
  { href: '/about', label: 'About', icon: '📜' },
  { href: '/references', label: 'References', icon: '📚' },
];

export default function Nav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      id="main-nav"
      className="fixed top-0 left-0 right-0 z-[1000] bg-ink/95 backdrop-blur-sm border-b border-ochre/30"
      style={{ backdropFilter: 'blur(8px)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-sm bg-ochre flex items-center justify-center text-xs font-bold text-ink">
              रा
            </div>
            <span className="font-serif text-parchment font-semibold text-base tracking-wide leading-tight group-hover:text-ochre-light transition-colors">
              Digital Atlas<br />
              <span className="text-ochre text-[10px] font-sans font-normal tracking-widest uppercase">
                of the Ramayana
              </span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  id={`nav-${link.label.toLowerCase()}`}
                  className={`
                    flex items-center gap-1.5 px-4 py-2 rounded-sm text-sm font-medium transition-all duration-200
                    ${isActive
                      ? 'bg-ochre/20 text-ochre-light border border-ochre/30'
                      : 'text-stone-light hover:text-parchment hover:bg-white/5'
                    }
                  `}
                >
                  <span className="text-base leading-none">{link.icon}</span>
                  {link.label}
                </Link>
              );
            })}

            {/* Replay Intro Button */}
            <button
              onClick={() => window.dispatchEvent(new Event('replay-ramayana-intro'))}
              className="flex items-center gap-1.5 px-3 py-2 rounded-sm text-sm font-medium text-stone-light hover:text-ochre-light hover:bg-white/5 transition-all duration-200 ml-1"
              title="Replay Cinematic Intro"
            >
              <span className="text-base leading-none">🎬</span>
              <span className="hidden lg:inline">Replay Intro</span>
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            id="mobile-menu-toggle"
            className="md:hidden flex flex-col gap-1.5 p-2 text-stone-light hover:text-parchment"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-0.5 bg-current transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-0.5 bg-current transition-all ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-current transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t border-ochre/20"
          >
            <div className="px-4 py-3 flex flex-col gap-1 bg-ink">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    id={`mobile-nav-${link.label.toLowerCase()}`}
                    onClick={() => setMenuOpen(false)}
                    className={`
                      flex items-center gap-2 px-3 py-2.5 rounded text-sm font-medium transition-colors
                      ${isActive
                        ? 'bg-ochre/20 text-ochre-light'
                        : 'text-stone-light hover:text-parchment hover:bg-white/5'
                      }
                    `}
                  >
                    <span>{link.icon}</span>
                    {link.label}
                  </Link>
                );
              })}

              {/* Mobile Replay Intro Button */}
              <button
                onClick={() => {
                  setMenuOpen(false);
                  window.dispatchEvent(new Event('replay-ramayana-intro'));
                }}
                className="flex items-center gap-2 px-3 py-2.5 rounded text-sm font-medium text-stone-light hover:text-ochre-light hover:bg-white/5 transition-colors text-left"
              >
                <span>🎬</span>
                <span>Replay Intro</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
