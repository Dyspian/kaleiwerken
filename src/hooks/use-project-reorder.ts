import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Project {
  id: string;
  title: string;
  category?: string;
  year?: string;
  image_url?: string;
  created_at: string;
}

export const useProjectReorder = (initialProjects: Project[]) => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [isReordering, setIsReordering] = useState(false);

  const handleReorder = useCallback(async (newProjects: Project[]) => {
    setProjects(newProjects);
    setIsReordering(true);

    try {
      // Create an array of project IDs in the new order
      const orderedIds = newProjects.map(p => p.id);
      
      // Update the order in the database
      const updates = orderedIds.map((id, index) => ({
        id,
        display_order: index
      }));

      const { error } = await supabase
        .from("projects")
        .upsert(updates, { onConflict: 'id' });

      if (error) {
        throw error;
      }

      toast.success("Volgorde succesvol bijgewerkt");
    } catch (error: any) {
      console.error("Error updating project order:", error);
      toast.error("Fout bij bijwerken volgorde: " + error.message);
      // Revert to previous order on error
      setProjects(initialProjects);
    } finally {
      setIsReordering(false);
    }
  }, [initialProjects]);

  return {
    projects,
    isReordering,
    handleReorder
  };
};