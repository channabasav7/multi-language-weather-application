"use client";

import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';

import type { AppMessages } from '@/lib/i18n';
import type { LocaleCode } from '@/lib/types';

interface LocaleContextValue {
  locale: LocaleCode;
  messages: AppMessages;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  locale,
  messages,
  children
}: Readonly<{
  locale: LocaleCode;
  messages: AppMessages;
  children: ReactNode;
}>) {
  return <LocaleContext.Provider value={{ locale, messages }}>{children}</LocaleContext.Provider>;
}

export function useAppTranslations(namespace: keyof AppMessages) {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error('useAppTranslations must be used within LocaleProvider');
  }

  return (key: string) => context.messages[namespace][key] ?? key;
}

export function useLocale() {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error('useLocale must be used within LocaleProvider');
  }

  return context.locale;
}