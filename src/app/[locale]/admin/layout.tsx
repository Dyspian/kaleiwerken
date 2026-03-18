"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react"; // Import Loader2

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
    if (!loading && (!user || user.role !== 'admin')) {
      router.push(`/${locale}/login`);
    }
  }, [user, loading, router, locale]);

  if (loading || !user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-brand-stone flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-bronze" size={48} />
      </div>
    );
  }

  return (
    <div className="admin-root">
      {children}
    </div>
  )
}