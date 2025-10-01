export const YOUTUBE_CONFIGS = {
  enableServerAPI: true,
  maxVideoSize: 500 * 1024 * 1024, // 500MB
  supportedFormats: ['mp4', 'webm', 'mkv'],
  timeout: 60000, // 60 seconds
};

export const YouTubeEndpoints = {
  GetByUrl: '/api/youtube/video',
  Download: '/api/youtube/download',
} as const;
