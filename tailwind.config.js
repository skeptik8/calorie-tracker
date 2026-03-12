/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['Space Grotesk', 'monospace'],
      },
      colors: {
        neon: {
          DEFAULT: '#39FF14',
          dim: '#2ECC10',
          bright: '#57FF33',
          glow: 'rgba(57, 255, 20, 0.15)',
          'glow-md': 'rgba(57, 255, 20, 0.3)',
          'glow-lg': 'rgba(57, 255, 20, 0.5)',
        },
        dark: {
          bg: '#050505',
          900: '#0A0A0A',
          800: '#111111',
          700: '#181818',
          600: '#1F1F1F',
          500: '#2A2A2A',
          400: '#333333',
          300: '#444444',
          200: '#666666',
          100: '#888888',
        },
        accent: {
          blue: '#00D4FF',
          purple: '#BD00FF',
          orange: '#FF6B00',
          red: '#FF2D55',
          yellow: '#FFD60A',
        }
      },
      boxShadow: {
        'neon': '0 0 20px rgba(57, 255, 20, 0.4), 0 0 60px rgba(57, 255, 20, 0.1)',
        'neon-sm': '0 0 10px rgba(57, 255, 20, 0.3)',
        'neon-lg': '0 0 40px rgba(57, 255, 20, 0.6), 0 0 100px rgba(57, 255, 20, 0.2)',
        'neon-inner': 'inset 0 0 20px rgba(57, 255, 20, 0.1)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.6)',
        'card-hover': '0 8px 40px rgba(0, 0, 0, 0.8)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.4)',
      },
      animation: {
        'neon-pulse': 'neonPulse 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'scan': 'scan 4s linear infinite',
        'glow-text': 'glowText 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in': 'slideIn 0.4s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
      },
      keyframes: {
        neonPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(57, 255, 20, 0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(57, 255, 20, 0.8), 0 0 80px rgba(57, 255, 20, 0.3)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        scan: {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '0% 100%' },
        },
        glowText: {
          'from': { textShadow: '0 0 10px rgba(57, 255, 20, 0.5)' },
          'to': { textShadow: '0 0 20px rgba(57, 255, 20, 1), 0 0 40px rgba(57, 255, 20, 0.5)' },
        },
        slideUp: {
          'from': { opacity: 0, transform: 'translateY(20px)' },
          'to': { opacity: 1, transform: 'translateY(0)' },
        },
        slideIn: {
          'from': { opacity: 0, transform: 'translateX(-20px)' },
          'to': { opacity: 1, transform: 'translateX(0)' },
        },
        fadeIn: {
          'from': { opacity: 0 },
          'to': { opacity: 1 },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
