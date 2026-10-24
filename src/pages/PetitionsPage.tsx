import React, { useState, useEffect } from 'react';
import { CommunityPetition } from '../types';
import { PetitionTrackerWidget } from '../components/PetitionTrackerWidget';
import { OfficialDecisionLetterModal } from '../components/OfficialDecisionLetterModal';
import { Language, t, Translations } from '../utils/i18n';
import { 
  FileText, Search, Filter, CheckCircle2, Clock, ShieldCheck, AlertCircle, 
  ThumbsUp, Send, Landmark, Award, UserCheck, Check, Sparkles, MessageSquare,
  Building2, ChevronRight
} from 'lucide-react';
import { generatePetitionerDecisionMessage } from '../utils/petitionMessaging';

interface Props {
  petitions: CommunityPetition[];
  setPetitions?: React.Dispatch<React.SetStateAction<CommunityPetition[]>>;
  currentLang?: Language;
  translations?: Translations;
  setCurrentTab?: (tab: string) => void;
}

export const PetitionsPage: React.FC<Props> = ({
  petitions,
  setPetitions,
  currentLang = 'en',
  translations,
  setCurrentTab
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'track'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWard, setSelectedWard] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedPetitionForDecision, setSelectedPetitionForDecision] = useState<CommunityPetition | null>(null);

  // Sign petition state
  const [signingPetitionId, setSigningPetitionId] = useState<string | null>(null);
  const [signerName, setSignerName] = useState('');
  const [signerWard, setSignerWard] = useState('Yabo Central Ward');
  const [signerPhone, setSignerPhone] = useState('');
  const [signedSuccessMsg, setSignedSuccessMsg] = useState<{ id: string; msg: string } | null>(null);

  // User signed petitions tracker
  const [userSignedIds, setUserSignedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('danmaje_user_signed_petitions');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('danmaje_user_signed_petitions', JSON.stringify(userSignedIds));
  }, [userSignedIds]);

  const wards = [
    'All',
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

  const statuses = ['All', 'Proposed', 'Under Review', 'Approved', 'Rejected', 'Passed'];

  const filteredPetitions = (petitions || []).filter(p => {
    const title = p.title || '';
    const desc = p.description || '';
    const petName = p.petitionerName || '';
    const refNum = p.referenceNumber || '';
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          refNum.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesWard = selectedWard === 'All' || (p.wardOrTown || p.ward || '').toLowerCase().includes(selectedWard.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || p.status === selectedStatus;
    return matchesSearch && matchesWard && matchesStatus;
  });

  const handleSignPetition = async (petition: CommunityPetition) => {
    if (!signerName.trim()) {
      setSignedSuccessMsg({ id: petition.id, msg: 'Please enter your full name to sign this petition.' });
      return;
    }

    const updated = (petitions || []).map(p => {
      if (p.id === petition.id) {
        return {
          ...p,
          signaturesCount: (p.signaturesCount || 1) + 1,
          supporters: [
            ...(p.supporters || []),
            { name: signerName.trim(), ward: signerWard, timestamp: new Date().toISOString() }
          ]
        };
      }
      return p;
    });

    if (setPetitions) {
      setPetitions(updated);
    }
    try {
      localStorage.setItem('danmaje_petitions', JSON.stringify(updated));
      await fetch('/api/petitions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
    } catch (e) {
      console.warn('Sync petition failed:', e);
    }

    setUserSignedIds(prev => [...prev, petition.id]);
    setSignedSuccessMsg({
      id: petition.id,
      msg: `Thank you, ${signerName}! Your signature has been officially recorded on Petition #${petition.referenceNumber}.`
    });
    setSigningPetitionId(null);
    setSignerName('');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Approved':
      case 'Passed':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            <span>APPROVED / RESOLVED</span>
          </span>
        );
      case 'Under Review':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-700" />
            <span>UNDER LEGISLATIVE REVIEW</span>
          </span>
        );
      case 'Rejected':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-900 border border-rose-300 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-rose-700" />
            <span>REJECTED / CLOSED</span>
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-900 border border-blue-300 flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-blue-700" />
            <span>PROPOSED / LOGGED</span>
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-10">
      {/* Official Header Banner */}
      <div className="bg-gradient-to-br from-[#09291F] via-[#103C2E] to-[#0A261E] text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden border border-[#C6A15B]/40 space-y-4">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-[#C6A15B]/50 text-xs font-extrabold tracking-wider text-[#D4AF37] uppercase">
            <Landmark className="w-4 h-4 text-[#C6A15B]" />
            <span>PUBLIC CONSTITUENCY PETITIONS & GRIEVANCE PORTAL</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-['Manrope'] text-white">
            COMMUNITY PETITIONS & CIVIC SERVICE DESK
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base leading-relaxed font-light">
            An open democratic channel for constituents of Yabo/Shagari Federal Constituency to submit formal grievances, petition National Assembly interventions, and track official decision letters issued by Hon. Umar Yusuf (Danmaje Yabo).
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center gap-2 ${
                activeTab === 'all'
                  ? 'bg-[#C6A15B] text-[#09291F] shadow-lg font-black'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>EXPLORE PUBLIC PETITIONS ({petitions.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('track')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center gap-2 ${
                activeTab === 'track'
                  ? 'bg-[#C6A15B] text-[#09291F] shadow-lg font-black'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>SUBMIT / TRACK PETITION TICKET</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main View Switcher */}
      {activeTab === 'track' ? (
        <div className="space-y-6">
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#103C2E] font-bold text-xs sm:text-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
              <span>Submit or look up your official reference number to check legislative status</span>
            </div>
            <button
              onClick={() => setActiveTab('all')}
              className="text-xs font-bold text-[#103C2E] hover:underline uppercase"
            >
              Back to Public Petitions List &rarr;
            </button>
          </div>
          <PetitionTrackerWidget currentLang={currentLang} />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Search & Filter Bar */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute top-3.5 left-3.5" />
              <input
                type="text"
                placeholder="Search petition title, petitioner, reference #..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#103C2E]"
              />
            </div>

            <div>
              <select
                value={selectedWard}
                onChange={(e) => setSelectedWard(e.target.value)}
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#103C2E]"
              >
                {wards.map(w => (
                  <option key={w} value={w}>{w === 'All' ? 'All Wards / Locations' : w}</option>
                ))}
              </select>
            </div>

            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#103C2E]"
              >
                {statuses.map(s => (
                  <option key={s} value={s}>{s === 'All' ? 'All Legislative Statuses' : s}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Petitions Directory Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredPetitions.length === 0 ? (
              <div className="col-span-full py-16 text-center text-stone-500 bg-white rounded-3xl border border-stone-200 space-y-3">
                <FileText className="w-12 h-12 text-stone-300 mx-auto" />
                <h3 className="font-bold text-lg text-[#103C2E]">No Petitions Found</h3>
                <p className="text-xs text-stone-500 max-w-md mx-auto">
                  No public petitions matching your filter criteria were found. You can submit a new constituency petition using the tracking desk.
                </p>
                <button
                  onClick={() => setActiveTab('track')}
                  className="bg-[#103C2E] hover:bg-[#09291F] text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow"
                >
                  Submit New Petition
                </button>
              </div>
            ) : (
              filteredPetitions.map(petition => {
                const isSigned = userSignedIds.includes(petition.id);
                const hasDecisionLetter = petition.decisionLetter || petition.status === 'Approved' || petition.status === 'Rejected' || petition.status === 'Passed';

                return (
                  <div 
                    key={petition.id}
                    className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200 hover:shadow-xl transition-all duration-300 space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {/* Top Meta Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] font-black text-[#C6A15B] bg-[#C6A15B]/10 px-2.5 py-1 rounded-lg border border-[#C6A15B]/20">
                            {petition.referenceNumber}
                          </span>
                          <span className="text-[11px] font-bold text-stone-500">
                            {petition.category || 'Constituency Petition'}
                          </span>
                        </div>
                        {getStatusBadge(petition.status)}
                      </div>

                      {/* Title & Description */}
                      <h3 className="font-['Manrope'] font-black text-lg text-[#103C2E] leading-snug">
                        {petition.title}
                      </h3>
                      <p className="text-xs text-stone-600 leading-relaxed font-light line-clamp-3">
                        {petition.description}
                      </p>

                      {/* Petitioner Info Strip */}
                      <div className="bg-stone-50 p-3 rounded-2xl border border-stone-100 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-stone-400 block">Petitioner</span>
                          <span className="font-bold text-[#103C2E]">{petition.petitionerName}</span>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold text-stone-400 block">Ward / LGA</span>
                          <span className="font-semibold text-stone-700">{petition.wardOrTown}</span>
                        </div>
                      </div>

                      {/* Official Decision Message Box (If Available) */}
                      {petition.decisionMessage && (
                        <div className="bg-emerald-50/80 p-3.5 rounded-2xl border border-emerald-200 space-y-1">
                          <span className="text-[10px] font-black uppercase text-emerald-900 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-[#C6A15B]" /> Official Decision Note from Hon. Member:
                          </span>
                          <p className="text-xs text-emerald-950 font-medium italic">
                            "{typeof petition.decisionMessage === 'object' ? petition.decisionMessage.decisionSummary || petition.decisionMessage.executiveSummary : petition.decisionMessage}"
                          </p>
                        </div>
                      )}

                      {/* Feedback message upon signing */}
                      {signedSuccessMsg && signedSuccessMsg.id === petition.id && (
                        <div className="bg-emerald-100 border border-emerald-300 text-emerald-900 p-3 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
                          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                          <span>{signedSuccessMsg.msg}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Bar */}
                    <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-stone-700">
                        <ThumbsUp className="w-4 h-4 text-[#C6A15B]" />
                        <span>{petition.signaturesCount || 1} Verified Constituents Signed</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {hasDecisionLetter && (
                          <button
                            onClick={() => setSelectedPetitionForDecision(petition)}
                            className="bg-emerald-900 hover:bg-[#103C2E] text-[#D4AF37] px-3.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 shadow-sm transition uppercase cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Decision Letter</span>
                          </button>
                        )}

                        {!isSigned ? (
                          <button
                            onClick={() => setSigningPetitionId(signingPetitionId === petition.id ? null : petition.id)}
                            className="bg-[#103C2E] hover:bg-[#09291F] text-white px-4 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow transition uppercase cursor-pointer"
                          >
                            <ThumbsUp className="w-3.5 h-3.5 text-[#C6A15B]" />
                            <span>Sign Petition</span>
                          </button>
                        ) : (
                          <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-xl font-bold text-xs flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Signed
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Expanded Sign Petition Form */}
                    {signingPetitionId === petition.id && (
                      <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3 mt-3 animate-fadeIn">
                        <h4 className="font-bold text-[#103C2E] text-xs uppercase">Sign This Petition as a Verified Constituent</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Your Full Name *"
                            value={signerName}
                            onChange={(e) => setSignerName(e.target.value)}
                            className="px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs"
                          />
                          <select
                            value={signerWard}
                            onChange={(e) => setSignerWard(e.target.value)}
                            className="px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs"
                          >
                            {wards.filter(w => w !== 'All').map(w => (
                              <option key={w} value={w}>{w}</option>
                            ))}
                          </select>
                        </div>
                        <div className="flex justify-end gap-2 pt-1">
                          <button
                            onClick={() => setSigningPetitionId(null)}
                            className="px-3 py-1.5 text-xs font-bold text-stone-500 hover:text-stone-700 uppercase"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSignPetition(petition)}
                            className="bg-[#103C2E] hover:bg-[#09291F] text-white px-5 py-1.5 rounded-xl text-xs font-bold uppercase shadow cursor-pointer"
                          >
                            Confirm Signature
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Official Decision Letter Modal */}
      {selectedPetitionForDecision && (
        <OfficialDecisionLetterModal
          message={typeof selectedPetitionForDecision.decisionMessage === 'object' && selectedPetitionForDecision.decisionMessage ? selectedPetitionForDecision.decisionMessage : generatePetitionerDecisionMessage(
            {
              id: selectedPetitionForDecision.id,
              applicantName: selectedPetitionForDecision.petitionerName,
              programTitle: selectedPetitionForDecision.title,
              referenceNumber: selectedPetitionForDecision.referenceNumber,
              wardOrTown: selectedPetitionForDecision.ward || selectedPetitionForDecision.wardOrTown || 'Yabo/Shagari Federal Constituency',
              phone: selectedPetitionForDecision.phone || selectedPetitionForDecision.petitionerPhone,
              email: selectedPetitionForDecision.email || selectedPetitionForDecision.petitionerEmail
            },
            selectedPetitionForDecision.status === 'Approved' || selectedPetitionForDecision.status === 'Passed' ? 'APPROVED' : 'REJECTED'
          )}
          onClose={() => setSelectedPetitionForDecision(null)}
        />
      )}
    </div>
  );
};
