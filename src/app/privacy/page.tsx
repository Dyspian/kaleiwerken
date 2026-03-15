import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-brand-stone text-brand-dark font-sans">
      <Header />
      <section className="pt-40 pb-24 px-6 md:px-12 container mx-auto max-w-4xl">
        <h1 className="font-serif text-5xl mb-12">Privacybeleid</h1>
        <div className="prose prose-lg prose-headings:font-serif prose-p:font-light text-brand-dark/70">
          <p className="mb-8">Bij Van Roey Kaleiwerken hechten we veel waarde aan uw privacy. In dit beleid leggen we uit hoe we omgaan met uw persoonsgegevens.</p>
          
          <h2 className="text-2xl font-serif text-brand-dark mt-12 mb-4">1. Gegevensverzameling</h2>
          <p className="mb-6">Wanneer u een offerte aanvraagt via onze website, verzamelen we uw naam, e-mailadres, telefoonnummer en projectdetails. Deze gegevens zijn noodzakelijk om u een nauwkeurige offerte te kunnen bezorgen.</p>
          
          <h2 className="text-2xl font-serif text-brand-dark mt-12 mb-4">2. Gebruik van gegevens</h2>
          <p className="mb-6">Uw gegevens worden uitsluitend gebruikt voor communicatie over uw aanvraag en de uitvoering van eventuele werken. Wij verkopen uw gegevens nooit aan derden.</p>
          
          <h2 className="text-2xl font-serif text-brand-dark mt-12 mb-4">3. Bewaartermijn</h2>
          <p className="mb-6">Wij bewaren uw gegevens niet langer dan nodig is voor de doeleinden waarvoor ze zijn verzameld, tenzij er een wettelijke verplichting is om deze langer te bewaren.</p>
          
          <h2 className="text-2xl font-serif text-brand-dark mt-12 mb-4">4. Uw rechten</h2>
          <p className="mb-6">U heeft het recht om uw gegevens in te zien, te corrigeren of te laten verwijderen. Neem hiervoor contact met ons op via info@vanroey.be.</p>
        </div>
      </section>
      <Footer />
    </main>
  );
}