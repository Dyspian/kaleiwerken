"use client";

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/components/auth/auth-provider';
import Link from 'next/link';

export default function LoginPage() {
  const { session, user, loading: authLoading } = useAuth(); // Get user object to check role
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || 'nl';

  useEffect(() => {
    if (session && user) { // Check if user object is also available
      if (user.role === 'admin') {
        router.push(`/${locale}/admin`);
      } else {
        router.push(`/${locale}`); // Redirect regular users to home page
      }
    }
  }, [session, user, router, locale]); // Add user to dependency array

  if (authLoading) return null;

  return (
    <div className="min-h-screen bg-brand-stone flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white p-8 shadow-2xl border border-brand-dark/5">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-3xl mb-2">Inloggen</h1>
          <p className="text-brand-dark/60 text-sm">Log in op uw account</p>
        </div>
        
        <Auth
          supabaseClient={supabase}
          view="sign_in"
          showLinks={false} // We will provide our own link to register
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
        
        <p className="mt-6 text-center text-sm text-brand-dark/60">
          Nog geen account?{' '}
          <Link href={`/${locale}/register`} className="text-brand-bronze hover:underline">
            Registreer hier
          </Link>
        </p>
        <p className="mt-8 text-center text-[10px] uppercase tracking-widest text-brand-dark/30">
          Toegang tot admin dashboard alleen voor geautoriseerde gebruikers
        </p>
      </div>
    </div>
  );
}