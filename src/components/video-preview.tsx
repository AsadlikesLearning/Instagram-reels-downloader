"use client";

import React from "react";
import Image from "next/image";
import { Download, Play, Eye, Clock, Calendar, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VideoInfo } from "@/types";
import { LoadingSpinner, SuccessAnimation } from "@/components/ui/loading-spinner";
import { DownloadProgress as DownloadProgressComponent } from "@/components/ui/progress-bar";
import { DownloadProgress } from "@/lib/download-utils";
import { useSounds } from "@/lib/sounds";

interface VideoPreviewProps {
  videoInfo: VideoInfo;
  isDownloading?: boolean;
  downloadProgress?: DownloadProgress | null;
  onDownload: () => void;
  onBack: () => void;
}

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const formatViewCount = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
};

const formatTimeAgo = (timestamp: number): string => {
  const now = Date.now() / 1000;
  const diff = now - timestamp;
  
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

export function VideoPreview({ videoInfo, isDownloading, downloadProgress, onDownload, onBack }: VideoPreviewProps) {
  const { playClick, playDownloadSuccess } = useSounds();
  const [showSuccessAnimation, setShowSuccessAnimation] = React.useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-4 sm:p-6 backdrop-blur-sm prevent-overflow">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">Video Preview</h3>
        {/* Desktop Back Button */}
        <Button 
          onClick={() => {
            playClick();
            onBack();
          }}
          className="hidden sm:flex text-xs sm:text-sm w-auto rounded-full px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white shadow-md hover:shadow-lg transition-all duration-200 font-medium"
        >
          <svg className="mr-2 h-3 w-3 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Search
        </Button>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Video Thumbnail and Basic Info */}
        <div className="flex flex-col sm:flex-row gap-4 min-w-0">
          {/* Thumbnail */}
          <div className="relative w-full sm:w-48 aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
            {videoInfo.thumbnailUrl ? (
              <Image 
                src={videoInfo.thumbnailUrl} 
                alt="Video thumbnail" 
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 192px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30">
                <Play className="h-8 w-8 sm:h-12 sm:w-12 text-purple-400" />
              </div>
            )}
            
            {/* Duration overlay */}
            {videoInfo.duration && (
              <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs sm:text-sm font-medium">
                {formatDuration(videoInfo.duration)}
              </div>
            )}
          </div>

          {/* Video Details */}
          <div className="flex-1 space-y-3 min-w-0 overflow-hidden">
            {/* Title/Caption */}
            {(videoInfo.title || videoInfo.caption) && (
              <div className="min-w-0 flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white mb-1 text-sm sm:text-base break-words">
                  {videoInfo.title || 'Instagram Video'}
                </h4>
                {videoInfo.caption && (
                  <div className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm leading-relaxed line-clamp-4 break-hashtags">
                    {videoInfo.caption}
                  </div>
                )}
              </div>
            )}

            {/* Creator Info */}
            {videoInfo.owner && (
              <div className="flex items-center gap-3">
                <Image 
                  src={videoInfo.owner.profilePicUrl} 
                  alt={videoInfo.owner.username}
                  width={40}
                  height={40}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
                />
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                      {videoInfo.owner.fullName || videoInfo.owner.username}
                    </span>
                    {videoInfo.owner.isVerified && (
                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                    )}
                  </div>
                  <span className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">@{videoInfo.owner.username}</span>
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500 dark:text-gray-400 min-w-0">
              {videoInfo.viewCount && (
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>{formatViewCount(videoInfo.viewCount)} views</span>
                </div>
              )}
              {videoInfo.duration && (
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>{formatDuration(videoInfo.duration)}</span>
                </div>
              )}
              {videoInfo.postedAt && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>{formatTimeAgo(videoInfo.postedAt)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 sm:p-4 min-w-0">
          <h5 className="font-medium text-gray-900 dark:text-white mb-2 text-sm sm:text-base">Download Details</h5>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm min-w-0">
            <div className="min-w-0">
              <span className="text-gray-500 dark:text-gray-400">Resolution:</span>
              <span className="ml-2 font-medium text-gray-900 dark:text-white break-words">{videoInfo.width} × {videoInfo.height}</span>
            </div>
            <div className="min-w-0">
              <span className="text-gray-500 dark:text-gray-400">Filename:</span>
              <span className="ml-2 font-medium text-gray-900 dark:text-white break-all overflow-hidden">{videoInfo.filename}</span>
            </div>
          </div>
        </div>

        {/* Download Progress */}
        {downloadProgress && (
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h5 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                Download Progress
              </h5>
              {downloadProgress.isStreaming && (
                <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Quick Download</span>
                </div>
              )}
            </div>
            <DownloadProgressComponent
              progress={downloadProgress.progress}
              downloadedBytes={downloadProgress.downloadedBytes}
              totalBytes={downloadProgress.totalBytes}
              speed={downloadProgress.speed}
              timeRemaining={downloadProgress.timeRemaining}
            />
          </div>
        )}

        {/* Download Button */}
        <Button
          onClick={() => {
            playClick();
            onDownload();
          }}
          disabled={isDownloading}
          className="w-full rounded-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base"
          size="lg"
        >
          {isDownloading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Downloading...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Download Video</span>
              <span className="sm:hidden">Download</span>
            </div>
          )}
        </Button>

        {/* Mobile Back Button */}
        <Button
          onClick={() => {
            playClick();
            onBack();
          }}
          className="sm:hidden w-full rounded-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white shadow-lg hover:shadow-xl transition-all duration-200 text-sm font-medium"
          size="lg"
        >
          <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Search
        </Button>

        {/* Help Text */}
        <p className="text-gray-500 dark:text-gray-400 text-center text-xs sm:text-sm">
          Click download to save this video to your device
        </p>
      </div>
    </div>
  );
}