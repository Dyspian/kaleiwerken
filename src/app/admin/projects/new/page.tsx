import { ProjectForm } from "../../../../../components/admin/project-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewProjectPage() {
  return (
    <div className="min-h-screen bg-brand-stone p-12">
      <div className="max-w-4xl mx-auto">
        <Link href="/admin/projects" className="inline-flex items-center gap-2 text-brand-dark/40 hover:text-brand-dark mb-8 transition-colors uppercase text-[10px] tracking-widest">
          <ArrowLeft size={14} /> Terug naar lijst
        </Link>
        
        <h1 className="font-serif text-4xl mb-12">Nieuw Project Toevoegen</h1>
        
        <div className="bg-white p-12 border border-brand-dark/5 shadow-sm">
          <ProjectForm />
        </div>
      </div>
    </div>
  );
}