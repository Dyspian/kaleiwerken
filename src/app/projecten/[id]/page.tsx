import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar, MapPin, Ruler } from "lucide-react";
import Image from "next/image";

// Mock data service (normally this would fetch from a database/CMS)
const getProject = (id: string) => {
  // Return dummy data for now
  return {
    id,
    title: "Villa Berchem",
    subtitle: "Complete gevelrenovatie van een historisch pand.",
    location: "Berchem, Antwerpen",
    year: "2023",
    service: "Totaalrenovatie",
    description: "Een uitdagend project waarbij de authenticiteit van de woning centraal stond. De oude verflagen werden zorgvuldig verwijderd om de originele baksteenstructuur bloot te leggen, waarna een authentieke kalkpleister werd aangebracht. Het resultaat is een ademende gevel met een tijdloze, minerale uitstraling die perfect past in de groene omgeving.",
    stats: [
        { label: "Oppervlakte", value: "350m²" },
        { label: "Duur", value: "3 weken" },
        { label: "Techniek", value: "Borsteltechniek" },
    ],
    // Using colors/placeholders since we don't have real images
    images: ["bg-brand-dark/5", "bg-brand-bronze/10", "bg-brand-dark/10"] 
  };
};

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = getProject(id);

  return (
    <main className="min-h-screen bg-brand-stone text-brand-dark font-sans selection:bg-brand-bronze/30">
      <Header />
      
      {/* Hero Section */}
      <section className="h-[80vh] relative flex items-end pb-24 px-6 md:px-12 bg-brand-dark overflow-hidden">
        <div className="absolute inset-0 bg-brand-dark/40 z-10" />
        {/* Placeholder for Hero Image */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-dark to-brand-bronze/20 opacity-50"></div>
        
        <div className="relative z-20 container mx-auto">
            <Link href="/projecten" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors uppercase text-[10px] tracking-widest">
                <ArrowLeft className="w-4 h-4" /> Terug naar overzicht
            </Link>
            <h1 className="font-serif text-6xl md:text-9xl text-white leading-[0.9] mb-6">
                {project.title}
            </h1>
            <div className="flex flex-wrap gap-6 text-white/60 text-sm font-mono uppercase tracking-widest">
                <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-brand-bronze" /> {project.location}</span>
                <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-brand-bronze" /> {project.year}</span>
            </div>
        </div>
      </section>

      {/* Editorial Content */}
      <section className="py-32 container mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24">
            
            {/* Sidebar Details */}
            <div className="lg:col-span-4 space-y-12">
                <div className="border-t border-brand-dark/10 pt-8">
                    <span className="block text-xs uppercase tracking-widest text-brand-bronze mb-4">Project Info</span>
                    <p className="font-serif text-3xl leading-tight text-brand-dark mb-8">
                        {project.subtitle}
                    </p>
                    <div className="space-y-6">
                        {project.stats.map((stat, i) => (
                            <div key={i} className="flex justify-between border-b border-brand-dark/5 pb-2">
                                <span className="text-sm text-brand-dark/50">{stat.label}</span>
                                <span className="text-sm font-medium">{stat.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Narrative */}
            <div className="lg:col-span-8">
                <div className="prose prose-lg prose-headings:font-serif prose-p:font-light prose-p:leading-loose text-brand-dark/80 max-w-none">
                    <p className="first-letter:text-5xl first-letter:font-serif first-letter:text-brand-bronze first-letter:float-left first-letter:mr-3">
                        {project.description}
                    </p>
                    <p>
                        Bij dit project hebben we specifiek gekozen voor een traditionele kalkpleister die de muren laat ademen. Dit is essentieel voor oudere gebouwen om vochtproblemen te voorkomen. De afwerking met de borstel zorgt voor die typische, levendige textuur waar kalei om bekend staat.
                    </p>
                </div>

                {/* Gallery Masonry (Placeholder) */}
                <div className="grid grid-cols-1 gap-8 mt-16">
                    <div className="aspect-video bg-brand-dark/5 w-full relative group overflow-hidden">
                        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-brand-dark/10 font-serif italic text-4xl">Detail 01</span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                         <div className="aspect-[3/4] bg-brand-bronze/10 w-full relative group overflow-hidden">
                            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-brand-dark/10 font-serif italic text-4xl">Detail 02</span>
                         </div>
                         <div className="aspect-[3/4] bg-brand-dark/10 w-full relative group overflow-hidden">
                            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-brand-dark/10 font-serif italic text-4xl">Detail 03</span>
                         </div>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Next Project Nav */}
      <section className="py-24 border-t border-brand-dark/5">
        <div className="container mx-auto px-6 md:px-12 text-center">
            <span className="text-xs uppercase tracking-widest text-brand-dark/40 mb-4 block">Volgend Project</span>
            <Link href="/projecten" className="group inline-block">
                <h2 className="font-serif text-5xl md:text-8xl text-brand-dark group-hover:text-brand-bronze transition-colors duration-500">
                    Herenhuis Gent
                </h2>
                <div className="h-[1px] w-0 bg-brand-bronze group-hover:w-full transition-all duration-700 mx-auto mt-2"></div>
            </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}