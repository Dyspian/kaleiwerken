import { siteContent } from "@/content/site";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { MadeWithElmony } from "@/components/made-with-elmony";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-dark text-brand-stone pt-32 pb-8 border-t border-white/5 overflow-hidden relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40vw] font-serif text-white/[0.02] pointer-events-none select-none whitespace-nowrap">
            Van Roey
        </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid md:grid-cols-12 gap-12 lg:gap-24 mb-24">
          <div className="md:col-span-5 lg:col-span-4">
            <h3 className="text-2xl font-serif font-bold italic mb-8">Van Roey Kaleiwerken</h3>
            <p className="text-brand-stone/60 text-lg leading-relaxed max-w-sm font-light">
              Specialist in authentieke gevelrenovatie en kaleiwerken met een hoogwaardige afwerking.
            </p>
          </div>
          
          <div className="md:col-span-7 lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-12">
            <div>
              <h4 className="text-xs uppercase tracking-[0.2em] text-brand-bronze mb-8">Contact</h4>
              <ul className="space-y-4 text-sm font-light text-brand-stone/80">
                <li className="hover:text-white transition-colors cursor-pointer">{siteContent.general.address}</li>
                <li className="hover:text-white transition-colors cursor-pointer">{siteContent.general.phone}</li>
                <li className="hover:text-white transition-colors cursor-pointer">{siteContent.general.email}</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-xs uppercase tracking-[0.2em] text-brand-bronze mb-8">Menu</h4>
              <ul className="space-y-4 text-sm font-light text-brand-stone/80">
                <li><Link href="/" className="hover:text-white transition-colors flex items-center gap-2 group">Home <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" /></Link></li>
                <li><Link href="/projecten" className="hover:text-white transition-colors flex items-center gap-2 group">Realisaties <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" /></Link></li>
                <li><Link href="/offerte" className="hover:text-white transition-colors flex items-center gap-2 group">Offerte aanvragen <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" /></Link></li>
              </ul>
            </div>
            
            <div className="hidden md:block">
               <h4 className="text-xs uppercase tracking-[0.2em] text-brand-bronze mb-8">Socials</h4>
               <ul className="space-y-4 text-sm font-light text-brand-stone/80">
                 <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
                 <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
                 <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
               </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-brand-stone/40 uppercase tracking-wider">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <span>&copy; {currentYear} {siteContent.general.brandName}.</span>
            <div className="hidden md:block w-4 h-[1px] bg-white/10" />
            <div className="flex gap-8">
                <Link href="/privacy" className="hover:text-brand-stone transition-colors">Privacy</Link>
                <Link href="/terms" className="hover:text-brand-stone transition-colors">Terms</Link>
            </div>
          </div>
          <MadeWithElmony />
        </div>
      </div>
    </footer>
  );
};