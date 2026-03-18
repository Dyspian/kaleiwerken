"use client";

import { useState, useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/components/auth/auth-provider';
import { toast } from 'sonner';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
  const { session, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const locale = params.locale || 'nl';
  const [isSigningUp, setIsSigningUp] = useState(false);

  useEffect(() => {
    if (session) {
      // Redirect regular users to home, admins to admin dashboard
      if (session.user.role === 'admin') {
        router.push(`/${locale}/admin`);
      } else {
        router.push(`/${locale}`);
      }
    }
  }, [session, router, locale]);

  if (authLoading) return null;

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSigningUp(true);
    const form = event.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement)?.value;
    const password = (form.elements.namedItem('password') as HTMLInputElement)?.value;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: 'user', // Explicitly set role for new sign-ups
        },
        emailRedirectTo: `${window.location.origin}/${locale}/auth/callback`, // Adjust callback URL if needed
      },
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Registratie succesvol! Controleer uw e-mail voor verificatie.");
      router.push(`/${locale}/login`); // Redirect to login after successful registration
    }
    setIsSigningUp(false);
  };

  return (
    <div className="min-h-screen bg-brand-stone flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white p-8 shadow-2xl border border-brand-dark/5">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-3xl mb-2">Account Registreren</h1>
          <p className="text-brand-dark/60 text-sm">Maak een account aan om uw chatgeschiedenis te bewaren.</p>
        </div>
        
        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-brand-dark/70 mb-1">E-mailadres</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full p-3 border border-brand-dark/10 rounded-none focus:ring-brand-bronze focus:border-brand-bronze"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-brand-dark/70 mb-1">Wachtwoord</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full p-3 border border-brand-dark/10 rounded-none focus:ring-brand-bronze focus:border-brand-bronze"
            />
          </div>
          <Button
            type="submit"
            disabled={isSigningUp}
            className="w-full bg-brand-dark text-white rounded-none px-8 py-6 uppercase text-xs tracking-widest hover:bg-brand-bronze hover:text-white transition-colors"
          >
            {isSigningUp ? 'Registreren...' : 'Registreren'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-brand-dark/60">
          Al een account?{' '}
          <Link href={`/${locale}/login`} className="text-brand-bronze hover:underline">
            Log hier in
          </Link>
        </p>
      </div>
    </div>
  );
}