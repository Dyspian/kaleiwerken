"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Save, Upload, X, Image as ImageIcon } from "lucide-react";
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
  image_url: z.string().optional(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

interface ProjectFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export const ProjectForm = ({ initialData, isEditing }: ProjectFormProps) => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.image_url || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ProjectFormValues>({
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

  const currentImageUrl = watch("image_url");

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validatie
    if (!file.type.startsWith('image/')) {
      toast.error("Selecteer a.u.b. een afbeelding");
      return;
    }

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
    const filePath = `projects/${fileName}`;

    try {
      const { error: uploadError, data } = await supabase.storage
        .from('portfolio-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('portfolio-images')
        .getPublicUrl(filePath);

      setValue("image_url", publicUrl);
      setPreviewUrl(publicUrl);
      toast.success("Afbeelding geüpload");
    } catch (error: any) {
      toast.error("Upload mislukt: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setValue("image_url", "");
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
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

      <div className="space-y-4">
        <Label>Project Afbeelding</Label>
        <div className="flex flex-col gap-4">
          {previewUrl ? (
            <div className="relative aspect-video w-full max-w-md bg-brand-stone overflow-hidden border border-brand-dark/5">
              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              <button 
                type="button" 
                onClick={removeImage}
                className="absolute top-2 right-2 p-1 bg-brand-dark text-white hover:bg-brand-bronze transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="aspect-video w-full max-w-md border-2 border-dashed border-brand-dark/10 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-brand-bronze hover:bg-brand-stone/30 transition-all"
            >
              {uploading ? (
                <Loader2 className="animate-spin text-brand-bronze" size={32} />
              ) : (
                <>
                  <ImageIcon className="text-brand-dark/20" size={48} />
                  <span className="text-xs uppercase tracking-widest text-brand-dark/40">Klik om te uploaden</span>
                </>
              )}
            </div>
          )}
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden" 
            accept="image/*"
          />
          <input type="hidden" {...register("image_url")} />
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