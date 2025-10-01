"use client";

import React, { memo, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  progress: number; // 0-100
  className?: string;
  showPercentage?: boolean;
  size?: "sm" | "md" | "lg";
  color?: "default" | "success" | "warning" | "error";
  animated?: boolean;
}

const ProgressBar = memo(function ProgressBar({ 
  progress, 
  className = "", 
  showPercentage = true,
  size = "md",
  color = "default",
  animated = true
}: ProgressBarProps) {
  const sizeClasses = useMemo(() => ({
    sm: "h-2",
    md: "h-3",
    lg: "h-4"
  }), []);

  const colorClasses = useMemo(() => ({
    default: "bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600",
    success: "bg-gradient-to-r from-green-500 via-emerald-500 to-green-600",
    warning: "bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500",
    error: "bg-gradient-to-r from-red-500 via-pink-500 to-red-600"
  }), []);

  const progressValue = useMemo(() => Math.min(100, Math.max(0, progress)), [progress]);
  const isComplete = progressValue >= 100;

  return (
    <div className={cn("w-full", className)}>
      <div className={cn(
        "w-full bg-gray-200/80 dark:bg-gray-700/80 rounded-full overflow-hidden backdrop-blur-sm relative",
        sizeClasses[size]
      )}>
        {/* Background shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={animated ? {
            x: ["-100%", "100%"]
          } : {}}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Progress glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full opacity-0"
          animate={animated && !isComplete ? {
            opacity: [0, 0.3, 0]
          } : {}}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            background: color === 'default' 
              ? 'linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.3), transparent)'
              : color === 'success'
              ? 'linear-gradient(90deg, transparent, rgba(34, 197, 94, 0.3), transparent)'
              : color === 'warning'
              ? 'linear-gradient(90deg, transparent, rgba(245, 158, 11, 0.3), transparent)'
              : 'linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.3), transparent)'
          }}
        />
        
        {/* Progress bar */}
        <motion.div
          className={cn(
            "h-full rounded-full relative overflow-hidden",
            colorClasses[color]
          )}
          style={{ 
            width: `${progressValue}%`,
            boxShadow: isComplete 
              ? "0 0 20px rgba(34,197,94,0.4)" 
              : "0 0 16px rgba(168,85,247,0.3)"
          }}
          initial={{ width: 0 }}
          animate={{ width: `${progressValue}%` }}
          transition={{ 
            duration: 0.6, 
            ease: "easeOut",
            type: "spring",
            stiffness: 100
          }}
        >
          {/* Animated shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={animated && !isComplete ? {
              x: ["-100%", "100%"]
            } : {}}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          />
          
          {/* Completion burst effect */}
          {isComplete && (
            <motion.div
              className="absolute inset-0 rounded-full"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.2, opacity: [0, 0.6, 0] }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{
                background: "radial-gradient(circle, rgba(34, 197, 94, 0.4) 0%, transparent 70%)"
              }}
            />
          )}
          
          {/* Pulse effect for active progress */}
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={animated && !isComplete ? {
              opacity: [0.3, 0.8, 0.3]
            } : {}}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              background: "linear-gradient(90deg, rgba(255,255,255,0.2), rgba(255,255,255,0.6), rgba(255,255,255,0.2))"
            }}
          />
        </motion.div>
      </div>
      
      {showPercentage && (
        <motion.div 
          className="flex justify-between items-center mt-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2">
            <motion.div
              className="w-2 h-2 rounded-full bg-purple-500"
              animate={animated && !isComplete ? {
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7]
              } : {}}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
              {isComplete ? "Complete!" : "Downloading..."}
            </span>
          </div>
          <motion.span 
            className="text-xs font-bold text-gray-800 dark:text-gray-200"
            key={Math.round(progressValue)}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {Math.round(progressValue)}%
          </motion.span>
        </motion.div>
      )}
    </div>
  );
});

export { ProgressBar };

interface DownloadProgressProps {
  progress: number;
  downloadedBytes: number;
  totalBytes: number;
  speed: string;
  timeRemaining: string;
  className?: string;
  isStreaming?: boolean;
}

const DownloadProgress = memo(function DownloadProgress({ 
  progress, 
  downloadedBytes, 
  totalBytes, 
  speed, 
  timeRemaining,
  className = "",
  isStreaming = false
}: DownloadProgressProps) {
  const formatBytes = useCallback((bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }, []);

  const isComplete = useMemo(() => progress >= 100, [progress]);
  const progressValue = useMemo(() => Math.min(100, Math.max(0, progress)), [progress]);

  return (
    <div className={cn("w-full space-y-4", className)}>
      {/* Enhanced Progress Bar */}
      <div className="space-y-3">
        <ProgressBar 
          progress={progressValue} 
          size="lg" 
          showPercentage={true}
          color={isComplete ? "success" : "default"}
          animated={!isComplete}
        />
        
        {/* Streaming indicator */}
        {isStreaming && !isComplete && (
          <motion.div 
            className="flex items-center justify-center gap-2 text-xs text-green-600 dark:text-green-400"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              className="w-2 h-2 bg-green-500 rounded-full"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <span className="font-medium">Quick Download Active</span>
          </motion.div>
        )}
        
        {/* Success indicator */}
        {isComplete && (
          <motion.div 
            className="flex items-center justify-center gap-2 text-xs text-green-600 dark:text-green-400"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="w-2 h-2 bg-green-500 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            />
            <span className="font-medium">Download Complete!</span>
          </motion.div>
        )}
      </div>
      
      {/* Enhanced Stats Grid */}
      <motion.div 
        className="grid grid-cols-2 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {/* Downloaded Size */}
        <motion.div 
          className="bg-gray-50/80 dark:bg-gray-800/50 rounded-xl p-3 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Downloaded</span>
          </div>
          <motion.span 
            className="block text-sm font-bold text-gray-800 dark:text-gray-200"
            key={`${downloadedBytes}-${totalBytes}`}
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {formatBytes(downloadedBytes)} / {formatBytes(totalBytes)}
          </motion.span>
        </motion.div>
        
        {/* Download Speed */}
        <motion.div 
          className="bg-gray-50/80 dark:bg-gray-800/50 rounded-xl p-3 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-1">
            <motion.div 
              className="w-2 h-2 bg-green-500 rounded-full"
              animate={!isComplete ? {
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7]
              } : {}}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            ></motion.div>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Speed</span>
          </div>
          <motion.span 
            className="block text-sm font-bold text-gray-800 dark:text-gray-200"
            key={speed}
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {speed}
          </motion.span>
        </motion.div>
        
        {/* Time Remaining */}
        <motion.div 
          className="bg-gray-50/80 dark:bg-gray-800/50 rounded-xl p-3 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-1">
            <motion.div 
              className="w-2 h-2 bg-orange-500 rounded-full"
              animate={!isComplete && timeRemaining !== "0s" ? {
                scale: [1, 1.1, 1],
                opacity: [0.8, 1, 0.8]
              } : {}}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            ></motion.div>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Time Left</span>
          </div>
          <motion.span 
            className="block text-sm font-bold text-gray-800 dark:text-gray-200"
            key={timeRemaining}
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {isComplete ? "Complete!" : timeRemaining}
          </motion.span>
        </motion.div>
        
        {/* Progress Percentage */}
        <motion.div 
          className="bg-gray-50/80 dark:bg-gray-800/50 rounded-xl p-3 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-1">
            <motion.div 
              className="w-2 h-2 bg-purple-500 rounded-full"
              animate={!isComplete ? {
                scale: [1, 1.3, 1],
                opacity: [0.6, 1, 0.6]
              } : {}}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            ></motion.div>
            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Progress</span>
          </div>
          <motion.span 
            className="block text-sm font-bold text-gray-800 dark:text-gray-200"
            key={Math.round(progressValue)}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {Math.round(progressValue)}%
          </motion.span>
        </motion.div>
      </motion.div>
    </div>
  );
});

export { DownloadProgress };
