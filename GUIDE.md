# Weather Pulse - Developer Guide 📚

This guide provides detailed instructions for developers to understand, develop, and contribute to the Weather Pulse application.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Development Setup](#development-setup)
3. [Architecture](#architecture)
4. [File Structure Explained](#file-structure-explained)
5. [Working with Components](#working-with-components)
6. [API Development](#api-development)
7. [Internationalization (i18n)](#internationalization-i18n)
8. [Styling](#styling)
9. [Adding Features](#adding-features)
10. [Testing & Debugging](#testing--debugging)

---

## Project Overview

**Weather Pulse** is a Next.js 15 application that provides:
- Real-time weather information
- Multi-language support (7 languages)
- AI-powered chat interface
- Responsive, modern UI

The app uses:
- **Next.js 15** for full-stack React framework
- **App Router** for file-based routing
- **Tailwind CSS** for styling
- **TypeScript** for type safety
- **React 19** for UI components

---

## Development Setup

### Step 1: Environment Setup

```bash
# Install Node.js (v18+) from nodejs.org

# Clone and navigate to project
cd "Weathe application"

# Install dependencies
npm install
```

### Step 2: Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Step 3: Enable Hot Reload

- Changes to files automatically reload in browser
- This works for components, API routes, and styles

### Step 4: Configure IDE

Recommended VS Code extensions:
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin
- Prettier - Code formatter
- ESLint

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────┐
│         Next.js App Router              │
├─────────────────────────────────────────┤
│  [locale] Dynamic Routing               │
│  ├─ layout.tsx (per-locale layout)     │
│  └─ page.tsx (per-locale page)         │
├─────────────────────────────────────────┤
│         React Components                │
│  ├─ WeatherDashboard (Container)       │
│  ├─ ChatWidget                         │
│  └─ LanguageSwitcher                   │
├─────────────────────────────────────────┤
│         API Routes                      │
│  ├─ /api/weather (Data Layer)         │
│  └─ /api/chat (AI Integration)        │
├─────────────────────────────────────────┤
│         Utilities & Context             │
│  ├─ i18n (Translations)                │
│  ├─ Types (TypeScript interfaces)      │
│  └─ Middleware (Request handling)      │
└─────────────────────────────────────────┘
```

### Data Flow

```
User Input
    ↓
Component (React)
    ↓
API Route (/api/*)
    ↓
External Service (Weather API, Chat API)
    ↓
Response → Component → UI Update
```

---

## File Structure Explained

### `/app` - Next.js App Router

```
app/
├── layout.tsx           # Root layout with providers
├── page.tsx            # Root page (redirects to locale)
├── globals.css         # Global Tailwind styles
├── api/
│   ├── chat/
│   │   └── route.ts    # POST /api/chat endpoint
│   └── weather/
│       └── route.ts    # GET /api/weather endpoint
└── [locale]/
    ├── layout.tsx      # Locale-specific layout
    ├── page.tsx        # Locale-specific home page
    └── layout.tsx      # Nested locale layout
```

**Key Points:**
- `[locale]` is a dynamic segment for URL routing
- URL format: `http://localhost:3000/en` or `http://localhost:3000/hi`
- Each locale has its own layout and page

### `/components` - React Components

```
components/
├── ChatWidget.tsx           # Chat UI and interaction
├── WeatherDashboard.tsx     # Main weather container
├── WeatherCard.tsx          # Individual weather card
├── ForecastStrip.tsx        # Horizontal forecast scroll
├── LanguageSwitcher.tsx     # Language selection dropdown
└── LocaleProvider.tsx       # Context provider for locale
```

**Component Responsibilities:**
- **ChatWidget**: Handles user messages, displays responses
- **WeatherDashboard**: Orchestrates all weather components
- **WeatherCard**: Displays single weather metric
- **ForecastStrip**: Shows hourly/daily forecasts
- **LanguageSwitcher**: Manages language selection
- **LocaleProvider**: Provides locale context to all components

### `/lib` - Utility Functions

```
lib/
├── i18n.ts          # Internationalization setup, locale config
├── chat.ts          # Chat-related utilities, message handling
├── weather.ts       # Weather data processing, formatting
├── types.ts         # TypeScript interfaces and types
└── gradients.ts     # Tailwind gradient utilities
```

### `/messages` - Translation Files

```
messages/
├── en.json    # English
├── hi.json    # Hindi
├── kn.json    # Kannada
├── ml.json    # Malayalam
├── mr.json    # Marathi
├── ta.json    # Tamil
└── te.json    # Telugu
```

Each file contains key-value pairs for translations:
```json
{
  "weather.temperature": "Temperature",
  "weather.humidity": "Humidity",
  "chat.placeholder": "Type your message..."
}
```

---

## Working with Components

### Creating a New Component

1. **Create the component file** in `/components`

```tsx
// components/MyComponent.tsx
import React from 'react';

interface MyComponentProps {
  title: string;
  children?: React.ReactNode;
}

export const MyComponent: React.FC<MyComponentProps> = ({ 
  title, 
  children 
}) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold">{title}</h2>
      {children}
    </div>
  );
};
```

2. **Import and use in another component**

```tsx
import { MyComponent } from '@/components/MyComponent';

export default function Page() {
  return (
    <MyComponent title="Hello">
      <p>Content here</p>
    </MyComponent>
  );
}
```

### Using Translations in Components

```tsx
import { useLocale } from '@/components/LocaleProvider';
import messages from '@/messages/en.json';

export default function MyComponent() {
  const locale = useLocale();
  const t = messages[locale as keyof typeof messages];

  return <h1>{t['weather.temperature']}</h1>;
}
```

### Styling Components

Use Tailwind CSS classes:

```tsx
export default function StyledComponent() {
  return (
    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg">
      <h2 className="text-white font-bold text-lg">Styled</h2>
      <button className="px-4 py-2 bg-white text-blue-600 rounded hover:bg-gray-100">
        Click
      </button>
    </div>
  );
}
```

---

## API Development

### Structure of API Routes

API routes are in `/app/api/[feature]/route.ts`

```
/app/api/
├── weather/route.ts    → GET /api/weather
└── chat/route.ts       → POST /api/chat
```

### Creating a New API Route

**Step 1: Create the route file**

```tsx
// app/api/myfeature/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Your logic here
    const data = { message: 'Hello from API' };
    
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Process request
    const result = { received: body };
    
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.error();
  }
}
```

**Step 2: Call from component**

```tsx
async function fetchData() {
  const response = await fetch('/api/myfeature', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });
  
  const data = await response.json();
  console.log(data);
}
```

### Weather API Implementation

The `/api/weather` endpoint should:
1. Receive location or coordinates
2. Call external weather service (OpenWeatherMap, etc.)
3. Process and return formatted data

```tsx
// app/api/weather/route.ts
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city') || 'London';

  // Call external API
  const response = await fetch(
    `https://api.weather.service.com/weather?city=${city}`
  );
  const weatherData = await response.json();

  return NextResponse.json(weatherData);
}
```

### Chat API Implementation

The `/api/chat` endpoint should:
1. Receive user message
2. Process with AI/NLP service
3. Return response

```tsx
// app/api/chat/route.ts
export async function POST(request: NextRequest) {
  const { message } = await request.json();

  // Process with AI service
  const aiResponse = await processMessage(message);

  return NextResponse.json({ 
    response: aiResponse,
    timestamp: new Date().toISOString()
  });
}
```

---

## Internationalization (i18n)

### Current i18n Setup

- Languages: English, Hindi, Kannada, Malayalam, Marathi, Tamil, Telugu
- Default locale: English
- Implementation: File-based JSON translations

### Adding a New Language

**Step 1: Create translation file**

```json
// messages/fr.json
{
  "weather.temperature": "Température",
  "weather.humidity": "Humidité",
  "chat.placeholder": "Tapez votre message...",
  "nav.settings": "Paramètres"
}
```

**Step 2: Update i18n configuration**

```tsx
// lib/i18n.ts
export const locales = ['en', 'hi', 'kn', 'ml', 'mr', 'ta', 'te', 'fr'];
export const defaultLocale = 'en';
```

**Step 3: Update middleware** (if using locale-based routing)

```tsx
// middleware.ts
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Add locale validation
}
```

### Using Translations

```tsx
// Get translations for current locale
import { getMessages } from '@/lib/i18n';

const messages = getMessages('en');
const greeting = messages['greeting']; // "Hello"
```

---

## Styling

### Tailwind CSS Configuration

```tsx
// tailwind.config.ts
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        // Custom colors
      },
      gradients: {
        // Custom gradients from gradients.ts
      }
    }
  },
  plugins: []
};
```

### Using Gradients

```tsx
// From gradients.ts
import { getGradient } from '@/lib/gradients';

export function GradientComponent() {
  return (
    <div className={getGradient('sunset')}>
      Content with gradient background
    </div>
  );
}
```

### Responsive Design

```tsx
// Mobile-first approach
<div className="
  p-4           // Mobile padding
  sm:p-6        // Small screens
  md:p-8        // Medium screens
  lg:p-10       // Large screens
  bg-white
  rounded-lg
">
  Responsive content
</div>
```

---

## Adding Features

### Feature: Real-time Temperature Updates

1. **Update API** (`/api/weather/route.ts`)
```tsx
export async function GET(request: NextRequest) {
  // Fetch real-time data
}
```

2. **Create Component** (`/components/TemperatureMonitor.tsx`)
```tsx
export function TemperatureMonitor() {
  const [temp, setTemp] = useState(null);
  
  useEffect(() => {
    const interval = setInterval(fetchTemperature, 30000);
    return () => clearInterval(interval);
  }, []);

  return <div>{temp}°C</div>;
}
```

3. **Add Translation Keys**
```json
// messages/en.json
{
  "temperature.current": "Current Temperature",
  "temperature.high": "High",
  "temperature.low": "Low"
}
```

4. **Integrate into Dashboard**
```tsx
// In WeatherDashboard.tsx
import { TemperatureMonitor } from '@/components/TemperatureMonitor';

export default function WeatherDashboard() {
  return (
    <>
      <TemperatureMonitor />
      {/* other components */}
    </>
  );
}
```

---

## Testing & Debugging

### Running Tests

```bash
npm run test          # Run test suite
npm run test:watch   # Watch mode
npm run test:coverage # Coverage report
```

### Type Checking

```bash
npm run typecheck    # Check TypeScript errors
```

### Linting

```bash
npm run lint         # Run ESLint
npm run lint --fix   # Auto-fix issues
```

### Debug in Browser

1. **Console Logs**
```tsx
console.log('Debug info:', data);
```

2. **React DevTools**
   - Install React DevTools Chrome extension
   - Inspect component props and state

3. **Network Tab**
   - Open DevTools → Network
   - Monitor API calls
   - Check request/response data

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Component not updating | Check React keys, ensure state updates |
| API not responding | Check CORS, environment variables, API keys |
| Styling not applied | Clear `.next` folder, restart dev server |
| Language not changing | Verify translations exist, check locale context |
| Build failures | Run `npm install`, check Node version |

### Debugging Locale Issues

```tsx
// Check current locale
console.log(useLocale());

// Verify URL params
console.log(useParams());

// Check middleware
// middleware.ts logs
```

---

## Best Practices

### Code Organization
- ✅ Keep components small and focused
- ✅ Use TypeScript interfaces for props
- ✅ Separate logic from UI

### Performance
- ✅ Use dynamic imports for heavy components
- ✅ Implement code splitting
- ✅ Optimize images

### Accessibility
- ✅ Use semantic HTML
- ✅ Add ARIA labels
- ✅ Ensure keyboard navigation

### Security
- ✅ Validate API inputs
- ✅ Use environment variables for secrets
- ✅ Implement CORS properly

---

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

---

**Happy coding! 🚀**
