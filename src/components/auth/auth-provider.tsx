"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

type AuthContextType = {
  session: Session | null;
  user: (User & { role?: string }) | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<(User & { role?: string }) | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRole = async (currentUser: User) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', currentUser.id)
        .single();

      if (error) {
        console.warn("Geen profiel gevonden, standaard naar 'user'");
        return { ...currentUser, role: 'user' };
      }
      return { ...currentUser, role: data?.role || 'user' };
    } catch (e) {
      return { ...currentUser, role: 'user' };
    }
  };

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      
      if (initialSession) {
        const userWithRole = await fetchRole(initialSession.user);
        setUser(userWithRole);
        setSession(initialSession);
      }
      setLoading(false);
    };

    initialize();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (currentSession) {
        const userWithRole = await fetchRole(currentSession.user);
        setUser(userWithRole);
        setSession(currentSession);
      } else {
        setUser(null);
        setSession(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);