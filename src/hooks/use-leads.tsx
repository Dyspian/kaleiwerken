"use client";

import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  postal_code?: string;
  city?: string; // Nieuwe kolom
  project_type: string;
  surface_area?: string; // Made optional since we're replacing it
  surface_type: string;
  timing: string;
  status: 'nieuw' | 'gecontacteerd' | 'offerte_verzonden' | 'gearchiveerd' | 'afgewezen';
  notes?: string;
  comment?: string; // Added comment field
  created_at: string;
}

const LEADS_PER_PAGE = 10;

export const useLeads = (user: User | null, authLoading: boolean) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<Lead['status'] | 'all'>('all');
  const [sortBy, setSortBy] = useState<keyof Lead>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalLeadsCount, setTotalLeadsCount] = useState(0);
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());

  const totalPages = useMemo(() => Math.ceil(totalLeadsCount / LEADS_PER_PAGE), [totalLeadsCount]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchLeads();
    }
  }, [user, authLoading, searchQuery, filterStatus, sortBy, sortOrder, currentPage]);

  useEffect(() => {
    const channel = supabase
      .channel('leads_channel')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'leads' }, (payload) => {
        const newLead = payload.new as Lead;
        toast.info(`Nieuwe aanvraag van ${newLead.name}!`, {
          description: `${newLead.project_type} - ${newLead.postal_code} ${newLead.city || ''}`,
          action: {
            label: 'Bekijk',
            onClick: () => {
              fetchLeads();
            },
          },
        });
        fetchLeads();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    let query = supabase.from("leads").select("*", { count: 'exact' });

    if (searchQuery) {
      query = query.or(`name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,city.ilike.%${searchQuery}%,comment.ilike.%${searchQuery}%`);
    }

    if (filterStatus !== 'all') {
      query = query.eq("status", filterStatus);
    }

    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    const from = (currentPage - 1) * LEADS_PER_PAGE;
    const to = from + LEADS_PER_PAGE - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      toast.error("Fout bij ophalen aanvragen");
      console.error(error);
    } else {
      setLeads(data || []);
      setTotalLeadsCount(count || 0);
    }
    setLoading(false);
  };

  const deleteLead = async (id: string) => {
    if (!confirm("Weet je zeker dat je deze aanvraag wilt verwijderen?")) return;

    const { error } = await supabase.from("leads").delete().eq("id", id);

    if (error) {
      toast.error("Fout bij verwijderen");
    } else {
      setLeads(leads.filter(l => l.id !== id));
      setTotalLeadsCount(prev => prev - 1);
      toast.success("Aanvraag verwijderd");
      setSelectedLeads(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const saveLead = async (updatedLead: Lead) => {
    const { error } = await supabase
      .from("leads")
      .update({
        name: updatedLead.name,
        email: updatedLead.email,
        phone: updatedLead.phone,
        status: updatedLead.status,
        notes: updatedLead.notes,
        postal_code: updatedLead.postal_code,
        city: updatedLead.city,
        project_type: updatedLead.project_type,
        surface_area: updatedLead.surface_area,
        surface_type: updatedLead.surface_type,
        timing: updatedLead.timing,
        comment: updatedLead.comment, // Added comment field
      })
      .eq("id", updatedLead.id);

    if (error) {
      toast.error("Fout bij opslaan");
      console.error(error);
      return false;
    } else {
      setLeads(leads.map(l => l.id === updatedLead.id ? updatedLead : l));
      toast.success("Aanvraag bijgewerkt");
      return true;
    }
  };

  const handleSelectLead = (id: string, checked: boolean) => {
    setSelectedLeads(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  };

  const handleSelectAllLeads = (checked: boolean) => {
    if (checked) {
      const currentLeadsOnPage = leads.filter(lead => {
        const matchesSearch = searchQuery ? (lead.name.toLowerCase().includes(searchQuery.toLowerCase()) || lead.email.toLowerCase().includes(searchQuery.toLowerCase()) || (lead.comment && lead.comment.toLowerCase().includes(searchQuery.toLowerCase()))) : true;
        const matchesStatus = filterStatus !== 'all' ? lead.status === filterStatus : true;
        return matchesSearch && matchesStatus;
      });
      setSelectedLeads(new Set(currentLeadsOnPage.map(lead => lead.id)));
    } else {
      setSelectedLeads(new Set());
    }
  };

  const bulkDeleteLeads = async () => {
    if (selectedLeads.size === 0) return;
    if (!confirm(`Weet je zeker dat je ${selectedLeads.size} aanvraag(en) wilt verwijderen?`)) return;

    setLoading(true);
    const { error } = await supabase.from("leads").delete().in("id", Array.from(selectedLeads));

    if (error) {
      toast.error("Fout bij bulk verwijderen");
      console.error(error);
    } else {
      toast.success(`${selectedLeads.size} aanvraag(en) verwijderd`);
      setSelectedLeads(new Set());
      fetchLeads();
    }
    setLoading(false);
  };

  const bulkUpdateStatus = async (newStatus: Lead['status']) => {
    if (selectedLeads.size === 0) return;
    if (!confirm(`Weet je zeker dat je de status van ${selectedLeads.size} aanvraag(en) wilt wijzigen naar "${newStatus}"?`)) return;

    setLoading(true);
    const { error } = await supabase
      .from("leads")
      .update({ status: newStatus })
      .in("id", Array.from(selectedLeads));

    if (error) {
      toast.error("Fout bij bulk status update");
      console.error(error);
    } else {
      toast.success(`Status van ${selectedLeads.size} aanvraag(en) bijgewerkt`);
      setSelectedLeads(new Set());
      fetchLeads();
    }
    setLoading(false);
  };

  return {
    leads,
    loading,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    currentPage,
    setCurrentPage,
    totalLeadsCount,
    totalPages,
    selectedLeads,
    handleSelectLead,
    handleSelectAllLeads,
    bulkDeleteLeads,
    bulkUpdateStatus,
    deleteLead,
    saveLead,
    LEADS_PER_PAGE,
  };
};