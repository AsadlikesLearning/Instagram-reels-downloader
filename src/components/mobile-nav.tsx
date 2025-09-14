"use client";

import React from "react";

import Link from "next/link";

import { usePathname } from "next/navigation";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";

import { Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { siteLinks } from "@/lib/constants";
import { Separator } from "./ui/separator";
import { SoundToggle } from "./ui/sound-toggle";
import { ThemeToggle } from "./theme-toggle";

export function MobileNav({ className }: { className?: string }) {
  const [open, setOpen] = React.useState(false);

  const pathname = usePathname();

  const handleCloseSheet = () => setOpen(false);

  const scrollToForm = () => {
    const formElement = document.getElementById('download-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className={className}>
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80">
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <svg className="h-4 w-4 text-white fill-white" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">FINTOK</span>
          </div>
          
          <nav className="flex flex-col gap-2">
            <Link 
              href="/" 
              className={`text-lg font-medium p-3 rounded-lg transition-colors ${
                pathname === "/" 
                  ? "text-purple-600 bg-purple-50" 
                  : "text-gray-700 hover:text-purple-600 hover:bg-purple-50"
              }`}
              onClick={handleCloseSheet}
            >
              Home
            </Link>
            <Link 
              href="/supported" 
              className={`text-lg font-medium p-3 rounded-lg transition-colors ${
                pathname === "/supported" 
                  ? "text-purple-600 bg-purple-50" 
                  : "text-gray-700 hover:text-purple-600 hover:bg-purple-50"
              }`}
              onClick={handleCloseSheet}
            >
              Supported Platforms
            </Link>
            <Link 
              href="/how-it-works" 
              className={`text-lg font-medium p-3 rounded-lg transition-colors ${
                pathname === "/how-it-works" 
                  ? "text-purple-600 bg-purple-50" 
                  : "text-gray-700 hover:text-purple-600 hover:bg-purple-50"
              }`}
              onClick={handleCloseSheet}
            >
              How it works
            </Link>
            <Link 
              href="/faq" 
              className={`text-lg font-medium p-3 rounded-lg transition-colors ${
                pathname === "/faq" 
                  ? "text-purple-600 bg-purple-50" 
                  : "text-gray-700 hover:text-purple-600 hover:bg-purple-50"
              }`}
              onClick={handleCloseSheet}
            >
              FAQ
            </Link>
            <button 
              onClick={scrollToForm}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full font-medium hover:shadow-lg transition-all mt-4"
            >
              Download now
            </button>
          </nav>
          
          <Separator className="my-6" />
          
          {/* Settings */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Settings</span>
            <div className="flex items-center gap-2">
              <SoundToggle />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
