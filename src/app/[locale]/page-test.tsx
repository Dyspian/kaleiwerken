"use client";

import { Header }from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeroSimple } from "@/components/home/hero-simple";
import { Toaster } from "@/components/ui/sonner";
import { getDictionary } from "@/lib/get-dictionary";
import { Locale } from "@/lib/i18n-config";

export default async function HomeTest({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  
  let dict: any = {};
  try {
    dict = await getDictionary(locale) as any;
  } catch (error) {
    console.error("Error loading dictionary:", error);
  }

  return (
    <main className="min-h-screen bg-brand-white text-brand-dark font-sans">
      <Header dict={dict} />
      <HeroSimple dict={dict?.hero || ({} as any)} />
      <Footer dict={dict} />
      <Toaster position="top-center" richColors />
    </main>
  );
}