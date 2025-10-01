"use client";

import React from "react";

export function VideoPreviewSkeleton() {
  return (
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-white/30 dark:border-gray-700/30 p-6 sm:p-8 animate-fade-in-up prevent-overflow">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
        <div className="h-5 w-40 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        <div className="hidden sm:block h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Thumbnail + basic info */}
        <div className="flex flex-col sm:flex-row gap-4 min-w-0">
          <div className="relative w-full sm:w-48 aspect-square rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700 animate-pulse flex-shrink-0" />
          <div className="flex-1 space-y-3 min-w-0 overflow-hidden">
            <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="space-y-2">
              <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-3 w-5/6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              <div className="h-3 w-4/6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>
            <div className="flex items-center gap-3 pt-2">
              <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
              <div className="space-y-2 w-40">
                <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 sm:p-4 min-w-0">
          <div className="h-4 w-36 bg-gray-200 dark:bg-gray-700 rounded mb-3 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="h-3 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            <div className="h-3 w-56 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        </div>

        {/* Button */}
        <div className="w-full h-12 rounded-2xl bg-gray-200 dark:bg-gray-700 animate-pulse" />

        <p className="text-gray-500 dark:text-gray-400 text-center text-xs sm:text-sm">
          Preparing preview...
        </p>
      </div>
    </div>
  );
}


