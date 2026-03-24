import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";
import { Check, ArrowRight, Palette, Leaf, Shield } from "lucide-react";
import Image from "next/image";
import { Metadata } from "next";
import { StructuredData } from "@/components/seo/structured-data";
import { getDictionary } from "@/lib/get-dictionary";
import { Locale } from "@/lib/i18n-config";

export const metadata: Metadata = {
  title: "Minerale Verven Antwerpen | Natuurlijke Gevelverven & Kaleiwerken",
  description: "Specialist in minerale verven en natuurlijke gevelverven in Antwerpen. Authentieke kaleiwerken met minerale pigmenten. Vrijblijvend advies en offerte.",
  keywords: [
    "minerale verven Antwerpen",
    "natuurlijke gevelverven Antwerpen",
    "minerale pigmenten Antwerpen",
    "kalei verven Antwerpen",
    "geverfde gevels Antwerpen",
    "authentieke verven Antwerpen",
    "milieuverende verven Antwerpen",
    "ademende verven Antwerpen"
  ],
  openGraph: {
    title: "Minerale Verven Antwerpen | Natuurlijke Gevelverven",
    description: "Specialist in minerale verven en kaleiwerken in Antwerpen. Natuurlijke pigmenten voor authentieke gevels.",
    images: ["https://sjfosmcpbekkokmedwil.supabase.co/storage/v1/object/public/hero/hero.jpeg"],
  },
};

export default async function MineraleVerwenAntwerpenPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale) as any;

  const benefits = [
    {
      icon: Leaf,
      title: "100% Natuurlijk",
      description: "Onze minerale verven zijn volledig op basis van natuurlijke grondstoffen, vrij van schadelijke chemicaliën"
    },
    {
      icon: Shield,
      title: "Duurzame Bescherming",
      description: "Biedt uitstekende bescherming tegen weersinvloeden terwijl de gevel kan blijven ademen"
    },
    {
      icon: Palette,
      title: "Authentieke Kleuren",
      description: "Unieke kleurdiepte die alleen verkrijgbaar is met minerale pigmenten"
    }
  ];

  const colorPalette = [
    { name: "Oker Geel", color: "#D4A017", description: "Warme, zonnige tint" },
    { name: "Terra Cotta", color: "#C65D07", description: "Aardse, rustieke kleur" },
    { name: "Sienna Bruin", color: "#A0522D", description: "Natuurlijke aardtint" },
    { name: "Olijf Groen", color: "#6B8E23", description: "Natuurlijke groentint" },
    { name: "Slate Grijs", color: "#708090", description: "Tijdloze neutrale tint" },
    { name: "Kalk Wit", color: "#F5F5DC", description: "Zachte, warme wit tint" }
  ];

  return (
    <>
      <StructuredData type="service" data={{
        services: [{
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Minerale Verven",
            "description": "Natuurlijke minerale verven voor authentieke gevelafwerking"
          }
        }]
      }} />

      <main className="min-h-screen bg-brand-stone text-brand-dark font-sans selection:bg-brand-bronze/30">
        <Header dict={dict} />
        
        {/* Hero Section */}
        <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image 
              src="https://sjfosmcpbekkokmedwil.supabase.co/storage/v1/object/public/hero/hero.jpeg" 
              alt="Minerale verven Antwerpen" 
              fill 
              className="object-cover" 
              priority
              unoptimized
            />
            <div className="absolute inset-0 bg-black/40 z-10" />
          </div>

          <div className="relative z-20 container mx-auto px-6 md:px-12 text-center text-white">
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl mb-6 leading-tight">
              Minerale Verven in <span className="italic text-brand-bronze">Antwerpen</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto font-light">
              Natuurlijke minerale verven voor authentieke en duurzame gevelafwerking
            </p>
            <Link href={`/${locale}/offerte`} className="bg-brand-bronze text-white px-8 py-4 uppercase text-sm tracking-widest hover:bg-white hover:text-brand-dark transition-all duration-500">
              Vraag Kleuradvies Aan
            </Link>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-24 bg-brand-white">
          <div className="container mx-auto px-6 md:px-12">
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl md:text-5xl mb-6">Voordelen van Minerale Verven</h2>
              <p className="text-xl text-brand-dark/60 max-w-3xl mx-auto font-light">
                Ontdek waarom minerale verven de beste keuze zijn voor uw gevel
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="w-20 h-20 bg-brand-bronze/10 flex items-center justify-center mx-auto mb-6">
                      <Icon className="w-10 h-10 text-brand-bronze" />
                    </div>
                    <h3 className="font-serif text-2xl mb-4">{benefit.title}</h3>
                    <p className="text-brand-dark/60 font-light">{benefit.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Color Palette Section */}
        <section className="py-24 bg-brand-stone">
          <div className="container mx-auto px-6 md:px-12">
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl md:text-5xl mb-6">Onze Minerale Kleuren</h2>
              <p className="text-xl text-brand-dark/60 max-w-3xl mx-auto font-light">
                Natuurlijke kleuren die perfect passen bij de architectuur van Antwerpen
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {colorPalette.map((color, index) => (
                <div key={index} className="bg-white p-6 border border-brand-dark/5">
                  <div 
                    className="w-full h-32 mb-4 border border-brand-dark/10"
                    style={{ backgroundColor: color.color }}
                  />
                  <h3 className="font-serif text-xl mb-2">{color.name}</h3>
                  <p className="text-brand-dark/60 text-sm">{color.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-24 bg-brand-white">
          <div className="container mx-auto px-6 md:px-12">
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl md:text-5xl mb-6">Het Proces</h2>
              <p className="text-xl text-brand-dark/60 max-w-3xl mx-auto font-light">
                Van kleurkeuze tot oplevering: zo werken wij
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-bronze text-white flex items-center justify-center font-serif text-2xl mb-6 mx-auto">
                  1
                </div>
                <h3 className="font-serif text-xl mb-4">Kleuradvies</h3>
                <p className="text-brand-dark/60 text-sm leading-relaxed">Samen kiezen we de perfecte minerale kleur die past bij uw woning en omgeving</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-bronze text-white flex items-center justify-center font-serif text-2xl mb-6 mx-auto">
                  2
                </div>
                <h3 className="font-serif text-xl mb-4">Voorbereiding</h3>
                <p className="text-brand-dark/60 text-sm leading-relaxed">Grondige reiniging en voorbereiding van de ondergrond voor optimale hechting</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-bronze text-white flex items-center justify-center font-serif text-2xl mb-6 mx-auto">
                  3
                </div>
                <h3 className="font-serif text-xl mb-4">Aanbrengen</h3>
                <p className="text-brand-dark/60 text-sm leading-relaxed">Vakkundig aanbrengen van de minerale verf met traditionele technieken</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-bronze text-white flex items-center justify-center font-serif text-2xl mb-6 mx-auto">
                  4
                </div>
                <h3 className="font-serif text-xl mb-4">Oplevering</h3>
                <p className="text-brand-dark/60 text-sm leading-relaxed">Perfect resultaat met onderhoudsadvies voor jarenlang plezier</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-brand-dark text-brand-stone">
          <div className="container mx-auto px-6 md:px-12 text-center">
            <h2 className="font-serif text-4xl md:text-5xl mb-6">
              Ontdek de Mogelijkheden van Minerale Verven
            </h2>
            <p className="text-xl text-brand-stone/60 max-w-2xl mx-auto mb-12 font-light">
              Laat u adviseren over de perfecte minerale kleur voor uw gevel in Antwerpen
            </p>
            <Link href={`/${locale}/offerte`} className="inline-flex items-center gap-3 bg-brand-bronze text-white px-12 py-6 uppercase text-sm tracking-widest hover:bg-white hover:text-brand-dark transition-all duration-500 group">
              Vraag Kleuradvies Aan
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </section>

        <Footer dict={dict} />
      </main>
    </>
  );
}