import Link from "next/link";
import { Play } from "lucide-react";
import { InstagramVideoForm } from "@/features/instagram/components/form";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Header with Gradient */}
      <div className="bg-gradient-to-b from-pink-100 via-purple-50 to-blue-50">
        {/* Header with branding */}
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Play className="h-4 w-4 text-white fill-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">FINTOK</span>
            </div>
            <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
              <Link href="/supported" className="hover:text-purple-600 transition-colors">Supported</Link>
              <Link href="/how-it-works" className="hover:text-purple-600 transition-colors">How it works</Link>
              <Link href="/faq" className="hover:text-purple-600 transition-colors">FAQ</Link>
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full font-medium hover:shadow-lg transition-all">
                Download now
              </button>
            </div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="container mx-auto px-4 py-16 sm:py-24 text-center">
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              New FINTOK — All-in-One Video Downloader
            </span>
          </div>
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Download videos from{" "}
              <span className="bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600 bg-clip-text text-transparent">anywhere</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Paste a link from TikTok, Instagram, YouTube, Facebook, X and more. FINTOK
              fetches the best available media for fast, clean downloads.
            </p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="container mx-auto px-4 -mt-8 relative z-10">
        <div className="max-w-2xl mx-auto">
          <InstagramVideoForm />
        </div>
      </div>
    </div>
  );
}
