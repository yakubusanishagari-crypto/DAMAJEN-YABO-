import React, { useState } from 'react';
import { Project, ProjectStatus } from '../types';
import { Search, MapPin, Calendar, CheckCircle, Clock, X, ChevronRight, Filter, Building2, Shield, ArrowRight } from 'lucide-react';
import { Language, t, Translations } from '../utils/i18n';

interface Props {
  projects: Project[];
  setCurrentTab?: (tab: string) => void;
  currentLang?: Language;
  translations?: Translations;
}

export const ProjectsPage: React.FC<Props> = ({ 
  projects, 
  setCurrentTab, 
  currentLang = 'en', 
  translations 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const categories = ['All', 'Water & Sanitation', 'Education', 'Roads & Infrastructure', 'Healthcare', 'Youth Development'];
  const statuses = ['All', 'Completed', 'Ongoing', 'Proposed'];

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || p.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusLabel = (status: ProjectStatus) => {
    if (status === 'Completed') return t('statusCompleted', currentLang, translations);
    if (status === 'Ongoing') return t('statusOngoing', currentLang, translations);
    if (status === 'Proposed') return t('statusProposed', currentLang, translations);
    return status;
  };

  const getCategoryLabel = (cat: string) => {
    if (cat === 'All') return t('allCategories', currentLang, translations);
    if (currentLang === 'ha') {
      if (cat === 'Water & Sanitation') return 'Ruwa da Tsaftar Muhalli';
      if (cat === 'Education') return 'Ilimi da Makarantu';
      if (cat === 'Roads & Infrastructure') return 'Hanyoyi da Gine-gine';
      if (cat === 'Healthcare') return 'Kiwan Lafiya';
      if (cat === 'Youth Development') return 'Ci Gaban Matasa';
    }
    if (currentLang === 'ar') {
      if (cat === 'Water & Sanitation') return 'المياه والإصحاح البيئي';
      if (cat === 'Education') return 'التعليم والمدارس';
      if (cat === 'Roads & Infrastructure') return 'الطرق والبنية التحتية';
      if (cat === 'Healthcare') return 'الرعاية الصحية';
      if (cat === 'Youth Development') return 'تنمية وتأهيل الشباب';
    }
    return cat;
  };

  const isRtl = currentLang === 'ar';

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-12 ${isRtl ? 'rtl text-right' : ''}`}>
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#09291F] via-[#103C2E] to-[#0A261E] text-white rounded-3xl p-8 sm:p-14 shadow-xl space-y-4 relative overflow-hidden border border-[#C6A15B]/30">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#C6A15B]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#C6A15B]/20 border border-[#C6A15B]/40 text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
            <img src="/official_logo.png" alt="Official Seal" className="w-5 h-5 rounded-full object-contain shrink-0" />
            <span>{t('projectsPageBadge', currentLang, translations)}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-['Manrope']">
            {t('projectsPageTitle', currentLang, translations)}
          </h1>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-light">
            {t('projectsPageDesc', currentLang, translations)}
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className={`w-4 h-4 text-stone-400 absolute top-3.5 ${isRtl ? 'right-3.5' : 'left-3.5'}`} />
          <input
            type="text"
            placeholder={t('searchProjectsPlaceholder', currentLang, translations)}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#103C2E] transition-colors ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
          />
        </div>

        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#103C2E] transition-colors text-stone-700"
          >
            {categories.map(c => (
              <option key={c} value={c}>{getCategoryLabel(c)}</option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#103C2E] transition-colors text-stone-700"
          >
            {statuses.map(s => (
              <option key={s} value={s}>
                {s === 'All' ? t('allStatuses', currentLang, translations) : getStatusLabel(s as ProjectStatus)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.length === 0 ? (
          <div className="col-span-full py-16 text-center text-stone-500 bg-white rounded-2xl border border-stone-200 space-y-2">
            <Building2 className="w-10 h-10 text-stone-300 mx-auto" />
            <p className="text-lg font-semibold text-[#103C2E]">{t('noProjectsFound', currentLang, translations)}</p>
            <p className="text-xs text-stone-500">{t('noProjectsFoundSub', currentLang, translations)}</p>
          </div>
        ) : (
          filteredProjects.map((project) => (
            <div 
              key={project.id} 
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-200 flex flex-col justify-between group hover:shadow-xl hover:border-[#C6A15B]/50 transition-all duration-300 hover:-translate-y-1"
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-stone-200">
                  <img
                    src={project.images[0] || '/solar_water_project_1792063316637.jpg'}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541888946425-d0fbb18f764c?auto=format&fit=crop&q=80&w=1000';
                    }}
                  />
                  <div className={`absolute top-3 ${isRtl ? 'left-3' : 'right-3'}`}>
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold shadow ${
                      project.status === 'Completed' ? 'bg-emerald-700 text-white' :
                      project.status === 'Ongoing' ? 'bg-amber-600 text-white' :
                      project.status === 'Proposed' ? 'bg-blue-600 text-white' : 'bg-rose-600 text-white'
                    }`}>
                      {getStatusLabel(project.status)}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="text-xs text-stone-500 flex items-center gap-1.5 font-medium">
                    <span>{getCategoryLabel(project.category)}</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#C6A15B]" /> {project.location}
                    </span>
                  </div>

                  <h3 className="font-['Manrope'] font-bold text-lg text-[#103C2E] leading-snug group-hover:text-[#C6A15B] transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed font-light">
                    {project.description}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 border-t border-stone-100 flex items-center justify-between">
                <span className="text-xs text-stone-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#C6A15B]" /> {project.date}
                </span>

                <button
                  onClick={() => setActiveProject(project)}
                  className="bg-[#103C2E] hover:bg-[#09291F] text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow flex items-center gap-1 cursor-pointer"
                >
                  <span>{t('viewDetails', currentLang, translations)}</span>
                  <ChevronRight className={`w-3.5 h-3.5 text-[#C6A15B] ${isRtl ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Project Detail Modal */}
      {activeProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto animate-fadeIn">
          <div className="bg-[#FAF9F5] w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-[#C6A15B]/40 max-h-[90vh] flex flex-col my-auto">
            <div className="bg-[#103C2E] text-white p-6 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#C6A15B] uppercase tracking-wider">{getCategoryLabel(activeProject.category)}</span>
                <h3 className="text-xl sm:text-2xl font-bold font-['Manrope'] mt-1">{activeProject.title}</h3>
              </div>
              <button onClick={() => setActiveProject(null)} className="text-white/80 hover:text-white p-2 cursor-pointer" aria-label="Close modal">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-stone-800">
              {/* Photo Showcase */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeProject.images.map((img, i) => (
                  <div key={i} className="aspect-[16/10] rounded-xl overflow-hidden shadow-sm bg-stone-200">
                    <img 
                      src={img} 
                      alt={`Project site ${i+1}`} 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541888946425-d0fbb18f764c?auto=format&fit=crop&q=80&w=1000';
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white p-4 rounded-xl border border-stone-200 text-xs">
                <div>
                  <span className="text-stone-500 block">{t('allStatuses', currentLang, translations)}</span>
                  <span className="font-bold text-[#103C2E] text-sm">{getStatusLabel(activeProject.status)}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">{t('projectLocation', currentLang, translations)}</span>
                  <span className="font-bold text-[#103C2E] text-sm">{activeProject.location}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">{t('startDate', currentLang, translations)}</span>
                  <span className="font-bold text-[#103C2E] text-sm">{activeProject.startDate}</span>
                </div>
                <div>
                  <span className="text-stone-500 block">{t('fundingSource', currentLang, translations)}</span>
                  <span className="font-bold text-[#103C2E] text-sm">{activeProject.budgetNotes || 'Constituency Allocation'}</span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h4 className="font-bold font-['Manrope'] text-[#103C2E] text-base">
                  {currentLang === 'ha' ? 'Bayani da Tasirin Aiki' : currentLang === 'ar' ? 'نطاق المشروع والأثر المجتمعي' : 'Project Scope & Community Impact'}
                </h4>
                <p className="text-xs sm:text-sm leading-relaxed text-stone-700 bg-white p-4 rounded-xl border border-stone-200 font-light">
                  {activeProject.description}
                </p>
              </div>

              {/* Milestone Updates */}
              {activeProject.updates.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-bold font-['Manrope'] text-[#103C2E] text-base">
                    {currentLang === 'ha' ? 'Tsayayyun Matakan Aiki' : currentLang === 'ar' ? 'مراحل الإنجاز وسجل التقدم' : 'Execution Milestones & Progress Log'}
                  </h4>
                  <div className="space-y-2.5">
                    {activeProject.updates.map(up => (
                      <div key={up.id} className="bg-white p-4 rounded-xl border border-stone-200 space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-[#103C2E]">{up.title}</span>
                          <span className="text-stone-500 font-medium">{up.date}</span>
                        </div>
                        <p className="text-xs text-stone-600 leading-relaxed font-light">{up.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-stone-100 p-4 border-t border-stone-200 flex flex-wrap justify-between items-center gap-3">
              {setCurrentTab && (
                <button
                  onClick={() => {
                    setActiveProject(null);
                    setCurrentTab('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="bg-[#C6A15B] hover:bg-[#b59048] text-[#09291F] px-4 py-2 rounded-xl font-bold text-xs shadow flex items-center gap-1 cursor-pointer"
                >
                  <span>{currentLang === 'ha' ? 'Aika Tambaya Kan Wannan Aiki' : currentLang === 'ar' ? 'إرسال استفسار بشأن هذا المشروع' : 'Submit Inquiry Regarding This Project'}</span>
                  <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                </button>
              )}

              <button
                onClick={() => setActiveProject(null)}
                className="bg-[#103C2E] text-white px-5 py-2 rounded-xl font-bold text-xs hover:bg-[#09291F] transition cursor-pointer ml-auto"
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
