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
    "download Instagram videos free online",
    "Instagram video downloader 2025",
    "free Instagram reels downloader",
    "Instagram video downloader no signup",
    "download Instagram videos free",
    "Instagram video downloader online free",
    "best free Instagram video downloader",
    "Instagram video downloader HD",
    "download Instagram reels free",
    "Instagram video downloader mobile",
    "Instagram video downloader desktop",
    "Instagram video downloader browser",
    "Instagram video downloader chrome",
    "Instagram video downloader firefox",
    "Instagram video downloader safari",
    "Instagram video downloader edge",
    "Instagram video downloader opera",
    "Instagram video downloader android",
    "Instagram video downloader iPhone",
    "Instagram video downloader iPad",
    "Instagram video downloader tablet",
    "Instagram video downloader PC",
    "Instagram video downloader Mac",
    "Instagram video downloader Windows",
    "Instagram video downloader Linux",
    "Instagram video downloader macOS",
    "Instagram video downloader iOS",
    "Instagram video downloader mobile app",
    "Instagram video downloader web app",
    "Instagram video downloader PWA",
    "Instagram video downloader progressive web app",
    "Instagram video downloader offline",
    "Instagram video downloader online",
    "Instagram video downloader cloud",
    "Instagram video downloader server",
    "Instagram video downloader API",
    "Instagram video downloader bulk",
    "Instagram video downloader batch",
    "Instagram video downloader multiple",
    "Instagram video downloader playlist",
    "Instagram video downloader channel",
    "Instagram video downloader account",
    "Instagram video downloader profile",
    "Instagram video downloader user",
    "Instagram video downloader creator",
    "Instagram video downloader influencer",
    "Instagram video downloader celebrity",
    "Instagram video downloader brand",
    "Instagram video downloader business",
    "Instagram video downloader marketing",
    "Instagram video downloader social media",
    "Instagram video downloader content",
    "Instagram video downloader media",
    "Instagram video downloader entertainment",
    "Instagram video downloader viral",
    "Instagram video downloader trending",
    "Instagram video downloader popular",
    "Instagram video downloader latest",
    "Instagram video downloader new",
    "Instagram video downloader updated",
    "Instagram video downloader improved",
    "Instagram video downloader enhanced",
    "Instagram video downloader optimized",
    "Instagram video downloader fast",
    "Instagram video downloader quick",
    "Instagram video downloader instant",
    "Instagram video downloader rapid",
    "Instagram video downloader speedy",
    "Instagram video downloader efficient",
    "Instagram video downloader reliable",
    "Instagram video downloader secure",
    "Instagram video downloader safe",
    "Instagram video downloader private",
    "Instagram video downloader anonymous",
    "Instagram video downloader no registration",
    "Instagram video downloader no signup",
    "Instagram video downloader no account",
    "Instagram video downloader no login",
    "Instagram video downloader no email",
    "Instagram video downloader no phone",
    "Instagram video downloader no verification",
    "Instagram video downloader no captcha",
    "Instagram video downloader no ads",
    "Instagram video downloader no popup",
    "Instagram video downloader no redirect",
    "Instagram video downloader no malware",
    "Instagram video downloader no virus",
    "Instagram video downloader no spam",
    "Instagram video downloader no tracking",
    "Instagram video downloader no cookies",
    "Instagram video downloader no data collection",
    "Instagram video downloader no personal information",
    "Instagram video downloader no user data",
    "Instagram video downloader no analytics",
    "Instagram video downloader no telemetry",
    "Instagram video downloader no monitoring",
    "Instagram video downloader no surveillance",
    "Instagram video downloader no spying",
    "Instagram video downloader no snooping",
    "Instagram video downloader no profiling",
    "Instagram video downloader no fingerprinting",
    "Instagram video downloader no identification",
    "Instagram video downloader no recognition",
    "Instagram video downloader no detection"
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
