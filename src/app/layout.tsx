import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://vanroey-kalei.be'),
  title: {
    default: "Van Roey Kaleiwerken | Specialist in Authentieke Gevelrenovatie",
    template: "%s | Van Roey Kaleiwerken"
  },
  description: "Uw expert in kaleiwerken voor binnen- en buitengevels. Ontdek duurzame gevelrenovatie met minerale pigmenten en vakmanschap. Vraag uw vrijblijvende offerte aan.",
  keywords: [
    "kaleiwerken",
    "gevelrenovatie", 
    "kalei",
    "gevels kaleien",
    "authentieke kalei",
    "minerale pigmenten",
    "vakmanschap",
    "Antwerpen",
    "België",
    "gevelspecialist",
    "gevelrenovatie Antwerpen",
    "kaleiwerken Antwerpen"
  ],
  authors: [{ name: "Van Roey Kaleiwerken" }],
  creator: "Van Roey Kaleiwerken",
  publisher: "Van Roey Kaleiwerken",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "Van Roey Kaleiwerken | Specialist in Authentieke Gevelrenovatie",
    description: "Uw expert in kaleiwerken voor binnen- en buitengevels. Ontdek duurzame gevelrenovatie met minerale pigmenten en vakmanschap.",
    url: "https://vanroey-kalei.be",
    siteName: "Van Roey Kaleiwerken",
    images: [
      {
        url: "https://sjfosmcpbekkokmedwil.supabase.co/storage/v1/object/public/hero/hero.jpeg",
        width: 1200,
        height: 630,
        alt: "Van Roey Kaleiwerken - Specialist in authentieke gevelrenovatie",
      },
    ],
    locale: "nl_BE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Van Roey Kaleiwerken | Specialist in Authentieke Gevelrenovatie",
    description: "10 jaar ervaring in kaleiwerken voor binnen- en buitengevels. Vrijblijvende offerte binnen 48u.",
    images: ["https://sjfosmcpbekkokmedwil.supabase.co/storage/v1/object/public/hero/hero.jpeg"],
    site: "@vanroeykalei",
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
  alternates: {
    canonical: "https://vanroey-kalei.be",
    languages: {
      'nl-BE': 'https://vanroey-kalei.be/nl',
      'en-BE': 'https://vanroey-kalei.be/en',
      'fr-BE': 'https://vanroey-kalei.be/fr',
      'de-BE': 'https://vanroey-kalei.be/de',
    },
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color" content="#1A1917" />
        <meta name="msapplication-TileColor" content="#1A1917" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}