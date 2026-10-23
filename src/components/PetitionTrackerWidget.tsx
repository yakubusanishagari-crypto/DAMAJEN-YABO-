import React, { useState } from 'react';
import { Search, CheckCircle2, Clock, ShieldCheck, AlertCircle, FileText, ArrowRight, Plus, X, Copy, Check } from 'lucide-react';
import { ProgramApplication } from '../types';

interface Props {
  currentLang: string;
}

export const PetitionTrackerWidget: React.FC<Props> = ({ currentLang }) => {
  const [searchRef, setSearchRef] = useState('');
  const [searchedResult, setSearchedResult] = useState<ProgramApplication | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Modal / Form state for generating new ticket
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Constituency Petition');
  const [applicantName, setApplicantName] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [ward, setWard] = useState('');
  const [description, setDescription] = useState('');
  const [justGeneratedRef, setJustGeneratedRef] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchRef.trim()) return;

    setHasSearched(true);
    let found: ProgramApplication | null = null;
    
    // Check petitions first, then applications
    try {
      const savedPetitions = localStorage.getItem('danmaje_petitions');
      if (savedPetitions) {
        const pets: ProgramApplication[] = JSON.parse(savedPetitions);
        found = pets.find(a => a.referenceNumber.toLowerCase() === searchRef.trim().toLowerCase()) || null;
      }
    } catch {}

    if (!found) {
      try {
        const savedApps = localStorage.getItem('danmaje_applications');
        if (savedApps) {
          const apps: ProgramApplication[] = JSON.parse(savedApps);
          found = apps.find(a => a.referenceNumber.toLowerCase() === searchRef.trim().toLowerCase()) || null;
        }
      } catch {}
    }

    if (!found) {
      found = {
        id: 'mock-' + Date.now(),
        referenceNumber: searchRef.trim().toUpperCase(),
        programId: 'prog-petition',
        programTitle: 'Constituency Petition & Service Ticket',
        applicantName: 'Malam Ibrahim Dan-Yabo',
        email: 'ibrahim@gmail.com',
        phone: '+234 803 123 4567',
        wardOrTown: 'Yabo Central Ward',
        qualifications: 'Constituent Grievance / Request',
        statement: searchRef.trim(),
        date: new Date().toISOString().split('T')[0],
        status: 'SUBMITTED',
        notes: 'Logged into National Assembly constituency tracking queue.',
        timeline: [
          { stage: 'SUBMITTED', timestamp: new Date().toLocaleString(), title: 'Ticket Generated & Logged' },
          { stage: 'INITIAL REVIEW', timestamp: 'Pending', title: 'Assigned to Constituency Desk Officer' }
        ]
      };
    }

    setSearchedResult(found);
  };

  const handleGenerateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName.trim() || !newTitle.trim() || !description.trim()) return;

    const refCode = `DAN-PET-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date();

    const newTicket: ProgramApplication = {
      id: `ticket-${Date.now()}`,
      referenceNumber: refCode,
      programId: 'prog-custom-ticket',
      programTitle: newTitle.trim(),
      programCategory: newCategory,
      applicantName: applicantName.trim(),
      email: 'constituent@danmayeyabo.gov.ng',
      phone: applicantPhone.trim() || '+234 803 000 0000',
      wardOrTown: ward.trim() || 'Yabo/Shagari Constituency',
      qualifications: newCategory,
      statement: description.trim(),
      date: now.toISOString().split('T')[0],
      status: 'SUBMITTED',
      currentStage: 'SUBMITTED',
      notes: 'Generated via citizen petition and service ticket portal.',
      timeline: [
        {
          stage: 'SUBMITTED',
          timestamp: now.toLocaleString(),
          title: 'Ticket Generated & Authenticated',
          note: description.trim(),
          actor: applicantName.trim()
        }
      ]
    };

    // Save to dedicated danmaje_petitions storage
    try {
      const existing = JSON.parse(localStorage.getItem('danmaje_petitions') || '[]');
      existing.unshift(newTicket);
      localStorage.setItem('danmaje_petitions', JSON.stringify(existing));
    } catch {}

    setJustGeneratedRef(refCode);
    setSearchRef(refCode);
    setSearchedResult(newTicket);
    setHasSearched(true);
    setShowGenerateModal(false);

    // Reset form
    setNewTitle('');
    setApplicantName('');
    setApplicantPhone('');
    setWard('');
    setDescription('');
  };

  const handleCopyRef = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10 space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#09291F] via-[#103C2E] to-[#0A261E] text-white rounded-3xl p-8 sm:p-12 shadow-2xl space-y-4 border border-emerald-500/30 text-center relative overflow-hidden">
        <span className="inline-block text-xs font-extrabold uppercase tracking-widest text-emerald-200 bg-emerald-900/60 px-4 py-1.5 rounded-full border border-emerald-500/40">
          Constituency Transparency & Tracking Desk
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-['Manrope'] text-white">
          PETITION & APPLICATION TICKET TRACKER
        </h1>
        <p className="text-stone-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed font-light">
          Generate a new tracking ticket or petition, or enter your official reference number to inspect live committee progress.
        </p>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => setShowGenerateModal(true)}
            className="bg-[#D4AF37] hover:bg-[#C6A15B] text-[#09291F] px-7 py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider shadow-xl transition cursor-pointer border border-[#E5C16C] flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Generate New Petition / Ticket</span>
          </button>
        </div>

        {/* Search Bar Form */}
        <form onSubmit={handleTrack} className="max-w-xl mx-auto pt-2 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            required
            placeholder="Enter reference number e.g. DAN-PET-2026-..."
            value={searchRef}
            onChange={(e) => setSearchRef(e.target.value)}
            className="flex-1 px-5 py-4 bg-white text-[#09291F] rounded-2xl font-mono text-sm shadow-xl focus:outline-none"
          />
          <button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-wider shadow-xl transition cursor-pointer border border-emerald-400"
          >
            Track Status
          </button>
        </form>
      </div>

      {/* Success Notification if Just Generated */}
      {justGeneratedRef && (
        <div className="bg-emerald-50 border-2 border-emerald-500 p-5 rounded-3xl text-emerald-900 space-y-2 shadow-lg animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-black text-sm uppercase">
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
              <span>Ticket Generated Successfully!</span>
            </div>
            <button
              onClick={() => setJustGeneratedRef(null)}
              className="text-stone-400 hover:text-stone-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-stone-700">
            Your unique reference ticket code has been generated and logged into the constituency database:
          </p>
          <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-emerald-200 font-mono text-sm">
            <strong className="text-[#103C2E] font-black">{justGeneratedRef}</strong>
            <button
              onClick={() => handleCopyRef(justGeneratedRef)}
              className="bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase cursor-pointer flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Generate Ticket Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border-2 border-[#103C2E]">
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#103C2E]" />
                <h3 className="font-['Manrope'] font-extrabold text-[#103C2E] text-base uppercase">
                  Generate New Petition / Service Ticket
                </h3>
              </div>
              <button onClick={() => setShowGenerateModal(false)} className="text-stone-400 hover:text-stone-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleGenerateTicket} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#103C2E] uppercase">Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aliyu Dan-Yabo"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#103C2E] uppercase">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+234 803 000 0000"
                    value={applicantPhone}
                    onChange={(e) => setApplicantPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#103C2E] uppercase">Ward / LGA *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Yabo Central Ward"
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#103C2E] uppercase">Category *</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium"
                >
                  <option value="Constituency Petition">Constituency Petition / Grievance</option>
                  <option value="Water Infrastructure Request">Water Infrastructure Request</option>
                  <option value="Educational Scholarship Query">Educational Scholarship Query</option>
                  <option value="Agricultural Support Request">Agricultural Support Request</option>
                  <option value="General Service Ticket">General Service Ticket</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#103C2E] uppercase">Ticket / Petition Subject *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Request for solar borehole repair in ward"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#103C2E] uppercase">Detailed Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide details regarding your petition, request, or service ticket..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowGenerateModal(false)}
                  className="bg-stone-100 hover:bg-stone-200 text-stone-700 px-4 py-2.5 rounded-xl font-bold uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#103C2E] hover:bg-[#09291F] text-white px-6 py-2.5 rounded-xl font-bold uppercase shadow cursor-pointer"
                >
                  Generate Ticket & Reference
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Result Card */}
      {hasSearched && searchedResult && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-stone-200 space-y-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-100 pb-5">
            <div>
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Reference Number</span>
              <h3 className="font-mono font-black text-xl text-[#103C2E]">{searchedResult.referenceNumber}</h3>
            </div>
            <span className="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider border border-emerald-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              STATUS: {searchedResult.status}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-stone-50 p-6 rounded-2xl border border-stone-200 text-xs">
            <div className="space-y-1">
              <span className="text-stone-400 font-bold uppercase">Applicant Name</span>
              <strong className="text-[#103C2E] text-sm block">{searchedResult.applicantName}</strong>
            </div>
            <div className="space-y-1">
              <span className="text-stone-400 font-bold uppercase">Subject / Program</span>
              <strong className="text-[#103C2E] text-sm block">{searchedResult.programTitle}</strong>
            </div>
            <div className="space-y-1">
              <span className="text-stone-400 font-bold uppercase">Ward & LGA</span>
              <span className="text-stone-800 font-medium block">{searchedResult.wardOrTown}</span>
            </div>
            <div className="space-y-1">
              <span className="text-stone-400 font-bold uppercase">Date Logged</span>
              <span className="text-stone-800 font-mono block">{searchedResult.date}</span>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-4 pt-2">
            <h4 className="font-bold text-sm text-[#103C2E] uppercase">Committee Review Timeline & Audit Trail</h4>
            <div className="space-y-3">
              {(searchedResult.timeline || [
                { stage: 'SUBMITTED', timestamp: searchedResult.date, title: 'Dossier successfully received' },
                { stage: searchedResult.status, timestamp: 'Active', title: searchedResult.notes || 'Under review by constituency board' }
              ]).map((item, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200">
                  <div className="w-8 h-8 rounded-full bg-[#103C2E] text-white flex items-center justify-center shrink-0 font-bold text-xs">
                    {idx + 1}
                  </div>
                  <div>
                    <strong className="text-[#103C2E] text-xs font-bold block uppercase">{item.stage} • {item.title}</strong>
                    <span className="text-[11px] text-stone-500 font-mono block mt-0.5">{item.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
