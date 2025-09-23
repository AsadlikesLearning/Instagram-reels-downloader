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
    
    // Fetch the video from Instagram with streaming support
    const videoResponse = await fetch(videoInfo.videoUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'video/mp4,video/*,*/*',
        'Accept-Encoding': 'identity', // Disable compression for streaming
        'Cache-Control': 'no-cache',
      },
    });

    if (!videoResponse.ok) {
      throw new HTTPError("Failed to fetch video from Instagram", 500);
    }

    // Get content length for proper headers
    const contentLength = videoResponse.headers.get('content-length');
    const contentType = videoResponse.headers.get('content-type') || 'video/mp4';
    
    // Create a readable stream for streaming download
    const stream = new ReadableStream({
      start(controller) {
        const reader = videoResponse.body?.getReader();
        
        if (!reader) {
          controller.close();
          return;
        }

        function pump(): Promise<void> {
          return reader!.read().then(({ done, value }) => {
            if (done) {
              controller.close();
              return;
            }
            
            // Send chunk to client
            controller.enqueue(value);
            return pump();
          }).catch((error) => {
            console.error('Stream error:', error);
            controller.error(error);
          });
        }

        return pump();
      }
    });
    
    // Return streaming response with proper headers
    return new NextResponse(stream, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'no-cache',
        ...(contentLength && { 'Content-Length': contentLength }),
      },
    });

  } catch (error: any) {
    return handleError(error);
  }
}