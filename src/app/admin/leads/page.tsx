"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Mail, Phone, MapPin, Calendar, CheckCircle2, Circle } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { cn } from "@/lib/utils";

export default function AdminLeadsPage() {
  const { user, loading: authLoading } = useAuth();
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
        <header className="mb-12">
          <h1 className="font-serif text-4xl mb-2">Offerte Aanvragen</h1>
          <p className="text-brand-dark/60">Bekijk en beheer binnengekomen leads.</p>
        </header>

        <div className="grid gap-6">
          {leads.length === 0 ? (
            <div className="bg-white p-12 text-center border border-brand-dark/5">
              <p className="text-brand-dark/40 italic">Nog geen aanvragen ontvangen.</p>
            </div>
          ) : (
            leads.map((lead) => (
              <div key={lead.id} className={cn(
                "bg-white p-8 border border-brand-dark/5 shadow-sm transition-opacity",
                lead.status === 'gecontacteerd' ? 'opacity-60' : 'opacity-100'
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
                    <div className="flex gap-4 text-sm text-brand-dark/40">
                        <a href={`mailto:${lead.email}`} className="flex items-center gap-1 hover:text-brand-bronze transition-colors"><Mail size={14} /> {lead.email}</a>
                        <a href={`tel:${lead.phone}`} className="flex items-center gap-1 hover:text-brand-bronze transition-colors"><Phone size={14} /> {lead.phone}</a>
                        <span className="flex items-center gap-1"><MapPin size={14} /> {lead.postal_code}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-widest text-brand-dark/30 block mb-1">Ontvangen op</span>
                    <span className="text-sm font-mono">{format(new Date(lead.created_at), "d MMMM yyyy", { locale: nl })}</span>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-8 pt-6 border-t border-brand-dark/5">
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
                        <span className="text-[10px] uppercase tracking-widest text-brand-dark/30 block mb-1">Timing</span>
                        <span className="font-medium">{lead.timing.replace('_', ' ')}</span>
                    </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}