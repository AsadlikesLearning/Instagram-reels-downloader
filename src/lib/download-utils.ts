export interface DownloadProgress {
  progress: number; // 0-100
  downloadedBytes: number;
  totalBytes: number;
  speed: string;
  timeRemaining: string;
  isComplete: boolean;
}

export interface DownloadOptions {
  onProgress?: (progress: DownloadProgress) => void;
  onComplete?: () => void;
  onError?: (error: Error) => void;
}

export async function downloadFileWithProgress(
  videoUrl: string, 
  filename: string, 
  options: DownloadOptions = {}
): Promise<void> {
  const { onProgress, onComplete, onError } = options;
  
  try {
    // Start the download
    const response = await fetch(videoUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch video: ${response.status} ${response.statusText}`);
    }

    const contentLength = response.headers.get('content-length');
    const totalBytes = contentLength ? parseInt(contentLength, 10) : 0;
    
    if (!response.body) {
      throw new Error('Response body is null');
    }

    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];
    let downloadedBytes = 0;
    let startTime = Date.now();
    let lastTime = startTime;
    let lastBytes = 0;

    // Read the stream
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;
      
      chunks.push(value);
      downloadedBytes += value.length;
      
      const currentTime = Date.now();
      const timeDiff = (currentTime - lastTime) / 1000; // seconds
      
      // Calculate speed and progress
      let speed = "0 B/s";
      let timeRemaining = "Calculating...";
      
      if (timeDiff >= 1) { // Update every second
        const bytesDiff = downloadedBytes - lastBytes;
        const speedBytesPerSecond = bytesDiff / timeDiff;
        
        speed = formatBytes(speedBytesPerSecond) + "/s";
        
        if (speedBytesPerSecond > 0 && totalBytes > 0) {
          const remainingBytes = totalBytes - downloadedBytes;
          const remainingSeconds = remainingBytes / speedBytesPerSecond;
          timeRemaining = formatTime(remainingSeconds);
        }
        
        lastTime = currentTime;
        lastBytes = downloadedBytes;
      }
      
      const progress = totalBytes > 0 ? (downloadedBytes / totalBytes) * 100 : 0;
      
      // Call progress callback
      onProgress?.({
        progress,
        downloadedBytes,
        totalBytes,
        speed,
        timeRemaining,
        isComplete: false
      });
    }

    // Combine all chunks into a single blob
    const blob = new Blob(chunks, { type: 'video/mp4' });
    
    // Create download link
    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = filename;
    a.style.display = "none";
    
    // Add to DOM, click, and remove
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Cleanup
    window.URL.revokeObjectURL(blobUrl);
    
    // Final progress update
    onProgress?.({
      progress: 100,
      downloadedBytes: totalBytes || downloadedBytes,
      totalBytes: totalBytes || downloadedBytes,
      speed: "0 B/s",
      timeRemaining: "0s",
      isComplete: true
    });
    
    // Call complete callback
    onComplete?.();
    
  } catch (error) {
    console.error("Download error:", error);
    onError?.(error as Error);
    throw error;
  }
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
