import { NextResponse } from "next/server";
import { HTTPError } from "@/lib/errors";
import { makeErrorResponse } from "@/lib/http";
import { YOUTUBE_CONFIGS } from "@/features/youtube/constants";
import { YouTubeYtDlpDownloader } from "@/services/youtube/ytdlp-downloader";
import { promises as fs } from 'fs';
import path from 'path';

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
    const notImplementedResponse = makeErrorResponse("YouTube download not implemented");
    return NextResponse.json(notImplementedResponse, { status: 501 });
  }

  const url = new URL(request.url);
  const videoUrl = url.searchParams.get("url");
  const filename = url.searchParams.get("filename");

  if (!videoUrl) {
    const badRequestResponse = makeErrorResponse("Video URL is required");
    return NextResponse.json(badRequestResponse, { status: 400 });
  }

  if (!filename) {
    const badRequestResponse = makeErrorResponse("Filename is required");
    return NextResponse.json(badRequestResponse, { status: 400 });
  }

  try {
    console.log("Downloading YouTube video using yt-dlp:", videoUrl);
    
    // Use yt-dlp to download the video
    const result = await YouTubeYtDlpDownloader.downloadYouTubeVideo(videoUrl, undefined, filename);
    
    if (!result.success) {
      console.error("yt-dlp download failed:", result.error);
      
      // Check if it's a 403 Forbidden error (YouTube blocking)
      if (result.error && (result.error.includes('403') || result.error.includes('Forbidden'))) {
        return new NextResponse(JSON.stringify({
          error: "YouTube downloads unavailable",
          message: "YouTube has implemented strict anti-bot measures that permanently block all automated downloads. This is not a temporary issue.",
          explanation: "YouTube actively prevents automated downloads to protect their content and comply with copyright laws. This is a permanent restriction.",
          alternatives: [
            {
              name: "YouTube Premium",
              description: "Official offline downloads with YouTube Premium subscription",
              recommended: true
            },
            {
              name: "YouTube Mobile App",
              description: "Built-in offline feature in the official YouTube mobile app",
              recommended: true
            },
            {
              name: "Screen Recording",
              description: "Use OBS Studio, QuickTime, or similar screen recording tools",
              recommended: false
            },
            {
              name: "Browser Extensions",
              description: "Third-party browser extensions (use at your own risk)",
              recommended: false
            }
          ],
          originalUrl: videoUrl,
          status: "permanently_blocked",
          isPermanent: true,
          note: "This is not a bug - YouTube intentionally blocks all automated downloads"
        }), {
          status: 403,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Retry-After': '0' // Don't suggest retrying
          },
        });
      }
      
      // Return fallback response for other errors
      return new NextResponse(JSON.stringify({
        error: "YouTube download failed",
        message: result.error || "Failed to download video using yt-dlp",
        instructions: "Please try using YouTube's official download feature or a dedicated YouTube downloader app",
        originalUrl: videoUrl,
        alternative: "Consider using YouTube Premium for offline downloads",
        status: "error"
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    if (!result.filePath) {
      throw new HTTPError("Download completed but file path not found", 500);
    }

    // Read the downloaded file with streaming for better performance
    const videoBuffer = await fs.readFile(result.filePath);
    
    // Clean up the temporary file asynchronously (don't wait)
    const filePath = result.filePath; // narrow for TS inside closure
    setImmediate(async () => {
      try {
        await fs.unlink(filePath);
      } catch (cleanupError) {
        console.log("Could not clean up temporary file:", cleanupError);
      }
    });

    // Get content info
    const contentLength = videoBuffer.length;
    const contentType = 'video/mp4';
    
    // Create a readable stream from the buffer with optimized chunk size
    const stream = new ReadableStream({
      start(controller) {
        // Send the video buffer in optimized chunks (64KB)
        const chunkSize = 256 * 1024; // 256KB chunks for faster streaming
        let offset = 0;
        let isClosed = false;
        
        const pump = () => {
          if (isClosed || offset >= videoBuffer.length) {
            if (!isClosed) {
              controller.close();
              isClosed = true;
            }
            return;
          }
          
          const chunk = videoBuffer.slice(offset, offset + chunkSize);
          try {
            controller.enqueue(chunk);
            offset += chunkSize;
            
            // Use setImmediate for better performance
            setImmediate(pump);
          } catch (error) {
            console.log('Stream controller error:', error);
            if (!isClosed) {
              controller.close();
              isClosed = true;
            }
          }
        };
        
        pump();
      }
    });
    
    // Return streaming response with proper headers
    return new NextResponse(stream, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': contentLength.toString(),
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'no-cache',
      },
    });

  } catch (error: any) {
    return handleError(error);
  }
}
