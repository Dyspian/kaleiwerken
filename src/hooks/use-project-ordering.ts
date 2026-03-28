"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useProjectOrdering = <T extends { id: string; sort_order?: number }>(projects: T[]) => {
  const [isReordering, setIsReordering] = useState(false);
  const [orderedProjects, setOrderedProjects] = useState<T[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

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
    try {
      // Get current user for RLS policies
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Geen gebruiker gevonden");
      }

      const updates = orderedProjects.map((project, index) => ({
        id: project.id,
        sort_order: index,
        user_id: user.id // Required for RLS policies
      }));

      const { error } = await supabase
        .from('projects')
        .upsert(updates, { onConflict: 'id' });

      if (error) {
        console.error("Supabase error details:", error);
        throw new Error(`Database error: ${error.message}`);
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
    toggleReordering,
    handleReorder,
    saveOrder,
    resetOrder
  };
};