import React, { useState } from 'react';
import { MapPin, Mail, Phone, Shield, Clock, Landmark, Building2, ChevronRight, MessageCircle, Film, Image as ImageIcon } from 'lucide-react';
import { PrivacyModal } from './PrivacyModal';
import { TermsModal } from './TermsModal';
import { AccessibilityModal } from './AccessibilityModal';
import { Language } from '../utils/i18n';
import { OfficialCrest } from './OfficialCrest';

interface Props {
  setCurrentTab: (tab: string) => void;
  currentLang: Language;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<Props> = ({ setCurrentTab, currentLang, onOpenAdmin }) => {
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [accessibilityOpen, setAccessibilityOpen] = useState(false);
  const [secretClicks, setSecretClicks] = useState(0);

  const handleSecretAdminTrigger = () => {
    const next = secretClicks + 1;
    setSecretClicks(next);
    if (next >= 3) {
      setSecretClicks(0);
      onOpenAdmin();
    }
  };

  const navigateTo = (tab: string) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#071F17] text-white/90 pt-16 pb-12 border-t-2 border-[#C6A15B]/70 relative z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 mb-12">
        {/* Col 1: Representative Identity, Crest & 4 Quick-Access Icons */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center space-x-3">
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

          {/* Four Quick-Access Icons arranged horizontally with distinct colors: WhatsApp green, Gallery purple, Projects gold, Email blue */}
          <div className="flex items-center gap-2 pt-1">
            <a
              href="https://wa.me/2348000000000?text=Hello%20Hon.%20Umar%20Yusuf%20Danmaje%20Yabo,%20I%20am%20contacting%20from%20Yabo/Shagari%20Constituency."
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp Contact"
              className="w-9 h-9 rounded-xl bg-[#25D366] text-white flex items-center justify-center shadow hover:scale-110 transition-transform cursor-pointer"
              title="WhatsApp Constituency Chat"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
            </a>

            <button
              onClick={() => navigateTo('gallery')}
              aria-label="Media Gallery"
              className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow hover:scale-110 transition-transform cursor-pointer"
              title="Media & Gallery"
            >
              <Film className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigateTo('projects')}
              aria-label="Constituency Projects"
              className="w-9 h-9 rounded-xl bg-[#C6A15B] text-[#09291F] flex items-center justify-center shadow hover:scale-110 transition-transform cursor-pointer"
              title="Constituency Projects"
            >
              <Building2 className="w-4 h-4" />
            </button>

            <a
              href="mailto:contact@danmayeyabo.gov.ng"
              aria-label="Email Official Desk"
              className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow hover:scale-110 transition-transform cursor-pointer"
              title="Email Constituency Office"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
            {currentLang === 'ha'
              ? 'Dan Majalisar Wakilai, Majalisar Tarayya, Abuja. Mai wakiltar mazabar Yabo da Shagari, Jihar Sakkwato. An sadaukar da kai ga ingantaccen aikin dokoki da cigaban al\'umma.'
              : currentLang === 'ar'
              ? 'عضو مجلس النواب، الجمعية الوطنية، أبوجا. يمثل دائرة يابو وشاغاري الفيدرالية، ولاية سوكوتو. ملتزمون بالتشريع الفعال والتنمية القاعدية.'
              : 'Member representing Yabo/Shagari Federal Constituency at the House of Representatives, National Assembly, Abuja, Nigeria. Committed to responsive lawmaking and grassroots socio-economic transformation.'}
          </p>

          <div className="pt-1 flex items-center gap-2 text-[11px] text-[#C6A15B] font-medium">
            <Shield className="w-3.5 h-3.5" />
            <span>10th National Assembly of Nigeria • Federal Representative</span>
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div className="lg:col-span-3 space-y-3">
          <h4 className="font-['Manrope'] font-bold text-white text-sm uppercase tracking-wider text-[#D4AF37] border-b border-white/10 pb-2">
            {currentLang === 'ha' ? 'Hanyoyin Yanar Gizo' : currentLang === 'ar' ? 'البوابات والخدمات' : 'Official Portals'}
          </h4>
          <ul className="space-y-2 text-xs sm:text-sm text-stone-300">
            <li>
              <button onClick={() => navigateTo('home')} className="hover:text-[#D4AF37] transition flex items-center gap-1.5 cursor-pointer">
                <ChevronRight className="w-3.5 h-3.5 text-[#C6A15B]" />
                <span>Home Page</span>
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('biography')} className="hover:text-[#D4AF37] transition flex items-center gap-1.5 cursor-pointer">
                <ChevronRight className="w-3.5 h-3.5 text-[#C6A15B]" />
                <span>Biography & Official Profile</span>
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('projects')} className="hover:text-[#D4AF37] transition flex items-center gap-1.5 cursor-pointer">
                <ChevronRight className="w-3.5 h-3.5 text-[#C6A15B]" />
                <span>Projects & Capital Infrastructure</span>
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('legislative')} className="hover:text-[#D4AF37] transition flex items-center gap-1.5 cursor-pointer">
                <ChevronRight className="w-3.5 h-3.5 text-[#C6A15B]" />
                <span>Legislative Work & Bills Tracker</span>
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('empowerment')} className="hover:text-[#D4AF37] transition flex items-center gap-1.5 cursor-pointer">
                <ChevronRight className="w-3.5 h-3.5 text-[#C6A15B]" />
                <span>Empowerment & Welfare Schemes</span>
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('gallery')} className="hover:text-[#D4AF37] transition flex items-center gap-1.5 cursor-pointer">
                <ChevronRight className="w-3.5 h-3.5 text-[#C6A15B]" />
                <span>Media, Speeches & Videos</span>
              </button>
            </li>
            <li>
              <button onClick={() => navigateTo('news')} className="hover:text-[#D4AF37] transition flex items-center gap-1.5 cursor-pointer">
                <ChevronRight className="w-3.5 h-3.5 text-[#C6A15B]" />
                <span>News & Press Statements</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Parliamentary & Liaison Desks */}
        <div className="lg:col-span-3 space-y-3">
          <h4 className="font-['Manrope'] font-bold text-white text-sm uppercase tracking-wider text-[#D4AF37] border-b border-white/10 pb-2">
            {currentLang === 'ha' ? 'Ofisoshin Sadarwa' : currentLang === 'ar' ? 'مكاتب الاتصال' : 'Offices & Liaison Desks'}
          </h4>
          <ul className="space-y-3 text-xs text-stone-300">
            <li className="flex items-start space-x-2.5">
              <Landmark className="w-4 h-4 text-[#C6A15B] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">National Assembly Complex</span>
                <span className="text-stone-400">House of Representatives, Three Arms Zone, Abuja</span>
              </div>
            </li>
            <li className="flex items-start space-x-2.5">
              <MapPin className="w-4 h-4 text-[#C6A15B] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">Yabo Constituency Liaison Office</span>
                <span className="text-stone-400">Yabo Town Central, Yabo LGA, Sokoto State</span>
              </div>
            </li>
            <li className="flex items-start space-x-2.5">
              <MapPin className="w-4 h-4 text-[#C6A15B] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">Shagari Liaison Desk</span>
                <span className="text-stone-400">Shagari Local Government Area, Sokoto State</span>
              </div>
            </li>
          </ul>
        </div>

        {/* Col 4: Communications & Public Service Hours */}
        <div className="lg:col-span-2 space-y-3">
          <h4 className="font-['Manrope'] font-bold text-white text-sm uppercase tracking-wider text-[#D4AF37] border-b border-white/10 pb-2">
            {currentLang === 'ha' ? 'Lokutan Aiki' : currentLang === 'ar' ? 'ساعات العمل' : 'Communications'}
          </h4>
          <div className="space-y-3 text-xs text-stone-300">
            <div className="flex items-start space-x-2.5">
              <Mail className="w-4 h-4 text-[#C6A15B] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">Official Email</span>
                <span className="text-stone-400 select-all">contact@danmayeyabo.gov.ng</span>
              </div>
            </div>

            <div className="flex items-start space-x-2.5">
              <Clock className="w-4 h-4 text-[#C6A15B] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white block">Citizen Desk Hours</span>
                <span className="text-stone-400">Mon – Fri: 9:00 AM – 5:00 PM</span>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-stone-400 leading-relaxed border-t border-white/10">
              Constituency petitions, agricultural support, and community inquiries are received continuously through liaison desks.
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Copyright Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-xs text-stone-400 gap-4">
        <div onClick={handleSecretAdminTrigger} className="cursor-pointer select-none hover:text-stone-200 transition" title="Official Parliamentary Portal">
          © {new Date().getFullYear()} Office of Hon. Umar Yusuf (Danmaje Yabo). All Rights Reserved.
        </div>
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <button onClick={() => setPrivacyOpen(true)} className="hover:text-[#D4AF37] transition cursor-pointer">
            Privacy Policy
          </button>
          <button onClick={() => setTermsOpen(true)} className="hover:text-[#D4AF37] transition cursor-pointer">
            Terms of Use
          </button>
          <button onClick={() => setAccessibilityOpen(true)} className="hover:text-[#D4AF37] transition cursor-pointer">
            Accessibility Statement
          </button>
          <button onClick={onOpenAdmin} className="text-white/30 hover:text-white/80 transition text-[10px]" title="Admin Access">
            <Shield className="w-3.5 h-3.5 inline" />
          </button>
        </div>
      </div>

      <PrivacyModal isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />
      <TermsModal isOpen={termsOpen} onClose={() => setTermsOpen(false)} />
      <AccessibilityModal isOpen={accessibilityOpen} onClose={() => setAccessibilityOpen(false)} />
    </footer>
  );
};
