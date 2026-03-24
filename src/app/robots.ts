import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/',
        '/login/',
        '/register/',
        '/api/',
        '/_next/',
        '/static/',
      ],
    },
    sitemap: 'https://vanroey-kalei.be/sitemap.xml',
    host: 'https://vanroey-kalei.be',
  };
}