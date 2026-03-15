"use client";

import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { supabase } from "@/integrations/supabase/client";
import {
  Loader2, Mail, Phone, MapPin, Calendar, CheckCircle2, Circle, Trash2, Edit, Save, X,
  Search, Filter, ChevronUp, ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  postal_code?: string;
  project_type: string;
  surface_area: string;
  surface_type: string;
  timing: string;
  status: 'nieuw' | 'gecontacteerd' | 'offerte_verzonden' | 'gearchiveerd' | 'afgewezen';
  notes?: string;
  created_at: string;
}

const LEADS_PER_PAGE = 10;

export default function AdminLeadsPage() {
  const { user, loading: authLoading } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<Lead['status'] | 'all'>('all');
  const [sortBy, setSortBy] = useState<keyof Lead>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalLeadsCount, setTotalLeadsCount] = useState(0);

  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const isAllSelected = useMemo(() => {
    const currentLeadsOnPage = leads.filter(lead => {
      // Filter leads that are currently displayed based on search/filter
      const matchesSearch = searchQuery ? (lead.name.toLowerCase().includes(searchQuery.toLowerCase()) || lead.email.toLowerCase().includes(searchQuery.toLowerCase())) : true;
      const matchesStatus = filterStatus !== 'all' ? lead.status === filterStatus : true;
      return matchesSearch && matchesStatus;
    });
    return currentLeadsOnPage.length > 0 && currentLeadsOnPage.every(lead => selectedLeads.has(lead.id));
  }, [leads, selectedLeads, searchQuery, filterStatus]);
  const isAnySelected = selectedLeads.size > 0;


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
          description: `${newLead.project_type} - ${newLead.postal_code}`,
          action: {
            label: 'Bekijk',
            onClick: () => {
              // Optionally navigate or open the lead in a dialog
              fetchLeads(); // Refresh the list
            },
          },
        });
        fetchLeads(); // Refresh the list to show the new lead
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
      query = query.or(`name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`);
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

  const totalPages = Math.ceil(totalLeadsCount / LEADS_PER_PAGE);

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

  const handleEditClick = (lead: Lead) => {
    setEditingLead({ ...lead });
    setIsEditDialogOpen(true);
  };

  const saveLead = async () => {
    if (!editingLead) return;

    const { error } = await supabase
      .from("leads")
      .update({
        name: editingLead.name,
        email: editingLead.email,
        phone: editingLead.phone,
        status: editingLead.status,
        notes: editingLead.notes,
        postal_code: editingLead.postal_code,
        project_type: editingLead.project_type,
        surface_area: editingLead.surface_area,
        surface_type: editingLead.surface_type,
        timing: editingLead.timing,
      })
      .eq("id", editingLead.id);

    if (error) {
      toast.error("Fout bij opslaan");
      console.error(error);
    } else {
      setLeads(leads.map(l => l.id === editingLead.id ? editingLead : l));
      setIsEditDialogOpen(false);
      toast.success("Aanvraag bijgewerkt");
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
        const matchesSearch = searchQuery ? (lead.name.toLowerCase().includes(searchQuery.toLowerCase()) || lead.email.toLowerCase().includes(searchQuery.toLowerCase())) : true;
        const matchesStatus = filterStatus !== 'all' ? lead.status === filterStatus : true;
        return matchesSearch && matchesStatus;
      });
      setSelectedLeads(new Set(currentLeadsOnPage.map(lead => lead.id)));
    } else {
      setSelectedLeads(new Set());
    }
  };

  const bulkDeleteLeads = async () => {
    if (!isAnySelected) return;
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
    if (!isAnySelected) return;
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

        <div className="bg-white p-6 border border-brand-dark/5 shadow-sm mb-8 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-dark/40" />
            <Input
              placeholder="Zoek op naam of e-mail..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 rounded-none border-brand-dark/10 focus-visible:ring-brand-bronze"
            />
          </div>

          <Select value={filterStatus} onValueChange={(val: Lead['status'] | 'all') => {
            setFilterStatus(val);
            setCurrentPage(1);
          }}>
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

          <Select value={sortBy} onValueChange={(val: keyof Lead) => setSortBy(val)}>
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
            <span className="text-sm text-brand-dark/60">{selectedLeads.size} geselecteerd</span>
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

        <div className="grid gap-6">
          {leads.length === 0 && !loading ? (
            <div className="bg-white p-12 text-center border border-brand-dark/5">
              <p className="text-brand-dark/40 italic">Geen aanvragen gevonden.</p>
            </div>
          ) : (
            <>
              <div className="bg-white p-4 border border-brand-dark/5 flex items-center gap-4">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={(checked) => handleSelectAllLeads(!!checked)}
                  className="border-brand-dark/20 data-[state=checked]:bg-brand-bronze data-[state=checked]:text-white"
                />
                <span className="text-xs uppercase tracking-widest text-brand-dark/40">Selecteer alles op deze pagina</span>
              </div>

              {leads.map((lead) => (
                <div key={lead.id} className={cn(
                  "bg-white p-8 border border-brand-dark/5 shadow-sm transition-all hover:shadow-md flex items-start gap-4",
                  lead.status === 'gecontacteerd' || lead.status === 'offerte_verzonden' || lead.status === 'gearchiveerd' || lead.status === 'afgewezen' ? 'opacity-70' : 'opacity-100'
                )}>
                  <Checkbox
                    checked={selectedLeads.has(lead.id)}
                    onCheckedChange={(checked) => handleSelectLead(lead.id, !!checked)}
                    className="mt-1 border-brand-dark/20 data-[state=checked]:bg-brand-bronze data-[state=checked]:text-white"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-serif text-2xl">{lead.name}</h3>
                          <span
                            className={cn(
                              "flex items-center gap-1 text-[10px] uppercase tracking-widest px-2 py-1 border",
                              lead.status === 'nieuw'
                                ? "border-brand-bronze text-brand-bronze"
                                : lead.status === 'gecontacteerd'
                                  ? "border-blue-600 text-blue-600"
                                  : lead.status === 'offerte_verzonden'
                                    ? "border-purple-600 text-purple-600"
                                    : lead.status === 'gearchiveerd'
                                      ? "border-gray-600 text-gray-600"
                                      : "border-red-600 text-red-600"
                            )}
                          >
                            {lead.status === 'nieuw' ? <Circle size={10} /> : <CheckCircle2 size={10} />}
                            {lead.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-brand-dark/40">
                          <a href={`mailto:${lead.email}`} className="flex items-center gap-1 hover:text-brand-bronze transition-colors"><Mail size={14} /> {lead.email}</a>
                          {lead.phone && <a href={`tel:${lead.phone}`} className="flex items-center gap-1 hover:text-brand-bronze transition-colors"><Phone size={14} /> {lead.phone}</a>}
                          {lead.postal_code && <span className="flex items-center gap-1"><MapPin size={14} /> {lead.postal_code}</span>}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={() => handleEditClick(lead)} className="rounded-none border-brand-dark/10 hover:bg-brand-stone">
                          <Edit size={16} />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => deleteLead(lead.id)} className="rounded-none border-brand-dark/10 hover:bg-red-50 hover:text-red-600">
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-6 border-t border-brand-dark/5">
                      <div>
                        <span className="text-[10px] uppercase tracking-widest text-brand-dark/30 block mb-1">Project</span>
                        <span className="capitalize font-medium">{lead.project_type}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-widest text-brand-dark/30 block mb-1">Oppervlakte</span>
                        <span className="font-medium">{lead.surface_area} m²</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-widest text-brand-dark/30 block mb-1">Ondergrond</span>
                        <span className="capitalize font-medium">{lead.surface_type}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-widest text-brand-dark/30 block mb-1">Ontvangen</span>
                        <span className="font-medium">{format(new Date(lead.created_at), "d MMM yyyy", { locale: nl })}</span>
                      </div>
                    </div>

                    {lead.notes && (
                      <div className="mt-6 p-4 bg-brand-stone/30 border-l-2 border-brand-bronze">
                        <span className="text-[10px] uppercase tracking-widest text-brand-dark/40 block mb-1">Interne Notities</span>
                        <p className="text-sm text-brand-dark/70 italic">{lead.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="rounded-none border-brand-dark/10 hover:bg-brand-stone"
            >
              Vorige
            </Button>
            <span className="text-sm text-brand-dark/60">Pagina {currentPage} van {totalPages}</span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="rounded-none border-brand-dark/10 hover:bg-brand-stone"
            >
              Volgende
            </Button>
          </div>
        )}


        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px] bg-brand-white border-brand-dark/5 rounded-none">
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl">Aanvraag Bewerken</DialogTitle>
              <DialogDescription>Bewerk de details en status van deze aanvraag.</DialogDescription>
            </DialogHeader>

            {editingLead && (
              <div className="space-y-6 py-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Naam</Label>
                    <Input
                      id="name"
                      value={editingLead.name}
                      onChange={(e) => setEditingLead({ ...editingLead, name: e.target.value })}
                      className="rounded-none border-brand-dark/10"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={editingLead.email}
                        onChange={(e) => setEditingLead({ ...editingLead, email: e.target.value })}
                        className="rounded-none border-brand-dark/10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefoon</Label>
                      <Input
                        id="phone"
                        value={editingLead.phone || ''}
                        onChange={(e) => setEditingLead({ ...editingLead, phone: e.target.value })}
                        className="rounded-none border-brand-dark/10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postcode</Label>
                    <Input
                      id="postalCode"
                      value={editingLead.postal_code || ''}
                      onChange={(e) => setEditingLead({ ...editingLead, postal_code: e.target.value })}
                      className="rounded-none border-brand-dark/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="projectType">Project Type</Label>
                    <Select
                      value={editingLead.project_type}
                      onValueChange={(val) => setEditingLead({ ...editingLead, project_type: val as Lead['project_type'] })}
                    >
                      <SelectTrigger className="rounded-none border-brand-dark/10">
                        <SelectValue placeholder="Selecteer project type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gevel">Gevel</SelectItem>
                        <SelectItem value="binnen">Binnen</SelectItem>
                        <SelectItem value="totaal">Totaal</SelectItem>
                        <SelectItem value="renovatie">Renovatie</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="surfaceArea">Oppervlakte (m²)</Label>
                    <Input
                      id="surfaceArea"
                      value={editingLead.surface_area}
                      onChange={(e) => setEditingLead({ ...editingLead, surface_area: e.target.value })}
                      className="rounded-none border-brand-dark/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="surfaceType">Ondergrond Type</Label>
                    <Select
                      value={editingLead.surface_type}
                      onValueChange={(val) => setEditingLead({ ...editingLead, surface_type: val as Lead['surface_type'] })}
                    >
                      <SelectTrigger className="rounded-none border-brand-dark/10">
                        <SelectValue placeholder="Selecteer ondergrond type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="baksteen">Baksteen</SelectItem>
                        <SelectItem value="crepi">Crepi</SelectItem>
                        <SelectItem value="onbekend">Onbekend</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timing">Timing</Label>
                    <Select
                      value={editingLead.timing}
                      onValueChange={(val) => setEditingLead({ ...editingLead, timing: val as Lead['timing'] })}
                    >
                      <SelectTrigger className="rounded-none border-brand-dark/10">
                        <SelectValue placeholder="Selecteer timing" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asap">Zo snel mogelijk</SelectItem>
                        <SelectItem value="1-3_maanden">Binnen 1-3 maanden</SelectItem>
                        <SelectItem value="later">Later dit jaar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={editingLead.status}
                      onValueChange={(val) => setEditingLead({ ...editingLead, status: val as Lead['status'] })}
                    >
                      <SelectTrigger className="rounded-none border-brand-dark/10">
                        <SelectValue placeholder="Selecteer status" />
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
                  <div className="space-y-2">
                    <Label htmlFor="notes">Interne Notities</Label>
                    <Textarea
                      id="notes"
                      value={editingLead.notes || ''}
                      onChange={(e) => setEditingLead({ ...editingLead, notes: e.target.value })}
                      placeholder="Bijv. Afspraak gemaakt voor dinsdag..."
                      className="rounded-none border-brand-dark/10 min-h-[100px]"
                    />
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="rounded-none border-brand-dark/10">
                Annuleren
              </Button>
              <Button onClick={saveLead} className="bg-brand-dark text-white rounded-none hover:bg-brand-bronze transition-colors">
                <Save size={16} className="mr-2" /> Wijzigingen Opslaan
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}