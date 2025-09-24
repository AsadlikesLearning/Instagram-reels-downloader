export function extractTikTokId(url: string): string | null {
  try {
    const urlObj = new URL(url);
    
    // Handle different TikTok URL formats
    if (urlObj.hostname.includes('tiktok.com')) {
      // Standard TikTok URLs: https://www.tiktok.com/@username/video/1234567890
      const pathParts = urlObj.pathname.split('/');
      const videoIndex = pathParts.findIndex(part => part === 'video');
      
      if (videoIndex !== -1 && pathParts[videoIndex + 1]) {
        return pathParts[videoIndex + 1];
      }
    }
    
    // Handle vm.tiktok.com short URLs
    if (urlObj.hostname.includes('vm.tiktok.com')) {
      // These need to be resolved first, but we'll handle them in the API
      return 'short_url';
    }
    
    return null;
  } catch (error) {
    console.error('Error extracting TikTok ID:', error);
    return null;
  }
}

export function isValidTikTokUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return (
      urlObj.hostname.includes('tiktok.com') ||
      urlObj.hostname.includes('vm.tiktok.com')
    );
  } catch {
    return false;
  }
}

export function formatTikTokDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function formatTikTokCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}
