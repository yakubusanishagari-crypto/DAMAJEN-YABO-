import React, { useState } from 'react';
import { 
  Award, BookOpen, Briefcase, CheckCircle, GraduationCap, Shield, User, Users,
  Landmark, ArrowRight, Target, Compass, HeartHandshake, MapPin, 
  Calendar, ChevronRight, FileText, Sparkles, Building2, Phone, Mail,
  Check, ExternalLink, HelpCircle
} from 'lucide-react';
import { Language, t, Translations } from '../utils/i18n';
import { OfficialCrest } from '../components/OfficialCrest';

interface Props {
  setCurrentTab: (tab: string) => void;
  currentLang: Language;
  translations: Translations;
}

export const BiographyPage: React.FC<Props> = ({ setCurrentTab, currentLang, translations }) => {
  const [activeBioSection, setActiveBioSection] = useState<'all' | 'profile' | 'education' | 'journey' | 'legislative' | 'service' | 'achievements'>('all');

  const navigateTo = (tab: string) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isRTL = currentLang === 'ar';

  // Verified Parliamentary Facts
  const facts = [
    {
      label: currentLang === 'ha' ? 'Cikakken Suna:' : isRTL ? 'الاسم الكامل:' : 'Full Name:',
      value: isRTL ? 'النائب عمر يوسف (دانماجي يابو)' : 'Hon. Umar Yusuf (Danmaje Yabo)'
    },
    {
      label: currentLang === 'ha' ? 'Kujerar Majalisa:' : isRTL ? 'المنصب النيابي:' : 'Parliamentary Mandate:',
      value: currentLang === 'ha' ? 'Majalisar Wakilai ta Tarayya' : isRTL ? 'مجلس النواب، الجمعية الوطنية' : 'Member, House of Representatives'
    },
    {
      label: currentLang === 'ha' ? 'Mazabar Tarayya:' : isRTL ? 'الدائرة الانتخابية:' : 'Federal Constituency:',
      value: currentLang === 'ha' ? 'Yabo da Shagari (Jihar Sakkwato)' : isRTL ? 'دائرة يابو وشاغاري (ولاية سوكوتو)' : 'Yabo / Shagari (Sokoto State)'
    },
    {
      label: currentLang === 'ha' ? 'Majalisa:' : isRTL ? 'الدورة البرلمانية:' : 'Assembly Standing:',
      value: currentLang === 'ha' ? 'Majalisa ta 10 ta Kasa' : isRTL ? 'الجمعية الوطنية العاشرة' : '10th National Assembly'
    },
    {
      label: currentLang === 'ha' ? 'Gundumomi:' : isRTL ? 'الدوائر الممثلة:' : 'Wards Represented:',
      value: currentLang === 'ha' ? 'Gundumomi 22 (Yabo 11 & Shagari 11)' : isRTL ? '22 دائرة محلية (11 يابو و11 شاغاري)' : '22 Wards (11 Yabo & 11 Shagari)'
    },
    {
      label: currentLang === 'ha' ? 'Jiha da Kasa:' : isRTL ? 'الولاية والدولة:' : 'State & Nation:',
      value: currentLang === 'ha' ? 'Jihar Sakkwato, Najeriya' : isRTL ? 'ولاية سوكوتو، جمهورية نيجيريا الفيدرالية' : 'Sokoto State, Federal Republic of Nigeria'
    },
    {
      label: currentLang === 'ha' ? 'Ofishin Majalisa:' : isRTL ? 'المكتب البرلماني:' : 'Parliamentary Complex:',
      value: currentLang === 'ha' ? 'Three Arms Zone, Abuja' : isRTL ? 'مجمع الأذرع الثلاثة، أبوجا' : 'Green Chamber, Three Arms Zone, Abuja'
    }
  ];

  // Verified Parliamentary Committees
  const committees = [
    {
      en: 'Agricultural Colleges, Institutions & Research',
      ha: 'Kwalejojin Noma da Cibiyoyin Bincike',
      ar: 'كليات ومعاهد البحوث الزراعية'
    },
    {
      en: 'Water Resources & Rural Water Development',
      ha: 'Albarkatun Ruwa da Bunkasa Ruwan Karkara',
      ar: 'الموارد المائية والتنمية المائية الريفية'
    },
    {
      en: 'Basic Education & Services Enhancement',
      ha: 'Inganta Ilimin Bai-Daya da Ayyuka',
      ar: 'تطوير التعليم الأساسي والخدمات'
    },
    {
      en: 'Ecological Fund & Soil Erosion Control',
      ha: 'Asusun Muhalli da Kariya Daga Zaizayar Kasa',
      ar: 'صندوق البيئة ومكافحة انجراف التربة'
    }
  ];

  // Quick navigation tabs
  const bioTabs = [
    { id: 'all', label: currentLang === 'ha' ? 'DUK BAYANAI' : isRTL ? 'جميع الأقسام' : 'ALL SECTIONS' },
    { id: 'profile', label: currentLang === 'ha' ? 'TARIHIN RAYUWA' : isRTL ? 'الملف الشخصي' : 'PERSONAL PROFILE' },
    { id: 'education', label: currentLang === 'ha' ? 'ILIMI' : isRTL ? 'المسار التعليمي' : 'EDUCATION' },
    { id: 'journey', label: currentLang === 'ha' ? 'SIYASA' : isRTL ? 'المسيرة السياسية' : 'POLITICAL JOURNEY' },
    { id: 'legislative', label: currentLang === 'ha' ? 'MAJALISA' : isRTL ? 'المهام البرلمانية' : 'LEGISLATIVE ROLES' },
    { id: 'service', label: currentLang === 'ha' ? 'HIDIMA GA AL\'UMMA' : isRTL ? 'الخدمة العامة' : 'PUBLIC SERVICE' },
    { id: 'achievements', label: currentLang === 'ha' ? 'AYYUKAN NASARA' : isRTL ? 'الإنجازات الموثقة' : 'ACHIEVEMENTS' },
  ];

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12 overflow-x-hidden ${isRTL ? 'rtl font-serif' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* 1. EXECUTIVE BIOGRAPHY HERO BANNER */}
      <section className="relative bg-gradient-to-br from-[#072118] via-[#0E3529] to-[#0A261E] text-white rounded-3xl p-6 sm:p-10 lg:p-14 shadow-2xl overflow-hidden border border-emerald-500/30">
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Text & Representative Overview */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-900/60 border border-emerald-500/40 text-xs font-semibold text-emerald-200 tracking-wider uppercase">
              <OfficialCrest size="sm" className="w-5 h-5 shrink-0" />
              <span>{t('biography', currentLang, translations).toUpperCase()}</span>
              <span className="text-white/40">·</span>
              <span className="text-white/80 font-medium">10TH NATIONAL ASSEMBLY</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-['Manrope'] tracking-tight leading-[1.12]">
                Hon. Umar Yusuf
                <span className="block text-[#D4AF37] text-2xl sm:text-4xl lg:text-5xl font-semibold mt-1">
                  (Danmaje Yabo)
                </span>
              </h1>
              
              <p className="text-base sm:text-xl text-emerald-100 font-medium pt-1">
                {t('constituencyTitle', currentLang, translations)}
              </p>

              <div className="flex items-center gap-2 text-xs sm:text-sm text-[#C6A15B] font-semibold">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>{t('constituencySubtitle', currentLang, translations)}</span>
              </div>
            </div>

            <p className="text-sm sm:text-base text-white/85 font-normal leading-relaxed max-w-2xl">
              {t('heroDescription', currentLang, translations)}
            </p>

            {/* Prominent Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-3">
              <button
                onClick={() => navigateTo('contact')}
                className="bg-gradient-to-r from-[#D4AF37] via-[#C6A15B] to-[#B38F44] hover:brightness-110 active:scale-[0.98] text-[#09291F] font-black px-8 py-4 rounded-xl shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 flex items-center gap-2.5 text-xs sm:text-sm border border-[#E5C16C] cursor-pointer uppercase tracking-wider"
              >
                <Phone className="w-4 h-4 shrink-0 text-[#09291F]" />
                <span>{t('contactOffice', currentLang, translations).toUpperCase()}</span>
              </button>

              <button
                onClick={() => navigateTo('projects')}
                className="bg-emerald-700/80 hover:bg-emerald-600 active:scale-[0.98] text-white border border-emerald-500/60 font-bold px-6 py-4 rounded-xl transition-all duration-200 flex items-center gap-2 text-xs sm:text-sm shadow-lg cursor-pointer uppercase tracking-wider"
              >
                <span>{t('exploreProjects', currentLang, translations).toUpperCase()}</span>
                <ArrowRight className={`w-4 h-4 shrink-0 ${isRTL ? 'rotate-180' : ''}`} />
              </button>

              <button
                onClick={() => navigateTo('legislative')}
                className="bg-[#0A261E] hover:bg-[#103C2E] active:scale-[0.98] text-[#D4AF37] border border-[#C6A15B]/60 font-black px-7 py-4 rounded-xl shadow-lg transition-all duration-200 text-xs sm:text-sm cursor-pointer uppercase tracking-wider"
              >
                <span>{t('legislative', currentLang, translations).toUpperCase()}</span>
              </button>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-white/70">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Federal Representation</span>
              </span>
              <span>·</span>
              <span>Serving Yabo LGA & Shagari LGA</span>
              <span>·</span>
              <span>10th National Assembly, Abuja</span>
            </div>
          </div>

          {/* Prominent Official Photograph Presentation */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm sm:max-w-md">
              <div className="absolute -inset-3 bg-gradient-to-tr from-[#C6A15B]/30 via-emerald-600/20 to-[#C6A15B]/40 rounded-3xl blur-2xl opacity-75"></div>
              
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-[#C6A15B]/70 ring-4 ring-[#09291F]/90 bg-[#09291F] aspect-[3/4] group">
                <div className="absolute top-3.5 left-3.5 z-20 flex items-center gap-2 bg-[#061B14]/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#D4AF37]/60 shadow-xl">
                  <img src="/official_logo.png" alt="Official Seal" className="w-5 h-5 rounded-full object-contain" />
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-200">National Assembly</span>
                </div>

                <img
                  src="/portrait_danmaje_yabo_1792063283391.jpg"
                  alt="Hon. Umar Yusuf Danmaje Yabo - Official Portrait"
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/official_representative.jpg';
                  }}
                />

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#061B14] via-[#09291F]/90 to-transparent p-5 text-white text-center border-t border-emerald-500/30">
                  <span className="text-[11px] uppercase tracking-widest text-emerald-300 font-black">HON. UMAR YUSUF (DANMAJE YABO)</span>
                  <p className="font-['Manrope'] font-bold text-sm text-white mt-0.5">
                    {currentLang === 'ha' ? 'Dan Majalisar Wakilai ta Kasa' : isRTL ? 'عضو مجلس النواب بالبرلمان الفيدرالي' : 'Federal Lawmaker • Yabo/Shagari'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION FILTER NAVIGATION PILLS */}
      <div className="flex flex-wrap items-center justify-center gap-2 border-b border-stone-200 pb-4">
        {bioTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveBioSection(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeBioSection === tab.id
                ? 'bg-[#103C2E] text-white shadow-md'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 2. EXECUTIVE PROFILE AND FACT CARD GRID */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Official Summary Card & Committees */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border border-stone-200 p-6 sm:p-7 space-y-5">
            <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
              <img src="/official_logo.png" alt="Official Seal" className="w-11 h-11 rounded-full border border-[#D4AF37] object-contain shadow-sm shrink-0" />
              <div>
                <h3 className="font-['Manrope'] font-bold text-base text-[#103C2E] uppercase">
                  {t('execFactsTitle', currentLang, translations)}
                </h3>
                <span className="text-[11px] text-stone-500">Official Parliamentary Credentials</span>
              </div>
            </div>

            <div className="space-y-3.5 text-xs text-stone-700">
              {facts.map((fact, idx) => (
                <div key={idx} className="flex justify-between items-start py-1.5 border-b border-stone-100 last:border-b-0 gap-3">
                  <span className="text-stone-500 font-semibold shrink-0">{fact.label}</span>
                  <span className="font-bold text-[#103C2E] text-right">{fact.value}</span>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={() => navigateTo('contact')}
                className="w-full bg-[#103C2E] hover:bg-[#09291F] text-white font-bold py-3 px-4 rounded-xl text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-sm uppercase tracking-wider"
              >
                <Mail className="w-4 h-4 text-[#C6A15B]" />
                <span>{t('contactOffice', currentLang, translations).toUpperCase()}</span>
              </button>
            </div>
          </div>

          {/* Committee Assignments Card */}
          <div className="bg-white rounded-3xl shadow-sm border border-stone-200 p-6 sm:p-7 space-y-4">
            <h3 className="font-['Manrope'] font-bold text-base text-[#103C2E] flex items-center gap-2 uppercase">
              <Landmark className="w-5 h-5 text-[#C6A15B]" />
              <span>{t('committeeAssignments', currentLang, translations)}</span>
            </h3>
            <ul className="space-y-3 text-xs text-stone-700">
              {committees.map((comm, idx) => (
                <li key={idx} className="flex items-start gap-2.5 p-2 rounded-xl bg-stone-50 border border-stone-100">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="font-medium">{comm[currentLang] || comm.en}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Core Mandate Pillar Badge */}
          <div className="bg-gradient-to-br from-[#0A3D2E] to-[#103C2E] text-white rounded-3xl p-6 border border-emerald-500/30 space-y-3 shadow-md">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-300">
              {currentLang === 'ha' ? 'MANUFAR AIKI' : isRTL ? 'العهد النيابي' : 'REPRESENTATION CREED'}
            </span>
            <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-light italic">
              "{currentLang === 'ha' 
                ? 'Wakilci amana ce da za a bincika. Babban burina shi ne kawo ayyukan more rayuwa ga kowane kauye da unguwa a Yabo da Shagari ba tare da nuna bambanci ba.'
                : isRTL
                ? 'التمثيل البرلماني أمانة ومسؤولية أمام الله والمواطنين. غايتنا الأساسية هي إيصال مشاريع التنمية المستدامة والمياه النقية والتعليم لكل قرية في يابو وشاغاري.'
                : 'Representation is a sacred public trust. Our legislative mission is clear: delivering clean water, quality education, rural roads, and direct agrarian empowerment to every ward without exception.'}"
            </p>
            <span className="text-[11px] font-bold text-emerald-200 block text-right">— Hon. Umar Yusuf (Danmaje Yabo)</span>
          </div>
        </div>

        {/* Right Column: Narrative Biography & Professional Chapters */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* SECTION 1: PERSONAL PROFILE & HERITAGE */}
          {(activeBioSection === 'all' || activeBioSection === 'profile') && (
            <div className="bg-white p-7 sm:p-9 rounded-3xl shadow-sm border border-stone-200 space-y-4">
              <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
                <div className="w-12 h-12 rounded-2xl bg-[#103C2E]/10 flex items-center justify-center text-[#103C2E] shrink-0">
                  <BookOpen className="w-6 h-6 text-[#C6A15B]" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#C6A15B]">
                    {currentLang === 'ha' ? 'SASHE NA 1: BAYANIN RAYUWA' : isRTL ? 'القسم الأول: الملف الشخصي' : 'SECTION 1: PERSONAL PROFILE'}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold font-['Manrope'] text-[#103C2E] uppercase">
                    {t('rootsTitle', currentLang, translations)}
                  </h2>
                  <p className="text-xs text-stone-500">
                    {t('rootsSubtitle', currentLang, translations)}
                  </p>
                </div>
              </div>

              <div className="prose text-stone-700 leading-relaxed text-sm sm:text-base font-normal space-y-4">
                <p>{t('rootsP1', currentLang, translations)}</p>
                <p>{t('rootsP2', currentLang, translations)}</p>
              </div>

              <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 flex flex-wrap gap-4 text-xs font-semibold text-[#103C2E]">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#C6A15B]" />
                  <span>Place of Origin: Yabo, Sokoto State</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#C6A15B]" />
                  <span>Title: Danmaje Yabo</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-[#C6A15B]" />
                  <span>Constituency: Yabo / Shagari</span>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: EDUCATION & GOVERNANCE CAPACITY */}
          {(activeBioSection === 'all' || activeBioSection === 'education') && (
            <div className="bg-white p-7 sm:p-9 rounded-3xl shadow-sm border border-stone-200 space-y-4">
              <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
                <div className="w-12 h-12 rounded-2xl bg-[#103C2E]/10 flex items-center justify-center text-[#103C2E] shrink-0">
                  <GraduationCap className="w-6 h-6 text-[#C6A15B]" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#C6A15B]">
                    {currentLang === 'ha' ? 'SASHE NA 2: ILIMI DA KWAREWA' : isRTL ? 'القسم الثاني: التعليم وبناء القدرات' : 'SECTION 2: EDUCATION & CAPACITY'}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold font-['Manrope'] text-[#103C2E] uppercase">
                    {t('eduTitle', currentLang, translations)}
                  </h2>
                  <p className="text-xs text-stone-500">
                    {t('eduSubtitle', currentLang, translations)}
                  </p>
                </div>
              </div>

              <div className="prose text-stone-700 leading-relaxed text-sm sm:text-base font-normal space-y-4">
                <p>{t('eduP1', currentLang, translations)}</p>
                <p>{t('eduP2', currentLang, translations)}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-100">
                  <strong className="text-[#103C2E] block font-bold">Public Administration & Policy Formulation</strong>
                  <span className="text-stone-500 text-[11px]">Academic focus in tertiary studies and leadership institutions</span>
                </div>
                <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-100">
                  <strong className="text-[#103C2E] block font-bold">Legislative Drafting & Oversight Seminars</strong>
                  <span className="text-stone-500 text-[11px]">Specialized parliamentary coursework at the 10th National Assembly</span>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: POLITICAL JOURNEY & REPRESENTATION MANDATE */}
          {(activeBioSection === 'all' || activeBioSection === 'journey') && (
            <div className="bg-white p-7 sm:p-9 rounded-3xl shadow-sm border border-stone-200 space-y-4">
              <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
                <div className="w-12 h-12 rounded-2xl bg-[#103C2E]/10 flex items-center justify-center text-[#103C2E] shrink-0">
                  <Briefcase className="w-6 h-6 text-[#C6A15B]" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#C6A15B]">
                    {currentLang === 'ha' ? 'SASHE NA 3: FAFUTUKAR SIYASA' : isRTL ? 'القسم الثالث: المسيرة السياسية' : 'SECTION 3: POLITICAL JOURNEY'}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold font-['Manrope'] text-[#103C2E] uppercase">
                    {currentLang === 'ha' ? 'Tafarkin Siyasa da Zaben Majalisa' : isRTL ? 'المسيرة السياسية والتفويض النيابي' : 'Political Journey & Electoral Mandate'}
                  </h2>
                  <p className="text-xs text-stone-500">
                    {currentLang === 'ha' ? 'Zababbiyar murya don Yabo da Shagari' : isRTL ? 'صوت موثوق يمثل تطلعات أهالي يابو وشاغاري' : 'A mandate forged through grassroots trust and open accountability'}
                  </p>
                </div>
              </div>

              <div className="prose text-stone-700 leading-relaxed text-sm sm:text-base font-normal space-y-4">
                <p>
                  {currentLang === 'ha' 
                    ? 'Tafarkin siyasar Hon. Umar Yusuf Danmaje Yabo ya samo asali ne daga kyakkyawar alaka da al\'ummar karkara. Bai shiga siyasa don neman daukakar kai ba, sai don zama tsani na isar da bukatun talakawa zuwa ga mahukunta.'
                    : isRTL
                    ? 'انطلقت المسيرة السياسية للنائب عمر يوسف دانماجي يابو من علاقته الوثيقة بأبناء دائرته وإيمانه بأن العمل السياسي تكليف ومسؤولية تهدف إلى رفع المعاناة عن كواهل الأسر وتوجيه الموارد العامة لصالح التنمية الشاملة.'
                    : 'The political journey of Hon. Umar Yusuf (Danmaje Yabo) is anchored in unwavering grassroots affinity. His entry into elective politics was spurred by citizens and community elders who sought purposeful, principled representation committed to tangible physical dividends rather than empty promises.'}
                </p>
                <p>
                  {currentLang === 'ha'
                    ? 'A babban zaben 2023, al\'ummar mazabar Yabo da Shagari suka zabe shi da gagarumin rinjaye don ya wakilce su a Majalisar Wakilai ta Tarayya a Abuja. Tun daga lokacin, ya mayar da hankali kan cika alkawuransa ta hanyar samar da ruwan sha, inganta asibitoci, da kare muradun manoma.'
                    : isRTL
                    ? 'في الانتخابات العامة لعام 2023، منحه أهالي دائرة يابو/شاغاري ثقتهم الكاملة بأغلبية ساحقة لتمثيلهم في مجلس النواب بالبرلمان الفيدرالي في أبوجا، حيث كرس ولايته البرلمانية لخدمة مصالح الدائرة والدفاع عن حقوق الفلاحين والشباب.'
                    : 'Elected decisively in the 2023 general elections to represent Yabo/Shagari Federal Constituency, Hon. Danmaje has maintained an open-door covenant with constituents across all 22 wards, operating active constituency offices and regular town-hall briefings.'}
                </p>
              </div>
            </div>
          )}

          {/* SECTION 4: LEGISLATIVE RESPONSIBILITIES & COMMITTEE ROLES */}
          {(activeBioSection === 'all' || activeBioSection === 'legislative') && (
            <div className="bg-white p-7 sm:p-9 rounded-3xl shadow-sm border border-stone-200 space-y-4">
              <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
                <div className="w-12 h-12 rounded-2xl bg-[#103C2E]/10 flex items-center justify-center text-[#103C2E] shrink-0">
                  <Landmark className="w-6 h-6 text-[#C6A15B]" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#C6A15B]">
                    {currentLang === 'ha' ? 'SASHE NA 4: AIKIN MAJALISA' : isRTL ? 'القسم الرابع: المسؤوليات البرلمانية' : 'SECTION 4: LEGISLATIVE STEWARDSHIP'}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold font-['Manrope'] text-[#103C2E] uppercase">
                    {t('nassTitle', currentLang, translations)}
                  </h2>
                  <p className="text-xs text-stone-500">
                    {t('nassSubtitle', currentLang, translations)}
                  </p>
                </div>
              </div>

              <div className="prose text-stone-700 leading-relaxed text-sm sm:text-base font-normal space-y-4">
                <p>{t('nassP1', currentLang, translations)}</p>
                <p>{t('nassP2', currentLang, translations)}</p>
              </div>

              {/* Legislative Milestones Callout */}
              <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-[#103C2E]">Verified Key Legislative Acts:</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Federal College of Agricultural Technology, Yabo (Establishment) Bill:</strong> Successfully scaled Second Reading in Plenary.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Urgent Motion on Gully Erosion Remediation:</strong> Advocated ecological fund deployment for agricultural communities in Sokoto State.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Federal Road Rehabilitation Motion:</strong> Advocated federal repairs on major transit arteries serving farming hubs.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 5: PUBLIC SERVICE & GRASSROOTS IMPACT */}
          {(activeBioSection === 'all' || activeBioSection === 'service') && (
            <div className="bg-white p-7 sm:p-9 rounded-3xl shadow-sm border border-stone-200 space-y-4">
              <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
                <div className="w-12 h-12 rounded-2xl bg-[#103C2E]/10 flex items-center justify-center text-[#103C2E] shrink-0">
                  <HeartHandshake className="w-6 h-6 text-[#C6A15B]" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#C6A15B]">
                    {currentLang === 'ha' ? 'SASHE NA 5: HIDIMA GA JAMA\'A' : isRTL ? 'القسم الخامس: الخدمة العامة والأثر القاعدي' : 'SECTION 5: PUBLIC SERVICE & IMPACT'}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold font-['Manrope'] text-[#103C2E] uppercase">
                    {t('impactTitle', currentLang, translations)}
                  </h2>
                  <p className="text-xs text-stone-500">
                    {t('impactSubtitle', currentLang, translations)}
                  </p>
                </div>
              </div>

              <div className="prose text-stone-700 leading-relaxed text-sm sm:text-base font-normal space-y-4">
                <p>{t('impactP1', currentLang, translations)}</p>
                <p>{t('impactP2', currentLang, translations)}</p>
              </div>
            </div>
          )}

          {/* SECTION 6: VERIFIED ACHIEVEMENTS & STRATEGIC PILLARS */}
          {(activeBioSection === 'all' || activeBioSection === 'achievements') && (
            <div className="bg-gradient-to-br from-stone-50 to-white p-7 sm:p-9 rounded-3xl shadow-sm border border-stone-200 space-y-6">
              <div className="space-y-2 border-b border-stone-200 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-[#C6A15B]">
                  {currentLang === 'ha' ? 'MANUFAR WAKILCI' : isRTL ? 'الأجندة الاستراتيجية والنتائج' : 'STRATEGIC AGENDA'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold font-['Manrope'] text-[#103C2E] uppercase">
                  {t('fivePillarsTitle', currentLang, translations)}
                </h2>
                <p className="text-xs sm:text-sm text-stone-600">
                  {t('fivePillarsSubtitle', currentLang, translations)}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-2 shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-[#103C2E] text-[#D4AF37] flex items-center justify-center font-bold text-xs">
                    1
                  </div>
                  <h4 className="font-['Manrope'] font-bold text-sm text-[#103C2E] uppercase">
                    {t('pillarWater', currentLang, translations)}
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {t('pillarWaterDesc', currentLang, translations)}
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-2 shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-[#103C2E] text-[#D4AF37] flex items-center justify-center font-bold text-xs">
                    2
                  </div>
                  <h4 className="font-['Manrope'] font-bold text-sm text-[#103C2E] uppercase">
                    {t('pillarEdu', currentLang, translations)}
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {t('pillarEduDesc', currentLang, translations)}
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-2 shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-[#103C2E] text-[#D4AF37] flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <h4 className="font-['Manrope'] font-bold text-sm text-[#103C2E] uppercase">
                    {t('pillarRoads', currentLang, translations)}
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {t('pillarRoadsDesc', currentLang, translations)}
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-2 shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-[#103C2E] text-[#D4AF37] flex items-center justify-center font-bold text-xs">
                    4
                  </div>
                  <h4 className="font-['Manrope'] font-bold text-sm text-[#103C2E] uppercase">
                    {t('pillarFarmers', currentLang, translations)}
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {t('pillarFarmersDesc', currentLang, translations)}
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-2 shadow-sm sm:col-span-2">
                  <div className="w-8 h-8 rounded-lg bg-[#103C2E] text-[#D4AF37] flex items-center justify-center font-bold text-xs">
                    5
                  </div>
                  <h4 className="font-['Manrope'] font-bold text-sm text-[#103C2E] uppercase">
                    {t('pillarYouth', currentLang, translations)}
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {t('pillarYouthDesc', currentLang, translations)}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  onClick={() => navigateTo('projects')}
                  className="bg-[#103C2E] hover:bg-[#09291F] text-white font-bold py-3 px-6 rounded-xl text-xs transition flex items-center gap-2 cursor-pointer shadow-md uppercase tracking-wider"
                >
                  <span>{t('exploreProjects', currentLang, translations).toUpperCase()}</span>
                  <ArrowRight className={`w-3.5 h-3.5 text-[#C6A15B] ${isRTL ? 'rotate-180' : ''}`} />
                </button>

                <button
                  onClick={() => navigateTo('gallery')}
                  className="bg-white hover:bg-stone-100 text-[#103C2E] border border-stone-300 font-bold py-3 px-6 rounded-xl text-xs transition flex items-center gap-2 cursor-pointer uppercase tracking-wider"
                >
                  <span>{t('media', currentLang, translations).toUpperCase()}</span>
                  <ChevronRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* 3. CONSTITUENCY CITIZEN CHARTER & PROMINENT CONTACT OFFICE SECTION */}
      <section className="bg-gradient-to-r from-[#072118] via-[#0E3529] to-[#0A261E] rounded-3xl p-8 sm:p-12 text-white shadow-2xl border border-emerald-500/40 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/60 border border-emerald-500/40 text-xs font-semibold text-emerald-200 uppercase tracking-wider">
            <OfficialCrest size="sm" className="w-4 h-4 shrink-0" />
            <span>OPEN CONSTITUENCY LIAISON</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold font-['Manrope'] text-white uppercase leading-tight">
            {t('openGovTitle', currentLang, translations)}
          </h2>

          <p className="text-sm sm:text-base text-stone-200 leading-relaxed font-light max-w-2xl">
            {t('openGovDesc', currentLang, translations)}
          </p>

          <div className="pt-2 flex flex-wrap gap-4">
            <button
              onClick={() => navigateTo('contact')}
              className="bg-white hover:bg-emerald-50 active:scale-[0.98] text-[#09291F] font-black px-8 py-4 rounded-xl text-xs sm:text-sm transition-all shadow-xl flex items-center gap-2.5 cursor-pointer border border-emerald-400 uppercase tracking-wider"
            >
              <Phone className="w-4 h-4 text-[#09291F]" />
              <span>{t('contactOffice', currentLang, translations).toUpperCase()}</span>
            </button>

            <button
              onClick={() => navigateTo('empowerment')}
              className="bg-emerald-700 hover:bg-emerald-600 active:scale-[0.98] text-white font-extrabold px-8 py-4 rounded-xl text-xs sm:text-sm transition-all shadow-xl border border-emerald-400/60 flex items-center gap-2 cursor-pointer uppercase tracking-wider"
            >
              <span>{t('empowerment', currentLang, translations).toUpperCase()}</span>
              <ChevronRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Constituency Desks */}
        <div className="lg:col-span-4 bg-[#051C14]/90 p-6 sm:p-7 rounded-2xl border border-[#C6A15B]/30 space-y-4 text-xs">
          <h4 className="font-bold text-sm text-[#D4AF37] uppercase tracking-wide">
            {t('officeLocationsTitle', currentLang, translations)}
          </h4>
          
          <div className="space-y-3 text-stone-300">
            <div className="flex items-start gap-2.5 pb-2 border-b border-white/10">
              <MapPin className="w-4 h-4 text-[#C6A15B] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-semibold">National Assembly Office:</strong>
                <span>{t('natAssemblyOffice', currentLang, translations)}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 pb-2 border-b border-white/10">
              <MapPin className="w-4 h-4 text-[#C6A15B] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-semibold">Yabo Liaison Desk:</strong>
                <span>{t('yaboDesk', currentLang, translations)}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#C6A15B] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-semibold">Shagari Liaison Desk:</strong>
                <span>{t('shagariDesk', currentLang, translations)}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
