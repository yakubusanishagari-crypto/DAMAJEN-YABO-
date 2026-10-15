import React from 'react';
import { ShieldCheck, FileText, Eye, ArrowLeft, CheckCircle, Mail, MapPin } from 'lucide-react';
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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12 space-y-8 animate-fadeIn">
      {/* Back button */}
      <button
        onClick={() => {
          setCurrentTab('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className="inline-flex items-center gap-2 text-xs font-bold text-[#103C2E] hover:text-[#C6A15B] transition uppercase tracking-wider cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>BACK TO HOME</span>
      </button>

      {/* Main Container */}
      <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden">
        {/* Header Banner */}
        <div className="bg-[#103C2E] text-white p-8 sm:p-10 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-2">
            {type === 'privacy' && <ShieldCheck className="w-7 h-7 text-[#D4AF37]" />}
            {type === 'terms' && <FileText className="w-7 h-7 text-[#D4AF37]" />}
            {type === 'accessibility' && <Eye className="w-7 h-7 text-[#D4AF37]" />}
            <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
              Official Parliamentary Transparency
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold font-['Manrope'] text-white">
            {currentTitle}
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 mt-2">
            Office of Hon. Umar Yusuf (Danmaje Yabo) • 10th National Assembly, Abuja
          </p>
        </div>

        {/* Content Body */}
        <div className="p-8 sm:p-12 space-y-8 text-stone-800 text-sm sm:text-base leading-relaxed">
          {type === 'privacy' && (
            <>
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-xs sm:text-sm text-[#103C2E]">
                <strong>Constitutional Assurance:</strong> We respect citizen privacy and ensure all public submissions through this portal adhere to the Nigeria Data Protection Act (NDPA) and strict parliamentary ethics.
              </div>

              <div className="space-y-3">
                <h2 className="text-lg font-bold text-[#103C2E]">1. Scope & Information Collected</h2>
                <p className="text-stone-600 font-normal">
                  When you submit inquiries, community petitions, or empowerment applications through this portal, we may securely record your full name, email address, phone number, ward/constituency address, and application statements.
                </p>
              </div>

              <div className="space-y-3">
                <h2 className="text-lg font-bold text-[#103C2E]">2. Purpose of Data Processing</h2>
                <p className="text-stone-600 font-normal">
                  Your data is used solely to verify eligibility for empowerment programs, dispatch notifications regarding community projects in your ward, and facilitate responsive constituent liaison services.
                </p>
              </div>

              <div className="space-y-3">
                <h2 className="text-lg font-bold text-[#103C2E]">3. Data Security & Storage</h2>
                <p className="text-stone-600 font-normal">
                  Records are maintained with state-of-the-art encryption and access-controlled databases. We do not sell, rent, or distribute personal information to commercial third parties.
                </p>
              </div>

              <div className="space-y-3">
                <h2 className="text-lg font-bold text-[#103C2E]">4. Citizen Rights</h2>
                <p className="text-stone-600 font-normal">
                  You hold the right to inspect, update, or request the deletion of your personal submissions at any time by writing directly to our constituency communications office.
                </p>
              </div>
            </>
          )}

          {type === 'terms' && (
            <>
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-xs sm:text-sm text-[#103C2E]">
                <strong>Official Protocol:</strong> This platform is the verified online portal of Hon. Umar Yusuf (Danmaje Yabo), Member of the House of Representatives representing Yabo/Shagari Federal Constituency.
              </div>

              <div className="space-y-3">
                <h2 className="text-lg font-bold text-[#103C2E]">1. Authorized Usage</h2>
                <p className="text-stone-600 font-normal">
                  Constituents and members of the public are welcomed to browse records, track legislative bills, download gazettes, and apply for verified empowerment initiatives in good faith.
                </p>
              </div>

              <div className="space-y-3">
                <h2 className="text-lg font-bold text-[#103C2E]">2. Official Media & Copyright</h2>
                <p className="text-stone-600 font-normal">
                  Photographs, video recordings, official speeches, and project reports published on this website are authentic records of the representative's office. Malicious alteration or misrepresentation is prohibited.
                </p>
              </div>

              <div className="space-y-3">
                <h2 className="text-lg font-bold text-[#103C2E]">3. Empowerment & Scheme Guidelines</h2>
                <p className="text-stone-600 font-normal">
                  Participation in empowerment programs is subject to transparent verification by the constituency welfare board. All applications are free of charge. No representative or official will ever request fees or payments for forms.
                </p>
              </div>
            </>
          )}

          {type === 'accessibility' && (
            <>
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-xs sm:text-sm text-[#103C2E]">
                <strong>Equal Access Principle:</strong> Our legislative mandate serves all citizens equally, including persons with disabilities and varying internet connectivity.
              </div>

              <div className="space-y-3">
                <h2 className="text-lg font-bold text-[#103C2E]">1. Technical Accessibility Standards</h2>
                <p className="text-stone-600 font-normal">
                  This portal is engineered to conform with Web Content Accessibility Guidelines (WCAG 2.2 AA), providing high-contrast color choices, readable typographic scale, structured heading hierarchy, and full keyboard navigation support.
                </p>
              </div>

              <div className="space-y-3">
                <h2 className="text-lg font-bold text-[#103C2E]">2. Multilingual Inclusivity</h2>
                <p className="text-stone-600 font-normal">
                  To ensure accessibility for all constituents across Yabo and Shagari, this portal provides native translation support in English, Hausa (the primary language of our communities), and Arabic.
                </p>
              </div>

              <div className="space-y-3">
                <h2 className="text-lg font-bold text-[#103C2E]">3. Accessible Assistance</h2>
                <p className="text-stone-600 font-normal">
                  Should you experience any challenge accessing any document or applying for any scheme, our liaison desks in Yabo, Shagari, and Abuja are staffed to offer personal assistance.
                </p>
              </div>
            </>
          )}

          {/* Contact Box */}
          <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 text-xs text-stone-600">
            <h4 className="font-bold text-sm text-[#103C2E]">Inquiries & Assistance</h4>
            <p>Direct all legal, privacy, and accessibility questions to the Constituency Secretariat:</p>
            <div className="flex flex-col sm:flex-row gap-4 pt-1 font-medium">
              <span className="flex items-center gap-1.5 text-[#103C2E]">
                <Mail className="w-4 h-4 text-[#C6A15B]" /> contact@danmayeyabo.gov.ng
              </span>
              <span className="flex items-center gap-1.5 text-[#103C2E]">
                <MapPin className="w-4 h-4 text-[#C6A15B]" /> Three Arms Zone, Abuja & Yabo Town Central
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
