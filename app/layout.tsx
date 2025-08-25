import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import CookieConsent from "../components/CookieConsent";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | Имотори',
    default: 'Имотори - Премиум недвижими имоти в България',
  },
  description: "Открийте луксозни недвижими имоти в България с Имотори. Премиум апартаменти, къщи и търговски имоти в основните български градове.",
  metadataBase: new URL('https://imotory.com'),
  
  // Keywords
  keywords: [
    'недвижими имоти България',
    'луксозни имоти',
    'апартаменти София',
    'къщи Пловдив',
    'имоти Варна',
    'недвижими имоти Бургас',
    'пазар на имоти България',
    'премиум жилища',
    'Bulgaria real estate',
    'luxury properties',
    'premium homes'
  ],

  // Authors
  authors: [{ name: 'Imotory' }],
  
  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'bg_BG',
    url: 'https://imotory.com',
    siteName: 'Имотори - Премиум недвижими имоти в България',
    title: 'Имотори - Премиум недвижими имоти в България',
    description: 'Открийте луксозни недвижими имоти в България с Имотори. Премиум апартаменти, къщи и търговски имоти в основните български градове.',
    images: [
      {
        url: '/Home-Page-Image-Search.png',
        width: 1200,
        height: 630,
        alt: 'Имотори - Премиум недвижими имоти в България',
      },
    ],
  },

  // Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'Имотори - Премиум недвижими имоти в България',
    description: 'Открийте луксозни недвижими имоти в България с Имотори.',
    images: ['/Home-Page-Image-Search.png'],
    creator: '@imotory',
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },

  // Language alternates  
  alternates: {
    canonical: 'https://imotory.com',
    languages: {
      'bg': 'https://imotory.com',
      'en': 'https://imotory.com/en',
      'ru': 'https://imotory.com/ru',
    },
  },

  // Verification
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },

  // Additional
  category: 'Real Estate',
  classification: 'Real Estate, Property, Bulgaria',
  
  // App links (if you have mobile apps)
  appLinks: {
    web: {
      url: 'https://imotory.com',
      should_fallback: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bg">
      <head>
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'RealEstateAgent',
              name: 'Имотори',
              url: 'https://imotory.com',
              logo: 'https://imotory.com/logo.png',
              description: 'Премиум услуги за недвижими имоти в България от 1993г.',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Sofia',
                addressCountry: 'BG',
              },
              areaServed: [
                { '@type': 'City', name: 'София' },
                { '@type': 'City', name: 'Пловдив' },
                { '@type': 'City', name: 'Варна' },
                { '@type': 'City', name: 'Бургас' },
              ],
              serviceType: ['Продажба на недвижими имоти', 'Консултации за имоти', 'Управление на имоти'],
              foundingDate: '1993',
              sameAs: [
                'https://facebook.com/imotory',
                'https://instagram.com/imotory',
                'https://twitter.com/imotory',
              ],
            }),
          }}
        />
        
        {/* Hreflang tags */}
        <link rel="alternate" hrefLang="bg" href="https://imotory.com" />
        <link rel="alternate" hrefLang="en" href="https://imotory.com/en" />
        <link rel="alternate" hrefLang="ru" href="https://imotory.com/ru" />
        <link rel="alternate" hrefLang="x-default" href="https://imotory.com" />
        
        {/* Favicon */}
        <link rel="icon" href="/imotory-icon.svg" type="image/svg+xml" />
        <link rel="icon" href="/imotory-icon.svg" sizes="any" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/imotory-icon.svg" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <div className="min-h-screen bg-white flex flex-col">
            <NavBar />
            <main className="flex-1">{children}</main>
            <Footer />
            <CookieConsent />
          </div>
        </Providers>
      </body>
    </html>
  );
}