export interface TikTokVideoInfo {
  id: string;
  videoUrl: string;
  thumbnailUrl: string;
  title: string;
  description: string;
  duration: number;
  width: string;
  height: string;
  filename: string;
  size: number;
  owner: {
    username: string;
    fullName: string;
    profilePicUrl: string;
    isVerified: boolean;
  };
  stats: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
  };
  postedAt: number;
  hashtags: string[];
  music?: {
    title: string;
    artist: string;
    url: string;
  };
}
