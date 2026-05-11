# Weather Pulse 🌤️

A modern, multilingual weather application built with **Next.js**, **React**, and **Tailwind CSS**. Get real-time weather updates, AI-powered chat support, and beautiful weather visualizations.

## Features

- 🌍 **Multi-Language Support** - Support for 7 languages (English, Hindi, Kannada, Malayalam, Marathi, Tamil, Telugu)
- 💬 **AI Chat Widget** - Intelligent chat assistance integrated throughout the app
- 📊 **Weather Dashboard** - Real-time weather information and forecasts
- 🎨 **Beautiful UI** - Modern, responsive design with smooth animations
- 📱 **Mobile Responsive** - Works seamlessly on all devices
- 🚀 **Fast Performance** - Optimized with Next.js 15 and React 19
- 🔒 **Type Safe** - Built with TypeScript for reliability

## Tech Stack

- **Framework**: Next.js 15.3.0
- **Frontend**: React 19.0.0
- **Styling**: Tailwind CSS 3.4.17
- **UI Components**: Lucide React Icons
- **Language**: TypeScript 5.8.3
- **Utilities**: clsx for className management

## Project Structure

```
├── app/                      # Next.js App Router
│   ├── api/                 # API routes
│   │   ├── chat/           # Chat API endpoint
│   │   └── weather/        # Weather API endpoint
│   ├── [locale]/           # Dynamic locale routing
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page redirect
│   └── globals.css         # Global styles
├── components/             # React components
│   ├── ChatWidget.tsx      # Chat interface
│   ├── WeatherDashboard.tsx# Main weather display
│   ├── WeatherCard.tsx     # Weather card component
│   ├── ForecastStrip.tsx   # Forecast display
│   ├── LanguageSwitcher.tsx# Language selection
│   └── LocaleProvider.tsx  # Locale context provider
├── lib/                    # Utility functions
│   ├── i18n.ts            # Internationalization config
│   ├── chat.ts            # Chat utilities
│   ├── weather.ts         # Weather data handling
│   ├── gradients.ts       # Gradient utilities
│   └── types.ts           # TypeScript types
├── messages/              # Translation files
│   ├── en.json           # English translations
│   ├── hi.json           # Hindi translations
│   └── [6 more languages]
├── middleware.ts          # Next.js middleware
├── tailwind.config.ts     # Tailwind configuration
├── tsconfig.json          # TypeScript configuration
└── next.config.mjs        # Next.js configuration
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Weathe application"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (if needed)
   - Create a `.env.local` file in the root directory
   - Add any required API keys for weather and chat services

### Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Usage Guide

### Viewing Weather

1. Select your preferred language using the **Language Switcher**
2. The **Weather Dashboard** displays current conditions and forecasts
3. View detailed information in **Weather Cards**
4. Check extended forecasts in the **Forecast Strip**

### Using the Chat Feature

- Click on the **Chat Widget** to open the chat interface
- Ask weather-related questions or get general assistance
- The chat responds in your selected language

### Changing Language

- Click the **Language Switcher** in the header
- Select from 7 available languages
- The entire app updates to your chosen language

## API Routes

### Weather API
- **Endpoint**: `/api/weather`
- **Purpose**: Fetch weather data and forecasts
- **Method**: GET

### Chat API
- **Endpoint**: `/api/chat`
- **Purpose**: Handle chat messages and responses
- **Method**: POST

## Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm start         # Start production server
npm run lint      # Run ESLint
npm run typecheck # TypeScript type checking
```

## Languages Supported

- 🇬🇧 English
- 🇮🇳 Hindi
- 🇮🇳 Kannada
- 🇮🇳 Malayalam
- 🇮🇳 Marathi
- 🇮🇳 Tamil
- 🇮🇳 Telugu

## Key Components

### WeatherDashboard
Main component displaying weather information with interactive elements.

### ChatWidget
Conversational interface for user interactions and assistance.

### LanguageSwitcher
Allows users to change the application language on the fly.

### WeatherCard
Individual card components showing specific weather details.

### ForecastStrip
Horizontal scrollable component displaying weather forecasts.

## Configuration

### Tailwind CSS
Configured in [tailwind.config.ts](tailwind.config.ts) with custom gradients and utilities.

### TypeScript
Strict mode enabled in [tsconfig.json](tsconfig.json) for better type safety.

### i18n Setup
Language configuration managed in [lib/i18n.ts](lib/i18n.ts) with dynamic locale routing.

## Performance Optimization

- Server-side rendering for better SEO
- Optimized images and assets
- CSS-in-JS with Tailwind for smaller bundle sizes
- Code splitting with dynamic imports

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## Troubleshooting

### App not loading?
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `npm install`
- Restart dev server: `npm run dev`

### Language not updating?
- Check `messages/` folder for translation files
- Verify locale routing in `app/[locale]/`

### Weather data not showing?
- Check `/api/weather` endpoint
- Verify API keys in `.env.local`

## Future Enhancements

- [ ] Geolocation support
- [ ] Weather alerts and notifications
- [ ] User preferences storage
- [ ] Dark mode toggle
- [ ] Weather history tracking
- [ ] Advanced forecast analytics

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues, questions, or suggestions, please open an issue or contact the development team.

---

**Made with ❤️ using Next.js and React**
