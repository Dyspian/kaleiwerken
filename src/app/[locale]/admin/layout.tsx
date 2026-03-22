"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || 'nl';

  useEffect(() => {
    // Alleen actie ondernemen als het laden klaar is
    if (!loading) {
      if (!user) {
        console.log("Geen gebruiker gevonden, redirect naar login");
        router.push(`/${locale}/login`);
      } else if (user.role !== 'admin' && user.email !== 'jmmysalau@gmail.com') {
        console.log("Geen admin rechten, redirect naar home");
        router.push(`/${locale}`);
      }
    }
  }, [user, loading, router, locale]);

  // Toon een laadscherm zolang we de status controleren
  if (loading || !user || (user.role !== 'admin' && user.email !== 'jmmysalau@gmail.com')) {
    return (
      <div className="min-h-screen bg-brand-stone flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-brand-bronze mx-auto mb-4" size={48} />
          <p className="text-brand-dark/60 font-serif">Beveiligde verbinding opbouwen...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}