import { SmoothScroll } from "@/components/layout/smooth-scroll";
import { ScrollProgress } from "@/components/layout/scroll-progress";
import { AuthProvider } from "@/components/auth/auth-provider";
import { CookieConsent } from "@/components/layout/cookie-consent";
import { getDictionary } from "@/lib/get-dictionary";
import { Locale } from "@/lib/i18n-config";

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}>) {
  const { locale } = await params;
  const dict = await getDictionary(locale);

  return (
    <AuthProvider>
      <div className="noise-overlay" />
      <ScrollProgress />
      <SmoothScroll>
          {children}
      </SmoothScroll>
      <CookieConsent dict={dict} locale={locale} />
    </AuthProvider>
  );
}