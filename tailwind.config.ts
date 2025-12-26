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
        background: '#f9f6f1',
        foreground: '#1a1a1a',
        accent: '#8b4513',
        cream: '#f9f6f1',
        sand: '#e8e0d4',
        charcoal: '#2d2d2d',
        gray: {
          100: '#fafafa',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#999999',
          500: '#737373',
          600: '#666666',
          700: '#404040',
        }
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      fontSize: {
        'hero': ['clamp(3rem, 10vw, 7rem)', { lineHeight: '0.9', letterSpacing: '-0.02em' }],
        'title': ['clamp(2rem, 6vw, 4rem)', { lineHeight: '1', letterSpacing: '-0.02em' }],
        'subtitle': ['clamp(1.25rem, 3vw, 1.75rem)', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        'body-lg': ['1.25rem', { lineHeight: '1.7' }],
        'body': ['1.125rem', { lineHeight: '1.8' }],
        'meta': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.1em' }],
      },
      spacing: {
        'section': 'clamp(60px, 12vh, 120px)',
      },
      maxWidth: {
        'content': '720px',
        'wide': '1200px',
      }
    },
  },
  plugins: [],
}
export default config
