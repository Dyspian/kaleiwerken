"use client";

import Head from 'next/head';

interface MetaTagsProps {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: 'website' | 'article' | 'profile';
  canonicalUrl?: string;
  noIndex?: boolean;
  locale?: string;
  alternates?: {
    hreflang: string;
    href: string;
  }[];
}

export const MetaTags = ({
  title,
  description,
  keywords = [],
  ogImage = 'https://sjfosmcpbekkokmedwil.supabase.co/storage/v1/object/public/hero/hero.jpeg',
  ogType = 'website',
  canonicalUrl,
  noIndex = false,
  locale = 'nl_BE',
  alternates = []
}: MetaTagsProps) => {
  const siteName = 'Van Roey Kaleiwerken';
  const fullTitle = `${title} | ${siteName}`;
  
  const defaultKeywords = [
    'kaleiwerken',
    'gevelrenovatie',
    'kalei',
    'gevels kaleien',
    'authentieke kalei',
    'minerale pigmenten',
    'vakmanschap',
    'Antwerpen',
    'België'
  ];

  const allKeywords = Array.from(new Set([...defaultKeywords, ...keywords])).join(', ');

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={allKeywords} />
      <meta name="author" content="Van Roey Kaleiwerken" />
      <meta name="robots" content={noIndex ? 'noindex,nofollow' : 'index,follow'} />
      <meta name="googlebot" content={noIndex ? 'noindex,nofollow' : 'index,follow'} />
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={title} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content="@vanroeykalei" />
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Language Alternates */}
      {alternates.map((alt) => (
        <link key={alt.hreflang} rel="alternate" hrefLang={alt.hreflang} href={alt.href} />
      ))}
      
      {/* Additional SEO Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#1A1917" />
      <meta name="msapplication-TileColor" content="#1A1917" />
      
      {/* Schema Markup for Local Business */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": siteName,
            "url": "https://vanroey-kalei.be",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://vanroey-kalei.be/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />
    </Head>
  );
};