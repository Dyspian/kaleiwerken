import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import Image from "next/image";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Kaleiwerken Antwerpen | Uw Specialist in Gevelrenovatie",
  description: "Op zoek naar een specialist in kaleiwerken in Antwerpen? Van Roey Kaleiwerken biedt authentieke en duurzame gevelrenovatie met hoogwaardige afwerkingen. Vraag nu uw vrijblijvende offerte aan!",
  keywords: ["kaleiwerken Antwerpen", "gevelrenovatie Antwerpen", "kalei Antwerpen", "gevels kaleien Antwerpen", "specialist kalei Antwerpen"],
  openGraph: {
    title: "Kaleiwerken Antwerpen | Uw Specialist in Gevelrenovatie",
    description: "Van Roey Kaleiwerken: dé expert voor kaleiwerken en gevelrenovatie in Antwerpen. Ervaar vakmanschap en duurzaamheid voor uw woning.",
    images: [
      {
        url: "https://sjfosmcpbekkokmedwil.supabase.co/storage/v1/object/public/hero/hero.jpeg", // Use a relevant image
        width: 1200,
        height: 630,
        alt: "Kaleiwerken Antwerpen",
      },
    ],
  },
};

export default function KaleiwerkenAntwerpenPage() {
  return (
    <main className="min-h-screen bg-brand-stone text-brand-dark font-sans selection:bg-brand-bronze/30">
      <Header />
      
      <section className="pt-40 pb-24 px-6 md:px-12 container mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
            <div>
                <span className="uppercase text-[10px] tracking-[0.4em] text-brand-bronze font-semibold mb-6 block">Onze Expertise</span>
                <h1 className="font-serif text-5xl md:text-7xl leading-[0.9] mb-8">
                    Kaleiwerken <br/><span className="italic text-brand-bronze">in Antwerpen.</span>
                </h1>
                <p className="text-xl text-brand-dark/70 font-light leading-relaxed mb-8">
                    Van Roey Kaleiwerken is uw vertrouwde partner voor authentieke kaleiwerken en duurzame gevelrenovatie in Antwerpen en de omliggende gemeenten. Wij combineren traditioneel vakmanschap met moderne technieken voor een tijdloos resultaat.
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                    {[
                        "Lokale expertise in Antwerpen",
                        "Duurzame materialen",
                        "Persoonlijke aanpak",
                        "Vrijblijvende offerte"
                    ].map((f, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full border border-brand-bronze flex items-center justify-center">
                                <Check className="w-3 h-3 text-brand-bronze" strokeWidth={3} />
                            </div>
                            <span className="text-xs uppercase tracking-widest font-medium">{f}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="relative aspect-[4/5] bg-brand-dark/5 overflow-hidden">
                <Image 
                    src="https://sjfosmcpbekkokmedwil.supabase.co/storage/v1/object/public/hero/hero.jpeg" // Use a relevant image
                    alt="Kaleiwerken Antwerpen" 
                    fill 
                    className="object-cover"
                    // unoptimized // Removed unoptimized prop
                />
            </div>
        </div>

        <div className="grid md:grid-cols-3 gap-12 border-t border-brand-dark/10 pt-24">
            <div>
                <h3 className="font-serif text-3xl mb-6">Waarom Kalei?</h3>
                <p className="text-brand-dark/60 font-light leading-relaxed">
                    Kalei is een eeuwenoude techniek die uw gevel niet alleen een prachtige, matte uitstraling geeft, maar ook beschermt tegen weersinvloeden. Het laat de muur ademen en voorkomt vochtproblemen.
                </p>
            </div>
            <div>
                <h3 className="font-serif text-3xl mb-6">Onze Werkwijze</h3>
                <p className="text-brand-dark/60 font-light leading-relaxed">
                    Van een gedetailleerde opmeting tot de zorgvuldige uitvoering en oplevering: wij begeleiden u door het hele proces. Wij werken met eigen, minerale pigmenten voor een unieke kleur.
                </p>
            </div>
            <div>
                <h3 className="font-serif text-3xl mb-6">Duurzaam Resultaat</h3>
                <p className="text-brand-dark/60 font-light leading-relaxed">
                    Een gekaleide gevel van Van Roey staat garant voor jarenlang plezier. Optioneel voorzien we een hydrofuge afwerking voor extra bescherming tegen vuil en water.
                </p>
            </div>
        </div>

        <div className="text-center mt-24">
            <Button asChild className="bg-brand-dark text-white rounded-none px-10 py-7 uppercase text-[10px] tracking-widest hover:bg-brand-bronze hover:text-white transition-all duration-500 group">
                <Link href="/offerte">
                    Vraag uw offerte aan <ArrowRight className="ml-2 w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </Link>
            </Button>
        </div>
      </section>

      <Footer />
    </main>
  );
}