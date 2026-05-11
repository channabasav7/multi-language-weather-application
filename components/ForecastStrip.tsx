import { Cloud, CloudDrizzle, CloudRain, CloudSun, Sun } from 'lucide-react';

import type { DailyForecastItem, HourlyForecastItem } from '@/lib/types';

interface ForecastStripProps {
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
}

export function ForecastStrip({ hourly, daily }: ForecastStripProps) {
  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <Panel title="Hourly forecast">
        <div className="flex gap-3 overflow-x-auto pb-1">
          {hourly.map((item) => (
            <ForecastChip
              key={`${item.time}-${item.tempC}`}
              label={item.time}
              value={`${item.tempC}°`}
              detail={`${item.precipitation}% rain`}
              condition={item.condition}
            />
          ))}
        </div>
      </Panel>
      <Panel title="5-day outlook">
        <div className="space-y-3">
          {daily.map((item) => (
            <div key={`${item.day}-${item.highC}`} className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/6 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-white">{item.day}</p>
                <p className="text-xs text-slate-300">{item.precipitation}% rain chance</p>
              </div>
              <div className="text-right">
                <p className="text-base font-semibold text-white">
                  {item.highC}° <span className="text-slate-300">/ {item.lowC}°</span>
                </p>
                <p className="text-xs text-slate-300 capitalize">{item.condition}</p>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </section>
  );
}

function Panel({ title, children }: Readonly<{ title: string; children: React.ReactNode }>) {
  return (
    <div className="glass-card rounded-[1.75rem] p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-white">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function ForecastChip({
  label,
  value,
  detail,
  condition
}: Readonly<{
  label: string;
  value: string;
  detail: string;
  condition: DailyForecastItem['condition'];
}>) {
  const Icon =
    condition === 'clear' ? Sun : condition === 'rain' ? CloudRain : condition === 'drizzle' ? CloudDrizzle : condition === 'clouds' ? Cloud : CloudSun;

  return (
    <div className="min-w-28 rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-center text-white">
      <Icon className="mx-auto mb-2 h-5 w-5 text-cyan-200" />
      <p className="text-xs text-slate-300">{label}</p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
      <p className="text-[11px] text-slate-300">{detail}</p>
    </div>
  );
}