import React, { useState } from 'react';
import { 
  MapPin, Mail, Phone, Shield, Clock, Landmark, Building2, 
  ChevronRight, MessageCircle, Film, ExternalLink, ArrowRight, CheckCircle 
} from 'lucide-react';
import { PrivacyModal } from './PrivacyModal';
import { TermsModal } from './TermsModal';
import { AccessibilityModal } from './AccessibilityModal';
import { Language, t, Translations } from '../utils/i18n';
import { OfficialCrest } from './OfficialCrest';

interface Props {
  setCurrentTab: (tab: string) => void;
  currentLang: Language;
  translations?: Translations;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<Props> = ({ setCurrentTab, currentLang, translations, onOpenAdmin }) => {
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [accessibilityOpen, setAccessibilityOpen] = useState(false);


  const navigateTo = (tab: string) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isRtl = currentLang === 'ar';

  return (
    <footer className={`bg-[#061B14] text-white/90 pt-16 pb-12 border-t-2 border-[#C6A15B]/70 relative z-30 ${isRtl ? 'rtl text-right' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-14">
        {/* ========================================================================= */}
        {/* 1. WORLD-CLASS REDESIGNED 4-ACTION FOOTER HUB (WhatsApp, Gallery, Projects, Email) */}
        {/* ========================================================================= */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C6A15B] animate-pulse"></span>
              <h3 className="font-['Manrope'] font-extrabold text-xs sm:text-sm uppercase tracking-wider text-[#D4AF37]">
                {currentLang === 'ha' 
                  ? 'Hanyoyin Sadarwa da Ayyukan Mazaba' 
                  : currentLang === 'ar' 
                  ? 'قنوات التواصل المباشر وخدمات الدائرة' 
                  : 'Direct Public Service & Official Portals'}
              </h3>
            </div>
            <span className="text-[11px] text-stone-400">
              {currentLang === 'ha'
                ? 'Sadarwa kai tsaye tare da ofishin wakili'
                : currentLang === 'ar'
                ? 'متاحة لخدمة جميع أهالي الدائرة'
                : 'Verified channels for constituent engagement'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. WhatsApp Liaison Desk */}
            <a
              href="https://wa.me/2348000000000?text=Hello%20Hon.%20Umar%20Yusuf%20Danmaje%20Yabo,%20I%20am%20contacting%20from%20Yabo/Shagari%20Constituency."
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-[#08241B] hover:bg-[#0D3629] p-4 sm:p-5 rounded-2xl border border-[#C6A15B]/30 hover:border-[#D4AF37] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C6A15B] transition-all duration-300 shadow-md hover:shadow-xl active:scale-[0.985] flex items-center gap-3.5 cursor-pointer min-h-[108px]"
              title="Official WhatsApp Liaison Desk"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#103C2E] to-[#061D16] border border-[#25D366]/40 text-[#25D366] flex items-center justify-center shadow-md group-hover:scale-105 group-hover:border-[#25D366] transition-all duration-300 shrink-0">
                <MessageCircle className="w-6 h-6 fill-current" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="font-['Manrope'] font-bold text-white text-xs sm:text-sm group-hover:text-[#D4AF37] transition-colors truncate uppercase tracking-wider">
                    {t('footerWhatsappTitle', currentLang, translations).toUpperCase()}
                  </h4>
                  <span className="inline-block w-2 h-2 rounded-full bg-[#25D366] shadow-xs shrink-0"></span>
                </div>
                <p className="text-xs text-stone-300 font-normal mt-0.5 leading-snug line-clamp-1">
                  {t('footerWhatsappSubtitle', currentLang, translations)}
                </p>
                <span className="text-[10px] sm:text-[11px] text-[#25D366] font-extrabold uppercase tracking-wider mt-1.5 inline-flex items-center gap-1 group-hover:underline">
                  <span>CHAT ON WHATSAPP</span>
                  <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </a>

            {/* 2. Media & Speeches Gallery */}
            <button
              onClick={() => navigateTo('gallery')}
              className="group text-left bg-[#08241B] hover:bg-[#0D3629] p-4 sm:p-5 rounded-2xl border border-[#C6A15B]/30 hover:border-[#D4AF37] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C6A15B] transition-all duration-300 shadow-md hover:shadow-xl active:scale-[0.985] flex items-center gap-3.5 cursor-pointer min-h-[108px] w-full"
              title="Official Media & Gallery Archive"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#103C2E] to-[#061D16] border border-[#C6A15B]/40 text-[#D4AF37] flex items-center justify-center shadow-md group-hover:scale-105 group-hover:border-[#D4AF37] transition-all duration-300 shrink-0">
                <Film className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="font-['Manrope'] font-bold text-white text-xs sm:text-sm group-hover:text-[#D4AF37] transition-colors truncate uppercase tracking-wider">
                    {t('footerGalleryTitle', currentLang, translations).toUpperCase()}
                  </h4>
                  <ChevronRight className="w-3.5 h-3.5 text-[#C6A15B] group-hover:translate-x-0.5 transition-transform shrink-0" />
                </div>
                <p className="text-xs text-stone-300 font-normal mt-0.5 leading-snug line-clamp-1">
                  {t('footerGallerySubtitle', currentLang, translations)}
                </p>
                <span className="text-[10px] sm:text-[11px] text-[#D4AF37] font-extrabold uppercase tracking-wider mt-1.5 inline-flex items-center gap-1 group-hover:underline">
                  <span>{currentLang === 'ha' ? 'DUBA HOTUNA' : currentLang === 'ar' ? 'استعراض المعرض' : 'BROWSE ARCHIVE'}</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </button>

            {/* 3. Constituency Capital Projects */}
            <button
              onClick={() => navigateTo('projects')}
              className="group text-left bg-[#08241B] hover:bg-[#0D3629] p-4 sm:p-5 rounded-2xl border border-[#C6A15B]/30 hover:border-[#D4AF37] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C6A15B] transition-all duration-300 shadow-md hover:shadow-xl active:scale-[0.985] flex items-center gap-3.5 cursor-pointer min-h-[108px] w-full"
              title="Track Constituency Capital Projects"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#103C2E] to-[#061D16] border border-[#C6A15B]/40 text-[#D4AF37] flex items-center justify-center shadow-md group-hover:scale-105 group-hover:border-[#D4AF37] transition-all duration-300 shrink-0 font-extrabold">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="font-['Manrope'] font-bold text-white text-xs sm:text-sm group-hover:text-[#D4AF37] transition-colors truncate uppercase tracking-wider">
                    {t('footerProjectsTitle', currentLang, translations).toUpperCase()}
                  </h4>
                  <ChevronRight className="w-3.5 h-3.5 text-[#C6A15B] group-hover:translate-x-0.5 transition-transform shrink-0" />
                </div>
                <p className="text-xs text-stone-300 font-normal mt-0.5 leading-snug line-clamp-1">
                  {t('footerProjectsSubtitle', currentLang, translations)}
                </p>
                <span className="text-[10px] sm:text-[11px] text-[#D4AF37] font-extrabold uppercase tracking-wider mt-1.5 inline-flex items-center gap-1 group-hover:underline">
                  <span>{currentLang === 'ha' ? 'DUBA AYYUKA' : currentLang === 'ar' ? 'عرض المشاريع' : 'TRACK DELIVERABLES'}</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </button>

            {/* 4. Official Email Desk */}
            <a
              href="mailto:contact@danmayeyabo.gov.ng"
              className="group bg-[#08241B] hover:bg-[#0D3629] p-4 sm:p-5 rounded-2xl border border-[#C6A15B]/30 hover:border-[#D4AF37] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C6A15B] transition-all duration-300 shadow-md hover:shadow-xl active:scale-[0.985] flex items-center gap-3.5 cursor-pointer min-h-[108px]"
              title="Send Official Correspondence"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#103C2E] to-[#061D16] border border-[#C6A15B]/40 text-[#D4AF37] flex items-center justify-center shadow-md group-hover:scale-105 group-hover:border-[#D4AF37] transition-all duration-300 shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="font-['Manrope'] font-bold text-white text-xs sm:text-sm group-hover:text-[#D4AF37] transition-colors truncate uppercase tracking-wider">
                    {t('footerEmailTitle', currentLang, translations).toUpperCase()}
                  </h4>
                  <ExternalLink className="w-3.5 h-3.5 text-[#C6A15B] group-hover:text-[#D4AF37] shrink-0" />
                </div>
                <p className="text-xs text-stone-300 font-normal mt-0.5 leading-snug line-clamp-1">
                  {t('footerEmailSubtitle', currentLang, translations)}
                </p>
                <span className="text-[10px] sm:text-[11px] text-[#D4AF37] font-extrabold uppercase tracking-wider mt-1.5 inline-flex items-center gap-1 group-hover:underline truncate">
                  <span>SEND OFFICIAL EMAIL</span>
                  <ArrowRight className="w-3 h-3 shrink-0" />
                </span>
              </div>
            </a>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. MAIN FOOTER DIRECTORY & PARLIAMENTARY DETAILS */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Col 1: Representative Identity & Official Crest (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <OfficialCrest size="lg" className="shadow-md shrink-0" />
              <div>
                <h3 className="font-['Manrope'] font-bold text-white text-lg leading-tight">
                  Hon. Umar Yusuf
                </h3>
                <p className="text-xs text-[#D4AF37] font-semibold tracking-wide">
                  Danmaje Yabo
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
              {currentLang === 'ha'
                ? 'Dan Majalisar Wakilai, Majalisar Tarayya, Abuja. Mai wakiltar mazabar Yabo da Shagari, Jihar Sakkwato. An sadaukar da kai ga ingantaccen aikin dokoki da cigaban al\'umma.'
                : currentLang === 'ar'
                ? 'عضو مجلس النواب، الجمعية الوطنية، أبوجا. يمثل دائرة يابو وشاغاري الفيدرالية، ولاية سوكوتو. ملتزمون بالتشريع الفعال والتنمية القاعدية.'
                : 'Member representing Yabo/Shagari Federal Constituency at the House of Representatives, National Assembly, Abuja, Nigeria. Committed to responsive lawmaking and grassroots socio-economic transformation.'}
            </p>

            <div className="pt-1 flex items-center gap-2 text-[11px] text-[#C6A15B] font-medium">
              <Shield className="w-3.5 h-3.5 shrink-0" />
              <span>10th National Assembly of Nigeria • Federal Representative</span>
            </div>
          </div>

          {/* Col 2: Quick Links (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-['Manrope'] font-bold text-white text-sm uppercase tracking-wider text-[#D4AF37] border-b border-white/10 pb-2">
              {currentLang === 'ha' ? 'Hanyoyin Yanar Gizo' : currentLang === 'ar' ? 'البوابات والخدمات' : 'Official Portals'}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-stone-300">
              <li>
                <button onClick={() => navigateTo('home')} className="hover:text-[#D4AF37] transition flex items-center gap-1.5 cursor-pointer uppercase text-xs font-semibold">
                  <ChevronRight className="w-3.5 h-3.5 text-[#C6A15B] shrink-0" />
                  <span>{t('home', currentLang, translations).toUpperCase()}</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('biography')} className="hover:text-[#D4AF37] transition flex items-center gap-1.5 cursor-pointer uppercase text-xs font-semibold">
                  <ChevronRight className="w-3.5 h-3.5 text-[#C6A15B] shrink-0" />
                  <span>{t('biography', currentLang, translations).toUpperCase()}</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('projects')} className="hover:text-[#D4AF37] transition flex items-center gap-1.5 cursor-pointer uppercase text-xs font-semibold">
                  <ChevronRight className="w-3.5 h-3.5 text-[#C6A15B] shrink-0" />
                  <span>{t('projects', currentLang, translations).toUpperCase()}</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('legislative')} className="hover:text-[#D4AF37] transition flex items-center gap-1.5 cursor-pointer uppercase text-xs font-semibold">
                  <ChevronRight className="w-3.5 h-3.5 text-[#C6A15B] shrink-0" />
                  <span>{t('legislative', currentLang, translations).toUpperCase()}</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('empowerment')} className="hover:text-[#D4AF37] transition flex items-center gap-1.5 cursor-pointer uppercase text-xs font-semibold">
                  <ChevronRight className="w-3.5 h-3.5 text-[#C6A15B] shrink-0" />
                  <span>{t('empowerment', currentLang, translations).toUpperCase()}</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('gallery')} className="hover:text-[#D4AF37] transition flex items-center gap-1.5 cursor-pointer uppercase text-xs font-semibold">
                  <ChevronRight className="w-3.5 h-3.5 text-[#C6A15B] shrink-0" />
                  <span>{t('media', currentLang, translations).toUpperCase()}</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('news')} className="hover:text-[#D4AF37] transition flex items-center gap-1.5 cursor-pointer uppercase text-xs font-semibold">
                  <ChevronRight className="w-3.5 h-3.5 text-[#C6A15B] shrink-0" />
                  <span>{t('news', currentLang, translations).toUpperCase()}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Parliamentary & Liaison Desks (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-['Manrope'] font-bold text-white text-sm uppercase tracking-wider text-[#D4AF37] border-b border-white/10 pb-2">
              {t('officeLocationsTitle', currentLang, translations)}
            </h4>
            <ul className="space-y-3 text-xs text-stone-300">
              <li className="flex items-start space-x-2.5 rtl:space-x-reverse">
                <Landmark className="w-4 h-4 text-[#C6A15B] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">
                    {currentLang === 'ha' ? 'Majalisar Tarayya Abuja' : currentLang === 'ar' ? 'مجمع الجمعية الوطنية' : 'National Assembly Complex'}
                  </span>
                  <span className="text-stone-400">
                    {t('abujaOfficeAddress', currentLang, translations)}
                  </span>
                </div>
              </li>
              <li className="flex items-start space-x-2.5 rtl:space-x-reverse">
                <MapPin className="w-4 h-4 text-[#C6A15B] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">
                    {currentLang === 'ha' ? 'Ofishin Sadarwa na Yabo' : currentLang === 'ar' ? 'مكتب اتصال يابو' : 'Yabo Constituency Liaison Office'}
                  </span>
                  <span className="text-stone-400">
                    {t('yaboOfficeAddress', currentLang, translations)}
                  </span>
                </div>
              </li>
              <li className="flex items-start space-x-2.5 rtl:space-x-reverse">
                <MapPin className="w-4 h-4 text-[#C6A15B] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">
                    {currentLang === 'ha' ? 'Ofishin Sadarwa na Shagari' : currentLang === 'ar' ? 'مكتب اتصال شاغاري' : 'Shagari Liaison Desk'}
                  </span>
                  <span className="text-stone-400">
                    {t('shagariOfficeAddress', currentLang, translations)}
                  </span>
                </div>
              </li>
            </ul>
          </div>

          {/* Col 4: Communications & Public Service Hours (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-['Manrope'] font-bold text-white text-sm uppercase tracking-wider text-[#D4AF37] border-b border-white/10 pb-2">
              {currentLang === 'ha' ? 'Lokutan Aiki' : currentLang === 'ar' ? 'ساعات العمل' : 'Communications'}
            </h4>
            <div className="space-y-3 text-xs text-stone-300">
              <div className="flex items-start space-x-2.5 rtl:space-x-reverse">
                <Mail className="w-4 h-4 text-[#C6A15B] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">
                    {currentLang === 'ha' ? 'Imel na Ofis' : currentLang === 'ar' ? 'البريد الرسمي' : 'Official Email'}
                  </span>
                  <span className="text-stone-400 select-all">contact@danmayeyabo.gov.ng</span>
                </div>
              </div>

              <div className="flex items-start space-x-2.5 rtl:space-x-reverse">
                <Clock className="w-4 h-4 text-[#C6A15B] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">
                    {currentLang === 'ha' ? 'Lokacin Bude Kofa' : currentLang === 'ar' ? 'أوقات الدوام' : 'Citizen Desk Hours'}
                  </span>
                  <span className="text-stone-400">Mon – Fri: 9:00 AM – 5:00 PM</span>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-stone-400 leading-relaxed border-t border-white/10">
                {currentLang === 'ha'
                  ? 'Ana karbar korafe-korafe da bukatun manoma da al\'umma a kowane lokaci ta ofisoshinmu.'
                  : currentLang === 'ar'
                  ? 'يتم استقبال عرائض وطلبات أهالي الدائرة بشكل مستمر من خلال مكاتب الاتصال.'
                  : 'Constituency petitions, agricultural support, and community inquiries are received continuously through liaison desks.'}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. BOTTOM LEGAL & COPYRIGHT BAR */}
        {/* ========================================================================= */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <div className="select-none text-stone-400 transition" title="Official Parliamentary Portal">
            © {new Date().getFullYear()} {currentLang === 'ha' ? 'Ofishin Hon. Umar Yusuf (Danmaje Yabo). Duk Hakkoki a Tsare.' : currentLang === 'ar' ? 'مكتب النائب عمر يوسف (دانماجي يابو). جميع الحقوق محفوظة.' : 'Office of Hon. Umar Yusuf (Danmaje Yabo). All Rights Reserved.'}
          </div>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <button onClick={() => navigateTo('privacy')} className="hover:text-[#D4AF37] transition cursor-pointer font-bold text-xs uppercase">
              {t('privacyPolicy', currentLang, translations).toUpperCase()}
            </button>
            <button onClick={() => navigateTo('terms')} className="hover:text-[#D4AF37] transition cursor-pointer font-bold text-xs uppercase">
              {t('termsOfUse', currentLang, translations).toUpperCase()}
            </button>
            <button onClick={() => navigateTo('accessibility')} className="hover:text-[#D4AF37] transition cursor-pointer font-bold text-xs uppercase">
              {t('accessibility', currentLang, translations).toUpperCase()}
            </button>
            <button onClick={onOpenAdmin} className="bg-[#0A261E] hover:bg-[#103C2E] text-[#D4AF37] px-2.5 py-1.5 rounded-lg border border-[#C6A15B]/30 transition shadow-xs text-xs inline-flex items-center gap-1 cursor-pointer" title="Admin Access">
              <Shield className="w-3.5 h-3.5 inline text-[#C6A15B]" />
              <span className="font-bold text-[10px] uppercase">PORTAL ADMIN</span>
            </button>
          </div>
        </div>
      </div>

      <PrivacyModal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} currentLang={currentLang} translations={translations} />
      <TermsModal isOpen={termsOpen} onClose={() => setTermsOpen(false)} currentLang={currentLang} translations={translations} />
      <AccessibilityModal isOpen={accessibilityOpen} onClose={() => setAccessibilityOpen(false)} currentLang={currentLang} translations={translations} />
    </footer>
  );
};
