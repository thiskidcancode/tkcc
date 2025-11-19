import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ThisKidCanCode - Free Coding Education for Kids Ages 11-18",
    template: "%s | ThisKidCanCode"
  },
  description: "This Kid Can Code - 100% free coding platform teaching kids HTML, CSS, and JavaScript through gamified adventures. 5,000+ students trained since 2013. Professional GitHub tools for real-world skills.",
  keywords: ["this kid can code", "thiskidcancode", "coding for kids", "free programming education", "HTML CSS JavaScript", "GitHub for students", "computer science education", "coding bootcamp kids", "learn to code free", "programming for teens", "kids coding platform", "free coding classes", "coding education", "programming bootcamp", "web development for kids"],
  authors: [{ name: "ThisKidCanCode" }],
  creator: "ThisKidCanCode",
  publisher: "ThisKidCanCode",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://thiskidcancode.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "This Kid Can Code - Free Coding Education for Kids",
    description: "This Kid Can Code - 100% free coding platform teaching kids HTML, CSS, and JavaScript through gamified adventures. 5,000+ students trained since 2013.",
    url: 'https://thiskidcancode.com',
    siteName: 'ThisKidCanCode',
    images: [
      {
        url: '/tkccFbLogo.png',
        width: 1200,
        height: 630,
        alt: 'ThisKidCanCode Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "This Kid Can Code - Free Coding Education for Kids",
    description: "This Kid Can Code - 100% free coding platform teaching kids HTML, CSS, and JavaScript through gamified adventures. 5,000+ students trained since 2013.",
    images: ['/tkccFbLogo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'This Kid Can Code',
  alternateName: ['ThisKidCanCode', 'TKCC'],
  description: 'This Kid Can Code - 100% free coding platform teaching kids HTML, CSS, and JavaScript through gamified adventures.',
  url: 'https://thiskidcancode.com',
  logo: 'https://thiskidcancode.com/tkccFbLogo.png',
  foundingDate: '2013',
  sameAs: [
    'https://github.com/thiskidcancode',
  ],
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'US',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'hello@thiskidcancode.com',
    contactType: 'customer service',
  },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    description: 'Free coding education for kids ages 11-18',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
