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
  title: "Van Roey Kaleiwerken | Specialist in Authentieke Gevelrenovatie",
  description: "Uw expert in kaleiwerken voor binnen- en buitengevels. Ontdek duurzame gevelrenovatie met minerale pigmenten en vakmanschap. Vraag uw vrijblijvende offerte aan.",
  icons: {
    icon: "/favicon.png", // Dit verwijst naar /public/favicon.png
  },
  keywords: ["kaleiwerken", "gevelrenovatie", "kalei", "gevels kaleien", "authentieke kalei", "minerale pigmenten", "vakmanschap", "Antwerpen", "België"],
  openGraph: {
    title: "Van Roey Kaleiwerken | Specialist in Authentieke Gevelrenovatie",
    description: "Uw expert in kaleiwerken voor binnen- en buitengevels. Ontdek duurzame gevelrenovatie met minerale pigmenten en vakmanschap. Vraag uw vrijblijvende offerte aan.",
    url: "https://vanroey-kalei.be",
    siteName: "Van Roey Kaleiwerken",
    images: [
      {
        url: "https://sjfosmcpbekkokmedwil.supabase.co/storage/v1/object/public/hero/hero.jpeg", // Gebruik een relevante afbeelding
        width: 1200,
        height: 630,
        alt: "Van Roey Kaleiwerken Gevelrenovatie",
      },
    ],
    locale: "nl_BE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Van Roey Kaleiwerken | Specialist in Authentieke Gevelrenovatie",
    description: "Uw expert in kaleiwerken voor binnen- en buitengevels. Ontdek duurzame gevelrenovatie met minerale pigmenten en vakmanschap. Vraag uw vrijblijvende offerte aan.",
    images: ["https://sjfosmcpbekkokmedwil.supabase.co/storage/v1/object/public/hero/hero.jpeg"], // Gebruik een relevante afbeelding
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
        {children}
      </body>
    </html>
  );
}