"use client";

import React from "react";
import Link from "next/link";

import { MobileNav } from "./mobile-nav";
import { ThemeToggle } from "./theme-toggle";
import { SoundToggle } from "./ui/sound-toggle";
import { MegaMenu } from "./mega-menu";

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
        <Link href="/" className="group flex items-center gap-2 sm:gap-3" aria-label="FINTOK Home">
          <div className="relative h-7 w-7 sm:h-9 sm:w-9 rounded-xl overflow-hidden ring-1 ring-white/20 dark:ring-white/10 shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-fuchsia-600" />
            <div className="absolute inset-0 opacity-30 group-hover:opacity-40 transition-opacity" style={{ background:
              "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.6), transparent 40%), radial-gradient(circle at 70% 70%, rgba(255,255,255,0.25), transparent 45%)" }} />
            <svg className="relative z-[1] m-auto h-full w-full p-2 text-white" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 5v14l11-7z" fill="currentColor" />
            </svg>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-base sm:text-lg font-extrabold tracking-tight bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent group-hover:brightness-110 transition-[filter]">
              FINTOK
            </span>
            <span className="hidden sm:block text-[10px] font-medium text-muted-foreground/80 group-hover:text-muted-foreground">Video Downloader</span>
          </div>
        </Link>
        <MobileNav className="md:hidden" />
        <div className="ml-auto flex items-center gap-2 sm:gap-4">
          <MegaMenu className="hidden md:block" />
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
