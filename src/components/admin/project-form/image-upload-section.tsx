"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { DraggableImageGallery } from "./draggable-image-gallery";
import { Label } from "@/components/ui/label";

interface ImageUploadSectionProps {
  images: string[];
  heroImage: string | null;
  onImagesChange: (images: string[]) => void;
  onSetAsHero: (url: string) => void;
  onRemoveImage: (index: number) => void;
  isEditing?: boolean;
  projectId?: string;
}

export const ImageUploadSection = ({ 
  images, 
  heroImage, 
  onImagesChange, 
  onSetAsHero, 
  onRemoveImage,
  isEditing,
  projectId
}: ImageUploadSectionProps) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newImages = [...images];

    try {
        let folderName = "";
        if (isEditing && projectId) {
            folderName = `project-${projectId.substring(0, 8)}`;
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

        onImagesChange(newImages);
        if (!heroImage && newImages.length > 0) {
            onSetAsHero(newImages[0]);
        }
        toast.success(`${files.length} afbeelding(en) geüpload`);
    } catch (error: any) {
        toast.error("Fout bij uploaden: " + error.message);
    } finally {
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6 pt-8 border-t border-brand-dark/5">
      <div className="flex justify-between items-end mb-4">
        <div>
          <Label className="text-[10px] uppercase tracking-widest text-brand-dark/40 block mb-1">Project Galerij</Label>
          <p className="text-xs text-brand-dark/40">Sleep om de volgorde te wijzigen. Klik op een foto om deze als banner in te stellen.</p>
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

      {images.length > 0 ? (
        <DraggableImageGallery
          images={images}
          heroImage={heroImage}
          onImagesChange={onImagesChange}
          onSetAsHero={onSetAsHero}
          onRemoveImage={onRemoveImage}
        />
      ) : (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="col-span-full aspect-[21/9] border-2 border-dashed border-brand-dark/10 flex flex-col items-center justify-center gap-4 hover:border-brand-bronze hover:bg-brand-stone/30 transition-all cursor-pointer"
        >
          <ImageIcon className="text-brand-dark/10" size={48} strokeWidth={1} />
          <span className="text-[10px] uppercase tracking-widest text-brand-dark/40">Klik om foto's te uploaden</span>
        </div>
      )}
      
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileUpload}
        className="hidden" 
        accept="image/*"
        multiple
      />
    </div>
  );
};