import { NextRequest, NextResponse } from 'next/server';

import { generateChatReply } from '@/lib/chat';
import { isLocale } from '@/lib/i18n';
import type { ChatMessage, WeatherSnapshot } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const payload = (await request.json().catch(() => null)) as
    | {
        locale?: string;
        messages?: ChatMessage[];
        snapshot?: WeatherSnapshot;
      }
    | null;

  if (!payload?.snapshot) {
    return NextResponse.json({ error: 'Weather context is required.' }, { status: 400 });
  }

  const locale = isLocale(payload.locale || '') ? payload.locale : 'en';
  const reply = await generateChatReply({
    messages: Array.isArray(payload.messages) ? payload.messages : [],
    snapshot: payload.snapshot,
    locale
  });

  return NextResponse.json({ reply });
}