import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { Metadata } from "next";
import { generateSEOMetadata, generateStructuredData } from "@/components/seo-head";

export const metadata: Metadata = generateSEOMetadata({
  title: "Supported Platforms - FINTOK | Instagram, TikTok, YouTube & More",
  description: "See all supported platforms for video downloads. Currently supporting Instagram videos and reels, with TikTok, YouTube, Facebook and more coming soon.",
  keywords: [
    "supported platforms",
    "Instagram downloader",
    "TikTok downloader",
    "YouTube downloader",
    "Facebook downloader",
    "video download platforms",
    "social media downloader",
    "supported sites"
  ],
  canonical: "/supported"
});

export default function SupportedPage() {
  const supportedPlatforms = [
    {
      name: "Instagram",
      description: "Download videos, reels",
      status: "Full Support"
    },
    {
      name: "TikTok",
      description: "Download TikTok videos without watermarks",
      status: "Coming Soon"
    },
    {
      name: "YouTube",
      description: "Download YouTube videos in various qualities",
      status: "Coming Soon"
    },
    {
      name: "Facebook",
      description: "Download Facebook videos and stories",
      status: "Coming Soon"
    },
    {
      name: "X (Twitter)",
      description: "Download Twitter videos and GIFs",
      status: "Coming Soon"
    },
    {
      name: "Vimeo",
      description: "Download Vimeo videos",
      status: "Coming Soon"
    },
    {
      name: "LinkedIn",
      description: "Download LinkedIn video content",
      status: "Coming Soon"
    },
    {
      name: "Pinterest",
      description: "Download Pinterest videos",
      status: "Coming Soon"
    }
  ];

  const structuredData = generateStructuredData("ItemList", {
    name: "Supported Video Download Platforms",
    description: "List of social media platforms supported by FINTOK for video downloads",
    itemListElement: supportedPlatforms.map((platform, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: platform.name,
      description: platform.description,
      additionalProperty: {
        "@type": "PropertyValue",
        name: "Support Status",
        value: platform.status
      }
    }))
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Supported Platforms
            </h1>
            <p className="text-lg text-gray-600">
              FINTOK supports video downloads from multiple social media platforms
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {supportedPlatforms.map((platform, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{platform.name}</h3>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                    platform.status === "Full Support" 
                      ? "bg-green-100 text-green-700" 
                      : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {platform.status === "Full Support" && <CheckCircle className="h-3 w-3" />}
                    {platform.status}
                  </span>
                </div>
                <p className="text-gray-600">{platform.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="bg-purple-50 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Don't see your platform?</h2>
              <p className="text-gray-600 mb-6">
                We're constantly adding support for new platforms. Let us know which one you'd like to see next!
              </p>
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full font-medium hover:shadow-lg transition-all">
                Request a Platform
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}