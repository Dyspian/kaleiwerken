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
    // Wacht tot het laden klaar is voordat we beslissen
    if (!loading) {
      if (!user) {
        router.push(`/${locale}/login`);
      } else if (user.role !== 'admin') {
        // Als je ingelogd bent maar geen admin bent, terug naar home
        router.push(`/${locale}`);
      }
    }
  }, [user, loading, router, locale]);

  if (loading || !user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-brand-stone flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-brand-bronze mx-auto mb-4" size={48} />
          <p className="text-brand-dark/60 font-serif">Toegang controleren...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-root">
      {children}
    </div>
  )
}