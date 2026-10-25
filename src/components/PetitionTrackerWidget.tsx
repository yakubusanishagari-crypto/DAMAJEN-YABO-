import React, { useState } from 'react';
import { 
  Search, CheckCircle2, Clock, ShieldCheck, AlertCircle, FileText, 
  Send, Plus, X, Copy, Check, Award, Landmark, Sparkles, HeartHandshake,
  CheckCheck, ArrowRight, MessageSquare
} from 'lucide-react';
import { ProgramApplication, CommunityPetition } from '../types';
import { OfficialDecisionLetterModal } from './OfficialDecisionLetterModal';
import { generatePetitionerDecisionMessage } from '../utils/petitionMessaging';
import { safeSetItem } from '../utils/safeStorage';

interface Props {
  currentLang: string;
}

export const PetitionTrackerWidget: React.FC<Props> = ({ currentLang }) => {
  const [searchRef, setSearchRef] = useState('');
  const [searchedResult, setSearchedResult] = useState<any | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [notFoundMsg, setNotFoundMsg] = useState(false);
  const [showResolutionOrderModal, setShowResolutionOrderModal] = useState(false);

  // Modal / Form state for submitting a new petition
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Infrastructure & Roads');
  const [customCategoryInput, setCustomCategoryInput] = useState('');
  const [applicantName, setApplicantName] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [ward, setWard] = useState('Yabo Central Ward');
  const [description, setDescription] = useState('');
  const [justGeneratedRef, setJustGeneratedRef] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

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

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchRef.trim();
    if (!query) return;

    setIsSearching(true);
    setHasSearched(true);
    setNotFoundMsg(false);
    let found: any = null;

    // 1. Search in local petitions storage
    try {
      const savedPetitions = localStorage.getItem('danmaje_petitions');
      if (savedPetitions) {
        const pets: any[] = JSON.parse(savedPetitions);
        found = pets.find(p => 
          (p.referenceNumber && p.referenceNumber.toLowerCase() === query.toLowerCase()) ||
          (p.id && p.id.toLowerCase() === query.toLowerCase())
        ) || null;
      }
    } catch {}

    // 2. Search in local applications storage
    if (!found) {
      try {
        const savedApps = localStorage.getItem('danmaje_applications');
        if (savedApps) {
          const apps: any[] = JSON.parse(savedApps);
          found = apps.find(a => 
            (a.referenceNumber && a.referenceNumber.toLowerCase() === query.toLowerCase()) ||
            (a.id && a.id.toLowerCase() === query.toLowerCase())
          ) || null;
        }
      } catch {}
    }

    // 3. Search in live /api/petitions endpoint (Remote Supabase / Server Database)
    if (!found) {
      try {
        const res = await fetch('/api/petitions');
        if (res.ok) {
          const remotePets = await res.json();
          if (Array.isArray(remotePets)) {
            found = remotePets.find((p: any) => 
              (p.referenceNumber && p.referenceNumber.toLowerCase() === query.toLowerCase()) ||
              (p.id && p.id.toLowerCase() === query.toLowerCase())
            ) || null;
          }
        }
      } catch {}
    }

    // 4. Search in live /api/applications endpoint
    if (!found) {
      try {
        const res = await fetch('/api/applications');
        if (res.ok) {
          const remoteApps = await res.json();
          if (Array.isArray(remoteApps)) {
            found = remoteApps.find((a: any) => 
              (a.referenceNumber && a.referenceNumber.toLowerCase() === query.toLowerCase()) ||
              (a.id && a.id.toLowerCase() === query.toLowerCase())
            ) || null;
          }
        }
      } catch {}
    }

    setIsSearching(false);

    if (found) {
      // Normalize field names
      const normalized = {
        ...found,
        applicantName: found.applicantName || found.petitionerName || 'Constituent',
        programTitle: found.programTitle || found.title || 'Community Petition',
        wardOrTown: found.wardOrTown || found.ward || found.targetWard || 'Yabo/Shagari Constituency',
        date: found.date || found.submittedDate || new Date().toISOString().split('T')[0]
      };
      setSearchedResult(normalized);
      setNotFoundMsg(false);
    } else {
      setSearchedResult(null);
      setNotFoundMsg(true);
    }
  };

  const handleGenerateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName.trim() || !newTitle.trim() || !description.trim()) return;

    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const refCode = `PET-YS-${new Date().getFullYear()}-${randomDigits}`;
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];

    const effectiveCategory = newCategory === 'Other'
      ? (customCategoryInput.trim() || 'General Community Petition')
      : newCategory;

    const newTicket = {
      id: `pet-${Date.now()}`,
      referenceNumber: refCode,
      title: newTitle.trim(),
      programTitle: newTitle.trim(),
      category: effectiveCategory,
      programCategory: effectiveCategory,
      petitionerName: applicantName.trim(),
      applicantName: applicantName.trim(),
      email: 'constituent@danmayeyabo.gov.ng',
      petitionerEmail: 'constituent@danmayeyabo.gov.ng',
      phone: applicantPhone.trim() || '+234 803 000 0000',
      petitionerPhone: applicantPhone.trim() || '+234 803 000 0000',
      ward: ward.trim(),
      wardOrTown: ward.trim(),
      localGovernment: 'Yabo',
      description: description.trim(),
      statement: description.trim(),
      date: dateStr,
      submittedDate: dateStr,
      status: 'Submitted',
      signaturesCount: 1,
      timeline: [
        {
          stage: 'SUBMITTED',
          timestamp: `${dateStr} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
          title: 'Petition Docketed & Received',
          note: description.trim(),
          actor: applicantName.trim()
        }
      ]
    };

    // Save to local danmaje_petitions storage
    try {
      const existing = JSON.parse(localStorage.getItem('danmaje_petitions') || '[]');
      existing.unshift(newTicket);
      safeSetItem('danmaje_petitions', JSON.stringify(existing));
    } catch {}

    // Save to local danmaje_applications storage
    try {
      const existingApps = JSON.parse(localStorage.getItem('danmaje_applications') || '[]');
      existingApps.unshift(newTicket);
      safeSetItem('danmaje_applications', JSON.stringify(existingApps));
    } catch {}

    // Asynchronously push to backend & Supabase
    fetch('/api/petitions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTicket)
    }).catch(err => console.warn('API petition post warning:', err));

    setJustGeneratedRef(refCode);
    setSearchRef(refCode);
    setSearchedResult(newTicket);
    setHasSearched(true);
    setNotFoundMsg(false);
    setShowGenerateModal(false);

    // Reset form
    setNewTitle('');
    setApplicantName('');
    setApplicantPhone('');
    setDescription('');
  };

  const handleCopyRef = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#09291F] via-[#103C2E] to-[#0A261E] text-white rounded-3xl p-8 sm:p-12 shadow-2xl space-y-6 border border-[#C6A15B]/40 text-center relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-[#D4AF37]/50 text-xs font-black uppercase tracking-widest text-[#D4AF37] shadow-sm">
          <Landmark className="w-4 h-4 text-[#D4AF37]" />
          <span>CONSTITUENCY PETITION & CITIZEN ADVOCACY DESK</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl sm:text-5xl font-extrabold font-['Manrope'] text-white tracking-tight">
            PETITION SUBMISSION & REAL-TIME TRACKER
          </h1>
          <p className="text-emerald-100 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed font-light">
            Submit formal citizen petitions or grievances directly to the Office of Hon. Umar Yusuf (Danmaje Yabo). Look up your official reference code below to track legislative evaluation, committee appraisals, and formal decisions.
          </p>
        </div>

        {/* PROMINENT ACTION BUTTON: SUBMIT PETITION */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => setShowGenerateModal(true)}
            className="bg-gradient-to-r from-[#D4AF37] via-[#C6A15B] to-[#B38F44] hover:brightness-110 active:scale-95 text-[#09291F] px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wider shadow-2xl transition cursor-pointer border-2 border-[#E5C16C] flex items-center gap-3 transform hover:-translate-y-0.5"
          >
            <Send className="w-5 h-5 text-[#09291F]" />
            <span>SUBMIT PETITION</span>
          </button>
        </div>

        {/* PROMINENT SEARCH BAR & TRACK PETITION BUTTON */}
        <form onSubmit={handleTrack} className="max-w-2xl mx-auto pt-2 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-stone-400 absolute left-4 top-4" />
            <input
              type="text"
              required
              placeholder="Enter Reference Number (e.g. PET-YS-2026-...)"
              value={searchRef}
              onChange={(e) => setSearchRef(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white text-[#09291F] rounded-2xl font-mono text-xs sm:text-sm shadow-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37] border border-stone-200"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="bg-gradient-to-r from-[#D4AF37] via-[#C6A15B] to-[#B38F44] hover:brightness-110 active:scale-95 text-[#09291F] px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wider shadow-2xl transition cursor-pointer border-2 border-[#E5C16C] flex items-center justify-center gap-2 shrink-0 transform hover:-translate-y-0.5"
          >
            <Search className="w-5 h-5 text-[#09291F]" />
            <span>{isSearching ? 'TRACKING...' : 'TRACK PETITION'}</span>
          </button>
        </form>
      </div>

      {/* Success Notification if Just Generated */}
      {justGeneratedRef && (
        <div className="bg-emerald-50 border-2 border-emerald-500 p-6 rounded-3xl text-emerald-900 space-y-3 shadow-xl animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 font-black text-sm sm:text-base uppercase tracking-wide text-emerald-950">
              <CheckCircle2 className="w-6 h-6 text-emerald-700" />
              <span>Petition Submitted & Reference Authenticated!</span>
            </div>
            <button
              onClick={() => setJustGeneratedRef(null)}
              className="text-stone-400 hover:text-stone-700 cursor-pointer p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-stone-700 leading-relaxed">
            Your community petition has been safely docketed into the official National Assembly constituency database. Use your unique reference code to track committee deliberations and official resolutions:
          </p>
          <div className="flex items-center justify-between bg-white p-3.5 rounded-2xl border border-emerald-300 font-mono text-sm shadow-sm">
            <strong className="text-[#103C2E] font-black text-base">{justGeneratedRef}</strong>
            <button
              onClick={() => handleCopyRef(justGeneratedRef)}
              className="bg-emerald-800 hover:bg-emerald-900 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase cursor-pointer flex items-center gap-1.5 shadow"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied Reference!' : 'Copy Code'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Not Found Notification */}
      {hasSearched && notFoundMsg && (
        <div className="bg-amber-50 border border-amber-300 p-6 rounded-3xl text-amber-950 space-y-2 shadow-md animate-fadeIn">
          <div className="flex items-center gap-2 font-bold text-sm uppercase">
            <AlertCircle className="w-5 h-5 text-amber-700" />
            <span>No Record Found For "{searchRef}"</span>
          </div>
          <p className="text-xs text-amber-900 leading-relaxed">
            Please verify the reference code format (e.g. <code>PET-YS-2026-XXXX</code> or <code>DAN-PET-...</code>). If you have not submitted a petition yet, click the bold <strong>SUBMIT PETITION</strong> button above to log your community issue directly.
          </p>
        </div>
      )}

      {/* Submit Petition Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-5 shadow-2xl border-2 border-[#103C2E] max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#103C2E]" />
                <h3 className="font-['Manrope'] font-black text-[#103C2E] text-base uppercase">
                  SUBMIT OFFICIAL COMMUNITY PETITION
                </h3>
              </div>
              <button onClick={() => setShowGenerateModal(false)} className="text-stone-400 hover:text-stone-700 cursor-pointer p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGenerateTicket} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#103C2E] uppercase">Petitioner / Community Lead Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Malam Aliyu Dan-Yabo"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium focus:ring-2 focus:ring-[#103C2E] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#103C2E] uppercase">Contact Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+234 803 000 0000"
                    value={applicantPhone}
                    onChange={(e) => setApplicantPhone(e.target.value)}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium focus:ring-2 focus:ring-[#103C2E] focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#103C2E] uppercase">Constituency Ward / Location *</label>
                  <select
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium focus:ring-2 focus:ring-[#103C2E] focus:outline-none"
                  >
                    {wardsList.map(w => (
                      <option key={w} value={w}>{w}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#103C2E] uppercase">Sector / Category *</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium focus:ring-2 focus:ring-[#103C2E] focus:outline-none"
                >
                  <option value="Infrastructure & Roads">Infrastructure & Roads</option>
                  <option value="Water & Boreholes">Water & Solar Boreholes</option>
                  <option value="Healthcare & Clinics">Healthcare & Clinics</option>
                  <option value="Education & Schools">Education & Schools</option>
                  <option value="Agriculture & Irrigation">Agriculture & Irrigation</option>
                  <option value="Youth & Women Empowerment">Youth & Women Empowerment</option>
                  <option value="Public Safety & Security">Public Safety & Security</option>
                  <option value="General Constituency Petition">General Constituency Petition</option>
                  <option value="Other">OTHER (Specify Custom Category)</option>
                </select>
              </div>

              {/* Dynamically Revealed Custom Category Input when OTHER is selected */}
              {newCategory === 'Other' && (
                <div className="space-y-1.5 p-3.5 bg-amber-50/80 border border-amber-300 rounded-2xl animate-fadeIn">
                  <label className="font-bold text-[#103C2E] uppercase flex items-center gap-1.5 text-[11px]">
                    <Sparkles className="w-3.5 h-3.5 text-[#C6A15B]" />
                    <span>Specify Custom Sector / Category *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rural Electrification, Solar Cold Storage, Flood Hazard Relief..."
                    value={customCategoryInput}
                    onChange={(e) => setCustomCategoryInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border-2 border-[#103C2E] rounded-xl font-medium focus:ring-2 focus:ring-[#D4AF37] focus:outline-none text-xs"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="font-bold text-[#103C2E] uppercase">Petition Title / Subject *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Urgent Repair of Solar Powered Borehole at Kuchi Central Market"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-800 focus:ring-2 focus:ring-[#103C2E] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#103C2E] uppercase">Comprehensive Grievance & Scope Description *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detail the community problem, affected citizens, expected grassroots impact, and requested legislative/constituency intervention..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium focus:ring-2 focus:ring-[#103C2E] focus:outline-none leading-relaxed"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowGenerateModal(false)}
                  className="bg-stone-100 hover:bg-stone-200 text-stone-700 px-5 py-2.5 rounded-xl font-bold uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#103C2E] to-[#09291F] hover:from-[#09291F] hover:to-[#051A13] text-[#D4AF37] px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-wider shadow-xl transition cursor-pointer border border-[#C6A15B]/50 flex items-center gap-2"
                >
                  <Send className="w-4 h-4 text-[#C6A15B]" />
                  <span>SUBMIT PETITION</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESULT CARD & DIGNIFIED STATUS SECTION */}
      {hasSearched && searchedResult && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-stone-200 space-y-8 animate-fadeIn">
          {/* Top Reference & Status Strip */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-100 pb-5">
            <div>
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">Official Tracking Code</span>
              <h3 className="font-mono font-black text-2xl text-[#103C2E] mt-0.5">{searchedResult.referenceNumber}</h3>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Dynamic Status Badge */}
              <span className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider border flex items-center gap-2 ${
                searchedResult.status === 'APPROVED' || searchedResult.status === 'Approved' || searchedResult.status === 'Passed'
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300' :
                searchedResult.status === 'REJECTED' || searchedResult.status === 'Rejected'
                  ? 'bg-stone-100 text-stone-900 border-stone-300' :
                searchedResult.status === 'Under Review' || searchedResult.status === 'INITIAL REVIEW'
                  ? 'bg-amber-100 text-amber-900 border-amber-300' :
                  'bg-blue-100 text-blue-900 border-blue-300'
              }`}>
                <span className={`w-2.5 h-2.5 rounded-full ${
                  searchedResult.status === 'APPROVED' || searchedResult.status === 'Approved' || searchedResult.status === 'Passed'
                    ? 'bg-emerald-600' :
                  searchedResult.status === 'REJECTED' || searchedResult.status === 'Rejected'
                    ? 'bg-stone-600' :
                    'bg-amber-600 animate-pulse'
                }`}></span>
                <span>STATUS: {
                  searchedResult.status === 'APPROVED' || searchedResult.status === 'Approved' || searchedResult.status === 'Passed'
                    ? 'UPHELD & APPROVED FOR INTERVENTION' :
                  searchedResult.status === 'REJECTED' || searchedResult.status === 'Rejected'
                    ? 'REVIEW CONCLUDED / RESPECTFUL ADVISORY' :
                  searchedResult.status === 'Under Review' || searchedResult.status === 'INITIAL REVIEW'
                    ? 'UNDER LEGISLATIVE & FIELD REVIEW' :
                    'DOCKETED & RECEIVED'
                }</span>
              </span>

              {/* Action Button to Open Official Resolution Letter */}
              {(searchedResult.status === 'APPROVED' || searchedResult.status === 'Approved' || searchedResult.status === 'Passed' || searchedResult.status === 'REJECTED' || searchedResult.status === 'Rejected' || searchedResult.decisionLetter) && (
                <button
                  onClick={() => setShowResolutionOrderModal(true)}
                  className="bg-gradient-to-r from-[#D4AF37] to-[#C6A15B] hover:brightness-110 active:scale-95 text-[#09291F] px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 shadow-md cursor-pointer transition uppercase tracking-wider border border-[#E5C16C]"
                >
                  <Award className="w-4 h-4 text-[#09291F]" />
                  <span>OFFICIAL DECISION LETTER</span>
                </button>
              )}
            </div>
          </div>

          {/* Submission Particulars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-50 p-6 rounded-2xl border border-stone-200 text-xs">
            <div className="space-y-1">
              <span className="text-stone-400 font-bold uppercase tracking-wider text-[10px]">Petitioner / Signatory Lead</span>
              <strong className="text-[#103C2E] text-sm block">{searchedResult.applicantName}</strong>
            </div>
            <div className="space-y-1">
              <span className="text-stone-400 font-bold uppercase tracking-wider text-[10px]">Petition Title / Subject</span>
              <strong className="text-[#103C2E] text-sm block">{searchedResult.programTitle}</strong>
            </div>
            <div className="space-y-1">
              <span className="text-stone-400 font-bold uppercase tracking-wider text-[10px]">Ward & Federal Constituency</span>
              <span className="text-stone-800 font-semibold block">{searchedResult.wardOrTown} (Yabo/Shagari)</span>
            </div>
            <div className="space-y-1">
              <span className="text-stone-400 font-bold uppercase tracking-wider text-[10px]">Official Date Received</span>
              <span className="text-stone-800 font-mono block">{searchedResult.date}</span>
            </div>
          </div>

          {/* ========================================================
              DIGNIFIED, RESPECTFUL, AND WISDOM-FILLED RESPONSE SECTION
             ======================================================== */}
          {(() => {
            const isApproved = searchedResult.status === 'APPROVED' || searchedResult.status === 'Approved' || searchedResult.status === 'Passed';
            const isRejected = searchedResult.status === 'REJECTED' || searchedResult.status === 'Rejected';

            // Extract structured or fallback decision data
            const msgObj = typeof searchedResult.decisionMessage === 'object' && searchedResult.decisionMessage ? searchedResult.decisionMessage : null;
            const decisionNotes = searchedResult.decision?.decisionNotes || searchedResult.reviewNotes || searchedResult.publicFeedback;

            const summaryText = msgObj?.decisionSummary || msgObj?.executiveSummary || (
              isApproved
                ? `On behalf of the Office of Hon. Umar Yusuf (Danmaje Yabo), Member representing Yabo/Shagari Federal Constituency, we officially inform you that your community petition regarding "${searchedResult.programTitle}" has been rigorously reviewed and formally APPROVED for constituency intervention.`
                : isRejected
                ? `The Office of Hon. Umar Yusuf (Danmaje Yabo) presents its highest regards and conveys sincere appreciation for your community dedication in bringing "${searchedResult.programTitle}" to our legislative attention. Following comprehensive statutory and technical evaluation, this specific petition cannot be approved under the current fiscal appropriation cycle.`
                : 'Your submission has been authenticated and queued for preliminary legislative scoping.'
            );

            const rationaleText = msgObj?.detailedRationale || msgObj?.detailedReason || decisionNotes || (
              isApproved
                ? `Our technical works desk conducted an appraisal of the needs articulated in your petition and verified the significant grassroots impact for ${searchedResult.wardOrTown}. Hon. Umar Yusuf has approved the formal scheduling and appropriation of this project into the upcoming constituency intervention cycle.`
                : isRejected
                ? `Our legislative committee determined that the requested intervention falls primarily within municipal/state council jurisdiction or exceeds statutory federal appropriation envelopes for the current cycle. We believe in providing truthful, accountable governance to every constituent.`
                : 'Assigned for field verification in your ward.'
            );

            const encouragementText = msgObj?.communityEncouragement || (
              isApproved
                ? `We warmly commend your proactive leadership and civic consciousness. Sustainable, grassroots progress across Yabo and Shagari relies on vigilant, caring citizens who bring critical community needs forward through peaceful and democratic channels. We urge you and your community elders to maintain this commendable spirit of active civic stewardship.`
                : isRejected
                ? `Please accept our deepest respect and gratitude for your civic initiative and public spirit. While this specific request could not be approved under current parameters, your active concern for your neighborhood reflects the highest standard of community responsibility. A decision not to proceed directly does not diminish the merit of your engagement. Hon. Umar Yusuf warmly urges you and fellow signatories to continue participating constructively in our quarterly Town Halls and consultative assemblies.`
                : 'Constructive citizen engagement is the foundation of responsive legislative governance.'
            );

            const nextStepsText = msgObj?.nextStepsOrAlternatives || (
              isApproved
                ? `The Constituency Project Implementation Bureau will maintain direct contact with community leaders regarding site scoping and execution timelines.`
                : isRejected
                ? `We have registered your community on our priority consultative roster. We encourage you to participate in our ongoing Town Hall polls or contact our Ward Liaison Officers regarding our smallholder grant and vocational empowerment schemes.`
                : 'Field officers are conducting fact-finding inquiries.'
            );

            return (
              <div className={`p-6 sm:p-8 rounded-3xl border-2 space-y-5 ${
                isApproved 
                  ? 'bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50 border-emerald-400 shadow-lg' 
                  : isRejected 
                  ? 'bg-gradient-to-br from-stone-50 via-white to-amber-50/30 border-stone-300 shadow-md' 
                  : 'bg-blue-50/60 border-blue-200'
              }`}>
                {/* Official Crest Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                      isApproved ? 'bg-emerald-800 text-[#D4AF37]' : isRejected ? 'bg-stone-800 text-stone-200' : 'bg-blue-800 text-white'
                    }`}>
                      {isApproved ? <CheckCircle2 className="w-6 h-6" /> : isRejected ? <Landmark className="w-5 h-5 text-[#D4AF37]" /> : <Clock className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="font-['Manrope'] font-black uppercase text-xs sm:text-sm tracking-wider text-[#103C2E]">
                        {isApproved ? 'OFFICIAL LEGISLATIVE RESOLUTION & APPROVAL' : isRejected ? 'OFFICIAL LEGISLATIVE DETERMINATION & CIVIC ADVISORY' : 'LEGISLATIVE INQUIRY IN PROGRESS'}
                      </h4>
                      <span className="text-[11px] text-stone-500 font-semibold">
                        Office of Hon. Umar Yusuf (Danmaje Yabo) • House of Representatives, Abuja
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono font-bold text-stone-400">
                    Logged: {searchedResult.date}
                  </span>
                </div>

                {/* 1. Decision Summary */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#103C2E] block">
                    1. Executive Summary & Determination
                  </span>
                  <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-medium">
                    {summaryText}
                  </p>
                </div>

                {/* 2. Detailed Rationale */}
                <div className="space-y-1.5 bg-white p-4 rounded-2xl border border-stone-200">
                  <span className="text-[11px] font-black uppercase tracking-wider text-stone-600 block flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#103C2E]" />
                    <span>2. Committee Evaluation & Technical Appraisal</span>
                  </span>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    {rationaleText}
                  </p>
                  {searchedResult.awardGrantPackage && (
                    <div className="pt-2 mt-2 border-t border-stone-100 flex items-center gap-2">
                      <span className="font-bold text-[#103C2E] uppercase text-[10px]">Appropriated Relief Package:</span>
                      <span className="font-black text-emerald-800 text-xs">{searchedResult.awardGrantPackage}</span>
                    </div>
                  )}
                </div>

                {/* 3. Inspiring Civic Encouragement */}
                <div className={`p-4 rounded-2xl border space-y-1.5 ${
                  isApproved 
                    ? 'bg-emerald-950 text-emerald-50 border-emerald-800' 
                    : 'bg-[#103C2E] text-stone-100 border-emerald-900'
                }`}>
                  <span className="text-[11px] font-black uppercase tracking-wider text-[#D4AF37] flex items-center gap-1.5">
                    <HeartHandshake className="w-4 h-4 text-[#D4AF37]" />
                    <span>3. Civic Stewardship & Ongoing Community Participation</span>
                  </span>
                  <p className="text-xs leading-relaxed text-stone-200 font-light">
                    {encouragementText}
                  </p>
                </div>

                {/* 4. Next Steps */}
                <div className="space-y-1 pt-1">
                  <span className="text-[11px] font-black uppercase tracking-wider text-stone-500 block">
                    4. Operational Next Steps & Civic Avenues
                  </span>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    {nextStepsText}
                  </p>
                </div>

                {/* Footer Action */}
                <div className="pt-3 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-[11px] text-stone-500 italic">
                    Signed & issued under the authority of Hon. Umar Yusuf (Danmaje Yabo)
                  </span>

                  <button
                    onClick={() => setShowResolutionOrderModal(true)}
                    className="bg-[#103C2E] hover:bg-[#09291F] text-[#D4AF37] px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow cursor-pointer transition flex items-center gap-2 border border-[#C6A15B]/40"
                  >
                    <Award className="w-4 h-4 text-[#D4AF37]" />
                    <span>View Formal Letter</span>
                  </button>
                </div>
              </div>
            );
          })()}

          {/* Audit Timeline */}
          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-xs uppercase text-[#103C2E] tracking-wider">
              Legislative Queue & Audit Trail
            </h4>
            <div className="space-y-2.5">
              {(searchedResult.timeline || [
                { stage: 'SUBMITTED', timestamp: searchedResult.date, title: 'Petition Logged in Parliamentary Tracking Queue' },
                { stage: searchedResult.status, timestamp: 'Current', title: searchedResult.reviewNotes || 'Administrative triage and committee appraisal completed' }
              ]).map((item: any, idx: number) => (
                <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                  <div className="w-7 h-7 rounded-full bg-[#103C2E] text-[#D4AF37] flex items-center justify-center shrink-0 font-bold text-xs">
                    {idx + 1}
                  </div>
                  <div>
                    <strong className="text-[#103C2E] text-xs font-bold block uppercase">{item.stage} • {item.title}</strong>
                    <span className="text-[10px] text-stone-500 font-mono block mt-0.5">{item.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Resolution & Commendation Modal */}
      {showResolutionOrderModal && searchedResult && (
        <OfficialDecisionLetterModal
          message={generatePetitionerDecisionMessage(
            searchedResult,
            (searchedResult.status === 'APPROVED' || searchedResult.status === 'Approved' || searchedResult.status === 'Passed') ? 'APPROVED' : 'REJECTED',
            searchedResult.publicFeedback || searchedResult.decisionNotes,
            searchedResult.awardGrantPackage
          )}
          onClose={() => setShowResolutionOrderModal(false)}
        />
      )}
    </div>
  );
};
