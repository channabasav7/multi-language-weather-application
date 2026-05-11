import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        surface: 'var(--surface)',
        surfaceStrong: 'var(--surface-strong)',
        text: 'var(--text)',
        muted: 'var(--muted)',
        accent: 'var(--accent)'
      },
      boxShadow: {
        glow: '0 24px 90px rgba(0, 0, 0, 0.35)'
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)']
      },
      backgroundImage: {
        'weather-fog': 'linear-gradient(135deg, rgba(9, 14, 26, 0.82), rgba(77, 98, 122, 0.42))'
      }
    }
  },
  plugins: []
};

export default config;