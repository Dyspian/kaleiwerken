import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/layout/smooth-scroll";
import { ScrollProgress } from "@/components/layout/scroll-progress";
import { AuthProvider } from "@/components/auth/auth-provider";

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
  metadataBase: new URL("https://vanroey-kalei.be"),
  title: {
    default: "Van Roey Kaleiwerken | Specialist in Authentieke Gevelrenovatie",
    template: "%s | Van Roey Kaleiwerken"
  },
  description: "Specialist in authentieke kaleiwerken met een hoogwaardige afwerking. Al 10 jaar ervaring in gevelrenovatie voor binnen en buiten in Antwerpen en omstreken.",
  keywords: ["kaleiwerken", "gevelrenovatie", "kalei", "Antwerpen", "gevelreiniging", "authentieke kalei", "Van Roey"],
  authors: [{ name: "Van Roey Kaleiwerken" }],
  creator: "Van Roey",
  openGraph: {
    type: "website",
    locale: "nl_BE",
    url: "https://vanroey-kalei.be",
    siteName: "Van Roey Kaleiwerken",
    title: "Van Roey Kaleiwerken | Premium Gevelrenovatie",
    description: "Ontdek de kunst van authentieke kaleiwerken. Specialist in duurzame gevelrenovatie met handgemengde pigmenten.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Van Roey Kaleiwerken Realisatie",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Van Roey Kaleiwerken | Premium Gevelrenovatie",
    description: "Specialist in authentieke kaleiwerken met een hoogwaardige afwerking.",
    images: ["/og-image.jpg"],
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased`}
      >
        <AuthProvider>
          <div className="noise-overlay" />
          <ScrollProgress />
          <SmoothScroll>
              {children}
          </SmoothScroll>
        </AuthProvider>
      </body>
    </html>
  );
}