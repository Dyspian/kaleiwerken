import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { OfferteClient } from "@/components/quote/offerte-client";
import { getDictionary } from "@/lib/get-dictionary";
import { Locale } from "@/lib/i18n-config";

export default async function OffertePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <div className="min-h-screen bg-brand-white text-brand-dark font-sans selection:bg-brand-bronze/30 flex flex-col">
      <Header />
      <OfferteClient dict={dict} />
      <Footer />
    </div>
  );
}