import type { ChatMessage, LocaleCode, WeatherSnapshot } from '@/lib/types';

const model = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const openAiApiUrl = 'https://api.openai.com/v1/chat/completions';

function weatherContext(snapshot: WeatherSnapshot, locale: LocaleCode): string {
  return [
    `Locale: ${locale}`,
    `City: ${snapshot.city}, ${snapshot.country}`,
    `Temperature: ${snapshot.temperatureC}°C`,
    `Feels like: ${snapshot.feelsLikeC}°C`,
    `Condition: ${snapshot.description}`,
    `Humidity: ${snapshot.humidity}%`,
    `Wind: ${snapshot.windKph} kph`,
    `Visibility: ${snapshot.visibilityKm} km`
  ].join('\n');
}

function fallbackReply(message: string, snapshot: WeatherSnapshot) {
  const lowerMessage = message.toLowerCase();

  if (/^(hi|hello|hey|hii|hola|namaste|good morning|good afternoon|good evening)\b/.test(lowerMessage)) {
    return `Hi. For ${snapshot.city}, it is ${snapshot.temperatureC}°C with ${snapshot.description}. Ask me about rain, outfits, travel, or safety.`;
  }

  if (lowerMessage.includes('tip') || lowerMessage.includes('advice') || lowerMessage.includes('suggestion')) {
    const temperatureTip =
      snapshot.temperatureC >= 30
        ? 'Stay hydrated and wear light, breathable clothes.'
        : snapshot.temperatureC <= 18
          ? 'A light jacket or layered outfit would be useful.'
          : 'Comfortable everyday clothing should work well.';

    const weatherTip =
      snapshot.condition === 'rain' || snapshot.condition === 'thunderstorm'
        ? 'Carry an umbrella and keep travel plans flexible.'
        : 'Outdoor plans look reasonable, but check the sky again before leaving.';

    return `${temperatureTip} ${weatherTip}`;
  }

  if (lowerMessage.includes('visit') || lowerMessage.includes('travel') || lowerMessage.includes('go to') || lowerMessage.includes('can i go')) {
    if (snapshot.condition === 'rain' || snapshot.condition === 'thunderstorm') {
      return `You can visit ${snapshot.city}, but expect wet conditions and slower movement. Carry an umbrella and allow extra time.`;
    }

    if (snapshot.condition === 'mist' || snapshot.condition === 'fog' || snapshot.condition === 'haze') {
      return `You can visit ${snapshot.city}, but visibility is a bit reduced. Travel is fine if you stay cautious.`;
    }

    return `Yes, visiting ${snapshot.city} looks fine today. The weather is ${snapshot.description}, so normal travel should work well.`;
  }

  if (lowerMessage.includes('umbrella') || lowerMessage.includes('rain')) {
    return snapshot.condition === 'rain' || snapshot.condition === 'thunderstorm'
      ? 'Yes, bring an umbrella. The forecast looks wet.'
      : 'You probably do not need an umbrella right now, but keep one handy if you will be out for long.';
  }

  if (lowerMessage.includes('outfit') || lowerMessage.includes('wear')) {
    return snapshot.temperatureC >= 30
      ? 'Light, breathable clothing and water would be a good choice.'
      : snapshot.temperatureC <= 18
        ? 'A light jacket or layered outfit makes sense today.'
        : 'Comfortable everyday wear should work well.';
  }

  if (lowerMessage.includes('travel') || lowerMessage.includes('drive')) {
    return snapshot.condition === 'thunderstorm'
      ? 'Travel is possible, but watch for slower traffic and reduced visibility.'
      : 'Travel looks manageable based on the current weather.';
  }

  return `For ${snapshot.city}, it is ${snapshot.temperatureC}°C and ${snapshot.description}. Ask me about outfits, travel, rain, or the forecast.`;
}

export async function generateChatReply(params: {
  messages: ChatMessage[];
  snapshot: WeatherSnapshot;
  locale: LocaleCode;
}): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  const latestUserMessage = [...params.messages].reverse().find((message) => message.role === 'user')?.content || '';

  if (!apiKey) {
    return fallbackReply(latestUserMessage, params.snapshot);
  }

  try {
    const response = await fetch(openAiApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: [
              'You are a weather assistant inside a multilingual weather app.',
              'Use the provided weather context to answer clearly and briefly.',
              'If the user asks for plans, give practical suggestions tied to the forecast.',
              'Stay focused on weather, outfit, travel, and activity advice.',
              'Respond in the same language as the user when possible.'
            ].join(' ')
          },
          {
            role: 'system',
            content: weatherContext(params.snapshot, params.locale)
          },
          ...params.messages
            .filter((message) => message.role === 'user' || message.role === 'assistant')
            .map((message) => ({ role: message.role, content: message.content }))
        ],
        temperature: 0.4
      })
    });

    if (!response.ok) {
      return fallbackReply(latestUserMessage, params.snapshot);
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };

    return data.choices?.[0]?.message?.content?.trim() || fallbackReply(latestUserMessage, params.snapshot);
  } catch {
    return fallbackReply(latestUserMessage, params.snapshot);
  }
}