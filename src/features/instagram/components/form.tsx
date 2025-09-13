"use client";

import React from "react";

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

import { getHttpErrorMessage } from "@/lib/http";

import { useVideoInfo } from "@/services/api/queries";

const formSchema = z.object({
  postUrl: z.string().url({
    message: "Provide a valid video link",
  }),
});

export function InstagramVideoForm() {
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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { postUrl } = values;
    try {
      console.log("getting video info", postUrl);
      const videoInfo = await getVideoInfo({ postUrl });
  
      const { filename, videoUrl } = videoInfo;
  
      console.log("videoUrl:", videoUrl);
  
      await downloadFile(videoUrl, filename);
    } catch (error: any) {
      console.log(error);
    }
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
                variant="outline"
                onClick={handlePaste}
                disabled={isPending}
                className="rounded-full px-6 py-3 border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-300 transition-colors"
              >
                <Clipboard className="mr-2 h-4 w-4" />
                Paste
              </Button>
              
              <Button
                type="submit"
                disabled={isPending || !form.getValues("postUrl")}
                className="rounded-full px-8 py-3 bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Start
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
