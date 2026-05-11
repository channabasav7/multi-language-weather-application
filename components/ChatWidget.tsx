"use client";

import { useState, useTransition } from 'react';

import { useAppTranslations } from '@/components/LocaleProvider';

import type { ChatMessage, LocaleCode, WeatherSnapshot } from '@/lib/types';

interface ChatWidgetProps {
  snapshot: WeatherSnapshot;
  locale: LocaleCode;
}

export function ChatWidget({ snapshot, locale }: ChatWidgetProps) {
  const t = useAppTranslations('App');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: `I can help with weather, outfit choices, and travel plans for ${snapshot.city}.`
    }
  ]);
  const [prompt, setPrompt] = useState('');
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const sendMessage = () => {
    const content = prompt.trim();

    if (!content) {
      return;
    }

    const nextMessages: ChatMessage[] = [...messages, { role: 'user', content }];

    setMessages(nextMessages);
    setPrompt('');
    setError(null);

    startTransition(async () => {
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            locale,
            messages: nextMessages,
            snapshot
          })
        });

        const data = (await response.json()) as { reply?: string; error?: string };

        if (!response.ok) {
          throw new Error(data.error || 'Unable to respond right now.');
        }

        setMessages((current) => [...current, { role: 'assistant', content: data.reply || 'I am ready to help with the forecast.' }]);
      } catch (chatError) {
        setError(chatError instanceof Error ? chatError.message : 'Unable to respond right now.');
      }
    });
  };

  return (
    <section className="glass-card-strong flex h-full flex-col rounded-[2rem] p-5 md:p-6">
      <div className="mb-5">
        <p className="text-sm uppercase tracking-[0.28em] text-cyan-200/80">{t('chatTitle')}</p>
        <h2 className="mt-2 text-2xl font-semibold text-white">{t('chatSubtitle')}</h2>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto rounded-[1.5rem] bg-black/12 p-3">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`max-w-[86%] rounded-3xl px-4 py-3 text-sm leading-6 ${
              message.role === 'assistant'
                ? 'bg-white/12 text-slate-100'
                : 'ml-auto bg-cyan-300 text-slate-950'
            }`}
          >
            {message.content}
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-[1.4rem] border border-white/10 bg-white/8 p-3">
        <div className="flex flex-wrap gap-2 text-xs text-slate-300">
          <span className="rounded-full bg-white/10 px-3 py-1">Rain check</span>
          <span className="rounded-full bg-white/10 px-3 py-1">Travel tips</span>
          <span className="rounded-full bg-white/10 px-3 py-1">Outfit advice</span>
        </div>
        <div className="mt-3 flex gap-3">
          <input
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                sendMessage();
              }
            }}
            placeholder={t('chatPlaceholder')}
            className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-slate-950/35 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-cyan-300/60"
          />
          <button
            type="button"
            onClick={sendMessage}
            disabled={isPending}
            className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? '...' : t('send')}
          </button>
        </div>
        {error ? <p className="mt-2 text-sm text-rose-200">{error}</p> : null}
      </div>
    </section>
  );
}