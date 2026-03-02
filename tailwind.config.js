/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0F19', // Deep navy
        surface: '#1A2133', // Slightly lighter navy
        border: '#2A344A', // Subtle border
        primary: '#6366F1', // Indigo
        cyan: {
          DEFAULT: '#06B6D4',
        },
        amber: {
          DEFAULT: '#F59E0B',
        },
        red: {
          DEFAULT: '#F43F5E', // Rose-ish red
        },
        green: {
          DEFAULT: '#10B981', // Emerald
        },
        purple: {
          DEFAULT: '#8B5CF6',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        'premium': '0 4px 20px -2px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        'premium-hover': '0 8px 30px -4px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'glow-primary': '0 0 20px rgba(99, 102, 241, 0.15)',
      },
    },
  },
  plugins: [],
}
