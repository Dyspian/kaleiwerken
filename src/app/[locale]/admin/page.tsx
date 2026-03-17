"use client";

import { useAuth } from '@/components/auth/auth-provider';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { supabase } from '@/integrations/supabase/client';
import { FolderKanban, MessageSquare, TrendingUp, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { nl } from 'date-fns/locale';

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || 'nl';
  
  const [stats, setStats] = useState({ projects: 0, leads: 0, recentLeads: [] as any[] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/${locale}/login`);
    } else if (user) {
      fetchStats();
    }
  }, [user, authLoading, router, locale]);

  const fetchStats = async () => {
    setLoading(true);
    const [projectsRes, leadsRes, recentLeadsRes] = await Promise.all([
      supabase.from('projects').select('id', { count: 'exact', head: true }),
      supabase.from('leads').select('id', { count: 'exact', head: true }),
      supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(3)
    ]);

    setStats({
      projects: projectsRes.count || 0,
      leads: leadsRes.count || 0,
      recentLeads: recentLeadsRes.data || []
    });
    setLoading(false);
  };

  if (authLoading || !user) return null;

  return (
    <div className="min-h-screen bg-brand-stone flex">
      <AdminSidebar />

      <main className="flex-1 p-12">
        <header className="mb-12">
          <h1 className="font-serif text-4xl mb-2">Dashboard</h1>
          <p className="text-brand-dark/60">Welkom terug. Hier is een overzicht van uw website.</p>
        </header>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-8 border border-brand-dark/5 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-brand-stone flex items-center justify-center text-brand-bronze">
                    <FolderKanban size={24} />
                </div>
                <div>
                    <span className="text-[10px] uppercase tracking-widest text-brand-dark/40 block">Projecten</span>
                    <span className="text-3xl font-serif">{stats.projects}</span>
                </div>
            </div>
          </div>

          <div className="bg-white p-8 border border-brand-dark/5 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-brand-stone flex items-center justify-center text-brand-bronze">
                    <MessageSquare size={24} />
                </div>
                <div>
                    <span className="text-[10px] uppercase tracking-widest text-brand-dark/40 block">Aanvragen</span>
                    <span className="text-3xl font-serif">{stats.leads}</span>
                </div>
            </div>
          </div>

          <div className="bg-white p-8 border border-brand-dark/5 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-brand-stone flex items-center justify-center text-brand-bronze">
                    <TrendingUp size={24} />
                </div>
                <div>
                    <span className="text-[10px] uppercase tracking-widest text-brand-dark/40 block">Status</span>
                    <span className="text-sm font-medium text-green-600">Online</span>
                </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
            <div className="bg-white p-8 border border-brand-dark/5 shadow-sm">
                <h3 className="font-serif text-xl mb-8 flex items-center gap-2">
                    <Clock size={20} className="text-brand-bronze" /> Recente Aanvragen
                </h3>
                
                <div className="space-y-6">
                    {stats.recentLeads.length === 0 ? (
                        <p className="text-sm text-brand-dark/40 italic">Nog geen aanvragen ontvangen.</p>
                    ) : (
                        stats.recentLeads.map((lead) => (
                            <div key={lead.id} className="flex justify-between items-center border-b border-brand-dark/5 pb-4 last:border-0">
                                <div>
                                    <p className="font-medium">{lead.name}</p>
                                    <p className="text-xs text-brand-dark/40">{lead.email}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-mono text-brand-dark/40">
                                        {format(new Date(lead.created_at), "d MMM", { locale: nl })}
                                    </p>
                                    <span className="text-[10px] uppercase tracking-widest text-brand-bronze">Nieuw</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="bg-brand-dark text-brand-stone p-8 flex flex-col justify-between">
                <div>
                    <h3 className="font-serif text-2xl mb-4">Snelkoppelingen</h3>
                    <p className="text-brand-stone/40 text-sm mb-8">Beheer direct uw belangrijkste onderdelen.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => router.push(`/${locale}/admin/projects/new`)} className="border border-white/10 p-4 text-left hover:bg-white/5 transition-colors">
                        <span className="text-[10px] uppercase tracking-widest block mb-2">Project</span>
                        <span className="font-serif text-lg">Toevoegen</span>
                    </button>
                    <button onClick={() => router.push(`/${locale}/admin/leads`)} className="border border-white/10 p-4 text-left hover:bg-white/5 transition-colors">
                        <span className="text-[10px] uppercase tracking-widest block mb-2">Aanvragen</span>
                        <span className="font-serif text-lg">Bekijken</span>
                    </button>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}