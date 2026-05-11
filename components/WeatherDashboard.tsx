"use client";

import { useState, useTransition } from 'react';
import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ChatWidget } from '@/components/ChatWidget';
import { ForecastStrip } from '@/components/ForecastStrip';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { WeatherCard } from '@/components/WeatherCard';
import { getWeatherTheme } from '@/lib/gradients';
import type { LocaleCode, WeatherSnapshot } from '@/lib/types';

interface WeatherDashboardProps {
  initialSnapshot: WeatherSnapshot;
  locale: LocaleCode;
}

export function WeatherDashboard({ initialSnapshot, locale }: WeatherDashboardProps) {
  const t = useTranslations('App');
  const [snapshot, setSnapshot] = useState(initialSnapshot);
  const [city, setCity] = useState(initialSnapshot.city);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const theme = getWeatherTheme(snapshot.condition);

  const searchWeather = () => {
    const query = city.trim();

    if (!query) {
      return;
    }

    setError(null);

    startTransition(async () => {
      try {
        const response = await fetch(`/api/weather?city=${encodeURIComponent(query)}&locale=${locale}`, {
          cache: 'no-store'
        });

        const data = (await response.json()) as { snapshot?: WeatherSnapshot; error?: string };

        if (!response.ok || !data.snapshot) {
          throw new Error(data.error || 'Unable to load weather data.');
        }

        setSnapshot(data.snapshot);
      } catch (weatherError) {
        setError(weatherError instanceof Error ? weatherError.message : 'Unable to load weather data.');
      }
    });
  };

  return (
    <main className="weather-shell min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <div
        className="absolute inset-0 -z-10 transition-[background-image] duration-700 ease-out"
        style={{ backgroundImage: theme.background }}
      />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_22%)]" />

      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="fade-up flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm text-white/80 backdrop-blur">
              {t('brand')}
            </div>
            <div>
              <h1 className="font-display text-4xl font-semibold tracking-tight text-white md:text-6xl">{t('heroTitle')}</h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-200 md:text-lg">{t('heroSubtitle')}</p>
            </div>
          </div>

          <LanguageSwitcher locale={locale} />
        </header>

        <section className="float-in grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.85fr)]">
          <div className="space-y-6">
            <div className="glass-card rounded-[2rem] p-4 md:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <label className="sr-only" htmlFor="city-search">
                  {t('searchLabel')}
                </label>
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="city-search"
                    value={city}
                    onChange={(event) => setCity(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        searchWeather();
                      }
                    }}
                    placeholder={t('searchPlaceholder')}
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/35 py-3 pl-11 pr-4 text-white outline-none placeholder:text-slate-400 focus:border-cyan-300/60"
                  />
                </div>
                <button
                  type="button"
                  onClick={searchWeather}
                  disabled={isPending}
                  className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isPending ? '...' : t('searchButton')}
                </button>
              </div>
              {error ? <p className="mt-3 text-sm text-rose-200">{error}</p> : null}
            </div>

            <WeatherCard snapshot={snapshot} />

            <ForecastStrip hourly={snapshot.hourly} daily={snapshot.daily} />
          </div>

          <ChatWidget snapshot={snapshot} locale={locale} />
        </section>
      </div>
    </main>
  );
}