export function extractYouTubeId(url: string): string | null {
  try {
    const urlObj = new URL(url);
    
    // Handle different YouTube URL formats
    if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
      // Standard YouTube URLs: https://www.youtube.com/watch?v=VIDEO_ID
      if (urlObj.hostname.includes('youtu.be')) {
        return urlObj.pathname.slice(1); // Remove leading slash
      }
      
      // YouTube watch URLs
      const videoId = urlObj.searchParams.get('v');
      if (videoId) {
        return videoId;
      }
      
      // YouTube embed URLs
      if (urlObj.pathname.includes('/embed/')) {
        const pathParts = urlObj.pathname.split('/');
        const embedIndex = pathParts.findIndex(part => part === 'embed');
        if (embedIndex !== -1 && pathParts[embedIndex + 1]) {
          return pathParts[embedIndex + 1];
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error extracting YouTube ID:', error);
    return null;
  }
}

export function isValidYouTubeUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return (
      urlObj.hostname.includes('youtube.com') ||
      urlObj.hostname.includes('youtu.be')
    );
  } catch {
    return false;
  }
}

export function formatYouTubeDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function formatYouTubeCount(count: number): string {
  if (count >= 1000000000) {
    return `${(count / 1000000000).toFixed(1)}B`;
  } else if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}

export function generateYouTubeFilename(title: string, videoId: string): string {
  // Clean title for filename
  const cleanTitle = title
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .substring(0, 50); // Limit length
  
  const timestamp = new Date().toISOString().slice(0, 10);
  return `youtube-${cleanTitle}-${videoId}-${timestamp}.mp4`;
}
