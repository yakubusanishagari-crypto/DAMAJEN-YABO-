import React, { useState, useEffect } from 'react';
import { EmpowermentProgram, ProgramApplication, AttachedDocument } from '../types';
import { 
  Award, Calendar, Users, CheckCircle, X, Shield, ArrowRight, Download, 
  FileCheck, Info, Upload, Trash2, ArrowLeft, Save, Search, 
  FileText, Clock, AlertCircle, Sparkles, Printer, CheckCircle2,
  Camera, User, Image as ImageIcon, Eye
} from 'lucide-react';
import { Language, t, Translations } from '../utils/i18n';
import { ApplicationSlipModal } from '../components/ApplicationSlipModal';
import { ApplicationTracker } from '../components/ApplicationTracker';
import { compressImageFile } from '../utils/imageCompressor';
import { apiUploadFile } from '../utils/apiSync';

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
  const [activeMainTab, setActiveMainTab] = useState<'programs' | 'track'>('programs');
  const [selectedProgram, setSelectedProgram] = useState<EmpowermentProgram | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Application Form Multi-Step State (Steps 1 to 5)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [draftSavedMsg, setDraftSavedMsg] = useState(false);
  
  const initialForm = {
    // Step 1: Personal
    applicantName: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    dob: '',
    nin: '',
    phone: '',
    altPhone: '',
    email: '',
    lga: 'Yabo' as 'Yabo' | 'Shagari' | 'Other',
    wardOrTown: '',
    residentialAddress: '',
    passportPhoto: '',

    // Step 2: Educational & Socio-economic
    highestEducation: 'SSCE / WAEC / NECO',
    institutionName: '',
    courseOfStudy: '',
    graduationYear: '',
    employmentStatus: 'Unemployed',
    monthlyIncome: 'Below ₦50,000',
    qualifications: '',

    // Step 3: Programme specifics
    statement: '',
    targetGrantUse: '',
    hasReceivedPreviousSupport: 'No' as 'Yes' | 'No',
    previousSupportDetails: '',
    bankName: '',
    accountNumber: '',
    accountName: '',

    // Step 4: Documents
    documents: [] as AttachedDocument[],

    // Step 5: Attestation
    attestationAgreed: false
  };

  const [formData, setFormData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [createdApplication, setCreatedApplication] = useState<ProgramApplication | null>(null);
  const [showSlipModal, setShowSlipModal] = useState(false);
  const [trackedRef, setTrackedRef] = useState('');
  const [hasSavedDraft, setHasSavedDraft] = useState(false);

  // Check for saved draft on mount
  useEffect(() => {
    try {
      const draft = localStorage.getItem('danmaje_app_draft');
      if (draft) {
        setHasSavedDraft(true);
      }
    } catch {
      // Ignore
    }

    try {
      const targetId = localStorage.getItem('danmaje_target_program');
      if (targetId) {
        localStorage.removeItem('danmaje_target_program');
        setSelectedCategory('All');
        setActiveMainTab('programs');
        setTimeout(() => {
          const el = document.getElementById(`program-card-${targetId}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.classList.add('ring-4', 'ring-[#C6A15B]', 'scale-[1.01]');
            setTimeout(() => {
              el.classList.remove('ring-4', 'ring-[#C6A15B]', 'scale-[1.01]');
            }, 3000);
          }
        }, 300);
      }
    } catch {}
  }, [programs]);

  const handleSaveDraft = () => {
    try {
      localStorage.setItem('danmaje_app_draft', JSON.stringify({
        programId: selectedProgram?.id,
        data: formData,
        savedAt: new Date().toISOString()
      }));
      setDraftSavedMsg(true);
      setHasSavedDraft(true);
      setTimeout(() => setDraftSavedMsg(false), 3000);
    } catch {
      // Ignore
    }
  };

  const handleRestoreDraft = () => {
    try {
      const raw = localStorage.getItem('danmaje_app_draft');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.data) {
          setFormData({ ...initialForm, ...parsed.data });
        }
      }
    } catch {
      // Ignore
    }
  };

  // Document Upload Handler
  const handleFileUpload = (docType: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const newDoc: AttachedDocument = {
        id: `doc-${Date.now()}`,
        name: file.name,
        type: docType,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        dataUrl: reader.result as string,
        uploadedAt: new Date().toISOString().split('T')[0]
      };
      setFormData(prev => ({
        ...prev,
        documents: [...prev.documents.filter(d => d.type !== docType), newDoc]
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveDoc = (docType: string) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter(d => d.type !== docType)
    }));
  };

  // Add sample placeholder doc for ease of testing
  const handleAddSampleDoc = (docType: string, label: string) => {
    const sampleDoc: AttachedDocument = {
      id: `doc-${Date.now()}`,
      name: `${docType.toLowerCase().replace(/\s+/g, '_')}_verified.pdf`,
      type: docType,
      size: '142.0 KB',
      dataUrl: 'data:application/pdf;base64,JVBERi0xLjQKJSDi488KMSAwIG9iajw8L1R5cGUvQ2F0YWxvZy9QYWdlcyAyIDAgUj4+ZW5kb2JqCg==',
      uploadedAt: new Date().toISOString().split('T')[0]
    };
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents.filter(d => d.type !== docType), sampleDoc]
    }));
  };

  const handlePassportPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressedDataUrl = await compressImageFile(file, 600, 600, 0.82);
      try {
        const permanentUrl = await apiUploadFile(compressedDataUrl, file.name);
        setFormData(prev => ({
          ...prev,
          passportPhoto: permanentUrl
        }));
      } catch {
        setFormData(prev => ({
          ...prev,
          passportPhoto: compressedDataUrl
        }));
      }
    } catch {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({
          ...prev,
          passportPhoto: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };


  const handleUseSamplePassport = () => {
    const samplePassportDataUrl = 'data:image/svg+xml;utf8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="300" height="360" viewBox="0 0 300 360">
        <rect width="300" height="360" fill="#f0f4f2"/>
        <rect x="8" y="8" width="284" height="344" fill="#e8f0ec" stroke="#103C2E" stroke-width="2"/>
        <circle cx="150" cy="120" r="50" fill="#c79c5e"/>
        <path d="M80 270 C80 195, 220 195, 220 270 Z" fill="#103C2E"/>
        <path d="M105 100 Q150 65 195 100 Q150 85 105 100 Z" fill="#0c2c22" stroke="#D4AF37" stroke-width="2.5"/>
        <ellipse cx="134" cy="116" rx="5" ry="3" fill="#2d1c0b"/>
        <ellipse cx="166" cy="116" rx="5" ry="3" fill="#2d1c0b"/>
        <path d="M150 120 L150 134 L145 136" stroke="#2d1c0b" stroke-width="2" fill="none"/>
        <path d="M138 147 Q150 153 162 147" stroke="#2d1c0b" stroke-width="2" fill="none"/>
        <path d="M132 205 L150 240 L168 205" stroke="#D4AF37" stroke-width="2.5" fill="none"/>
        <rect x="18" y="285" width="264" height="40" rx="6" fill="#103C2E"/>
        <text x="150" y="310" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#D4AF37" text-anchor="middle" letter-spacing="1">OFFICIAL CITIZEN PASSPORT</text>
      </svg>
    `);
    setFormData(prev => ({
      ...prev,
      passportPhoto: samplePassportDataUrl
    }));
  };

  const categories = [
    'All', 
    'Agricultural Support', 
    'Skills Acquisition', 
    'Women Empowerment', 
    'Educational Support', 
    'Youth Development',
    'Small Business Grant'
  ];

  const filteredPrograms = programs.filter(p => {
    const isVisible = p.isPublished !== false;
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return isVisible && matchesCategory;
  });

  const getCategoryLabel = (cat: string) => {
    if (cat === 'All') return t('allCategories', currentLang, translations);
    if (currentLang === 'ha') {
      if (cat === 'Agricultural Support') return 'Tallafin Noma';
      if (cat === 'Skills Acquisition') return 'Koyon Sana\'a';
      if (cat === 'Women Empowerment') return 'Karfafa Mata';
      if (cat === 'Educational Support') return 'Tallafin Ilimi';
      if (cat === 'Youth Development') return 'Ci-gaban Matasa';
      if (cat === 'Small Business Grant') return 'Tallafin Kasuwanci';
    }
    return cat;
  };

  const getStatusLabel = (stat: string) => {
    if (currentLang === 'ha') {
      if (stat === 'Active') return 'A BUDE';
      if (stat === 'Upcoming') return 'NA TAFE';
      if (stat === 'Closed') return 'A RUFE';
    }
    return stat.toUpperCase();
  };

  // Step Validation
  const canProceedStep1 = formData.applicantName.trim() && formData.phone.trim() && formData.nin.trim() && formData.wardOrTown.trim();
  const canProceedStep2 = formData.highestEducation && formData.employmentStatus && formData.qualifications.trim();
  const canProceedStep3 = formData.statement.trim() && formData.statement.length >= 20;
  const canProceedStep4 = true; // Documents can be optional or uploaded
  const canSubmit = canProceedStep1 && canProceedStep2 && canProceedStep3 && formData.attestationAgreed;

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProgram || !canSubmit) return;
    setSubmitting(true);

    const refCode = `DAN-EMP-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newApplication: ProgramApplication = {
      id: `app-${Date.now()}`,
      referenceNumber: refCode,
      programId: selectedProgram.id,
      programTitle: selectedProgram.title,
      programCategory: selectedProgram.category,
      applicantName: formData.applicantName,
      gender: formData.gender,
      dob: formData.dob,
      nin: formData.nin,
      email: formData.email,
      phone: formData.phone,
      altPhone: formData.altPhone,
      lga: formData.lga,
      wardOrTown: formData.wardOrTown,
      residentialAddress: formData.residentialAddress,
      passportPhoto: formData.passportPhoto || '',
      awardGrantPackage: selectedProgram.grantPackage || '',

      highestEducation: formData.highestEducation,
      institutionName: formData.institutionName,
      courseOfStudy: formData.courseOfStudy,
      graduationYear: formData.graduationYear,
      employmentStatus: formData.employmentStatus,
      monthlyIncome: formData.monthlyIncome,
      qualifications: formData.qualifications,

      statement: formData.statement,
      targetGrantUse: formData.targetGrantUse,
      hasReceivedPreviousSupport: formData.hasReceivedPreviousSupport,
      previousSupportDetails: formData.previousSupportDetails,
      bankName: formData.bankName,
      accountNumber: formData.accountNumber,
      accountName: formData.accountName,

      documents: formData.documents,

      date: now.toISOString().split('T')[0],
      submissionTime: `${timeString} WAT`,
      status: 'SUBMITTED',
      currentStage: 'SUBMITTED',
      timeline: [
        {
          stage: 'SUBMITTED',
          timestamp: `${now.toISOString().split('T')[0]} ${timeString}`,
          title: 'Application Form Received',
          note: 'Online submission recorded into the constituency database.',
          actor: 'Citizen Portal'
        }
      ],
      publicFeedback: 'Your application is registered. Please keep your printed slip safe for upcoming constituency screening dates.',
      notes: 'Submitted via citizen portal. Full bio and attached credentials registered.'
    };

    try {
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
        localStorage.removeItem('danmaje_app_draft');
      } catch {
        // Storage fallback
      }

      setCreatedApplication(newApplication);
      setShowSlipModal(true);
      setFormData(initialForm);
      setCurrentStep(1);
      setSelectedProgram(null);
    } finally {
      setSubmitting(false);
    }
  };

  const isRtl = currentLang === 'ar';

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-12 ${isRtl ? 'rtl text-right' : ''}`}>
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#09291F] via-[#103C2E] to-[#0A261E] text-white rounded-3xl p-8 sm:p-14 shadow-2xl space-y-6 relative overflow-hidden border border-emerald-500/30">
        <div className="relative z-10 max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-emerald-900/60 border border-emerald-500/40 text-xs font-black uppercase tracking-wider text-emerald-200">
            <img src="/official_logo.png" alt="Official Seal" className="w-5 h-5 rounded-full object-contain shrink-0" />
            <span>FEDERAL CONSTITUENCY CITIZEN ADVANCEMENT & EMPOWERMENT PORTAL</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-['Manrope'] text-white uppercase tracking-tight">
            EMPOWERMENT & SCHOLARSHIP APPLICATION PORTAL
          </h1>

          <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-light max-w-3xl">
            Direct citizen empowerment initiatives sponsored by Hon. (Dr.) Umar Yusuf Yabo (Dan Majen Yabo) for youths, women, farmers, entrepreneurs, and students across Yabo and Shagari Federal Constituency.
          </p>

          {/* Portal Main Navigation Switch */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setActiveMainTab('programs')}
              className={`px-6 py-3.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer shadow-md uppercase tracking-wider flex items-center gap-2 ${
                activeMainTab === 'programs'
                  ? 'bg-emerald-600 text-white border border-emerald-400/50 shadow-lg'
                  : 'bg-[#0A261E] text-stone-100 hover:bg-[#103C2E] hover:text-white border border-emerald-500/40'
              }`}
            >
              <Award className="w-4 h-4 text-emerald-300" />
              <span>AVAILABLE SCHEMES & PROGRAMMES</span>
            </button>

            <button
              onClick={() => setActiveMainTab('track')}
              className={`px-6 py-3.5 rounded-xl text-xs sm:text-sm font-black transition-all cursor-pointer shadow-md uppercase tracking-wider flex items-center gap-2 ${
                activeMainTab === 'track'
                  ? 'bg-emerald-600 text-white border border-emerald-400/50 shadow-lg'
                  : 'bg-[#0A261E] text-stone-100 hover:bg-[#103C2E] hover:text-white border border-emerald-500/40'
              }`}
            >
              <Search className="w-4 h-4 text-emerald-300" />
              <span>TRACK APPLICATION STATUS & PRINT SLIP</span>
            </button>
          </div>
        </div>
      </div>

      {/* TRACKING TAB VIEW */}
      {activeMainTab === 'track' && (
        <ApplicationTracker
          initialRef={trackedRef}
          onApplyNew={() => setActiveMainTab('programs')}
        />
      )}

      {/* PROGRAMMES TAB VIEW */}
      {activeMainTab === 'programs' && (
        <div className="space-y-8">
          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer uppercase tracking-wider ${
                    selectedCategory === cat
                      ? 'bg-[#103C2E] text-white shadow-md border border-[#C6A15B]/40'
                      : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                  }`}
                >
                  {getCategoryLabel(cat).toUpperCase()}
                </button>
              ))}
            </div>

            <button
              onClick={() => setActiveMainTab('track')}
              className="bg-emerald-50 hover:bg-emerald-100 text-[#103C2E] border border-emerald-300 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition cursor-pointer uppercase tracking-wider"
            >
              <span>ALREADY APPLIED? TRACK YOUR SUBMISSION HERE</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C6A15B]" />
            </button>
          </div>

          {/* Programs Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredPrograms.map((program) => (
              <div 
                key={program.id} 
                className="bg-white rounded-3xl shadow-md border border-stone-200/90 p-8 flex flex-col justify-between space-y-6 hover:shadow-2xl hover:border-[#C6A15B]/60 transition-all duration-300 hover:-translate-y-1.5"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="bg-[#103C2E]/10 text-[#103C2E] px-3 py-1 rounded-lg font-black uppercase tracking-wider text-[11px]">
                      {getCategoryLabel(program.category)}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider ${
                      program.status === 'Active' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                      program.status === 'Upcoming' ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-stone-100 text-stone-700'
                    }`}>
                      {getStatusLabel(program.status)}
                    </span>
                  </div>

                  <h3 className="font-['Manrope'] font-black text-xl text-[#103C2E] leading-snug uppercase tracking-tight">
                    {program.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
                    {program.description}
                  </p>

                  <div className="space-y-2 text-xs pt-3 border-t border-stone-100">
                    <div className="flex justify-between">
                      <span className="text-stone-500 font-bold uppercase text-[10px]">Target Beneficiaries:</span>
                      <span className="font-extrabold text-[#103C2E]">{program.targetBeneficiaries}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500 font-bold uppercase text-[10px]">Application Deadline:</span>
                      <span className="font-extrabold text-rose-600">{program.deadline}</span>
                    </div>
                    {program.slotsAvailable && (
                      <div className="flex justify-between">
                        <span className="text-stone-500 font-bold uppercase text-[10px]">Available Slots:</span>
                        <span className="font-extrabold text-emerald-700">{program.slotsAvailable} Beneficiaries</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <span className="text-xs font-black text-[#103C2E] block uppercase tracking-wider">
                      ELIGIBILITY REQUIREMENTS:
                    </span>
                    <ul className="list-disc list-inside text-xs text-stone-600 space-y-1 font-light">
                      {program.requirements.map((req, i) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Required Documents Badge List */}
                  {program.requiredDocs && program.requiredDocs.length > 0 && (
                    <div className="space-y-1 pt-2">
                      <span className="text-[11px] font-black text-[#8C6D2B] block uppercase tracking-wider">
                        REQUIRED DOCUMENTS:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {program.requiredDocs.map((doc, idx) => (
                          <span key={idx} className="bg-amber-50 text-amber-900 border border-amber-200 text-[10px] px-2 py-0.5 rounded-md font-semibold">
                            {doc}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {program.status === 'Closed' ? (
                  <button
                    disabled
                    className="w-full bg-stone-200 text-stone-500 py-3.5 rounded-2xl font-bold text-xs cursor-not-allowed text-center uppercase tracking-wider"
                  >
                    APPLICATIONS CLOSED
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedProgram(program);
                      setCurrentStep(1);
                    }}
                    className="w-full bg-[#103C2E] hover:bg-[#09291F] text-white py-3.5 rounded-2xl font-black text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
                  >
                    <span>APPLY FOR THIS PROGRAMME</span>
                    <ArrowRight className={`w-4 h-4 text-[#C6A15B] ${isRtl ? 'rotate-180' : ''}`} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MULTI-STEP APPLICATION FORM MODAL */}
      {selectedProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
          <div className="bg-[#FAF9F5] w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-[#C6A15B]/40 max-h-[92vh] flex flex-col my-auto">
            
            {/* Modal Header */}
            <div className="bg-[#103C2E] text-white p-6 flex items-center justify-between border-b border-[#C6A15B]/40">
              <div className="space-y-0.5">
                <span className="text-xs font-black text-[#C6A15B] uppercase tracking-wider flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  GOVERNMENT APPLICATION DESK • YABO/SHAGARI
                </span>
                <h3 className="text-lg font-black font-['Manrope'] text-white uppercase tracking-tight">
                  {selectedProgram.title}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedProgram(null)} 
                className="bg-rose-950/60 hover:bg-rose-900 text-rose-200 border border-rose-700/50 p-2 rounded-xl transition cursor-pointer shadow-sm"
                aria-label="Close modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Stepper Progress Bar */}
            <div className="bg-stone-100 px-6 py-3 border-b border-stone-200">
              <div className="flex items-center justify-between mb-1.5 text-xs font-bold text-[#103C2E] uppercase">
                <span>
                  STEP {currentStep} OF 5: {
                    currentStep === 1 ? 'PERSONAL DETAILS & CONTACT' :
                    currentStep === 2 ? 'EDUCATION & SOCIO-ECONOMIC' :
                    currentStep === 3 ? 'STATEMENT & PROGRAMME SPECIFICS' :
                    currentStep === 4 ? 'SUPPORTING DOCUMENT UPLOADS' :
                    'REVIEW, ATTESTATION & SUBMIT'
                  }
                </span>
                <span className="text-stone-500 font-mono">{currentStep * 20}% COMPLETED</span>
              </div>
              <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-[#103C2E] h-full transition-all duration-300 rounded-full"
                  style={{ width: `${currentStep * 20}%` }}
                ></div>
              </div>
            </div>

            {/* Modal Body / Multi-Step Form */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              
              {/* Draft restore alert if exists */}
              {hasSavedDraft && currentStep === 1 && (
                <div className="bg-amber-50 border border-amber-300 p-3.5 rounded-2xl flex items-center justify-between text-xs text-amber-900">
                  <div className="flex items-center gap-2">
                    <Save className="w-4 h-4 text-amber-700" />
                    <span>You have a previously saved draft for an application form.</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRestoreDraft}
                    className="bg-amber-700 text-white font-bold px-3 py-1 rounded-lg hover:bg-amber-800 transition cursor-pointer uppercase text-[11px]"
                  >
                    RESTORE DRAFT
                  </button>
                </div>
              )}

              {draftSavedMsg && (
                <div className="bg-emerald-50 border border-emerald-300 p-3 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Your application draft has been saved securely to your browser!</span>
                </div>
              )}

              {/* STEP 1: PERSONAL DETAILS */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 p-4 rounded-2xl text-xs space-y-1">
                    <span className="font-black uppercase tracking-wider block text-emerald-900">
                      STEP 1: APPLICANT IDENTITY & RESIDENCE
                    </span>
                    <p className="font-light">
                      Please provide your legal full name matching your National Identity Number (NIN) and upload a clear biometric passport photograph.
                    </p>
                  </div>

                  {/* Passport / Biometric Photograph Upload Box */}
                  <div className="bg-stone-50 border-2 border-[#C6A15B]/40 rounded-2xl p-4 sm:p-5 space-y-3">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                      {/* Photo Frame */}
                      <div className="w-28 h-36 rounded-xl overflow-hidden border-2 border-[#103C2E] bg-white shrink-0 shadow-sm flex flex-col items-center justify-center relative">
                        {formData.passportPhoto ? (
                          <img
                            src={formData.passportPhoto}
                            alt="Passport Photo Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center p-2 text-stone-400">
                            <User className="w-10 h-10 mx-auto text-stone-300" />
                            <span className="text-[10px] font-bold uppercase mt-1 block">No Photo</span>
                          </div>
                        )}
                        <div className="absolute bottom-0 inset-x-0 bg-[#103C2E] text-[#D4AF37] text-[8px] font-bold py-0.5 text-center uppercase tracking-wider">
                          Passport Photo
                        </div>
                      </div>

                      {/* Upload Controls & Instructions */}
                      <div className="flex-1 space-y-2 text-center sm:text-left">
                        <div className="space-y-0.5">
                          <label className="text-xs font-black uppercase text-[#103C2E] block">
                            APPLICANT BIOMETRIC PASSPORT PHOTOGRAPH *
                          </label>
                          <p className="text-[11px] text-stone-500 leading-snug">
                            Upload a recent, clear color passport photograph with white or plain background. This photo will be officially affixed to your <strong>Constituency Application Slip</strong> and <strong>Congratulatory Offer Letter</strong>.
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-1">
                          <label className="bg-[#103C2E] hover:bg-[#09291F] text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition flex items-center gap-1.5 shadow-sm uppercase">
                            <Camera className="w-3.5 h-3.5 text-[#C6A15B]" />
                            <span>{formData.passportPhoto ? 'CHANGE PHOTO' : 'UPLOAD PHOTO'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handlePassportPhotoUpload}
                              className="hidden"
                            />
                          </label>

                          <button
                            type="button"
                            onClick={handleUseSamplePassport}
                            className="bg-emerald-50 hover:bg-emerald-100 text-[#103C2E] border border-emerald-300 px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition uppercase shadow-xs flex items-center gap-1"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-[#C6A15B]" />
                            <span>+ USE VERIFIED SAMPLE PHOTO</span>
                          </button>

                          {formData.passportPhoto && (
                            <button
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, passportPhoto: '' }))}
                              className="text-rose-600 hover:text-rose-800 p-2 text-xs font-bold cursor-pointer flex items-center gap-1"
                              title="Remove uploaded photo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Remove</span>
                            </button>
                          )}
                        </div>

                        {formData.passportPhoto && (
                          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-100/70 px-2.5 py-1 rounded-lg">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Biometric photo attached & validated</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#103C2E] uppercase">
                      FULL LEGAL NAME (SURNAME FIRST) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sani Abubakar Yabo"
                      value={formData.applicantName}
                      onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#103C2E]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#103C2E] uppercase">GENDER *</label>
                      <select
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                        className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#103C2E]"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#103C2E] uppercase">DATE OF BIRTH</label>
                      <input
                        type="date"
                        value={formData.dob}
                        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#103C2E]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#103C2E] uppercase">NIN (11 DIGITS) *</label>
                      <input
                        type="text"
                        required
                        maxLength={11}
                        placeholder="e.g. 12345678901"
                        value={formData.nin}
                        onChange={(e) => setFormData({ ...formData, nin: e.target.value.replace(/\D/g, '') })}
                        className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:border-[#103C2E]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#103C2E] uppercase">PRIMARY PHONE NUMBER *</label>
                      <input
                        type="tel"
                        required
                        placeholder="0803 000 0000"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#103C2E]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#103C2E] uppercase">EMAIL ADDRESS</label>
                      <input
                        type="email"
                        placeholder="applicant@gmail.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#103C2E]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#103C2E] uppercase">LOCAL GOVERNMENT AREA *</label>
                      <select
                        value={formData.lga}
                        onChange={(e) => setFormData({ ...formData, lga: e.target.value as any })}
                        className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#103C2E]"
                      >
                        <option value="Yabo">Yabo Local Government</option>
                        <option value="Shagari">Shagari Local Government</option>
                        <option value="Other">Other (Constituency Resident)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#103C2E] uppercase">WARD / COMMUNITY *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Yabo Central / Torankawa / Dandin Mahe"
                        value={formData.wardOrTown}
                        onChange={(e) => setFormData({ ...formData, wardOrTown: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#103C2E]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#103C2E] uppercase">RESIDENTIAL ADDRESS</label>
                    <input
                      type="text"
                      placeholder="House address or community description"
                      value={formData.residentialAddress}
                      onChange={(e) => setFormData({ ...formData, residentialAddress: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#103C2E]"
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: EDUCATION & SOCIO-ECONOMIC */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 p-4 rounded-2xl text-xs space-y-1">
                    <span className="font-black uppercase tracking-wider block text-emerald-900">
                      STEP 2: EDUCATIONAL BACKGROUND & CURRENT VOCATION
                    </span>
                    <p className="font-light">
                      This information helps the constituency committee allocate appropriate equipment, grants, and training tracks.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#103C2E] uppercase">HIGHEST EDUCATION LEVEL *</label>
                      <select
                        value={formData.highestEducation}
                        onChange={(e) => setFormData({ ...formData, highestEducation: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#103C2E]"
                      >
                        <option value="Primary School">Primary School Leaving Certificate</option>
                        <option value="SSCE / WAEC / NECO">SSCE / WAEC / NECO</option>
                        <option value="OND / NCE">OND / NCE</option>
                        <option value="HND / Bachelor Degree">HND / Bachelor's Degree</option>
                        <option value="Postgraduate">Postgraduate (PGD / Masters / PhD)</option>
                        <option value="Vocational Certificate">Vocational / Trade Apprenticeship</option>
                        <option value="None">Informal / Quranic Education</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#103C2E] uppercase">INSTITUTION ATTENDED / ENROLLED</label>
                      <input
                        type="text"
                        placeholder="School or training institution name"
                        value={formData.institutionName}
                        onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#103C2E]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#103C2E] uppercase">CURRENT EMPLOYMENT / VOCATION *</label>
                      <select
                        value={formData.employmentStatus}
                        onChange={(e) => setFormData({ ...formData, employmentStatus: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#103C2E]"
                      >
                        <option value="Unemployed">Unemployed Youth / Job Seeker</option>
                        <option value="Student">Active Student (Secondary / Tertiary)</option>
                        <option value="Farmer">Farmer / Agro-Allied Producer</option>
                        <option value="Artisan">Artisan (Tailor, Mechanic, Carpenter, Electrician, etc.)</option>
                        <option value="Small Business Owner">Small Business / Petty Trader</option>
                        <option value="Civil Servant">Civil Servant / Teacher</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#103C2E] uppercase">ESTIMATED MONTHLY INCOME</label>
                      <select
                        value={formData.monthlyIncome}
                        onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#103C2E]"
                      >
                        <option value="No Regular Income">No Regular Income</option>
                        <option value="Below ₦30,000">Below ₦30,000</option>
                        <option value="₦30,000 - ₦70,000">₦30,000 - ₦70,000</option>
                        <option value="₦70,000 - ₦150,000">₦70,000 - ₦150,000</option>
                        <option value="Above ₦150,000">Above ₦150,000</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#103C2E] uppercase">
                      EXISTING SKILLS & QUALIFICATIONS SUMMARY *
                    </label>
                    <textarea
                      rows={2}
                      required
                      placeholder="Briefly state your current practical skills, certificates, or farming experience..."
                      value={formData.qualifications}
                      onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#103C2E] resize-none"
                    ></textarea>
                  </div>
                </div>
              )}

              {/* STEP 3: PROGRAMME SPECIFICS & STATEMENT */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 p-4 rounded-2xl text-xs space-y-1">
                    <span className="font-black uppercase tracking-wider block text-emerald-900">
                      STEP 3: STATEMENT OF INTENT & COMMUNITY IMPACT
                    </span>
                    <p className="font-light">
                      Explain in your own words why you need this empowerment support and how you intend to utilize it productively.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#103C2E] uppercase">
                      STATEMENT OF PURPOSE & INTENDED IMPACT (MINIMUM 20 CHARACTERS) *
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="e.g. I am seeking this empowerment support to expand my poultry farming business and establish a cold-storage unit in Yabo, which will enable me to train two additional youths..."
                      value={formData.statement}
                      onChange={(e) => setFormData({ ...formData, statement: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#103C2E] resize-none"
                    ></textarea>
                    <div className="flex justify-between text-[11px] text-stone-400">
                      <span>Provide as much detail as possible for the selection committee.</span>
                      <span>{formData.statement.length} characters</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#103C2E] uppercase">
                      INTENDED USAGE OF EMPOWERMENT SUPPORT / GRANT
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Purchase of commercial sewing machine / Farm irrigation kit / Tuition fees"
                      value={formData.targetGrantUse}
                      onChange={(e) => setFormData({ ...formData, targetGrantUse: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#103C2E]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#103C2E] uppercase">
                        HAVE YOU RECEIVED PREVIOUS CONSTITUENCY SUPPORT?
                      </label>
                      <select
                        value={formData.hasReceivedPreviousSupport}
                        onChange={(e) => setFormData({ ...formData, hasReceivedPreviousSupport: e.target.value as any })}
                        className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#103C2E]"
                      >
                        <option value="No">No (First Time Applicant)</option>
                        <option value="Yes">Yes (Previous Beneficiary)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#103C2E] uppercase">
                        BANK NAME (FOR DIRECT DISBURSEMENT)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. First Bank / Jaiz Bank / UBA"
                        value={formData.bankName}
                        onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#103C2E]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#103C2E] uppercase">
                        ACCOUNT NUMBER (10 DIGITS)
                      </label>
                      <input
                        type="text"
                        maxLength={10}
                        placeholder="0123456789"
                        value={formData.accountNumber}
                        onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value.replace(/\D/g, '') })}
                        className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:border-[#103C2E]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#103C2E] uppercase">
                        ACCOUNT BENEFICIARY NAME
                      </label>
                      <input
                        type="text"
                        placeholder="Name on bank account"
                        value={formData.accountName}
                        onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#103C2E]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: SUPPORTING DOCUMENT UPLOADS */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 p-4 rounded-2xl text-xs space-y-1">
                    <span className="font-black uppercase tracking-wider block text-emerald-900">
                      STEP 4: SUPPORTING DOCUMENTS & CREDENTIALS
                    </span>
                    <p className="font-light">
                      Upload clear photo copies or PDF scans of your credentials. You can also attach files directly from your device.
                    </p>
                  </div>

                  {/* Document 0: Biometric Passport Photo */}
                  <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-xs font-black uppercase text-[#103C2E] block">
                          BIOMETRIC PASSPORT PHOTOGRAPH *
                        </span>
                        <span className="text-[11px] text-stone-500">Official facial portrait for identity accreditation & award slip</span>
                      </div>
                      {formData.passportPhoto ? (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> AFFIXED
                        </span>
                      ) : (
                        <span className="bg-amber-100 text-amber-800 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> PENDING
                        </span>
                      )}
                    </div>

                    {formData.passportPhoto ? (
                      <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                        <div className="flex items-center gap-3">
                          <img
                            src={formData.passportPhoto}
                            alt="Passport Preview"
                            className="w-10 h-12 object-cover rounded-md border border-[#103C2E]"
                          />
                          <div>
                            <span className="font-bold text-[#103C2E] block">Biometric Passport Photo</span>
                            <span className="text-[10px] text-stone-500">Ready to affix on official slip & award letter</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, passportPhoto: '' }))}
                          className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer"
                          title="Remove photo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center gap-3">
                        <label className="bg-[#103C2E] hover:bg-[#09291F] text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition flex items-center gap-1.5 uppercase">
                          <Upload className="w-3.5 h-3.5" />
                          <span>UPLOAD PASSPORT PHOTO</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePassportPhotoUpload}
                            className="hidden"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={handleUseSamplePassport}
                          className="text-[#103C2E] border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition uppercase shadow-xs"
                        >
                          + ATTACH VERIFIED SAMPLE PHOTO
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Document 1: Identification */}
                  <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-xs font-black uppercase text-[#103C2E] block">
                          1. IDENTIFICATION CARD (NIN / VOTER'S CARD) *
                        </span>
                        <span className="text-[11px] text-stone-500">Government-issued identity slip or permanent voter card</span>
                      </div>
                      {formData.documents.find(d => d.type === 'National ID') && (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> ATTACHED
                        </span>
                      )}
                    </div>

                    {formData.documents.find(d => d.type === 'National ID') ? (
                      <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-[#103C2E]" />
                          <span className="font-bold text-[#103C2E]">
                            {formData.documents.find(d => d.type === 'National ID')?.name}
                          </span>
                          <span className="text-stone-400">
                            ({formData.documents.find(d => d.type === 'National ID')?.size})
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveDoc('National ID')}
                          className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center gap-3">
                        <label className="bg-[#103C2E] hover:bg-[#09291F] text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition flex items-center gap-1.5 uppercase">
                          <Upload className="w-3.5 h-3.5" />
                          <span>CHOOSE FILE</span>
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => handleFileUpload('National ID', e)}
                            className="hidden"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => handleAddSampleDoc('National ID', 'NIN Slip')}
                          className="text-[#103C2E] border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition uppercase shadow-xs"
                        >
                          + ATTACH VERIFIED SAMPLE NIN
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Document 2: Indigene Certificate */}
                  <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-xs font-black uppercase text-[#103C2E] block">
                          2. LOCAL GOVERNMENT INDIGENE CERTIFICATE *
                        </span>
                        <span className="text-[11px] text-stone-500">Certificate of indigene from Yabo or Shagari LGA</span>
                      </div>
                      {formData.documents.find(d => d.type === 'Indigene Certificate') && (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> ATTACHED
                        </span>
                      )}
                    </div>

                    {formData.documents.find(d => d.type === 'Indigene Certificate') ? (
                      <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-[#103C2E]" />
                          <span className="font-bold text-[#103C2E]">
                            {formData.documents.find(d => d.type === 'Indigene Certificate')?.name}
                          </span>
                          <span className="text-stone-400">
                            ({formData.documents.find(d => d.type === 'Indigene Certificate')?.size})
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveDoc('Indigene Certificate')}
                          className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center gap-3">
                        <label className="bg-[#103C2E] hover:bg-[#09291F] text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition flex items-center gap-1.5 uppercase">
                          <Upload className="w-3.5 h-3.5" />
                          <span>CHOOSE FILE</span>
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => handleFileUpload('Indigene Certificate', e)}
                            className="hidden"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => handleAddSampleDoc('Indigene Certificate', 'Indigene Certificate')}
                          className="text-[#103C2E] border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition uppercase shadow-xs"
                        >
                          + ATTACH VERIFIED SAMPLE INDIGENE CERTIFICATE
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Document 3: Trade / Educational Credential */}
                  <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-xs font-black uppercase text-[#103C2E] block">
                          3. EDUCATIONAL / TRADE APPRENTICESHIP CREDENTIAL
                        </span>
                        <span className="text-[11px] text-stone-500">SSCE, Degree, Diploma, or Trade Union Certificate</span>
                      </div>
                      {formData.documents.find(d => d.type === 'Educational Credential') && (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> ATTACHED
                        </span>
                      )}
                    </div>

                    {formData.documents.find(d => d.type === 'Educational Credential') ? (
                      <div className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-[#103C2E]" />
                          <span className="font-bold text-[#103C2E]">
                            {formData.documents.find(d => d.type === 'Educational Credential')?.name}
                          </span>
                          <span className="text-stone-400">
                            ({formData.documents.find(d => d.type === 'Educational Credential')?.size})
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveDoc('Educational Credential')}
                          className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center gap-3">
                        <label className="bg-[#103C2E] hover:bg-[#09291F] text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition flex items-center gap-1.5 uppercase">
                          <Upload className="w-3.5 h-3.5" />
                          <span>CHOOSE FILE</span>
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => handleFileUpload('Educational Credential', e)}
                            className="hidden"
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => handleAddSampleDoc('Educational Credential', 'Credential')}
                          className="text-[#103C2E] border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition uppercase shadow-xs"
                        >
                          + ATTACH VERIFIED SAMPLE CREDENTIAL
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 5: SUMMARY REVIEW & LEGAL ATTESTATION */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 p-4 rounded-2xl text-xs space-y-1">
                    <span className="font-black uppercase tracking-wider block text-emerald-900">
                      STEP 5: APPLICATION PRE-SUBMISSION SUMMARY & ATTESTATION
                    </span>
                    <p className="font-light">
                      Carefully review your information below. Once submitted, your application slip will be generated with a unique reference number.
                    </p>
                  </div>

                  {/* Summary Box */}
                  <div className="bg-white p-5 rounded-2xl border border-stone-200 text-xs space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-b border-stone-100 pb-3">
                      <div>
                        <span className="text-[10px] text-stone-500 font-bold uppercase block">Applicant:</span>
                        <strong className="text-[#103C2E] text-sm">{formData.applicantName}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-500 font-bold uppercase block">NIN:</span>
                        <strong className="text-[#103C2E] font-mono">{formData.nin}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-500 font-bold uppercase block">Phone:</span>
                        <strong className="text-[#103C2E]">{formData.phone}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-500 font-bold uppercase block">LGA & Ward:</span>
                        <strong className="text-[#103C2E]">{formData.wardOrTown} ({formData.lga})</strong>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-b border-stone-100 pb-3">
                      <div>
                        <span className="text-[10px] text-stone-500 font-bold uppercase block">Programme:</span>
                        <strong className="text-[#103C2E]">{selectedProgram.title}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-500 font-bold uppercase block">Qualification:</span>
                        <strong className="text-[#103C2E]">{formData.highestEducation}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-500 font-bold uppercase block">Attached Documents:</span>
                        <strong className="text-[#103C2E]">{formData.documents.length} File(s) Attached</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-500 font-bold uppercase block">Grant Target:</span>
                        <strong className="text-[#103C2E]">{formData.targetGrantUse || 'General Vocation'}</strong>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-stone-500 font-bold uppercase block">Statement of Intent:</span>
                      <p className="italic text-stone-700 font-light mt-0.5">"{formData.statement}"</p>
                    </div>
                  </div>

                  {/* Solemn Attestation Checkbox */}
                  <div className="bg-amber-50/70 border border-amber-300 p-4 rounded-2xl flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="attestation-checkbox"
                      checked={formData.attestationAgreed}
                      onChange={(e) => setFormData({ ...formData, attestationAgreed: e.target.checked })}
                      className="w-5 h-5 rounded border-amber-400 text-[#103C2E] focus:ring-[#103C2E] mt-0.5 cursor-pointer"
                    />
                    <label htmlFor="attestation-checkbox" className="text-xs text-stone-800 cursor-pointer font-medium leading-relaxed">
                      <strong className="font-bold text-[#103C2E] uppercase block mb-0.5">
                        SOLEMN APPLICANT ATTESTATION & DECLARATION
                      </strong>
                      I hereby solemnly certify that all details, NIN credentials, and certificates submitted herein are true, genuine, and directly pertain to my identity. I understand that submitting false claims will result in immediate disqualification and legal liability under constituency verification guidelines.
                    </label>
                  </div>
                </div>
              )}

              {/* Bottom Nav Buttons */}
              <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={() => setCurrentStep(prev => prev - 1)}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold text-stone-700 bg-stone-200 hover:bg-stone-300 transition cursor-pointer flex items-center gap-1 uppercase"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>BACK</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-amber-900 bg-amber-50 border border-amber-300 hover:bg-amber-100 transition cursor-pointer flex items-center gap-1 uppercase shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5 text-amber-700" />
                    <span>SAVE DRAFT</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {currentStep < 5 ? (
                    <button
                      type="button"
                      disabled={
                        (currentStep === 1 && !canProceedStep1) ||
                        (currentStep === 2 && !canProceedStep2) ||
                        (currentStep === 3 && !canProceedStep3)
                      }
                      onClick={() => setCurrentStep(prev => prev + 1)}
                      className="bg-[#103C2E] hover:bg-[#09291F] disabled:opacity-50 text-white px-6 py-2.5 rounded-xl font-black text-xs sm:text-sm shadow-md transition cursor-pointer flex items-center gap-1.5 uppercase tracking-wider"
                    >
                      <span>CONTINUE</span>
                      <ArrowRight className="w-4 h-4 text-[#C6A15B]" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={submitting || !canSubmit}
                      onClick={handleApplySubmit}
                      className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-black text-xs sm:text-sm shadow-xl transition cursor-pointer flex items-center gap-2 uppercase tracking-wider"
                    >
                      <span>{submitting ? 'SUBMITTING APPLICATION...' : 'SUBMIT OFFICIAL APPLICATION'}</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Post-Submission Slip Modal */}
      {showSlipModal && createdApplication && (
        <ApplicationSlipModal
          application={createdApplication}
          onClose={() => {
            setShowSlipModal(false);
            setCreatedApplication(null);
          }}
          onTrack={(ref) => {
            setShowSlipModal(false);
            setCreatedApplication(null);
            setTrackedRef(ref);
            setActiveMainTab('track');
          }}
        />
      )}
    </div>
  );
};
