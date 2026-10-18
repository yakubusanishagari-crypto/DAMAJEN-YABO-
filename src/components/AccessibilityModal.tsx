import React from 'react';
import { X, Eye } from 'lucide-react';
import { Language, t, Translations } from '../utils/i18n';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentLang?: Language;
  translations?: Translations;
}

export const AccessibilityModal: React.FC<Props> = ({ isOpen, onClose, currentLang = 'en', translations }) => {
  if (!isOpen) return null;
  const isRtl = currentLang === 'ar';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className={`bg-[#FAF9F5] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-[#C6A15B]/30 max-h-[90vh] flex flex-col ${isRtl ? 'rtl text-right' : ''}`}>
        <div className="bg-[#103C2E] text-white p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <Eye className="w-6 h-6 text-[#C6A15B] shrink-0" />
            <h3 className="text-xl font-bold font-['Manrope'] uppercase">
              {t('accessibility', currentLang, translations).toUpperCase()}
            </h3>
          </div>
          <button onClick={onClose} className="bg-[#09291F] hover:bg-rose-700 text-white p-2 rounded-xl border border-[#C6A15B]/40 transition shadow-sm cursor-pointer" title="Close">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto space-y-4 text-[#242824] text-sm leading-relaxed">
          <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl text-xs text-[#103C2E]">
            <strong>{t('accessPrincipleTitle', currentLang, translations)}:</strong> {t('accessPrincipleText', currentLang, translations)}
          </div>
          
          <h4 className="font-bold text-base text-[#103C2E] mt-4">
            {t('accessSec1Title', currentLang, translations)}
          </h4>
          <p className="text-stone-600 font-normal">
            {t('accessSec1Text', currentLang, translations)}
          </p>

          <h4 className="font-bold text-base text-[#103C2E] mt-4">
            {t('accessSec2Title', currentLang, translations)}
          </h4>
          <p className="text-stone-600 font-normal">
            {t('accessSec2Text', currentLang, translations)}
          </p>

          <h4 className="font-bold text-base text-[#103C2E] mt-4">
            {t('accessSec3Title', currentLang, translations)}
          </h4>
          <p className="text-stone-600 font-normal">
            {t('accessSec3Text', currentLang, translations)}
          </p>
        </div>
        <div className="bg-gray-100 p-4 border-t border-gray-200 flex justify-end">
          <button onClick={onClose} className="bg-[#103C2E] text-white px-6 py-2 rounded-xl font-bold text-xs hover:bg-[#09291F] transition cursor-pointer uppercase tracking-wider">
            {t('closeBtn', currentLang, translations).toUpperCase()}
          </button>
        </div>
      </div>
    </div>
  );
};
