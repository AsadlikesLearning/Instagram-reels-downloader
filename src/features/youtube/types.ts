export interface YouTubeVideoInfo {
  id: string;
  videoUrl: string;
  thumbnailUrl: string;
  title: string;
  description: string;
  duration: number; // in seconds
  width: string;
  height: string;
  filename: string;
  size: number; // in bytes
  owner: {
    username: string;
    fullName: string;
    profilePicUrl: string;
    isVerified: boolean;
  };
  stats: {
    likes: number;
    comments: number;
    views: number;
  };
  postedAt: number; // timestamp
  tags: string[];
  category: string;
}

export interface YouTubeDownloadResult {
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
    description?: string;
    tags?: string[];
    category?: string;
  };
}
