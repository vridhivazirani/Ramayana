import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ochre: {
          DEFAULT: '#C4872A',
          light: '#E8B566',
          dark: '#9B6820',
        },
        terracotta: {
          DEFAULT: '#B85C38',
          light: '#D4795A',
          dark: '#8C3D22',
        },
        sage: {
          DEFAULT: '#5C7A4E',
          light: '#7D9E6E',
          dark: '#3E5434',
        },
        parchment: {
          DEFAULT: '#F5EDD6',
          dark: '#EDE0C0',
        },
        ink: {
          DEFAULT: '#2C1810',
          light: '#4A2E20',
        },
        stone: {
          DEFAULT: '#8B7355',
          light: '#B5A080',
          lighter: '#D4C5A9',
        },
        mist: '#F9F5EE',
        charcoal: '#3D3028',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      boxShadow: {
        'panel': '0 8px 40px rgba(44, 24, 16, 0.18), 0 2px 8px rgba(44, 24, 16, 0.08)',
        'card': '0 2px 12px rgba(44, 24, 16, 0.08)',
        'card-hover': '0 8px 24px rgba(196, 135, 42, 0.15)',
      },
    },
  },
  plugins: [],
}
export default config
