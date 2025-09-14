"use client";

import React from "react";
import Link from "next/link";

import { MobileNav } from "./mobile-nav";
import { ThemeToggle } from "./theme-toggle";
import { SoundToggle } from "./ui/sound-toggle";

import { cn } from "@/lib/utils";

export function Navbar() {
  return (
    <header className="h-fit w-full sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav
        className={cn(
          "z-50",
          "flex h-[3.5rem] px-3 sm:px-4 lg:px-6",
          "w-full items-center border-b border-border/40"
        )}
      >
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <svg className="h-3 w-3 sm:h-4 sm:w-4 text-white fill-white" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
          <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            FINTOK
          </span>
        </div>
        <MobileNav className="md:hidden" />
        <div className="ml-auto flex items-center gap-2 sm:gap-4">
          <div className="hidden items-center gap-4 text-sm sm:text-base sm:gap-6 md:flex">
            <Link href="/" className="hover:text-purple-600 transition-colors font-medium">
              Home
            </Link>
            <Link href="/supported" className="hover:text-purple-600 transition-colors font-medium">
              Supported
            </Link>
            <Link href="/how-it-works" className="hover:text-purple-600 transition-colors font-medium">
              How it works
            </Link>
            <Link href="/faq" className="hover:text-purple-600 transition-colors font-medium">
              FAQ
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <SoundToggle />
            <ThemeToggle />
          </div>
        </div>
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="w-full bg-background/50 text-center text-secondary-foreground border-t border-border/40">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <div aria-label="Disclaimer" className="text-xs sm:text-sm font-medium text-center sm:text-left">
            We are not affiliated with Instagram or Meta
          </div>
          <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm">
            <Link href="/terms-of-service" className="hover:text-purple-600 transition-colors">
              Terms of Service
            </Link>
            <span aria-hidden="true" className="select-none text-muted-foreground">
              |
            </span>
            <Link href="/privacy-policy" className="hover:text-purple-600 transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-border/20 text-xs text-muted-foreground">
          © 2024 FINTOK. All rights reserved. Free Instagram video downloader.
        </div>
      </div>
    </footer>
  );
}
