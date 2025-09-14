import { Metadata } from "next";
import { DM_Sans as FontSans } from "next/font/google";

import { Navbar, Footer } from "@/components/layout";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ReactQueryProvider } from "@/components/providers/react-query-provider";

import { cn } from "@/lib/utils";

import "./globals.css";


const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://fintok.com'),
  title: "FINTOK - Free Instagram Video Downloader | Download Instagram Reels & Videos",
  description: "Download Instagram videos, reels, and stories for free with FINTOK. Fast, secure, and easy-to-use Instagram video downloader. No registration required.",
  keywords: [
    "Instagram video downloader",
    "Instagram reels downloader", 
    "download Instagram videos",
    "Instagram story downloader",
    "free video downloader",
    "social media downloader",
    "Instagram to MP4",
    "video download tool"
  ],
  authors: [{ name: "FINTOK Team" }],
  creator: "FINTOK",
  publisher: "FINTOK",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://fintok.com",
    siteName: "FINTOK",
    title: "FINTOK - Free Instagram Video Downloader",
    description: "Download Instagram videos, reels, and stories for free. Fast, secure, and easy-to-use Instagram video downloader.",
    images: [
      {
        url: "/images/open-graph.png",
        width: 1200,
        height: 630,
        alt: "FINTOK - Instagram Video Downloader",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FINTOK - Free Instagram Video Downloader",
    description: "Download Instagram videos, reels, and stories for free. Fast, secure, and easy-to-use.",
    images: ["/images/open-graph.png"],
    creator: "@fintok",
  },
  alternates: {
    canonical: "https://fintok.com",
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
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/images/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="icon" href="/images/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/images/apple-touch-icon.png" />
        <link rel="manifest" href="/webmanifest.json" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="format-detection" content="telephone=no" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "FINTOK",
              "description": "Free Instagram video downloader for downloading Instagram videos, reels, and stories",
              "url": "https://fintok.com",
              "applicationCategory": "MultimediaApplication",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "creator": {
                "@type": "Organization",
                "name": "FINTOK Team"
              },
              "featureList": [
                "Download Instagram Videos",
                "Download Instagram Reels", 
                "Download Instagram Stories",
                "High Quality Downloads",
                "Fast Processing",
                "No Registration Required"
              ]
            })
          }}
        />
      </head>
      <body
        className={cn(
          fontSans.variable,
          "overflow-x-hidden bg-background font-sans antialiased"
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ReactQueryProvider>
            <Navbar />
            <main className="relative min-h-[calc(100vh-8rem)] overflow-y-auto px-2 sm:px-4 lg:px-6 mobile-scroll">
              {children}
            </main>
            <Footer />
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
