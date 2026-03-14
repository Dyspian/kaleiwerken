"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FolderKanban, LogOut, User, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-provider";
import { cn } from "@/lib/utils";

export const AdminSidebar = () => {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const navItems = [
    { href: "/admin", label: "Overzicht", icon: LayoutDashboard },
    { href: "/admin/projects", label: "Projecten", icon: FolderKanban },
    { href: "/admin/leads", label: "Aanvragen", icon: MessageSquare },
  ];

  return (
    <aside className="w-64 bg-brand-dark text-brand-stone p-8 flex flex-col h-screen sticky top-0">
      <div className="mb-12">
        <h2 className="font-serif text-xl italic">Van Roey Admin</h2>
      </div>
      
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          
          return (
            <Link 
              key={item.href}
              href={item.href} 
              className={cn(
                "flex items-center gap-3 px-4 py-3 transition-colors rounded-none border-l-2",
                isActive 
                  ? "text-brand-bronze border-brand-bronze bg-white/5" 
                  : "text-brand-stone/60 border-transparent hover:text-brand-stone hover:bg-white/5"
              )}
            >
              <Icon size={18} /> {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="pt-8 border-t border-white/10">
        <div className="flex items-center gap-3 mb-6 text-[10px] uppercase tracking-widest opacity-40 overflow-hidden">
          <User size={14} className="shrink-0" /> 
          <span className="truncate">{user?.email}</span>
        </div>
        <Button 
          variant="ghost" 
          onClick={() => signOut()} 
          className="w-full justify-start p-0 h-auto py-2 hover:bg-transparent hover:text-brand-bronze text-brand-stone/60 transition-colors"
        >
          <LogOut size={18} className="mr-3" /> Uitloggen
        </Button>
      </div>
    </aside>
  );
};