"use client";

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/components/auth/auth-provider';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
  const { session, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || 'nl';

  useEffect(() => {
    if (!authLoading && session && user) {
      // Forceer admin toegang voor de eigenaar
      if (user.role === 'admin' || user.email === 'jmmysalau@gmail.com') {
        console.log("Redirecting to admin dashboard...");
        router.push(`/${locale}/admin`);
      } else {
        router.push(`/${locale}`);
      }
    }
  }, [session, user, authLoading, router, locale]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-brand-stone flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-bronze" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-stone flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white p-8 shadow-2xl border border-brand-dark/5">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-3xl mb-2">Inloggen</h1>
          <p className="text-brand-dark/60 text-sm">Beheerpaneel toegang</p>
        </div>
        
        <Auth
          supabaseClient={supabase}
          view="sign_in"
          showLinks={false}
          appearance={{ 
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#1A1917',
                  brandAccent: '#8C7B6C',
                }
              }
            }
          }}
          providers={[]}
          localization={{
            variables: {
              sign_in: {
                email_label: 'E-mailadres',
                password_label: 'Wachtwoord',
                button_label: 'Inloggen',
                loading_button_label: 'Bezig met inloggen...',
              }
            }
          }}
        />
        
        <div className="mt-8 pt-6 border-t border-brand-dark/5 text-center">
          <Link href={`/${locale}`} className="text-[10px] uppercase tracking-widest text-brand-dark/40 hover:text-brand-bronze transition-colors">
            Terug naar de website
          </Link>
        </div>
      </div>
    </div>
  );
}