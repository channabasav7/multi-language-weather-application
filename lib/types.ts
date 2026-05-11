export type LocaleCode = 'en' | 'hi' | 'kn' | 'te' | 'ta' | 'ml' | 'mr';

export type WeatherCondition =
  | 'clear'
  | 'clouds'
  | 'rain'
  | 'drizzle'
  | 'thunderstorm'
  | 'snow'
  | 'mist'
  | 'haze'
  | 'fog'
  | 'smoke'
  | 'dust'
  | 'default';

export interface HourlyForecastItem {
  time: string;
  tempC: number;
  condition: WeatherCondition;
  precipitation: number;
}

export interface DailyForecastItem {
  day: string;
  highC: number;
  lowC: number;
  condition: WeatherCondition;
  precipitation: number;
}

export interface WeatherSnapshot {
  city: string;
  country: string;
  temperatureC: number;
  feelsLikeC: number;
  description: string;
  condition: WeatherCondition;
  humidity: number;
  windKph: number;
  visibilityKm: number;
  updatedAt: string;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}