import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { supabase } from "@/integrations/supabase/client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Algemene Voorwaarden | Van Roey Kaleiwerken",
  description: "Onze algemene voorwaarden en voorwaarden voor dienstverlening.",
};

export default async function TermsPage() {
  // Fetch terms content from CMS
  const { data: settings } = await supabase
    .from('site_settings')
    .select('content')
    .eq('locale', 'nl')
    .maybeSingle();

  const termsContent = settings?.content?.terms || {
    title: "Algemene Voorwaarden",
    content: `<h2>1. Toepasselijkheid</h2>
<p>Deze voorwaarden zijn van toepassing op alle offertes en overeenkomsten van Van Roey Kaleiwerken.</p>

<h2>2. Offertes</h2>
<p>Onze offertes zijn vrijblijvend en 30 dagen geldig, tenzij anders vermeld. Een overeenkomst komt pas tot stand na schriftelijke bevestiging.</p>

<h2>3. Uitvoering</h2>
<p>Wij voeren de werken uit naar best vermogen en volgens de regels van de kunst. De klant zorgt voor een vrije toegang tot de werf en de nodige nutsvoorzieningen (water/elektriciteit).</p>

<h2>4. Betaling</h2>
<p>Facturen zijn betaalbaar binnen 14 dagen na factuurdatum. Bij niet-tijdige betaling zijn verwijlinteresten verschuldigd.</p>`
  };

  return (
    <main className="min-h-screen bg-brand-stone text-brand-dark font-sans selection:bg-brand-bronze/30">
      <Header />
      
      <section className="pt-40 pb-24 px-6 md:px-12 container mx-auto">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-serif text-5xl mb-12">{termsContent.title}</h1>
          <div 
            className="prose prose-lg prose-headings:font-serif prose-p:font-light text-brand-dark/70 max-w-none"
            dangerouslySetInnerHTML={{ __html: termsContent.content }}
          />
        </div>
      </section>
      
      <Footer />
    </main>
  );
}