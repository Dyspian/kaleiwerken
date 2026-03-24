import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";
import { Check, ArrowRight, Award, Users, Clock } from "lucide-react";
import Image from "next/image";
import { Metadata } from "next";
import { StructuredData } from "@/components/seo/structured-data";
import { getDictionary } from "@/lib/get-dictionary";
import { Locale } from "@/lib/i18n-config";

export const metadata: Metadata = {
  title: "Gevelspecialist Antwerpen | Expert in Gevelrenovatie & Kaleiwerken | Van Roey",
  description: "Uw gevelspecialist in Antwerpen voor complete gevelrenovatie, kaleiwerken en gevelherstel. 10 jaar ervaring, gecertificeerde vakmensen, vrijblijvende offerte.",
  keywords: [
    "gevelspecialist Antwerpen",
    "gevel expert Antwerpen",
    "gevelrenovatie specialist Antwerpen",
    "gevelherstel specialist Antwerpen",
    "kaleiwerken specialist Antwerpen",
    "gevel inspectie Antwerpen",
    "gevel advies Antwerpen",
    "gevel professional Antwerpen"
  ],
  openGraph: {
    title: "Gevelspecialist Antwerpen | Expert in Gevelrenovatie",
    description: "Uw specialist in Antwerpen voor alle gevelwerken. Van inspectie tot oplevering, alles onder één dak.",
    images: ["https://sjfosmcpbekkokmedwil.supabase.co/storage/v1/object/public/hero/hero.jpeg"],
  },
};

export default async function GevelspecialistAntwerpenPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale) as any;

  const expertiseAreas = [
    {
      title: "Gevelinspectie & Advies",
      description: "Grondige analyse van uw geveltoestand met gedetailleerd advies",
      icon: Award,
      features: ["Technische inspectie", "Schade-analyse", "Onderhoudsadvies", "Kostenraming"]
    },
    {
      title: "Gevelrenovatie & Herstel",
      description: "Complete renovatie van uw gevel met de beste materialen en technieken",
      icon: Users,
      features: ["Volledige renovatie", "Targeted herstel", "Materiaaladvies", "Kwaliteitsgarantie"]
    },
    {
      title: "Kaleiwerken & Afwerking",
      description: "Specialist in authentieke kaleiwerken voor binnen- en buitengevels",
      icon: Clock,
      features: ["Minerale verven", "Traditionele technieken", "Kleuradvies", "Perfecte afwerking"]
    }
  ];

  const certifications = [
    "Erkend vakman met 10+ jaar ervaring",
    "Gecertificeerd in kaleiwerken en geveltechnieken",
    "Lid van beroepsvereniging voor gevelspecialisten",
    "Garantie op alle uitgevoerde werken",
    "Volledig verzekerd voor alle werkzaamheden"
  ];

  const testimonials = [
    {
      name: "Marc V.",
      location: "Antwerpen",
      text: "Van Roey heeft onze gevel compleet gerenoveerd met kalei. Het resultaat is prachtig en het hele proces verliep zeer professioneel.",
      rating: 5
    },
    {
      name: "Sarah D.",
      location: "Schoten",
      text: "Uitstekend advies en vakmanschap. Onze gevel ziet eruit als nieuw en we genieten nog dagelijks van het resultaat.",
      rating: 5
    },
    {
      name: "Peter H.",
      location: "Brasschaat",
      text: "Echte specialisten die weten waar ze over praten. De inspectie was grondig en het advies zeer waardevol.",
      rating: 5
    }
  ];

  return (
    <>
      <StructuredData type="localBusiness" data={{}} />

      <main className="min-h-screen bg-brand-stone text-brand-dark font-sans selection:bg-brand-bronze/30">
        <Header dict={dict} />
        
        {/* Hero Section */}
        <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image 
              src="https://sjfosmcpbekkokmedwil.supabase.co/storage/v1/object/public/hero/hero.jpeg" 
              alt="Gevelspecialist Antwerpen" 
              fill 
              className="object-cover" 
              priority
              unoptimized
            />
            <div className="absolute inset-0 bg-black/40 z-10" />
          </div>

          <div className="relative z-20 container mx-auto px-6 md:px-12 text-center text-white">
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl mb-6 leading-tight">
              Uw Gevelspecialist in <span className="italic text-brand-bronze">Antwerpen</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto font-light">
              Erkend specialist voor complete gevelrenovatie, kaleiwerken en gevelherstel. Gecertificeerd vakmanschap sinds 2015.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/${locale}/offerte`} className="bg-brand-bronze text-white px-8 py-4 uppercase text-sm tracking-widest hover:bg-white hover:text-brand-dark transition-all duration-500">
                Vraag Expertise Aan
              </Link>
              <Link href={`tel:+32470123456`} className="border border-white text-white px-8 py-4 uppercase text-sm tracking-widest hover:bg-white hover:text-brand-dark transition-all duration-500">
                Bel de Specialist
              </Link>
            </div>
          </div>
        </section>

        {/* Expertise Section */}
        <section className="py-24 bg-brand-white">
          <div className="container mx-auto px-6 md:px-12">
            <div className="text-center mb-16">
              <span className="uppercase text-[10px] tracking-[0.4em] text-brand-bronze font-semibold mb-4 block">Onze Expertise</span>
              <h2 className="font-serif text-4xl md:text-5xl mb-6">Gecertificeerd Gevelspecialist</h2>
              <p className="text-xl text-brand-dark/60 max-w-3xl mx-auto font-light">
                Erkend vakman met jarenlange ervaring in alle aspecten van gevelwerken
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
              {expertiseAreas.map((area, index) => {
                const Icon = area.icon;
                return (
                  <div key={index} className="bg-brand-stone p-8 border border-brand-dark/5">
                    <div className="w-16 h-16 bg-brand-bronze/10 flex items-center justify-center mb-6">
                      <Icon className="w-8 h-8 text-brand-bronze" />
                    </div>
                    <h3 className="font-serif text-2xl mb-4">{area.title}</h3>
                    <p className="text-brand-dark/60 mb-6 font-light">{area.description}</p>
                    <ul className="space-y-3">
                      {area.features.map((feature, idx) => (
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

        {/* Certifications Section */}
        <section className="py-24 bg-brand-stone">
          <div className="container mx-auto px-6 md:px-12">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="uppercase text-[10px] tracking-[0.4em] text-brand-bronze font-semibold mb-6 block">Waarom Kiezen voor een Erkend Specialist?</span>
                <h2 className="font-serif text-4xl md:text-5xl mb-8 leading-tight">
                  Gecertificeerd <span className="italic text-brand-bronze">Vakmanschap</span>
                </h2>
                <div className="space-y-4">
                  {certifications.map((cert, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-brand-bronze mt-0.5 shrink-0" />
                      <span className="text-brand-dark/80">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative aspect-[4/5] bg-brand-dark/5">
                <Image 
                  src="https://sjfosmcpbekkokmedwil.supabase.co/storage/v1/object/public/about%20us/Kaleiwerk-buitengevel-Pulle-Vincent-Van-Roey-Schilderwerken-3.jpg"
                  alt="Gecertificeerd gevelspecialist Antwerpen"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 bg-brand-white">
          <div className="container mx-auto px-6 md:px-12">
            <div className="text-center mb-16">
              <h2 className="font-serif text-4xl md:text-5xl mb-6">Wat Onze Klanten Zeggen</h2>
              <p className="text-xl text-brand-dark/60 max-w-3xl mx-auto font-light">
                Ervaringen van klanten die u voor gingen
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-brand-stone p-8 border border-brand-dark/5">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-brand-bronze">★</span>
                    ))}
                  </div>
                  <p className="text-brand-dark/70 mb-6 italic">"{testimonial.text}"</p>
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-brand-dark/50">{testimonial.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-brand-dark text-brand-stone">
          <div className="container mx-auto px-6 md:px-12 text-center">
            <h2 className="font-serif text-4xl md:text-5xl mb-6">
              Klaar voor Professioneel Geveladvies?
            </h2>
            <p className="text-xl text-brand-stone/60 max-w-2xl mx-auto mb-12 font-light">
              Neem contact op met de gevelspecialist van Antwerpen voor een vrijblijvende inspectie
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/${locale}/offerte`} className="bg-brand-bronze text-white px-12 py-6 uppercase text-sm tracking-widest hover:bg-white hover:text-brand-dark transition-all duration-500 group">
                Vraag Expertise Aan
                <ArrowRight className="w-4 h-4 ml-2 inline group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href={`tel:+32470123456`} className="border border-white text-white px-12 py-6 uppercase text-sm tracking-widest hover:bg-white hover:text-brand-dark transition-all duration-500">
                Bel de Specialist
              </Link>
            </div>
          </div>
        </section>

        <Footer dict={dict} />
      </main>
    </>
  );
}