import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { QuoteWizard } from "@/components/quote/quote-wizard";
import { Check } from "lucide-react";

export default function OffertePage() {
  return (
    <div className="min-h-screen bg-brand-white text-brand-dark font-sans selection:bg-brand-bronze/30 flex flex-col">
      <Header />
      
      <main className="flex-1 flex flex-col lg:flex-row pt-24 lg:pt-0">
        
        {/* Left Side: Editorial & Trust */}
        <div className="lg:w-1/2 bg-brand-stone flex flex-col justify-center px-6 md:px-16 py-12 lg:min-h-screen border-r border-brand-dark/5">
            <div className="max-w-lg mx-auto lg:sticky lg:top-32">
                <span className="uppercase text-xs tracking-[0.3em] text-brand-bronze font-medium mb-6 block">Offerte</span>
                <h1 className="font-serif text-5xl md:text-7xl mb-8 leading-[0.9] text-brand-dark">
                    Start uw <br/><span className="italic text-brand-bronze">project.</span>
                </h1>
                <p className="text-xl text-brand-dark/60 mb-12 font-light leading-relaxed">
                    Vul het formulier in voor een vrijblijvende offerte. Wij analyseren uw aanvraag en nemen binnen 48u contact op.
                </p>

                <div className="space-y-6 pt-12 border-t border-brand-dark/10">
                    <h3 className="uppercase text-[10px] tracking-widest text-brand-dark/40 mb-6">Waarom kiezen voor Van Roey?</h3>
                    
                    {[
                        "Meer dan 25 jaar ervaring in gevelrenovatie",
                        "Gebruik van hoogwaardige, natuurlijke materialen",
                        "Persoonlijke begeleiding van A tot Z",
                        "Eén aanspreekpunt tijdens de werken"
                    ].map((item, idx) => (
                        <div key={idx} className="flex items-start gap-4 group">
                            <div className="mt-1 min-w-[1.25rem] w-5 h-5 rounded-full border border-brand-dark/20 flex items-center justify-center group-hover:border-brand-bronze group-hover:bg-brand-bronze/10 transition-colors">
                                <Check className="w-3 h-3 text-brand-bronze opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={3} />
                            </div>
                            <span className="text-brand-dark/80 font-light leading-relaxed group-hover:text-brand-dark transition-colors">{item}</span>
                        </div>
                    ))}
                </div>

                <div className="mt-16 pt-8 border-t border-brand-dark/10 flex flex-col sm:flex-row gap-8 opacity-60">
                    <div>
                        <span className="uppercase text-[10px] tracking-widest block mb-1">Email</span>
                        <a href="mailto:info@vanroey.be" className="font-serif text-lg hover:text-brand-bronze transition-colors">info@vanroey.be</a>
                    </div>
                    <div>
                        <span className="uppercase text-[10px] tracking-widest block mb-1">Tel</span>
                        <a href="tel:+32470123456" className="font-serif text-lg hover:text-brand-bronze transition-colors">+32 470 12 34 56</a>
                    </div>
                </div>
            </div>
        </div>

        {/* Right Side: The Form */}
        <div className="lg:w-1/2 bg-brand-white flex flex-col justify-center px-4 md:px-12 py-12 lg:py-32">
            <div className="max-w-2xl mx-auto w-full">
                <QuoteWizard />
            </div>
        </div>

      </main>

      {/* Simplified Footer for this page only, or standard full footer */}
      <Footer />
    </div>
  );
}