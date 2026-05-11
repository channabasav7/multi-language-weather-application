import { Droplets, Eye, Wind } from 'lucide-react';

import { getWeatherTheme } from '@/lib/gradients';
import type { WeatherSnapshot } from '@/lib/types';

interface WeatherCardProps {
  snapshot: WeatherSnapshot;
}

export function WeatherCard({ snapshot }: WeatherCardProps) {
  const theme = getWeatherTheme(snapshot.condition);

  return (
    <section
      className="glass-card-strong relative overflow-hidden rounded-[2rem] p-6 md:p-8"
      style={{
        backgroundImage: theme.background,
        boxShadow: `0 28px 110px ${theme.glow}`
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.24),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.12),transparent_28%)]" />
      <div className="relative grid gap-6 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
        <div className="space-y-4">
          <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-1 text-sm text-white/85 backdrop-blur">
            {snapshot.city}{snapshot.country ? `, ${snapshot.country}` : ''}
          </div>
          <div>
            <p className="font-display text-5xl font-bold tracking-tight text-white md:text-7xl">
              {snapshot.temperatureC}°
            </p>
            <p className="mt-2 max-w-xl text-lg text-white/85 md:text-xl">{snapshot.description}</p>
            <p className="mt-1 text-sm uppercase tracking-[0.28em] text-white/65">Updated {snapshot.updatedAtLabel}</p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          <Metric label="Feels like" value={`${snapshot.feelsLikeC}°`} icon={<Droplets className="h-4 w-4" />} />
          <Metric label="Humidity" value={`${snapshot.humidity}%`} icon={<Wind className="h-4 w-4" />} />
          <Metric label="Visibility" value={`${snapshot.visibilityKm} km`} icon={<Eye className="h-4 w-4" />} />
        </div>
      </div>
    </section>
  );
}

function Metric({
  label,
  value,
  icon
}: Readonly<{
  label: string;
  value: string;
  icon: React.ReactNode;
}>) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white backdrop-blur-sm">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-white/60">
        {icon}
        <span>{label}</span>
      </div>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}