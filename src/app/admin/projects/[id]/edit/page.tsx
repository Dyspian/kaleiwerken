"use client";

import { useEffect, useState } from "react";
import { ProjectForm } from "@/components/admin/project-form";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/integrations/supabase/client";
import { useParams } from "next/navigation";

export default function EditProjectPage() {
  const { id } = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      if (!error) {
        setProject(data);
      }
      setLoading(false);
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-stone flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-bronze" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-stone p-12">
      <div className="max-w-4xl mx-auto">
        <Link href="/admin/projects" className="inline-flex items-center gap-2 text-brand-dark/40 hover:text-brand-dark mb-8 transition-colors uppercase text-[10px] tracking-widest">
          <ArrowLeft size={14} /> Terug naar lijst
        </Link>
        
        <h1 className="font-serif text-4xl mb-12">Project Bewerken</h1>
        
        <div className="bg-white p-12 border border-brand-dark/5 shadow-sm">
          {project ? (
            <ProjectForm initialData={project} isEditing />
          ) : (
            <p>Project niet gevonden.</p>
          )}
        </div>
      </div>
    </div>
  );
}