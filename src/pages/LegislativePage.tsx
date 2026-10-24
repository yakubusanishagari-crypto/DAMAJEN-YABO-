import React, { useState } from 'react';
import { LegislativeRecord } from '../types';
import { 
  Award, FileText, Calendar, CheckCircle, Clock, ExternalLink, Search, 
  Landmark, Download, Share2, ChevronRight, X, UserCheck, Shield 
} from 'lucide-react';
import { Language, t, Translations } from '../utils/i18n';

interface Props {
  legislative: LegislativeRecord[];
  setCurrentTab?: (tab: string) => void;
  currentLang?: Language;
  translations?: Translations;
}

export const LegislativePage: React.FC<Props> = ({ 
  legislative, 
  setCurrentTab,
  currentLang = 'en', 
  translations 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [activeGazette, setActiveGazette] = useState<LegislativeRecord | null>(null);

  const categories = ['All', 'Bill', 'Motion', 'Committee', 'Parliamentary Question', 'Petition'];
  const statuses = ['All', 'Proposed', 'Under Review', 'Approved', 'Rejected', 'Passed'];

  const filteredRecords = legislative.filter(l => {
    const matchesSearch = l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          l.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || l.category === selectedCategory;
    const matchesStat = selectedStatus === 'All' || l.status === selectedStatus;
    return matchesSearch && matchesCat && matchesStat;
  });

  const getCategoryLabel = (cat: string) => {
    if (cat === 'All') return t('allLegCategories', currentLang, translations);
    if (currentLang === 'ha') {
      if (cat === 'Bill') return 'Kudurin Doka';
      if (cat === 'Motion') return 'Motsin Gaggawa';
      if (cat === 'Committee') return 'Aikin Kwamiti';
      if (cat === 'Parliamentary Question') return 'Tambayar Majalisa';
      if (cat === 'Petition') return 'Korafe-korafen Al\'umma';
    }
    if (currentLang === 'ar') {
      if (cat === 'Bill') return 'مشروع قانون';
      if (cat === 'Motion') return 'ملتمس برلماني';
      if (cat === 'Committee') return 'عمل اللجان';
      if (cat === 'Parliamentary Question') return 'سؤال برلماني';
      if (cat === 'Petition') return 'عرائض المواطنين';
    }
    return cat;
  };

  const getStatusLabel = (stat: string) => {
    if (stat === 'Proposed') {
      return currentLang === 'ha' ? 'Wanda aka Shirya' : currentLang === 'ar' ? 'مقترح' : 'Proposed';
    }
    if (stat === 'Under Review') {
      return currentLang === 'ha' ? 'Ana Bita / Nazari' : currentLang === 'ar' ? 'قيد المراجعة والتدقيق' : 'Under Review';
    }
    if (stat === 'Approved') {
      return currentLang === 'ha' ? 'An Amince' : currentLang === 'ar' ? 'تمت الموافقة' : 'Approved';
    }
    if (stat === 'Rejected') {
      return currentLang === 'ha' ? 'An Yi Watsi da Shi' : currentLang === 'ar' ? 'مرفوض' : 'Rejected';
    }
    if (stat === 'Passed') {
      return currentLang === 'ha' ? 'Ya Zama Doka / Ya Wuce' : currentLang === 'ar' ? 'تم إقراره رسمياً' : 'Passed';
    }
    if (stat === 'Pending') return t('billStagePending', currentLang, translations);
    if (stat === 'Introduced') return t('billStageIntroduced', currentLang, translations);
    return stat;
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
            <span>{t('legPageBadge', currentLang, translations)}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-['Manrope']">
            {t('legPageTitle', currentLang, translations)}
          </h1>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-light">
            {t('legPageDesc', currentLang, translations)}
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className={`w-4 h-4 text-stone-400 absolute top-3.5 ${isRtl ? 'right-3.5' : 'left-3.5'}`} />
          <input
            type="text"
            placeholder={t('searchLegPlaceholder', currentLang, translations)}
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
                {s === 'All' ? t('allLegStatuses', currentLang, translations) : getStatusLabel(s)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Legislative Cards with Stages Progression */}
      <div className="space-y-6">
        {filteredRecords.length === 0 ? (
          <div className="py-16 text-center text-stone-500 bg-white rounded-2xl border border-stone-200 space-y-2">
            <Landmark className="w-10 h-10 text-stone-300 mx-auto" />
            <p className="text-lg font-semibold text-[#103C2E]">{t('noLegFound', currentLang, translations)}</p>
            <p className="text-xs text-stone-500">{t('noProjectsFoundSub', currentLang, translations)}</p>
          </div>
        ) : (
          filteredRecords.map((record) => (
            <div 
              key={record.id} 
              className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-stone-200 hover:border-[#C6A15B]/60 transition-all duration-300 space-y-5"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-stone-100 pb-4">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                  <span className="bg-[#103C2E]/10 text-[#103C2E] px-2.5 py-1 rounded-md font-bold">
                    {getCategoryLabel(record.category)}
                  </span>
                  <span aria-hidden="true" className="text-stone-300">·</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border shadow-xs ${
                    record.status === 'Passed' ? 'bg-emerald-100 text-emerald-900 border-emerald-300' :
                    record.status === 'Approved' ? 'bg-teal-100 text-teal-900 border-teal-300' :
                    record.status === 'Under Review' ? 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse' :
                    record.status === 'Proposed' ? 'bg-sky-100 text-sky-900 border-sky-300' :
                    record.status === 'Rejected' ? 'bg-rose-100 text-rose-900 border-rose-300' :
                    record.status === 'Pending' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                    'bg-stone-100 text-stone-700 border-stone-300'
                  }`}>
                    {getStatusLabel(record.status)}
                  </span>
                  <span aria-hidden="true" className="text-stone-300">·</span>
                  <span className="text-stone-500 flex items-center gap-1 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-[#C6A15B]" /> {record.date}
                  </span>
                </div>

                <button
                  onClick={() => setActiveGazette(record)}
                  className="bg-[#103C2E] hover:bg-[#09291F] text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow transition-all cursor-pointer uppercase tracking-wider"
                >
                  <FileText className="w-4 h-4 text-[#C6A15B]" /> 
                  <span>{currentLang === 'ha' ? 'DUBA KUNDIN DOKA' : currentLang === 'ar' ? 'عرض وثيقة الجريدة' : 'VIEW GAZETTE DOCKET'}</span>
                </button>
              </div>

              <div className="space-y-3">
                <h3 className="font-['Manrope'] font-bold text-xl sm:text-2xl text-[#103C2E] leading-snug">
                  {record.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed max-w-4xl font-light">
                  {record.description}
                </p>

                {record.coSponsors && record.coSponsors.length > 0 && (
                  <div className="text-xs text-stone-600 flex items-center gap-2 pt-1 font-medium">
                    <UserCheck className="w-3.5 h-3.5 text-[#C6A15B]" />
                    <span>{t('coSponsorsLabel', currentLang, translations)}: <strong>{record.coSponsors.join(', ')}</strong></span>
                  </div>
                )}
              </div>

              {record.statusNotes && (
                <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-3.5 text-xs text-stone-700 flex items-start gap-2.5">
                  <Shield className="w-4 h-4 text-[#C6A15B] shrink-0 mt-0.5" />
                  <div className="space-y-0.5 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#103C2E]">Official Gazette Status Dispatch:</span>
                      {record.statusUpdatedAt && (
                        <span className="text-[11px] text-stone-400 font-mono">Updated: {record.statusUpdatedAt}</span>
                      )}
                    </div>
                    <p className="leading-relaxed font-light">{record.statusNotes}</p>
                  </div>
                </div>
              )}

              {/* Parliamentary Stage Timeline */}
              <div className="pt-3 border-t border-stone-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block mb-2">
                  {currentLang === 'ha' ? 'Matakan Tafiyar Doka a Majalisa' : currentLang === 'ar' ? 'المراحل البرلمانية للمشروع' : 'Parliamentary Progress Timeline'}
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {/* Stage 1: Proposed / 1st Reading */}
                  <div className="bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-lg p-2.5 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <p className="font-bold">{currentLang === 'ha' ? '1. Gabatarwa' : currentLang === 'ar' ? '1. مقترح وقراءة أولى' : '1. Proposed'}</p>
                      <p className="text-[10px] text-emerald-700">{currentLang === 'ha' ? 'Shigarwa a Zaure' : currentLang === 'ar' ? 'العرض الرسمي' : 'Plenary Introduction'}</p>
                    </div>
                  </div>

                  {/* Stage 2: Under Review / Committee */}
                  <div className={`p-2.5 rounded-lg flex items-center gap-2 border ${
                    record.status === 'Passed' || record.status === 'Approved'
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-200' 
                      : record.status === 'Under Review' || record.status === 'Pending'
                      ? 'bg-amber-50 text-amber-900 border-amber-300 ring-1 ring-amber-300 animate-pulse'
                      : 'bg-stone-50 text-stone-400 border-stone-200'
                  }`}>
                    <Clock className={`w-4 h-4 shrink-0 ${
                      record.status === 'Passed' || record.status === 'Approved' ? 'text-emerald-600' : 
                      record.status === 'Under Review' || record.status === 'Pending' ? 'text-amber-600' : 'text-stone-300'
                    }`} />
                    <div>
                      <p className="font-bold">{currentLang === 'ha' ? '2. Bita & Kwamiti' : currentLang === 'ar' ? '2. المراجعة واللجان' : '2. Under Review'}</p>
                      <p className="text-[10px]">{currentLang === 'ha' ? 'Nazarin Masana' : currentLang === 'ar' ? 'جلسات الفحص' : 'Committee Scrutiny'}</p>
                    </div>
                  </div>

                  {/* Stage 3: Approved / Floor Adoption */}
                  <div className={`p-2.5 rounded-lg flex items-center gap-2 border ${
                    record.status === 'Passed'
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                      : record.status === 'Approved'
                      ? 'bg-teal-50 text-teal-900 border-teal-300 ring-1 ring-teal-300'
                      : record.status === 'Rejected'
                      ? 'bg-rose-50 text-rose-900 border-rose-200'
                      : 'bg-stone-50 text-stone-400 border-stone-200'
                  }`}>
                    <CheckCircle className={`w-4 h-4 shrink-0 ${
                      record.status === 'Passed' ? 'text-emerald-600' :
                      record.status === 'Approved' ? 'text-teal-600' :
                      record.status === 'Rejected' ? 'text-rose-500' : 'text-stone-300'
                    }`} />
                    <div>
                      <p className="font-bold">{record.status === 'Rejected' ? '3. Rejected' : (currentLang === 'ha' ? '3. Amincewa' : currentLang === 'ar' ? '3. الموافقة' : '3. Approved')}</p>
                      <p className="text-[10px]">{record.status === 'Rejected' ? 'Plenary Stood Down' : (currentLang === 'ha' ? 'Karatun Karshe' : currentLang === 'ar' ? 'الموافقة العامة' : 'Plenary Approval')}</p>
                    </div>
                  </div>

                  {/* Stage 4: Passed / Enacted */}
                  <div className={`p-2.5 rounded-lg flex items-center gap-2 border ${
                    record.status === 'Passed'
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-200 ring-1 ring-emerald-300'
                      : 'bg-stone-50 text-stone-400 border-stone-200'
                  }`}>
                    <CheckCircle className={`w-4 h-4 shrink-0 ${record.status === 'Passed' ? 'text-emerald-600' : 'text-stone-300'}`} />
                    <div>
                      <p className="font-bold">{currentLang === 'ha' ? '4. Passed' : currentLang === 'ar' ? '4. إقرار نهائي' : '4. Passed / Enacted'}</p>
                      <p className="text-[10px]">{currentLang === 'ha' ? 'Zama Cikakkiyar Doka' : currentLang === 'ar' ? 'المصادقة والتنفيذ' : 'Final Enactment'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Gazette Docket Modal */}
      {activeGazette && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto animate-fadeIn">
          <div className="bg-[#FAF9F5] w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-[#C6A15B]/40 max-h-[90vh] flex flex-col my-auto">
            <div className="bg-[#103C2E] text-white p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#C6A15B] text-[#09291F] flex items-center justify-center font-bold shrink-0">
                  <Landmark className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-['Manrope']">
                    {t('gazetteNotice', currentLang, translations)}
                  </h3>
                  <p className="text-xs text-white/80">
                    {t('legPageBadge', currentLang, translations)} • House of Representatives
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setActiveGazette(null)} 
                className="text-white/80 hover:text-white p-2 cursor-pointer"
                aria-label="Close docket"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-stone-800">
              <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-2">
                <span className="text-xs font-bold text-[#C6A15B] uppercase tracking-wider">{getCategoryLabel(activeGazette.category)}</span>
                <h4 className="font-bold text-lg text-[#103C2E] font-['Manrope']">{activeGazette.title}</h4>
                <p className="text-xs text-stone-600">
                  {currentLang === 'ha' ? 'Mai Gabatarwa:' : currentLang === 'ar' ? 'النائب مقدم المشروع:' : 'Lead Sponsor:'} <strong>Hon. Umar Yusuf (Danmaje Yabo)</strong>
                </p>
                <p className="text-xs text-stone-600">
                  {currentLang === 'ha' ? 'Ranar Shigarwa:' : currentLang === 'ar' ? 'تاريخ النشر في الجريدة:' : 'Date Gazetted:'} <strong>{activeGazette.date}</strong>
                </p>
                <p className="text-xs text-stone-600">
                  {currentLang === 'ha' ? 'Madogara:' : currentLang === 'ar' ? 'المصدر الرسمي:' : 'Official Source:'} <strong>{activeGazette.source || 'Votes & Proceedings, House of Representatives'}</strong>
                </p>
              </div>

              <div className="space-y-2">
                <h5 className="font-bold text-sm text-[#103C2E]">
                  {currentLang === 'ha' ? 'Takaitaccen Bayani' : currentLang === 'ar' ? 'ملخص مشروع القانون' : 'Substantive Summary'}
                </h5>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed bg-white p-4 rounded-xl border border-stone-200 font-light">
                  {activeGazette.description}
                </p>
              </div>

              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
                <span className="font-bold flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-emerald-700" /> 
                  <span>{currentLang === 'ha' ? 'Tabbacin Dokar Majalisa' : currentLang === 'ar' ? 'حالة التوثيق الرسمي' : 'Public Verification Status'}</span>
                </span>
                <p className="font-light">
                  {currentLang === 'ha'
                    ? 'Wannan bayani ya dace da rubutaccen kundi na ayyukan Majalisar Tarayya. Ana iya neman cikakkun takardun daga ofisoshinmu.'
                    : currentLang === 'ar'
                    ? 'هذا القيد مطابق تماماً للإجراءات التشريعية الموثقة في مضابط الجمعية الوطنية الرسمية.'
                    : 'This entry corresponds to verified legislative proceedings in the National Assembly Journal. Constituents may request full printed transcripts from the constituency liaison office.'}
                </p>
              </div>
            </div>

            <div className="bg-stone-100 p-4 border-t border-stone-200 flex flex-wrap justify-between items-center gap-3">
              <button
                onClick={() => {
                  const blob = new Blob([JSON.stringify(activeGazette, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `gazette_${activeGazette.id}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="bg-[#C6A15B] hover:bg-[#b59048] text-[#09291F] font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow cursor-pointer uppercase tracking-wider"
              >
                <Download className="w-4 h-4" /> 
                <span>{currentLang === 'ha' ? 'SAUKE TAKARDAR DOKA' : currentLang === 'ar' ? 'تحميل الوثيقة الرسمية' : 'DOWNLOAD OFFICIAL RECORD'}</span>
              </button>

              <button
                onClick={() => setActiveGazette(null)}
                className="bg-[#103C2E] text-white px-5 py-2 rounded-xl font-bold text-xs hover:bg-[#09291F] transition cursor-pointer ml-auto uppercase tracking-wider"
              >
                {t('closeBtn', currentLang, translations).toUpperCase()}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
