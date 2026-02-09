import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ProjectenPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="pt-32 pb-20 container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-12 text-brand-dark">Onze Realisaties</h1>
        
        {/* Placeholder Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative group">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-medium">
                        Project Foto {i}
                    </div>
                    <div className="absolute inset-0 bg-brand-dark/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                        <span className="text-brand-gold text-sm font-bold uppercase tracking-wider mb-1">Renovatie</span>
                        <h3 className="text-white text-xl font-bold">Villa Antwerpen</h3>
                    </div>
                </div>
            ))}
        </div>

        <div className="text-center">
            <p className="mb-6 text-gray-500">Overtuigd van onze kwaliteit?</p>
            <Button asChild className="bg-brand-gold text-brand-dark hover:bg-brand-goldLight">
                <Link href="/offerte">Vraag offerte aan</Link>
            </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}