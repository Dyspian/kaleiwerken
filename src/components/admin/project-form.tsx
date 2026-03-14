"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const projectSchema = z.object({
  title: z.string().min(2, "Titel is verplicht"),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  year: z.string().optional(),
  category: z.string().optional(),
  image_url: z.string().url("Ongeldige URL").or(z.literal("")),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export const ProjectForm = ({ initialData, isEditing }: ProjectFormProps) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, formState: { errors } } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: initialData || {
      title: "",
      subtitle: "",
      description: "",
      location: "",
      year: new Date().getFullYear().toString(),
      category: "Kaleiwerken",
      image_url: "",
    }
  });

  const onSubmit = async (data: ProjectFormValues) => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Niet geautoriseerd");
      setLoading(false);
      return;
    }

    const projectData = {
      ...data,
      user_id: user.id,
    };

    let error;
    if (isEditing) {
      const { error: updateError } = await supabase
        .from("projects")
        .update(projectData)
        .eq("id", initialData.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from("projects")
        .insert(projectData);
      error = insertError;
    }

    if (error) {
      toast.error("Er is iets misgegaan");
      console.error(error);
    } else {
      toast.success(isEditing ? "Project bijgewerkt" : "Project aangemaakt");
      router.push("/admin/projects");
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-3xl">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-2">
          <Label>Titel</Label>
          <Input {...register("title")} className="rounded-none border-brand-dark/10 focus-visible:ring-brand-bronze" placeholder="Bijv. Villa Berchem" />
          {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
        </div>
        
        <div className="space-y-2">
          <Label>Categorie</Label>
          <Input {...register("category")} className="rounded-none border-brand-dark/10 focus-visible:ring-brand-bronze" placeholder="Bijv. Gevelrenovatie" />
        </div>

        <div className="space-y-2">
          <Label>Locatie</Label>
          <Input {...register("location")} className="rounded-none border-brand-dark/10 focus-visible:ring-brand-bronze" placeholder="Bijv. Antwerpen" />
        </div>

        <div className="space-y-2">
          <Label>Jaar</Label>
          <Input {...register("year")} className="rounded-none border-brand-dark/10 focus-visible:ring-brand-bronze" placeholder="2024" />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Ondertitel / Korte samenvatting</Label>
        <Input {...register("subtitle")} className="rounded-none border-brand-dark/10 focus-visible:ring-brand-bronze" placeholder="Korte beschrijving voor de lijst" />
      </div>

      <div className="space-y-2">
        <Label>Beschrijving</Label>
        <Textarea {...register("description")} className="rounded-none border-brand-dark/10 focus-visible:ring-brand-bronze min-h-[150px]" placeholder="Uitgebreide tekst over het project..." />
      </div>

      <div className="space-y-2">
        <Label>Afbeelding URL</Label>
        <Input {...register("image_url")} className="rounded-none border-brand-dark/10 focus-visible:ring-brand-bronze" placeholder="https://..." />
        <p className="text-[10px] text-brand-dark/40 uppercase tracking-widest">Gebruik een directe link naar een afbeelding.</p>
      </div>

      <div className="flex gap-4 pt-8">
        <Button type="submit" disabled={loading} className="bg-brand-dark text-white rounded-none px-8 py-6 uppercase text-xs tracking-widest hover:bg-brand-bronze transition-colors">
          {loading ? <Loader2 className="animate-spin mr-2" size={16} /> : <Save className="mr-2" size={16} />}
          {isEditing ? "Bijwerken" : "Project Opslaan"}
        </Button>
        <Button type="button" variant="outline" asChild className="rounded-none border-brand-dark/10 px-8 py-6 uppercase text-xs tracking-widest">
          <Link href="/admin/projects">Annuleren</Link>
        </Button>
      </div>
    </form>
  );
};