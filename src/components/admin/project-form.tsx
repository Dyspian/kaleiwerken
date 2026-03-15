"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Save, X, Plus } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const projectSchema = z.object({
  title: z.string().min(2, "Titel is verplicht"),
  subtitle: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  year: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  images: z.array(z.string()),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export const ProjectForm = ({ initialData, isEditing }: ProjectFormProps) => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: initialData?.title || "",
      subtitle: initialData?.subtitle || "",
      description: initialData?.description || "",
      location: initialData?.location || "",
      year: initialData?.year || new Date().getFullYear().toString(),
      category: initialData?.category || "Kaleiwerken",
      images: initialData?.images || [],
    }
  });

  const currentImages = watch("images") || [];

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newImages = [...currentImages];

    try {
        // Bepaal de mapnaam (project-1, project-2, etc.)
        let folderName = "";
        if (isEditing && initialData?.id) {
            // Gebruik bestaande ID of zoek mapnaam op
            folderName = `project-${initialData.id.substring(0, 8)}`;
        } else {
            const { count } = await supabase.from('projects').select('*', { count: 'exact', head: true });
            folderName = `project-${(count || 0) + 1}`;
        }

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (!file.type.startsWith('image/')) continue;

            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
            const filePath = `projects/${folderName}/${fileName}`;

            // 1. Upload het bestand
            const { error: uploadError } = await supabase.storage
                .from('portfolio-images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 2. Genereer een Signed URL met 10 jaar vervaltijd (315.360.000 seconden)
            const { data: signedData, error: signedError } = await supabase.storage
                .from('portfolio-images')
                .createSignedUrl(filePath, 315360000);

            if (signedError) throw signedError;

            newImages.push(signedData.signedUrl);
        }

        setValue("images", newImages);
        toast.success("Afbeeldingen succesvol geüpload");
    } catch (error: any) {
        console.error(error);
        toast.error("Fout bij uploaden: " + error.message);
    } finally {
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    const newImages = currentImages.filter((_, i) => i !== index);
    setValue("images", newImages);
  };

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
      image_url: data.images.length > 0 ? data.images[0] : null,
    };

    try {
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl">
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

      <div className="space-y-4">
        <Label>Project Galerij (Eerste foto is de hoofdfoto)</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {currentImages.map((url, index) => (
            <div key={index} className="relative aspect-square bg-brand-stone overflow-hidden border border-brand-dark/5 group">
              <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
              <button 
                type="button" 
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1 bg-brand-dark text-white hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
              >
                <X size={14} />
              </button>
              {index === 0 && (
                <div className="absolute bottom-0 left-0 right-0 bg-brand-bronze text-white text-[8px] uppercase tracking-widest py-1 text-center">
                  Hoofdfoto
                </div>
              )}
            </div>
          ))}
          
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="aspect-square border-2 border-dashed border-brand-dark/10 flex flex-col items-center justify-center gap-2 hover:border-brand-bronze hover:bg-brand-stone/30 transition-all disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 className="animate-spin text-brand-bronze" size={24} />
            ) : (
              <>
                <Plus className="text-brand-dark/20" size={32} />
                <span className="text-[10px] uppercase tracking-widest text-brand-dark/40">Foto toevoegen</span>
              </>
            )}
          </button>
        </div>
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden" 
          accept="image/*"
          multiple
        />
      </div>

      <div className="space-y-2">
        <Label>Ondertitel / Korte samenvatting</Label>
        <Input {...register("subtitle")} className="rounded-none border-brand-dark/10 focus-visible:ring-brand-bronze" placeholder="Korte beschrijving voor de lijst" />
      </div>

      <div className="space-y-2">
        <Label>Beschrijving</Label>
        <Textarea {...register("description")} className="rounded-none border-brand-dark/10 focus-visible:ring-brand-bronze min-h-[150px]" placeholder="Uitgebreide tekst over het project..." />
      </div>

      <div className="flex gap-4 pt-8">
        <Button type="submit" disabled={loading || uploading} className="bg-brand-dark text-white rounded-none px-8 py-6 uppercase text-xs tracking-widest hover:bg-brand-bronze transition-colors">
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