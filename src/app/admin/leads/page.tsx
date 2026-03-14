"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Mail, Phone, MapPin, Calendar, CheckCircle2, Circle, Trash2, Edit, Save, X } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminLeadsPage() {
  const { user, loading: authLoading } = useAuth();
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingLead, setEditingLead] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      fetchLeads();
    }
  }, [user, authLoading]);

  const fetchLeads = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Fout bij ophalen aanvragen");
    } else {
      setLeads(data || []);
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
      toast.success("Aanvraag verwijderd");
    }
  };

  const handleEditClick = (lead: any) => {
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
        postal_code: editingLead.postal_code
      })
      .eq("id", editingLead.id);

    if (error) {
      toast.error("Fout bij opslaan");
    } else {
      setLeads(leads.map(l => l.id === editingLead.id ? editingLead : l));
      setIsEditDialogOpen(false);
      toast.success("Aanvraag bijgewerkt");
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'nieuw' ? 'gecontacteerd' : 'nieuw';
    const { error } = await supabase
      .from("leads")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      toast.error("Fout bij bijwerken status");
    } else {
      setLeads(leads.map(l => l.id === id ? { ...l, status: newStatus } : l));
      toast.success(`Status bijgewerkt naar ${newStatus}`);
    }
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

        <div className="grid gap-6">
          {leads.length === 0 ? (
            <div className="bg-white p-12 text-center border border-brand-dark/5">
              <p className="text-brand-dark/40 italic">Nog geen aanvragen ontvangen.</p>
            </div>
          ) : (
            leads.map((lead) => (
              <div key={lead.id} className={cn(
                "bg-white p-8 border border-brand-dark/5 shadow-sm transition-all hover:shadow-md",
                lead.status === 'gecontacteerd' ? 'opacity-70' : 'opacity-100'
              )}>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-serif text-2xl">{lead.name}</h3>
                        <button 
                            onClick={() => toggleStatus(lead.id, lead.status)}
                            className={cn(
                                "flex items-center gap-1 text-[10px] uppercase tracking-widest px-2 py-1 border transition-colors",
                                lead.status === 'nieuw' 
                                    ? "border-brand-bronze text-brand-bronze hover:bg-brand-bronze hover:text-white" 
                                    : "border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                            )}
                        >
                            {lead.status === 'nieuw' ? <Circle size={10} /> : <CheckCircle2 size={10} />}
                            {lead.status}
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-brand-dark/40">
                        <a href={`mailto:${lead.email}`} className="flex items-center gap-1 hover:text-brand-bronze transition-colors"><Mail size={14} /> {lead.email}</a>
                        <a href={`tel:${lead.phone}`} className="flex items-center gap-1 hover:text-brand-bronze transition-colors"><Phone size={14} /> {lead.phone}</a>
                        <span className="flex items-center gap-1"><MapPin size={14} /> {lead.postal_code}</span>
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
            ))
          )}
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[500px] bg-brand-white border-brand-dark/5 rounded-none">
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl">Aanvraag Bewerken</DialogTitle>
            </DialogHeader>
            
            {editingLead && (
              <div className="space-y-6 py-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Naam</Label>
                    <Input 
                        id="name" 
                        value={editingLead.name} 
                        onChange={(e) => setEditingLead({...editingLead, name: e.target.value})}
                        className="rounded-none border-brand-dark/10"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                            id="email" 
                            value={editingLead.email} 
                            onChange={(e) => setEditingLead({...editingLead, email: e.target.value})}
                            className="rounded-none border-brand-dark/10"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Telefoon</Label>
                        <Input 
                            id="phone" 
                            value={editingLead.phone || ''} 
                            onChange={(e) => setEditingLead({...editingLead, phone: e.target.value})}
                            className="rounded-none border-brand-dark/10"
                        />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select 
                        value={editingLead.status} 
                        onValueChange={(val) => setEditingLead({...editingLead, status: val})}
                    >
                        <SelectTrigger className="rounded-none border-brand-dark/10">
                            <SelectValue placeholder="Selecteer status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="nieuw">Nieuw</SelectItem>
                            <SelectItem value="gecontacteerd">Gecontacteerd</SelectItem>
                            <SelectItem value="offerte_verzonden">Offerte Verzonden</SelectItem>
                            <SelectItem value="gearchiveerd">Gearchiveerd</SelectItem>
                        </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Interne Notities</Label>
                    <Textarea 
                        id="notes" 
                        value={editingLead.notes || ''} 
                        onChange={(e) => setEditingLead({...editingLead, notes: e.target.value})}
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