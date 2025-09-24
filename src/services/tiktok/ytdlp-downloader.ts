import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';

export interface YtDlpDownloadResult {
  success: boolean;
  filePath?: string;
  error?: string;
  metadata?: {
    title: string;
    duration: number;
    uploader: string;
    view_count: number;
    like_count: number;
    comment_count: number;
    thumbnail_url?: string;
    video_url?: string;
  };
}

export class YtDlpDownloader {
  private static async ensureYtDlpInstalled(): Promise<void> {
    try {
      // Check if yt-dlp is available
      await this.runCommand('yt-dlp', ['--version']);
    } catch (error) {
      console.log('yt-dlp not found, attempting to install...');
      // Try to install yt-dlp using pip
      try {
        await this.runCommand('pip', ['install', 'yt-dlp']);
        console.log('yt-dlp installed successfully');
      } catch (installError) {
        console.error('Failed to install yt-dlp:', installError);
        throw new Error('yt-dlp is required but not installed. Please install it manually.');
      }
    }
  }

  private static runCommand(command: string, args: string[]): Promise<string> {
    return new Promise((resolve, reject) => {
      const process = spawn(command, args, { stdio: 'pipe' });
      let stdout = '';
      let stderr = '';

      process.stdout?.on('data', (data) => {
        stdout += data.toString();
      });

      process.stderr?.on('data', (data) => {
        stderr += data.toString();
      });

      process.on('close', (code) => {
        if (code === 0) {
          resolve(stdout);
        } else {
          reject(new Error(stderr || `Command failed with code ${code}`));
        }
      });

      process.on('error', (error) => {
        reject(error);
      });
    });
  }

  static async downloadTikTokVideo(
    videoUrl: string,
    outputPath?: string,
    customFilename?: string
  ): Promise<YtDlpDownloadResult> {
    try {
      await this.ensureYtDlpInstalled();

      // Create temp directory if not provided
      const tempDir = outputPath || path.join(os.tmpdir(), 'tiktok-downloads');
      await fs.mkdir(tempDir, { recursive: true });

      // Generate filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = customFilename || `tiktok-video-${timestamp}.mp4`;
      const outputFile = path.join(tempDir, filename);

      console.log('Starting yt-dlp download for:', videoUrl);
      console.log('Output file:', outputFile);

      // yt-dlp command arguments optimized for speed
      const args = [
        videoUrl,
        '-o', outputFile,
        '--format', 'best[ext=mp4]/best',
        '--no-playlist',
        '--write-info-json',
        '--write-thumbnail',
        '--no-warnings',
        '--ignore-errors',
        '--concurrent-fragments', '4', // Download multiple fragments simultaneously
        '--fragment-retries', '3', // Retry failed fragments
        '--retries', '3', // Retry failed downloads
        '--socket-timeout', '30', // Socket timeout
        '--user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        '--referer', 'https://www.tiktok.com/',
        '--add-header', 'Origin:https://www.tiktok.com',
        '--add-header', 'Sec-Fetch-Dest:video',
        '--add-header', 'Sec-Fetch-Mode:cors',
        '--add-header', 'Sec-Fetch-Site:cross-site'
      ];

      // Run yt-dlp
      const output = await this.runCommand('yt-dlp', args);
      console.log('yt-dlp output:', output);

      // Check if file was created
      try {
        await fs.access(outputFile);
        console.log('Video file created successfully:', outputFile);

        // Try to read metadata from info JSON file
        const infoFile = outputFile.replace('.mp4', '.info.json');
        let metadata = null;
        
        try {
          const infoContent = await fs.readFile(infoFile, 'utf-8');
          const info = JSON.parse(infoContent);
          metadata = {
            title: info.title || 'TikTok Video',
            duration: info.duration || 0,
            uploader: info.uploader || 'Unknown',
            view_count: info.view_count || 0,
            like_count: info.like_count || 0,
            comment_count: info.comment_count || 0,
          };
        } catch (metaError) {
          console.log('Could not read metadata:', metaError);
        }

        return {
          success: true,
          filePath: outputFile,
          metadata: metadata || undefined,
        };
      } catch (fileError) {
        console.error('Video file not found after download:', fileError);
        return {
          success: false,
          error: 'Video file was not created successfully',
        };
      }
    } catch (error: any) {
      console.error('yt-dlp download failed:', error);
      return {
        success: false,
        error: error.message || 'Download failed',
      };
    }
  }

  static async getVideoInfo(videoUrl: string): Promise<YtDlpDownloadResult> {
    try {
      await this.ensureYtDlpInstalled();

      console.log('Getting video info for:', videoUrl);

      // yt-dlp command to get video info without downloading
      const args = [
        videoUrl,
        '--dump-json',
        '--no-playlist',
        '--user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        '--referer', 'https://www.tiktok.com/',
        '--add-header', 'Origin:https://www.tiktok.com',
        '--add-header', 'Sec-Fetch-Dest:video',
        '--add-header', 'Sec-Fetch-Mode:cors',
        '--add-header', 'Sec-Fetch-Site:cross-site'
      ];

      const output = await this.runCommand('yt-dlp', args);
      const info = JSON.parse(output);

      const metadata = {
        title: info.title || 'TikTok Video',
        duration: info.duration || 0,
        uploader: info.uploader || 'Unknown',
        view_count: info.view_count || 0,
        like_count: info.like_count || 0,
        comment_count: info.comment_count || 0,
        thumbnail_url: info.thumbnail || info.thumbnails?.[0]?.url || '',
        video_url: info.url || videoUrl,
      };

      return {
        success: true,
        metadata,
      };
    } catch (error: any) {
      console.error('Failed to get video info:', error);
      return {
        success: false,
        error: error.message || 'Failed to get video info',
      };
    }
  }
}
