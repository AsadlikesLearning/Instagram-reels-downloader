"use client";

import Link from "next/link";
import { useState } from "react";
import { Play, Menu, X } from "lucide-react";
import { InstagramVideoForm } from "@/features/instagram/components/form";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function HomePage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToForm = () => {
    const formElement = document.getElementById('download-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Gradient */}
      <div className="bg-gradient-to-b from-pink-100 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20">
        {/* Hero Content */}
        <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-12 sm:py-16 lg:py-24 text-center">
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                FINTOK — All-in-One Video Downloader
            </span>
          </div>
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Download videos from{" "}
              <span className="bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Instagram
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed">
              Paste a link from Instagram and more (coming soon). FINTOK
              fetches the best available media for fast, clean downloads. 
              <strong> Free Instagram video downloader</strong> with no registration required.
            </p>
            
            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <h3 className="font-semibold text-sm sm:text-base">High Quality</h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Best resolution available</p>
              </div>
              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-sm sm:text-base">Fast Download</h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Lightning quick processing</p>
              </div>
              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-sm sm:text-base">Secure & Private</h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">No data collection</p>
              </div>
              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-sm sm:text-base">Free Forever</h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">No registration needed</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div id="download-form" className="container mx-auto px-3 sm:px-4 lg:px-6 -mt-8 sm:-mt-12 relative z-10">
        <div className="max-w-2xl mx-auto">
          <InstagramVideoForm />
        </div>
      </div>

      {/* Additional Info Section */}
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">
            Why choose <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">FINTOK</span> for Instagram video downloads?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Multiple Platforms</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Support for Instagram, TikTok, YouTube, Facebook, and more social media platforms.</p>
            </div>
            <div className="p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Mobile Friendly</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Optimized for all devices - desktop, tablet, and mobile phones.</p>
            </div>
            <div className="p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Instant Download</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Get your videos in seconds with our high-speed processing engine.</p>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-12 sm:py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center">
            The Best Free Instagram Video Downloader - FINTOK
          </h2>
          
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              <strong>FINTOK</strong> is the leading <strong>free Instagram video downloader</strong> that allows you to 
              <strong> download Instagram videos</strong>, <strong>Instagram reels</strong>, and <strong>Instagram stories</strong> 
              in high quality without any watermarks. Our <strong>Instagram video downloader</strong> is completely free to use 
              and requires no registration or software installation.
            </p>

            <h3 className="text-xl font-semibold mb-4">How to Download Instagram Videos with FINTOK</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300 mb-6">
              <li>Copy the Instagram video URL from your browser or the Instagram app</li>
              <li>Paste the link into our <strong>Instagram video downloader</strong> above</li>
              <li>Click "Download" and get your video in seconds</li>
              <li>Save the video to your device in the highest available quality</li>
            </ol>

            <h3 className="text-xl font-semibold mb-4">Features of Our Instagram Video Downloader</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 mb-6">
              <li><strong>Free Instagram video downloader</strong> - No cost, no hidden fees</li>
              <li><strong>Download Instagram reels</strong> - Save Instagram reels in HD quality</li>
              <li><strong>Instagram story downloader</strong> - Download Instagram stories before they expire</li>
              <li><strong>High quality downloads</strong> - Get videos in the best available resolution</li>
              <li><strong>No watermark</strong> - Clean downloads without Instagram watermarks</li>
              <li><strong>Fast processing</strong> - Download videos in seconds</li>
              <li><strong>Mobile friendly</strong> - Works on all devices and browsers</li>
              <li><strong>Secure and private</strong> - No data collection or storage</li>
            </ul>

            <h3 className="text-xl font-semibold mb-4">Supported Instagram Content Types</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Our <strong>Instagram video downloader</strong> supports all types of Instagram content:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 mb-6">
              <li>Instagram videos from posts</li>
              <li>Instagram reels</li>
              <li>Instagram stories</li>
              <li>IGTV videos</li>
              <li>Instagram live videos (when available)</li>
            </ul>

            <h3 className="text-xl font-semibold mb-4">Why Choose FINTOK for Instagram Downloads?</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              FINTOK is the most trusted <strong>free Instagram video downloader</strong> because we offer:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 mb-6">
              <li>100% free service with no limitations</li>
              <li>No registration or account creation required</li>
              <li>Works on all devices - desktop, mobile, and tablet</li>
              <li>Supports all major browsers</li>
              <li>Regular updates and improvements</li>
              <li>Fast and reliable download speeds</li>
              <li>Privacy-focused - we don't store your data</li>
            </ul>

            <h3 className="text-xl font-semibold mb-4">Instagram Video Downloader FAQ</h3>
            <div className="space-y-4 mb-6">
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Is FINTOK Instagram video downloader free?</h4>
                <p className="text-gray-600 dark:text-gray-300">Yes, FINTOK is completely free to use. No registration, no hidden fees, no premium plans.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Can I download Instagram reels with FINTOK?</h4>
                <p className="text-gray-600 dark:text-gray-300">Absolutely! Our Instagram video downloader supports all Instagram content including reels, stories, and regular posts.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Does FINTOK work on mobile devices?</h4>
                <p className="text-gray-600 dark:text-gray-300">Yes, FINTOK works on all devices including Android, iPhone, iPad, and desktop computers.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Is it safe to use FINTOK Instagram downloader?</h4>
                <p className="text-gray-600 dark:text-gray-300">Yes, FINTOK is completely safe and secure. We don't collect personal data or store your downloads.</p>
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-4">Best Instagram Video Downloader Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">High Quality Downloads</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">Download Instagram videos in the highest available quality, up to 4K resolution.</p>
              </div>
              <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">No Watermarks</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">Get clean downloads without any Instagram watermarks or branding.</p>
              </div>
              <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Fast Processing</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">Download videos in seconds with our optimized processing engine.</p>
              </div>
              <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Mobile Optimized</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">Works perfectly on all mobile devices and tablets.</p>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-300 text-center font-medium">
              Start downloading Instagram videos for free today with FINTOK - the best 
              <strong> Instagram video downloader</strong> available online!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
