"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { Loader2 } from "lucide-react";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { useLeads, Lead } from "@/hooks/use-leads";
import { LeadListControls } from "@/components/admin/leads/LeadListControls";
import { LeadCard } from "@/components/admin/leads/LeadCard";
import { LeadPagination } from "@/components/admin/leads/LeadPagination";
import { EditLeadDialog } from "@/components/admin/leads/EditLeadDialog";

export default function AdminLeadsPage() {
  const { user, loading: authLoading } = useAuth();
  const {
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
  } = useLeads(user, authLoading);

  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEditClick = (lead: Lead) => {
    setEditingLead({ ...lead });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (editingLead) {
      const success = await saveLead(editingLead);
      if (success) {
        setIsEditDialogOpen(false);
      }
    }
  };

  const isAllSelectedOnPage = leads.length > 0 && leads.every(lead => selectedLeads.has(lead.id));
  const isAnySelected = selectedLeads.size > 0;

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-brand-stone flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-bronze" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-stone flex">
      <AdminSidebar />

      <main className="flex-1 p-12">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="font-serif text-4xl mb-2">Offerte Aanvragen</h1>
            <p className="text-brand-dark/60">Bekijk en beheer binnengekomen leads.</p>
          </div>
        </header>

        <LeadListControls
          searchQuery={searchQuery}
          setSearchQuery={(query: string) => { setSearchQuery(query); setCurrentPage(1); }}
          filterStatus={filterStatus}
          setFilterStatus={(status: Lead['status'] | 'all') => { setFilterStatus(status); setCurrentPage(1); }}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          isAnySelected={isAnySelected}
          selectedLeadsCount={selectedLeads.size}
          bulkDeleteLeads={bulkDeleteLeads}
          bulkUpdateStatus={bulkUpdateStatus}
          isAllSelected={isAllSelectedOnPage}
          handleSelectAllLeads={handleSelectAllLeads}
        />

        <div className="grid gap-6">
          {leads.length === 0 ? (
            <div className="bg-white p-12 text-center border border-brand-dark/5">
              <p className="text-brand-dark/40 italic">Geen aanvragen gevonden.</p>
            </div>
          ) : (
            leads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onEdit={handleEditClick}
                onDelete={deleteLead}
                isSelected={selectedLeads.has(lead.id)}
                onSelect={handleSelectLead}
              />
            ))
          )}
        </div>

        <LeadPagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />

        <EditLeadDialog
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          editingLead={editingLead}
          setEditingLead={(lead: Lead) => setEditingLead(lead)}
          onSave={handleSaveEdit}
        />
      </main>
    </div>
  );
}