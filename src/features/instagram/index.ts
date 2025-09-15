import { load } from "cheerio";

import {
  getPostPageHTML,
  getPostGraphqlData,
} from "@/services/instagram/requests";

import { VideoInfo } from "@/types";
import { HTTPError } from "@/lib/errors";
import { videoCache } from "@/lib/cache";

import { INSTAGRAM_CONFIGS } from "./constants";
import { formatGraphqlJson, formatPageJson, getPostIdFromUrl } from "./utils";

const getVideoJsonFromHTML = async (postId: string) => {
  const data = await getPostPageHTML({ postId });

  const postHtml = load(data);
  const videoElement = postHtml("meta[property='og:video']");

  if (videoElement.length === 0) {
    return null;
  }

  const videoInfo = formatPageJson(postHtml);
  return videoInfo;
};

const getVideoJSONFromGraphQL = async (postId: string) => {
  const data = await getPostGraphqlData({ postId });

  const mediaData = data.data?.xdt_shortcode_media;

  if (!mediaData) {
    return null;
  }

  if (!mediaData.is_video) {
    throw new HTTPError("This post is not a video", 400);
  }

  const videoInfo = formatGraphqlJson(mediaData);
  return videoInfo;
};

export const getVideoInfo = async (postId: string) => {
  // Check cache first
  const cacheKey = `video_${postId}`;
  const cachedVideoInfo = videoCache.get<VideoInfo>(cacheKey);
  
  if (cachedVideoInfo) {
    console.log(`Cache hit for postId: ${postId}`);
    return cachedVideoInfo;
  }

  let videoInfo: VideoInfo | null = null;

  if (INSTAGRAM_CONFIGS.enableWebpage) {
    videoInfo = await getVideoJsonFromHTML(postId);
    if (videoInfo) {
      // Cache the result for 5 minutes
      videoCache.set(cacheKey, videoInfo, 5 * 60 * 1000);
      return videoInfo;
    }
  }

  if (INSTAGRAM_CONFIGS.enableGraphQL) {
    videoInfo = await getVideoJSONFromGraphQL(postId);
    if (videoInfo) {
      // Cache the result for 5 minutes
      videoCache.set(cacheKey, videoInfo, 5 * 60 * 1000);
      return videoInfo;
    }
  }

  throw new HTTPError("Video link for this post is not public.", 401);
};
