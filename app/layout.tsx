import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';

import './globals.css';

const bodyFont = Inter({ subsets: ['latin'], variable: '--font-body' });
const displayFont = Space_Grotesk({ subsets: ['latin'], variable: '--font-display' });

export const metadata: Metadata = {
  title: 'Weather Pulse',
  description: 'A multilingual weather app with a conversational weather assistant.',
  icons: {
    icon: '/icon.svg'
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${bodyFont.variable} ${displayFont.variable} bg-background text-text antialiased`}>
        {children}
      </body>
    </html>
  );
}