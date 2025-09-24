import { NextResponse } from "next/server";
import { HTTPError } from "@/lib/errors";
import { makeErrorResponse } from "@/lib/http";
import { TIKTOK_CONFIGS } from "@/features/tiktok/constants";
import { YtDlpDownloader } from "@/services/tiktok/ytdlp-downloader";
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
  if (!TIKTOK_CONFIGS.enableServerAPI) {
    const notImplementedResponse = makeErrorResponse("TikTok download not implemented");
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
    console.log("Downloading TikTok video using yt-dlp:", videoUrl);
    
    // Use yt-dlp to download the video
    const result = await YtDlpDownloader.downloadTikTokVideo(videoUrl, undefined, filename);
    
    if (!result.success) {
      console.error("yt-dlp download failed:", result.error);
      
      // Return fallback response
      return new NextResponse(JSON.stringify({
        error: "TikTok download failed",
        message: result.error || "Failed to download video using yt-dlp",
        instructions: "Please try using TikTok's official download feature or a dedicated TikTok downloader app",
        originalUrl: videoUrl,
        alternative: "Consider using TikTok's built-in download feature"
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    if (!result.filePath) {
      throw new HTTPError("Download completed but file path not found", 500);
    }

    // Read the downloaded file
    const videoBuffer = await fs.readFile(result.filePath);
    
    // Clean up the temporary file
    try {
      await fs.unlink(result.filePath);
    } catch (cleanupError) {
      console.log("Could not clean up temporary file:", cleanupError);
    }

    // Get content info
    const contentLength = videoBuffer.length;
    const contentType = 'video/mp4';
    
    // Create a readable stream from the buffer
    const stream = new ReadableStream({
      start(controller) {
        // Send the video buffer in chunks
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
