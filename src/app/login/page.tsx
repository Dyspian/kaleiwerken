"use client";

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/auth-provider';

export default function LoginPage() {
  const { session, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push('/admin');
    }
  }, [session, router]);

  if (loading) return null;

  return (
    <div className="min-h-screen bg-brand-stone flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white p-8 shadow-2xl border border-brand-dark/5">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-3xl mb-2">Admin Login</h1>
          <p className="text-brand-dark/60 text-sm">Beheer uw projecten en aanvragen</p>
        </div>
        
        <Auth
          supabaseClient={supabase}
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
              }
            }
          }}
        />
      </div>
    </div>
  );
}