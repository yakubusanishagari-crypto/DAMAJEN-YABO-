import React, { useState } from 'react';
import { NewsArticle } from '../types';
import { Calendar, User, Search, ArrowRight, X, Tag } from 'lucide-react';
import { Language, t, Translations } from '../utils/i18n';

interface Props {
  news: NewsArticle[];
  setCurrentTab?: (tab: string) => void;
  currentLang?: Language;
  translations?: Translations;
}

export const NewsPage: React.FC<Props> = ({ 
  news, 
  setCurrentTab,
  currentLang = 'en', 
  translations 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeArticle, setActiveArticle] = useState<NewsArticle | null>(null);

  const categories = ['All', 'Press Release', 'Constituency News', 'Legislative Update', 'Speech'];

  const filteredNews = news.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          n.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          n.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || n.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const getCategoryLabel = (cat: string) => {
    if (cat === 'All') return t('allCategories', currentLang, translations);
    if (currentLang === 'ha') {
      if (cat === 'Press Release') return 'Sanarwar Manema Labarai';
      if (cat === 'Constituency News') return 'Labaran Mazaba';
      if (cat === 'Legislative Update') return 'Sababbin Dokoki';
      if (cat === 'Speech') return 'Jawabi na Musamman';
    }
    if (currentLang === 'ar') {
      if (cat === 'Press Release') return 'بيان صحفي';
      if (cat === 'Constituency News') return 'أخبار الدائرة';
      if (cat === 'Legislative Update') return 'مستجدات تشريعية';
      if (cat === 'Speech') return 'خطاب رسمي';
    }
    return cat;
  };

  const featured = news.find(n => n.isFeatured) || news[0];
  const isRtl = currentLang === 'ar';

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-12 ${isRtl ? 'rtl text-right' : ''}`}>
      {/* Header */}
      <div className="bg-gradient-to-br from-[#09291F] via-[#103C2E] to-[#0A261E] text-white rounded-3xl p-8 sm:p-14 shadow-xl space-y-4 relative overflow-hidden border border-[#C6A15B]/30">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#C6A15B]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#C6A15B]/20 border border-[#C6A15B]/40 text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
            <img src="/official_logo.png" alt="Official Seal" className="w-5 h-5 rounded-full object-contain shrink-0" />
            <span>{t('newsPageBadge', currentLang, translations)}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-['Manrope']">
            {t('newsPageTitle', currentLang, translations)}
          </h1>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-light">
            {t('newsPageDesc', currentLang, translations)}
          </p>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className={`w-4 h-4 text-stone-400 absolute top-3.5 ${isRtl ? 'right-3.5' : 'left-3.5'}`} />
          <input
            type="text"
            placeholder={t('searchNewsPlaceholder', currentLang, translations)}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#103C2E] ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#103C2E] text-white shadow-sm'
                  : 'bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              {getCategoryLabel(cat)}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Spotlight Article */}
      {featured && selectedCategory === 'All' && !searchTerm && (
        <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-stone-200 grid grid-cols-1 lg:grid-cols-12 hover:border-[#C6A15B]/50 transition-all">
          <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto bg-stone-100 overflow-hidden">
            <img src={featured.imageUrl} alt={featured.title} className="w-full h-full object-cover hover:scale-105 transition duration-700" />
            <div className={`absolute top-4 ${isRtl ? 'right-4' : 'left-4'}`}>
              <span className="bg-[#C6A15B] text-[#09291F] font-bold text-xs px-3.5 py-1.5 rounded-full shadow">
                {t('featuredNewsLabel', currentLang, translations)}
              </span>
            </div>
          </div>
          <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-xs text-stone-500">
                <span className="bg-[#103C2E]/10 text-[#103C2E] px-3 py-1 rounded-full font-semibold">
                  {getCategoryLabel(featured.category)}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#C6A15B]" /> {featured.date}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-['Manrope'] text-[#103C2E] leading-tight">
                {featured.title}
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed font-light">
                {featured.excerpt}
              </p>
            </div>
            <button
              onClick={() => setActiveArticle(featured)}
              className="bg-[#103C2E] hover:bg-[#09291F] text-white px-6 py-3 rounded-xl font-bold text-sm shadow transition flex items-center justify-center gap-2 w-full sm:w-auto cursor-pointer"
            >
              <span>{t('readMore', currentLang, translations)}</span> 
              <ArrowRight className={`w-4 h-4 text-[#C6A15B] ${isRtl ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      )}

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {filteredNews.map((article) => (
          <div key={article.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-200 flex flex-col group hover:shadow-xl hover:border-[#C6A15B]/50 transition-all duration-300 hover:-translate-y-1">
            <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
              <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              <div className={`absolute top-3 ${isRtl ? 'right-3' : 'left-3'}`}>
                <span className="bg-[#103C2E] text-white px-3 py-1 rounded-md text-xs font-semibold shadow">
                  {getCategoryLabel(article.category)}
                </span>
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="text-xs text-stone-500 flex items-center gap-1 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-[#C6A15B]" /> {article.date}
                </div>
                <h3 className="font-['Manrope'] font-bold text-lg text-[#103C2E] line-clamp-2 group-hover:text-[#C6A15B] transition-colors leading-snug">
                  {article.title}
                </h3>
                <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed font-light">
                  {article.excerpt}
                </p>
              </div>
              <button
                onClick={() => setActiveArticle(article)}
                className="text-[#103C2E] font-bold text-xs flex items-center gap-1 hover:text-[#C6A15B] transition pt-2 border-t border-stone-100 cursor-pointer"
              >
                <span>{t('readMore', currentLang, translations)}</span> 
                <ArrowRight className={`w-3.5 h-3.5 text-[#C6A15B] ${isRtl ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Article Reader Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto animate-fadeIn">
          <div className="bg-[#FAF9F5] w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-[#C6A15B]/40 max-h-[90vh] flex flex-col my-auto">
            <div className="bg-[#103C2E] text-white p-6 flex items-center justify-between">
              <div className="space-y-1">
                <span className="bg-[#C6A15B] text-[#09291F] text-xs font-bold px-3 py-1 rounded-full">
                  {getCategoryLabel(activeArticle.category)}
                </span>
                <span className="text-xs text-white/80 block pt-1">{activeArticle.date} • {activeArticle.author}</span>
              </div>
              <button onClick={() => setActiveArticle(null)} className="text-white/80 hover:text-white p-2 cursor-pointer" aria-label="Close article">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 sm:p-10 overflow-y-auto space-y-6 text-[#242824]">
              <h2 className="text-2xl sm:text-3xl font-extrabold font-['Manrope'] text-[#103C2E]">
                {activeArticle.title}
              </h2>

              <div className="aspect-[16/9] rounded-2xl overflow-hidden shadow-md bg-stone-100">
                <img src={activeArticle.imageUrl} alt={activeArticle.title} className="w-full h-full object-cover" />
              </div>

              <div className="space-y-4 text-sm sm:text-base leading-relaxed whitespace-pre-line bg-white p-6 rounded-2xl border border-stone-200 font-light">
                {activeArticle.content}
              </div>

              {activeArticle.tags && activeArticle.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 items-center pt-2">
                  <Tag className="w-4 h-4 text-[#C6A15B]" />
                  {activeArticle.tags.map((tg, idx) => (
                    <span key={idx} className="bg-stone-200 text-[#103C2E] px-3 py-1 rounded-full text-xs font-semibold">
                      #{tg}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-stone-100 p-4 border-t border-stone-200 flex justify-end">
              <button
                onClick={() => setActiveArticle(null)}
                className="bg-[#103C2E] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#09291F] transition cursor-pointer"
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
