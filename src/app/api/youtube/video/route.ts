import { NextResponse } from "next/server";
import { HTTPError } from "@/lib/errors";
import { makeErrorResponse, makeSuccessResponse } from "@/lib/http";
import { YouTubeVideoInfo } from "@/features/youtube/types";
import { YOUTUBE_CONFIGS } from "@/features/youtube/constants";
import { YouTubeYtDlpDownloader } from "@/services/youtube/ytdlp-downloader";
import { generateYouTubeFilename } from "@/features/youtube/utils";

// Simple in-memory cache for video info (5 minutes)
const videoInfoCache = new Map<string, { data: YouTubeVideoInfo; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

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
  if (!YOUTUBE_CONFIGS.enableServerAPI) {
    const notImplementedResponse = makeErrorResponse("YouTube API not implemented");
    return NextResponse.json(notImplementedResponse, { status: 501 });
  }

  const url = new URL(request.url);
  const videoUrl = url.searchParams.get("url");

  if (!videoUrl) {
    const badRequestResponse = makeErrorResponse("YouTube URL is required");
    return NextResponse.json(badRequestResponse, { status: 400 });
  }

  try {
    console.log("Extracting YouTube video info for:", videoUrl);
    
    // Check cache first
    const cacheKey = videoUrl;
    const cached = videoInfoCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      console.log("Using cached video info for:", videoUrl);
      const response_data = makeSuccessResponse<YouTubeVideoInfo>(cached.data);
      return NextResponse.json(response_data, { status: 200 });
    }
    
    // Use yt-dlp for YouTube video info extraction
    console.log("Using yt-dlp for YouTube video info...");
    const ytdlpResult = await YouTubeYtDlpDownloader.getYouTubeVideoInfo(videoUrl);
    
    if (ytdlpResult.success && ytdlpResult.metadata) {
      console.log("yt-dlp extraction successful");
      
      // Convert yt-dlp metadata to YouTubeVideoInfo format
      const videoInfo: YouTubeVideoInfo = {
        id: videoUrl.split('v=')[1]?.split('&')[0] || 'unknown',
        videoUrl: videoUrl, // yt-dlp will handle the actual download URL
        thumbnailUrl: ytdlpResult.metadata.thumbnail_url || "",
        title: ytdlpResult.metadata.title,
        description: ytdlpResult.metadata.description || "",
        duration: ytdlpResult.metadata.duration,
        width: "1920",
        height: "1080",
        filename: generateYouTubeFilename(ytdlpResult.metadata.title, videoUrl.split('v=')[1]?.split('&')[0] || 'unknown'),
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
          views: ytdlpResult.metadata.view_count,
        },
        postedAt: Date.now() / 1000,
        tags: ytdlpResult.metadata.tags || [],
        category: ytdlpResult.metadata.category || "Entertainment",
      };
      
      console.log("YouTube video info extracted via yt-dlp:", videoInfo.id);
      
      // Cache the result
      videoInfoCache.set(cacheKey, { data: videoInfo, timestamp: Date.now() });
      
      const response_data = makeSuccessResponse<YouTubeVideoInfo>(videoInfo);
      return NextResponse.json(response_data, { status: 200 });
    } else {
      throw new Error(ytdlpResult.error || "Failed to extract video info");
    }
  } catch (error: any) {
    console.error("YouTube extraction error:", error);
    return handleError(error);
  }
}
