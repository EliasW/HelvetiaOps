import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '../globals.css';
// the client provider is exported from the package root
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';

// move the client-only provider into its own file
import Providers from '../components/Providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'HelvetiaOps - Operations Management',
  description:
    'Streamlined operations management platform for enterprise teams',
  keywords: ['operations', 'management', 'enterprise', 'helvetia'],
  robots: 'index, follow',
};

// use a Set for efficient membership checks
const locales = new Set(['en', 'de']);

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!locales.has(locale)) {
    notFound();
  }
  // pass the current locale to message loader
  const messages = await getMessages({ locale });
  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* provider for next-intl and next-auth state */}
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
