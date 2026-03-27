import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { supabase } from "@/integrations/supabase/client";
import { Metadata } from "next";
import { getDictionary } from "@/lib/get-dictionary";
import { Locale } from "@/lib/i18n-config";

export const metadata: Metadata = {
  title: "Algemene Voorwaarden | Van Roey Kaleiwerken",
  description: "Onze algemene voorwaarden en voorwaarden voor dienstverlening.",
};

export default async function TermsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale) as any;
  
  // Fetch terms content from CMS
  const { data: settings } = await supabase
    .from('site_settings')
    .select('content')
    .eq('locale', locale)
    .maybeSingle();

  const termsContent = settings?.content?.terms || {
    title: dict?.terms?.title || "Algemene Voorwaarden",
    content: dict?.terms?.content || `<h2>1. Toepasselijkheid</h2>
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
      <Header dict={dict} />
      
      <section className="pt-40 pb-24 px-6 md:px-12 container mx-auto">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-serif text-5xl mb-12">{termsContent.title}</h1>
          <div 
            className="text-brand-dark/70 max-w-none font-light leading-relaxed"
            dangerouslySetInnerHTML={{ __html: termsContent.content }}
          />
        </div>
      </section>
      
      <Footer dict={dict} />
    </main>
  );
}