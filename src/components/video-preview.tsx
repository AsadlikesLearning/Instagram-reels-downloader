"use client";

import React from "react";
import { Download, Play, Eye, Clock, Calendar, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VideoInfo } from "@/types";

interface VideoPreviewProps {
  videoInfo: VideoInfo;
  isDownloading?: boolean;
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

export function VideoPreview({ videoInfo, isDownloading, onDownload, onBack }: VideoPreviewProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Video Preview</h3>
        <Button 
          variant="outline" 
          onClick={onBack}
          className="text-sm"
        >
          Back to Search
        </Button>
      </div>

      <div className="space-y-6">
        {/* Video Thumbnail and Basic Info */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Thumbnail */}
          <div className="relative w-full sm:w-48 aspect-square rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
            {videoInfo.thumbnailUrl ? (
              <img 
                src={videoInfo.thumbnailUrl} 
                alt="Video thumbnail" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100">
                <Play className="h-12 w-12 text-purple-400" />
              </div>
            )}
            
            {/* Duration overlay */}
            {videoInfo.duration && (
              <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm font-medium">
                {formatDuration(videoInfo.duration)}
              </div>
            )}
          </div>

          {/* Video Details */}
          <div className="flex-1 space-y-3">
            {/* Title/Caption */}
            {(videoInfo.title || videoInfo.caption) && (
              <div>
                <h4 className="font-medium text-gray-900 mb-1">
                  {videoInfo.title || 'Instagram Video'}
                </h4>
                {videoInfo.caption && (
                  <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                    {videoInfo.caption}
                  </p>
                )}
              </div>
            )}

            {/* Creator Info */}
            {videoInfo.owner && (
              <div className="flex items-center gap-3">
                <img 
                  src={videoInfo.owner.profilePicUrl} 
                  alt={videoInfo.owner.username}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-gray-900">
                      {videoInfo.owner.fullName || videoInfo.owner.username}
                    </span>
                    {videoInfo.owner.isVerified && (
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                    )}
                  </div>
                  <span className="text-gray-500 text-sm">@{videoInfo.owner.username}</span>
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              {videoInfo.viewCount && (
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{formatViewCount(videoInfo.viewCount)} views</span>
                </div>
              )}
              {videoInfo.duration && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatDuration(videoInfo.duration)}</span>
                </div>
              )}
              {videoInfo.postedAt && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatTimeAgo(videoInfo.postedAt)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h5 className="font-medium text-gray-900 mb-2">Download Details</h5>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Resolution:</span>
              <span className="ml-2 font-medium">{videoInfo.width} × {videoInfo.height}</span>
            </div>
            <div>
              <span className="text-gray-500">Filename:</span>
              <span className="ml-2 font-medium">{videoInfo.filename}</span>
            </div>
          </div>
        </div>

        {/* Download Button */}
        <Button
          onClick={onDownload}
          disabled={isDownloading}
          className="w-full rounded-full py-3 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-400 hover:to-red-400 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          size="lg"
        >
          {isDownloading ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Downloading...
            </>
          ) : (
            <>
              <Download className="mr-2 h-5 w-5" />
              Download Video
            </>
          )}
        </Button>

        {/* Help Text */}
        <p className="text-gray-500 text-center text-sm">
          Click download to save this video to your device
        </p>
      </div>
    </div>
  );
}