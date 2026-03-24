import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";
import { Check, ArrowRight, MapPin, Phone, Mail, Clock } from "lucide-react";
import Image from "next/image";
import { Metadata } from "next";
import { StructuredData } from "@/components/seo/structured-data";
import { getDictionary } from "@/lib/get-dictionary";
import { Locale } from "@/lib/i18n-config";

export const metadata: Metadata = {
  title: "Kaleiwerken Antwerpen | Uw Specialist in Gevelrenovatie | Van Roey",
  description: "Op zoek naar een specialist in kaleiwerken in Antwerpen? Van Roey Kaleiwerken biedt authentieke en duurzame gevelrenovatie met hoogwaardige afwerkingen. Vraag nu uw vrijblijvende offerte aan!",
  keywords: [
    "kaleiwerken Antwerpen",
    "gevelrenovatie Antwerpen", 
    "kalei Antwerpen",
    "gevels kaleien Antwerpen",
    "specialist kalei Antwerpen",
    "kaleiwerken",
    "gevelspecialist Antwerpen",
    "minerale verven Antwerpen",
    "gevelrenovatie",
    "kaleiwerken prijzen Antwerpen"
  ],
  openGraph: {
    title: "Kaleiwerken Antwerpen | Uw Specialist in Gevelrenovatie",
    description: "Van Roey Kaleiwerken: dé expert voor kaleiwerken en gevelrenovatie in Antwerpen. Ervaar vakmanschap en duurzaamheid voor uw woning.",
    images: [
      {
        url: "https://sjfosmcpbekkokmedwil.supabase.co/storage/v1/object/public/hero/hero.jpeg",
        width: 1200,
        height: 630,
        alt: "Kaleiwerken Antwerpen - Vakmanschap in gevelrenovatie",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kaleiwerken Antwerpen | Specialist Gevelrenovatie",
    description: "10 jaar ervaring in authentieke kaleiwerken. Vrijblijvende offerte binnen 48u.",
    images: ["https://sjfosmcpbekkokmedwil.supabase.co/storage/v1/object/public/hero/hero.jpeg"],
  },
  alternates: {
    canonical: "https://vanroey-kalei.be/kaleiwerken-antwerpen",
  },
};

export default async function KaleiwerkenAntwerpenPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale) as any;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Kaleiwerken",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Van Roey Kaleiwerken",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Antwerpen",
        "addressCountry": "BE"
      }
    },
    "areaServed": {
      "@type": "City",
      "name": "Antwerpen"
    },
    "description": "Specialist in kaleiwerken en gevelrenovatie in Antwerpen met 10 jaar ervaring",
    "offers": {
      "@type": "Offer",
      "priceRange": "$$",
      "availability": "https://schema.org/InStock"
    }
  };

  const serviceAreas = [
    "Antwerpen Centrum", "Berchem", "Borgerhout", "Deurne", "Ekeren", 
    "Hoboken", "Merksem", "Wilrijk", "Schoten", "Brasschaat", "Schilde", 
    "Wommelgem", "Ranst", "Lier", "Kontich", "Hove"
  ];

  const services = [
    {
      title: "Gevel Kaleiwerken",
      description: "Authentieke kalei afwerking voor buitengevels met natuurlijke minerale pigmenten",
      features: ["Weerbestendig", "Ademend", "Duurzaam", "Onderhoudsvriendelijk"]
    },
    {
      title: "Binnen Kaleiwerken", 
      description: "Sfeervolle kalei afwerking voor binnenmuren met unieke textuur",
      features: ["Natuurlijke uitstraling", "Vochtabsorberend", "Milieuvriendelijk", "Hypoallergeen"]
    },
    {
      title: "Gevelrenovatie",
      description: "Complete gevelrenovatie met kalei afwerking voor een frisse look",
      features: ["Grondige voorbereiding", "Vakkundige uitvoering", "Lange levensduur", "Waardevaste investering"]
    }
  ];

  return (
    <>
      <StructuredData type="service" data={structuredData} />
      
      <main className="min-h-screen bg-brand-stone text-brand-dark font-sans selection:bg-brand-bronze/30">
        <Header dict={dict} />
        
        {/* Hero Section with Local Focus */}
        <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image 
              src="https://sjfosmcpbekkokmedwil.supabase.co/storage/v1/object/public/hero/hero.jpeg" 
              alt="Kaleiwerken Antwerpen" 
              fill 
              className="object-cover" 
              priority
              unoptimized
            />
            <div className="absolute inset-0 bg-black/40 z-10" />
          </div>

          <div className="relative z-20 container mx-auto px-6 md:px-12 text-center text-white">
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl mb-6 leading-tight">
              Kaleiwerken in <span className="italic text-brand-bronze">Antwerpen</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto font-light">
              Uw specialist in authentieke kaleiwerken en gevelrenovatie in heel Antwerpen en omgeving
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/${locale}/offerte`} className="bg-brand-bronze text-white px-8 py-4 uppercase text-sm tracking-widest hover:bg-white hover:text-brand-dark transition-all duration-500">
                Vraag Offerte Aan
              </Link>
              <Link href={`tel:+32470123456`} className="border border-white text-white px-8 py-4 uppercase text-sm tracking-widest hover:bg-white hover:text-brand-dark transition-all duration-500">
                Bel Nu: +32 470 12 34 56
              </Link>
            </div>
          </div>
        </section>

        {/* Service Areas */}
        <section className="py-16 bg-brand-white">
          <div className="container mx-auto px-6 md:px-12">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl mb-4">Wij Werken in heel Antwerpen</h2>
              <p className="text-brand-dark/60 max-w-2xl mx-auto">
                Van het centrum van Antwerpen tot in de randgemeenten - wij staan voor u klaar
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {serviceAreas.map((area) => (
                <div key={area} className="text-center p-4 border border-brand-dark/10 hover:border-brand-bronze transition-colors">
                  <MapPin className="w-5 h-5 text-brand-bronze mx-auto mb-2" />
                  <span className="text-sm font-medium">{area}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-24 bg-brand-stone">
          <div className="container mx-auto px-6 md:px-12">
            <div className="text-center mb-16">
              <span className="uppercase text-[10px] tracking-[0.4em] text-brand-bronze font-semibold mb-4 block">Onze Diensten</span>
              <h2 className="font-serif text-4xl md:text-5xl mb-6">Specialist in Kaleiwerken</h2>
              <p className="text-xl text-brand-dark/60 max-w-3xl mx-auto font-light">
                Al 10 jaar uw betrouwbare partner voor hoogwaardige kaleiwerken in Antwerpen
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
              {services.map((service, index) => (
                <div key={index} className="bg-white p-8 border border-brand-dark/5">
                  <h3 className="font-serif text-2xl mb-4">{service.title}</h3>
                  <p className="text-brand-dark/60 mb-6 font-light">{service.description}</p>
                  <ul className="space-y-3">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3">
                        <Check className="w-4 h-4 text-brand-bronze" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-24 bg-brand-dark text-brand-stone">
          <div className="container mx-auto px-6 md:px-12">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="uppercase text-[10px] tracking-[0.4em] text-brand-bronze font-semibold mb-6 block">Waarom Kiezen voor Van Roey?</span>
                <h2 className="font-serif text-4xl md:text-5xl mb-8 leading-tight">
                  Uw Lokale Specialist in <span className="italic text-brand-bronze">Kaleiwerken</span>
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-brand-bronze/20 flex items-center justify-center shrink-0">
                      <span className="text-brand-bronze font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="font-serif text-xl mb-2">Lokale Expertise</h4>
                      <p className="text-brand-stone/60">Wij kennen Antwerpen en haar unieke architectuur. Onze ervaring met lokale gebouwen en weersomstandigheden garandeert het beste resultaat.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-brand-bronze/20 flex items-center justify-center shrink-0">
                      <span className="text-brand-bronze font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="font-serif text-xl mb-2">Persoonlijke Service</h4>
                      <p className="text-brand-stone/60">Met een vast team van twee vakmensen heeft u altijd hetzelfde aanspreekpunt. Direct contact, geen tussenpersonen.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-brand-bronze/20 flex items-center justify-center shrink-0">
                      <span className="text-brand-bronze font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="font-serif text-xl mb-2">Snelle Service</h4>
                      <p className="text-brand-stone/60">Werkzaam in heel Antwerpen en omgeving. Snelle offertes en flexibele planning afgestemd op uw wensen.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative aspect-[4/5] bg-brand-stone/20">
                <Image 
                  src="https://sjfosmcpbekkokmedwil.supabase.co/storage/v1/object/public/about%20us/Kaleiwerk-buitengevel-Pulle-Vincent-Van-Roey-Schilderwerken-3.jpg"
                  alt="Kaleiwerken Antwerpen - Vakmanschap"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-24 bg-brand-white">
          <div className="container mx-auto px-6 md:px-12">
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl md:text-5xl mb-6">Klaar voor Uw Project in Antwerpen?</h2>
              <p className="text-xl text-brand-dark/60 max-w-2xl mx-auto font-light">
                Neem contact op voor een vrijblijvende offerte of advies op maat
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center p-6 border border-brand-dark/10">
                <Phone className="w-8 h-8 text-brand-bronze mx-auto mb-4" />
                <h4 className="font-serif text-lg mb-2">Telefoon</h4>
                <a href="tel:+32470123456" className="text-brand-dark hover:text-brand-bronze transition-colors">
                  +32 470 12 34 56
                </a>
              </div>
              <div className="text-center p-6 border border-brand-dark/10">
                <Mail className="w-8 h-8 text-brand-bronze mx-auto mb-4" />
                <h4 className="font-serif text-lg mb-2">Email</h4>
                <a href="mailto:info@vanroey-kalei.be" className="text-brand-dark hover:text-brand-bronze transition-colors">
                  info@vanroey-kalei.be
                </a>
              </div>
              <div className="text-center p-6 border border-brand-dark/10">
                <Clock className="w-8 h-8 text-brand-bronze mx-auto mb-4" />
                <h4 className="font-serif text-lg mb-2">Bereikbaar</h4>
                <p className="text-brand-dark/60">Ma - Vr: 08:00 - 18:00</p>
              </div>
            </div>

            <div className="text-center mt-12">
              <Link href={`/${locale}/offerte`} className="inline-flex items-center gap-3 bg-brand-dark text-white px-12 py-6 uppercase text-sm tracking-widest hover:bg-brand-bronze transition-all duration-500 group">
                Vraag Direct Offerte Aan
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ Section for SEO */}
        <section className="py-24 bg-brand-stone">
          <div className="container mx-auto px-6 md:px-12">
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl md:text-5xl mb-6">Veelgestelde Vragen</h2>
              <p className="text-xl text-brand-dark/60 max-w-2xl mx-auto font-light">
                Antwoorden op de meest gestelde vragen over kaleiwerken in Antwerpen
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
              <div className="bg-white p-8 border border-brand-dark/5">
                <h3 className="font-serif text-xl mb-4">Wat kosten kaleiwerken in Antwerpen?</h3>
                <p className="text-brand-dark/60 leading-relaxed">
                  De kosten van kaleiwerken in Antwerpen variëren tussen de €45-€75 per m², afhankelijk van de grootte van het project, 
                  de staat van de ondergrond en de gekozen afwerking. Wij bieden altijd een gratis offerte op maat aan.
                </p>
              </div>
              <div className="bg-white p-8 border border-brand-dark/5">
                <h3 className="font-serif text-xl mb-4">Hoe lang gaan kaleiwerken mee?</h3>
                <p className="text-brand-dark/60 leading-relaxed">
                  Kaleiwerken gaan gemiddeld 15-20 jaar mee bij goede onderhoud. De levensduur hangt af van de weersomstandigheden 
                  en de kwaliteit van de ondergrond. Met onze hydrofuge behandeling verlengt u de levensduur aanzienlijk.
                </p>
              </div>
              <div className="bg-white p-8 border border-brand-dark/5">
                <h3 className="font-serif text-xl mb-4">In welke Antwerpse gemeenten werken jullie?</h3>
                <p className="text-brand-dark/60 leading-relaxed">
                  Wij werken in heel Antwerpen stad en de omliggende gemeenten zoals Schoten, Brasschaat, Schilde, Wommelgem, 
                  Ranst, Lier, Kontich en Hove. Neem gerust contact op voor uw specifieke locatie.
                </p>
              </div>
            </div>
          </div>
        </section>

        <Footer dict={dict} />
      </main>
    </>
  );
}