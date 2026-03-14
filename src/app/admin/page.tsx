"use client";

import { useAuth } from '@/components/auth/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, FolderKanban, LogOut, User } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) return null;

  return (
    <div className="min-h-screen bg-brand-stone flex">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-dark text-brand-stone p-8 flex flex-col">
        <div className="mb-12">
          <h2 className="font-serif text-xl italic">Van Roey Admin</h2>
        </div>
        
        <nav className="flex-1 space-y-4">
          <Link href="/admin" className="flex items-center gap-3 text-brand-bronze">
            <LayoutDashboard size={18} /> Overzicht
          </Link>
          <Link href="/admin/projects" className="flex items-center gap-3 hover:text-brand-bronze transition-colors">
            <FolderKanban size={18} /> Projecten
          </Link>
        </nav>

        <div className="pt-8 border-t border-white/10">
          <div className="flex items-center gap-3 mb-6 text-sm opacity-60">
            <User size={16} /> {user.email}
          </div>
          <Button 
            variant="ghost" 
            onClick={() => signOut()} 
            className="w-full justify-start p-0 hover:bg-transparent hover:text-brand-bronze text-brand-stone/60"
          >
            <LogOut size={18} className="mr-3" /> Uitloggen
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12">
        <header className="mb-12">
          <h1 className="font-serif text-4xl">Welkom terug</h1>
          <p className="text-brand-dark/60">Beheer hier de inhoud van uw website.</p>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 border border-brand-dark/5 shadow-sm">
            <h3 className="font-serif text-xl mb-4">Projecten</h3>
            <p className="text-sm text-brand-dark/60 mb-6">Voeg nieuwe realisaties toe of bewerk bestaande projecten.</p>
            <Button asChild className="bg-brand-dark text-white rounded-none">
              <Link href="/admin/projects">Beheer Projecten</Link>
            </Button>
          </div>
          
          <div className="bg-white p-8 border border-brand-dark/5 shadow-sm opacity-50">
            <h3 className="font-serif text-xl mb-4">Aanvragen</h3>
            <p className="text-sm text-brand-dark/60 mb-6">Binnenkort: Bekijk hier alle binnengekomen offerte-aanvragen.</p>
            <Button disabled className="bg-brand-dark text-white rounded-none">Bekijk Aanvragen</Button>
          </div>
        </div>
      </main>
    </div>
  );
}