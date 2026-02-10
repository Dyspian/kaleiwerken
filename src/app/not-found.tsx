import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-stone flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Decorative background number */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40vw] font-serif font-bold text-brand-dark/[0.03] select-none pointer-events-none">
        404
      </div>

      <div className="relative z-10 max-w-md mx-auto">
        <span className="text-xs uppercase tracking-[0.3em] text-brand-bronze font-medium mb-6 block">Pagina niet gevonden</span>
        <h1 className="font-serif text-5xl md:text-7xl text-brand-dark mb-6">
            Oeps, verdwaald?
        </h1>
        <p className="text-brand-dark/60 mb-12 font-light leading-relaxed">
            De pagina die u zoekt bestaat niet of is verplaatst. Keer terug naar de startpagina om uw weg te vervolgen.
        </p>
        
        <Button 
            asChild
            className="bg-brand-dark text-white rounded-none px-8 py-6 uppercase text-xs tracking-widest hover:bg-brand-bronze hover:text-white transition-all duration-500"
        >
            <Link href="/">Terug naar Home</Link>
        </Button>
      </div>
    </div>
  );
}