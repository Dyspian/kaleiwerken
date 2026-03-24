import { supabase } from '@/integrations/supabase/client';

interface SitemapPage {
  url: string;
  lastmod: string;
  changefreq: string;
  priority: number;
}

export async function GET() {
  const baseUrl = 'https://vanroey-kalei.be';

  // Fetch all projects for dynamic routes
  const { data: projects } = await supabase.from('projects').select('id, updated_at');

  // Fetch all static pages
  const staticPages = [
    { url: '/', lastmod: new Date().toISOString(), changefreq: 'weekly', priority: 1.0 },
    { url: '/over-ons', lastmod: new Date().toISOString(), changefreq: 'monthly', priority: 0.8 },
    { url: '/projecten', lastmod: new Date().toISOString(), changefreq: 'weekly', priority: 0.9 },
    { url: '/offerte', lastmod: new Date().toISOString(), changefreq: 'monthly', priority: 0.9 },
    { url: '/kaleiwerken-antwerpen', lastmod: new Date().toISOString(), changefreq: 'monthly', priority: 0.8 },
    { url: '/privacy', lastmod: new Date().toISOString(), changefreq: 'yearly', priority: 0.3 },
    { url: '/terms', lastmod: new Date().toISOString(), changefreq: 'yearly', priority: 0.3 },
  ];

  // Generate project pages
  const projectPages = (projects || []).map((project) => ({
    url: `/projecten/${project.id}`,
    lastmod: new Date(project.updated_at || new Date()).toISOString(),
    changefreq: 'monthly' as const,
    priority: 0.6,
  }));

  // Generate locale-specific pages
  const locales = ['nl', 'en', 'fr', 'de'];
  const allPages: SitemapPage[] = [];

  locales.forEach((locale) => {
    staticPages.forEach((page) => {
      allPages.push({
        url: `/${locale}${page.url === '/' ? '' : page.url}`,
        lastmod: page.lastmod,
        changefreq: page.changefreq,
        priority: page.priority,
      });
    });

    projectPages.forEach((page) => {
      allPages.push({
        url: `/${locale}${page.url}`,
        lastmod: page.lastmod,
        changefreq: page.changefreq,
        priority: page.priority,
      });
    });
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${allPages.map((page) => `
        <url>
          <loc>${baseUrl}${page.url}</loc>
          <lastmod>${page.lastmod}</lastmod>
          <changefreq>${page.changefreq}</changefreq>
          <priority>${page.priority}</priority>
        </url>
      `).join('')}
    </urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}