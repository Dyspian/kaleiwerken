"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useProjectOrdering = <T extends { id: string; sort_order?: number }>(projects: T[]) => {
  const [isReordering, setIsReordering] = useState(false);
  const [orderedProjects, setOrderedProjects] = useState<T[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isReordering) {
      setOrderedProjects(projects);
    }
  }, [projects, isReordering]);

  const toggleReordering = () => {
    if (isReordering) {
      setOrderedProjects(projects);
      setHasChanges(false);
    }
    setIsReordering(!isReordering);
  };

  const handleReorder = (newOrder: T[]) => {
    setOrderedProjects(newOrder);
    setHasChanges(true);
  };

  const saveOrder = async () => {
    setIsSaving(true);
    try {
      // Get current user for RLS policies
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Geen gebruiker gevonden");
      }

      // Create updates for each project with sort_order
      const updates = orderedProjects.map((project, index) => ({
        id: project.id,
        sort_order: index,
        user_id: user.id // Required for RLS policies
      }));

      console.log("Saving project order updates:", updates);

      // Use a transaction-like approach with individual updates
      // This is more reliable for RLS policies
      for (const update of updates) {
        const { error } = await supabase
          .from('projects')
          .update({ 
            sort_order: update.sort_order,
            user_id: update.user_id 
          })
          .eq('id', update.id);

        if (error) {
          console.error(`Error updating project ${update.id}:`, error);
          throw new Error(`Fout bij updaten project ${update.id}: ${error.message}`);
        }
      }

      toast.success("Volgorde succesvol opgeslagen!");
      setHasChanges(false);
      setIsReordering(false);
      return true;
    } catch (error: any) {
      console.error("Save order error:", error);
      const errorMessage = error.message || "Onbekende fout bij opslaan";
      toast.error(`Fout bij opslaan volgorde: ${errorMessage}`);
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const resetOrder = () => {
    setOrderedProjects(projects);
    setHasChanges(false);
  };

  return {
    isReordering,
    orderedProjects,
    hasChanges,
    isSaving,
    toggleReordering,
    handleReorder,
    saveOrder,
    resetOrder
  };
};