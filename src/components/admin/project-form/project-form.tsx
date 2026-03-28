"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { FormField, FormRow, FormSection } from "./form-fields";
import { ImageUploadSection } from "./image-upload-section";
import { PlanningSection } from "./planning-section";
import { SpecificationsSection } from "./specifications-section";
import { MessageSquare, ShieldCheck, Info } from "lucide-react";

export const projectSchema = z.object({
  title: z.string().min(2, "Titel is verplicht"),
  subtitle: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  year: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  images: z.array(z.string()),
  image_url: z.string().nullable().optional(),
  technique: z.string().optional(),
  finishing: z.string().optional(),
  pigment: z.string().optional(),
  team: z.string().optional(),
  start_date: z.date().nullable().optional(),
  end_date: z.date().nullable().optional(),
  planning_status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']),
  challenge_text: z.string().nullable().optional(),
  result_text: z.string().nullable().optional(),
  quote_text: z.string().nullable().optional(),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;

export interface InitialProjectData {
  id?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  location?: string;
  year?: string;
  category?: string;
  images?: string[];
  image_url?: string | null;
  stats?: {
    technique?: string;
    finishing?: string;
    pigment?: string;
    team?: string;
  };
  start_date?: string | null;
  end_date?: string | null;
  planning_status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  challenge_text?: string | null;
  result_text?: string | null;
  quote_text?: string | null;
}

interface ProjectFormProps {
  initialData?: InitialProjectData;
  isEditing?: boolean;
}

export const ProjectForm = ({ initialData, isEditing }: ProjectFormProps) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: initialData?.title ?? "",
      subtitle: initialData?.subtitle ?? "",
      description: initialData?.description ?? "",
      location: initialData?.location ?? "",
      year: initialData?.year ?? new Date().getFullYear().toString(),
      category: initialData?.category ?? "Kaleiwerken",
      images: initialData?.images ?? [],
      image_url: initialData?.image_url ?? null,
      technique: initialData?.stats?.technique ?? "Kalei op maat",
      finishing: initialData?.stats?.finishing ?? "Hydrofuge",
      pigment: initialData?.stats?.pigment ?? "Mineraal",
      team: initialData?.stats?.team ?? "Vast team (2)",
      start_date: initialData?.start_date ? new Date(initialData.start_date) : null,
      end_date: initialData?.end_date ? new Date(initialData.end_date) : null,
      planning_status: initialData?.planning_status ?? 'pending',
      challenge_text: initialData?.challenge_text ?? "",
      result_text: initialData?.result_text ?? "",
      quote_text: initialData?.quote_text ?? "",
    }
  });

  const currentImages = watch("images") || [];
  const heroImage = watch("image_url");

  const handleImagesChange = (newImages: string[]) => {
    setValue("images", newImages);
  };

  const setAsHero = (url: string) => {
    setValue("image_url", url);
    toast.success("Ingesteld als banner foto");
  };

  const removeImage = (index: number) => {
    const removedUrl = currentImages[index];
    const newImages = currentImages.filter((_, i) => i !== index);
    setValue("images", newImages);
    
    if (heroImage === removedUrl) {
      setValue("image_url", newImages.length > 0 ? newImages[0] : null);
    }
  };

  const onSubmit: SubmitHandler<ProjectFormValues> = async (data) => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Niet geautoriseerd");
      setLoading(false);
      return;
    }

    const stats = {
      technique: data.technique,
      finishing: data.finishing,
      pigment: data.pigment,
      team: data.team,
    };

    const projectData = {
      title: data.title,
      subtitle: data.subtitle,
      description: data.description,
      location: data.location,
      year: data.year,
      category: data.category,
      images: data.images,
      image_url: data.image_url || (data.images.length > 0 ? data.images[0] : null),
      user_id: user.id,
      stats: stats,
      start_date: data.start_date ? format(data.start_date, 'yyyy-MM-dd') : null,
      end_date: data.end_date ? format(data.end_date, 'yyyy-MM-dd') : null,
      planning_status: data.planning_status,
      challenge_text: data.challenge_text,
      result_text: data.result_text,
      quote_text: data.quote_text,
    };

    try {
      let error;
      if (isEditing) {
        const { error: updateError } = await supabase
          .from("projects")
          .update(projectData)
          .eq("id", initialData!.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from("projects")
          .insert(projectData);
        error = insertError;
      }

      if (error) throw error;

      toast.success(isEditing ? "Project bijgewerkt" : "Project aangemaakt");
      router.push("/admin/projects");
      router.refresh();
    } catch (error: any) {
      toast.error("Fout bij opslaan: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <FormField 
            name="title" 
            label="Project Titel" 
            placeholder="Bijv. Villa Berchem"
            register={register} 
            errors={errors}
            className="text-xl font-serif"
          />
          
          <FormRow>
            <FormField 
              name="category" 
              label="Categorie" 
              placeholder="Bijv. Gevelrenovatie"
              register={register} 
              errors={errors}
            />
            <FormField 
              name="year" 
              label="Jaar" 
              placeholder="2024"
              register={register} 
              errors={errors}
            />
          </FormRow>

          <FormField 
            name="location" 
            label="Locatie" 
            placeholder="Bijv. Antwerpen"
            register={register} 
            errors={errors}
          />
        </div>

        <div className="space-y-6">
          <FormField 
            name="subtitle" 
            label="Korte samenvatting" 
            placeholder="Korte beschrijving voor de lijst"
            register={register} 
            errors={errors}
          />
          <FormField 
            name="description" 
            label="Uitgebreide beschrijving" 
            placeholder="Beschrijf het project in detail..."
            register={register} 
            errors={errors}
            type="textarea"
            className="min-h-[200px]"
          />
        </div>
      </div>

      <FormSection title="Project Verhaal" icon={<MessageSquare size={16} className="text-brand-bronze" />}>
        <div className="grid md:grid-cols-2 gap-8">
          <FormField 
            name="challenge_text" 
            label="De Uitdaging" 
            placeholder="Beschrijf de uitdaging van dit project..."
            register={register} 
            errors={errors}
            type="textarea"
            className="min-h-[120px]"
          />
          <FormField 
            name="result_text" 
            label="Het Resultaat" 
            placeholder="Beschrijf het resultaat van dit project..."
            register={register} 
            errors={errors}
            type="textarea"
            className="min-h-[120px]"
          />
        </div>
        <FormField 
          name="quote_text" 
          label="Quote / Samenvatting" 
          placeholder="Een pakkende quote over het project..."
          register={register} 
          errors={errors}
          type="textarea"
          className="min-h-[80px]"
        />
      </FormSection>

      <PlanningSection watch={watch} setValue={setValue} />

      <SpecificationsSection register={register} />

      <ImageUploadSection
        images={currentImages}
        heroImage={heroImage || null}
        onImagesChange={handleImagesChange}
        onSetAsHero={setAsHero}
        onRemoveImage={removeImage}
        isEditing={isEditing}
        projectId={initialData?.id}
      />

      <div className="flex gap-4 pt-12 border-t border-brand-dark/5">
        <Button 
          type="submit" 
          disabled={loading} 
          className="bg-brand-dark text-white rounded-none px-12 py-7 uppercase text-[10px] tracking-widest hover:bg-brand-bronze transition-all duration-500 shadow-xl"
        >
          {loading ? <Loader2 className="animate-spin mr-2" size={16} /> : <Save className="mr-2" size={16} />}
          {isEditing ? "Wijzigingen Opslaan" : "Project Publiceren"}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          asChild 
          className="rounded-none border-brand-dark/10 px-12 py-7 uppercase text-[10px] tracking-widest hover:bg-brand-stone transition-colors"
        >
          <Link href="/admin/projects">Annuleren</Link>
        </Button>
      </div>
    </form>
  );
};