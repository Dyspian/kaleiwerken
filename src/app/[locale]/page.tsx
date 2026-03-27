import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/home/hero";
import { SocialProof } from "@/components/home/social-proof";
import { Features } from "@/components/home/features";
import { BeforeAfter } from "@/components/home/before-after";
import { Process } from "@/components/home/process";
import { QuoteWizard } from "@/components/quote/quote-wizard";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";
import { getDictionary } from "@/lib/get-dictionary";
import { Locale } from "@/lib/i18n-config";

export default async function Home({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale) as any;

  // Fallback to prevent crashes if dict is not fully loaded
  const heroDict = dict?.hero || {};
  const quoteDict = dict?.quote || {};
  const commonDict = dict?.common || {};

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Van Roey Kaleiwerken",
    "image": "https://vanroey-kalei.be/og-image.jpg",
    "@id": "https://vanroey-kalei.be",
    "url": "https://vanroey-kalei.be",
    "telephone": "+32470123456",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Kaleiweg 12",
      "addressLocality": "Antwerpen",
      "postalCode": "2000",
      "addressCountry": "BE"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 51.2194,
      "longitude": 4.4025
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday"
      ],
      "opens": "08:00",
      "closes": "18:00"
    },
    "sameAs": [
      "https://www.facebook.com/vanroeykalei",
      "https://www.instagram.com/vanroeykalei"
    ],
    "priceRange": "$$",
    "description": heroDict.subtitle || ""
  };

  return (
    <main className="min-h-screen bg-brand-white text-brand-dark font-sans selection:bg-brand-bronze/30">
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header dict={dict} />
      
      <Hero dict={heroDict} />
      <SocialProof dict={dict} />
      
      <div className="bg-brand-stone">
        <BeforeAfter dict={dict} />
        <Features dict={dict?.features} />
        <Process dict={dict} />

        <section id="offerte" className="py-32 bg-brand-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-bronze/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
            
            <div className="container mx-auto px-6 md:px-12 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
                    <div className="lg:sticky lg:top-32">
                        <span className="uppercase text-xs tracking-[0.3em] text-brand-bronze font-medium mb-6 block">{commonDict.contact}</span>
                        <h2 className="font-serif text-5xl md:text-7xl font-medium mb-8 leading-[0.9] text-brand-dark">
                            {quoteDict.title}
                        </h2>
                        <p className="text-xl text-brand-dark/60 mb-12 max-w-md font-light leading-relaxed">
                            {quoteDict.subtitle}
                        </p>
                        
                        <div className="hidden lg:block space-y-6 pt-12 border-t border-brand-dark/5">
                            <div>
                                <h4 className="uppercase text-[10px] tracking-widest text-brand-dark/40 mb-2">{dict?.footer?.contact}</h4>
                                <p className="font-serif text-2xl text-brand-dark">+32 470 12 34 56</p>
                            </div>
                            <div>
                                <h4 className="uppercase text-[10px] tracking-widest text-brand-dark/40 mb-2">Email</h4>
                                <p className="font-serif text-2xl text-brand-dark">info@vanroey-kalei.be</p>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <QuoteWizard dict={quoteDict} />
                    </div>
                </div>
            </div>
        </section>
      </div>

      <Footer dict={dict} />
      <Toaster position="top-center" richColors />
    </main>
  );
}