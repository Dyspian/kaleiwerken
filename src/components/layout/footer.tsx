import { siteContent } from "@/content/site";
import Link from "next/link";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-dark text-brand-light py-12 border-t-4 border-brand-gold">
      <div className="container mx-auto px-4 grid md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4 text-white">Van Roey Kalei</h3>
          <p className="text-brand-light/70 text-sm">
            Expertise in premium kaleiwerken voor woningen met karakter.
          </p>
        </div>
        <div>
          <h4 className="text-brand-gold font-semibold mb-4">Contact</h4>
          <ul className="space-y-2 text-sm text-brand-light/80">
            <li>{siteContent.general.address}</li>
            <li>{siteContent.general.phone}</li>
            <li>{siteContent.general.email}</li>
          </ul>
        </div>
        <div>
          <h4 className="text-brand-gold font-semibold mb-4">Links</h4>
          <ul className="space-y-2 text-sm text-brand-light/80">
            <li><Link href="/" className="hover:text-brand-gold">Home</Link></li>
            <li><Link href="/projecten" className="hover:text-brand-gold">Realisaties</Link></li>
            <li><Link href="/offerte" className="hover:text-brand-gold">Offerte aanvragen</Link></li>
            <li><Link href="/privacy" className="hover:text-brand-gold">Privacy</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-brand-gold font-semibold mb-4">Werkregio</h4>
          <p className="text-sm text-brand-light/80">
            Wij zijn voornamelijk actief in Antwerpen, Vlaams-Brabant en Limburg.
          </p>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-brand-light/10 text-center text-xs text-brand-light/40">
        &copy; {currentYear} {siteContent.general.brandName}. Alle rechten voorbehouden.
      </div>
    </footer>
  );
};