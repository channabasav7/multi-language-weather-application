import { getRequestConfig } from 'next-intl/server';

import { defaultLocale, isLocale, routing } from '@/lib/i18n';

export default getRequestConfig(async ({ requestLocale }) => {
  const resolvedLocale = await requestLocale;
  const locale = isLocale(resolvedLocale ?? '') ? resolvedLocale : defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
    timeZone: 'Asia/Kolkata'
  };
});

export type AppLocale = (typeof routing.locales)[number];