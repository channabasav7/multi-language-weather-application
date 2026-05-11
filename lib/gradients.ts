import type { WeatherCondition } from '@/lib/types';

type ThemeToken = {
  background: string;
  accent: string;
  glow: string;
};

const themes: Record<WeatherCondition, ThemeToken> = {
  clear: {
    background: 'linear-gradient(135deg, #0f172a 0%, #1d4ed8 42%, #38bdf8 100%)',
    accent: '#93c5fd',
    glow: 'rgba(56, 189, 248, 0.55)'
  },
  clouds: {
    background: 'linear-gradient(135deg, #111827 0%, #334155 45%, #94a3b8 100%)',
    accent: '#cbd5e1',
    glow: 'rgba(148, 163, 184, 0.45)'
  },
  rain: {
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 42%, #2563eb 100%)',
    accent: '#bfdbfe',
    glow: 'rgba(59, 130, 246, 0.52)'
  },
  drizzle: {
    background: 'linear-gradient(135deg, #111827 0%, #1f2937 44%, #4b5563 100%)',
    accent: '#d1d5db',
    glow: 'rgba(148, 163, 184, 0.42)'
  },
  thunderstorm: {
    background: 'linear-gradient(135deg, #030712 0%, #312e81 48%, #7c3aed 100%)',
    accent: '#ddd6fe',
    glow: 'rgba(139, 92, 246, 0.6)'
  },
  snow: {
    background: 'linear-gradient(135deg, #e0f2fe 0%, #93c5fd 42%, #ffffff 100%)',
    accent: '#1e3a8a',
    glow: 'rgba(255, 255, 255, 0.5)'
  },
  mist: {
    background: 'linear-gradient(135deg, #0f172a 0%, #475569 48%, #cbd5e1 100%)',
    accent: '#e2e8f0',
    glow: 'rgba(226, 232, 240, 0.35)'
  },
  haze: {
    background: 'linear-gradient(135deg, #111827 0%, #374151 40%, #f59e0b 100%)',
    accent: '#fde68a',
    glow: 'rgba(245, 158, 11, 0.32)'
  },
  fog: {
    background: 'linear-gradient(135deg, #111827 0%, #334155 44%, #94a3b8 100%)',
    accent: '#f8fafc',
    glow: 'rgba(226, 232, 240, 0.34)'
  },
  smoke: {
    background: 'linear-gradient(135deg, #09090b 0%, #3f3f46 52%, #a1a1aa 100%)',
    accent: '#fafafa',
    glow: 'rgba(161, 161, 170, 0.3)'
  },
  dust: {
    background: 'linear-gradient(135deg, #2b1609 0%, #92400e 45%, #f59e0b 100%)',
    accent: '#fde68a',
    glow: 'rgba(245, 158, 11, 0.34)'
  },
  default: {
    background: 'linear-gradient(135deg, #111827 0%, #1f2937 50%, #475569 100%)',
    accent: '#e2e8f0',
    glow: 'rgba(148, 163, 184, 0.35)'
  }
};

export function getWeatherTheme(condition: WeatherCondition): ThemeToken {
  return themes[condition] ?? themes.default;
}