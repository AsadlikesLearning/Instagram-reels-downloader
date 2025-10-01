export interface DownloadProgress {
  progress: number; // 0-100
  downloadedBytes: number;
  totalBytes: number;
  speed: string;
  timeRemaining: string;
  isComplete: boolean;
  isStreaming?: boolean;
}

export interface DownloadOptions {
  onProgress?: (progress: DownloadProgress) => void;
  onComplete?: () => void;
  onError?: (error: Error) => void;
  useQuickDownload?: boolean; // Enable streaming download
  chunkSize?: number; // Size of chunks for streaming (default: 128KB)
}

export async function downloadFileWithProgress(
  videoUrl: string, 
  filename: string, 
  options: DownloadOptions = {}
): Promise<void> {
  const { onProgress, onComplete, onError, useQuickDownload = true, chunkSize = 131072 } = options;
  
  try {
    console.log("Starting downloadFileWithProgress...");
    console.log("Video URL:", videoUrl);
    console.log("Filename:", filename);
    
    // Validate inputs
    if (!videoUrl || !filename) {
      throw new Error("Invalid video URL or filename");
    }

    // Show initial progress with better feedback
    onProgress?.({
      progress: 0,
      downloadedBytes: 0,
      totalBytes: 0,
      speed: "Initializing...",
      timeRemaining: "Preparing download...",
      isComplete: false,
      isStreaming: useQuickDownload
    });

    // Use server-side download to avoid CORS issues
    console.log("Using server-side download to avoid CORS...");
    await downloadViaServer(videoUrl, filename, onProgress, onComplete, onError);
    
  } catch (error) {
    console.error("Download error:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown download error';
    onError?.(new Error(errorMessage));
    throw error;
  }
}

async function downloadWithStreaming(
  videoUrl: string,
  filename: string,
  totalBytes: number,
  onProgress?: (progress: DownloadProgress) => void,
  onComplete?: () => void,
  onError?: (error: Error) => void,
  chunkSize: number = 65536
): Promise<void> {
  const startTime = Date.now();
  let downloadedBytes = 0;
  let lastUpdateTime = startTime;
  let lastDownloadedBytes = 0;

  try {
    const response = await fetch(videoUrl, {
      headers: {
        'Accept': 'video/mp4,video/*,*/*',
        'Accept-Encoding': 'identity',
        'Cache-Control': 'no-cache',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch video: ${response.status} ${response.statusText}`);
    }

    if (!response.body) {
      throw new Error('Response body is not available for streaming');
    }

    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];

    // Read stream in chunks
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;
      
      chunks.push(value);
      downloadedBytes += value.length;

    // Update progress every 200ms or every 128KB for smoother updates
    const now = Date.now();
    if (now - lastUpdateTime > 200 || downloadedBytes - lastDownloadedBytes > chunkSize * 2) {
      const progress = totalBytes > 0 ? Math.min((downloadedBytes / totalBytes) * 100, 99) : 0;
      const speed = calculateSpeed(downloadedBytes, startTime, now);
      const timeRemaining = calculateTimeRemaining(downloadedBytes, totalBytes, speed);

      onProgress?.({
        progress,
        downloadedBytes,
        totalBytes,
        speed,
        timeRemaining,
        isComplete: false,
        isStreaming: true
      });

      lastUpdateTime = now;
      lastDownloadedBytes = downloadedBytes;
    }
    }

    // Combine all chunks into a single blob
    const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
    const combined = new Uint8Array(totalLength);
    let offset = 0;
    
    for (const chunk of chunks) {
      combined.set(chunk, offset);
      offset += chunk.length;
    }

    const blob = new Blob([combined], { type: 'video/mp4' });
    
    // Trigger download
    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = filename;
    a.style.display = "none";
    
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Cleanup
    window.URL.revokeObjectURL(blobUrl);
    
    // Final progress update
    const endTime = Date.now();
    const finalSpeed = calculateSpeed(downloadedBytes, startTime, endTime);
    
    onProgress?.({
      progress: 100,
      downloadedBytes,
      totalBytes,
      speed: finalSpeed,
      timeRemaining: "0s",
      isComplete: true,
      isStreaming: true
    });
    
    onComplete?.();
    
  } catch (error) {
    onError?.(error as Error);
    throw error;
  }
}

async function downloadViaServer(
  videoUrl: string,
  filename: string,
  onProgress?: (progress: DownloadProgress) => void,
  onComplete?: () => void,
  onError?: (error: Error) => void
): Promise<void> {
  const startTime = Date.now();
  
  try {
    console.log("Starting server proxy download...");
    
    // Show initial progress with better messaging
    onProgress?.({
      progress: 5,
      downloadedBytes: 0,
      totalBytes: 0,
      speed: "Connecting to server...",
      timeRemaining: "Initializing...",
      isComplete: false
    });

    // Use a server-side proxy to download the video
    // Check if it's a TikTok, YouTube, or Instagram video URL
    const isTikTokUrl = videoUrl.includes('tiktok.com') || 
                       videoUrl.includes('sample-videos.com') || 
                       videoUrl.includes('commondatastorage.googleapis.com');
    const isYouTubeUrl = videoUrl.includes('youtube.com') || 
                         videoUrl.includes('youtu.be');
    
    let proxyUrl;
    if (isTikTokUrl) {
      proxyUrl = `/api/tiktok/download?url=${encodeURIComponent(videoUrl)}&filename=${encodeURIComponent(filename)}`;
    } else if (isYouTubeUrl) {
      proxyUrl = `/api/youtube/download?url=${encodeURIComponent(videoUrl)}&filename=${encodeURIComponent(filename)}`;
    } else {
      proxyUrl = `/api/video-proxy?url=${encodeURIComponent(videoUrl)}&filename=${encodeURIComponent(filename)}`;
    }
    
    console.log("Fetching from proxy:", proxyUrl);
    
    // Update progress before making request
    onProgress?.({
      progress: 15,
      downloadedBytes: 0,
      totalBytes: 0,
      speed: "Requesting video...",
      timeRemaining: "Connecting...",
      isComplete: false
    });

    const response = await fetch(proxyUrl, {
      // Add timeout and better error handling
      signal: AbortSignal.timeout(30000) // 30 second timeout
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new Error(`Failed to download video: ${response.status} ${response.statusText} - ${errorText}`);
    }

    console.log("Proxy response OK, getting blob...");
    
    // Get content length for progress tracking
    const contentLength = response.headers.get('content-length');
    const totalBytes = contentLength ? parseInt(contentLength, 10) : 0;
    
    console.log("Content length:", totalBytes);

    // Show processing progress with better messaging
    onProgress?.({
      progress: 30,
      downloadedBytes: 0,
      totalBytes: totalBytes || 0,
      speed: "Downloading video...",
      timeRemaining: "Processing...",
      isComplete: false
    });

    // Get the blob from server response with progress tracking
    const blob = await response.blob();
    console.log("Blob received, size:", blob.size);

    // Update progress to show we're preparing the download
    onProgress?.({
      progress: 80,
      downloadedBytes: blob.size,
      totalBytes: totalBytes || blob.size,
      speed: "Preparing download...",
      timeRemaining: "Almost ready...",
      isComplete: false
    });

    // Calculate actual download speed
    const endTime = Date.now();
    const downloadTime = (endTime - startTime) / 1000;
    const actualSpeed = blob.size > 0 ? blob.size / downloadTime : 0;

    console.log("Creating download link...");
    
    // Update progress to show we're creating the download
    onProgress?.({
      progress: 90,
      downloadedBytes: blob.size,
      totalBytes: totalBytes || blob.size,
      speed: "Creating download...",
      timeRemaining: "Finalizing...",
      isComplete: false
    });
    
    // Small delay to ensure progress is visible
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Create download link and trigger download
    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = filename;
    a.style.display = "none";
    
    document.body.appendChild(a);
    console.log("Triggering download...");
    a.click();
    document.body.removeChild(a);
    
    // Cleanup
    window.URL.revokeObjectURL(blobUrl);
    console.log("Download triggered successfully!");
    
    // Final progress update
    onProgress?.({
      progress: 100,
      downloadedBytes: blob.size,
      totalBytes: totalBytes || blob.size,
      speed: formatBytes(actualSpeed) + "/s",
      timeRemaining: "0s",
      isComplete: true
    });
    
    // Call onComplete after a short delay to ensure progress is visible
    setTimeout(() => {
      onComplete?.();
    }, 200);
    
  } catch (error) {
    console.error("Server proxy download error:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown server error';
    onError?.(new Error(errorMessage));
    throw error;
  }
}

async function downloadTraditional(
  videoUrl: string,
  filename: string,
  totalBytes: number,
  onProgress?: (progress: DownloadProgress) => void,
  onComplete?: () => void,
  onError?: (error: Error) => void
): Promise<void> {
  const startTime = Date.now();
  
  try {
    console.log("Starting traditional download...");
    
    // Show initial progress
    onProgress?.({
      progress: 0,
      downloadedBytes: 0,
      totalBytes,
      speed: "Starting...",
      timeRemaining: "Calculating...",
      isComplete: false
    });

    console.log("Fetching video...");
    const response = await fetch(videoUrl, {
      headers: {
        'Accept': 'video/mp4,video/*,*/*',
        'Cache-Control': 'no-cache',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch video: ${response.status} ${response.statusText}`);
    }

    console.log("Response OK, downloading blob...");
    // Show downloading progress
    onProgress?.({
      progress: 25,
      downloadedBytes: totalBytes / 4,
      totalBytes,
      speed: "Downloading...",
      timeRemaining: "Processing...",
      isComplete: false
    });

    // Download the entire file
    const blob = await response.blob();
    console.log("Blob downloaded, size:", blob.size);

    // Calculate actual download speed
    const endTime = Date.now();
    const downloadTime = (endTime - startTime) / 1000;
    const actualSpeed = totalBytes > 0 ? totalBytes / downloadTime : 0;

    // Show processing progress
    onProgress?.({
      progress: 75,
      downloadedBytes: totalBytes,
      totalBytes,
      speed: formatBytes(actualSpeed) + "/s",
      timeRemaining: "Finalizing...",
      isComplete: false
    });

    console.log("Creating download link...");
    // Create download link and trigger download
    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = filename;
    a.style.display = "none";
    
    document.body.appendChild(a);
    console.log("Triggering download...");
    a.click();
    document.body.removeChild(a);
    
    // Cleanup
    window.URL.revokeObjectURL(blobUrl);
    console.log("Download triggered successfully!");
    
    // Final progress update
    onProgress?.({
      progress: 100,
      downloadedBytes: totalBytes,
      totalBytes,
      speed: formatBytes(actualSpeed) + "/s",
      timeRemaining: "0s",
      isComplete: true
    });
    
    onComplete?.();
    
  } catch (error) {
    console.error("Traditional download error:", error);
    onError?.(error as Error);
    throw error;
  }
}

function calculateSpeed(downloadedBytes: number, startTime: number, currentTime: number): string {
  const elapsed = (currentTime - startTime) / 1000; // seconds
  if (elapsed === 0) return "0 B/s";
  const speed = downloadedBytes / elapsed;
  return formatBytes(speed) + "/s";
}

function calculateTimeRemaining(downloadedBytes: number, totalBytes: number, speed: string): string {
  if (totalBytes === 0 || downloadedBytes === 0) return "Calculating...";
  
  const remainingBytes = totalBytes - downloadedBytes;
  if (remainingBytes <= 0) return "0s";
  
  // Extract numeric value and unit from speed string
  const speedMatch = speed.match(/(\d+(?:\.\d+)?)\s*([KMGT]?B)/);
  if (!speedMatch) return "Calculating...";
  
  const speedValue = parseFloat(speedMatch[1]);
  const speedUnit = speedMatch[2];
  
  // Convert to bytes per second
  let speedBytes = speedValue;
  switch (speedUnit) {
    case 'KB':
      speedBytes *= 1024;
      break;
    case 'MB':
      speedBytes *= 1024 * 1024;
      break;
    case 'GB':
      speedBytes *= 1024 * 1024 * 1024;
      break;
    case 'TB':
      speedBytes *= 1024 * 1024 * 1024 * 1024;
      break;
  }
  
  if (speedBytes === 0) return "Calculating...";
  
  const remainingSeconds = remainingBytes / speedBytes;
  return formatTime(remainingSeconds);
}

// Utility functions
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function formatTime(seconds: number): string {
  if (seconds < 60) {
    return `${Math.round(seconds)}s`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }
}

// Legacy function for backward compatibility
export async function downloadFile(videoUrl: string, filename: string): Promise<void> {
  return downloadFileWithProgress(videoUrl, filename);
}
