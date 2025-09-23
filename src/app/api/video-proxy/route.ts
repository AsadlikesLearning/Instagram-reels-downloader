import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const videoUrl = url.searchParams.get("url");
  const filename = url.searchParams.get("filename");

  if (!videoUrl) {
    return NextResponse.json({ error: "Video URL is required" }, { status: 400 });
  }

  if (!filename) {
    return NextResponse.json({ error: "Filename is required" }, { status: 400 });
  }

  try {
    console.log("Proxying video download:", videoUrl);
    
    // Fetch the video from Instagram's CDN
    const response = await fetch(videoUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'video/mp4,video/*,*/*',
        'Accept-Encoding': 'identity',
        'Cache-Control': 'no-cache',
        'Referer': 'https://www.instagram.com/',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch video: ${response.status} ${response.statusText}`);
    }

    // Get the video content
    const videoBuffer = await response.arrayBuffer();
    
    // Return the video with proper headers for download
    return new NextResponse(videoBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': videoBuffer.byteLength.toString(),
        'Cache-Control': 'no-cache',
      },
    });

  } catch (error: any) {
    console.error("Video proxy error:", error);
    return NextResponse.json({ error: "Failed to download video" }, { status: 500 });
  }
}
