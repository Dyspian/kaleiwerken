import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { QuoteWizard } from "@/components/quote/quote-wizard";

export default function OffertePage() {
  return (
    <div className="min-h-screen bg-brand-light">
      <Header />
      <main className="pt-32 pb-20 container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-brand-dark">Vraag uw offerte aan</h1>
            <p className="text-brand-dark/60">Vul onderstaand formulier in voor een snelle en accurate inschatting.</p>
        </div>
        <QuoteWizard />
      </main>
      <Footer />
    </div>
  );
}