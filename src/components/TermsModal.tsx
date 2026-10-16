import React from 'react';
import { X, FileText } from 'lucide-react';
import { Language, t, Translations } from '../utils/i18n';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentLang?: Language;
  translations?: Translations;
}

export const TermsModal: React.FC<Props> = ({ isOpen, onClose, currentLang = 'en', translations }) => {
  if (!isOpen) return null;
  const isRtl = currentLang === 'ar';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className={`bg-[#FAF9F5] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-[#C6A15B]/30 max-h-[90vh] flex flex-col ${isRtl ? 'rtl text-right' : ''}`}>
        <div className="bg-[#103C2E] text-white p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <FileText className="w-6 h-6 text-[#C6A15B] shrink-0" />
            <h3 className="text-xl font-bold font-['Manrope']">
              {t('termsOfUse', currentLang, translations)}
            </h3>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-2 cursor-pointer">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto space-y-4 text-[#242824] text-sm leading-relaxed">
          <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl text-xs text-[#103C2E]">
            <strong>{t('termsProtocolTitle', currentLang, translations)}:</strong> {t('termsProtocolText', currentLang, translations)}
          </div>
          
          <h4 className="font-bold text-base text-[#103C2E] mt-4">
            {t('termsSec1Title', currentLang, translations)}
          </h4>
          <p className="text-stone-600 font-normal">
            {t('termsSec1Text', currentLang, translations)}
          </p>

          <h4 className="font-bold text-base text-[#103C2E] mt-4">
            {t('termsSec2Title', currentLang, translations)}
          </h4>
          <p className="text-stone-600 font-normal">
            {t('termsSec2Text', currentLang, translations)}
          </p>

          <h4 className="font-bold text-base text-[#103C2E] mt-4">
            {t('termsSec3Title', currentLang, translations)}
          </h4>
          <p className="text-stone-600 font-normal">
            {t('termsSec3Text', currentLang, translations)}
          </p>
        </div>
        <div className="bg-gray-100 p-4 border-t border-gray-200 flex justify-end">
          <button onClick={onClose} className="bg-[#103C2E] text-white px-6 py-2 rounded-xl font-bold text-xs hover:bg-[#09291F] transition cursor-pointer">
            {t('closeBtn', currentLang, translations)}
          </button>
        </div>
      </div>
    </div>
  );
};
