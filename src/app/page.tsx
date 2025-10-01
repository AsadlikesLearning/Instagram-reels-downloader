"use client";

import Link from "next/link";
import { useState, Suspense, lazy } from "react";
import { Play, Menu, X } from "lucide-react";
import { PlatformSwitcher, Platform } from "@/components/platform-switcher";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorBoundary } from "@/components/error-boundary";

// Lazy load form components for better performance
const InstagramVideoForm = lazy(() => import("@/features/instagram/components/form").then(module => ({ default: module.InstagramVideoForm })));
const TikTokVideoForm = lazy(() => import("@/features/tiktok/components/form").then(module => ({ default: module.TikTokVideoForm })));
const YouTubeVideoForm = lazy(() => import("@/features/youtube/components/form").then(module => ({ default: module.YouTubeVideoForm })));

export default function HomePage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentPlatform, setCurrentPlatform] = useState<Platform>("instagram");

  const scrollToForm = () => {
    const formElement = document.getElementById('download-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Enhanced Gradient */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/30 dark:to-blue-900/30">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative container mx-auto px-3 sm:px-4 lg:px-6 py-16 sm:py-20 lg:py-28 text-center">
          <div className="mb-8 animate-fade-in-up">
            <span className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-purple-700 dark:text-purple-300 px-6 py-3 rounded-full text-sm font-medium border border-purple-200 dark:border-purple-700 shadow-lg">
              <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
              ✨ FINTOK — All-in-One Video Downloader
            </span>
          </div>
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight animate-fade-in-up animation-delay-200">
              Download videos from{" "}
              <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 bg-clip-text text-transparent animate-gradient">
                Instagram, TikTok & YouTube
              </span>
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-400">
              Paste a link from Instagram, TikTok, or YouTube. FINTOK fetches the best available media for fast, clean downloads. 
              <span className="font-semibold text-purple-600 dark:text-purple-400"> Free video downloader</span> with no registration required.
            </p>
            
            {/* Enhanced Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12 animate-fade-in-up animation-delay-600">
              <div className="group bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-white/30 dark:border-gray-700/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-gray-200">High Quality</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Best resolution available</p>
              </div>
              <div className="group bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-white/30 dark:border-gray-700/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-gray-200">Lightning Fast</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Ultra-quick processing</p>
              </div>
              <div className="group bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-white/30 dark:border-gray-700/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-gray-200">Secure & Private</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Zero data collection</p>
              </div>
              <div className="group bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-6 border border-white/30 dark:border-gray-700/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-gray-200">Free Forever</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">No registration needed</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Form Section */}
      <div id="download-form" className="container mx-auto px-3 sm:px-4 lg:px-6 -mt-16 sm:-mt-20 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Platform Switcher */}
          <div className="mb-8 animate-fade-in-up animation-delay-800">
            <PlatformSwitcher
              currentPlatform={currentPlatform}
              onPlatformChange={setCurrentPlatform}
              className="justify-center"
            />
          </div>
          
          {/* Form Container with Enhanced Styling */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 sm:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-white/30 dark:border-gray-700/30 animate-fade-in-up animation-delay-1000">
            {/* Form based on selected platform */}
            <ErrorBoundary>
              <Suspense fallback={<LoadingSpinner size="lg" text="Loading form..." />}>
                {currentPlatform === "instagram" ? (
                  <InstagramVideoForm />
                ) : currentPlatform === "tiktok" ? (
                  <TikTokVideoForm />
                ) : (
                  <YouTubeVideoForm />
                )}
              </Suspense>
            </ErrorBoundary>
          </div>
        </div>
      </div>

      {/* Additional Info Section */}
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">
            Why choose <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">FINTOK</span> for video downloads?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2">Multiple Platforms</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Support for Instagram, TikTok, YouTube, and more social media platforms.</p>
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
            The Best Free Video Downloader - FINTOK
          </h2>
          
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              <strong>FINTOK</strong> is the leading <strong>free video downloader</strong> that allows you to 
              <strong> download videos from Instagram</strong>, <strong>TikTok</strong>, and <strong>YouTube</strong> 
              in high quality without any watermarks. Our <strong>multi-platform video downloader</strong> is completely free to use 
              and requires no registration or software installation.
            </p>

            <h3 className="text-xl font-semibold mb-4">How to Download Videos with FINTOK</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300 mb-6">
              <li>Copy the video URL from Instagram, TikTok, or YouTube</li>
              <li>Paste the link into our <strong>video downloader</strong> above</li>
              <li>Click "Download" and get your video in seconds</li>
              <li>Save the video to your device in the highest available quality</li>
            </ol>

            <h3 className="text-xl font-semibold mb-4">Features of Our Video Downloader</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 mb-6">
              <li><strong>Free video downloader</strong> - No cost, no hidden fees</li>
              <li><strong>Download Instagram reels</strong> - Save Instagram reels in HD quality</li>
              <li><strong>Download TikTok videos</strong> - Save TikTok videos without watermarks</li>
              <li><strong>Download YouTube videos</strong> - Save YouTube videos in high quality</li>
              <li><strong>High quality downloads</strong> - Get videos in the best available resolution</li>
              <li><strong>No watermark</strong> - Clean downloads without platform watermarks</li>
              <li><strong>Fast processing</strong> - Download videos in seconds</li>
              <li><strong>Mobile friendly</strong> - Works on all devices and browsers</li>
              <li><strong>Secure and private</strong> - No data collection or storage</li>
            </ul>

            <h3 className="text-xl font-semibold mb-4">Supported Content Types</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Our <strong>video downloader</strong> supports multiple platforms and content types:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 mb-6">
              <li><strong>Instagram:</strong> Videos, reels, stories, IGTV, and live videos</li>
              <li><strong>TikTok:</strong> All TikTok videos and content</li>
              <li><strong>YouTube:</strong> All YouTube videos, shorts, and live streams</li>
            </ul>

            <h3 className="text-xl font-semibold mb-4">Why Choose FINTOK for Video Downloads?</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              FINTOK is the most trusted <strong>free video downloader</strong> because we offer:
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

            <h3 className="text-xl font-semibold mb-4">Video Downloader FAQ</h3>
            <div className="space-y-4 mb-6">
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Is FINTOK video downloader free?</h4>
                <p className="text-gray-600 dark:text-gray-300">Yes, FINTOK is completely free to use. No registration, no hidden fees, no premium plans.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Can I download videos from Instagram, TikTok, and YouTube?</h4>
                <p className="text-gray-600 dark:text-gray-300">Absolutely! Our video downloader supports all major platforms including Instagram, TikTok, and YouTube.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Does FINTOK work on mobile devices?</h4>
                <p className="text-gray-600 dark:text-gray-300">Yes, FINTOK works on all devices including Android, iPhone, iPad, and desktop computers.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Is it safe to use FINTOK video downloader?</h4>
                <p className="text-gray-600 dark:text-gray-300">Yes, FINTOK is completely safe and secure. We don't collect personal data or store your downloads.</p>
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-4">Best Video Downloader Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">High Quality Downloads</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">Download videos in the highest available quality, up to 4K resolution.</p>
              </div>
              <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">No Watermarks</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">Get clean downloads without any platform watermarks or branding.</p>
              </div>
              <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Fast Processing</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">Download videos in seconds with our optimized processing engine.</p>
              </div>
              <div className="bg-white/50 dark:bg-gray-800/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Multi-Platform Support</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">Works with Instagram, TikTok, YouTube, and more platforms.</p>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-300 text-center font-medium">
              Start downloading videos for free today with FINTOK - the best 
              <strong> multi-platform video downloader</strong> available online!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
