"use client";

import { useEffect } from "react";

export function AdvancedSEO() {
  useEffect(() => {
    // Add additional SEO meta tags dynamically
    const addAdvancedMetaTags = () => {
      const metaTags = [
        // Additional Open Graph tags
        { property: "og:site_name", content: "FINTOK" },
        { property: "og:locale", content: "en_US" },
        { property: "og:type", content: "website" },
        { property: "og:updated_time", content: new Date().toISOString() },
        
        // Twitter Card enhancements
        { name: "twitter:site", content: "@fintok" },
        { name: "twitter:creator", content: "@fintok" },
        { name: "twitter:domain", content: "fintok.com" },
        
        // Additional meta tags
        { name: "rating", content: "General" },
        { name: "distribution", content: "Global" },
        { name: "revisit-after", content: "1 days" },
        { name: "expires", content: "never" },
        { name: "language", content: "English" },
        { name: "geo.region", content: "US" },
        { name: "geo.placename", content: "United States" },
        { name: "geo.position", content: "39.8283;-98.5795" },
        { name: "ICBM", content: "39.8283, -98.5795" },
        
        // Performance hints
        { name: "dns-prefetch", content: "//fonts.googleapis.com" },
        { name: "dns-prefetch", content: "//www.google-analytics.com" },
        { name: "preconnect", content: "https://fonts.gstatic.com" },
        
        // Security headers
        { "http-equiv": "X-Content-Type-Options", content: "nosniff" },
        { "http-equiv": "X-Frame-Options", content: "DENY" },
        { "http-equiv": "X-XSS-Protection", content: "1; mode=block" },
        { "http-equiv": "Referrer-Policy", content: "strict-origin-when-cross-origin" },
        
        // Cache control
        { "http-equiv": "Cache-Control", content: "public, max-age=31536000" },
        { "http-equiv": "Expires", content: new Date(Date.now() + 31536000000).toUTCString() },
      ];

      metaTags.forEach(tag => {
        const existingTag = document.querySelector(`meta[${Object.keys(tag)[0]}="${Object.values(tag)[0]}"]`);
        if (!existingTag) {
          const meta = document.createElement('meta');
          Object.entries(tag).forEach(([key, value]) => {
            meta.setAttribute(key, value);
          });
          document.head.appendChild(meta);
        }
      });
    };

    // Add JSON-LD for additional structured data
    const addAdditionalStructuredData = () => {
      const additionalSchemas = [
        // Organization schema
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "FINTOK",
          "url": "https://fintok.com",
          "logo": "https://fintok.com/images/logo.png",
          "description": "Free Instagram video downloader for downloading Instagram videos, reels, and stories",
          "foundingDate": "2024",
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "url": "https://fintok.com/contact"
          },
          "sameAs": [
            "https://twitter.com/fintok",
            "https://facebook.com/fintok"
          ]
        },
        
        // BreadcrumbList for navigation
        {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://fintok.com"
            }
          ]
        },
        
        // Service schema
        {
          "@context": "https://schema.org",
          "@type": "Service",
          "name": "Instagram Video Download Service",
          "description": "Free service to download Instagram videos, reels, and stories",
          "provider": {
            "@type": "Organization",
            "name": "FINTOK"
          },
          "serviceType": "Video Download",
          "areaServed": "Worldwide",
          "availableChannel": {
            "@type": "ServiceChannel",
            "serviceUrl": "https://fintok.com",
            "serviceSmsNumber": null,
            "servicePhone": null
          }
        }
      ];

      additionalSchemas.forEach(schema => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
      });
    };

    // Add performance monitoring
    const addPerformanceMonitoring = () => {
      // Monitor page load performance
      window.addEventListener('load', () => {
        const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (perfData) {
          console.log('Page Load Performance:', {
            domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
            loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
            totalLoadTime: perfData.loadEventEnd - perfData.fetchStart
          });
        }
      });

      // Monitor Core Web Vitals
      if ('web-vitals' in window) {
        import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
          onCLS((metric) => {
            console.log('CLS:', metric);
            // Send to analytics if needed
          });
          onINP((metric) => {
            console.log('INP:', metric);
          });
          onFCP((metric) => {
            console.log('FCP:', metric);
          });
          onLCP((metric) => {
            console.log('LCP:', metric);
          });
          onTTFB((metric) => {
            console.log('TTFB:', metric);
          });
        }).catch(() => {
          // Web Vitals not available
        });
      }
    };

    // Initialize all SEO enhancements
    addAdvancedMetaTags();
    addAdditionalStructuredData();
    addPerformanceMonitoring();

    // Cleanup function
    return () => {
      // Remove any dynamically added elements if needed
    };
  }, []);

  return null;
}

// SEO-friendly heading component
interface SEOHeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function SEOHeading({ level, children, className = "", id }: SEOHeadingProps) {
  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
  
  return (
    <HeadingTag 
      id={id}
      className={className}
      itemProp="headline"
    >
      {children}
    </HeadingTag>
  );
}

// SEO-friendly paragraph component
interface SEOParagraphProps {
  children: React.ReactNode;
  className?: string;
}

export function SEOParagraph({ children, className = "" }: SEOParagraphProps) {
  return (
    <p className={className} itemProp="description">
      {children}
    </p>
  );
}

// SEO-friendly list component
interface SEOListProps {
  items: string[];
  ordered?: boolean;
  className?: string;
}

export function SEOList({ items, ordered = false, className = "" }: SEOListProps) {
  const ListTag = ordered ? 'ol' : 'ul';
  
  return (
    <ListTag className={className} itemProp="itemListElement">
      {items.map((item, index) => (
        <li key={index} itemProp="itemListElement">
          {item}
        </li>
      ))}
    </ListTag>
  );
}

