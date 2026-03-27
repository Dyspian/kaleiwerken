import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { supabase } from "@/integrations/supabase/client";
import { Metadata } from "next";
import { getDictionary } from "@/lib/get-dictionary";
import { Locale } from "@/lib/i18n-config";

export const metadata: Metadata = {
  title: "Privacybeleid | Van Roey Kaleiwerken",
  description: "Ons privacybeleid en hoe we omgaan met uw persoonsgegevens.",
};

export default async function PrivacyPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale) as any;
  
  // Fetch privacy content from CMS
  const { data: settings } = await supabase
    .from('site_settings')
    .select('content')
    .eq('locale', locale)
    .maybeSingle();

  const privacyContent = settings?.content?.privacy || {
    title: dict?.privacy?.title || "Privacybeleid",
    content: dict?.privacy?.content || `<h2>1. Gegevensverzameling</h2>
<p>Wanneer u een offerte aanvraagt via onze website, verzamelen we uw naam, e-mailadres, telefoonnummer en projectdetails. Deze gegevens zijn noodzakelijk om u een nauwkeurige offerte te kunnen bezorgen.</p>

<h2>2. Gebruik van gegevens</h2>
<p>Uw gegevens worden uitsluitend gebruikt voor communicatie over uw aanvraag en de uitvoering van eventuele werken. Wij verkopen uw gegevens nooit aan derden.</p>

<h2>3. Bewaartermijn</h2>
<p>Wij bewaren uw gegevens niet langer dan nodig is voor de doeleinden waarvoor ze zijn verzameld, tenzij er een wettelijke verplichting is om deze langer te bewaren.</p>

<h2>4. Uw rechten</h2>
<p>U heeft het recht om uw gegevens in te zien, te corrigeren of te laten verwijderen. Neem hiervoor contact met ons op via info@vanroey-kalei.be.</p>`
  };

  return (
    <main className="min-h-screen bg-brand-stone text-brand-dark font-sans selection:bg-brand-bronze/30">
      <Header dict={dict} />
      
      <section className="pt-40 pb-24 px-6 md:px-12 container mx-auto">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-serif text-5xl mb-12">{privacyContent.title}</h1>
          <div 
            className="text-brand-dark/70 max-w-none font-light leading-relaxed"
            dangerouslySetInnerHTML={{ __html: privacyContent.content }}
          />
        </div>
      </section>
      
      <Footer dict={dict} />
    </main>
  );
}