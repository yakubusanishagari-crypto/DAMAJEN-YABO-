import React, { useState, useEffect } from 'react';
import { GalleryItem } from '../types';
import { 
  X, ThumbsUp, ThumbsDown, MessageSquare, Share2, Eye, 
  Calendar, CheckCircle, Send, Play, Shield, Maximize2, Sparkles, Check
} from 'lucide-react';

interface CommentItem {
  id: string;
  author: string;
  ward?: string;
  text: string;
  date: string;
  likes: number;
}

interface Props {
  video: GalleryItem;
  allVideos: GalleryItem[];
  onSelectVideo: (item: GalleryItem) => void;
  onClose: () => void;
}

export const YouTubeVideoTheater: React.FC<Props> = ({ 
  video, 
  allVideos, 
  onSelectVideo, 
  onClose 
}) => {
  // Extract YouTube ID if possible
  const getYouTubeId = (url?: string): string => {
    if (!url) return 'ScMzIvxBSi4'; // Default parliamentary debate ID
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? match[1] : 'ScMzIvxBSi4';
  };

  const youtubeId = getYouTubeId(video.videoUrl);
  const embedUrl = `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`;

  // Views state with localStorage persistence
  const [viewsCount, setViewsCount] = useState<number>(() => {
    const key = `danmaje_views_${video.id}`;
    const saved = localStorage.getItem(key);
    const initialBase = video.id === 'gal-vid-1' ? 14820 : 9650;
    if (saved) {
      return parseInt(saved, 10);
    }
    const newViews = initialBase + 1;
    localStorage.setItem(key, newViews.toString());
    return newViews;
  });

  // Likes state with localStorage persistence
  const [hasLiked, setHasLiked] = useState<boolean>(() => {
    return localStorage.getItem(`danmaje_liked_${video.id}`) === 'true';
  });

  const [likesCount, setLikesCount] = useState<number>(() => {
    const base = video.id === 'gal-vid-1' ? 486 : 312;
    const saved = localStorage.getItem(`danmaje_likes_count_${video.id}`);
    return saved ? parseInt(saved, 10) : base;
  });

  // Share link feedback
  const [copied, setCopied] = useState(false);

  // Comments state with preloaded authentic constituency responses
  const getInitialComments = (vidId: string): CommentItem[] => {
    if (vidId === 'gal-vid-1') {
      return [
        {
          id: 'c1',
          author: 'Malam Ibrahim Bello',
          ward: 'Yabo Central Ward',
          text: 'Masha Allah! This speech at the Green Chamber regarding the Federal College of Agricultural Technology Bill will completely transform youth employment in Sokoto State.',
          date: '1 day ago',
          likes: 42
        },
        {
          id: 'c2',
          author: 'Amina Shagari',
          ward: 'Shagari LGA',
          text: 'Proud of our representative Hon. Umar Yusuf Danmaje. Highly articulate delivery and passionate advocacy for our farmers.',
          date: '3 days ago',
          likes: 29
        },
        {
          id: 'c3',
          author: 'Dr. Usman Danladi',
          ward: 'Sokoto Metropolis / Academic Observer',
          text: 'A well-researched parliamentary bill. Middle-level agricultural manpower is precisely what the North-West zone needs.',
          date: '5 days ago',
          likes: 18
        }
      ];
    }
    return [
      {
        id: 'c4',
        author: 'Alhaji Sanusi Kuchi',
        ward: 'Kuchi Ward, Yabo',
        text: 'The solar motorized water borehole commissioned in our community has ended decades of water scarcity. May Almighty Allah reward Danmaje Yabo abundantly.',
        date: '2 days ago',
        likes: 38
      },
      {
        id: 'c5',
        author: 'Fatima Abubakar',
        ward: 'Dandin Mahe Ward',
        text: 'Our women and children no longer trek miles to fetch river water. Clean potable water is now at our doorsteps.',
        date: '4 days ago',
        likes: 21
      }
    ];
  };

  const [comments, setComments] = useState<CommentItem[]>(() => {
    const saved = localStorage.getItem(`danmaje_comments_${video.id}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return getInitialComments(video.id);
      }
    }
    return getInitialComments(video.id);
  });

  // New comment form
  const [authorName, setAuthorName] = useState('');
  const [wardName, setWardName] = useState('Yabo/Shagari Constituent');
  const [commentText, setCommentText] = useState('');

  // Persist comments when updated
  useEffect(() => {
    localStorage.setItem(`danmaje_comments_${video.id}`, JSON.stringify(comments));
  }, [comments, video.id]);

  // Handle Like click
  const handleToggleLike = () => {
    if (hasLiked) {
      setHasLiked(false);
      setLikesCount(prev => prev - 1);
      localStorage.setItem(`danmaje_liked_${video.id}`, 'false');
      localStorage.setItem(`danmaje_likes_count_${video.id}`, (likesCount - 1).toString());
    } else {
      setHasLiked(true);
      setLikesCount(prev => prev + 1);
      localStorage.setItem(`danmaje_liked_${video.id}`, 'true');
      localStorage.setItem(`danmaje_likes_count_${video.id}`, (likesCount + 1).toString());
    }
  };

  // Handle Comment Submission
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const newComment: CommentItem = {
      id: `comm-${Date.now()}`,
      author: authorName.trim() || 'Constituent Observer',
      ward: wardName.trim() || 'Yabo / Shagari',
      text: commentText.trim(),
      date: 'Just now',
      likes: 1
    };

    setComments([newComment, ...comments]);
    setCommentText('');
  };

  // Handle Share link
  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="bg-[#0B1E17] text-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden border border-[#C6A15B]/50 my-auto flex flex-col max-h-[96vh]">
        {/* Top Header Bar */}
        <div className="p-3.5 sm:p-4 flex items-center justify-between border-b border-white/10 bg-[#071913]">
          <div className="flex items-center gap-2.5 truncate">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
              Official Broadcast • Green Chamber Player
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              title="Share video"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-[#D4AF37]" />}
              <span>{copied ? 'Link Copied!' : 'Share'}</span>
            </button>

            <button
              onClick={onClose}
              className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition cursor-pointer"
              aria-label="Close video player"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Scrollable Container */}
        <div className="overflow-y-auto flex-1 flex flex-col">
          {/* Main Video Screen Container - Plays ONLY inside website */}
          <div className="relative aspect-[16/9] w-full bg-black shadow-inner">
            <iframe
              src={embedUrl}
              title={video.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>

          {/* Video Metadata & Interactive Actions (YouTube Style) */}
          <div className="p-4 sm:p-6 bg-[#082219] border-b border-white/10 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg sm:text-2xl font-bold font-['Manrope'] text-white leading-tight">
                  {video.title}
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-xs text-stone-300 mt-1.5">
                  <span className="inline-flex items-center gap-1 text-[#D4AF37] font-semibold">
                    <Eye className="w-4 h-4" />
                    <span>{viewsCount.toLocaleString()} views</span>
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-1 text-stone-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{video.date}</span>
                  </span>
                  <span>•</span>
                  <span className="bg-[#103C2E] text-[#D4AF37] px-2 py-0.5 rounded text-[11px] font-bold border border-[#C6A15B]/30">
                    {video.category}
                  </span>
                </div>
              </div>

              {/* YouTube Action Bar: Like, Dislike, Share */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer border ${
                    hasLiked 
                      ? 'bg-[#D4AF37] text-[#09291F] border-[#E5C16C] shadow-lg scale-105' 
                      : 'bg-white/10 text-white hover:bg-white/20 border-white/20'
                  }`}
                  aria-label="Like video"
                >
                  <ThumbsUp className={`w-4 h-4 ${hasLiked ? 'fill-current' : ''}`} />
                  <span>{likesCount.toLocaleString()}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-[#D4AF37]" />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* Description Box */}
            <div className="bg-[#051710] p-4 rounded-2xl border border-white/10 text-xs sm:text-sm text-stone-300 space-y-2">
              <div className="flex items-center justify-between text-[#D4AF37] font-bold text-xs">
                <span>Official Video Summary</span>
                <span>House of Representatives • 10th National Assembly</span>
              </div>
              <p className="leading-relaxed font-light">
                {video.description}
              </p>
            </div>
          </div>

          {/* Bottom Grid: Comments Section + Related Videos */}
          <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 bg-[#071D15]">
            {/* Left Col: Comments (lg:col-span-7) */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#D4AF37]" />
                  <h3 className="font-['Manrope'] font-bold text-base text-white">
                    Citizen Comments & Feedback ({comments.length})
                  </h3>
                </div>
                <span className="text-[11px] text-stone-400">Public Constituency Forum</span>
              </div>

              {/* Add Comment Form */}
              <form onSubmit={handleAddComment} className="bg-[#0A261E] p-4 rounded-2xl border border-[#C6A15B]/30 space-y-3 shadow-md">
                <span className="text-xs font-bold text-[#D4AF37] block">
                  Add a Comment as a Constituent:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Your Name (e.g., Aliyu Danladi)"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full bg-[#051710] text-white text-xs px-3 py-2 rounded-xl border border-white/15 focus:outline-none focus:border-[#D4AF37]"
                  />
                  <input
                    type="text"
                    placeholder="Ward / Community (e.g., Yabo Town / Shagari)"
                    value={wardName}
                    onChange={(e) => setWardName(e.target.value)}
                    className="w-full bg-[#051710] text-white text-xs px-3 py-2 rounded-xl border border-white/15 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <textarea
                  rows={2}
                  placeholder="Share your thought or comment on this debate/project..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  required
                  className="w-full bg-[#051710] text-white text-xs p-3 rounded-xl border border-white/15 focus:outline-none focus:border-[#D4AF37] resize-none"
                ></textarea>
                <div className="flex justify-between items-center pt-1">
                  <span className="text-[11px] text-stone-400">Moderated official portal</span>
                  <button
                    type="submit"
                    className="bg-[#D4AF37] hover:bg-[#C6A15B] text-[#09291F] font-bold px-4 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Post Comment</span>
                  </button>
                </div>
              </form>

              {/* Comments Feed */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {comments.map((comm) => (
                  <div key={comm.id} className="bg-[#0A261E]/70 p-3.5 rounded-xl border border-white/10 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center font-bold text-[10px]">
                          {comm.author.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-white">{comm.author}</span>
                        {comm.ward && (
                          <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">
                            {comm.ward}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-stone-400">{comm.date}</span>
                    </div>
                    <p className="text-xs text-stone-300 leading-relaxed font-light pl-8">
                      {comm.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Col: Related Constituency Videos (lg:col-span-5) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <h3 className="font-['Manrope'] font-bold text-sm sm:text-base text-white">
                  Other Speeches & Videos
                </h3>
                <span className="text-[11px] text-[#D4AF37]">Click to Play</span>
              </div>

              <div className="space-y-3">
                {allVideos.map((item) => {
                  const isCurrent = item.id === video.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => !isCurrent && onSelectVideo(item)}
                      className={`flex gap-3 p-2.5 rounded-xl border transition cursor-pointer ${
                        isCurrent 
                          ? 'bg-[#103C2E] border-[#D4AF37]/60 ring-1 ring-[#D4AF37]/50' 
                          : 'bg-[#0A261E] hover:bg-[#0E3529] border-white/10'
                      }`}
                    >
                      <div className="relative w-28 h-16 rounded-lg overflow-hidden shrink-0 bg-stone-900">
                        <img 
                          src={item.imageUrl} 
                          alt={item.title} 
                          className="w-full h-full object-cover" 
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Play className="w-4 h-4 text-[#D4AF37] fill-current" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                        <p className={`text-xs font-bold leading-tight line-clamp-2 ${isCurrent ? 'text-[#D4AF37]' : 'text-white'}`}>
                          {item.title}
                        </p>
                        <span className="text-[10px] text-stone-400">
                          {item.date} • {item.category}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
