/**
 * True when a stored media URL points to a video (car hero / banner media can
 * be either an image or a video). Extension-based, matching how car-hover-media
 * detects video — uploadMedia preserves the real file extension.
 */
export const isVideoUrl = (url?: string | null): boolean =>
  !!url && /\.(mp4|webm|mov|m4v)(\?|$)/i.test(url);
