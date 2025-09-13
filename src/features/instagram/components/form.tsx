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

import { getHttpErrorMessage } from "@/lib/http";
import { VideoInfo } from "@/types";

import { useVideoInfo } from "@/services/api/queries";

const formSchema = z.object({
  postUrl: z.string().url({
    message: "Provide a valid video link",
  }),
});

export function InstagramVideoForm() {
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      postUrl: "",
    },
  });

  const { error, isPending, mutateAsync: getVideoInfo } = useVideoInfo();

  const httpError = getHttpErrorMessage(error);

  // Handle paste from clipboard
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        form.setValue("postUrl", text);
      }
    } catch (err) {
      console.log("Failed to read clipboard:", err);
      // If clipboard API fails, we'll just ignore it silently
    }
  };

  // Handle form submission - get video info for preview
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { postUrl } = values;
    try {
      console.log("getting video info", postUrl);
      const videoData = await getVideoInfo({ postUrl });
      setVideoInfo(videoData);
    } catch (error: any) {
      console.log(error);
    }
  }

  // Handle actual download from preview
  const handleDownload = async () => {
    if (!videoInfo) return;
    
    setIsDownloading(true);
    try {
      console.log("downloading video:", videoInfo.videoUrl);
      await downloadFile(videoInfo.videoUrl, videoInfo.filename);
    } catch (error: any) {
      console.log("Download error:", error);
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
        onDownload={handleDownload}
        onBack={handleBack}
      />
    );
  }
  
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 backdrop-blur-sm">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Error Message */}
          {httpError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">
              {httpError}
            </div>
          )}

          {/* Input and Buttons */}
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="postUrl"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      type="url"
                      placeholder="Paste video URL here"
                      className="h-14 text-lg rounded-full border-gray-200 px-6 focus:border-purple-400 focus:ring-purple-400 transition-colors"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="ml-6 text-sm" />
                </FormItem>
              )}
            />

            {/* Buttons */}
            <div className="flex gap-3 justify-center">
              <Button
                type="button"
                onClick={handlePaste}
                disabled={isPending}
                className="rounded-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Clipboard className="mr-2 h-4 w-4" />
                Paste
              </Button>
              
              <Button
                type="submit"
                disabled={isPending || !form.getValues("postUrl")}
                className="rounded-full px-8 py-3 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-400 hover:to-red-400 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading Preview...
                  </>
                ) : (
                  <>
                    Preview
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Help Text */}
          <p className="text-gray-500 text-center text-sm">
            Paste a link from TikTok, Instagram, YouTube, Facebook, or other platforms
          </p>
        </form>
      </Form>
    </div>
  );
}

// Utility function for download
export async function downloadFile(videoUrl: string, filename: string) {
  try {
    const response = await fetch(videoUrl);

    if (!response.ok) {
      throw new Error("Failed to fetch the video for download.");
    }

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = filename; // Set the filename for the download
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Cleanup blob URL
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Error during file download:", error);
  }
}
