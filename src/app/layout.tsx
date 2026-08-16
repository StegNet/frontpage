import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { ModeToggle } from '@/components/theme-switcher';
import { Footer } from '@/components/footer';
import { LoggerProvider } from '@/lib/logger-context';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://stegnet.com'),
  title: 'StegNet',
  description: 'Welcome to StegNet.',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'StegNet',
    description: 'Welcome to StegNet.',
    url: 'https://stegnet.com',
    siteName: 'StegNet',
    type: 'website',
  },
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'StegNet',
              url: 'https://stegnet.com',
            }),
          }}
        />
        <LoggerProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="fixed top-4 right-4 z-50">
              <ModeToggle />
            </div>
            {children}
            <Footer />
          </ThemeProvider>
        </LoggerProvider>
      </body>
    </html>
  );
}
