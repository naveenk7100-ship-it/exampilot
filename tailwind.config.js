/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        exam: {
          bg: '#090d16',
          card: '#0f172a',
          surface: '#1e293b',
          border: '#334155',
          primary: '#3b82f6',
          accent: '#14b8a6',
          warning: '#f59e0b',
          danger: '#ef4444',
          success: '#10b981',
          muted: '#94a3b8'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Consolas', 'monospace'],
      }
    },
  },
  plugins: [],
}
