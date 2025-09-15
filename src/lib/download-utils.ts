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
    // Get file size first for progress calculation
    const headResponse = await fetch(videoUrl, { method: 'HEAD' });
    const contentLength = headResponse.headers.get('content-length');
    const totalBytes = contentLength ? parseInt(contentLength, 10) : 0;
    
    // Show initial progress
    onProgress?.({
      progress: 0,
      downloadedBytes: 0,
      totalBytes,
      speed: "Starting...",
      timeRemaining: "Calculating...",
      isComplete: false
    });

    // Start download with maximum speed (no chunking)
    const startTime = Date.now();
    const response = await fetch(videoUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch video: ${response.status} ${response.statusText}`);
    }

    // Show downloading progress
    onProgress?.({
      progress: 50,
      downloadedBytes: totalBytes / 2,
      totalBytes,
      speed: "Downloading...",
      timeRemaining: "Processing...",
      isComplete: false
    });

    // Download the entire file at maximum speed
    const blob = await response.blob();
    
    // Calculate actual download speed
    const endTime = Date.now();
    const downloadTime = (endTime - startTime) / 1000; // seconds
    const actualSpeed = totalBytes > 0 ? totalBytes / downloadTime : 0;
    
    // Show processing progress
    onProgress?.({
      progress: 90,
      downloadedBytes: totalBytes,
      totalBytes,
      speed: formatBytes(actualSpeed) + "/s",
      timeRemaining: "Finalizing...",
      isComplete: false
    });

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
      downloadedBytes: totalBytes,
      totalBytes,
      speed: formatBytes(actualSpeed) + "/s",
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
