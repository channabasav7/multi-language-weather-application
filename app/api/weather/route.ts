import { NextRequest, NextResponse } from 'next/server';

import { isLocale } from '@/lib/i18n';
import { fetchWeatherSnapshot } from '@/lib/weather';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const city = request.nextUrl.searchParams.get('city') || 'Bengaluru';
  const localeParam = request.nextUrl.searchParams.get('locale') || 'en';
  const locale = isLocale(localeParam) ? localeParam : 'en';

  const snapshot = await fetchWeatherSnapshot(city, locale);

  return NextResponse.json({ snapshot });
}