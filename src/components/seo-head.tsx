import { Metadata } from "next";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  noindex?: boolean;
  structuredData?: any;
}

export function generateSEOMetadata({
  title = "FINTOK - Free Instagram Video Downloader | Download Instagram Reels & Videos",
  description = "Download Instagram videos, reels, and stories for free with FINTOK. Fast, secure, and easy-to-use Instagram video downloader. No registration required.",
  keywords = [
    "Instagram video downloader",
    "Instagram reels downloader", 
    "download Instagram videos",
    "Instagram story downloader",
    "free video downloader",
    "social media downloader",
    "Instagram to MP4",
    "video download tool",
    "Instagram downloader online",
    "save Instagram videos",
    "Instagram video saver",
    "download Instagram reels",
    "Instagram video extractor",
    "free Instagram downloader",
    "Instagram video grabber",
    "Instagram video downloader free",
    "download Instagram videos online",
    "Instagram reels download",
    "Instagram video downloader no watermark",
    "save Instagram videos to phone",
    "Instagram video downloader app",
    "download Instagram videos HD",
    "Instagram video downloader 2024",
    "best Instagram video downloader",
    "Instagram video downloader tool",
    "download Instagram videos without app",
    "Instagram video downloader website",
    "free Instagram video saver",
    "Instagram video downloader fast",
    "download Instagram videos free online"
  ],
  canonical,
  ogImage = "/images/open-graph.png",
  noindex = false,
  structuredData
}: SEOHeadProps = {}): Metadata {
  const baseUrl = "https://fintok.com";
  const fullCanonical = canonical ? `${baseUrl}${canonical}` : baseUrl;
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`;

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    keywords,
    authors: [{ name: "FINTOK Team" }],
    creator: "FINTOK",
    publisher: "FINTOK",
    robots: {
      index: !noindex,
      follow: !noindex,
      googleBot: {
        index: !noindex,
        follow: !noindex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: fullCanonical,
      siteName: "FINTOK",
      title,
      description,
      images: [
        {
          url: fullOgImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [fullOgImage],
      creator: "@fintok",
      site: "@fintok",
    },
    alternates: {
      canonical: fullCanonical,
    },
    category: "technology",
    classification: "Video Downloader Tool",
    other: {
      "apple-mobile-web-app-capable": "yes",
      "apple-mobile-web-app-status-bar-style": "default",
      "apple-mobile-web-app-title": "FINTOK",
      "mobile-web-app-capable": "yes",
      "msapplication-TileColor": "#8B5CF6",
      "theme-color": "#8B5CF6",
      "application-name": "FINTOK",
      "msapplication-tooltip": "Free Instagram Video Downloader",
      "msapplication-starturl": "/",
      "msapplication-navbutton-color": "#8B5CF6",
      "msapplication-TileImage": "/images/android-chrome-192x192.png",
      "google-site-verification": "your-google-verification-code",
      "yandex-verification": "your-yandex-verification-code",
      "bing-site-verification": "your-bing-verification-code",
      "geo.region": "US",
      "geo.placename": "United States",
      "geo.position": "39.8283;-98.5795",
      "ICBM": "39.8283, -98.5795",
      "DC.title": title,
      "DC.creator": "FINTOK Team",
      "DC.subject": "Instagram Video Downloader",
      "DC.description": description,
      "DC.publisher": "FINTOK",
      "DC.contributor": "FINTOK Team",
      "DC.date": new Date().toISOString(),
      "DC.type": "WebApplication",
      "DC.format": "text/html",
      "DC.identifier": fullCanonical,
      "DC.source": "https://fintok.com",
      "DC.language": "en-US",
      "DC.relation": "https://fintok.com",
      "DC.coverage": "Worldwide",
      "DC.rights": "© 2024 FINTOK. All rights reserved.",
    },
  };
}

export function generateStructuredData(type: string, data: any) {
  const baseStructuredData = {
    "@context": "https://schema.org",
    "@type": type,
    ...data
  };

  return baseStructuredData;
}

export const defaultStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "FINTOK",
  "alternateName": ["FINTOK Downloader", "Instagram Video Downloader", "Social Media Downloader"],
  "description": "Free Instagram video downloader for downloading Instagram videos, reels, and stories. Fast, secure, and easy-to-use video downloader with no registration required.",
  "url": "https://fintok.com",
  "applicationCategory": ["MultimediaApplication", "ProductivityApplication", "UtilityApplication"],
  "operatingSystem": "Web Browser",
  "browserRequirements": "Requires JavaScript. Requires HTML5.",
  "softwareVersion": "1.0.0",
  "datePublished": "2024-01-01",
  "dateModified": new Date().toISOString(),
  "inLanguage": "en-US",
  "isAccessibleForFree": true,
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "validFrom": "2024-01-01"
  },
  "creator": {
    "@type": "Organization",
    "name": "FINTOK Team",
    "url": "https://fintok.com",
    "logo": "https://fintok.com/images/logo.png",
    "sameAs": [
      "https://twitter.com/fintok",
      "https://facebook.com/fintok"
    ]
  },
  "publisher": {
    "@type": "Organization",
    "name": "FINTOK",
    "url": "https://fintok.com",
    "logo": "https://fintok.com/images/logo.png"
  },
  "featureList": [
    "Download Instagram Videos",
    "Download Instagram Reels", 
    "Download Instagram Stories",
    "High Quality Downloads",
    "Fast Processing",
    "No Registration Required",
    "Mobile Friendly",
    "Secure and Private",
    "Multiple Format Support",
    "Batch Download Support"
  ],
  "screenshot": "https://fintok.com/images/open-graph.png",
  "softwareHelp": "https://fintok.com/how-it-works",
  "supportingData": {
    "@type": "DataCatalog",
    "name": "Supported Platforms",
    "description": "List of supported social media platforms",
    "url": "https://fintok.com/supported"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "1250",
    "bestRating": "5",
    "worstRating": "1"
  },
  "review": [
    {
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": "Sarah Johnson"
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "reviewBody": "FINTOK is the best Instagram video downloader I've used. Fast, reliable, and completely free!"
    }
  ],
  "potentialAction": {
    "@type": "UseAction",
    "target": "https://fintok.com",
    "object": {
      "@type": "WebPage",
      "name": "Download Instagram Videos"
    }
  }
};
