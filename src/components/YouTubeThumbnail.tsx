import React, { useState } from 'react';
import { extractYouTubeId, YOUTUBE_PLACEHOLDER_THUMBNAIL } from '../utils/youtube';
import { Play } from 'lucide-react';

interface Props {
  videoUrl?: string;
  fallbackUrl?: string;
  alt: string;
  className?: string;
  showPlayButton?: boolean;
  playButtonSize?: 'sm' | 'md' | 'lg';
  priorityQuality?: 'maxres' | 'hq' | 'mq';
}

export const YouTubeThumbnail: React.FC<Props> = ({
  videoUrl,
  fallbackUrl,
  alt,
  className = 'w-full h-full object-cover',
  showPlayButton = true,
  playButtonSize = 'md',
  priorityQuality = 'hq'
}) => {
  const videoId = extractYouTubeId(videoUrl);
  const [qualityIndex, setQualityIndex] = useState<number>(0);
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);

  // If there's a valid YouTube video ID, try official YouTube thumbnail qualities in descending order
  // hqdefault is virtually always present (480x360).
  const qualities = priorityQuality === 'maxres' 
    ? ['maxresdefault.jpg', 'hqdefault.jpg', 'mqdefault.jpg', 'default.jpg']
    : ['hqdefault.jpg', 'mqdefault.jpg', 'default.jpg'];

  const getSource = (): string => {
    if (!videoId) {
      if (fallbackUrl && fallbackUrl.trim() && !fallbackUrl.includes('.jpg') && !fallbackUrl.includes('.png')) {
        return fallbackUrl;
      }
      return YOUTUBE_PLACEHOLDER_THUMBNAIL;
    }

    if (qualityIndex < qualities.length) {
      return `https://img.youtube.com/vi/${videoId}/${qualities[qualityIndex]}`;
    }

    return YOUTUBE_PLACEHOLDER_THUMBNAIL;
  };

  const handleError = () => {
    if (qualityIndex + 1 < qualities.length) {
      setQualityIndex(prev => prev + 1);
    } else {
      setQualityIndex(qualities.length);
    }
  };

  const playSizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20'
  };

  const playIconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-9 h-9'
  };

  return (
    <div className="relative w-full h-full bg-[#071913] overflow-hidden group select-none">
      {/* Loading Skeleton */}
      {!hasLoaded && (
        <div className="absolute inset-0 bg-[#0B251B] animate-pulse flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-2 border-[#C6A15B]/30 border-t-[#C6A15B] animate-spin"></div>
        </div>
      )}

      {/* Actual Thumbnail Image */}
      <img
        src={getSource()}
        alt={alt}
        className={`${className} transition-transform duration-700 group-hover:scale-105 ${hasLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setHasLoaded(true)}
        onError={handleError}
        loading="lazy"
      />

      {/* Play Overlay */}
      {showPlayButton && (
        <div className="absolute inset-0 bg-black/35 group-hover:bg-black/20 transition-all flex items-center justify-center pointer-events-none">
          <div className={`${playSizeClasses[playButtonSize]} rounded-full bg-gradient-to-tr from-[#C6A15B] to-[#E5C16C] text-[#09291F] flex items-center justify-center shadow-2xl group-hover:scale-115 transition-all duration-300 border-2 border-white/80`}>
            <Play className={`${playIconSizes[playButtonSize]} fill-current ml-0.5`} />
          </div>
        </div>
      )}
    </div>
  );
};
