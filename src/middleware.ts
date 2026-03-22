import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { createClient } from '@supabase/supabase-js';

const locales = ['nl', 'en', 'fr', 'de'];
const defaultLocale = 'nl';

const SUPABASE_URL = "https://sjfosmcpbekkokmedwil.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqZm9zbWNwYmVra29rbWVkd2lsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MDAwMzQsImV4cCI6MjA4OTA3NjAzNH0.J4merO1jIzh3gysLZJx-h6hIPtUNfNeSrcovcA4rTVo";

function getLocale(request: NextRequest): string | undefined {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  return matchLocale(languages, locales, defaultLocale);
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const locale = getLocale(request);

  // Handle locale redirection first
  const pathnameIsMissingLocale = locales.every(
    (loc) => !pathname.startsWith(`/${loc}/`) && pathname !== `/${loc}`
  );

  if (pathnameIsMissingLocale) {
    return NextResponse.redirect(
      new URL(`/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url)
    );
  }

  // --- Role-based Access Control for /admin routes ---
  if (pathname.startsWith(`/${locale}/admin`)) {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    }

    // Fetch user's role from profiles table
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (error || profile?.role !== 'admin') {
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.jpeg).*)'],
};