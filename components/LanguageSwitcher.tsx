"use client";

import { useRouter } from 'next/navigation';

import { localeNames, locales } from '@/lib/i18n';
import type { LocaleCode } from '@/lib/types';

interface LanguageSwitcherProps {
  locale: LocaleCode;
}

export function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  const router = useRouter();

  return (
    <div className="glass-card inline-flex flex-wrap items-center gap-2 rounded-full p-2 shadow-glow">
      {locales.map((item) => {
        const active = item === locale;

        return (
          <button
            key={item}
            type="button"
            onClick={() => router.push(`/${item}`)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              active
                ? 'bg-white text-slate-950 shadow-lg shadow-cyan-400/20'
                : 'text-slate-200 hover:bg-white/10 hover:text-white'
            }`}
          >
            {localeNames[item]}
          </button>
        );
      })}
    </div>
  );
}