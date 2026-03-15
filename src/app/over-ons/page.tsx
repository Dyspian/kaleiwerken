import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { siteContent } from "@/content/site";
import { Check } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-brand-stone text-brand-dark font-sans selection:bg-brand-bronze/30">
      <Header />
      
      <section className="pt-40 pb-24 px-6 md:px-12 container mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
            <div>
                <span className="uppercase text-[10px] tracking-[0.4em] text-brand-bronze font-semibold mb-6 block">Onze Historiek</span>
                <h1 className="font-serif text-5xl md:text-7xl leading-[0.9] mb-8">
                    10 jaar <br/><span className="italic text-brand-bronze">Vakmanschap.</span>
                </h1>
                <p className="text-xl text-brand-dark/70 font-light leading-relaxed mb-8">
                    {siteContent.about.description}
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                    {siteContent.about.features.map((f, i) => (
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
                    src="https://sjfosmcpbekkokmedwil.supabase.co/storage/v1/object/public/hero/hero.jpeg" 
                    alt="Vakmanschap in actie" 
                    fill 
                    className="object-cover"
                />
            </div>
        </div>

        <div className="grid md:grid-cols-3 gap-12 border-t border-brand-dark/10 pt-24">
            <div>
                <h3 className="font-serif text-3xl mb-6">Persoonlijke Opvolging</h3>
                <p className="text-brand-dark/60 font-light leading-relaxed">
                    Omdat we met een vast team van twee werken, heeft u altijd hetzelfde aanspreekpunt. Van de eerste opmeting tot de laatste borstelstreek.
                </p>
            </div>
            <div>
                <h3 className="font-serif text-3xl mb-6">Eigen Pigmenten</h3>
                <p className="text-brand-dark/60 font-light leading-relaxed">
                    Geen standaardkleuren uit een pot. Wij mengen onze kalei zelf met minerale pigmenten voor een resultaat dat perfect past bij de lichtinval van uw woning.
                </p>
            </div>
            <div>
                <h3 className="font-serif text-3xl mb-6">Duurzame Bescherming</h3>
                <p className="text-brand-dark/60 font-light leading-relaxed">
                    Een gevel moet niet alleen mooi zijn, maar ook beschermd. Onze hydrofuge behandeling zorgt ervoor dat uw kalei jarenlang bestand is tegen weer en wind.
                </p>
            </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}