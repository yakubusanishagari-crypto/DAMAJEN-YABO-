import React from 'react';
import { 
  Award, BookOpen, Briefcase, CheckCircle, GraduationCap, Shield, User, Users,
  Landmark, ArrowRight, Target, Compass, HeartHandshake, MapPin, 
  Calendar, ChevronRight, FileText, Sparkles, Building2
} from 'lucide-react';
import { Language, t, Translations } from '../utils/i18n';
import { OfficialCrest } from '../components/OfficialCrest';

interface Props {
  setCurrentTab: (tab: string) => void;
  currentLang: Language;
  translations: Translations;
}

export const BiographyPage: React.FC<Props> = ({ setCurrentTab, currentLang, translations }) => {
  const navigateTo = (tab: string) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Localized facts labels and values
  const facts = [
    {
      label: currentLang === 'ha' ? 'Cikakken Suna:' : currentLang === 'ar' ? 'الاسم الكامل:' : 'Full Name:',
      value: currentLang === 'ar' ? 'النائب عمر يوسف' : 'Hon. Umar Yusuf'
    },
    {
      label: currentLang === 'ha' ? 'Sarautar Gargajiya:' : currentLang === 'ar' ? 'اللقب التقليدي:' : 'Traditional Title:',
      value: currentLang === 'ar' ? 'دانماجي يابو' : 'Danmaje Yabo'
    },
    {
      label: currentLang === 'ha' ? 'Kujerar Majalisa:' : currentLang === 'ar' ? 'المنصب النيابي:' : 'Parliamentary Mandate:',
      value: currentLang === 'ha' ? 'Majalisar Wakilai ta Tarayya' : currentLang === 'ar' ? 'مجلس النواب' : 'House of Representatives'
    },
    {
      label: currentLang === 'ha' ? 'Mazabar Tarayya:' : currentLang === 'ar' ? 'الدائرة الانتخابية:' : 'Federal Constituency:',
      value: currentLang === 'ha' ? 'Yabo da Shagari (Jihar Sakkwato)' : currentLang === 'ar' ? 'يابو وشاغاري (ولاية سوكوتو)' : 'Yabo / Shagari (Sokoto State)'
    },
    {
      label: currentLang === 'ha' ? 'Majalisa:' : currentLang === 'ar' ? 'الدورة البرلمانية:' : 'Assembly:',
      value: currentLang === 'ha' ? 'Majalisa ta 10 ta Kasa' : currentLang === 'ar' ? 'الجمعية الوطنية العاشرة' : '10th National Assembly'
    },
    {
      label: currentLang === 'ha' ? 'Jiha:' : currentLang === 'ar' ? 'الولاية الأصلية:' : 'State of Origin:',
      value: currentLang === 'ha' ? 'Jihar Sakkwato, Najeriya' : currentLang === 'ar' ? 'ولاية سوكوتو، نيجيريا' : 'Sokoto State, Nigeria'
    },
    {
      label: currentLang === 'ha' ? 'Hedikwatar Majalisa:' : currentLang === 'ar' ? 'المجمع البرلماني:' : 'Parliamentary Complex:',
      value: currentLang === 'ha' ? 'Three Arms Zone, Abuja' : currentLang === 'ar' ? 'مجمع الأسلحة الثلاثة، أبوجا' : 'Three Arms Zone, Abuja'
    }
  ];

  // Localized committees
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

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-16 overflow-x-hidden ${currentLang === 'ar' ? 'rtl text-right' : ''}`}>
      {/* 1. EXECUTIVE BIOGRAPHY HERO BANNER */}
      <section className="relative bg-gradient-to-br from-[#072118] via-[#0E3529] to-[#0A261E] text-white rounded-3xl p-8 sm:p-14 shadow-2xl overflow-hidden border border-[#C6A15B]/40">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#C6A15B]/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-8 space-y-5">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#C6A15B]/20 border border-[#C6A15B]/40 text-xs font-semibold text-[#D4AF37] tracking-wider uppercase">
              <OfficialCrest size="sm" className="w-5 h-5 shrink-0" />
              <span>{t('biography', currentLang, translations).toUpperCase()}</span>
              <span className="text-white/40">·</span>
              <span className="text-white/80 font-medium">10TH NATIONAL ASSEMBLY</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-['Manrope'] tracking-tight leading-[1.15]">
              Hon. Umar Yusuf <br />
              <span className="text-[#D4AF37] text-2xl sm:text-4xl lg:text-5xl font-semibold">
                (Danmaje Yabo)
              </span>
            </h1>

            <p className="text-base sm:text-xl text-emerald-100 font-medium">
              {t('constituencyTitle', currentLang, translations)}
            </p>

            <div className="flex items-center gap-2 text-xs sm:text-sm text-[#C6A15B] font-semibold">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>{t('constituencySubtitle', currentLang, translations)}</span>
            </div>

            <p className="text-sm sm:text-base text-white/85 font-normal leading-relaxed max-w-2xl">
              {t('bioTagline', currentLang, translations)}
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => navigateTo('projects')}
                className="bg-gradient-to-r from-[#D4AF37] via-[#C6A15B] to-[#B38F44] hover:brightness-110 active:scale-[0.98] text-[#09291F] font-bold px-7 py-3.5 rounded-xl shadow-lg transition-all flex items-center gap-2 text-xs sm:text-sm cursor-pointer border border-[#E5C16C]"
              >
                <span>{t('bioDeliverables', currentLang, translations)}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigateTo('contact')}
                className="bg-white/10 hover:bg-white/20 active:scale-[0.98] text-white border border-white/30 font-bold px-7 py-3.5 rounded-xl transition-all text-xs sm:text-sm backdrop-blur-md cursor-pointer"
              >
                <span>{t('contactRep', currentLang, translations)}</span>
              </button>
            </div>
          </div>

          {/* Portrait with Luxury Framing */}
          <div className="lg:col-span-4 flex justify-center">
            <div className="relative w-full max-w-xs sm:max-w-sm">
              <div className="absolute -inset-2 bg-gradient-to-tr from-[#C6A15B]/30 to-[#103C2E]/50 rounded-3xl blur-xl opacity-70"></div>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-[#C6A15B]/60 ring-4 ring-[#09291F] bg-[#09291F] aspect-[3/4]">
                <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 bg-[#061B14]/85 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#D4AF37]/60 shadow-lg">
                  <img src="/official_logo.png" alt="Official Seal" className="w-5 h-5 rounded-full object-contain" />
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#D4AF37]">National Assembly</span>
                </div>

                <img
                  src="/src/assets/images/portrait_danmaje_yabo_1792063283391.jpg"
                  alt="Hon. Umar Yusuf Danmaje Yabo"
                  className="w-full h-full object-cover object-top"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800';
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#061B14] via-[#09291F]/90 to-transparent p-4 text-white text-center border-t border-[#C6A15B]/20">
                  <p className="text-xs uppercase tracking-wider text-[#D4AF37] font-bold">Danmaje Yabo</p>
                  <p className="font-['Manrope'] font-bold text-sm text-white">
                    {currentLang === 'ha' ? 'Dan Majalisar Tarayya' : currentLang === 'ar' ? 'النائب البرلماني الفيدرالي' : 'Federal Lawmaker'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. EXECUTIVE PROFILE AND FACT CARD GRID */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Official Summary Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 space-y-5">
            <div className="flex items-center gap-3 border-b border-stone-100 pb-3">
              <img src="/official_logo.png" alt="Official Seal" className="w-10 h-10 rounded-full border border-[#D4AF37] object-contain shadow-sm shrink-0" />
              <div>
                <h3 className="font-['Manrope'] font-bold text-base text-[#103C2E]">
                  {t('execFactsTitle', currentLang, translations)}
                </h3>
                <span className="text-[10px] text-stone-500">Official Parliamentary Credentials</span>
              </div>
            </div>

            <div className="space-y-3.5 text-xs text-stone-700">
              {facts.map((fact, idx) => (
                <div key={idx} className="flex justify-between py-1 border-b border-stone-100 last:border-b-0">
                  <span className="text-stone-500 font-medium">{fact.label}</span>
                  <span className="font-bold text-[#103C2E] text-right">{fact.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Committee Assignments Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 space-y-4">
            <h3 className="font-['Manrope'] font-bold text-base text-[#103C2E] flex items-center gap-2">
              <Landmark className="w-4 h-4 text-[#C6A15B]" />
              <span>{t('committeeAssignments', currentLang, translations)}</span>
            </h3>
            <ul className="space-y-2.5 text-xs text-stone-600">
              {committees.map((comm, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{comm[currentLang] || comm.en}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Narrative Biography & Professional Chapters */}
        <div className="lg:col-span-8 space-y-8">
          {/* Chapter 1: Heritage & Early Background */}
          <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-stone-200 space-y-4">
            <div className="flex items-center gap-3 border-b border-stone-100 pb-3">
              <div className="w-10 h-10 rounded-xl bg-[#103C2E]/10 flex items-center justify-center text-[#103C2E]">
                <BookOpen className="w-5 h-5 text-[#C6A15B]" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-['Manrope'] text-[#103C2E]">
                  {t('rootsTitle', currentLang, translations)}
                </h2>
                <p className="text-xs text-stone-500">
                  {t('rootsSubtitle', currentLang, translations)}
                </p>
              </div>
            </div>

            <p className="text-stone-700 leading-relaxed text-sm sm:text-base font-normal">
              {t('rootsP1', currentLang, translations)}
            </p>

            <p className="text-stone-700 leading-relaxed text-sm sm:text-base font-normal">
              {t('rootsP2', currentLang, translations)}
            </p>
          </div>

          {/* Chapter 2: Academic Pursuits & Professional Training */}
          <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-stone-200 space-y-4">
            <div className="flex items-center gap-3 border-b border-stone-100 pb-3">
              <div className="w-10 h-10 rounded-xl bg-[#103C2E]/10 flex items-center justify-center text-[#103C2E]">
                <GraduationCap className="w-5 h-5 text-[#C6A15B]" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-['Manrope'] text-[#103C2E]">
                  {t('eduTitle', currentLang, translations)}
                </h2>
                <p className="text-xs text-stone-500">
                  {t('eduSubtitle', currentLang, translations)}
                </p>
              </div>
            </div>

            <p className="text-stone-700 leading-relaxed text-sm sm:text-base font-normal">
              {t('eduP1', currentLang, translations)}
            </p>

            <p className="text-stone-700 leading-relaxed text-sm sm:text-base font-normal">
              {t('eduP2', currentLang, translations)}
            </p>
          </div>

          {/* Chapter 3: Community Leadership & Grassroots Philanthropy */}
          <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-stone-200 space-y-4">
            <div className="flex items-center gap-3 border-b border-stone-100 pb-3">
              <div className="w-10 h-10 rounded-xl bg-[#103C2E]/10 flex items-center justify-center text-[#103C2E]">
                <HeartHandshake className="w-5 h-5 text-[#C6A15B]" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-['Manrope'] text-[#103C2E]">
                  {t('impactTitle', currentLang, translations)}
                </h2>
                <p className="text-xs text-stone-500">
                  {t('impactSubtitle', currentLang, translations)}
                </p>
              </div>
            </div>

            <p className="text-stone-700 leading-relaxed text-sm sm:text-base font-normal">
              {t('impactP1', currentLang, translations)}
            </p>

            <p className="text-stone-700 leading-relaxed text-sm sm:text-base font-normal">
              {t('impactP2', currentLang, translations)}
            </p>
          </div>

          {/* Chapter 4: Legislative Stewardship at the 10th National Assembly */}
          <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-stone-200 space-y-4">
            <div className="flex items-center gap-3 border-b border-stone-100 pb-3">
              <div className="w-10 h-10 rounded-xl bg-[#103C2E]/10 flex items-center justify-center text-[#103C2E]">
                <Landmark className="w-5 h-5 text-[#C6A15B]" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold font-['Manrope'] text-[#103C2E]">
                  {t('nassTitle', currentLang, translations)}
                </h2>
                <p className="text-xs text-stone-500">
                  {t('nassSubtitle', currentLang, translations)}
                </p>
              </div>
            </div>

            <p className="text-stone-700 leading-relaxed text-sm sm:text-base font-normal">
              {t('nassP1', currentLang, translations)}
            </p>

            <p className="text-stone-700 leading-relaxed text-sm sm:text-base font-normal">
              {t('nassP2', currentLang, translations)}
            </p>
          </div>
        </div>
      </section>

      {/* 3. CORE CONSTITUENCY PILLARS */}
      <section className="bg-stone-50 rounded-3xl p-8 sm:p-12 border border-stone-200 space-y-8">
        <div className="max-w-3xl space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#C6A15B]">
            {currentLang === 'ha' ? 'MANUFAR WAKILCI' : currentLang === 'ar' ? 'الأجندة الاستراتيجية' : 'STRATEGIC AGENDA'}
          </span>
          <h2 className="text-3xl font-extrabold font-['Manrope'] text-[#103C2E]">
            {t('fivePillarsTitle', currentLang, translations)}
          </h2>
          <p className="text-sm text-stone-600">
            {t('fivePillarsSubtitle', currentLang, translations)}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#103C2E]/10 text-[#103C2E] flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="font-['Manrope'] font-bold text-base text-[#103C2E]">
              {t('pillarWater', currentLang, translations)}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              {t('pillarWaterDesc', currentLang, translations)}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#103C2E]/10 text-[#103C2E] flex items-center justify-center font-bold">
              2
            </div>
            <h3 className="font-['Manrope'] font-bold text-base text-[#103C2E]">
              {t('pillarEdu', currentLang, translations)}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              {t('pillarEduDesc', currentLang, translations)}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#103C2E]/10 text-[#103C2E] flex items-center justify-center font-bold">
              3
            </div>
            <h3 className="font-['Manrope'] font-bold text-base text-[#103C2E]">
              {t('pillarRoads', currentLang, translations)}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              {t('pillarRoadsDesc', currentLang, translations)}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#103C2E]/10 text-[#103C2E] flex items-center justify-center font-bold">
              4
            </div>
            <h3 className="font-['Manrope'] font-bold text-base text-[#103C2E]">
              {t('pillarFarmers', currentLang, translations)}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              {t('pillarFarmersDesc', currentLang, translations)}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#103C2E]/10 text-[#103C2E] flex items-center justify-center font-bold">
              5
            </div>
            <h3 className="font-['Manrope'] font-bold text-base text-[#103C2E]">
              {t('pillarYouth', currentLang, translations)}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              {t('pillarYouthDesc', currentLang, translations)}
            </p>
          </div>

          <div className="bg-[#103C2E] text-white p-6 rounded-2xl border border-[#C6A15B]/30 space-y-2.5 flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#D4AF37]">
                {currentLang === 'ha' ? 'HANYAR DUBI' : currentLang === 'ar' ? 'بوابة الدائرة' : 'CONSTITUENCY PORTAL'}
              </span>
              <h3 className="font-['Manrope'] font-bold text-base text-white mt-1">
                {currentLang === 'ha' ? 'Bincika Ayruka na Zahiri' : currentLang === 'ar' ? 'متابعة المشاريع والإنجازات' : 'Track Real Progress'}
              </h3>
              <p className="text-xs text-white/80 leading-relaxed mt-1">
                {currentLang === 'ha' 
                  ? 'Duba hotunan duk ayyukan more rayuwa da kwanakin da aka kammala su.'
                  : currentLang === 'ar'
                  ? 'استكشف مشاريع البنية التحتية بالصور الموثقة وتواريخ الإنجاز.'
                  : 'Explore every capital project with verified photographs, locations, and execution dates.'}
              </p>
            </div>
            <button
              onClick={() => navigateTo('projects')}
              className="bg-[#D4AF37] hover:bg-[#C6A15B] text-[#09291F] font-bold py-2 px-4 rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              <span>{t('exploreProjects', currentLang, translations).toUpperCase()}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. CONSTITUENCY CITIZEN CHARTER & CONTACT */}
      <section className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-stone-200 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-8 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#C6A15B]">
            {currentLang === 'ha' ? 'HUKUMAR BUDE KOFA' : currentLang === 'ar' ? 'الحكم الرشيد والشفافية' : 'OPEN GOVERNANCE'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-['Manrope'] text-[#103C2E]">
            {t('openGovTitle', currentLang, translations)}
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed">
            {t('openGovDesc', currentLang, translations)}
          </p>
          <div className="pt-2 flex flex-wrap gap-4">
            <button
              onClick={() => navigateTo('contact')}
              className="bg-[#103C2E] hover:bg-[#09291F] active:scale-[0.98] text-white font-bold px-7 py-3.5 rounded-xl text-xs sm:text-sm transition-all shadow flex items-center gap-2 cursor-pointer border border-[#C6A15B]/30"
            >
              <span>{t('submitEnquiryBtn', currentLang, translations)}</span>
              <ArrowRight className="w-4 h-4 text-[#C6A15B]" />
            </button>
            <button
              onClick={() => navigateTo('gallery')}
              className="bg-[#FAF9F5] hover:bg-stone-200 text-[#103C2E] font-bold px-7 py-3.5 rounded-xl text-xs sm:text-sm transition-all border border-stone-300 flex items-center gap-2 cursor-pointer"
            >
              <span>{t('media', currentLang, translations)}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="lg:col-span-4 bg-stone-50 p-6 rounded-2xl border border-stone-200 space-y-3 text-xs">
          <h4 className="font-bold text-sm text-[#103C2E]">{t('officeLocationsTitle', currentLang, translations)}</h4>
          <div className="space-y-2 text-stone-600">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#C6A15B] shrink-0 mt-0.5" />
              <span>{t('natAssemblyOffice', currentLang, translations)}</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#C6A15B] shrink-0 mt-0.5" />
              <span>{t('yaboDesk', currentLang, translations)}</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#C6A15B] shrink-0 mt-0.5" />
              <span>{t('shagariDesk', currentLang, translations)}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
