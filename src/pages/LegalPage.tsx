import React from 'react';
import { ShieldCheck, FileText, Eye, ArrowLeft, CheckCircle, Mail, MapPin, Shield } from 'lucide-react';
import { Language, t, Translations } from '../utils/i18n';

interface Props {
  type: 'privacy' | 'terms' | 'accessibility';
  setCurrentTab: (tab: string) => void;
  currentLang: Language;
  translations: Translations;
}

export const LegalPage: React.FC<Props> = ({ type, setCurrentTab, currentLang, translations }) => {
  const titles = {
    privacy: {
      en: 'PRIVACY POLICY & DATA PROTECTION',
      ha: 'TSARIN TSARO DA KARE BAYANAN SIRRI',
      ar: 'سياسة الخصوصية وحماية البيانات'
    },
    terms: {
      en: 'TERMS OF USE & CITIZEN CHARTER',
      ha: "KA'IDOJIN AMFANI DA YARJEJENIYA",
      ar: 'شروط الاستخدام وميثاق المواطن'
    },
    accessibility: {
      en: 'ACCESSIBILITY STATEMENT',
      ha: 'SANARWAR SHIGA MAI SAUKI GA KOWA',
      ar: 'بيان إمكانية الوصول الرقمي'
    }
  };

  const currentTitle = titles[type][currentLang] || titles[type].en;
  const isRtl = currentLang === 'ar';

  return (
    <div className={`max-w-4xl mx-auto px-4 sm:px-8 py-12 space-y-8 animate-fadeIn ${isRtl ? 'rtl text-right' : ''}`}>
      {/* Back button */}
      <button
        onClick={() => {
          setCurrentTab('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className="inline-flex items-center gap-2 text-xs font-bold text-[#103C2E] hover:text-[#C6A15B] transition uppercase tracking-wider cursor-pointer"
      >
        <ArrowLeft className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
        <span>{t('backToHome', currentLang, translations).toUpperCase()}</span>
      </button>

      {/* Main Container */}
      <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden">
        {/* Header Banner */}
        <div className="bg-[#103C2E] text-white p-8 sm:p-10 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-3">
            <img src="/official_logo.png" alt="Official Seal" className="w-9 h-9 rounded-full border border-[#D4AF37] object-contain bg-[#07241A] shadow-md shrink-0" />
            <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
              {t('legalOfficeCharter', currentLang, translations)}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold font-['Manrope'] text-white">
            {currentTitle}
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 mt-2">
            {t('legalOfficeSub', currentLang, translations)}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-8 sm:p-12 space-y-8 text-stone-800 text-sm sm:text-base leading-relaxed">
          {type === 'privacy' && (
            <>
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-xs sm:text-sm text-[#103C2E] space-y-1">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{t('privacyAssuranceTitle', currentLang, translations)}</span>
                </div>
                <p className="text-stone-700 font-normal leading-relaxed">
                  {t('privacyAssuranceText', currentLang, translations)}
                </p>
              </div>

              <div className="space-y-3">
                <h2 className="text-lg font-bold text-[#103C2E]">
                  {t('privacySec1Title', currentLang, translations)}
                </h2>
                <p className="text-stone-600 font-normal leading-relaxed">
                  {t('privacySec1Text', currentLang, translations)}
                </p>
              </div>

              <div className="space-y-3">
                <h2 className="text-lg font-bold text-[#103C2E]">
                  {t('privacySec2Title', currentLang, translations)}
                </h2>
                <p className="text-stone-600 font-normal leading-relaxed">
                  {t('privacySec2Text', currentLang, translations)}
                </p>
              </div>

              <div className="space-y-3">
                <h2 className="text-lg font-bold text-[#103C2E]">
                  {t('privacySec3Title', currentLang, translations)}
                </h2>
                <p className="text-stone-600 font-normal leading-relaxed">
                  {t('privacySec3Text', currentLang, translations)}
                </p>
              </div>

              <div className="space-y-3">
                <h2 className="text-lg font-bold text-[#103C2E]">
                  {t('privacySec4Title', currentLang, translations)}
                </h2>
                <p className="text-stone-600 font-normal leading-relaxed">
                  {t('privacySec4Text', currentLang, translations)}
                </p>
              </div>
            </>
          )}

          {type === 'terms' && (
            <>
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-xs sm:text-sm text-[#103C2E] space-y-1">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <FileText className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{t('termsProtocolTitle', currentLang, translations)}</span>
                </div>
                <p className="text-stone-700 font-normal leading-relaxed">
                  {t('termsProtocolText', currentLang, translations)}
                </p>
              </div>

              <div className="space-y-3">
                <h2 className="text-lg font-bold text-[#103C2E]">
                  {t('termsSec1Title', currentLang, translations)}
                </h2>
                <p className="text-stone-600 font-normal leading-relaxed">
                  {t('termsSec1Text', currentLang, translations)}
                </p>
              </div>

              <div className="space-y-3">
                <h2 className="text-lg font-bold text-[#103C2E]">
                  {t('termsSec2Title', currentLang, translations)}
                </h2>
                <p className="text-stone-600 font-normal leading-relaxed">
                  {t('termsSec2Text', currentLang, translations)}
                </p>
              </div>

              <div className="space-y-3">
                <h2 className="text-lg font-bold text-[#103C2E]">
                  {t('termsSec3Title', currentLang, translations)}
                </h2>
                <p className="text-stone-600 font-normal leading-relaxed">
                  {t('termsSec3Text', currentLang, translations)}
                </p>
              </div>
            </>
          )}

          {type === 'accessibility' && (
            <>
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-xs sm:text-sm text-[#103C2E] space-y-1">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Eye className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{t('accessPrincipleTitle', currentLang, translations)}</span>
                </div>
                <p className="text-stone-700 font-normal leading-relaxed">
                  {t('accessPrincipleText', currentLang, translations)}
                </p>
              </div>

              <div className="space-y-3">
                <h2 className="text-lg font-bold text-[#103C2E]">
                  {t('accessSec1Title', currentLang, translations)}
                </h2>
                <p className="text-stone-600 font-normal leading-relaxed">
                  {t('accessSec1Text', currentLang, translations)}
                </p>
              </div>

              <div className="space-y-3">
                <h2 className="text-lg font-bold text-[#103C2E]">
                  {t('accessSec2Title', currentLang, translations)}
                </h2>
                <p className="text-stone-600 font-normal leading-relaxed">
                  {t('accessSec2Text', currentLang, translations)}
                </p>
              </div>

              <div className="space-y-3">
                <h2 className="text-lg font-bold text-[#103C2E]">
                  {t('accessSec3Title', currentLang, translations)}
                </h2>
                <p className="text-stone-600 font-normal leading-relaxed">
                  {t('accessSec3Text', currentLang, translations)}
                </p>
              </div>
            </>
          )}

          {/* Contact Box */}
          <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 text-xs text-stone-600">
            <h4 className="font-bold text-sm text-[#103C2E]">
              {t('legalInquiriesTitle', currentLang, translations)}
            </h4>
            <p>
              {t('legalInquiriesDesc', currentLang, translations)}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-1 font-medium">
              <span className="flex items-center gap-1.5 text-[#103C2E]">
                <Mail className="w-4 h-4 text-[#C6A15B] shrink-0" /> contact@danmayeyabo.gov.ng
              </span>
              <span className="flex items-center gap-1.5 text-[#103C2E]">
                <MapPin className="w-4 h-4 text-[#C6A15B] shrink-0" /> Three Arms Zone, Abuja & Yabo Town Central
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
