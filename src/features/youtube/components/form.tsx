"use client";

import React, { useState, useCallback, memo, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Clipboard, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { VideoPreview } from "@/components/video-preview";
import { VideoPreviewSkeleton } from "@/components/video-preview-skeleton";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useSounds } from "@/lib/sounds";
import { getHttpErrorMessage } from "@/lib/http";
import { YouTubeVideoInfo } from "../types";
import { downloadFileWithProgress, DownloadProgress } from "@/lib/download-utils";
import { trackSearch, trackDownload, trackError } from "@/lib/analytics";

const formSchema = z.object({
  videoUrl: z.string().url({
    message: "Provide a valid YouTube video link",
  }),
});

const YouTubeVideoForm = memo(function YouTubeVideoForm() {
  const [videoInfo, setVideoInfo] = useState<YouTubeVideoInfo | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<DownloadProgress | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingPreview, setIsFetchingPreview] = useState(false);
  const [prefetchData, setPrefetchData] = useState<YouTubeVideoInfo | null>(null);
  const [isPrefetching, setIsPrefetching] = useState(false);
  const [error, setError] = useState<any>(null);
  const [downloadType, setDownloadType] = useState<'video' | 'audio'>('video');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      videoUrl: "",
    },
  });

  const { playDownloadSuccess, playClick } = useSounds();
  
  // Watch the form field to make button state reactive
  const videoUrl = form.watch("videoUrl");

  // Helper functions for progress calculation
  const calculateSpeed = (downloadedBytes: number, startTime: number, currentTime: number): string => {
    const elapsed = (currentTime - startTime) / 1000; // seconds
    if (elapsed === 0) return "0 B/s";
    const speed = downloadedBytes / elapsed;
    return formatBytes(speed) + "/s";
  };

  const calculateTimeRemaining = (downloadedBytes: number, totalBytes: number, speed: string): string => {
    if (totalBytes === 0 || downloadedBytes === 0) return "Calculating...";
    
    const remainingBytes = totalBytes - downloadedBytes;
    if (remainingBytes <= 0) return "0s";
    
    // Extract numeric value and unit from speed string
    const speedMatch = speed.match(/(\d+(?:\.\d+)?)\s*([KMGT]?B)/);
    if (!speedMatch) return "Calculating...";
    
    const speedValue = parseFloat(speedMatch[1]);
    const speedUnit = speedMatch[2];
    
    // Convert to bytes per second
    let speedBytes = speedValue;
    switch (speedUnit) {
      case 'KB':
        speedBytes *= 1024;
        break;
      case 'MB':
        speedBytes *= 1024 * 1024;
        break;
      case 'GB':
        speedBytes *= 1024 * 1024 * 1024;
        break;
      case 'TB':
        speedBytes *= 1024 * 1024 * 1024 * 1024;
        break;
    }
    
    if (speedBytes === 0) return "Calculating...";
    
    const remainingSeconds = remainingBytes / speedBytes;
    return formatTime(remainingSeconds);
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatTime = (seconds: number): string => {
    if (seconds < 60) {
      return `${Math.round(seconds)}s`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.round(seconds % 60);
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${hours}h ${minutes}m`;
    }
  };
  
  // Check if URL is valid and belongs to YouTube
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };
  const isYouTubeUrl = (url: string) => {
    try {
      const u = new URL(url);
      const host = u.hostname.toLowerCase();
      return host.includes('youtube.com') || host.includes('youtu.be');
    } catch {
      return false;
    }
  }
  
  const isFormValid = !!(videoUrl && videoUrl.trim() !== "" && isValidUrl(videoUrl.trim()) && isYouTubeUrl(videoUrl.trim()));

  const httpError = getHttpErrorMessage(error);

  // Debounced prefetching for faster preview
  useEffect(() => {
    if (!isFormValid || !videoUrl.trim()) {
      setPrefetchData(null);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        setIsPrefetching(true);
        const response = await fetch(`/api/youtube/video?url=${encodeURIComponent(videoUrl.trim())}`);
        const data = await response.json();
        
        if (response.ok) {
          setPrefetchData(data.data);
        } else {
          setPrefetchData(null);
        }
      } catch (error) {
        // Silently fail prefetch - user will see error on actual submit
        console.log("Prefetch failed:", error);
        setPrefetchData(null);
      } finally {
        setIsPrefetching(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [videoUrl, isFormValid]);

  // Handle paste from clipboard
  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        form.setValue("videoUrl", text);
      }
    } catch (err) {
      console.log("Failed to read clipboard:", err);
    }
  }, [form]);

  // Handle form submission - get video info for preview
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { videoUrl } = values;
    try {
      console.log("Getting YouTube video info", videoUrl);
      setIsLoading(true);
      setIsFetchingPreview(true);
      setError(null);
      
      // Track search event
      trackSearch(videoUrl);
      
      // Use prefetched data if available, otherwise fetch
      if (prefetchData && prefetchData.videoUrl) {
        console.log("Using prefetched data for instant preview");
        setVideoInfo(prefetchData);
        playDownloadSuccess();
        return;
      }
      
      if (!isYouTubeUrl(videoUrl)) {
        throw new Error('Please enter a valid YouTube link');
      }
      const response = await fetch(`/api/youtube/video?url=${encodeURIComponent(videoUrl)}`);
      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('YouTube is blocking automated access. Please try again later or use a different video.');
        }
        throw new Error(data.error || 'Failed to get video info');
      }
      
      setVideoInfo(data.data);
      // Play success sound when preview is ready
      playDownloadSuccess();
    } catch (error: any) {
      console.log(error);
      setError(error);
      // Track error event
      trackError(error.message || 'Unknown error', 'youtube_video_info_fetch');
    } finally {
      setIsLoading(false);
      setIsFetchingPreview(false);
    }
  }

  // Handle actual download from preview
  const handleDownload = async () => {
    if (!videoInfo) {
      console.log("No video info available for download");
      return;
    }
    
    console.log(`Starting YouTube ${downloadType} download process...`);
    setIsDownloading(true);
    setDownloadProgress(null);
    
    try {
      console.log("Video URL:", videoInfo.videoUrl);
      console.log("Filename:", videoInfo.filename);
      console.log("Download type:", downloadType);
      
      // Track download event
      trackDownload(videoInfo.videoUrl, videoInfo.filename);
      
      if (downloadType === 'audio') {
        // Handle MP3 download with enhanced progress tracking
        console.log("Starting MP3 download with progress tracking...");
        
        // Show initial progress immediately
        setDownloadProgress({
          progress: 5,
          downloadedBytes: 0,
          totalBytes: 0,
          speed: "Preparing MP3...",
          timeRemaining: "Initializing...",
          isComplete: false,
          isStreaming: true
        });

        const response = await fetch('/api/youtube/audio', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: videoInfo.videoUrl,
            filename: videoInfo.filename.replace('.mp4', '.mp3')
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'MP3 download failed');
        }

        // Get content length for progress tracking
        const contentLength = response.headers.get('content-length');
        const totalBytes = contentLength ? parseInt(contentLength, 10) : 0;
        
        console.log('MP3 Content length:', totalBytes);

        // Update progress to show we're starting the download
        setDownloadProgress({
          progress: 15,
          downloadedBytes: 0,
          totalBytes: totalBytes || 0,
          speed: "Downloading MP3...",
          timeRemaining: "Processing audio...",
          isComplete: false,
          isStreaming: true
        });

        // Read the response with progress tracking
        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error('Response body is not available for streaming');
        }

        const chunks: Uint8Array[] = [];
        let downloadedBytes = 0;
        const startTime = Date.now();
        let lastUpdateTime = startTime;
        let lastDownloadedBytes = 0;

        // Read stream in chunks with more frequent progress updates
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) break;
          
          chunks.push(value);
          downloadedBytes += value.length;

          // Update progress every 100ms or every 64KB for smoother updates
          const now = Date.now();
          if (now - lastUpdateTime > 100 || downloadedBytes - lastDownloadedBytes > 64 * 1024) {
            const progress = totalBytes > 0 ? Math.min((downloadedBytes / totalBytes) * 100, 95) : Math.min((downloadedBytes / (downloadedBytes + 1024 * 1024)) * 100, 95);
            const speed = calculateSpeed(downloadedBytes, startTime, now);
            const timeRemaining = calculateTimeRemaining(downloadedBytes, totalBytes, speed);

            setDownloadProgress({
              progress,
              downloadedBytes,
              totalBytes: totalBytes || downloadedBytes,
              speed,
              timeRemaining,
              isComplete: false,
              isStreaming: true
            });

            lastUpdateTime = now;
            lastDownloadedBytes = downloadedBytes;
          }
        }

        // Update progress to show we're processing the audio
        setDownloadProgress({
          progress: 85,
          downloadedBytes: downloadedBytes,
          totalBytes: totalBytes || downloadedBytes,
          speed: "Processing audio...",
          timeRemaining: "Finalizing...",
          isComplete: false,
          isStreaming: true
        });

        // Combine all chunks into a single blob
        const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
        const combined = new Uint8Array(totalLength);
        let offset = 0;
        
        for (const chunk of chunks) {
          combined.set(chunk, offset);
          offset += chunk.length;
        }

        const blob = new Blob([combined], { type: 'audio/mpeg' });
        
        // Update progress to show we're creating the download
        setDownloadProgress({
          progress: 95,
          downloadedBytes: blob.size,
          totalBytes: totalBytes || blob.size,
          speed: "Creating download...",
          timeRemaining: "Almost ready...",
          isComplete: false,
          isStreaming: true
        });

        // Small delay to ensure progress is visible
        await new Promise(resolve => setTimeout(resolve, 300));

        // Trigger download
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = videoInfo.filename.replace('.mp4', '.mp3');
        a.style.display = "none";
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        // Cleanup
        window.URL.revokeObjectURL(blobUrl);

        // Final progress update
        const endTime = Date.now();
        const finalSpeed = calculateSpeed(downloadedBytes, startTime, endTime);
        
        setDownloadProgress({
          progress: 100,
          downloadedBytes: blob.size,
          totalBytes: totalBytes || blob.size,
          speed: finalSpeed,
          timeRemaining: "0s",
          isComplete: true,
          isStreaming: true
        });

        console.log("YouTube MP3 download completed successfully!");
        setShowSuccessAnimation(true);
        playDownloadSuccess();
        
        // Hide success animation after 2 seconds
        setTimeout(() => {
          setShowSuccessAnimation(false);
          setDownloadProgress(null);
        }, 2000);
      } else {
        // Handle video download with progress tracking
        await downloadFileWithProgress(videoInfo.videoUrl, videoInfo.filename, {
          useQuickDownload: true,
          chunkSize: 131072, // 128KB chunks for optimal performance
          onProgress: (progress) => {
            console.log("Download progress:", progress.progress + "%");
            setDownloadProgress(progress);
          },
          onComplete: () => {
            console.log("YouTube download completed successfully!");
            // Show success animation and play sound
            setShowSuccessAnimation(true);
            playDownloadSuccess();
            
            // Hide success animation after 2 seconds
            setTimeout(() => {
              setShowSuccessAnimation(false);
              setDownloadProgress(null);
            }, 2000);
          },
          onError: (error) => {
            console.error("YouTube download error:", error);
            // Track download error
            trackError(error.message || 'Download failed', 'youtube_video_download');
            setDownloadProgress(null);
          }
        });
      }
      
    } catch (error: any) {
      console.error("YouTube download failed:", error);
      
      // Handle specific YouTube blocking errors
      if (error.message && (error.message.includes('blocked') || error.message.includes('unavailable'))) {
        setError('YouTube downloads are permanently unavailable due to anti-bot measures. Please use YouTube Premium for official offline downloads or try alternative methods like screen recording.');
      } else if (error.message && error.message.includes('403')) {
        setError('YouTube is permanently blocking automated downloads. Please use YouTube Premium for official offline downloads or try alternative methods.');
      } else {
        setError(error.message || 'Download failed');
      }
      
      setDownloadProgress(null);
    } finally {
      setIsDownloading(false);
    }
  };

  // Handle back to search
  const handleBack = useCallback(() => {
    setVideoInfo(null);
    form.reset();
  }, [form]);

  // Show preview if we have video info
  if (videoInfo) {
    return (
      <VideoPreview
        videoInfo={videoInfo}
        isDownloading={isDownloading}
        downloadProgress={downloadProgress}
        onDownload={handleDownload}
        onBack={handleBack}
        downloadType={downloadType}
      />
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-4 sm:p-6 lg:p-8 backdrop-blur-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
          {isFetchingPreview && (
            <div className="mb-4">
              <VideoPreviewSkeleton />
            </div>
          )}
          {/* Error Message */}
          {httpError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-red-600 dark:text-red-400 text-sm">
              {httpError}
            </div>
          )}



          {/* Download Type Selector */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Download Format
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    playClick();
                    setDownloadType('video');
                  }}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                    downloadType === 'video'
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                      : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:border-purple-300'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-medium">Video</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playClick();
                    setDownloadType('audio');
                  }}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                    downloadType === 'audio'
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                      : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:border-purple-300'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                  <span className="text-sm font-medium">MP3</span>
                </button>
              </div>
            </div>
          </div>

          {/* Input and Buttons */}
          <div className="space-y-3 sm:space-y-4">
            <FormField
              control={form.control}
              name="videoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      type="url"
                      placeholder="Paste YouTube video URL here"
                      className="h-12 sm:h-14 text-base sm:text-lg rounded-full border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white px-4 sm:px-6 focus:border-purple-400 focus:ring-purple-400 transition-colors"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="ml-4 sm:ml-6 text-sm" />
                </FormItem>
              )}
            />

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                type="button"
                onClick={() => {
                  playClick();
                  handlePaste();
                }}
                disabled={isLoading}
                className="rounded-full px-4 sm:px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base"
              >
                <Clipboard className="mr-2 h-4 w-4" />
                Paste
              </Button>
              
              <Button
                type="submit"
                disabled={isLoading || !isFormValid}
                onClick={() => playClick()}
                className={`rounded-full px-6 sm:px-8 py-3 text-white shadow-lg transition-all duration-200 text-sm sm:text-base ${
                  isLoading || !isFormValid
                    ? "bg-gray-400 cursor-not-allowed opacity-60"
                    : downloadType === 'audio'
                    ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 hover:shadow-xl"
                    : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 hover:shadow-xl"
                }`}
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" text="Loading..." />
                ) : (
                  <>
                    {downloadType === 'audio' ? 'Download MP3' : 'Download Video'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Help Text */}
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mb-2">
              Paste a YouTube link (youtube.com or youtu.be)
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-xs mb-2">
              Choose {downloadType === 'audio' ? 'MP3 audio' : 'MP4 video'} format
            </p>
            {!isFormValid ? (
              <p className="text-gray-400 dark:text-gray-500 text-xs">
                {!videoUrl || videoUrl.trim() === "" 
                  ? "Enter a YouTube video URL to enable the download button"
                  : "Please enter a valid YouTube URL (youtube.com or youtu.be)"
                }
              </p>
            ) : (
              <p className="text-green-600 dark:text-green-400 text-xs">
                ✓ Ready to download {downloadType === 'audio' ? 'MP3' : 'video'}
              </p>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
});

export { YouTubeVideoForm };
