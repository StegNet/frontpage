import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { ModeToggle } from '@/components/theme-switcher';
import { Footer } from '@/components/footer';
import { SiteNav } from '@/components/site-nav';
import { org } from '@/lib/org';
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

const siteDescription =
  'Udruga za digitalne tehnologije StegNet — StegNet Digital Technologies Association, Vinež, Croatia.';

export const metadata: Metadata = {
  metadataBase: new URL('https://stegnet.com'),
  title: 'StegNet',
  description: siteDescription,
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'StegNet',
    description: siteDescription,
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
              '@type': 'NGO',
              name: org.name,
              legalName: org.legalName,
              alternateName: org.alternateName,
              url: org.url,
              email: org.email,
              taxID: org.oib,
              identifier: [
                {
                  '@type': 'PropertyValue',
                  propertyID: 'OIB',
                  value: org.oib,
                },
                {
                  '@type': 'PropertyValue',
                  propertyID: 'Registarski broj',
                  value: org.registryNumber,
                },
              ],
              address: {
                '@type': 'PostalAddress',
                streetAddress: org.address.street,
                postalCode: org.address.postalCode,
                addressLocality: org.address.city,
                addressRegion: org.address.region,
                addressCountry: org.address.countryCode,
              },
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
            <SiteNav />
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
