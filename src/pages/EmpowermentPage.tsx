import React, { useState } from 'react';
import { EmpowermentProgram, ProgramApplication } from '../types';
import { Award, Calendar, Users, CheckCircle, X, Shield, ArrowRight, Download, FileCheck, Info } from 'lucide-react';
import { Language, t, Translations } from '../utils/i18n';

interface Props {
  programs: EmpowermentProgram[];
  setCurrentTab?: (tab: string) => void;
  currentLang?: Language;
  translations?: Translations;
}

export const EmpowermentPage: React.FC<Props> = ({ 
  programs, 
  setCurrentTab,
  currentLang = 'en', 
  translations 
}) => {
  const [selectedProgram, setSelectedProgram] = useState<EmpowermentProgram | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [formData, setFormData] = useState({
    applicantName: '',
    email: '',
    phone: '',
    wardOrTown: '',
    qualifications: '',
    statement: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submissionReceipt, setSubmissionReceipt] = useState<{ id: string; ref: string; date: string } | null>(null);

  const categories = ['All', 'Agricultural Support', 'Skills Acquisition', 'Women Empowerment', 'Educational Support'];

  const filteredPrograms = programs.filter(p => {
    return selectedCategory === 'All' || p.category === selectedCategory;
  });

  const getCategoryLabel = (cat: string) => {
    if (cat === 'All') return t('allCategories', currentLang, translations);
    if (currentLang === 'ha') {
      if (cat === 'Agricultural Support') return 'Tallafin Noma';
      if (cat === 'Skills Acquisition') return 'Koyon Sana\'a';
      if (cat === 'Women Empowerment') return 'Karfafa Mata';
      if (cat === 'Educational Support') return 'Tallafin Ilimi';
    }
    if (currentLang === 'ar') {
      if (cat === 'Agricultural Support') return 'الدعم الزراعي';
      if (cat === 'Skills Acquisition') return 'التأهيل والتدريب المهني';
      if (cat === 'Women Empowerment') return 'تمكين المرأة';
      if (cat === 'Educational Support') return 'الدعم التعليمي';
    }
    return cat;
  };

  const getStatusLabel = (stat: string) => {
    if (currentLang === 'ha') {
      if (stat === 'Active') return 'A Bude';
      if (stat === 'Upcoming') return 'Na Tafe';
      if (stat === 'Closed') return 'A Rufe';
    }
    if (currentLang === 'ar') {
      if (stat === 'Active') return 'متاح للتقديم';
      if (stat === 'Upcoming') return 'قريباً';
      if (stat === 'Closed') return 'مغلق';
    }
    return stat;
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProgram) return;
    setSubmitting(true);

    const refCode = `DY-${Date.now().toString().slice(-6)}`;
    const newApplication = {
      programId: selectedProgram.id,
      programTitle: selectedProgram.title,
      referenceCode: refCode,
      ...formData,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };

    try {
      await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newApplication)
      });
    } catch {
      // Local fallback
    }

    try {
      const stored = JSON.parse(localStorage.getItem('danmaje_applications') || '[]');
      stored.unshift(newApplication);
      localStorage.setItem('danmaje_applications', JSON.stringify(stored));
    } catch {
      // Storage fallback
    }

    setSubmissionReceipt({
      id: selectedProgram.id,
      ref: refCode,
      date: new Date().toISOString().split('T')[0]
    });
    setFormData({ applicantName: '', email: '', phone: '', wardOrTown: '', qualifications: '', statement: '' });
    setSubmitting(false);
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
            <span>{t('empowerPageBadge', currentLang, translations)}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-['Manrope']">
            {t('empowerPageTitle', currentLang, translations)}
          </h1>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-light">
            {t('empowerPageDesc', currentLang, translations)}
          </p>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#103C2E] text-white shadow-sm'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            {getCategoryLabel(cat)}
          </button>
        ))}
      </div>

      {/* Programs Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {filteredPrograms.map((program) => (
          <div 
            key={program.id} 
            className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8 flex flex-col justify-between space-y-6 hover:shadow-xl hover:border-[#C6A15B]/50 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="bg-[#103C2E]/10 text-[#103C2E] px-2.5 py-1 rounded-md font-bold">
                  {getCategoryLabel(program.category)}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full font-bold ${
                  program.status === 'Active' ? 'bg-emerald-100 text-emerald-800' :
                  program.status === 'Upcoming' ? 'bg-amber-100 text-amber-800' : 'bg-stone-100 text-stone-700'
                }`}>
                  {getStatusLabel(program.status)}
                </span>
              </div>

              <h3 className="font-['Manrope'] font-bold text-xl text-[#103C2E] leading-snug">
                {program.title}
              </h3>

              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
                {program.description}
              </p>

              <div className="space-y-2 text-xs pt-3 border-t border-stone-100">
                <div className="flex justify-between">
                  <span className="text-stone-500">{t('eligibilityLabel', currentLang, translations)}:</span>
                  <span className="font-bold text-[#103C2E]">{program.targetBeneficiaries}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">{t('deadlineLabel', currentLang, translations)}:</span>
                  <span className="font-bold text-rose-600">{program.deadline}</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <span className="text-xs font-bold text-[#103C2E] block">
                  {t('requirementsLabel', currentLang, translations)}:
                </span>
                <ul className="list-disc list-inside text-xs text-stone-600 space-y-1 font-light">
                  {program.requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              onClick={() => { setSelectedProgram(program); setSubmissionReceipt(null); }}
              className="w-full bg-[#103C2E] hover:bg-[#09291F] text-white py-3 rounded-xl font-bold text-xs sm:text-sm shadow transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{t('applyForSchemeBtn', currentLang, translations)}</span>
              <ArrowRight className={`w-4 h-4 text-[#C6A15B] ${isRtl ? 'rotate-180' : ''}`} />
            </button>
          </div>
        ))}
      </div>

      {/* Application Modal Workflow */}
      {selectedProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto animate-fadeIn">
          <div className="bg-[#FAF9F5] w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-[#C6A15B]/40 max-h-[90vh] flex flex-col my-auto">
            <div className="bg-[#103C2E] text-white p-6 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#C6A15B] uppercase tracking-wider">
                  {currentLang === 'ha' ? 'Hukumar Karbar Fom' : currentLang === 'ar' ? 'مكتب استلام الطلبات' : 'Official Application Desk'}
                </span>
                <h3 className="text-lg font-bold font-['Manrope'] mt-1">{selectedProgram.title}</h3>
              </div>
              <button 
                onClick={() => setSelectedProgram(null)} 
                className="text-white/80 hover:text-white p-2 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              {submissionReceipt ? (
                <div className="bg-white border border-emerald-200 text-stone-800 p-8 rounded-2xl text-center space-y-5 shadow-sm">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-700">
                    <FileCheck className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-xl font-['Manrope'] text-emerald-900">
                      {currentLang === 'ha' ? 'An Karbi Bukatarka' : currentLang === 'ar' ? 'تم تسجيل طلبك بنجاح' : 'Application Acknowledged'}
                    </h4>
                    <p className="text-xs text-stone-600">
                      {currentLang === 'ha'
                        ? 'An yi nasarar rijistar bayananka a ofishin tantance masu neman tallafi.'
                        : currentLang === 'ar'
                        ? 'تم تسجيل طلبك رسمياً لدى لجنة مراجعة وتدقيق المستفيدين في الدائرة.'
                        : 'Your application has been registered with the Constituency Verification Committee.'}
                    </p>
                  </div>

                  <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs space-y-2 text-left rtl:text-right">
                    <div className="flex justify-between">
                      <span className="text-stone-500">{currentLang === 'ha' ? 'Lambar Shaidar Aika:' : currentLang === 'ar' ? 'رقم التتبع المرجعي:' : 'Tracking Reference:'}</span>
                      <strong className="text-[#103C2E] font-mono">{submissionReceipt.ref}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">{currentLang === 'ha' ? 'Shirin da aka Nema:' : currentLang === 'ar' ? 'البرنامج المتقدم له:' : 'Programme:'}</span>
                      <strong className="text-[#103C2E]">{selectedProgram.title}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">{currentLang === 'ha' ? 'Ranar Aika:' : currentLang === 'ar' ? 'تاريخ التقديم:' : 'Submission Date:'}</span>
                      <strong className="text-[#103C2E]">{submissionReceipt.date}</strong>
                    </div>
                  </div>

                  <p className="text-[11px] text-stone-500 leading-relaxed font-light">
                    {currentLang === 'ha'
                      ? 'Adana wannan lambar tabbatacciya. Za a tuntubi wadanda suka cancanta ta sakon SMS ko WhatsApp daga ofishin mazaba.'
                      : currentLang === 'ar'
                      ? 'يرجى الاحتفاظ برقم المرجع هذا. سيتم إشعار المرشحين عبر رسائل نصية أو واتساب من مكتب الاتصال.'
                      : 'Please retain this reference code. Shortlisted applicants will receive an SMS and WhatsApp notification from the constituency liaison desk.'}
                  </p>

                  <button
                    onClick={() => setSelectedProgram(null)}
                    className="w-full bg-[#103C2E] text-white py-3 rounded-xl font-bold text-xs sm:text-sm hover:bg-[#09291F] transition cursor-pointer"
                  >
                    {t('closeBtn', currentLang, translations)}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplySubmit} className="space-y-4">
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 p-4 rounded-xl text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-bold">
                      <Shield className="w-4 h-4 text-emerald-700" />
                      <span>{currentLang === 'ha' ? 'Tallafin Kyauta ne' : currentLang === 'ar' ? 'خدمة عامة مجانية' : 'Official Constituency Service'}</span>
                    </div>
                    <p className="font-light">
                      {currentLang === 'ha' 
                        ? 'Babu wani kudi ko caji da ake bukata don neman shiga wannan shiri. Duk wanda ya nemi kudi to ya ci amana.'
                        : currentLang === 'ar'
                        ? 'التقديم مجاني بالكامل بدون أي رسوم. لا تدفع أي مبالغ لأي شخص يدعي تمثيل المكتب.'
                        : 'Application is completely free. No official or agent will ever request payments for registration.'}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">{t('fullName', currentLang, translations)} *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sani Abubakar Yabo"
                      value={formData.applicantName}
                      onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#103C2E]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-700">{t('phoneNumber', currentLang, translations)} *</label>
                      <input
                        type="tel"
                        required
                        placeholder="0803 000 0000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#103C2E]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-stone-700">{t('emailAddress', currentLang, translations)}</label>
                      <input
                        type="email"
                        placeholder="applicant@gmail.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#103C2E]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">{t('projectLocation', currentLang, translations)} *</label>
                    <input
                      type="text"
                      required
                      placeholder={t('applicantWardPlaceholder', currentLang, translations)}
                      value={formData.wardOrTown}
                      onChange={(e) => setFormData({ ...formData, wardOrTown: e.target.value })}
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#103C2E]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">
                      {currentLang === 'ha' ? 'Matakin Karatu / Sana\'ar da Ake Yi' : currentLang === 'ar' ? 'المؤهل أو المهنة الحالية' : 'Educational / Trade Qualifications'} *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={t('qualificationsPlaceholder', currentLang, translations)}
                      value={formData.qualifications}
                      onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#103C2E]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-stone-700">
                      {currentLang === 'ha' ? 'Bayani kan Yadda Tallafin Zai Amfane Ka' : currentLang === 'ar' ? 'كيف سيفيدك هذا البرنامج التمكيني؟' : 'Personal Statement of Intent & Impact'} *
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder={t('statementPlaceholder', currentLang, translations)}
                      value={formData.statement}
                      onChange={(e) => setFormData({ ...formData, statement: e.target.value })}
                      className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#103C2E] resize-none"
                    ></textarea>
                  </div>

                  <div className="pt-2 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedProgram(null)}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-200 transition cursor-pointer"
                    >
                      {t('closeBtn', currentLang, translations)}
                    </button>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="bg-[#103C2E] hover:bg-[#09291F] text-white px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow transition disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                    >
                      <span>{submitting ? '...' : t('submitApplicationBtn', currentLang, translations)}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
