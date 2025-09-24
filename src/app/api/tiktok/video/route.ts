import { NextResponse } from "next/server";
import { HTTPError } from "@/lib/errors";
import { makeErrorResponse, makeSuccessResponse } from "@/lib/http";
import { TikTokVideoInfo } from "@/features/tiktok/types";
import { TIKTOK_CONFIGS } from "@/features/tiktok/constants";
import { TikTokScraper } from "@/services/tiktok/scraper";
import { YtDlpDownloader } from "@/services/tiktok/ytdlp-downloader";

function handleError(error: any) {
  if (error instanceof HTTPError) {
    const response = makeErrorResponse(error.message);
    return NextResponse.json(response, { status: error.status });
  } else {
    console.error(error);
    const response = makeErrorResponse();
    return NextResponse.json(response, { status: 500 });
  }
}

export async function GET(request: Request) {
  if (!TIKTOK_CONFIGS.enableServerAPI) {
    const notImplementedResponse = makeErrorResponse("TikTok API not implemented");
    return NextResponse.json(notImplementedResponse, { status: 501 });
  }

  const url = new URL(request.url);
  const videoUrl = url.searchParams.get("url");

  if (!videoUrl) {
    const badRequestResponse = makeErrorResponse("TikTok URL is required");
    return NextResponse.json(badRequestResponse, { status: 400 });
  }

  try {
    console.log("Extracting TikTok video info for:", videoUrl);
    
    // Try yt-dlp first for better metadata extraction
    try {
      console.log("Trying yt-dlp for video info...");
      const ytdlpResult = await YtDlpDownloader.getVideoInfo(videoUrl);
      
      if (ytdlpResult.success && ytdlpResult.metadata) {
        console.log("yt-dlp extraction successful");
        
        // Convert yt-dlp metadata to TikTokVideoInfo format
        const videoInfo: TikTokVideoInfo = {
          id: videoUrl.split('/').pop() || 'unknown',
          videoUrl: videoUrl, // yt-dlp will handle the actual download URL
          thumbnailUrl: ytdlpResult.metadata.thumbnail_url || "",
          title: ytdlpResult.metadata.title,
          description: ytdlpResult.metadata.title,
          duration: ytdlpResult.metadata.duration,
          width: "720",
          height: "1280",
          filename: `tiktok-${Date.now()}.mp4`,
          size: 0,
          owner: {
            username: ytdlpResult.metadata.uploader,
            fullName: ytdlpResult.metadata.uploader,
            profilePicUrl: "",
            isVerified: false,
          },
          stats: {
            likes: ytdlpResult.metadata.like_count,
            comments: ytdlpResult.metadata.comment_count,
            shares: 0,
            views: ytdlpResult.metadata.view_count,
          },
          postedAt: Date.now() / 1000,
          hashtags: [],
          music: {
            title: "Original Sound",
            artist: "Unknown",
            url: "",
          },
        };
        
        console.log("TikTok video info extracted via yt-dlp:", videoInfo.id);
        
        const response_data = makeSuccessResponse<TikTokVideoInfo>(videoInfo);
        return NextResponse.json(response_data, { status: 200 });
      }
    } catch (ytdlpError) {
      console.log("yt-dlp extraction failed, falling back to scraper:", ytdlpError);
    }
    
    // Fallback to TikTok scraper service
    console.log("Using TikTok scraper as fallback...");
    const videoInfo = await TikTokScraper.extractVideoInfo(videoUrl);
    
    console.log("TikTok video info extracted:", videoInfo.id);
    
    const response_data = makeSuccessResponse<TikTokVideoInfo>(videoInfo);
    return NextResponse.json(response_data, { status: 200 });
  } catch (error: any) {
    console.error("TikTok extraction error:", error);
    return handleError(error);
  }
}

