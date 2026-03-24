"use client";

import Script from 'next/script';

interface StructuredDataProps {
  type: 'localBusiness' | 'service' | 'product' | 'article' | 'breadcrumb';
  data: any;
}

export const StructuredData = ({ type, data }: StructuredDataProps) => {
  const getStructuredData = () => {
    switch (type) {
      case 'localBusiness':
        return {
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "Van Roey Kaleiwerken",
          "description": "Specialist in authentieke kaleiwerken voor binnen- en buitengevels met 10 jaar ervaring",
          "url": "https://vanroey-kalei.be",
          "telephone": "+32470123456",
          "email": "info@vanroey-kalei.be",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Kaleiweg 12",
            "addressLocality": "Antwerpen",
            "postalCode": "2000",
            "addressCountry": "BE"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": 51.2194,
            "longitude": 4.4025
          },
          "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            "opens": "08:00",
            "closes": "18:00"
          },
          "priceRange": "$$",
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.8",
            "reviewCount": "47"
          },
          "areaServed": [
            {
              "@type": "City",
              "name": "Antwerpen"
            },
            {
              "@type": "City", 
              "name": "Brasschaat"
            },
            {
              "@type": "City",
              "name": "Schoten"
            },
            {
              "@type": "City",
              "name": "Schilde"
            }
          ],
          "serviceType": [
            "Kaleiwerken",
            "Gevelrenovatie",
            "Minerale verven",
            "Buitenschilderwerk"
          ],
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Kaleiwerken Diensten",
            "itemListElement": [
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Gevel kaleiwerken",
                  "description": "Authentieke kalei afwerking voor buitengevels"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Binnen kaleiwerken",
                  "description": "Kalei afwerking voor binnenmuren"
                }
              },
              {
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": "Gevelrenovatie",
                  "description": "Complete gevelrenovatie met kalei afwerking"
                }
              }
            ]
          }
        };

      case 'service':
        return {
          "@context": "https://schema.org",
          "@type": "Service",
          "serviceType": "Kaleiwerken",
          "provider": {
            "@type": "LocalBusiness",
            "name": "Van Roey Kaleiwerken"
          },
          "areaServed": "Antwerpen en omgeving",
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Kaleiwerken Diensten",
            "itemListElement": data.services || []
          }
        };

      case 'breadcrumb':
        return {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": data.items.map((item: any, index: number) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": `https://vanroey-kalei.be${item.url}`
          }))
        };

      default:
        return data;
    }
  };

  const structuredData = getStructuredData();

  return (
    <Script
      id={`structured-data-${type}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};