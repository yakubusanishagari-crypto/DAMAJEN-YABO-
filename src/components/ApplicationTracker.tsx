import React, { useState } from 'react';
import { ProgramApplication } from '../types';
import { Search, CheckCircle2, Clock, AlertCircle, FileText, ArrowRight, Printer, Shield, ChevronRight, Download, RefreshCw } from 'lucide-react';
import { ApplicationSlipModal } from './ApplicationSlipModal';

interface Props {
  applications?: ProgramApplication[];
  initialRef?: string;
  onApplyNew?: () => void;
}

const DEFAULT_STAGES = [
  { id: 'SUBMITTED', title: 'APPLICATION SUBMITTED', desc: 'Application received and stored in constituency database.' },
  { id: 'INITIAL REVIEW', title: 'INITIAL REVIEW', desc: 'Screening desk reviews completeness of personal data & criteria.' },
  { id: 'DOCUMENT VERIFICATION', title: 'DOCUMENT VERIFICATION', desc: 'Verification of NIN, indigene certification, and credentials.' },
  { id: 'ELIGIBILITY ASSESSMENT', title: 'ELIGIBILITY ASSESSMENT', desc: 'Assessment against statutory constituency guidelines.' },
  { id: 'FINAL REVIEW', title: 'FINAL REVIEW & SELECTION', desc: 'Committee review for quota allocation and beneficiary listing.' },
  { id: 'DECISION', title: 'FINAL DECISION', desc: 'Approved for disbursement / training / or waitlisted for next cohort.' }
];

export const ApplicationTracker: React.FC<Props> = ({ applications = [], initialRef = '', onApplyNew }) => {
  const [refInput, setRefInput] = useState(initialRef);
  const [phoneOrEmailInput, setPhoneOrEmailInput] = useState('');
  const [searched, setSearched] = useState(false);
  const [currentApp, setCurrentApp] = useState<ProgramApplication | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [showSlipModal, setShowSlipModal] = useState(false);

  // Sync if initialRef is passed
  React.useEffect(() => {
    if (initialRef) {
      setRefInput(initialRef);
      findApplication(initialRef, '');
    }
  }, [initialRef]);

  const findApplication = (ref: string, verifier: string) => {
    const trimmedRef = ref.trim().toUpperCase();
    const trimmedVer = verifier.trim().toLowerCase();

    // Pull latest from localStorage to ensure newly submitted apps are found immediately
    let allApps = [...applications];
    try {
      const stored = JSON.parse(localStorage.getItem('danmaje_applications') || '[]');
      if (Array.isArray(stored)) {
        // Merge without duplicates
        const map = new Map<string, ProgramApplication>();
        [...allApps, ...stored].forEach(a => map.set(a.id, a));
        allApps = Array.from(map.values());
      }
    } catch {
      // Ignore
    }

    const matched = allApps.find(a => {
      const matchesRef = a.referenceNumber.toUpperCase() === trimmedRef;
      if (!matchesRef) return false;
      // If verifier provided, check phone or email; if not provided (e.g. from direct slip click), match directly
      if (trimmedVer) {
        const cleanAppPhone = a.phone.replace(/[\s-]/g, '').toLowerCase();
        const cleanInputPhone = trimmedVer.replace(/[\s-]/g, '').toLowerCase();
        const matchesPhone = cleanAppPhone.includes(cleanInputPhone) || cleanInputPhone.includes(cleanAppPhone);
        const matchesEmail = a.email && a.email.toLowerCase() === trimmedVer;
        return matchesPhone || matchesEmail;
      }
      return true;
    });

    if (matched) {
      setCurrentApp(matched);
      setErrorMsg('');
    } else {
      setCurrentApp(null);
      setErrorMsg('No application found matching the provided reference number and verification details. Please double-check and try again.');
    }
    setSearched(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refInput.trim()) {
      setErrorMsg('Please enter your Application Reference Number.');
      return;
    }
    findApplication(refInput, phoneOrEmailInput);
  };

  const getStageIndex = (status: string) => {
    const s = (status || '').toUpperCase();
    if (s.includes('SUBMIT')) return 0;
    if (s.includes('INITIAL')) return 1;
    if (s.includes('DOC') || s.includes('VERIF')) return 2;
    if (s.includes('ELIGIB')) return 3;
    if (s.includes('FINAL') || s.includes('REVIEW')) return 4;
    if (s.includes('APPROV') || s.includes('REJECT') || s.includes('WAITLIST') || s.includes('DECLIN')) return 5;
    return 1;
  };

  const currentStageIdx = currentApp ? getStageIndex(currentApp.status) : 0;

  return (
    <div className="space-y-8">
      {/* Lookup Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-stone-200/80">
        <div className="max-w-3xl space-y-3 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#103C2E]/10 text-[#103C2E] text-xs font-bold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5 text-[#C6A15B]" />
            <span>SECURE CONSTITUENCY TRACKING PORTAL</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#103C2E] font-['Manrope'] uppercase">
            TRACK APPLICATION PROGRESS
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
            Enter your official Application Reference Number and the phone number or email provided during submission to view live phase-by-phase updates, committee review notes, and reprint your official slip.
          </p>
        </div>

        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-6 space-y-1">
            <label className="text-xs font-bold text-[#103C2E] uppercase">
              APPLICATION REFERENCE CODE *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="e.g. DAN-EMP-2026-88192"
                value={refInput}
                onChange={(e) => setRefInput(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-mono font-bold text-[#103C2E] focus:outline-none focus:border-[#103C2E]"
              />
            </div>
          </div>

          <div className="sm:col-span-4 space-y-1">
            <label className="text-xs font-bold text-[#103C2E] uppercase">
              REGISTERED PHONE OR EMAIL
            </label>
            <input
              type="text"
              placeholder="e.g. 0803... or email"
              value={phoneOrEmailInput}
              onChange={(e) => setPhoneOrEmailInput(e.target.value)}
              className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-[#103C2E] focus:outline-none focus:border-[#103C2E]"
            />
          </div>

          <div className="sm:col-span-2 flex items-end">
            <button
              type="submit"
              className="w-full bg-[#103C2E] hover:bg-[#09291F] text-white py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition uppercase tracking-wider"
            >
              <Search className="w-4 h-4 text-[#C6A15B]" />
              <span>TRACK</span>
            </button>
          </div>
        </form>

        {errorMsg && (
          <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Application Status Result */}
      {currentApp && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-[#C6A15B]/30 space-y-8 animate-fadeIn">
          
          {/* Header Summary */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-stone-200">
            <div>
              <span className="text-xs font-mono font-bold text-[#C6A15B] uppercase tracking-wider">
                REF: {currentApp.referenceNumber}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#103C2E] font-['Manrope'] mt-0.5">
                {currentApp.applicantName}
              </h3>
              <p className="text-xs text-stone-500 font-medium">
                {currentApp.programTitle} • Submitted on {currentApp.date}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border ${
                currentApp.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                currentApp.status === 'REJECTED' ? 'bg-rose-100 text-rose-800 border-rose-300' :
                currentApp.status === 'WAITLISTED' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                'bg-amber-100 text-amber-900 border-amber-300'
              }`}>
                {currentApp.status}
              </span>

              <button
                onClick={() => setShowSlipModal(true)}
                className="bg-[#103C2E] hover:bg-[#09291F] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow cursor-pointer transition uppercase tracking-wider"
              >
                <FileText className="w-4 h-4 text-[#C6A15B]" />
                <span>VIEW OFFICIAL SLIP</span>
              </button>
            </div>
          </div>

          {/* Committee Advisory / Public Feedback */}
          {currentApp.publicFeedback && (
            <div className="bg-emerald-50 border-2 border-emerald-300/80 rounded-2xl p-5 space-y-1.5 text-emerald-950">
              <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider text-emerald-900">
                <Shield className="w-4 h-4 text-emerald-700" />
                <span>OFFICIAL NOTICE FROM VERIFICATION COMMITTEE:</span>
              </div>
              <p className="text-xs sm:text-sm font-medium leading-relaxed">
                "{currentApp.publicFeedback}"
              </p>
            </div>
          )}

          {/* Phase-by-Phase Timeline Stepper */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#103C2E] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#C6A15B]" />
              PHASE-BY-PHASE APPLICATION MILESTONES
            </h4>

            <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-stone-200">
              {DEFAULT_STAGES.map((stage, idx) => {
                const isPassed = idx < currentStageIdx;
                const isCurrent = idx === currentStageIdx;
                const isPending = idx > currentStageIdx;

                return (
                  <div key={stage.id} className="relative flex items-start gap-4">
                    {/* Circle Indicator */}
                    <div className={`absolute -left-6 sm:-left-8 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                      isPassed ? 'bg-emerald-600 text-white shadow-md' :
                      isCurrent ? 'bg-[#103C2E] text-white ring-4 ring-emerald-200 animate-pulse' :
                      'bg-stone-100 text-stone-400 border border-stone-300'
                    }`}>
                      {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>

                    {/* Stage Card */}
                    <div className={`w-full p-4 rounded-2xl border transition-all ${
                      isCurrent ? 'bg-[#FAF9F5] border-[#103C2E] shadow-sm' :
                      isPassed ? 'bg-white border-stone-200' :
                      'bg-stone-50/60 border-stone-100 opacity-60'
                    }`}>
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1">
                        <span className={`text-xs font-black uppercase tracking-wider ${
                          isCurrent ? 'text-[#103C2E]' : isPassed ? 'text-emerald-800' : 'text-stone-500'
                        }`}>
                          {stage.title}
                        </span>

                        <span className="text-[11px] font-bold">
                          {isPassed && <span className="text-emerald-700">COMPLETED</span>}
                          {isCurrent && <span className="text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">CURRENT STAGE</span>}
                          {isPending && <span className="text-stone-400">PENDING</span>}
                        </span>
                      </div>

                      <p className="text-xs text-stone-600 font-light mt-1">
                        {stage.desc}
                      </p>

                      {isPassed && idx === 0 && (
                        <p className="text-[10px] text-stone-400 mt-2 font-mono">
                          Recorded: {currentApp.date} {currentApp.submissionTime || ''}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-stone-200 text-xs">
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/80">
              <span className="text-stone-500 block text-[10px] uppercase font-bold">Constituency Ward:</span>
              <span className="font-bold text-[#103C2E]">{currentApp.wardOrTown} ({currentApp.lga || 'Yabo/Shagari'})</span>
            </div>
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/80">
              <span className="text-stone-500 block text-[10px] uppercase font-bold">Registered Phone:</span>
              <span className="font-bold text-[#103C2E]">{currentApp.phone}</span>
            </div>
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/80">
              <span className="text-stone-500 block text-[10px] uppercase font-bold">Verification Desk:</span>
              <span className="font-bold text-[#103C2E]">Yabo/Shagari Federal Constituency Liaison Office</span>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              onClick={() => {
                setSearched(false);
                setCurrentApp(null);
                setRefInput('');
                setPhoneOrEmailInput('');
              }}
              className="text-stone-500 hover:text-stone-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>TRACK ANOTHER APPLICATION</span>
            </button>

            <button
              onClick={() => setShowSlipModal(true)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow cursor-pointer transition uppercase tracking-wider"
            >
              <Printer className="w-4 h-4" />
              <span>PRINT / DOWNLOAD ACKNOWLEDGMENT SLIP</span>
            </button>
          </div>
        </div>
      )}

      {/* Slip Modal Popup */}
      {showSlipModal && currentApp && (
        <ApplicationSlipModal
          application={currentApp}
          onClose={() => setShowSlipModal(false)}
        />
      )}
    </div>
  );
};
