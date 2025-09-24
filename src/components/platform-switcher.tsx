"use client";

import React from "react";
import { Instagram, Music } from "lucide-react";
import { Button } from "@/components/ui/button";

export type Platform = "instagram" | "tiktok";

interface PlatformSwitcherProps {
  currentPlatform: Platform;
  onPlatformChange: (platform: Platform) => void;
  className?: string;
}

export function PlatformSwitcher({ 
  currentPlatform, 
  onPlatformChange, 
  className = "" 
}: PlatformSwitcherProps) {
  return (
    <div className={`flex items-center justify-center space-x-3 ${className}`}>
      <Button
        onClick={() => onPlatformChange("instagram")}
        className={`relative rounded-2xl px-6 py-3 transition-all duration-300 font-semibold ${
          currentPlatform === "instagram"
            ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-xl scale-105"
            : "bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-600 hover:scale-105 border border-gray-200 dark:border-gray-600"
        }`}
      >
        <Instagram className="mr-2 h-5 w-5" />
        Instagram
        {currentPlatform === "instagram" && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-pulse"></div>
        )}
      </Button>
      
      <Button
        onClick={() => onPlatformChange("tiktok")}
        className={`relative rounded-2xl px-6 py-3 transition-all duration-300 font-semibold ${
          currentPlatform === "tiktok"
            ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-xl scale-105"
            : "bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-600 hover:scale-105 border border-gray-200 dark:border-gray-600"
        }`}
      >
        <Music className="mr-2 h-5 w-5" />
        TikTok
        {currentPlatform === "tiktok" && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-pulse"></div>
        )}
      </Button>
    </div>
  );
}
