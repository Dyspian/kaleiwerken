import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";
import { Check, ArrowRight, Paintbrush, Shield, Sun } from "lucide-react";
import Image from "next/image";
import { Metadata } from "next";
import { StructuredData } from "@/components/seo/structured-data";
import { getDictionary } from "@/lib/get-dictionary";
import { Locale } from "@/lib/i18n-config";

export const metadata: Metadata = {
  title: "Buitenschilderwerk Antwerpen | Professioneel Schilderwerk voor Uitwendige Gevels",
  description: "Professioneel buitenschilderwerk in Antwerpen. Bescherming tegen weersinvloeden met hoogwaardige verven. 10 jaar ervaring, vrijblijvende offerte binnen 48u.",
  keywords: [
    "buitenschilderwerk Antwerpen",
    "schilderwerken buiten Antwerpen",
    "gevel schilderen Antwerpen",
    "buiten schilderwerken",
    "weerbestendig schilderwerk",
    "gevel bescherming Antwerpen",
    "schilder specialist Antwerpen",
    "buitenverf Antwerpen"
  ],
  openGraph: {
    title: "Buitenschilderwerk Antwerpen | Professioneel Schilderwerk",
    description: "Professioneel buitenschilderwerk in Antwerpen met hoogwaardige bescherming tegen weersinvloeden.",
    images: ["https://sjfosmcpbekkokmedwil.supabase.co/storage/v1/object/public/hero/hero.jpeg"],
  },
};

export default async function BuitenschilderwerkAntwerpenPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale) as any;

  const paintSystems = [
    {
      title: "Minerale Verfsystemen",
      description: "Authentieke minerale verven voor een natuurlijke en ademende afwerking",
      icon: Paintbrush,
      features: ["100% natuurlijk", "Ademend", "Duurzaam", "UV-bestendig"]
    },
    {
      title: "Acrylaat Verfsystemen",
      description: "Moderne acrylaatverven voor optimale bescherming en kleurvastheid",
      icon: Shield,
      features: ["Weerbestendig", "Kleurvast", "Flexibel", "Onderhoudsvriendelijk"]
    },
    {
      title: "Siliconen Verfsystemen",
      description: "Hoogwaardige siliconenverven voor ultieme bescherming tegen vocht",
      icon: Sun,
      features: ["Waterafstotend", "Zelfreinigend", "Krasvast", "Lange levensduur"]
    }
  ];

  const steps = [
    "Grondige inspectie van de geveltoestand",
    "Reiniging en voorbereiding van het oppervlak",
    "Reparatie van beschadigingen en voegen",
    "Aanbrengen van primer en beschermingslaag",
    "Vakkundig schilderen in meerdere lagen",
    "Kwaliteitscontrole en oplevering"
  ];

  return (
    <>
      <StructuredData type="service" data={{
        services: paintSystems.map(system => ({
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": system.title,
            "description": system.description
          }
        }))
      }} />

      <main className="min-h-screen bg-brand-stone text-brand-dark font-sans selection:bg-brand-bronze/30">
        <Header dict={dict} />
        
        {/* Hero Section */}
        <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image 
              src="https://sjfosmcpbekkokmedwil.supabase.co/storage/v1/object/public/hero/hero.jpeg" 
              alt="Buitenschilderwerk Antwerpen" 
              fill 
              className="object-cover" 
              priority
              unoptimized
            />
            <div className="absolute inset-0 bg-black/40 z-10" />
          </div>

          <div className="relative z-20 container mx-auto px-6 md:px-12 text-center text-white">
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl mb-6 leading-tight">
              Buitenschilderwerk in <span className="italic text-brand-bronze">Antwerpen</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto font-light">
              Professioneel buitenschilderwerk dat uw gevel beschermt tegen weersinvloeden en een frisse uitstraling geeft
            </p>
            <Link href={`/${locale}/offerte`} className="bg-brand-bronze text-white px-8 py-4 uppercase text-sm tracking-widest hover:bg-white hover:text-brand-dark transition-all duration-500">
              Vraag Gratis Offerte Aan
            </Link>
          </div>
        </section>

        {/* Paint Systems Section */}
        <section className="py-24 bg-brand-white">
          <div className="container mx-auto px-6 md:px-12">
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl md:text-5xl mb-6">Onze Verfsystemen</h2>
              <p className="text-xl text-brand-dark/60 max-w-3xl mx-auto font-light">
                Kies het perfecte verfsysteem voor uw gevel en geniet van jarenlange bescherming
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
              {paintSystems.map((system, index) => {
                const Icon = system.icon;
                return (
                  <div key={index} className="bg-brand-stone p-8 border border-brand-dark/5">
                    <div className="w-16 h-16 bg-brand-bronze/10 flex items-center justify-center mb-6">
                      <Icon className="w-8 h-8 text-brand-bronze" />
                    </div>
                    <h3 className="font-serif text-2xl mb-4">{system.title}</h3>
                    <p className="text-brand-dark/60 mb-6 font-light">{system.description}</p>
                    <ul className="space-y-3">
                      {system.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-3">
                          <Check className="w-4 h-4 text-brand-bronze" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-24 bg-brand-stone">
          <div className="container mx-auto px-6 md:px-12">
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl md:text-5xl mb-6">Ons Schilderproces</h2>
              <p className="text-xl text-brand-dark/60 max-w-3xl mx-auto font-light">
                Van inspectie tot oplevering: zo garanderen wij perfect resultaat
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="space-y-8">
                {steps.map((step, index) => (
                  <div key={index} className="flex items-start gap-6">
                    <div className="w-12 h-12 bg-brand-bronze text-white flex items-center justify-center font-serif text-lg shrink-0">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-serif text-xl mb-2">{step}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-24 bg-brand-dark text-brand-stone">
          <div className="container mx-auto px-6 md:px-12">
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl md:text-5xl mb-6">Waarom Professioneel Buitenschilderwerk?</h2>
              <p className="text-xl text-brand-stone/60 max-w-3xl mx-auto font-light">
                Investeer in kwaliteit en bespaar op lange termijn
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="font-serif text-2xl mb-6">Bescherming & Duurzaamheid</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-brand-bronze mt-0.5 shrink-0" />
                    <span>Bescherming tegen regen, wind en UV-straling</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-brand-bronze mt-0.5 shrink-0" />
                    <span>Voorkomt vochtproblemen en schimmelvorming</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-brand-bronze mt-0.5 shrink-0" />
                    <span>Verlengt de levensduur van uw gevel aanzienlijk</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-serif text-2xl mb-6">Esthetiek & Waarde</h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-brand-bronze mt-0.5 shrink-0" />
                    <span>Verhoogt de waarde van uw woning</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-brand-bronze mt-0.5 shrink-0" />
                    <span>Frisse, nieuwe uitstraling voor uw gevel</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-brand-bronze mt-0.5 shrink-0" />
                    <span>Breed scala aan kleuren en afwerkingen</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-brand-white">
          <div className="container mx-auto px-6 md:px-12 text-center">
            <h2 className="font-serif text-4xl md:text-5xl mb-6">
              Klaar voor Nieuw Buitenschilderwerk in Antwerpen?
            </h2>
            <p className="text-xl text-brand-dark/60 max-w-2xl mx-auto mb-12 font-light">
              Plan vandaag nog uw gratis inspectie en ontvang een vrijblijvende offerte
            </p>
            <Link href={`/${locale}/offerte`} className="inline-flex items-center gap-3 bg-brand-dark text-white px-12 py-6 uppercase text-sm tracking-widest hover:bg-brand-bronze transition-all duration-500 group">
              Plan Gratis Inspectie
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>

        <Footer dict={dict} />
      </main>
    </>
  );
}