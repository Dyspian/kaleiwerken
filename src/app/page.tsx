import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/home/hero";
import { SocialProof } from "@/components/home/social-proof";
import { Features } from "@/components/home/features";
import { BeforeAfter } from "@/components/home/before-after";
import { Process } from "@/components/home/process";
import { QuoteWizard } from "@/components/quote/quote-wizard";
import { Toaster } from "@/components/ui/sonner";

export default function Home() {
  return (
    <main className="min-h-screen bg-brand-white text-brand-dark font-sans selection:bg-brand-bronze/30">
      <Header />
      
      <Hero />
      <SocialProof />
      
      <div className="bg-brand-stone">
        <BeforeAfter />
        <Features />
        <Process />

        <section id="offerte" className="py-32 bg-brand-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-bronze/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
            
            <div className="container mx-auto px-6 md:px-12 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
                    <div className="lg:sticky lg:top-32">
                        <span className="uppercase text-xs tracking-[0.3em] text-brand-bronze font-medium mb-6 block">Contact</span>
                        <h2 className="font-serif text-5xl md:text-7xl font-medium mb-8 leading-[0.9] text-brand-dark">
                            Klaar voor een <span className="italic text-brand-bronze">nieuwe</span> uitstraling?
                        </h2>
                        <p className="text-xl text-brand-dark/60 mb-12 max-w-md font-light leading-relaxed">
                            Start hier uw aanvraag. Het duurt slechts 2 minuten en is volledig vrijblijvend.
                        </p>
                        
                        <div className="hidden lg:block space-y-6 pt-12 border-t border-brand-dark/5">
                            <div>
                                <h4 className="uppercase text-[10px] tracking-widest text-brand-dark/40 mb-2">Direct contact</h4>
                                <p className="font-serif text-2xl text-brand-dark">+32 470 12 34 56</p>
                            </div>
                            <div>
                                <h4 className="uppercase text-[10px] tracking-widest text-brand-dark/40 mb-2">Email</h4>
                                <p className="font-serif text-2xl text-brand-dark">info@vanroey.be</p>
                            </div>
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
      <Toaster position="top-center" richColors />
    </main>
  );
}