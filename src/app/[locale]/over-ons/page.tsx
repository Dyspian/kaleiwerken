import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Check, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { getDictionary } from "@/lib/get-dictionary";
import { Locale } from "@/lib/i18n-config";
import { Button } from "@/components/ui/button";

export default async function AboutPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale) as any;

  const aboutImage = dict.about.imageUrl || "https://sjfosmcpbekkokmedwil.supabase.co/storage/v1/object/public/about%20us/Kaleiwerk-buitengevel-Pulle-Vincent-Van-Roey-Schilderwerken-3.jpg";

  return (
    <main className="min-h-screen bg-brand-stone text-brand-dark font-sans selection:bg-brand-bronze/30">
      <Header dict={dict} />
      
      <section className="pt-40 pb-24 px-6 md:px-12 container mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
            <div>
                <span className="uppercase text-[10px] tracking-[0.4em] text-brand-bronze font-semibold mb-6 block">{dict.about.tag}</span>
                <h1 className="font-serif text-5xl md:text-7xl leading-[0.9] mb-8">
                    {dict.about.title.split(' ').map((word: string, i: number) => (
                        word.toLowerCase() === 'vakmanschap.' ? <span key={i} className="italic text-brand-bronze"> {word}</span> : <span key={i}> {word}</span>
                    ))}
                </h1>
                <p className="text-xl text-brand-dark/70 font-light leading-relaxed mb-12">
                    {dict.about.description}
                </p>

                {dict.about.ctaLink && (
                    <div className="mb-12">
                        <Button 
                            asChild
                            className="bg-brand-dark text-white rounded-none px-8 py-7 uppercase text-[10px] tracking-[0.2em] hover:bg-brand-bronze transition-all duration-500 group shadow-xl"
                        >
                            <a href={dict.about.ctaLink} target="_blank" rel="noopener noreferrer">
                                {dict.about.ctaText || "Bezoek onze website"}
                                <ArrowUpRight className="ml-2 w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </a>
                        </Button>
                    </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                    {dict.about.features.map((f: string, i: number) => (
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
                    src={aboutImage} 
                    alt="Vakmanschap in actie" 
                    fill 
                    className="object-cover"
                    unoptimized={aboutImage.includes('supabase.co')}
                />
            </div>
        </div>

        <div className="grid md:grid-cols-3 gap-12 border-t border-brand-dark/10 pt-24">
            <div>
                <h3 className="font-serif text-3xl mb-6">{dict.about.personal}</h3>
                <p className="text-brand-dark/60 font-light leading-relaxed">
                    {dict.about.personalDesc}
                </p>
            </div>
            <div>
                <h3 className="font-serif text-3xl mb-6">{dict.about.pigments}</h3>
                <p className="text-brand-dark/60 font-light leading-relaxed">
                    {dict.about.pigmentsDesc}
                </p>
            </div>
            <div>
                <h3 className="font-serif text-3xl mb-6">{dict.about.protection}</h3>
                <p className="text-brand-dark/60 font-light leading-relaxed">
                    {dict.about.protectionDesc}
                </p>
            </div>
        </div>
      </section>

      <Footer dict={dict} />
    </main>
  );
}