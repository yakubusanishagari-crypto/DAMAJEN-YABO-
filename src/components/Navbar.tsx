import React, { useState, useEffect } from 'react';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';
import { Language, t, Translations } from '../utils/i18n';
import { OfficialCrest } from './OfficialCrest';

interface Props {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentLang: Language;
  setCurrentLang: (lang: Language) => void;
  translations: Translations;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<Props> = ({ 
  currentTab, 
  setCurrentTab, 
  currentLang, 
  setCurrentLang, 
  translations, 
  onOpenAdmin 
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [legalDropdownOpen, setLegalDropdownOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        onOpenAdmin();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenAdmin]);

  // Primary Navigation Pages (All Capital Letters)
  const navItems = [
    { id: 'home', labelKey: 'home' },
    { id: 'biography', labelKey: 'biography' },
    { id: 'projects', labelKey: 'projects' },
    { id: 'legislative', labelKey: 'legislative' },
    { id: 'townhall', labelKey: 'townhall' },
    { id: 'empowerment', labelKey: 'empowerment' },
    { id: 'gallery', labelKey: 'media' },
    { id: 'news', labelKey: 'news' },
    { id: 'contact', labelKey: 'contact' },
  ];

  // Legal & Policy Navigation Pages (Clean text-only without decorative icons per user request)
  const legalNavItems = [
    { id: 'privacy', labelKey: 'privacyPolicy' },
    { id: 'terms', labelKey: 'termsOfUse' },
    { id: 'accessibility', labelKey: 'accessibility' },
  ];

  const handleNavClick = (id: string) => {
    setCurrentTab(id);
    setMobileMenuOpen(false);
    setLegalDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'ha', label: 'Hausa' },
    { code: 'ar', label: 'العربية (Arabic)' },
  ];

  const isLegalActive = ['privacy', 'terms', 'accessibility'].includes(currentTab);

  return (
    <header className="sticky top-0 z-40 bg-[#103C2E] text-white shadow-xl border-b border-[#C6A15B]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between">
        {/* Logo & Representative Identity */}
        <button 
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 text-left group focus:outline-none cursor-pointer"
        >
          <div className="relative shrink-0">
            <OfficialCrest size="lg" className="group-hover:scale-105 transition-transform duration-300 shadow-xl border-2 border-[#D4AF37] ring-2 ring-[#D4AF37]/30" />
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#103C2E]" title="Verified Official Representation"></div>
          </div>
          <div>
            <h1 className="font-['Manrope'] font-extrabold text-base sm:text-lg text-white leading-tight group-hover:text-[#C6A15B] transition">
              HON. UMAR YUSUF <span className="text-[#C6A15B] font-semibold">(DANMAJE YABO)</span>
            </h1>
            <p className="text-[10px] sm:text-[11px] text-white/85 tracking-wider uppercase font-semibold">
              {t('constituencyTitle', currentLang, translations)}
            </p>
          </div>
        </button>

        {/* Desktop Nav Items - All Pages in CAPITAL LETTERS */}
        <nav className="hidden 2xl:flex items-center space-x-1" aria-label="Main Navigation">
          {navItems.map((item) => {
            const active = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold tracking-wider uppercase transition cursor-pointer ${
                  active
                    ? 'bg-[#C6A15B] text-[#09291F] font-extrabold shadow-sm'
                    : 'text-white/90 hover:bg-white/10 hover:text-white'
                }`}
              >
                {t(item.labelKey, currentLang, translations).toUpperCase()}
              </button>
            );
          })}

          {/* Legal / Policy Dropdown in Navigation (Clean Text-Only) */}
          <div className="relative">
            <button
              onClick={() => setLegalDropdownOpen(!legalDropdownOpen)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold tracking-wider uppercase transition flex items-center gap-1 cursor-pointer ${
                isLegalActive
                  ? 'bg-[#C6A15B] text-[#09291F] font-extrabold shadow-sm'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span>POLICIES & LEGAL</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${legalDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {legalDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-[#0A261E] rounded-xl shadow-2xl border border-[#C6A15B]/40 py-2 z-50 animate-fadeIn">
                <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-[#D4AF37] border-b border-white/10 mb-1">
                  OFFICIAL STATEMENTS & CHARTERS
                </div>
                {legalNavItems.map((item) => {
                  const active = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full text-left px-3 py-2 text-xs font-bold tracking-wider uppercase transition cursor-pointer ${
                        active 
                          ? 'bg-[#D4AF37] text-[#09291F]' 
                          : 'text-white/90 hover:bg-white/10 hover:text-[#D4AF37]'
                      }`}
                    >
                      <span>{t(item.labelKey, currentLang, translations).toUpperCase()}</span>
                    </button>
                  );
                })}
                <div className="border-t border-white/10 my-1"></div>
                <button
                  onClick={() => handleNavClick('agent-portal')}
                  className={`w-full text-left px-3 py-2 text-xs font-bold tracking-wider uppercase transition cursor-pointer flex items-center justify-between ${
                    currentTab === 'agent-portal' 
                      ? 'bg-[#D4AF37] text-[#09291F]' 
                      : 'text-[#D4AF37] hover:bg-white/10'
                  }`}
                >
                  <span>AGENT TRANSMISSION DESK</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Compact Desktop Navigation for Standard Laptops (xl to 2xl) */}
        <nav className="hidden xl:flex 2xl:hidden items-center space-x-1" aria-label="Main Navigation Compact">
          {navItems.slice(0, 6).map((item) => {
            const active = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-2 py-1.5 rounded-lg text-[11px] font-bold tracking-wider uppercase transition cursor-pointer ${
                  active
                    ? 'bg-[#C6A15B] text-[#09291F] font-extrabold shadow-sm'
                    : 'text-white/90 hover:bg-white/10 hover:text-white'
                }`}
              >
                {t(item.labelKey, currentLang, translations).toUpperCase()}
              </button>
            );
          })}

          <div className="relative">
            <button
              onClick={() => setLegalDropdownOpen(!legalDropdownOpen)}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold tracking-wider uppercase transition flex items-center gap-1 cursor-pointer ${
                isLegalActive || currentTab === 'news' || currentTab === 'contact'
                  ? 'bg-[#C6A15B] text-[#09291F] font-extrabold shadow-sm'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span>MORE & LEGAL</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {legalDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-[#0A261E] rounded-xl shadow-2xl border border-[#C6A15B]/40 py-2 z-50 animate-fadeIn">
                <button
                  onClick={() => handleNavClick('news')}
                  className="w-full text-left px-4 py-2 text-xs font-bold tracking-wider uppercase text-white/90 hover:bg-white/10 hover:text-[#D4AF37]"
                >
                  {t('news', currentLang, translations).toUpperCase()}
                </button>
                <button
                  onClick={() => handleNavClick('contact')}
                  className="w-full text-left px-4 py-2 text-xs font-bold tracking-wider uppercase text-white/90 hover:bg-white/10 hover:text-[#D4AF37]"
                >
                  {t('contact', currentLang, translations).toUpperCase()}
                </button>
                <div className="border-t border-white/10 my-1"></div>
                <div className="px-4 py-1 text-[10px] font-extrabold uppercase tracking-widest text-[#D4AF37]">
                  OFFICIAL POLICIES
                </div>
                {legalNavItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className="w-full text-left px-4 py-2 text-xs font-bold tracking-wider uppercase text-white/80 hover:bg-white/10 hover:text-[#D4AF37]"
                  >
                    {t(item.labelKey, currentLang, translations).toUpperCase()}
                  </button>
                ))}
                <button
                  onClick={() => handleNavClick('agent-portal')}
                  className={`w-full text-left px-4 py-2 text-xs font-bold tracking-wider uppercase transition cursor-pointer flex items-center justify-between ${
                    currentTab === 'agent-portal'
                      ? 'bg-[#D4AF37] text-[#09291F]'
                      : 'text-[#D4AF37] hover:bg-white/10'
                  }`}
                >
                  <span>AGENT TRANSMISSION DESK</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* Right Controls: Multilingual Selector & Contact Action */}
        <div className="hidden xl:flex items-center gap-2.5">
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 bg-[#09291F] hover:bg-[#061D16] text-[#D4AF37] px-3.5 py-1.5 rounded-xl text-xs font-extrabold tracking-wider uppercase transition border border-[#C6A15B]/50 shadow-md cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-[#C6A15B]" />
              <span>{languages.find(l => l.code === currentLang)?.label}</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-stone-200 py-1.5 z-50 text-stone-800 animate-fadeIn">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => { setCurrentLang(l.code); setLangDropdownOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-xs font-bold uppercase transition flex items-center justify-between cursor-pointer ${
                      currentLang === l.code ? 'font-extrabold text-[#103C2E] bg-emerald-50' : 'hover:bg-stone-100'
                    }`}
                  >
                    <span>{l.label}</span>
                    {currentLang === l.code && <span className="w-2 h-2 rounded-full bg-[#103C2E]"></span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => handleNavClick('contact')}
            className="bg-gradient-to-r from-[#D4AF37] to-[#B38F44] hover:brightness-110 active:scale-[0.98] text-[#09291F] px-4 py-1.5 rounded-lg font-extrabold text-xs tracking-wider uppercase shadow-md transition cursor-pointer border border-[#E5C16C]"
          >
            {t('contactOffice', currentLang, translations).toUpperCase()}
          </button>
        </div>

        {/* Mobile Navigation Toggle & Quick Language Switcher */}
        <div className="xl:hidden flex items-center gap-2">
          <select
            value={currentLang}
            onChange={(e) => setCurrentLang(e.target.value as Language)}
            aria-label="Select Language"
            className="bg-[#09291F] text-[#D4AF37] font-extrabold text-xs px-2.5 py-1.5 rounded-xl border border-[#C6A15B]/50 focus:outline-none shadow-sm cursor-pointer"
          >
            <option value="en" className="text-black font-bold">EN</option>
            <option value="ha" className="text-black font-bold">HA</option>
            <option value="ar" className="text-black font-bold">AR</option>
          </select>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="bg-[#09291F] hover:bg-[#061D16] text-[#D4AF37] p-2 rounded-xl border border-[#C6A15B]/40 focus:outline-none cursor-pointer shadow-sm"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden mt-1 pt-3 pb-6 px-4 border-t border-white/10 space-y-1 bg-[#09291F] animate-fadeIn max-h-[85vh] overflow-y-auto">
          <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#D4AF37] px-4 py-1">
            PARLIAMENTARY PORTAL
          </div>

          {navItems.map((item) => {
            const active = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-extrabold tracking-wider uppercase transition cursor-pointer ${
                  active
                    ? 'bg-[#C6A15B] text-[#09291F]'
                    : 'text-white/90 hover:bg-white/10 hover:text-white'
                }`}
              >
                {t(item.labelKey, currentLang, translations).toUpperCase()}
              </button>
            );
          })}

          <div className="pt-2 pb-1 border-t border-white/10 my-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#D4AF37] px-4">
              POLICIES & LEGAL STATEMENTS
            </span>
          </div>

          {legalNavItems.map((item) => {
            const active = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-extrabold tracking-wider uppercase transition cursor-pointer ${
                  active
                    ? 'bg-[#C6A15B] text-[#09291F]'
                    : 'text-stone-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span>{t(item.labelKey, currentLang, translations).toUpperCase()}</span>
              </button>
            );
          })}

          <div className="pt-2 border-t border-white/10 mt-2">
            <button
              onClick={() => handleNavClick('agent-portal')}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-black tracking-wider uppercase transition cursor-pointer flex items-center justify-between ${
                currentTab === 'agent-portal'
                  ? 'bg-[#D4AF37] text-[#09291F]'
                  : 'bg-emerald-900/60 text-[#D4AF37] border border-[#C6A15B]/30'
              }`}
            >
              <span>AGENT TRANSMISSION DESK</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
