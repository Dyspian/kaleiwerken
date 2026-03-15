"use client";

import React from "react";
import { Search, Filter, ChevronUp, ChevronDown, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Lead } from "@/hooks/use-leads";

interface LeadListControlsProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterStatus: Lead['status'] | 'all';
  setFilterStatus: (status: Lead['status'] | 'all') => void;
  sortBy: keyof Lead;
  setSortBy: (key: keyof Lead) => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (order: 'asc' | 'desc') => void;
  isAnySelected: boolean;
  selectedLeadsCount: number;
  bulkDeleteLeads: () => void;
  bulkUpdateStatus: (status: Lead['status']) => void;
  isAllSelected: boolean;
  handleSelectAllLeads: (checked: boolean) => void;
}

export const LeadListControls = ({
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  isAnySelected,
  selectedLeadsCount,
  bulkDeleteLeads,
  bulkUpdateStatus,
  isAllSelected,
  handleSelectAllLeads,
}: LeadListControlsProps) => {
  return (
    <>
      <div className="bg-white p-6 border border-brand-dark/5 shadow-sm mb-8 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-dark/40" />
          <Input
            placeholder="Zoek op naam of e-mail..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-none border-brand-dark/10 focus-visible:ring-brand-bronze"
          />
        </div>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[180px] rounded-none border-brand-dark/10 focus:ring-brand-bronze">
            <Filter size={16} className="mr-2 text-brand-dark/40" />
            <SelectValue placeholder="Filter op status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle statussen</SelectItem>
            <SelectItem value="nieuw">Nieuw</SelectItem>
            <SelectItem value="gecontacteerd">Gecontacteerd</SelectItem>
            <SelectItem value="offerte_verzonden">Offerte Verzonden</SelectItem>
            <SelectItem value="gearchiveerd">Gearchiveerd</SelectItem>
            <SelectItem value="afgewezen">Afgewezen</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px] rounded-none border-brand-dark/10 focus:ring-brand-bronze">
            <SelectValue placeholder="Sorteer op" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created_at">Datum</SelectItem>
            <SelectItem value="name">Naam</SelectItem>
            <SelectItem value="status">Status</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="icon"
          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          className="rounded-none border-brand-dark/10 hover:bg-brand-stone"
        >
          {sortOrder === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </Button>
      </div>

      {isAnySelected && (
        <div className="bg-white p-6 border border-brand-dark/5 shadow-sm mb-8 flex flex-wrap items-center gap-4">
          <span className="text-sm text-brand-dark/60">{selectedLeadsCount} geselecteerd</span>
          <Button
            variant="destructive"
            onClick={bulkDeleteLeads}
            className="rounded-none px-4 py-2 text-xs uppercase tracking-widest"
          >
            <Trash2 size={14} className="mr-2" /> Verwijder geselecteerde
          </Button>
          <Select onValueChange={bulkUpdateStatus}>
            <SelectTrigger className="w-[200px] rounded-none border-brand-dark/10 focus:ring-brand-bronze">
              <SelectValue placeholder="Wijzig status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nieuw">Nieuw</SelectItem>
              <SelectItem value="gecontacteerd">Gecontacteerd</SelectItem>
              <SelectItem value="offerte_verzonden">Offerte Verzonden</SelectItem>
              <SelectItem value="gearchiveerd">Gearchiveerd</SelectItem>
              <SelectItem value="afgewezen">Afgewezen</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="bg-white p-4 border border-brand-dark/5 flex items-center gap-4 mb-6">
        <Checkbox
          checked={isAllSelected}
          onCheckedChange={(checked) => handleSelectAllLeads(!!checked)}
          className="border-brand-dark/20 data-[state=checked]:bg-brand-bronze data-[state=checked]:text-white"
        />
        <span className="text-xs uppercase tracking-widest text-brand-dark/40">Selecteer alles op deze pagina</span>
      </div>
    </>
  );
};