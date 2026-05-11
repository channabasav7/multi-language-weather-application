import { defineRouting } from 'next-intl/routing';

import type { LocaleCode } from '@/lib/types';

export const locales: LocaleCode[] = ['en', 'hi', 'kn', 'te', 'ta', 'ml', 'mr'];

export const defaultLocale: LocaleCode = 'en';

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'always'
});

export const localeNames: Record<LocaleCode, string> = {
  en: 'English',
  hi: 'हिन्दी',
  kn: 'ಕನ್ನಡ',
  te: 'తెలుగు',
  ta: 'தமிழ்',
  ml: 'മലയാളം',
  mr: 'मराठी'
};

export function isLocale(value: string): value is LocaleCode {
  return locales.includes(value as LocaleCode);
}