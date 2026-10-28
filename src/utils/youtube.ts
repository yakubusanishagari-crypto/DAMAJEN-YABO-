/**
 * YouTube Utility Module
 * Robust YouTube video ID extraction, thumbnail generation, oEmbed metadata fetching,
 * embed formatting, and thumbnail resolution.
 */

import { GalleryItem } from '../types';

/**
 * Extracts the 11-character YouTube video ID from any valid YouTube URL or raw ID.
 * Handles:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://m.youtube.com/watch?v=VIDEO_ID&feature=share
 * - https://www.youtube.com/watch?feature=share&v=VIDEO_ID (v not first param)
 * - https://youtu.be/VIDEO_ID
 * - https://youtu.be/VIDEO_ID?si=xyz
 * - https://www.youtube.com/shorts/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID?feature=share
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube-nocookie.com/embed/VIDEO_ID
 * - https://www.youtube.com/live/VIDEO_ID
 * - https://www.youtube.com/v/VIDEO_ID
 * - Raw 11-character video ID (e.g. ScMzIvxBSi4, dQw4w9WgXcQ)
 */
export function extractYouTubeId(urlOrId?: string | null): string | null {
  if (!urlOrId || typeof urlOrId !== 'string') return null;
  const trimmed = urlOrId.trim();
  if (!trimmed) return null;

  // 1. Raw 11-character YouTube ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // 2. youtube.com/watch with v parameter anywhere in the query string
  const vParamMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{11})(?:[&#?]|$)/);
  if (vParamMatch && vParamMatch[1]) {
    return vParamMatch[1];
  }

  // 3. youtu.be/VIDEO_ID
  const shortMatch = trimmed.match(/(?:youtu\.be\/)([a-zA-Z0-9_-]{11})(?:[?&#]|$)/);
  if (shortMatch && shortMatch[1]) {
    return shortMatch[1];
  }

  // 4. youtube.com/shorts/VIDEO_ID or /live/VIDEO_ID or /embed/VIDEO_ID or /v/VIDEO_ID
  const pathPrefixMatch = trimmed.match(/(?:youtube(?:-nocookie)?\.com\/(?:embed|shorts|live|v)\/)([a-zA-Z0-9_-]{11})(?:[?&#]|$)/);
  if (pathPrefixMatch && pathPrefixMatch[1]) {
    return pathPrefixMatch[1];
  }

  // 5. Generic comprehensive regex fallback
  const genericMatch = trimmed.match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?|shorts|live)\/|\S*?[?&]v=))([a-zA-Z0-9_-]{11})/);
  if (genericMatch && genericMatch[1]) {
    return genericMatch[1];
  }

  return null;
}

/**
 * Returns the official high-quality YouTube thumbnail URL for a given video URL or ID.
 * Defaults to 'hqdefault' which is universally available for 100% of YouTube videos.
 */
export function getYouTubeThumbnailUrl(
  urlOrId?: string | null, 
  quality: 'hq' | 'maxres' | 'mq' | 'default' | 'hqdefault' | 'maxresdefault' | 'mqdefault' = 'hq'
): string | null {
  const id = extractYouTubeId(urlOrId);
  if (!id) return null;
  const filename = (quality === 'maxres' || quality === 'maxresdefault')
    ? 'maxresdefault.jpg' 
    : (quality === 'mq' || quality === 'mqdefault')
      ? 'mqdefault.jpg' 
      : (quality === 'default')
        ? 'default.jpg' 
        : 'hqdefault.jpg';
  return `https://img.youtube.com/vi/${id}/${filename}`;
}

/**
 * Returns an embeddable YouTube privacy-enhanced iframe URL.
 */
export function getYouTubeEmbedUrl(urlOrId?: string | null, autoplay = false): string {
  const id = extractYouTubeId(urlOrId);
  if (!id) return '';
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=${autoplay ? 1 : 0}&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`;
}

/**
 * Standard YouTube neutral fallback SVG thumbnail (never shows an unrelated photograph)
 */
export const YOUTUBE_PLACEHOLDER_THUMBNAIL = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360" fill="%230b1e17"><rect width="640" height="360" fill="%230b1e17"/><rect x="256" y="128" width="128" height="96" rx="20" fill="%23cc0000"/><polygon points="310,158 310,194 344,176" fill="%23ffffff"/><text x="320" y="270" fill="%23c6a15b" font-family="sans-serif" font-size="16" font-weight="bold" text-anchor="middle">OFFICIAL VIDEO BROADCAST</text></svg>`;

/**
 * Resolves the correct display thumbnail for any media or news item.
 * If the item has a videoUrl OR is of type 'video', this ALWAYS returns that specific
 * video's YouTube thumbnail, NEVER returning an unrelated photograph or previous video's image!
 */
export function resolveMediaThumbnail(item?: { imageUrl?: string; videoUrl?: string; type?: string } | null): string {
  if (!item) {
    return 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=1000';
  }

  const isVideo = item.type === 'video' || !!item.videoUrl;

  if (isVideo) {
    if (item.videoUrl) {
      const ytThumb = getYouTubeThumbnailUrl(item.videoUrl, 'hq');
      if (ytThumb) {
        return ytThumb;
      }
    }

    // If imageUrl itself is already a YouTube img URL, ensure it is returned
    if (item.imageUrl && (item.imageUrl.includes('youtube.com') || item.imageUrl.includes('ytimg.com'))) {
      return item.imageUrl;
    }

    // Video without valid YouTube ID fallback - NEVER an unrelated photo
    return YOUTUBE_PLACEHOLDER_THUMBNAIL;
  }

  // Pure photo items
  if (item.imageUrl && item.imageUrl.trim()) {
    // If a photo item accidentally has an old broken placeholder, keep it clean
    return item.imageUrl.trim();
  }

  return 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=1000';
}

/**
 * Result of YouTube oEmbed metadata query
 */
export interface YouTubeMetadata {
  id: string;
  title: string;
  author: string;
  thumbnailUrl: string;
  embedHtml?: string;
}

/**
 * In-memory cache for fetched YouTube metadata to prevent duplicate network calls
 */
const metadataCache = new Map<string, YouTubeMetadata>();

/**
 * Automatically retrieves YouTube title, author, and official thumbnail via YouTube oEmbed API.
 * Uses no API keys and works natively in browser and server.
 */
export async function fetchYouTubeMetadata(urlOrId: string): Promise<YouTubeMetadata | null> {
  const id = extractYouTubeId(urlOrId);
  if (!id) return null;

  if (metadataCache.has(id)) {
    return metadataCache.get(id)!;
  }

  try {
    const canonicalUrl = `https://www.youtube.com/watch?v=${id}`;
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(canonicalUrl)}&format=json`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(oembedUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) {
      // Fallback object with standard thumbnail
      const fallback: YouTubeMetadata = {
        id,
        title: '',
        author: 'National Assembly Broadcast',
        thumbnailUrl: `https://img.youtube.com/vi/${id}/hqdefault.jpg`
      };
      metadataCache.set(id, fallback);
      return fallback;
    }

    const data = await res.json();
    const metadata: YouTubeMetadata = {
      id,
      title: data.title || '',
      author: data.author_name || 'YouTube Video',
      thumbnailUrl: data.thumbnail_url || `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
      embedHtml: data.html
    };

    metadataCache.set(id, metadata);
    return metadata;
  } catch (err) {
    // Network or timeout failure - construct reliable fallback
    const fallback: YouTubeMetadata = {
      id,
      title: '',
      author: 'Official Video Dispatch',
      thumbnailUrl: `https://img.youtube.com/vi/${id}/hqdefault.jpg`
    };
    metadataCache.set(id, fallback);
    return fallback;
  }
}

/**
 * Sanitizes and repairs a gallery item so that any video item
 * has its imageUrl properly mapped to its real YouTube thumbnail and type is 'video'.
 * Strips away stale local photograph paths from video items.
 */
export function sanitizeGalleryItem(item: GalleryItem): GalleryItem {
  if (item.type === 'video' || !!item.videoUrl) {
    const ytId = extractYouTubeId(item.videoUrl);
    const ytThumb = ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : YOUTUBE_PLACEHOLDER_THUMBNAIL;
    
    return {
      ...item,
      type: 'video',
      imageUrl: ytThumb,
      videoUrl: item.videoUrl || (ytId ? `https://www.youtube.com/watch?v=${ytId}` : undefined)
    };
  }
  return item;
}

/**
 * Sanitizes a full gallery list and ensures at least one video is flagged for homepage showcase
 */
export function sanitizeGalleryList(items: GalleryItem[]): GalleryItem[] {
  const sanitized = items.map(sanitizeGalleryItem);
  const hasHomepageFeatured = sanitized.some(i => i.type === 'video' && i.showOnHomepage);
  if (!hasHomepageFeatured) {
    const firstVideo = sanitized.find(i => i.type === 'video');
    if (firstVideo) {
      firstVideo.showOnHomepage = true;
    }
  }
  return sanitized;
}
