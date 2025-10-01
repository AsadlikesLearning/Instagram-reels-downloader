import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';
import { YouTubeDownloadResult } from '@/features/youtube/types';

export class YouTubeYtDlpDownloader {
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

  private static async cleanupIncompleteDownloads(downloadsDir: string): Promise<void> {
    try {
      const fs = await import('fs');
      const path = await import('path');
      
      if (!fs.existsSync(downloadsDir)) {
        return;
      }

      console.log(`🧹 Cleaning up incomplete downloads in '${downloadsDir}'...`);

      // Cleanup patterns like the Python code
      const cleanupPatterns = [
        '.part',
        '.ytdl', 
        '.temp',
        '.part-Frag',
        '.f.mp4.part',
        '.f.mp4.ytdl'
      ];

      let cleanedFiles = 0;

      // Recursively find and remove incomplete files
      const findAndClean = (dir: string) => {
        const files = fs.readdirSync(dir);
        
        for (const file of files) {
          const filePath = path.join(dir, file);
          const stat = fs.statSync(filePath);
          
          if (stat.isDirectory()) {
            findAndClean(filePath);
          } else {
            // Check if file matches cleanup patterns
            const shouldClean = cleanupPatterns.some(pattern => 
              file.includes(pattern) || file.endsWith(pattern)
            );
            
            if (shouldClean) {
              try {
                fs.unlinkSync(filePath);
                console.log(`🗑️  Removed: ${path.basename(filePath)}`);
                cleanedFiles++;
              } catch (error) {
                console.log(`❌ Failed to remove ${filePath}: ${error}`);
              }
            }
          }
        }
      };

      findAndClean(downloadsDir);

      if (cleanedFiles > 0) {
        console.log(`✅ Cleaned up ${cleanedFiles} incomplete files`);
      } else {
        console.log('✅ No incomplete files found');
      }
    } catch (error) {
      console.log(`❌ Cleanup error: ${error}`);
    }
  }

  private static async runPythonScript(action: string, url: string, outputPath?: string, filename?: string, audioOnly?: boolean): Promise<string> {
    const scriptPath = path.join(process.cwd(), 'python_downloader.py');
    const args = [scriptPath, action, url];
    
    if (outputPath) {
      args.push(outputPath);
    }
    if (filename) {
      args.push(filename);
    }
    if (audioOnly !== undefined) {
      args.push(audioOnly.toString());
    }

    return new Promise((resolve, reject) => {
      // Use a non-conflicting variable name to avoid shadowing Node's global `process`
      const child = spawn('python3', args, { 
        stdio: 'pipe',
        // Performance optimizations
        env: { ...process.env, PYTHONUNBUFFERED: '1' }
      });
      let stdout = '';
      let stderr = '';

      child.stdout?.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr?.on('data', (data) => {
        stderr += data.toString();
      });

      // Set timeout for better performance (configurable via env)
      const infoTimeoutMs = Number(process.env.YT_INFO_TIMEOUT_MS || '60000');
      const downloadTimeoutMs = Number(process.env.YT_DOWNLOAD_TIMEOUT_MS || '300000');
      const timeoutMs = action === 'info' ? infoTimeoutMs : downloadTimeoutMs;
      const timeout = setTimeout(() => {
        child.kill('SIGTERM');
        reject(new Error('Python script timeout'));
      }, timeoutMs);

      child.on('close', (code) => {
        clearTimeout(timeout);
        if (code === 0) {
          resolve(stdout);
        } else {
          // Check if stderr contains actual errors vs just warnings
          if (stderr.includes('ERROR:') && stderr.includes('403')) {
            reject(new Error(stderr));
          } else {
            // If it's just warnings, try to resolve with stdout
            resolve(stdout || stderr);
          }
        }
      });

      child.on('error', (error) => {
        clearTimeout(timeout);
        reject(error);
      });
    });
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
          // Check if it's a 403 error specifically
          if (stderr.includes('403') || stderr.includes('Forbidden')) {
            reject(new Error(`HTTP Error 403: Forbidden - ${stderr}`));
          } else {
            reject(new Error(stderr || `Command failed with code ${code}`));
          }
        }
      });

      process.on('error', (error) => {
        reject(error);
      });
    });
  }

  static async downloadYouTubeVideo(
    videoUrl: string,
    outputPath?: string,
    customFilename?: string
  ): Promise<YouTubeDownloadResult> {
    try {
      await this.ensureYtDlpInstalled();

      // Create temp directory if not provided
      const tempDir = outputPath || path.join(os.tmpdir(), 'youtube-downloads');
      await fs.mkdir(tempDir, { recursive: true });

      // Generate filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = customFilename || `youtube-video-${timestamp}.mp4`;
      const outputFile = path.join(tempDir, filename);

      console.log('Starting yt-dlp download for YouTube:', videoUrl);
      console.log('Output file:', outputFile);

      // Use Python script for download (like the working Python code)
      try {
        const result = await this.runPythonScript('download', videoUrl, tempDir, filename, false);
        const data = JSON.parse(result);
        
        if (!data.success) {
          // Check if it's a 403 Forbidden error (YouTube blocking)
          if (data.error && data.error.includes('403')) {
            throw new Error('YouTube is blocking this video. Try with an older video or use YouTube Premium for official downloads.');
          }
          throw new Error(data.error || 'Python download failed');
        }
        
        console.log('Python download successful:', data.filename);
      } catch (error) {
        console.error('Python download failed:', error);
        throw error;
      }
      
      try {
        await fs.access(outputFile);
        console.log('YouTube video file created successfully:', outputFile);

        // Try to read metadata from info JSON file
        const infoFile = outputFile.replace('.mp4', '.info.json');
        let metadata = null;
        
        try {
          const infoContent = await fs.readFile(infoFile, 'utf-8');
          const info = JSON.parse(infoContent);
          metadata = {
            title: info.title || 'YouTube Video',
            duration: info.duration || 0,
            uploader: info.uploader || 'Unknown',
            view_count: info.view_count || 0,
            like_count: info.like_count || 0,
            comment_count: info.comment_count || 0,
            thumbnail_url: info.thumbnail || info.thumbnails?.[0]?.url || '',
            video_url: info.url || videoUrl,
            description: info.description || '',
            tags: info.tags || [],
            category: info.categories?.[0] || 'Entertainment',
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
        console.error('YouTube video file not found after download:', fileError);
        return {
          success: false,
          error: 'Video file was not created successfully',
        };
      }
    } catch (error: any) {
      console.error('yt-dlp YouTube download failed:', error);
      return {
        success: false,
        error: error.message || 'Download failed',
      };
    }
  }

  static async downloadYouTubeAudio(
    videoUrl: string,
    outputPath?: string,
    customFilename?: string
  ): Promise<YouTubeDownloadResult> {
    try {
      await this.ensureYtDlpInstalled();

      // Create temp directory if not provided
      const tempDir = outputPath || path.join(os.tmpdir(), 'youtube-audio');
      await fs.mkdir(tempDir, { recursive: true });

      // Generate filename
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = customFilename || `youtube-audio-${timestamp}.mp3`;
      const outputFile = path.join(tempDir, filename);

      console.log('Starting yt-dlp audio download for YouTube:', videoUrl);
      console.log('Output file:', outputFile);

      // Use Python script for audio download
      try {
        const result = await this.runPythonScript('download', videoUrl, tempDir, filename, true);
        const data = JSON.parse(result);
        
        if (!data.success) {
          // Check if it's a 403 Forbidden error (YouTube blocking)
          if (data.error && data.error.includes('403')) {
            throw new Error('YouTube is blocking this video. Try with an older video or use YouTube Premium for official downloads.');
          }
          throw new Error(data.error || 'Python audio download failed');
        }
        
        console.log('Python audio download successful:', data.filename);
      } catch (error) {
        console.error('Python audio download failed:', error);
        throw error;
      }
      
      try {
        await fs.access(outputFile);
        console.log('YouTube audio file created successfully:', outputFile);

        // Try to read metadata from info JSON file
        const infoFile = outputFile.replace('.mp3', '.info.json');
        let metadata = null;
        
        try {
          const infoContent = await fs.readFile(infoFile, 'utf-8');
          const info = JSON.parse(infoContent);
          metadata = {
            title: info.title || 'YouTube Audio',
            duration: info.duration || 0,
            uploader: info.uploader || 'Unknown',
            view_count: info.view_count || 0,
            like_count: info.like_count || 0,
            comment_count: info.comment_count || 0,
            thumbnail_url: info.thumbnail || info.thumbnails?.[0]?.url || '',
            video_url: info.url || videoUrl,
            description: info.description || '',
            tags: info.tags || [],
            category: info.categories?.[0] || 'Entertainment',
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
        console.error('YouTube audio file not found after download:', fileError);
        return {
          success: false,
          error: 'Audio file was not created successfully',
        };
      }
    } catch (error: any) {
      console.error('yt-dlp YouTube audio download failed:', error);
      return {
        success: false,
        error: error.message || 'Audio download failed',
      };
    }
  }

  static async getYouTubeVideoInfo(videoUrl: string): Promise<YouTubeDownloadResult> {
    try {
      console.log('Getting YouTube video info for:', videoUrl);

      // Use Python script for video info extraction
      const result = await this.runPythonScript('info', videoUrl);
      const data = JSON.parse(result);

      if (!data.success) {
        return {
          success: false,
          error: data.error || 'Failed to extract video info',
        };
      }

      const metadata = {
        title: data.data.title || 'YouTube Video',
        duration: data.data.duration || 0,
        uploader: data.data.uploader || 'Unknown',
        view_count: data.data.view_count || 0,
        like_count: 0, // Not available in basic info
        comment_count: 0, // Not available in basic info
        thumbnail_url: data.data.thumbnail || '',
        video_url: data.data.webpage_url || videoUrl,
        description: data.data.description || '',
        tags: [], // Not available in basic info
        category: 'Entertainment',
      };

      console.log('YouTube video info extracted via Python:', metadata.title);
      return {
        success: true,
        metadata,
      };
    } catch (error: any) {
      console.error('Failed to get YouTube video info:', error);
      return {
        success: false,
        error: error.message || 'Failed to get video info',
      };
    }
  }
}
