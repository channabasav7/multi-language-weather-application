import { getRequestConfig } from 'next-intl/server';

import { defaultLocale, isLocale, routing } from '@/lib/i18n';
import type { LocaleCode } from '@/lib/types';

export default getRequestConfig(async ({ requestLocale }) => {
  const resolvedLocale = await requestLocale;
  const locale: LocaleCode = isLocale(resolvedLocale ?? '') ? (resolvedLocale as LocaleCode) : defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
    timeZone: 'Asia/Kolkata'
  };
});

export type AppLocale = (typeof routing.locales)[number];