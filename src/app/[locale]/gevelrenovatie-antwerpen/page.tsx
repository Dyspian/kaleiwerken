import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";
import { Check, ArrowRight, Shield, Clock, Award } from "lucide-react";
import Image from "next/image";
import { Metadata } from "next";
import { StructuredData } from "@/components/seo/structured-data";
import { getDictionary } from "@/lib/get-dictionary";
import { Locale } from "@/lib/i18n-config";

export const metadata: Metadata = {
  title: "Gevelrenovatie Antwerpen | Specialist in Gevelherstel & Kaleiwerken",
  description: "Specialist in gevelrenovatie en gevelherstel in Antwerpen. Van kaleiwerken tot complete gevelrenovatie. 10 jaar ervaring, vrijblijvende offerte binnen 48u.",
  keywords: [
    "gevelrenovatie Antwerpen",
    "gevelherstel Antwerpen",
    "gevel renoveren Antwerpen",
    "gevelspecialist Antwerpen",
    "gevelwerken Antwerpen",
    "kaleiwerken gevel",
    "gevel isoleren Antwerpen",
    "gevel reinigen Antwerpen"
  ],
  openGraph: {
    title: "Gevelrenovatie Antwerpen | Specialist in Gevelherstel",
    description: "Complete gevelrenovatie in Antwerpen met kalei afwerking. Vakmanschap gegarandeerd.",
    images: ["https://sjfosmcpbekkokmedwil.supabase.co/storage/v1/object/public/hero/hero.jpeg"],
  },
};

export default async function GevelrenovatieAntwerpenPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale) as any;

  const renovationServices = [
    {
      title: "Complete Gevelrenovatie",
      description: "Van inspectie tot oplevering: wij verzorgen uw volledige gevelrenovatie met de beste materialen en technieken.",
      icon: Shield,
      features: ["Grondige inspectie", "Vakkundige uitvoering", "Hoogwaardige materialen", "Garantie op werk"]
    },
    {
      title: "Kaleiwerken & Afwerking",
      description: "Authentieke kalei afwerking voor een tijdloze en duurzame gevelbescherming.",
      icon: Award,
      features: ["Minerale pigmenten", "Ademende bescherming", "Weerbestendig", "Onderhoudsvriendelijk"]
    },
    {
      title: "Gevelherstel & Reparatie",
      description: "Targeted herstel van beschadigde gevels met focus op duurzaamheid en esthetiek.",
      icon: Clock,
      features: ["Snelle interventie", "Duurzame oplossingen", "Kleurmatching", "Preventief advies"]
    }
  ];

  const processSteps = [
    {
      step: 1,
      title: "Gratis Inspectie",
      description: "We komen ter plaatse voor een grondige analyse van uw gevel en bespreken uw wensen."
    },
    {
      step: 2,
      title: "Offerte op Maat",
      description: "U ontvangt binnen 48 uur een gedetailleerde offerte met transparante prijzen."
    },
    {
      step: 3,
      title: "Vakkundige Uitvoering",
      description: "Ons ervaren team voert de werken uit met oog voor detail en kwaliteit."
    },
    {
      step: 4,
      title: "Oplevering & Garantie",
      description: "We leveren perfect werk af met garantie en onderhoudsadvies."
    }
  ];

  return (
    <>
      <StructuredData type="service" data={{
        services: renovationServices.map(service => ({
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": service.title,
            "description": service.description
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
              alt="Gevelrenovatie Antwerpen" 
              fill 
              className="object-cover" 
              priority
              unoptimized
            />
            <div className="absolute inset-0 bg-black/40 z-10" />
          </div>

          <div className="relative z-20 container mx-auto px-6 md:px-12 text-center text-white">
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl mb-6 leading-tight">
              Gevelrenovatie in <span className="italic text-brand-bronze">Antwerpen</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto font-light">
              Specialist in complete gevelrenovatie met kalei afwerking. Van inspectie tot oplevering, alles onder één dak.
            </p>
            <Link href={`/${locale}/offerte`} className="bg-brand-bronze text-white px-8 py-4 uppercase text-sm tracking-widest hover:bg-white hover:text-brand-dark transition-all duration-500">
              Vraag Gratis Offerte Aan
            </Link>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-24 bg-brand-white">
          <div className="container mx-auto px-6 md:px-12">
            <div className="text-center mb-16">
              <span className="uppercase text-[10px] tracking-[0.4em] text-brand-bronze font-semibold mb-4 block">Onze Diensten</span>
              <h2 className="font-serif text-4xl md:text-5xl mb-6">Complete Gevelrenovatie</h2>
              <p className="text-xl text-brand-dark/60 max-w-3xl mx-auto font-light">
                Van inspectie tot oplevering: wij verzorgen uw volledige gevelrenovatie met de beste materialen
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
              {renovationServices.map((service, index) => {
                const Icon = service.icon;
                return (
                  <div key={index} className="bg-brand-stone p-8 border border-brand-dark/5">
                    <div className="w-16 h-16 bg-brand-bronze/10 flex items-center justify-center mb-6">
                      <Icon className="w-8 h-8 text-brand-bronze" />
                    </div>
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
                );
              })}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-24 bg-brand-stone">
          <div className="container mx-auto px-6 md:px-12">
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl md:text-5xl mb-6">Ons Renovatieproces</h2>
              <p className="text-xl text-brand-dark/60 max-w-3xl mx-auto font-light">
                Transparant en efficiënt van begin tot eind
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              {processSteps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-brand-bronze text-white flex items-center justify-center font-serif text-2xl mb-6 mx-auto">
                    {step.step}
                  </div>
                  <h3 className="font-serif text-xl mb-4">{step.title}</h3>
                  <p className="text-brand-dark/60 text-sm leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-brand-dark text-brand-stone">
          <div className="container mx-auto px-6 md:px-12 text-center">
            <h2 className="font-serif text-4xl md:text-5xl mb-6">
              Klaar voor Uw Gevelrenovatie in Antwerpen?
            </h2>
            <p className="text-xl text-brand-stone/60 max-w-2xl mx-auto mb-12 font-light">
              Neem vandaag nog contact op voor een gratis inspectie en offerte. Wij helpen u graag verder.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/${locale}/offerte`} className="bg-brand-bronze text-white px-12 py-6 uppercase text-sm tracking-widest hover:bg-white hover:text-brand-dark transition-all duration-500 group">
                Vraag Gratis Offerte Aan
                <ArrowRight className="w-4 h-4 ml-2 inline group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href={`tel:+32470123456`} className="border border-white text-white px-12 py-6 uppercase text-sm tracking-widest hover:bg-white hover:text-brand-dark transition-all duration-500">
                Bel: +32 470 12 34 56
              </Link>
            </div>
          </div>
        </section>

        <Footer dict={dict} />
      </main>
    </>
  );
}