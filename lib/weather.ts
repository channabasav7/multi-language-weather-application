import type { LocaleCode, WeatherCondition, WeatherSnapshot } from '@/lib/types';

const OPEN_WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

type OpenWeatherForecastItem = {
  dt?: number;
  main?: {
    temp?: number;
  };
  pop?: number;
  weather?: Array<{ main?: string }>;
};

type OpenWeatherForecastResponse = {
  list?: OpenWeatherForecastItem[];
};

const localeToWeatherLanguage: Record<LocaleCode, string> = {
  en: 'en',
  hi: 'hi',
  kn: 'en',
  te: 'en',
  ta: 'en',
  ml: 'en',
  mr: 'en'
};

const conditionMap: Array<{ keys: string[]; condition: WeatherCondition }> = [
  { keys: ['thunderstorm'], condition: 'thunderstorm' },
  { keys: ['drizzle'], condition: 'drizzle' },
  { keys: ['rain'], condition: 'rain' },
  { keys: ['snow'], condition: 'snow' },
  { keys: ['mist', 'smoke'], condition: 'mist' },
  { keys: ['haze'], condition: 'haze' },
  { keys: ['fog'], condition: 'fog' },
  { keys: ['cloud'], condition: 'clouds' },
  { keys: ['clear'], condition: 'clear' },
  { keys: ['dust'], condition: 'dust' }
];

export function mapCondition(rawValue: string): WeatherCondition {
  const normalized = rawValue.toLowerCase();
  const match = conditionMap.find((entry) => entry.keys.some((key) => normalized.includes(key)));
  return match?.condition ?? 'default';
}

function hashText(value: string): number {
  let hash = 0;

  for (const character of value) {
    hash = (hash * 31 + character.charCodeAt(0)) | 0;
  }

  return Math.abs(hash);
}

function formatUpdatedAtLabel(date: Date, locale: LocaleCode) {
  return new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'Asia/Kolkata'
  }).format(date);
}

function createDemoSnapshot(city: string, locale: LocaleCode): WeatherSnapshot {
  const hash = hashText(city || 'weather');
  const conditions: WeatherCondition[] = ['clear', 'clouds', 'rain', 'mist', 'haze', 'thunderstorm'];
  const condition = conditions[hash % conditions.length];
  const baseTemp = 18 + (hash % 12);
  const humidity = 45 + (hash % 42);
  const windKph = 6 + (hash % 18);

  const hourly = Array.from({ length: 6 }, (_, index) => ({
    time: new Intl.DateTimeFormat(locale, { hour: 'numeric', hour12: true }).format(
      new Date(Date.now() + index * 60 * 60 * 1000)
    ),
    tempC: baseTemp + (index % 3) - 1,
    condition,
    precipitation: condition === 'rain' || condition === 'thunderstorm' ? 40 + index * 5 : index * 2
  }));

  const daily = Array.from({ length: 5 }, (_, index) => ({
    day: new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(
      new Date(Date.now() + index * 24 * 60 * 60 * 1000)
    ),
    highC: baseTemp + 3 + index,
    lowC: baseTemp - 3 + index,
    condition,
    precipitation: condition === 'rain' || condition === 'thunderstorm' ? 55 - index * 4 : 10 + index * 3
  }));

  return {
    city: city || 'Bengaluru',
    country: 'IN',
    temperatureC: baseTemp,
    feelsLikeC: baseTemp + 2,
    description: `${condition} skies`,
    condition,
    humidity,
    windKph,
    visibilityKm: 8 + (hash % 5),
    updatedAt: new Date().toISOString(),
    updatedAtLabel: formatUpdatedAtLabel(new Date(), locale),
    hourly,
    daily
  };
}

function buildForecastFromResponse(forecastData: OpenWeatherForecastResponse | null, locale: LocaleCode, condition: WeatherCondition) {
  const list = Array.isArray(forecastData?.list) ? forecastData.list : [];
  const grouped = new Map<string, { temps: number[]; precipitation: number; condition: WeatherCondition; day: string }>();

  for (const item of list.slice(0, 24)) {
    const timestamp = item?.dt ? new Date(item.dt * 1000) : new Date();
    const dayKey = new Intl.DateTimeFormat('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(timestamp);
    const dayLabel = new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(timestamp);
    const itemCondition = mapCondition(String(item?.weather?.[0]?.main ?? 'default'));
    const precipitation = Number(item?.pop ?? 0) * 100;

    const existing = grouped.get(dayKey);

    if (existing) {
      existing.temps.push(Number(item?.main?.temp ?? 0));
      existing.precipitation = Math.max(existing.precipitation, precipitation);
      existing.condition = existing.condition === 'default' ? itemCondition : existing.condition;
    } else {
      grouped.set(dayKey, {
        temps: [Number(item?.main?.temp ?? 0)],
        precipitation,
        condition: itemCondition,
        day: dayLabel
      });
    }
  }

  const daily = Array.from(grouped.values())
    .slice(0, 5)
    .map((entry, index) => ({
      day: index === 0 ? 'Today' : entry.day,
      highC: Math.ceil(Math.max(...entry.temps)) || 0,
      lowC: Math.floor(Math.min(...entry.temps)) || 0,
      condition: entry.condition === 'default' ? condition : entry.condition,
      precipitation: Math.round(entry.precipitation)
    }));

  const hourly = list.slice(0, 6).map((item) => ({
    time: new Intl.DateTimeFormat(locale, { hour: 'numeric', hour12: true }).format(
      item?.dt ? new Date(item.dt * 1000) : new Date()
    ),
    tempC: Math.round(Number(item?.main?.temp ?? 0)),
    condition: mapCondition(String(item?.weather?.[0]?.main ?? 'default')),
    precipitation: Math.round(Number(item?.pop ?? 0) * 100)
  }));

  return { hourly, daily };
}

export async function fetchWeatherSnapshot(city: string, locale: LocaleCode): Promise<WeatherSnapshot> {
  const trimmedCity = city.trim();
  const apiKey = process.env.OPENWEATHER_API_KEY || process.env.OPENWEATHERMAP_API_KEY;

  if (!trimmedCity) {
    return createDemoSnapshot('Bengaluru', locale);
  }

  if (!apiKey) {
    return createDemoSnapshot(trimmedCity, locale);
  }

  try {
    const language = localeToWeatherLanguage[locale] ?? 'en';
    const currentUrl = new URL(`${OPEN_WEATHER_BASE_URL}/weather`);
    currentUrl.searchParams.set('q', trimmedCity);
    currentUrl.searchParams.set('appid', apiKey);
    currentUrl.searchParams.set('units', 'metric');
    currentUrl.searchParams.set('lang', language);

    const forecastUrl = new URL(`${OPEN_WEATHER_BASE_URL}/forecast`);
    forecastUrl.searchParams.set('q', trimmedCity);
    forecastUrl.searchParams.set('appid', apiKey);
    forecastUrl.searchParams.set('units', 'metric');
    forecastUrl.searchParams.set('lang', language);

    const [currentResponse, forecastResponse] = await Promise.all([
      fetch(currentUrl, { cache: 'no-store' }),
      fetch(forecastUrl, { cache: 'no-store' })
    ]);

    if (!currentResponse.ok) {
      throw new Error(`Weather request failed: ${currentResponse.status}`);
    }

    const currentData = await currentResponse.json();
    const forecastData = forecastResponse.ok ? await forecastResponse.json() : null;
    const condition = mapCondition(String(currentData?.weather?.[0]?.main ?? 'default'));
    const forecast = buildForecastFromResponse(forecastData, locale, condition);

    return {
      city: String(currentData?.name ?? trimmedCity),
      country: String(currentData?.sys?.country ?? ''),
      temperatureC: Math.round(Number(currentData?.main?.temp ?? 0)),
      feelsLikeC: Math.round(Number(currentData?.main?.feels_like ?? currentData?.main?.temp ?? 0)),
      description: String(currentData?.weather?.[0]?.description ?? 'Weather conditions'),
      condition,
      humidity: Math.round(Number(currentData?.main?.humidity ?? 0)),
      windKph: Math.round(Number(currentData?.wind?.speed ?? 0) * 3.6),
      visibilityKm: Math.round(Number(currentData?.visibility ?? 0) / 1000),
      updatedAt: new Date().toISOString(),
      updatedAtLabel: formatUpdatedAtLabel(new Date(), locale),
      hourly: forecast.hourly.length ? forecast.hourly : createDemoSnapshot(trimmedCity, locale).hourly,
      daily: forecast.daily.length ? forecast.daily : createDemoSnapshot(trimmedCity, locale).daily
    };
  } catch {
    return createDemoSnapshot(trimmedCity, locale);
  }
}