"use client";

import { useEffect } from "react";

export function SEOOptimizer() {
  useEffect(() => {
    // Add comprehensive SEO optimizations
    const optimizeSEO = () => {
      // Add schema.org structured data
      const addStructuredData = () => {
        const schemas = [
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "FINTOK Instagram Video Downloader",
            "description": "Free Instagram video downloader for downloading Instagram videos, reels, and stories",
            "url": "https://fintok.com",
            "applicationCategory": "MultimediaApplication",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "1250"
            }
          },
          {
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to Download Instagram Videos",
            "description": "Step-by-step guide to download Instagram videos using FINTOK",
            "step": [
              {
                "@type": "HowToStep",
                "name": "Copy Instagram URL",
                "text": "Copy the Instagram video URL from your browser or app"
              },
              {
                "@type": "HowToStep", 
                "name": "Paste URL",
                "text": "Paste the URL into FINTOK's downloader"
              },
              {
                "@type": "HowToStep",
                "name": "Download Video",
                "text": "Click download and save your video"
              }
            ]
          }
        ];

        schemas.forEach(schema => {
          const script = document.createElement('script');
          script.type = 'application/ld+json';
          script.textContent = JSON.stringify(schema);
          document.head.appendChild(script);
        });
      };

      // Add performance hints
      const addPerformanceHints = () => {
        const hints = [
          { rel: "dns-prefetch", href: "//fonts.googleapis.com" },
          { rel: "dns-prefetch", href: "//www.google-analytics.com" },
          { rel: "preconnect", href: "https://fonts.gstatic.com" },
          { rel: "preload", href: "/images/logo.png", as: "image" }
        ];

        hints.forEach(hint => {
          const link = document.createElement('link');
          Object.entries(hint).forEach(([key, value]) => {
            link.setAttribute(key, value);
          });
          document.head.appendChild(link);
        });
      };

      // Add meta tags for better SEO
      const addMetaTags = () => {
        const metaTags = [
          { name: "robots", content: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" },
          { name: "googlebot", content: "index, follow" },
          { name: "bingbot", content: "index, follow" },
          { name: "slurp", content: "index, follow" },
          { name: "duckduckbot", content: "index, follow" },
          { name: "revisit-after", content: "1 days" },
          { name: "rating", content: "General" },
          { name: "distribution", content: "Global" },
          { name: "language", content: "English" },
          { name: "geo.region", content: "US" },
          { name: "geo.placename", content: "United States" }
        ];

        metaTags.forEach(tag => {
          const meta = document.createElement('meta');
          Object.entries(tag).forEach(([key, value]) => {
            meta.setAttribute(key, value);
          });
          document.head.appendChild(meta);
        });
      };

      addStructuredData();
      addPerformanceHints();
      addMetaTags();
    };

    // Run optimizations after page load
    const timer = setTimeout(optimizeSEO, 100);
    return () => clearTimeout(timer);
  }, []);

  return null;
}

