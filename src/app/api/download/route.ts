import { NextResponse } from "next/server";

import { HTTPError } from "@/lib/errors";
import { makeErrorResponse } from "@/lib/http";

import { getVideoInfo } from "@/features/instagram";
import { INSTAGRAM_CONFIGS } from "@/features/instagram/constants";
import { getPostIdFromUrl } from "@/features/instagram/utils";

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
  if (!INSTAGRAM_CONFIGS.enableServerAPI) {
    const notImplementedResponse = makeErrorResponse("Not Implemented");
    return NextResponse.json(notImplementedResponse, { status: 501 });
  }

  const url = new URL(request.url);
  const postUrl = url.searchParams.get("postUrl");
  const filename = url.searchParams.get("filename");

  if (!postUrl) {
    const badRequestResponse = makeErrorResponse("Post URL is required");
    return NextResponse.json(badRequestResponse, { status: 400 });
  }

  if (!filename) {
    const badRequestResponse = makeErrorResponse("Filename is required");
    return NextResponse.json(badRequestResponse, { status: 400 });
  }

  try {
    const postId = await getPostIdFromUrl(postUrl);
    if (!postId) {
      const noPostIdResponse = makeErrorResponse("Invalid Post URL");
      return NextResponse.json(noPostIdResponse, { status: 400 });
    }

    const videoInfo = await getVideoInfo(postId);
    
    // Fetch the video from Instagram with optimized settings
    const videoResponse = await fetch(videoInfo.videoUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Connection': 'keep-alive',
        'Cache-Control': 'no-cache',
      },
      // Add timeout and retry logic
      signal: AbortSignal.timeout(60000), // 60 seconds timeout
    });

    if (!videoResponse.ok) {
      throw new HTTPError("Failed to fetch video from Instagram", 500);
    }

    // Stream the video content directly without loading into memory
    const videoStream = videoResponse.body;
    
    if (!videoStream) {
      throw new HTTPError("No video stream available", 500);
    }

    // Return the video stream with proper headers for download
    return new NextResponse(videoStream, {
      status: 200,
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': videoResponse.headers.get('content-length') || '0',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error: any) {
    return handleError(error);
  }
}