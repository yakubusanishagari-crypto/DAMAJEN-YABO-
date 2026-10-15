import React, { useState } from 'react';
import { NewsArticle } from '../types';
import { Calendar, User, Search, ArrowRight, X, Tag } from 'lucide-react';

interface Props {
  news: NewsArticle[];
}

export const NewsPage: React.FC<Props> = ({ news }) => {
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

  const featured = news.find(n => n.isFeatured) || news[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="bg-[#103C2E] text-white rounded-3xl p-8 sm:p-12 shadow-xl space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-[#C6A15B] bg-[#C6A15B]/20 px-3 py-1 rounded-full border border-[#C6A15B]/30">
          Media & Press Centre
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-['Manrope']">
          News, Announcements & Updates
        </h1>
        <p className="text-white/90 text-sm sm:text-base max-w-2xl leading-relaxed">
          Official press releases, constituency tour updates, legislative debates, and public service announcements from the office of Hon. Umar Yusuf (Danmaje Yabo).
        </p>
      </div>

      {/* Search & Category Filter */}
      <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search news articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-[#FAF9F5] border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#103C2E]"
          />
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                selectedCategory === cat
                  ? 'bg-[#103C2E] text-white shadow'
                  : 'bg-gray-100 text-[#6B716D] hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Spotlight Article (if no search filter active) */}
      {featured && selectedCategory === 'All' && !searchTerm && (
        <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-200 grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-7 relative aspect-[16/10] lg:aspect-auto bg-gray-100">
            <img src={featured.imageUrl} alt={featured.title} className="w-full h-full object-cover" />
            <div className="absolute top-4 left-4">
              <span className="bg-[#C6A15B] text-[#09291F] font-bold text-xs px-3.5 py-1.5 rounded-full shadow">
                Featured Spotlight
              </span>
            </div>
          </div>
          <div className="lg:col-span-5 p-8 sm:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-xs text-[#6B716D]">
                <span className="bg-[#103C2E]/10 text-[#103C2E] px-3 py-1 rounded-full font-semibold">{featured.category}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-[#C6A15B]" /> {featured.date}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-['Manrope'] text-[#103C2E] leading-tight">
                {featured.title}
              </h2>
              <p className="text-sm text-[#6B716D] leading-relaxed">
                {featured.excerpt}
              </p>
            </div>
            <button
              onClick={() => setActiveArticle(featured)}
              className="bg-[#103C2E] hover:bg-[#09291F] text-white px-6 py-3 rounded-xl font-bold text-sm shadow transition flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              Read Full Article <ArrowRight className="w-4 h-4 text-[#C6A15B]" />
            </button>
          </div>
        </div>
      )}

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {filteredNews.map((article) => (
          <div key={article.id} className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200 flex flex-col group">
            <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
              <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              <div className="absolute top-3 left-3">
                <span className="bg-[#103C2E] text-white px-3 py-1 rounded-md text-xs font-semibold">
                  {article.category}
                </span>
              </div>
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="text-xs text-[#6B716D] flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#C6A15B]" /> {article.date}
                </div>
                <h3 className="font-['Manrope'] font-bold text-lg text-[#103C2E] line-clamp-2 group-hover:text-[#C6A15B] transition">
                  {article.title}
                </h3>
                <p className="text-xs text-[#6B716D] line-clamp-3 leading-relaxed">
                  {article.excerpt}
                </p>
              </div>
              <button
                onClick={() => setActiveArticle(article)}
                className="text-[#103C2E] font-bold text-xs flex items-center gap-1 hover:text-[#C6A15B] transition pt-2 border-t border-gray-100"
              >
                Read Article <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Article Reader Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#FAF9F5] w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-[#C6A15B]/40 max-h-[90vh] flex flex-col">
            <div className="bg-[#103C2E] text-white p-6 flex items-center justify-between">
              <div className="space-y-1">
                <span className="bg-[#C6A15B] text-[#09291F] text-xs font-bold px-3 py-1 rounded-full">
                  {activeArticle.category}
                </span>
                <span className="text-xs text-white/80 block pt-1">{activeArticle.date} • By {activeArticle.author}</span>
              </div>
              <button onClick={() => setActiveArticle(null)} className="text-white/80 hover:text-white p-2">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 sm:p-10 overflow-y-auto space-y-6 text-[#242824]">
              <h2 className="text-2xl sm:text-3xl font-extrabold font-['Manrope'] text-[#103C2E]">
                {activeArticle.title}
              </h2>

              <div className="aspect-[16/9] rounded-2xl overflow-hidden shadow-md bg-gray-100">
                <img src={activeArticle.imageUrl} alt={activeArticle.title} className="w-full h-full object-cover" />
              </div>

              <div className="space-y-4 text-sm sm:text-base leading-relaxed whitespace-pre-line bg-white p-6 rounded-2xl border border-gray-200">
                {activeArticle.content}
              </div>

              {activeArticle.tags && activeArticle.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 items-center pt-2">
                  <Tag className="w-4 h-4 text-[#C6A15B]" />
                  {activeArticle.tags.map((t, idx) => (
                    <span key={idx} className="bg-gray-200 text-[#103C2E] px-3 py-1 rounded-full text-xs font-semibold">
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-gray-100 p-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setActiveArticle(null)}
                className="bg-[#103C2E] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#09291F] transition"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
