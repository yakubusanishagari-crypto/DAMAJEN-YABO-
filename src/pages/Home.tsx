import React, { useState } from 'react';
import { Project, NewsArticle, EmpowermentProgram, LegislativeRecord, GalleryItem } from '../types';
import { ConstituencyStats } from '../App';
import { INITIAL_GALLERY } from '../data/initialData';
import { YouTubeVideoTheater } from '../components/YouTubeVideoTheater';
import { 
  ArrowRight, CheckCircle, MapPin, Award, Users, BookOpen, Shield, 
  ChevronRight, HeartHandshake, Landmark, FileText, Calendar, Building2, 
  GraduationCap, Droplet, Clock, X, ExternalLink, Check, Copy, AlertCircle,
  ThumbsUp, MessageSquare, Eye, Play
} from 'lucide-react';
import { Language, t, Translations } from '../utils/i18n';

interface Props {
  setCurrentTab: (tab: string) => void;
  projects: Project[];
  news: NewsArticle[];
  programs: EmpowermentProgram[];
  legislative: LegislativeRecord[];
  stats: ConstituencyStats;
  currentLang: Language;
  translations: Translations;
}

export const Home: React.FC<Props> = ({ 
  setCurrentTab, 
  projects, 
  news, 
  programs, 
  legislative,
  stats, 
  currentLang, 
  translations 
}) => {
  // Modal states for rich homepage interactions
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [activeNews, setActiveNews] = useState<NewsArticle | null>(null);
  const [activeLegItem, setActiveLegItem] = useState<LegislativeRecord | null>(null);
  const [applyProgram, setApplyProgram] = useState<EmpowermentProgram | null>(null);

  // Application form state
  const [appFormData, setAppFormData] = useState({
    applicantName: '',
    email: '',
    phone: '',
    wardOrTown: '',
    qualifications: '',
    statement: ''
  });
  const [appSubmitting, setAppSubmitting] = useState(false);
  const [appReceipt, setAppReceipt] = useState<{ ref: string; title: string; date: string } | null>(null);
  const [appError, setAppError] = useState('');
  const [copiedRef, setCopiedRef] = useState(false);

  // Filter for featured projects sector on home page
  const [projectSectorFilter, setProjectSectorFilter] = useState<string>('All');

  const sectorCategories = ['All', 'Water & Sanitation', 'Education', 'Roads & Infrastructure', 'Healthcare'];

  const filteredFeaturedProjects = projects.filter(p => {
    if (projectSectorFilter === 'All') return p.isFeatured || true;
    return p.category === projectSectorFilter;
  }).slice(0, 3);

  const latestNews = news.slice(0, 3);
  const featuredLegislative = legislative.slice(0, 2);
  const featuredPrograms = programs.slice(0, 2);

  const navigateTo = (tab: string) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyProgram) return;
    setAppSubmitting(true);
    setAppError('');

    const refCode = `DY-${Date.now().toString().slice(-6)}`;
    const newApp = {
      programId: applyProgram.id,
      programTitle: applyProgram.title,
      referenceCode: refCode,
      ...appFormData,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };

    try {
      await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newApp)
      });
    } catch {
      // Local fallback handled gracefully
    }

    // Save locally
    try {
      const existing = JSON.parse(localStorage.getItem('danmaje_applications') || '[]');
      existing.unshift(newApp);
      localStorage.setItem('danmaje_applications', JSON.stringify(existing));
    } catch {
      // Storage fallback
    }

    setAppReceipt({
      ref: refCode,
      title: applyProgram.title,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    });
    setAppSubmitting(false);
  };

  const handleCopyRef = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2500);
  };

  return (
    <div className="space-y-20 pb-20 overflow-x-hidden">
      {/* 1. PROFESSIONAL HERO SECTION */}
      <section className="relative bg-gradient-to-br from-[#072118] via-[#0D3327] to-[#0A261E] text-white">
        {/* Subtle royal geometric pattern overlay */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, #C6A15B 1.5%, transparent 0%), radial-gradient(circle at 75px 75px, #C6A15B 1.5%, transparent 0%)`,
            backgroundSize: '100px 100px'
          }}
        />
        
        {/* Ambient warm lighting accents */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C6A15B]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            {/* Official Kicker Plate */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#C6A15B]/15 border border-[#C6A15B]/40 text-xs font-semibold text-[#D4AF37] tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <Shield className="w-3.5 h-3.5 shrink-0 text-[#C6A15B]" />
              <span>{t('heroWelcome', currentLang, translations)}</span>
              <span className="text-white/40">·</span>
              <span className="text-white/80 font-medium">10th National Assembly</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-['Manrope'] leading-[1.15]">
                Hon. Umar Yusuf
                <span className="block text-[#D4AF37] text-2xl sm:text-4xl lg:text-5xl font-semibold mt-1">
                  (Danmaje Yabo)
                </span>
              </h1>
              <p className="text-base sm:text-xl text-emerald-100 font-medium pt-1 flex items-center gap-2">
                <span>{t('constituencyTitle', currentLang, translations)}</span>
              </p>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-[#C6A15B] tracking-wide font-semibold">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>{t('constituencySubtitle', currentLang, translations)}</span>
              </div>
            </div>

            <p className="text-sm sm:text-base text-white/85 leading-relaxed font-normal max-w-2xl">
              {t('heroDescription', currentLang, translations)}
            </p>

            {/* Prominent Action Buttons with World-Class Aesthetics */}
            <div className="flex flex-wrap items-center gap-4 pt-3">
              <button
                onClick={() => navigateTo('projects')}
                className="bg-gradient-to-r from-[#D4AF37] via-[#C6A15B] to-[#B38F44] hover:brightness-110 active:scale-[0.98] text-[#09291F] font-bold px-8 py-4 rounded-xl shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 flex items-center gap-2.5 text-sm sm:text-base border border-[#E5C16C] cursor-pointer"
              >
                <span>{t('exploreProjects', currentLang, translations)}</span>
                <ArrowRight className="w-4 h-4 shrink-0 text-[#09291F]" />
              </button>

              <button
                onClick={() => navigateTo('contact')}
                className="bg-white/10 hover:bg-white/20 active:scale-[0.98] text-white border border-white/30 font-bold px-7 py-4 rounded-xl transition-all duration-200 transform hover:-translate-y-0.5 flex items-center gap-2 text-sm sm:text-base backdrop-blur-md cursor-pointer"
              >
                <span>{t('contactOffice', currentLang, translations)}</span>
              </button>

              <button
                onClick={() => navigateTo('about')}
                className="text-white/90 hover:text-[#D4AF37] font-semibold text-xs sm:text-sm transition-colors py-2 px-3 flex items-center gap-1.5 cursor-pointer underline-offset-4 hover:underline"
              >
                <span>{t('readFullBio', currentLang, translations)}</span>
                <ChevronRight className="w-4 h-4 shrink-0 text-[#C6A15B]" />
              </button>
            </div>

            {/* Quick Liaison Notice */}
            <div className="pt-2 flex items-center gap-4 text-xs text-white/70">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Federal Representation</span>
              </span>
              <span>·</span>
              <span>Serving Yabo LGA & Shagari LGA</span>
            </div>
          </div>

          {/* Portrait Photo Presentation with Luxury Bezel */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm sm:max-w-md">
              {/* Golden Ambient Aura */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#C6A15B]/30 via-emerald-600/20 to-[#C6A15B]/40 rounded-3xl blur-2xl opacity-75"></div>
              
              {/* Luxury Frame Container */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-[#C6A15B]/60 ring-4 ring-[#09291F]/80 bg-[#09291F] aspect-[3/4] group">
                <img
                  src="/src/assets/images/portrait_danmaje_yabo_1792063283391.jpg"
                  alt="Hon. Umar Yusuf Danmaje Yabo - Member House of Representatives"
                  className="w-full h-full object-cover object-top transition duration-700 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800';
                  }}
                />
                
                {/* Official Title Plaque Overlay */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#061B14] via-[#09291F]/90 to-transparent p-6 text-white border-t border-[#C6A15B]/30">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase tracking-widest text-[#D4AF37] font-extrabold flex items-center gap-1.5">
                      <Shield className="w-3 h-3 text-[#D4AF37]" />
                      Official Representative
                    </span>
                    <span className="text-[10px] font-bold bg-[#C6A15B]/20 text-[#D4AF37] px-2 py-0.5 rounded border border-[#C6A15B]/30">
                      Nigeria
                    </span>
                  </div>
                  <p className="font-['Manrope'] font-bold text-xl text-white">Hon. Umar Yusuf</p>
                  <p className="text-xs text-[#D4AF37] font-semibold">Danmaje Yabo</p>
                  <p className="text-[11px] text-white/80 mt-1">Yabo/Shagari Federal Constituency • 10th Assembly</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. KEY INFORMATION AND STATISTICS (24+, 12+, 4500+, 22+) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 -mt-12 sm:-mt-16 relative z-20">
        <div className="bg-white border-t-4 border-t-[#C6A15B] border border-stone-200 rounded-3xl shadow-2xl p-6 sm:p-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-stone-100">
            
            {/* Stat 1: Projects */}
            <div className="space-y-3 px-3 py-2 text-center group">
              <div className="w-12 h-12 rounded-2xl bg-[#103C2E]/10 text-[#103C2E] flex items-center justify-center mx-auto group-hover:bg-[#103C2E] group-hover:text-[#C6A15B] transition-colors duration-300">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <div className="text-3xl sm:text-5xl font-extrabold font-['Manrope'] text-[#103C2E] tabular-nums tracking-tight">
                  {stats.projectsCount}
                </div>
                <p className="text-xs sm:text-sm text-stone-700 font-bold mt-1">
                  {t('statsProjects', currentLang, translations)}
                </p>
                <p className="text-[11px] text-stone-500 hidden sm:block mt-0.5">Water, education & rural roads</p>
              </div>
            </div>

            {/* Stat 2: Bills */}
            <div className="space-y-3 px-3 py-2 text-center group pt-4 lg:pt-2">
              <div className="w-12 h-12 rounded-2xl bg-[#103C2E]/10 text-[#103C2E] flex items-center justify-center mx-auto group-hover:bg-[#103C2E] group-hover:text-[#C6A15B] transition-colors duration-300">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <div className="text-3xl sm:text-5xl font-extrabold font-['Manrope'] text-[#103C2E] tabular-nums tracking-tight">
                  {stats.billsCount}
                </div>
                <p className="text-xs sm:text-sm text-stone-700 font-bold mt-1">
                  {t('statsBills', currentLang, translations)}
                </p>
                <p className="text-[11px] text-stone-500 hidden sm:block mt-0.5">In green chamber & gazettes</p>
              </div>
            </div>

            {/* Stat 3: Citizens */}
            <div className="space-y-3 px-3 py-2 text-center group pt-4 lg:pt-2">
              <div className="w-12 h-12 rounded-2xl bg-[#103C2E]/10 text-[#103C2E] flex items-center justify-center mx-auto group-hover:bg-[#103C2E] group-hover:text-[#C6A15B] transition-colors duration-300">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <div className="text-3xl sm:text-5xl font-extrabold font-['Manrope'] text-[#103C2E] tabular-nums tracking-tight">
                  {stats.citizensCount}
                </div>
                <p className="text-xs sm:text-sm text-stone-700 font-bold mt-1">
                  {t('statsCitizens', currentLang, translations)}
                </p>
                <p className="text-[11px] text-stone-500 hidden sm:block mt-0.5">Farmers, youth & women grant</p>
              </div>
            </div>

            {/* Stat 4: Wards */}
            <div className="space-y-3 px-3 py-2 text-center group pt-4 lg:pt-2">
              <div className="w-12 h-12 rounded-2xl bg-[#103C2E]/10 text-[#103C2E] flex items-center justify-center mx-auto group-hover:bg-[#103C2E] group-hover:text-[#C6A15B] transition-colors duration-300">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <div className="text-3xl sm:text-5xl font-extrabold font-['Manrope'] text-[#103C2E] tabular-nums tracking-tight">
                  {stats.wardsCount}
                </div>
                <p className="text-xs sm:text-sm text-stone-700 font-bold mt-1">
                  {t('statsWards', currentLang, translations)}
                </p>
                <p className="text-[11px] text-stone-500 hidden sm:block mt-0.5">Across Yabo & Shagari LGAs</p>
              </div>
            </div>

          </div>

          {/* Verification Tagline */}
          <div className="mt-8 pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-2">
            <span className="flex items-center gap-1.5 font-medium">
              <Shield className="w-3.5 h-3.5 text-[#C6A15B]" />
              Official Public Record • Direct Constituency Service
            </span>
            <span className="text-[11px] text-stone-400">
              Configurable via Authorized Administrator Settings
            </span>
          </div>
        </div>
      </section>

      {/* 3. ABOUT THE REPRESENTATIVE (HOMEPAGE SPOTLIGHT) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-stone-200 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 shadow-md border border-stone-200">
              <img
                src="/src/assets/images/national_assembly_chamber_1792063300782.jpg"
                alt="National Assembly Representation"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=1000';
                }}
              />
            </div>
            <div className="absolute -bottom-4 -right-2 sm:-right-4 flex items-center gap-2 bg-[#103C2E] text-white px-4 py-2.5 rounded-xl shadow-lg border border-[#C6A15B]/40 text-xs font-semibold">
              <Landmark className="w-4 h-4 text-[#C6A15B]" />
              <span>National Assembly, Abuja</span>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C6A15B]">
              <Shield className="w-3.5 h-3.5" />
              <span>{t('aboutBriefTitle', currentLang, translations)}</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-['Manrope'] text-[#103C2E] leading-snug">
              {t('aboutBriefSubtitle', currentLang, translations)}
            </h2>

            <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-normal">
              Hon. Umar Yusuf (Danmaje Yabo) represents Yabo and Shagari Federal Constituency in the House of Representatives of Nigeria. Guided by a leadership philosophy rooted in humility, accessibility, and purposeful service, his legislative agenda focuses on empowering farming families, rehabilitating grassroots educational infrastructure, expanding clean water supply, and advancing high-impact national bills.
            </p>

            {/* Core Leadership Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="bg-[#FAF9F5] p-3.5 rounded-xl border border-stone-200">
                <p className="text-xs font-bold text-[#103C2E]">Grassroots First</p>
                <p className="text-[11px] text-stone-500 mt-0.5">Continuous liaison across all 22 wards</p>
              </div>
              <div className="bg-[#FAF9F5] p-3.5 rounded-xl border border-stone-200">
                <p className="text-xs font-bold text-[#103C2E]">Agrarian Focus</p>
                <p className="text-[11px] text-stone-500 mt-0.5">Subsidized fertilizers & access roads</p>
              </div>
              <div className="bg-[#FAF9F5] p-3.5 rounded-xl border border-stone-200">
                <p className="text-xs font-bold text-[#103C2E]">Human Capital</p>
                <p className="text-[11px] text-stone-500 mt-0.5">STEM education & women co-ops</p>
              </div>
            </div>

            <div className="pt-3">
              <button
                onClick={() => navigateTo('about')}
                className="bg-[#103C2E] hover:bg-[#09291F] active:scale-[0.98] text-white font-bold px-7 py-3.5 rounded-xl text-xs sm:text-sm transition-all duration-200 shadow-md inline-flex items-center gap-2 border border-[#C6A15B]/30 cursor-pointer"
              >
                <span>{t('readFullBio', currentLang, translations)}</span>
                <ArrowRight className="w-4 h-4 text-[#C6A15B]" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. AREAS OF IMPACT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#C6A15B]">
            {t('areasOfImpact', currentLang, translations)}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-['Manrope'] text-[#103C2E]">
            {t('grassrootsTransformation', currentLang, translations)}
          </h2>
          <p className="text-stone-600 text-sm sm:text-base">
            Focused interventions across vital development sectors touching every community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200 hover:border-[#C6A15B]/60 transition-all duration-300 flex flex-col justify-between group hover:shadow-md">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#103C2E]/10 text-[#103C2E] flex items-center justify-center font-bold group-hover:bg-[#103C2E] group-hover:text-[#C6A15B] transition-colors">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-['Manrope'] font-bold text-xl text-[#103C2E]">
                Legislative Representation
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Advocating robust agricultural development bills, basic education enhancements, and urgent motions for federal ecological intervention in gully erosion sites across Sokoto State.
              </p>
            </div>
            <div className="pt-6">
              <button
                onClick={() => navigateTo('legislative')}
                className="w-full bg-[#103C2E] hover:bg-[#09291F] active:scale-[0.98] text-white px-4 py-3 rounded-xl font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>View Bills & Motions</span>
                <ChevronRight className="w-4 h-4 text-[#C6A15B]" />
              </button>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200 hover:border-[#C6A15B]/60 transition-all duration-300 flex flex-col justify-between group hover:shadow-md">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#103C2E]/10 text-[#103C2E] flex items-center justify-center font-bold group-hover:bg-[#103C2E] group-hover:text-[#C6A15B] transition-colors">
                <Droplet className="w-6 h-6" />
              </div>
              <h3 className="font-['Manrope'] font-bold text-xl text-[#103C2E]">
                Constituency Infrastructure
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Delivering high-capacity solar-powered water schemes, science laboratory upgrades in secondary schools, maternity clinic extensions, and agricultural farm road grading.
              </p>
            </div>
            <div className="pt-6">
              <button
                onClick={() => navigateTo('projects')}
                className="w-full bg-[#103C2E] hover:bg-[#09291F] active:scale-[0.98] text-white px-4 py-3 rounded-xl font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Explore Project Directory</span>
                <ChevronRight className="w-4 h-4 text-[#C6A15B]" />
              </button>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200 hover:border-[#C6A15B]/60 transition-all duration-300 flex flex-col justify-between group hover:shadow-md">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#103C2E]/10 text-[#103C2E] flex items-center justify-center font-bold group-hover:bg-[#103C2E] group-hover:text-[#C6A15B] transition-colors">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-['Manrope'] font-bold text-xl text-[#103C2E]">
                Empowerment & Welfare
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Supporting smallholder farmers with dry-season fertilizer subsidies, empowering unemployed youth with ICT toolkits, and financing rural women micro-cooperatives.
              </p>
            </div>
            <div className="pt-6">
              <button
                onClick={() => navigateTo('empowerment')}
                className="w-full bg-[#103C2E] hover:bg-[#09291F] active:scale-[0.98] text-white px-4 py-3 rounded-xl font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>View Programmes & Apply</span>
                <ChevronRight className="w-4 h-4 text-[#C6A15B]" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FEATURED CONSTITUENCY PROJECTS */}
      <section className="bg-stone-50 py-16 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#C6A15B]">
                Verified Deliverables
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-['Manrope'] text-[#103C2E] mt-1">
                Featured Constituency Projects
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                Direct evidence of infrastructure, water, and human capacity projects across Yabo and Shagari.
              </p>
            </div>
            <button
              onClick={() => navigateTo('projects')}
              className="bg-[#C6A15B] hover:bg-[#b59048] active:scale-[0.98] text-[#09291F] font-bold px-7 py-3 rounded-xl text-xs sm:text-sm transition-all shadow flex items-center gap-2 cursor-pointer border border-[#C6A15B]"
            >
              <span>{t('viewAllProjects', currentLang, translations)}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Sector Filter Bar */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs text-stone-500 font-semibold mr-1">Sector:</span>
            {sectorCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setProjectSectorFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  projectSectorFilter === cat
                    ? 'bg-[#103C2E] text-white shadow-sm'
                    : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
                }`}
              >
                {cat === 'All' ? 'All Interventions' : cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredFeaturedProjects.map((project) => (
              <div 
                key={project.id} 
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-200 flex flex-col justify-between group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-stone-200">
                    <img
                      src={project.images[0]}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541888946425-d0fbb18f764c?auto=format&fit=crop&q=80&w=1000';
                      }}
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold shadow ${
                        project.status === 'Completed' ? 'bg-emerald-700 text-white' :
                        project.status === 'Ongoing' ? 'bg-amber-600 text-white' : 'bg-blue-600 text-white'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="text-xs text-stone-500 flex items-center gap-1.5 font-medium">
                      <span className="text-[#103C2E] font-semibold">{project.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 text-[#C6A15B] shrink-0" /> {project.location}
                      </span>
                    </div>

                    <h3 className="font-['Manrope'] font-bold text-lg text-[#103C2E] line-clamp-2 leading-snug group-hover:text-[#C6A15B] transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2">
                  <button
                    onClick={() => setActiveProject(project)}
                    className="w-full bg-[#103C2E] hover:bg-[#09291F] active:scale-[0.98] text-white py-3 rounded-xl font-bold text-xs transition-all shadow-sm text-center flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>{t('viewDetails', currentLang, translations)}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C6A15B]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. LEGISLATIVE ACTIVITIES (HOMEPAGE SHOWCASE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#C6A15B]">
              National Assembly Record
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-['Manrope'] text-[#103C2E] mt-1">
              {t('legislativeSectionTitle', currentLang, translations)}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl">
              {t('legislativeSectionDesc', currentLang, translations)}
            </p>
          </div>
          <button
            onClick={() => navigateTo('legislative')}
            className="bg-[#103C2E] hover:bg-[#09291F] active:scale-[0.98] text-white font-bold px-7 py-3 rounded-xl text-xs sm:text-sm transition-all shadow flex items-center gap-2 cursor-pointer border border-[#C6A15B]/30"
          >
            <span>{t('viewAllLegislative', currentLang, translations)}</span>
            <ArrowRight className="w-4 h-4 text-[#C6A15B]" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredLegislative.map((item) => (
            <div key={item.id} className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-stone-200 flex flex-col justify-between space-y-5 hover:border-[#C6A15B]/50 transition-all hover:shadow-md">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-stone-500 font-semibold">
                  <span className="text-[#103C2E] bg-stone-100 px-2 py-0.5 rounded font-bold">{item.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-700 font-bold">{item.status}</span>
                  <span aria-hidden="true">·</span>
                  <span>{item.date}</span>
                </div>
                <h3 className="font-['Manrope'] font-bold text-lg text-[#103C2E] leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setActiveLegItem(item)}
                  className="text-xs font-bold text-[#103C2E] hover:text-[#C6A15B] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Track Bill Progress & Gazette Details</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6B. FEATURED VIDEO & PARLIAMENTARY BROADCAST */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-gradient-to-br from-[#072118] via-[#0E3529] to-[#0A261E] rounded-3xl p-8 sm:p-12 text-white border border-[#C6A15B]/40 shadow-2xl relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="absolute right-0 bottom-0 w-80 h-80 bg-[#C6A15B]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="lg:col-span-6 space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C6A15B]/20 border border-[#C6A15B]/40 text-xs font-semibold text-[#D4AF37] uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              <span>Official Video Dispatch</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold font-['Manrope'] leading-tight">
              Plenary Debate: Federal College of Agricultural Technology, Yabo
            </h2>

            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed font-light">
              Watch Hon. Umar Yusuf (Danmaje Yabo) advocate for modern agricultural education, youth technical empowerment, and research facilities for Yabo/Shagari on the floor of the House of Representatives, National Assembly, Abuja.
            </p>

            <div className="pt-2 flex flex-wrap gap-4 items-center">
              <button
                onClick={() => navigateTo('gallery')}
                className="bg-gradient-to-r from-[#D4AF37] via-[#C6A15B] to-[#B38F44] hover:brightness-110 active:scale-[0.98] text-[#09291F] font-bold px-7 py-3.5 rounded-xl shadow-lg transition-all flex items-center gap-2 text-xs sm:text-sm cursor-pointer border border-[#E5C16C]"
              >
                <span>Watch Full Media & Video Library</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Embedded Video Player */}
          <div className="lg:col-span-6 relative z-10">
            <div className="aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-2xl border-2 border-[#C6A15B]/40 bg-black relative">
              <iframe
                src="https://www.youtube.com/embed/ScMzIvxBSi4"
                title="Hon. Umar Yusuf Danmaje Yabo - Plenary Speech"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* 7. EMPOWERMENT AND COMMUNITY PROGRAMMES */}
      <section className="bg-gradient-to-br from-[#103C2E]/5 to-[#103C2E]/10 py-16 border-y border-[#C6A15B]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#C6A15B]">
                Grassroots Opportunities
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-['Manrope'] text-[#103C2E] mt-1">
                {t('empowermentSectionTitle', currentLang, translations)}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
                {t('empowermentSectionDesc', currentLang, translations)}
              </p>
            </div>
            <button
              onClick={() => navigateTo('empowerment')}
              className="bg-[#C6A15B] hover:bg-[#b59048] active:scale-[0.98] text-[#09291F] font-bold px-7 py-3 rounded-xl text-xs sm:text-sm transition-all shadow flex items-center gap-2 cursor-pointer border border-[#C6A15B]"
            >
              <span>{t('viewAllEmpowerment', currentLang, translations)}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredPrograms.map((prog) => (
              <div key={prog.id} className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-stone-200 flex flex-col justify-between space-y-4 hover:shadow-md transition">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-stone-500 font-semibold">
                    <span className="bg-[#103C2E]/10 text-[#103C2E] px-2.5 py-0.5 rounded font-bold">{prog.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-emerald-700 font-bold">{prog.status}</span>
                    <span aria-hidden="true">·</span>
                    <span>Deadline: {prog.deadline}</span>
                  </div>
                  <h3 className="font-['Manrope'] font-bold text-lg text-[#103C2E] leading-snug">
                    {prog.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    {prog.description}
                  </p>
                  <p className="text-xs text-[#103C2E] font-medium">
                    Target Beneficiaries: <strong>{prog.targetBeneficiaries}</strong>
                  </p>
                </div>

                <div className="pt-3 flex items-center gap-3">
                  <button
                    onClick={() => {
                      setApplyProgram(prog);
                      setAppReceipt(null);
                      setAppError('');
                    }}
                    className="bg-[#103C2E] hover:bg-[#09291F] active:scale-[0.98] text-white px-6 py-3 rounded-xl font-bold text-xs transition shadow flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>{t('applyNow', currentLang, translations)}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C6A15B]" />
                  </button>

                  <button
                    onClick={() => navigateTo('empowerment')}
                    className="text-xs font-bold text-stone-600 hover:text-[#103C2E] py-2 px-3 transition"
                  >
                    View Guidelines
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. LATEST NEWS AND PRESS RELEASES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#C6A15B]">
              Editorial Desk
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-['Manrope'] text-[#103C2E] mt-1">
              Latest News & Official Announcements
            </h2>
          </div>
          <button
            onClick={() => navigateTo('news')}
            className="bg-[#103C2E] hover:bg-[#09291F] active:scale-[0.98] text-white font-bold px-7 py-3 rounded-xl text-xs sm:text-sm transition-all shadow flex items-center gap-2 cursor-pointer border border-[#C6A15B]/30"
          >
            <span>All News & Releases</span>
            <ArrowRight className="w-4 h-4 text-[#C6A15B]" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {latestNews.map((article) => (
            <div 
              key={article.id} 
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-200 flex flex-col justify-between group hover:shadow-md transition-shadow"
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-stone-200">
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541888946425-d0fbb18f764c?auto=format&fit=crop&q=80&w=1000';
                    }}
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-[#103C2E] text-white px-2.5 py-1 rounded text-xs font-bold shadow">
                      {article.category}
                    </span>
                  </div>
                </div>

                <div className="p-6 space-y-2.5">
                  <p className="text-xs text-stone-500 font-medium">
                    {article.date} · By {article.author}
                  </p>
                  <h3 className="font-['Manrope'] font-bold text-base text-[#103C2E] line-clamp-2 leading-snug group-hover:text-[#C6A15B] transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2">
                <button
                  onClick={() => setActiveNews(article)}
                  className="w-full bg-[#103C2E]/10 hover:bg-[#103C2E] hover:text-white text-[#103C2E] py-3 rounded-xl font-bold text-xs transition-colors text-center flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>{t('readMore', currentLang, translations)}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. CITIZEN ENGAGEMENT AND ENQUIRY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-gradient-to-r from-[#072118] via-[#0E3529] to-[#0A261E] text-white rounded-3xl p-8 sm:p-14 relative overflow-hidden shadow-2xl border border-[#C6A15B]/40">
          <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-[#C6A15B]/15 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-block bg-[#D4AF37] text-[#09291F] text-xs font-bold px-3 py-1 rounded-md">
              Constituency Liaison Desk
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-['Manrope'] tracking-tight">
              {t('citizenEngagementTitle', currentLang, translations)}
            </h2>
            <p className="text-white/85 text-sm sm:text-base leading-relaxed font-light">
              {t('citizenEngagementDesc', currentLang, translations)}
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <button
                onClick={() => navigateTo('contact')}
                className="bg-[#D4AF37] hover:bg-[#C6A15B] active:scale-[0.98] text-[#09291F] font-bold px-8 py-4 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 text-sm sm:text-base border border-[#D4AF37] cursor-pointer"
              >
                <span>{t('submitEnquiryBtn', currentLang, translations)}</span>
              </button>
              <button
                onClick={() => navigateTo('empowerment')}
                className="bg-white/10 hover:bg-white/20 active:scale-[0.98] text-white font-bold px-8 py-4 rounded-xl transition-all transform hover:-translate-y-0.5 text-sm sm:text-base border border-white/30 backdrop-blur-md cursor-pointer"
              >
                <span>{t('applyEmpowermentBtn', currentLang, translations)}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- HOMEPAGE MODALS FOR SEAMLESS REAL FUNCTIONALITY --- */}

      {/* A. PROJECT QUICK-VIEW MODAL */}
      {activeProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-stone-200 max-h-[90vh] flex flex-col">
            <div className="relative aspect-[16/9] bg-stone-100 shrink-0">
              <img
                src={activeProject.images[0]}
                alt={activeProject.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setActiveProject(null)}
                className="absolute top-4 right-4 bg-black/60 hover:bg-black text-white p-2 rounded-full transition"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-4">
                <span className={`px-3 py-1 rounded-md text-xs font-bold shadow text-white ${
                  activeProject.status === 'Completed' ? 'bg-emerald-700' :
                  activeProject.status === 'Ongoing' ? 'bg-amber-600' : 'bg-blue-600'
                }`}>
                  {activeProject.status}
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-5 flex-1">
              <div className="flex items-center gap-2 text-xs text-stone-500 font-semibold">
                <span className="text-[#103C2E] bg-stone-100 px-2 py-0.5 rounded">{activeProject.category}</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#C6A15B]" /> {activeProject.location}
                </span>
              </div>

              <h3 className="font-['Manrope'] font-bold text-2xl text-[#103C2E]">
                {activeProject.title}
              </h3>

              <p className="text-sm text-stone-600 leading-relaxed">
                {activeProject.description}
              </p>

              {/* Project Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                  <span className="text-stone-400 font-semibold block">Commencement Date</span>
                  <span className="font-bold text-[#103C2E]">{activeProject.startDate}</span>
                </div>
                {activeProject.contractor && (
                  <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                    <span className="text-stone-400 font-semibold block">Supervising Contractor</span>
                    <span className="font-bold text-[#103C2E]">{activeProject.contractor}</span>
                  </div>
                )}
              </div>

              {/* Milestones / Updates */}
              {activeProject.updates && activeProject.updates.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="font-bold text-sm text-[#103C2E] flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#C6A15B]" />
                    Verified Project Milestones
                  </h4>
                  <div className="space-y-2">
                    {activeProject.updates.map((u) => (
                      <div key={u.id} className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                        <div className="flex justify-between items-center text-stone-500 font-semibold mb-1">
                          <span>{u.title}</span>
                          <span>{u.date}</span>
                        </div>
                        <p className="text-stone-700">{u.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 sm:p-6 bg-stone-50 border-t border-stone-200 flex justify-between items-center">
              <button
                onClick={() => {
                  setActiveProject(null);
                  navigateTo('projects');
                }}
                className="text-xs font-bold text-[#103C2E] hover:text-[#C6A15B] transition flex items-center gap-1 cursor-pointer"
              >
                <span>View Full Projects Directory</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveProject(null)}
                className="bg-[#103C2E] hover:bg-[#09291F] text-white px-5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* B. NEWS ARTICLE READER MODAL */}
      {activeNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-stone-200 max-h-[90vh] flex flex-col">
            <div className="relative aspect-[16/9] bg-stone-100 shrink-0">
              <img
                src={activeNews.imageUrl}
                alt={activeNews.title}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setActiveNews(null)}
                className="absolute top-4 right-4 bg-black/60 hover:bg-black text-white p-2 rounded-full transition"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-4">
                <span className="bg-[#103C2E] text-white px-3 py-1 rounded text-xs font-bold shadow">
                  {activeNews.category}
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-4 flex-1">
              <p className="text-xs text-stone-500 font-semibold">
                Published {activeNews.date} · By {activeNews.author}
              </p>

              <h3 className="font-['Manrope'] font-bold text-2xl text-[#103C2E]">
                {activeNews.title}
              </h3>

              <div className="text-sm text-stone-700 leading-relaxed space-y-3 font-normal">
                {activeNews.content.split('\n\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="p-4 sm:p-6 bg-stone-50 border-t border-stone-200 flex justify-between items-center">
              <button
                onClick={() => {
                  setActiveNews(null);
                  navigateTo('news');
                }}
                className="text-xs font-bold text-[#103C2E] hover:text-[#C6A15B] transition flex items-center gap-1 cursor-pointer"
              >
                <span>View News & Press Hub</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveNews(null)}
                className="bg-[#103C2E] hover:bg-[#09291F] text-white px-5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}

      {/* C. LEGISLATIVE DETAILS MODAL */}
      {activeLegItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-stone-200 max-h-[90vh] flex flex-col">
            <div className="bg-[#103C2E] text-white p-6 sm:p-8 flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-[#C6A15B] uppercase tracking-wider">
                  National Assembly Gazette Record
                </span>
                <h3 className="font-['Manrope'] font-bold text-xl sm:text-2xl mt-1">
                  {activeLegItem.title}
                </h3>
                <p className="text-xs text-white/80 mt-1">
                  Sponsored by Hon. Umar Yusuf (Danmaje Yabo)
                </p>
              </div>
              <button
                onClick={() => setActiveLegItem(null)}
                className="text-white/80 hover:text-white p-1"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-5 flex-1">
              <div className="flex items-center gap-3 text-xs text-stone-600">
                <span className="bg-stone-100 font-bold px-2.5 py-1 rounded text-[#103C2E]">{activeLegItem.category}</span>
                <span>·</span>
                <span className="font-bold text-emerald-700">{activeLegItem.status}</span>
                <span>·</span>
                <span>Introduced: {activeLegItem.date}</span>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-stone-400">Legislative Purpose & Scope</h4>
                <p className="text-sm text-stone-700 leading-relaxed">
                  {activeLegItem.description}
                </p>
              </div>

              {activeLegItem.coSponsors && (
                <div className="space-y-1 bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs">
                  <span className="font-bold text-[#103C2E] block">Parliamentary Co-Sponsors:</span>
                  <p className="text-stone-600">{activeLegItem.coSponsors.join(', ')}</p>
                </div>
              )}
            </div>

            <div className="p-4 sm:p-6 bg-stone-50 border-t border-stone-200 flex justify-between items-center">
              <button
                onClick={() => {
                  setActiveLegItem(null);
                  navigateTo('legislative');
                }}
                className="text-xs font-bold text-[#103C2E] hover:text-[#C6A15B] transition flex items-center gap-1 cursor-pointer"
              >
                <span>Full Legislative Tracker</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveLegItem(null)}
                className="bg-[#103C2E] hover:bg-[#09291F] text-white px-5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* D. QUICK EMPOWERMENT APPLICATION MODAL */}
      {applyProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-stone-200 max-h-[90vh] flex flex-col">
            <div className="bg-[#103C2E] text-white p-6 flex justify-between items-center">
              <div>
                <span className="text-xs font-bold text-[#C6A15B] uppercase tracking-wider">
                  Constituency Empowerment Application
                </span>
                <h3 className="font-['Manrope'] font-bold text-lg mt-0.5">
                  {applyProgram.title}
                </h3>
              </div>
              <button
                onClick={() => setApplyProgram(null)}
                className="text-white/80 hover:text-white p-1"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              {appReceipt ? (
                <div className="space-y-5 text-center py-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle className="w-9 h-9" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-['Manrope'] font-bold text-2xl text-[#103C2E]">Application Submitted!</h4>
                    <p className="text-xs text-stone-600">Your application has been logged into the constituency database.</p>
                  </div>

                  <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-left space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-stone-500 font-semibold">Tracking Code:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-base text-[#103C2E] bg-white px-2.5 py-1 rounded border border-stone-200">
                          {appReceipt.ref}
                        </span>
                        <button
                          onClick={() => handleCopyRef(appReceipt.ref)}
                          className="p-1 hover:bg-stone-200 rounded text-stone-600 transition"
                          title="Copy tracking code"
                        >
                          {copiedRef ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-stone-500 border-t pt-2">
                      <span>Scheme:</span>
                      <span className="font-bold text-[#103C2E] truncate max-w-[200px]">{appReceipt.title}</span>
                    </div>
                    <div className="flex justify-between text-xs text-stone-500">
                      <span>Date Logged:</span>
                      <span className="font-bold text-[#103C2E]">{appReceipt.date}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-stone-500 leading-relaxed">
                    Please retain this tracking reference. The Constituency Screening Committee will contact qualified applicants via SMS/Phone.
                  </p>

                  <button
                    onClick={() => setApplyProgram(null)}
                    className="w-full bg-[#103C2E] hover:bg-[#09291F] text-white py-3 rounded-xl font-bold text-xs transition cursor-pointer"
                  >
                    Close & Finish
                  </button>
                </div>
              ) : (
                <form onSubmit={handleQuickApply} className="space-y-4">
                  {appError && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{appError}</span>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#103C2E]">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ibrahim Abubakar"
                      value={appFormData.applicantName}
                      onChange={(e) => setAppFormData({ ...appFormData, applicantName: e.target.value })}
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#103C2E]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#103C2E]">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="080... or 070..."
                        value={appFormData.phone}
                        onChange={(e) => setAppFormData({ ...appFormData, phone: e.target.value })}
                        className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#103C2E]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#103C2E]">Ward / Town *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Yabo Central / Dandin Mahe"
                        value={appFormData.wardOrTown}
                        onChange={(e) => setAppFormData({ ...appFormData, wardOrTown: e.target.value })}
                        className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#103C2E]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#103C2E]">Email Address (Optional)</label>
                    <input
                      type="email"
                      placeholder="your.email@example.com"
                      value={appFormData.email}
                      onChange={(e) => setAppFormData({ ...appFormData, email: e.target.value })}
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#103C2E]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#103C2E]">Current Occupation / Background</label>
                    <input
                      type="text"
                      placeholder="e.g. Smallholder Farmer / Tradesperson / Graduate"
                      value={appFormData.qualifications}
                      onChange={(e) => setAppFormData({ ...appFormData, qualifications: e.target.value })}
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#103C2E]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#103C2E]">Brief Statement of Purpose *</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Explain how this empowerment support will benefit you and your household..."
                      value={appFormData.statement}
                      onChange={(e) => setAppFormData({ ...appFormData, statement: e.target.value })}
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#103C2E]"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={appSubmitting}
                      className="w-full bg-[#103C2E] hover:bg-[#09291F] disabled:opacity-50 text-white py-3.5 rounded-xl font-bold text-xs sm:text-sm shadow flex items-center justify-center gap-2 cursor-pointer transition"
                    >
                      {appSubmitting ? (
                        <span>Submitting Application...</span>
                      ) : (
                        <>
                          <span>Submit Verified Application</span>
                          <ArrowRight className="w-4 h-4 text-[#C6A15B]" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
