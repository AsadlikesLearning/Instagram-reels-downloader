"use client";

import { useEffect } from "react";

export function SEOAnalyzer() {
  useEffect(() => {
    // SEO Analysis and monitoring
    const analyzeSEO = () => {
      // Check for missing alt tags
      const imagesWithoutAlt = document.querySelectorAll('img:not([alt])');
      if (imagesWithoutAlt.length > 0) {
        console.warn(`Found ${imagesWithoutAlt.length} images without alt tags`);
      }

      // Check for missing meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription || !metaDescription.getAttribute('content')) {
        console.warn('Missing or empty meta description');
      }

      // Check for missing title
      const title = document.querySelector('title');
      if (!title || !title.textContent) {
        console.warn('Missing or empty title tag');
      }

      // Check for heading structure
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const h1Count = document.querySelectorAll('h1').length;
      if (h1Count === 0) {
        console.warn('No H1 tag found');
      } else if (h1Count > 1) {
        console.warn(`Found ${h1Count} H1 tags, should be only one`);
      }

      // Check for internal links
      const internalLinks = document.querySelectorAll('a[href^="/"], a[href^="' + window.location.origin + '"]');
      const externalLinks = document.querySelectorAll('a[href^="http"]:not([href*="' + window.location.hostname + '"])');
      
      console.log(`Internal links: ${internalLinks.length}`);
      console.log(`External links: ${externalLinks.length}`);

      // Check for structured data
      const structuredData = document.querySelectorAll('script[type="application/ld+json"]');
      console.log(`Structured data scripts: ${structuredData.length}`);

      // Check for Open Graph tags
      const ogTags = document.querySelectorAll('meta[property^="og:"]');
      console.log(`Open Graph tags: ${ogTags.length}`);

      // Check for Twitter Card tags
      const twitterTags = document.querySelectorAll('meta[name^="twitter:"]');
      console.log(`Twitter Card tags: ${twitterTags.length}`);
    };

    // Run SEO analysis after page load
    const timer = setTimeout(analyzeSEO, 1000);

    return () => clearTimeout(timer);
  }, []);

  return null;
}

// SEO-friendly breadcrumb component
interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": item.href ? `https://fintok.com${item.href}` : undefined
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      <nav aria-label="Breadcrumb" className={`flex items-center space-x-2 text-sm ${className}`}>
        {items.map((item, index) => (
          <div key={index} className="flex items-center">
            {index > 0 && (
              <span className="mx-2 text-gray-400" aria-hidden="true">
                /
              </span>
            )}
            {item.href ? (
              <a
                href={item.href}
                className="text-purple-600 hover:text-purple-700 transition-colors"
              >
                {item.label}
              </a>
            ) : (
              <span className="text-gray-600 font-medium">{item.label}</span>
            )}
          </div>
        ))}
      </nav>
    </>
  );
}

// SEO-friendly table of contents
interface TOCItem {
  id: string;
  label: string;
  level: number;
}

interface TableOfContentsProps {
  items: TOCItem[];
  className?: string;
}

export function TableOfContents({ items, className = "" }: TableOfContentsProps) {
  return (
    <nav aria-label="Table of contents" className={`${className}`}>
      <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
        Table of Contents
      </h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id} className={`ml-${(item.level - 1) * 4}`}>
            <a
              href={`#${item.id}`}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
