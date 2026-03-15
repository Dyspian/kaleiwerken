import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-brand-stone text-brand-dark font-sans">
      <Header />
      <section className="pt-40 pb-24 px-6 md:px-12 container mx-auto max-w-4xl">
        <h1 className="font-serif text-5xl mb-12">Algemene Voorwaarden</h1>
        <div className="prose prose-lg prose-headings:font-serif prose-p:font-light text-brand-dark/70">
          <h2 className="text-2xl font-serif text-brand-dark mt-12 mb-4">1. Toepasselijkheid</h2>
          <p className="mb-6">Deze voorwaarden zijn van toepassing op alle offertes en overeenkomsten van Van Roey Kaleiwerken.</p>
          
          <h2 className="text-2xl font-serif text-brand-dark mt-12 mb-4">2. Offertes</h2>
          <p className="mb-6">Onze offertes zijn vrijblijvend en 30 dagen geldig, tenzij anders vermeld. Een overeenkomst komt pas tot stand na schriftelijke bevestiging.</p>
          
          <h2 className="text-2xl font-serif text-brand-dark mt-12 mb-4">3. Uitvoering</h2>
          <p className="mb-6">Wij voeren de werken uit naar best vermogen en volgens de regels van de kunst. De klant zorgt voor een vrije toegang tot de werf en de nodige nutsvoorzieningen (water/elektriciteit).</p>
          
          <h2 className="text-2xl font-serif text-brand-dark mt-12 mb-4">4. Betaling</h2>
          <p className="mb-6">Facturen zijn betaalbaar binnen 14 dagen na factuurdatum. Bij niet-tijdige betaling zijn verwijlinteresten verschuldigd.</p>
        </div>
      </section>
      <Footer />
    </main>
  );
}