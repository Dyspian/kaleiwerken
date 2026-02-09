import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollProgress } from "@/components/layout/scroll-progress";
import { Hero } from "@/components/home/hero";
import { SocialProof } from "@/components/home/social-proof";
import { Features } from "@/components/home/features";
import { BeforeAfter } from "@/components/home/before-after";
import { QuoteWizard } from "@/components/quote/quote-wizard";
import { Toaster } from "@/components/ui/sonner";

export default function Home() {
  return (
    <main className="min-h-screen bg-brand-light text-brand-dark font-sans selection:bg-brand-gold/30">
      <ScrollProgress />
      <Header />
      
      <Hero />
      <SocialProof />
      
      <div className="space-y-0">
        <BeforeAfter />
        <Features />
        
        {/* Process Section - Simplified inline */}
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">Onze werkwijze</h2>
                    <p className="text-gray-500">Transparant van begin tot eind.</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { step: "01", title: "Opmeting" },
                        { step: "02", title: "Advies" },
                        { step: "03", title: "Uitvoering" },
                        { step: "04", title: "Oplevering" }
                    ].map((s) => (
                        <div key={s.step} className="text-center group">
                            <span className="text-6xl font-black text-brand-light group-hover:text-brand-gold/20 transition-colors block mb-2">{s.step}</span>
                            <h3 className="font-bold text-lg">{s.title}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* Quote Section */}
        <section id="offerte" className="py-24 bg-brand-dark relative overflow-hidden">
             {/* Decorative circle */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            
            <div className="container mx-auto px-4 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="text-brand-light">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">Klaar voor een nieuwe uitstraling?</h2>
                        <p className="text-lg opacity-80 mb-8 max-w-md">Start hier uw aanvraag. Het duurt slechts 2 minuten en is volledig vrijblijvend.</p>
                        
                        <div className="hidden lg:block space-y-4 opacity-60">
                            <div className="h-px bg-brand-light/20 w-full"></div>
                            <p className="text-sm">Of bel ons direct: +32 470 12 34 56</p>
                        </div>
                    </div>
                    
                    <div>
                        <QuoteWizard />
                    </div>
                </div>
            </div>
        </section>
      </div>

      <Footer />
      <Toaster />
    </main>
  );
}