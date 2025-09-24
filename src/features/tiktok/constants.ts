export const TIKTOK_CONFIGS = {
  enableServerAPI: true,
  maxVideoSize: 100 * 1024 * 1024, // 100MB
  supportedFormats: ['mp4', 'webm'],
  timeout: 30000, // 30 seconds
};

export const TikTokEndpoints = {
  GetByUrl: '/api/tiktok/video',
  Download: '/api/tiktok/download',
} as const;
