"use client";

import { useState, useRef } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save, X, Plus, Image as ImageIcon, Info, CalendarIcon } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const projectSchema = z.object({
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
});

export type ProjectFormValues = z.infer<typeof projectSchema>;

interface InitialProjectData {
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
}

interface ProjectFormProps {
  initialData?: InitialProjectData;
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
    }
  });

  const currentImages = watch("images") || [];
  const heroImage = watch("image_url");
  const description = watch("description");
  const startDate = watch("start_date");
  const endDate = watch("end_date");
  const planningStatus = watch("planning_status");

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newImages = [...currentImages];

    try {
        let folderName = "";
        if (isEditing && initialData?.id) {
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

            const { error: uploadError } = await supabase.storage
                .from('portfolio-images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: signedData, error: signedError } = await supabase.storage
                .from('portfolio-images')
                .createSignedUrl(filePath, 315360000);

            if (signedError) throw signedError;

            newImages.push(signedData.signedUrl);
        }

        setValue("images", newImages);
        if (!heroImage && newImages.length > 0) {
            setValue("image_url", newImages[0]);
        }
        toast.success(`${files.length} afbeelding(en) geüpload`);
    } catch (error: any) {
        toast.error("Fout bij uploaden: " + error.message);
    } finally {
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    const removedUrl = currentImages[index];
    const newImages = currentImages.filter((_, i) => i !== index);
    setValue("images", newImages);
    
    if (heroImage === removedUrl) {
        setValue("image_url", newImages.length > 0 ? newImages[0] : null);
    }
  };

  const setAsHero = (url: string) => {
    setValue("image_url", url);
    toast.success("Ingesteld als banner foto");
  };

  const processSubmit: SubmitHandler<ProjectFormValues> = async (data) => {
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
    <form onSubmit={handleSubmit(processSubmit)} className="space-y-12">
      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-6">
            <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Project Titel</Label>
                <Input {...register("title")} className="rounded-none border-brand-dark/10 focus-visible:ring-brand-bronze text-xl font-serif" placeholder="Bijv. Villa Berchem" />
                {errors.title && <p className="text-red-500 text-xs">{errors.title.message}</p>}
            </div>
            
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Categorie</Label>
                    <Input {...register("category")} className="rounded-none border-brand-dark/10 focus-visible:ring-brand-bronze" placeholder="Bijv. Gevelrenovatie" />
                </div>
                <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Jaar</Label>
                    <Input {...register("year")} className="rounded-none border-brand-dark/10 focus-visible:ring-brand-bronze" placeholder="2024" />
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Locatie</Label>
                <Input {...register("location")} className="rounded-none border-brand-dark/10 focus-visible:ring-brand-bronze" placeholder="Bijv. Antwerpen" />
            </div>
        </div>

        <div className="space-y-6">
            <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Korte samenvatting</Label>
                <Input {...register("subtitle")} className="rounded-none border-brand-dark/10 focus-visible:ring-brand-bronze" placeholder="Korte beschrijving voor de lijst" />
            </div>
            <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40 mb-2 block">Uitgebreide beschrijving</Label>
                <Textarea 
                    {...register("description")}
                    className="bg-white rounded-none border-brand-dark/10 min-h-[200px] focus-visible:ring-brand-bronze"
                    placeholder="Beschrijf het project in detail..."
                />
            </div>
        </div>
      </div>

      <div className="space-y-8 pt-8 border-t border-brand-dark/5">
        <div className="flex items-center gap-2 mb-4">
            <Info size={16} className="text-brand-bronze" />
            <h3 className="font-serif text-xl">Planning & Status</h3>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Startdatum</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-full justify-start text-left font-normal rounded-none border-brand-dark/10",
                                !startDate && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, "PPP") : <span>Kies een datum</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white border-brand-dark/10 rounded-none" align="start">
                        <Calendar
                            mode="single"
                            selected={startDate || undefined}
                            onSelect={(date) => setValue("start_date", date)}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>
            <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Einddatum</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-full justify-start text-left font-normal rounded-none border-brand-dark/10",
                                !endDate && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, "PPP") : <span>Kies een datum</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-white border-brand-dark/10 rounded-none" align="start">
                        <Calendar
                            mode="single"
                            selected={endDate || undefined}
                            onSelect={(date) => setValue("end_date", date)}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>
            <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Status</Label>
                <Select value={planningStatus} onValueChange={(value: "pending" | "in_progress" | "completed" | "cancelled") => setValue("planning_status", value)}>
                    <SelectTrigger className="rounded-none border-brand-dark/10 focus:ring-brand-bronze">
                        <SelectValue placeholder="Selecteer status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="pending">In Afwachting</SelectItem>
                        <SelectItem value="in_progress">Bezig</SelectItem>
                        <SelectItem value="completed">Voltooid</SelectItem>
                        <SelectItem value="cancelled">Geannuleerd</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
      </div>

      <div className="space-y-8 pt-8 border-t border-brand-dark/5">
        <div className="flex items-center gap-2 mb-4">
            <Info size={16} className="text-brand-bronze" />
            <h3 className="font-serif text-xl">Specificaties</h3>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Techniek</Label>
                <Input {...register("technique")} className="rounded-none border-brand-dark/10 focus-visible:ring-brand-bronze" placeholder="Bijv. Kalei op maat" />
            </div>
            <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Afwerking</Label>
                <Input {...register("finishing")} className="rounded-none border-brand-dark/10 focus-visible:ring-brand-bronze" placeholder="Bijv. Hydrofuge" />
            </div>
            <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Pigment</Label>
                <Input {...register("pigment")} className="rounded-none border-brand-dark/10 focus-visible:ring-brand-bronze" placeholder="Bijv. Mineraal" />
            </div>
            <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40">Team</Label>
                <Input {...register("team")} className="rounded-none border-brand-dark/10 focus-visible:ring-brand-bronze" placeholder="Bijv. Vast team (2)" />
            </div>
        </div>
      </div>

      <div className="space-y-6 pt-8 border-t border-brand-dark/5">
        <div className="flex justify-between items-end">
            <div>
                <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40 block mb-1">Project Galerij</Label>
                <p className="text-xs text-brand-dark/40">Klik op een foto om deze als banner (hero) in te stellen.</p>
            </div>
            <Button 
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="rounded-none border-brand-dark/10 hover:bg-brand-stone text-[10px] uppercase tracking-widest"
            >
                {uploading ? <Loader2 className="animate-spin mr-2" size={14} /> : <Plus className="mr-2" size={14} />}
                Foto's toevoegen
            </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {currentImages.map((url, index) => (
            <div 
                key={index} 
                className={cn(
                    "relative aspect-[4/5] bg-brand-stone overflow-hidden border group transition-all cursor-pointer",
                    heroImage === url ? "border-brand-bronze ring-2 ring-brand-bronze" : "border-brand-dark/5"
                )}
                onClick={() => setAsHero(url)}
            >
              <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
              
              <div className="absolute inset-0 bg-brand-dark/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                <div className="flex justify-end">
                    <button 
                        type="button" 
                        onClick={(e) => {
                            e.stopPropagation();
                            removeImage(index);
                        }}
                        className="p-1.5 bg-red-600 text-white hover:bg-red-700 transition-colors"
                    >
                        <X size={14} />
                    </button>
                </div>
                
                <div className="text-center text-[8px] uppercase tracking-widest text-white bg-brand-dark/60 py-1">
                    {heroImage === url ? "Huidige Banner" : "Stel in als banner"}
                </div>
              </div>

              {heroImage === url && (
                <div className="absolute top-2 left-2 bg-brand-bronze text-white text-[8px] uppercase tracking-widest px-2 py-1 flex items-center gap-1">
                  <ImageIcon size={10} /> Banner Foto
                </div>
              )}
            </div>
          ))}
          
          {currentImages.length === 0 && !uploading && (
            <div 
                onClick={() => fileInputRef.current?.click()}
                className="col-span-full aspect-[21/9] border-2 border-dashed border-brand-dark/10 flex flex-col items-center justify-center gap-4 hover:border-brand-bronze hover:bg-brand-stone/30 transition-all cursor-pointer"
            >
                <ImageIcon className="text-brand-dark/10" size={48} strokeWidth={1} />
                <span className="text-[10px] uppercase tracking-widest text-brand-dark/40">Klik om foto's te uploaden</span>
            </div>
          )}
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

      <div className="flex gap-4 pt-12 border-t border-brand-dark/5">
        <Button type="submit" disabled={loading || uploading} className="bg-brand-dark text-white rounded-none px-12 py-7 uppercase text-[10px] tracking-widest hover:bg-brand-bronze transition-all duration-500 shadow-xl">
          {loading ? <Loader2 className="animate-spin mr-2" size={16} /> : <Save className="mr-2" size={16} />}
          {isEditing ? "Wijzigingen Opslaan" : "Project Publiceren"}
        </Button>
        <Button type="button" variant="outline" asChild className="rounded-none border-brand-dark/10 px-12 py-7 uppercase text-[10px] tracking-widest hover:bg-brand-stone transition-colors">
          <Link href="/admin/projects">Annuleren</Link>
        </Button>
      </div>
    </form>
  );
};