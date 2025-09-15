"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  progress: number; // 0-100
  className?: string;
  showPercentage?: boolean;
  size?: "sm" | "md" | "lg";
  color?: "default" | "success" | "warning" | "error";
}

export function ProgressBar({ 
  progress, 
  className = "", 
  showPercentage = true,
  size = "md",
  color = "default"
}: ProgressBarProps) {
  const sizeClasses = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4"
  };

  const colorClasses = {
    default: "bg-gradient-to-r from-purple-500 to-pink-500",
    success: "bg-gradient-to-r from-green-500 to-emerald-500",
    warning: "bg-gradient-to-r from-yellow-500 to-orange-500",
    error: "bg-gradient-to-r from-red-500 to-pink-500"
  };

  return (
    <div className={cn("w-full", className)}>
      <div className={cn(
        "w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden",
        sizeClasses[size]
      )}>
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300 ease-out",
            colorClasses[color]
          )}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
      {showPercentage && (
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Downloading...
          </span>
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
            {Math.round(progress)}%
          </span>
        </div>
      )}
    </div>
  );
}

interface DownloadProgressProps {
  progress: number;
  downloadedBytes: number;
  totalBytes: number;
  speed: string;
  timeRemaining: string;
  className?: string;
}

export function DownloadProgress({ 
  progress, 
  downloadedBytes, 
  totalBytes, 
  speed, 
  timeRemaining,
  className = ""
}: DownloadProgressProps) {
  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className={cn("w-full space-y-3", className)}>
      <ProgressBar 
        progress={progress} 
        size="lg" 
        showPercentage={true}
        color={progress === 100 ? "success" : "default"}
      />
      
      <div className="grid grid-cols-2 gap-4 text-xs text-gray-600 dark:text-gray-400">
        <div>
          <span className="block font-medium text-gray-700 dark:text-gray-300">
            {formatBytes(downloadedBytes)} / {formatBytes(totalBytes)}
          </span>
          <span className="text-gray-500 dark:text-gray-500">Downloaded</span>
        </div>
        
        <div>
          <span className="block font-medium text-gray-700 dark:text-gray-300">
            {speed}
          </span>
          <span className="text-gray-500 dark:text-gray-500">Speed</span>
        </div>
        
        <div>
          <span className="block font-medium text-gray-700 dark:text-gray-300">
            {timeRemaining}
          </span>
          <span className="text-gray-500 dark:text-gray-500">Time Remaining</span>
        </div>
        
        <div>
          <span className="block font-medium text-gray-700 dark:text-gray-300">
            {Math.round(progress)}%
          </span>
          <span className="text-gray-500 dark:text-gray-500">Complete</span>
        </div>
      </div>
    </div>
  );
}
