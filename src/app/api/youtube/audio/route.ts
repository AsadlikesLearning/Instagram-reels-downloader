import { NextRequest, NextResponse } from 'next/server';
import { YouTubeYtDlpDownloader } from '@/services/youtube/ytdlp-downloader';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const { url, filename } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    console.log('YouTube MP3 download request:', { url, filename });

    // Download the audio file
    const result = await YouTubeYtDlpDownloader.downloadYouTubeAudio(url, undefined, filename);

    if (!result.success || !result.filePath) {
      console.error('YouTube MP3 download failed:', result.error);
      return NextResponse.json(
        { error: result.error || 'MP3 download failed' },
        { status: 500 }
      );
    }

    console.log('YouTube MP3 download successful:', result.filePath);

    // Read the file and stream it back with progress tracking
    try {
      const fileBuffer = await fs.readFile(result.filePath);
      const fileSize = fileBuffer.length;

      // Clean up the temporary file
      await fs.unlink(result.filePath);

      // Create a readable stream for progress tracking
      const stream = new ReadableStream({
        start(controller) {
          const chunkSize = 256 * 1024; // 256KB chunks for smooth progress
          let offset = 0;
          
          const pushChunk = () => {
            if (offset >= fileBuffer.length) {
              controller.close();
              return;
            }
            
            const chunk = fileBuffer.slice(offset, offset + chunkSize);
            controller.enqueue(chunk);
            offset += chunkSize;
            
            // Use setTimeout to allow progress updates
            setTimeout(pushChunk, 10);
          };
          
          pushChunk();
        }
      });

      // Return the file as a stream with progress tracking
      return new NextResponse(stream, {
        status: 200,
        headers: {
          'Content-Type': 'audio/mpeg',
          'Content-Length': fileSize.toString(),
          'Content-Disposition': `attachment; filename="${result.metadata?.title || 'youtube-audio'}.mp3"`,
          'Cache-Control': 'no-cache',
          'Accept-Ranges': 'bytes',
        },
      });
    } catch (fileError) {
      console.error('Error reading MP3 file:', fileError);
      return NextResponse.json(
        { error: 'Failed to read MP3 file' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('YouTube MP3 download API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
