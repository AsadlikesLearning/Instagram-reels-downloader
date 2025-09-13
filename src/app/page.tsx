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
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
              <Link href="/supported" className="hover:text-purple-600 transition-colors">Supported</Link>
              <Link href="/how-it-works" className="hover:text-purple-600 transition-colors">How it works</Link>
              <Link href="/faq" className="hover:text-purple-600 transition-colors">FAQ</Link>
              <button 
                onClick={scrollToForm}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full font-medium hover:shadow-lg transition-all"
              >
                Download now
              </button>
            </div>

            {/* Mobile Navigation */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <Play className="h-4 w-4 text-white fill-white" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">FINTOK</span>
                  </div>
                  
                  <nav className="flex flex-col gap-4">
                    <Link 
                      href="/supported" 
                      className="text-lg font-medium text-gray-700 hover:text-purple-600 transition-colors p-3 rounded-lg hover:bg-purple-50"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Supported
                    </Link>
                    <Link 
                      href="/how-it-works" 
                      className="text-lg font-medium text-gray-700 hover:text-purple-600 transition-colors p-3 rounded-lg hover:bg-purple-50"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      How it works
                    </Link>
                    <Link 
                      href="/faq" 
                      className="text-lg font-medium text-gray-700 hover:text-purple-600 transition-colors p-3 rounded-lg hover:bg-purple-50"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      FAQ
                    </Link>
                    <button 
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        scrollToForm();
                      }}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full font-medium hover:shadow-lg transition-all mt-4"
                    >
                      Download now
                    </button>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
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
      <div id="download-form" className="container mx-auto px-4 -mt-8 relative z-10">
        <div className="max-w-2xl mx-auto">
          <InstagramVideoForm />
        </div>
      </div>
    </div>
  );
}
