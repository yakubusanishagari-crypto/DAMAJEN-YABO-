import React, { useState } from 'react';
import { GalleryItem } from '../types';
import { 
  Image as ImageIcon, Video, Calendar, X, ZoomIn, Play, 
  ExternalLink, Shield, Film, Filter, Share2 
} from 'lucide-react';
import { YouTubeVideoTheater } from '../components/YouTubeVideoTheater';
import { Language, t, Translations } from '../utils/i18n';
import { resolveMediaThumbnail } from '../utils/youtube';

interface Props {
  gallery: GalleryItem[];
  setCurrentTab?: (tab: string) => void;
  currentLang?: Language;
  translations?: Translations;
}

export const GalleryPage: React.FC<Props> = ({ 
  gallery, 
  setCurrentTab,
  currentLang = 'en', 
  translations 
}) => {
  const [mediaTypeFilter, setMediaTypeFilter] = useState<'all' | 'video' | 'photo'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Modals
  const [activeVideo, setActiveVideo] = useState<GalleryItem | null>(null);
  const [activePhoto, setActivePhoto] = useState<GalleryItem | null>(null);

  const categories = ['All', 'National Assembly', 'Projects', 'Constituency Visits', 'Town Halls', 'Empowerment'];

  const filteredMedia = gallery.filter(item => {
    const matchesType = mediaTypeFilter === 'all' || 
      (mediaTypeFilter === 'video' && (item.type === 'video' || !!item.videoUrl)) ||
      (mediaTypeFilter === 'photo' && (item.type !== 'video' && !item.videoUrl));
    
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesType && matchesCategory;
  });

  const getCategoryLabel = (cat: string) => {
    if (cat === 'All') return t('allCategories', currentLang, translations);
    if (currentLang === 'ha') {
      if (cat === 'National Assembly') return 'Majalisar Tarayya';
      if (cat === 'Projects') return 'Ayyukan Raya Kasa';
      if (cat === 'Constituency Visits') return 'Ziyarar Mazaba';
      if (cat === 'Town Halls') return 'Ganawa da Jama\'a';
      if (cat === 'Empowerment') return 'Karfafa Al\'umma';
    }
    if (currentLang === 'ar') {
      if (cat === 'National Assembly') return 'الجمعية الوطنية';
      if (cat === 'Projects') return 'مشاريع الدائرة';
      if (cat === 'Constituency Visits') return 'الجولات الميدانية';
      if (cat === 'Town Halls') return 'اللقاءات الشعبية';
      if (cat === 'Empowerment') return 'برامج التمكين';
    }
    return cat;
  };

  const videoCount = gallery.filter(g => g.type === 'video' || !!g.videoUrl).length;
  const photoCount = gallery.filter(g => g.type !== 'video' && !g.videoUrl).length;

  const isRtl = currentLang === 'ar';

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-12 ${isRtl ? 'rtl text-right' : ''}`}>
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#072118] via-[#0E3529] to-[#0A261E] text-white rounded-3xl p-8 sm:p-14 shadow-2xl relative overflow-hidden border border-[#C6A15B]/40">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#C6A15B]/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#C6A15B]/20 border border-[#C6A15B]/40 text-xs font-semibold text-[#D4AF37] tracking-wider uppercase">
            <img src="/official_logo.png" alt="Official Seal" className="w-5 h-5 rounded-full object-contain shrink-0" />
            <span>{t('galleryPageBadge', currentLang, translations)}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-['Manrope']">
            {t('galleryPageTitle', currentLang, translations)}
          </h1>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-light">
            {t('galleryPageDesc', currentLang, translations)}
          </p>
        </div>
      </div>

      {/* Control Bar: Media Type Filter & Category Selector */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Media Type Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-xl w-full md:w-auto">
          <button
            onClick={() => setMediaTypeFilter('all')}
            className={`flex-1 md:flex-initial px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              mediaTypeFilter === 'all'
                ? 'bg-[#103C2E] text-white shadow-sm'
                : 'text-stone-600 hover:text-[#103C2E]'
            }`}
          >
            <span>{t('allMediaLabel', currentLang, translations)}</span>
            <span className="text-[11px] opacity-80">({gallery.length})</span>
          </button>

          <button
            onClick={() => setMediaTypeFilter('video')}
            className={`flex-1 md:flex-initial px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              mediaTypeFilter === 'video'
                ? 'bg-[#103C2E] text-white shadow-sm'
                : 'text-stone-600 hover:text-[#103C2E]'
            }`}
          >
            <Video className="w-4 h-4 text-[#C6A15B]" />
            <span>{t('videosOnlyLabel', currentLang, translations)}</span>
            <span className="text-[11px] opacity-80">({videoCount})</span>
          </button>

          <button
            onClick={() => setMediaTypeFilter('photo')}
            className={`flex-1 md:flex-initial px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              mediaTypeFilter === 'photo'
                ? 'bg-[#103C2E] text-white shadow-sm'
                : 'text-stone-600 hover:text-[#103C2E]'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-[#C6A15B]" />
            <span>{t('photosOnlyLabel', currentLang, translations)}</span>
            <span className="text-[11px] opacity-80">({photoCount})</span>
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto justify-start md:justify-end">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#C6A15B] text-[#09291F] font-bold shadow-sm'
                  : 'bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              {getCategoryLabel(cat)}
            </button>
          ))}
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredMedia.length === 0 ? (
          <div className="col-span-full py-16 text-center text-stone-500 bg-white rounded-3xl border border-stone-200 space-y-2">
            <Film className="w-10 h-10 text-stone-300 mx-auto" />
            <p className="text-base font-semibold text-[#103C2E]">{t('noProjectsFound', currentLang, translations)}</p>
            <p className="text-xs text-stone-400">{t('noProjectsFoundSub', currentLang, translations)}</p>
          </div>
        ) : (
          filteredMedia.map((item) => {
            const isVideo = item.type === 'video' || !!item.videoUrl;

            return (
              <div
                key={item.id}
                onClick={() => {
                  if (isVideo) {
                    setActiveVideo(item);
                  } else {
                    setActivePhoto(item);
                  }
                }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-200 group cursor-pointer flex flex-col hover:shadow-xl hover:border-[#C6A15B]/50 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Media Preview Container */}
                <div className="relative aspect-[16/10] overflow-hidden bg-stone-900">
                  <img
                    src={resolveMediaThumbnail(item)}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = isVideo 
                        ? 'https://img.youtube.com/vi/ScMzIvxBSi4/hqdefault.jpg' 
                        : 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=1000';
                    }}
                  />

                  {/* Video Play Badge / Photo Zoom Overlay */}
                  {isVideo ? (
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-[#D4AF37] text-[#09291F] flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 fill-current ml-0.5" />
                      </div>
                      <div className={`absolute bottom-3 ${isRtl ? 'left-3' : 'right-3'} bg-black/70 text-white px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase flex items-center gap-1`}>
                        <Video className="w-3 h-3 text-[#D4AF37]" />
                        <span>{t('clickToPlayVideo', currentLang, translations)}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-[#D4AF37] text-[#09291F] p-3 rounded-full shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                        <ZoomIn className="w-6 h-6" />
                      </span>
                    </div>
                  )}

                  {/* Category Chip */}
                  <div className={`absolute top-3 ${isRtl ? 'right-3' : 'left-3'}`}>
                    <span className="bg-[#103C2E]/90 text-white px-2.5 py-1 rounded text-[11px] font-bold shadow backdrop-blur-sm">
                      {getCategoryLabel(item.category)}
                    </span>
                  </div>
                </div>

                {/* Text Content */}
                <div className="p-6 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-xs text-stone-500 flex items-center gap-1 mb-1 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-[#C6A15B]" /> {item.date}
                    </div>
                    <h3 className="font-['Manrope'] font-bold text-base text-[#103C2E] group-hover:text-[#C6A15B] transition leading-snug">
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed font-light">
                    {item.description}
                  </p>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-[#103C2E]">
                    <span>{isVideo ? t('clickToPlayVideo', currentLang, translations) : t('viewHighResPhoto', currentLang, translations)}</span>
                    <span className="text-[#C6A15B]">{isRtl ? '←' : '→'}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* A. VIDEO PLAYBACK THEATER MODAL (Plays ONLY inside the website with views, likes, comments) */}
      {activeVideo && (
        <YouTubeVideoTheater
          key={activeVideo.id}
          video={activeVideo}
          allVideos={gallery.filter(g => g.type === 'video' || !!g.videoUrl)}
          onSelectVideo={(item) => setActiveVideo(item)}
          onClose={() => setActiveVideo(null)}
        />
      )}

      {/* B. PHOTOGRAPH LIGHTBOX MODAL */}
      {activePhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#FAF9F5] w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden border border-[#C6A15B]/40 max-h-[90vh] flex flex-col my-auto">
            <div className="bg-[#103C2E] text-white p-4 sm:p-5 flex items-center justify-between">
              <div>
                <span className="bg-[#C6A15B] text-[#09291F] text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded">
                  {getCategoryLabel(activePhoto.category)}
                </span>
                <h3 className="text-sm sm:text-base font-bold font-['Manrope'] mt-1 truncate max-w-lg">
                  {activePhoto.title}
                </h3>
              </div>
              <button
                onClick={() => setActivePhoto(null)}
                className="text-white/80 hover:text-white p-1 cursor-pointer"
                aria-label="Close image"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col items-center space-y-4">
              <div className="max-h-[60vh] rounded-xl overflow-hidden shadow-lg bg-black/5">
                <img
                  src={activePhoto.imageUrl}
                  alt={activePhoto.title}
                  className="max-h-[60vh] w-auto object-contain mx-auto"
                />
              </div>

              <div className="w-full text-left rtl:text-right space-y-1 bg-white p-4 rounded-xl border border-stone-200">
                <div className="text-xs text-stone-500 font-semibold">
                  {t('startDate', currentLang, translations)}: {activePhoto.date}
                </div>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-light">
                  {activePhoto.description}
                </p>
              </div>
            </div>

            <div className="p-4 bg-stone-100 border-t border-stone-200 flex justify-end">
              <button
                onClick={() => setActivePhoto(null)}
                className="bg-[#103C2E] hover:bg-[#09291F] text-white px-5 py-2 rounded-xl text-xs font-bold cursor-pointer"
              >
                {t('closeBtn', currentLang, translations)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
