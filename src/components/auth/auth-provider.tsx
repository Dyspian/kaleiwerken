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
    // Hardcoded override voor de eigenaar om loops te voorkomen
    if (currentUser.email === 'jmmysalau@gmail.com') {
      console.log("Owner detected, forcing admin role");
      return { ...currentUser, role: 'admin' };
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', currentUser.id)
        .single();

      if (error) {
        console.warn("Geen profiel gevonden voor", currentUser.email, "standaard naar 'user'");
        return { ...currentUser, role: 'user' };
      }
      
      console.log("Role fetched for", currentUser.email, ":", data?.role);
      return { ...currentUser, role: data?.role || 'user' };
    } catch (e) {
      console.error("Error fetching role:", e);
      return { ...currentUser, role: 'user' };
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    const initialize = async () => {
      if (!isMounted) return;
      
      setLoading(true);
      try {
        // Voeg een kleine vertraging toe om race conditions te voorkomen
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (initialSession && isMounted) {
          const userWithRole = await fetchRole(initialSession.user);
          setUser(userWithRole);
          setSession(initialSession);
        }
      } catch (e) {
        console.error("Auth initialization error:", e);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initialize();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log("Auth state change:", event);
      
      // Voorkom race conditions door te controleren of de component nog gemount is
      if (!isMounted) return;
      
      if (currentSession) {
        const userWithRole = await fetchRole(currentSession.user);
        setUser(userWithRole);
        setSession(currentSession);
      } else {
        setUser(null);
        setSession(null);
      }
      if (isMounted) {
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    localStorage.clear(); // Clear everything to be sure
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);