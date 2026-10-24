import React, { useState } from 'react';
import { GalleryItem } from '../types';
import { 
  Download, ExternalLink, ShieldCheck, AlertCircle, Film, 
  Copy, Check, X, HardDrive, Info, Share2, Sparkles, CheckCircle2
} from 'lucide-react';
import { extractYouTubeId } from '../utils/youtube';

interface Props {
  video: GalleryItem;
  onClose: () => void;
}

export const YouTubeDownloadModal: React.FC<Props> = ({ video, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [downloadStarted, setDownloadStarted] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const youtubeId = extractYouTubeId(video.videoUrl);
  const officialYtUrl = youtubeId ? `https://www.youtube.com/watch?v=${youtubeId}` : (video.videoUrl || 'https://www.youtube.com');

  const hasPermission = Boolean(video.hasDownloadPermission && (video.downloadUrl || video.videoUrl));

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(officialYtUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleTriggerDownload = () => {
    setDownloadStarted(true);
    setDownloadProgress(20);

    // Progressive simulated preparation for master archive
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Trigger actual download
          const targetUrl = video.downloadUrl || video.imageUrl;
          const a = document.createElement('a');
          a.href = targetUrl;
          a.download = `${video.title.replace(/[^a-zA-Z0-9_-]/g, '_')}_Official_Archive.mp4`;
          a.target = '_blank';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          return 100;
        }
        return prev + 25;
      });
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="bg-[#0B1E17] text-white w-full max-w-xl rounded-3xl shadow-2xl border border-[#C6A15B]/50 overflow-hidden my-auto flex flex-col">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-white/10 bg-[#071913]">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${hasPermission ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'}`}>
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-['Manrope'] font-bold text-sm sm:text-base text-white">
                {hasPermission ? 'Official Broadcast Download Center' : 'Video Offline & Streaming Options'}
              </h3>
              <p className="text-[11px] text-stone-400">
                Hon. Umar Yusuf (Danmaje Yabo) Media Bureau
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-rose-900 text-stone-300 hover:text-white transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Overview Strip */}
        <div className="p-5 space-y-4">
          <div className="bg-[#051710] p-3.5 rounded-2xl border border-white/10 flex gap-3.5 items-center">
            <div className="relative w-24 h-16 rounded-xl overflow-hidden shrink-0 bg-stone-900 border border-white/15">
              <img 
                src={video.imageUrl || (youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` : '/official_logo.png')} 
                alt={video.title} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://img.youtube.com/vi/ScMzIvxBSi4/hqdefault.jpg';
                }}
              />
              <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                <Film className="w-5 h-5 text-[#D4AF37]" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-wider block">
                {video.category} • {video.date}
              </span>
              <h4 className="font-bold text-xs sm:text-sm text-white line-clamp-2 leading-snug">
                {video.title}
              </h4>
            </div>
          </div>

          {/* PERMISSION CHECK ROUTING */}
          {hasPermission ? (
            /* CASE A: WEBSITE OWNER HAS PERMISSION TO DOWNLOAD */
            <div className="space-y-4">
              <div className="p-4 bg-emerald-950/40 rounded-2xl border border-emerald-500/40 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>AUTHORIZED OFFICIAL CONSTITUENCY MEDIA DOWNLOAD</span>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed font-light">
                  {video.permissionNote || 'The website owner and Constituency Communications Directorate possess full broadcast rights for this original footage. You may download this master MP4 video for local archival, educational, community screenings, and constituent review.'}
                </p>
                <div className="flex flex-wrap gap-2 pt-1 text-[11px] text-stone-300 font-mono">
                  <span className="bg-[#071913] px-2.5 py-1 rounded-lg border border-white/10">
                    Format: <strong>{video.downloadQuality || '1080p Full HD MP4'}</strong>
                  </span>
                  <span className="bg-[#071913] px-2.5 py-1 rounded-lg border border-white/10">
                    Size: <strong>{video.downloadFileSize || '28.4 MB'}</strong>
                  </span>
                  <span className="bg-[#071913] px-2.5 py-1 rounded-lg border border-white/10 text-emerald-300">
                    License: <strong>Public Constituency Access</strong>
                  </span>
                </div>
              </div>

              {downloadStarted ? (
                <div className="bg-[#071913] p-4 rounded-2xl border border-[#C6A15B]/30 space-y-2 text-center">
                  <div className="flex items-center justify-between text-xs text-stone-300 mb-1">
                    <span className="font-bold text-[#D4AF37] flex items-center gap-1.5">
                      <HardDrive className="w-4 h-4" />
                      {downloadProgress === 100 ? 'Download Triggered!' : 'Preparing High-Speed Download...'}
                    </span>
                    <span>{downloadProgress}%</span>
                  </div>
                  <div className="w-full bg-stone-800 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-[#C6A15B] to-emerald-400 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${downloadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-[11px] text-stone-400 font-light pt-1">
                    {downloadProgress === 100 
                      ? 'The video file transfer has started. Check your browser downloads.' 
                      : 'Packaging high-definition parliamentary dispatch asset...'}
                  </p>
                </div>
              ) : (
                <button
                  onClick={handleTriggerDownload}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 hover:from-emerald-500 hover:to-teal-700 text-white font-extrabold text-xs sm:text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer transition transform active:scale-98 tracking-wide border border-emerald-400/40"
                >
                  <Download className="w-5 h-5 text-[#D4AF37]" />
                  <span>START DIRECT VIDEO DOWNLOAD ({video.downloadFileSize || '28 MB'})</span>
                </button>
              )}

              <div className="pt-2 flex items-center justify-between text-xs text-stone-400">
                <span className="flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-[#C6A15B]" />
                  Need raw 4K uncompressed footage?
                </span>
                <a
                  href={`mailto:media@danmayeyabo.gov.ng?subject=Press%20Footage%20Request:%20${encodeURIComponent(video.title)}`}
                  className="text-[#D4AF37] hover:underline font-bold"
                >
                  Contact Media Desk
                </a>
              </div>
            </div>
          ) : (
            /* CASE B: WEBSITE OWNER DOES NOT HAVE PERMISSION TO DISTRIBUTE DOWNLOADS DIRECTLY */
            <div className="space-y-4">
              <div className="p-4 bg-amber-950/40 rounded-2xl border border-amber-500/40 space-y-2">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>DIRECT DOWNLOAD NOT AUTHORIZED FOR THIS BROADCAST</span>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed font-light">
                  Direct offline MP4 file downloading is restricted for this specific video in strict adherence to 
                  <strong> YouTube Terms of Service</strong> and third-party broadcast copyrights (e.g. National Assembly Television / NTA network streams).
                </p>
                <div className="bg-[#051710] p-3 rounded-xl border border-white/10 text-[11px] text-stone-300 space-y-1">
                  <span className="text-[#D4AF37] font-bold block">
                    Website Owner Compliance Notice:
                  </span>
                  <p className="font-light">
                    As a verified democratic legislative portal, we only provide direct media file downloads for original productions owned and licensed by the Member's Media Office. For external broadcasts, please utilize YouTube's authorized official methods.
                  </p>
                </div>
              </div>

              {/* Official YouTube Options Grid */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider block">
                  Official Authorized Options to Watch Offline or Save:
                </span>

                <div className="grid grid-cols-1 gap-2.5">
                  {/* Option 1: Watch on Official YouTube */}
                  <a
                    href={officialYtUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3.5 bg-[#0E3529] hover:bg-[#154636] border border-[#C6A15B]/40 rounded-2xl flex items-center justify-between transition group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center shrink-0">
                        <ExternalLink className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="font-bold text-xs text-white group-hover:text-[#D4AF37] transition">
                          1. Watch & Save on YouTube's Official Channel
                        </p>
                        <p className="text-[11px] text-stone-400">
                          Stream directly in full resolution on the official YouTube host
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-[#D4AF37] font-bold shrink-0 flex items-center gap-1">
                      OPEN <ExternalLink className="w-3.5 h-3.5" />
                    </span>
                  </a>

                  {/* Option 2: YouTube App Offline / YouTube Premium */}
                  <div className="p-3.5 bg-[#051710] border border-white/10 rounded-2xl space-y-1">
                    <p className="font-bold text-xs text-white flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                      2. Official Mobile Offline Save via YouTube App
                    </p>
                    <p className="text-[11px] text-stone-300 leading-relaxed font-light">
                      To watch offline legally without consuming mobile data repeatedly: Open this video in the official <strong>YouTube Mobile App</strong> (Android / iOS) and tap the native <strong>"Download / Save Offline"</strong> button beneath the video player.
                    </p>
                  </div>

                  {/* Option 3: Request Official Press B-Roll Kit */}
                  <div className="p-3.5 bg-[#051710] border border-white/10 rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="font-bold text-xs text-white">
                        3. Accredited Media & Press Office Inquiries
                      </p>
                      <p className="text-[11px] text-stone-400">
                        Accredited journalists and researchers may request official press packets
                      </p>
                    </div>
                    <a
                      href={`mailto:media@danmayeyabo.gov.ng?subject=Press%20Broadcast%20Request:%20${encodeURIComponent(video.title)}`}
                      className="px-3 py-1.5 bg-[#103C2E] hover:bg-[#154636] text-[#D4AF37] border border-[#C6A15B]/50 rounded-xl text-xs font-bold shrink-0 transition"
                    >
                      REQUEST
                    </a>
                  </div>
                </div>
              </div>

              {/* Copy Direct YouTube Link */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleCopyLink}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#0E3529] hover:bg-[#154636] border border-white/15 text-xs font-bold text-stone-200 hover:text-white transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-[#D4AF37]" />}
                  <span>{copied ? 'YOUTUBE LINK COPIED!' : 'COPY YOUTUBE LINK'}</span>
                </button>

                <a
                  href={officialYtUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow"
                >
                  <span>GO TO YOUTUBE</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#071913] border-t border-white/10 flex items-center justify-between text-xs text-stone-400">
          <span className="text-[10px] uppercase font-bold text-stone-500">
            Digital Rights & Transparency Protocol
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition cursor-pointer"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
