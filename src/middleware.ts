import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'; // Import for Supabase client in middleware

const locales = ['nl', 'en', 'fr', 'de'];
const defaultLocale = 'nl';

function getLocale(request: NextRequest): string | undefined {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  return matchLocale(languages, locales, defaultLocale);
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const locale = getLocale(request); // Get locale early

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
    const supabase = createMiddlewareClient({ req: request, res: NextResponse.next() });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      // No session, redirect to login
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    }

    // Fetch user's role from profiles table
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (error || profile?.role !== 'admin') {
      // User is not an admin or profile not found, redirect to home or login
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.jpeg).*)'],
};