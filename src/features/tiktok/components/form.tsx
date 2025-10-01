"use client";

import React, { useState } from "react";
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
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useSounds } from "@/lib/sounds";
import { getHttpErrorMessage } from "@/lib/http";
import { TikTokVideoInfo } from "../types";
import { downloadFileWithProgress, DownloadProgress } from "@/lib/download-utils";
import { trackSearch, trackDownload, trackError } from "@/lib/analytics";

const formSchema = z.object({
  videoUrl: z.string().url({
    message: "Provide a valid TikTok video link",
  }),
});

export function TikTokVideoForm() {
  const [videoInfo, setVideoInfo] = useState<TikTokVideoInfo | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<DownloadProgress | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      videoUrl: "",
    },
  });

  const { playDownloadSuccess, playClick } = useSounds();
  
  // Watch the form field to make button state reactive
  const videoUrl = form.watch("videoUrl");
  
  // Check if URL is valid and belongs to TikTok
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };
  const isTikTokUrl = (url: string) => {
    try {
      const u = new URL(url);
      const host = u.hostname.toLowerCase();
      return host.includes('tiktok.com') || host.includes('vm.tiktok.com');
    } catch {
      return false;
    }
  }
  
  const isFormValid = !!(videoUrl && videoUrl.trim() !== "" && isValidUrl(videoUrl.trim()) && isTikTokUrl(videoUrl.trim()));

  const httpError = getHttpErrorMessage(error);

  // Handle paste from clipboard
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        form.setValue("videoUrl", text);
      }
    } catch (err) {
      console.log("Failed to read clipboard:", err);
    }
  };

  // Handle form submission - get video info for preview
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { videoUrl } = values;
    try {
      console.log("Getting TikTok video info", videoUrl);
      setIsLoading(true);
      setError(null);
      
      // Track search event
      trackSearch(videoUrl);
      
      if (!isTikTokUrl(videoUrl)) {
        throw new Error('Please enter a valid TikTok link');
      }
      const response = await fetch(`/api/tiktok/video?url=${encodeURIComponent(videoUrl)}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get video info');
      }
      
      setVideoInfo(data.data);
      // Play success sound when preview is ready
      playDownloadSuccess();
    } catch (error: any) {
      console.log(error);
      setError(error);
      // Track error event
      trackError(error.message || 'Unknown error', 'tiktok_video_info_fetch');
    } finally {
      setIsLoading(false);
    }
  }

  // Handle actual download from preview
  const handleDownload = async () => {
    if (!videoInfo) {
      console.log("No video info available for download");
      return;
    }
    
    console.log("Starting TikTok download process...");
    setIsDownloading(true);
    setDownloadProgress(null);
    
    try {
      console.log("Video URL:", videoInfo.videoUrl);
      console.log("Filename:", videoInfo.filename);
      
      // Track download event
      trackDownload(videoInfo.videoUrl, videoInfo.filename);
      
      // Use server-side download to avoid CORS issues
      await downloadFileWithProgress(videoInfo.videoUrl, videoInfo.filename, {
        useQuickDownload: true,
        chunkSize: 131072, // 128KB chunks for optimal performance
        onProgress: (progress) => {
          console.log("Download progress:", progress.progress + "%");
          setDownloadProgress(progress);
        },
        onComplete: () => {
          console.log("TikTok download completed successfully!");
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
          console.error("TikTok download error:", error);
          // Track download error
          trackError(error.message || 'Download failed', 'tiktok_video_download');
          setDownloadProgress(null);
        }
      });
      
    } catch (error: any) {
      console.error("TikTok download failed:", error);
      setDownloadProgress(null);
    } finally {
      setIsDownloading(false);
    }
  };

  // Handle back to search
  const handleBack = () => {
    setVideoInfo(null);
    form.reset();
  };

  // Show preview if we have video info
  if (videoInfo) {
    return (
      <VideoPreview
        videoInfo={videoInfo}
        isDownloading={isDownloading}
        downloadProgress={downloadProgress}
        onDownload={handleDownload}
        onBack={handleBack}
      />
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-4 sm:p-6 lg:p-8 backdrop-blur-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
          {/* Error Message */}
          {httpError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-red-600 dark:text-red-400 text-sm">
              {httpError}
            </div>
          )}

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
                      placeholder="Paste TikTok video URL here"
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
                    : "bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-400 hover:to-red-400 hover:shadow-xl"
                }`}
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" text="Loading..." />
                ) : (
                  <>
                    Download
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Help Text */}
          <div className="text-center">
            <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mb-2">
              Paste a TikTok link (tiktok.com or vm.tiktok.com)
            </p>
            {!isFormValid ? (
              <p className="text-gray-400 dark:text-gray-500 text-xs">
                {!videoUrl || videoUrl.trim() === "" 
                  ? "Enter a TikTok video URL to enable the download button"
                  : "Please enter a valid TikTok URL (tiktok.com or vm.tiktok.com)"
                }
              </p>
            ) : (
              <p className="text-green-600 dark:text-green-400 text-xs">
                ✓ Ready to download
              </p>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
