import React, { useState, useEffect } from 'react';
import { 
  MapPin, Mail, Phone, Clock, Send, CheckCircle, Shield, 
  Building2, FileText, Search, Download, AlertCircle, Check, 
  Users, ChevronRight, HelpCircle, Landmark, ExternalLink
} from 'lucide-react';
import { Language, t, Translations } from '../utils/i18n';
import { CommunityPetition, PetitionCategory, PetitionStatus } from '../types';
import { INITIAL_PETITIONS } from '../data/initialData';

interface Props {
  currentLang?: Language;
  translations?: Translations;
}

export const ContactPage: React.FC<Props> = ({ currentLang = 'en', translations }) => {
  const [activeMode, setActiveMode] = useState<'message' | 'petition' | 'track'>('message');

  // Contact Form Data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'General Inquiry',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Petition Submission Data
  const [petitionData, setPetitionData] = useState<{
    title: string;
    category: PetitionCategory;
    petitionerName: string;
    petitionerEmail: string;
    petitionerPhone: string;
    ward: string;
    localGovernment: 'Yabo' | 'Shagari';
    address: string;
    description: string;
    expectedImpact: string;
    signatoriesCount: number;
  }>({
    title: '',
    category: 'Infrastructure & Roads',
    petitionerName: '',
    petitionerEmail: '',
    petitionerPhone: '',
    ward: 'Yabo Central Ward',
    localGovernment: 'Yabo',
    address: '',
    description: '',
    expectedImpact: '',
    signatoriesCount: 15
  });

  const [submittedPetitionRef, setSubmittedPetitionRef] = useState<string | null>(null);

  // Tracking Petition
  const [searchRef, setSearchRef] = useState('');
  const [trackedPetition, setTrackedPetition] = useState<CommunityPetition | null>(null);
  const [trackError, setTrackError] = useState('');

  // Petitions state from localStorage / initialData
  const [allPetitions, setAllPetitions] = useState<CommunityPetition[]>(() => {
    const saved = localStorage.getItem('danmaje_petitions');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_PETITIONS;
  });

  useEffect(() => {
    // Attempt fetch from backend
    fetch('/api/petitions')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setAllPetitions(data);
          localStorage.setItem('danmaje_petitions', JSON.stringify(data));
        }
      })
      .catch(() => {});
  }, []);

  const isRtl = currentLang === 'ar';

  const wardsList = [
    'Yabo Central Ward',
    'Kuchi Ward',
    'Torankawa Ward',
    'Bakale Ward',
    'Birnin Ruwa Ward',
    'Shagari North Ward',
    'Shagari South Ward',
    'Dandin Mahe Ward',
    'Kambama Ward',
    'Horo Birni Ward'
  ];

  // Submit standard message
  const handleSubmitMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const newContactItem = {
      id: `con-${Date.now()}`,
      ...formData,
      date: new Date().toISOString().split('T')[0],
      status: 'Unread'
    };

    try {
      await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
    } catch {}

    try {
      const savedContacts = JSON.parse(localStorage.getItem('danmaje_contacts') || '[]');
      savedContacts.unshift(newContactItem);
      localStorage.setItem('danmaje_contacts', JSON.stringify(savedContacts));
    } catch {}

    setSuccess(true);
    setFormData({ name: '', email: '', phone: '', category: 'General Inquiry', message: '' });
    setSubmitting(false);
  };

  // Submit formal petition
  const handleSubmitPetition = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newRef = `PET-YS-${new Date().getFullYear()}-${randomSuffix}`;

    const newPet: CommunityPetition = {
      id: `pet-${Date.now()}`,
      referenceNumber: newRef,
      ...petitionData,
      status: 'Submitted',
      submittedDate: new Date().toISOString().split('T')[0],
      reviewNotes: 'Formally received via online constituent portal; queued for liaison committee evaluation.'
    };

    try {
      await fetch('/api/petitions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPet)
      });
    } catch {}

    const updated = [newPet, ...allPetitions];
    setAllPetitions(updated);
    localStorage.setItem('danmaje_petitions', JSON.stringify(updated));

    setSubmittedPetitionRef(newRef);
    setTrackedPetition(newPet);
    setSubmitting(false);
  };

  // Look up petition by reference
  const handleTrackPetition = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setTrackError('');
    const query = searchRef.trim().toUpperCase();
    if (!query) return;

    const found = allPetitions.find(p => 
      p.referenceNumber.toUpperCase() === query || 
      (p.petitionerEmail || p.email || '').toUpperCase() === query ||
      p.id.toUpperCase() === query
    );

    if (found) {
      setTrackedPetition(found);
    } else {
      setTrackedPetition(null);
      setTrackError(`No petition found matching reference "${query}". Please verify your reference number (e.g. PET-YS-2026-0041).`);
    }
  };

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-12 ${isRtl ? 'rtl text-right' : ''}`}>
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#09291F] via-[#103C2E] to-[#0A261E] text-white rounded-3xl p-8 sm:p-12 shadow-2xl space-y-4 border border-[#C6A15B]/30 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#C6A15B]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex items-center gap-3">
          <img src="/official_logo.png" alt="Official Seal" className="w-10 h-10 rounded-full border border-[#D4AF37] object-contain bg-[#07241A] shadow-md shrink-0" />
          <span className="inline-block text-xs font-extrabold uppercase tracking-widest text-[#D4AF37] bg-[#D4AF37]/20 px-3 py-1 rounded-full border border-[#D4AF37]/30">
            {currentLang === 'ha' ? 'Ofishin Sadarwa na Mazaba' : currentLang === 'ar' ? 'مكتب التواصل وخدمة الدائرة' : 'Constituency Liaison & Petitions Desk'}
          </span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-['Manrope'] text-white">
          {t('contactOffice', currentLang, translations)}
        </h1>
        <p className="text-stone-300 text-sm sm:text-base max-w-2xl leading-relaxed font-light">
          {currentLang === 'ha'
            ? 'Yi magana kai tsaye da ofishin Hon. Umar Yusuf (Danmaje Yabo). Aika bukatun aiki, korafe-korafe, ko shawarwarin cigaban al\'umma.'
            : currentLang === 'ar'
            ? 'تواصل مباشرة مع مكتب سعادة النائب عمر يوسف (دانماجي يابو). أرسل استفساراتك، مقترحاتك ومطالبك التنموية للدائرة.'
            : 'Get in touch directly with the office of Hon. Umar Yusuf (Danmaje Yabo). Submit messages, register formal community petitions, or track review decisions.'}
        </p>

        {/* Mode Selector Tabs */}
        <div className="pt-2 flex flex-wrap gap-2 text-xs font-bold">
          <button
            onClick={() => { setActiveMode('message'); setSuccess(false); }}
            className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-2 ${
              activeMode === 'message'
                ? 'bg-[#C6A15B] text-[#09291F] shadow'
                : 'bg-white/10 text-stone-200 hover:bg-white/20'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>GENERAL MESSAGE / ENQUIRY</span>
          </button>

          <button
            onClick={() => { setActiveMode('petition'); setSubmittedPetitionRef(null); }}
            className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-2 ${
              activeMode === 'petition'
                ? 'bg-[#C6A15B] text-[#09291F] shadow'
                : 'bg-white/10 text-stone-200 hover:bg-white/20'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>SUBMIT OFFICIAL PETITION</span>
          </button>

          <button
            onClick={() => { setActiveMode('track'); setTrackError(''); }}
            className={`px-4 py-2 rounded-xl transition cursor-pointer flex items-center gap-2 ${
              activeMode === 'track'
                ? 'bg-[#C6A15B] text-[#09291F] shadow'
                : 'bg-white/10 text-stone-200 hover:bg-white/20'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>TRACK PETITION & OFFICIAL DECISION</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left: Office Information */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-stone-200/80 space-y-6">
            <h3 className="font-['Manrope'] font-bold text-2xl text-[#103C2E]">
              {t('officeLocationsTitle', currentLang, translations)}
            </h3>
            
            <ul className="space-y-6 text-sm text-[#242824]">
              <li className="flex items-start space-x-4 rtl:space-x-reverse">
                <div className="w-11 h-11 rounded-xl bg-[#103C2E]/10 text-[#103C2E] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <Building2 className="w-5 h-5 text-[#C6A15B]" />
                </div>
                <div>
                  <strong className="block font-['Manrope'] font-bold text-base text-[#103C2E]">
                    {t('abujaOffice', currentLang, translations)}
                  </strong>
                  <span className="text-[#6B716D] leading-relaxed block mt-0.5">
                    Suite 3.24, House of Representatives Wing, National Assembly Complex, Three Arms Zone, Abuja, FCT
                  </span>
                </div>
              </li>
              
              <li className="flex items-start space-x-4 rtl:space-x-reverse">
                <div className="w-11 h-11 rounded-xl bg-[#103C2E]/10 text-[#103C2E] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <MapPin className="w-5 h-5 text-[#C6A15B]" />
                </div>
                <div>
                  <strong className="block font-['Manrope'] font-bold text-base text-[#103C2E]">
                    {t('constituencyOffice', currentLang, translations)}
                  </strong>
                  <span className="text-[#6B716D] leading-relaxed block mt-0.5">
                    Danmaje Civic Liaison Secretariat, Main Sokoto-Jega Highway, Yabo Metropolis, Sokoto State
                  </span>
                </div>
              </li>

              <li className="flex items-start space-x-4 rtl:space-x-reverse">
                <div className="w-11 h-11 rounded-xl bg-[#103C2E]/10 text-[#103C2E] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <Building2 className="w-5 h-5 text-[#C6A15B]" />
                </div>
                <div>
                  <strong className="block font-['Manrope'] font-bold text-base text-[#103C2E]">
                    Shagari Sub-Liaison Desk
                  </strong>
                  <span className="text-[#6B716D] leading-relaxed block mt-0.5">
                    Opposite LGA Secretariat, Shagari Town, Sokoto State
                  </span>
                </div>
              </li>

              <li className="flex items-start space-x-4 rtl:space-x-reverse">
                <div className="w-11 h-11 rounded-xl bg-[#103C2E]/10 text-[#103C2E] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <Phone className="w-5 h-5 text-[#C6A15B]" />
                </div>
                <div>
                  <strong className="block font-['Manrope'] font-bold text-base text-[#103C2E]">
                    {currentLang === 'ha' ? 'Layin Tuntuba' : currentLang === 'ar' ? 'أرقام الاتصال الرسمية' : 'Official Helplines'}
                  </strong>
                  <span className="text-[#6B716D] font-mono block mt-0.5">+234 803 000 0000 / +234 809 111 2222</span>
                </div>
              </li>

              <li className="flex items-start space-x-4 rtl:space-x-reverse">
                <div className="w-11 h-11 rounded-xl bg-[#103C2E]/10 text-[#103C2E] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <Mail className="w-5 h-5 text-[#C6A15B]" />
                </div>
                <div>
                  <strong className="block font-['Manrope'] font-bold text-base text-[#103C2E]">
                    {currentLang === 'ha' ? 'Adireshin Imel' : currentLang === 'ar' ? 'البريد الإلكتروني المعتمد' : 'Official Inquiries Email'}
                  </strong>
                  <span className="text-[#6B716D] font-mono block mt-0.5">contact@danmayeyabo.gov.ng</span>
                </div>
              </li>

              <li className="flex items-start space-x-4 rtl:space-x-reverse">
                <div className="w-11 h-11 rounded-xl bg-[#103C2E]/10 text-[#103C2E] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <Clock className="w-5 h-5 text-[#C6A15B]" />
                </div>
                <div>
                  <strong className="block font-['Manrope'] font-bold text-base text-[#103C2E]">
                    {t('workingHoursTitle', currentLang, translations)}
                  </strong>
                  <span className="text-[#6B716D]">
                    {currentLang === 'ha' ? 'Litinin – Juma\'a: 9:00 na safe – 4:00 na yamma' : currentLang === 'ar' ? 'الاثنين – الجمعة: 9:00 صباحاً – 4:00 مساءً' : 'Monday – Friday: 9:00 AM – 4:00 PM (WAT)'}
                  </span>
                </div>
              </li>
            </ul>

            <div className="bg-[#FAF9F5] p-5 rounded-2xl border border-[#C6A15B]/30 text-xs text-[#6B716D] space-y-1">
              <span className="font-bold text-[#103C2E] block">
                {currentLang === 'ha' ? 'Sanarwar Ofishin Sadarwa:' : currentLang === 'ar' ? 'ملاحظة مكتب التواصل:' : 'Constituency Liaison Note:'}
              </span>
              <p>
                All petitions and submissions are securely recorded. Official approval and rejection decisions are dispatched with an automated formal letter explaining committee reasoning and encouraging continued community participation.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Dynamic Interactive Section */}
        <div className="lg:col-span-7">
          {/* TAB 1: GENERAL MESSAGE */}
          {activeMode === 'message' && (
            <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-stone-200/80 space-y-6">
              <h3 className="font-['Manrope'] font-bold text-2xl text-[#103C2E]">
                {currentLang === 'ha' ? 'Aika Sako ko Tambaya' : currentLang === 'ar' ? 'إرسال رسالة أو استفسار' : 'Send Official Message or Enquiry'}
              </h3>
              
              {success ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-8 rounded-2xl text-center space-y-4 animate-fadeIn">
                  <CheckCircle className="w-14 h-14 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-xl font-['Manrope']">
                    {currentLang === 'ha' ? 'An Aika Sakonku Cikin Nasara' : currentLang === 'ar' ? 'تم إرسال رسالتكم بنجاح' : 'Message Sent Successfully'}
                  </h4>
                  <p className="text-sm max-w-md mx-auto">
                    Thank you for reaching out. Your enquiry has been securely logged with the constituency office and correspondence team.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="bg-[#103C2E] hover:bg-[#09291F] text-white px-7 py-3 rounded-xl font-bold text-sm shadow transition cursor-pointer uppercase tracking-wider"
                  >
                    SEND ANOTHER MESSAGE
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitMessage} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#103C2E]">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="e.g. Malam Umar Yabo"
                        className="w-full px-4 py-3 bg-[#FAF9F5] border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#103C2E]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#103C2E]">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="citizen@gmail.com"
                        className="w-full px-4 py-3 bg-[#FAF9F5] border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#103C2E]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#103C2E]">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="+234 803 000 0000"
                        className="w-full px-4 py-3 bg-[#FAF9F5] border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#103C2E]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#103C2E]">Enquiry Category *</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full px-4 py-3 bg-[#FAF9F5] border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#103C2E]"
                      >
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Project Support">Project Support & Request</option>
                        <option value="Community Issue">Community Issue / Grievance</option>
                        <option value="Empowerment Inquiry">Empowerment Programme Inquiry</option>
                        <option value="Media Request">Media & Press Request</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#103C2E]">Your Message *</label>
                    <textarea
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder="Provide details of your message, enquiry, or community issue..."
                      className="w-full px-4 py-3 bg-[#FAF9F5] border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#103C2E]"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#103C2E] hover:bg-[#09291F] text-white py-3.5 rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer border border-[#C6A15B]/30 uppercase tracking-wider"
                  >
                    <Send className="w-4 h-4 text-[#C6A15B]" />
                    <span>{submitting ? 'SENDING MESSAGE...' : 'SUBMIT OFFICIAL MESSAGE'}</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: SUBMIT OFFICIAL COMMUNITY PETITION */}
          {activeMode === 'petition' && (
            <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-stone-200/80 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] block">
                  Official Constituency Grievance Redress Mechanism
                </span>
                <h3 className="font-['Manrope'] font-bold text-2xl text-[#103C2E] mt-0.5">
                  Submit Formal Community Petition
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Petitions are formally submitted to the Constituency Legislative Advisory Committee. When reviewed, an official respectful decision letter will be dispatched to you explaining the decision and next steps.
                </p>
              </div>

              {submittedPetitionRef ? (
                <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-8 rounded-2xl text-center space-y-4 animate-fadeIn">
                  <CheckCircle className="w-14 h-14 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-xl font-['Manrope']">Petition Submitted Successfully!</h4>
                  <div className="bg-white p-4 rounded-xl border border-emerald-200 inline-block font-mono text-sm font-bold text-[#103C2E]">
                    Reference Number: <span className="text-[#C6A15B] text-base">{submittedPetitionRef}</span>
                  </div>
                  <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
                    Please save this reference number. Our committee reviews all petitions systematically. You can track your petition status anytime using the tracking tab above.
                  </p>
                  <div className="flex flex-wrap justify-center gap-3 pt-2">
                    <button
                      onClick={() => { setActiveMode('track'); setSearchRef(submittedPetitionRef); handleTrackPetition(); }}
                      className="bg-[#103C2E] text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase"
                    >
                      Track Petition Now
                    </button>
                    <button
                      onClick={() => setSubmittedPetitionRef(null)}
                      className="bg-stone-200 text-stone-700 px-5 py-2.5 rounded-xl font-bold text-xs uppercase"
                    >
                      Submit Another Petition
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitPetition} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#103C2E]">Petition Subject / Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Petition for Culvert Rehabilitation on Kuchi-Bakale Link Road"
                      value={petitionData.title}
                      onChange={(e) => setPetitionData({...petitionData, title: e.target.value})}
                      className="w-full px-4 py-3 bg-[#FAF9F5] border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#103C2E]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#103C2E]">Category *</label>
                      <select
                        value={petitionData.category}
                        onChange={(e) => setPetitionData({...petitionData, category: e.target.value as any})}
                        className="w-full px-4 py-3 bg-[#FAF9F5] border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#103C2E]"
                      >
                        <option value="Infrastructure & Roads">Infrastructure & Roads</option>
                        <option value="Water & Boreholes">Water & Boreholes</option>
                        <option value="Healthcare & Clinics">Healthcare & Clinics</option>
                        <option value="School Rehabilitation">School Rehabilitation</option>
                        <option value="Youth & Women Empowerment">Youth & Women Empowerment</option>
                        <option value="Electricity & Energy">Electricity & Energy</option>
                        <option value="Agricultural Support">Agricultural Support</option>
                        <option value="Public Security & Welfare">Public Security & Welfare</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#103C2E]">Local Government *</label>
                      <select
                        value={petitionData.localGovernment}
                        onChange={(e) => setPetitionData({...petitionData, localGovernment: e.target.value as any})}
                        className="w-full px-4 py-3 bg-[#FAF9F5] border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#103C2E]"
                      >
                        <option value="Yabo">Yabo Local Government</option>
                        <option value="Shagari">Shagari Local Government</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#103C2E]">Ward *</label>
                      <select
                        value={petitionData.ward}
                        onChange={(e) => setPetitionData({...petitionData, ward: e.target.value})}
                        className="w-full px-4 py-3 bg-[#FAF9F5] border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#103C2E]"
                      >
                        {wardsList.map(w => (
                          <option key={w} value={w}>{w}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#103C2E]">Estimated Co-Signatories / Households *</label>
                      <input
                        type="number"
                        min={1}
                        required
                        value={petitionData.signatoriesCount}
                        onChange={(e) => setPetitionData({...petitionData, signatoriesCount: parseInt(e.target.value) || 1})}
                        className="w-full px-4 py-3 bg-[#FAF9F5] border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#103C2E]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#103C2E]">Lead Petitioner Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Alhaji Musa Bakale"
                        value={petitionData.petitionerName}
                        onChange={(e) => setPetitionData({...petitionData, petitionerName: e.target.value})}
                        className="w-full px-4 py-3 bg-[#FAF9F5] border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#103C2E]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#103C2E]">Petitioner Email (for official response) *</label>
                      <input
                        type="email"
                        required
                        placeholder="petitioner@gmail.com"
                        value={petitionData.petitionerEmail}
                        onChange={(e) => setPetitionData({...petitionData, petitionerEmail: e.target.value})}
                        className="w-full px-4 py-3 bg-[#FAF9F5] border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#103C2E]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#103C2E]">Petitioner Phone *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+234 803 000 0000"
                        value={petitionData.petitionerPhone}
                        onChange={(e) => setPetitionData({...petitionData, petitionerPhone: e.target.value})}
                        className="w-full px-4 py-3 bg-[#FAF9F5] border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#103C2E]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#103C2E]">Detailed Petition Statement & Facts *</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Clearly articulate the community problem, geographical landmarks, affected residents, and requested parliamentary/constituency intervention..."
                      value={petitionData.description}
                      onChange={(e) => setPetitionData({...petitionData, description: e.target.value})}
                      className="w-full px-4 py-3 bg-[#FAF9F5] border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#103C2E]"
                    ></textarea>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#103C2E]">Expected Community Impact</label>
                    <input
                      type="text"
                      placeholder="e.g. Directly impacts 500 farming families by restoring wet-season vehicular transit."
                      value={petitionData.expectedImpact}
                      onChange={(e) => setPetitionData({...petitionData, expectedImpact: e.target.value})}
                      className="w-full px-4 py-3 bg-[#FAF9F5] border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#103C2E]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#103C2E] hover:bg-[#09291F] text-white py-3.5 rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer border border-[#C6A15B]/30 uppercase tracking-wider"
                  >
                    <Send className="w-4 h-4 text-[#C6A15B]" />
                    <span>{submitting ? 'RECORDING PETITION...' : 'SUBMIT FORMAL COMMUNITY PETITION'}</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: TRACK PETITION & OFFICIAL DECISION */}
          {activeMode === 'track' && (
            <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-stone-200/80 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] block">
                  Constituent Public Registry
                </span>
                <h3 className="font-['Manrope'] font-bold text-2xl text-[#103C2E] mt-0.5">
                  Track Petition Status & Official Decision
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Enter your petition reference number or petitioner email to inspect the administrative progress, status, and official decision letter.
                </p>
              </div>

              {/* Search Form */}
              <form onSubmit={handleTrackPetition} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="Enter Reference (e.g. PET-YS-2026-0038) or Email..."
                    value={searchRef}
                    onChange={(e) => setSearchRef(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#FAF9F5] border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#103C2E] font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[#103C2E] hover:bg-[#09291F] text-white px-5 py-3 rounded-xl font-bold text-xs uppercase cursor-pointer transition shadow"
                >
                  TRACK
                </button>
              </form>

              {trackError && (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{trackError}</span>
                </div>
              )}

              {/* Display Tracked Petition */}
              {trackedPetition && (
                <div className="space-y-6 pt-2 animate-fadeIn">
                  {/* Status Strip */}
                  <div className="p-5 rounded-2xl bg-[#FAF9F5] border border-stone-200 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-mono text-xs font-bold text-[#103C2E] bg-white px-3 py-1 rounded-lg border border-stone-200">
                        {trackedPetition.referenceNumber}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        trackedPetition.status === 'Approved' ? 'bg-emerald-100 text-emerald-900 border-emerald-300' :
                        trackedPetition.status === 'Rejected' ? 'bg-rose-100 text-rose-900 border-rose-300' :
                        trackedPetition.status === 'Under Review' ? 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse' :
                        'bg-sky-100 text-sky-900 border-sky-300'
                      }`}>
                        STATUS: {trackedPetition.status.toUpperCase()}
                      </span>
                    </div>

                    <h4 className="font-bold text-lg text-[#103C2E] font-['Manrope']">
                      {trackedPetition.title}
                    </h4>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-stone-600 font-medium">
                      <div>
                        <span className="text-stone-400 block">Lead Petitioner:</span>
                        <strong className="text-stone-800">{trackedPetition.petitionerName}</strong>
                      </div>
                      <div>
                        <span className="text-stone-400 block">Ward:</span>
                        <strong className="text-stone-800">{trackedPetition.ward}</strong>
                      </div>
                      <div>
                        <span className="text-stone-400 block">Date Lodged:</span>
                        <strong className="text-stone-800">{trackedPetition.submittedDate}</strong>
                      </div>
                      <div>
                        <span className="text-stone-400 block">Signatories:</span>
                        <strong className="text-stone-800">{trackedPetition.signatoriesCount} households</strong>
                      </div>
                    </div>
                  </div>

                  {/* OFFICIAL RESPECTFUL DECISION MESSAGE (IF APPROVED OR REJECTED) */}
                  {trackedPetition.decisionMessage ? (
                    <div className="bg-white rounded-2xl border-2 border-[#C6A15B]/50 p-6 sm:p-8 space-y-5 shadow-lg relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#C6A15B]/10 rounded-full blur-2xl pointer-events-none"></div>

                      <div className="flex items-center justify-between border-b border-stone-200 pb-4">
                        <div className="flex items-center gap-3">
                          <img src="/official_logo.png" alt="Seal" className="w-9 h-9 object-contain" />
                          <div>
                            <h5 className="font-bold text-xs uppercase tracking-wider text-[#103C2E]">
                              Official Executive Communication
                            </h5>
                            <span className="text-[10px] text-stone-400">
                              Dispatched: {trackedPetition.decisionMessage.sentAt} • By {trackedPetition.decisionMessage.sentBy}
                            </span>
                          </div>
                        </div>

                        <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase border ${
                          trackedPetition.status === 'Approved' ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : 'bg-rose-100 text-rose-900 border-rose-300'
                        }`}>
                          {trackedPetition.status === 'Approved' ? 'Petition Approved' : 'Statutory Review Notice'}
                        </span>
                      </div>

                      {/* Letter Content */}
                      <div className="space-y-4 text-xs sm:text-sm text-stone-800 leading-relaxed font-light">
                        <p className="font-bold text-stone-900">
                          {trackedPetition.decisionMessage.officialGreeting}
                        </p>

                        <div className={`p-4 rounded-xl border ${
                          trackedPetition.status === 'Approved' ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950 font-medium' : 'bg-rose-50/70 border-rose-200 text-rose-950 font-medium'
                        }`}>
                          {trackedPetition.decisionMessage.decisionSummary}
                        </div>

                        <div className="space-y-1.5">
                          <strong className="text-[#103C2E] block font-semibold">Administrative Rationale & Technical Context:</strong>
                          <p className="text-stone-700 bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                            {trackedPetition.decisionMessage.detailedRationale}
                          </p>
                        </div>

                        {/* Constructive community development encouragement */}
                        <div className="space-y-1.5 bg-amber-50/70 p-4 rounded-xl border border-amber-200/80">
                          <strong className="text-amber-950 block font-semibold flex items-center gap-1.5">
                            <Shield className="w-4 h-4 text-amber-700" />
                            Community Engagement & Democratic Encouragement:
                          </strong>
                          <p className="text-amber-900 leading-relaxed">
                            {trackedPetition.decisionMessage.communityEncouragement}
                          </p>
                        </div>

                        <div className="space-y-1">
                          <strong className="text-[#103C2E] block font-semibold">Next Steps & Recommendations:</strong>
                          <p className="text-stone-700">
                            {trackedPetition.decisionMessage.nextStepsOrAlternatives}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-stone-200 text-xs font-mono text-stone-600 space-y-1">
                          <p className="font-bold text-[#103C2E]">{trackedPetition.decisionMessage.signatory}</p>
                          <p className="text-[11px] text-stone-400">Channels Dispatched: {trackedPetition.decisionMessage.deliveryChannels ? trackedPetition.decisionMessage.deliveryChannels.join(' • ') : 'SMS • Portal • Email'}</p>
                        </div>
                      </div>

                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => {
                            const blob = new Blob([JSON.stringify(trackedPetition, null, 2)], { type: 'application/json' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `Official_Petition_Decision_${trackedPetition.referenceNumber}.json`;
                            a.click();
                            URL.revokeObjectURL(url);
                          }}
                          className="bg-[#C6A15B] hover:bg-[#b59048] text-[#09291F] font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow uppercase tracking-wider"
                        >
                          <Download className="w-4 h-4" />
                          <span>DOWNLOAD OFFICIAL DECISION LETTER</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 text-center text-stone-600">
                      <Clock className="w-8 h-8 text-[#C6A15B] mx-auto animate-pulse" />
                      <p className="font-bold text-sm text-[#103C2E]">Petition is Under Evaluation</p>
                      <p className="text-xs max-w-md mx-auto">
                        This petition is currently undergoing technical site appraisal and committee evaluation. When the final decision is reached, you will receive an automatic formal letter here and via your email.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
