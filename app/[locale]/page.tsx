import { notFound } from 'next/navigation';

import { WeatherDashboard } from '@/components/WeatherDashboard';
import { isLocale } from '@/lib/i18n';
import { fetchWeatherSnapshot } from '@/lib/weather';

export default async function LocalePage({
  params
}: Readonly<{
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const initialSnapshot = await fetchWeatherSnapshot('Bengaluru', locale);

  return <WeatherDashboard initialSnapshot={initialSnapshot} locale={locale} />;
}