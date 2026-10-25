import React, { useState } from 'react';
import { CommunityPetition, PetitionStatus } from '../types';
import { generatePetitionerDecisionMessage } from '../utils/petitionMessaging';
import { safeSetItem } from '../utils/safeStorage';
import { 
  FileText, CheckCircle2, XCircle, Clock, Search, Filter, 
  Send, Eye, Printer, Trash2, AlertCircle, Check, Shield, 
  Users, MapPin, Download, Sparkles, MessageSquare, ChevronRight, X
} from 'lucide-react';

interface Props {
  petitions: CommunityPetition[];
  setPetitions: React.Dispatch<React.SetStateAction<CommunityPetition[]>>;
  adminRole: string;
  adminEmail: string;
  onLogActivity: (action: string) => void;
}

export const AdminPetitionsTab: React.FC<Props> = ({
  petitions,
  setPetitions,
  adminRole,
  adminEmail,
  onLogActivity
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | PetitionStatus>('ALL');

  // Review & Decision Modal State
  const [reviewPetition, setReviewPetition] = useState<CommunityPetition | null>(null);
  const [selectedDecision, setSelectedDecision] = useState<'Approved' | 'Rejected'>('Approved');
  const [decisionRationale, setDecisionRationale] = useState('');
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchSuccessMsg, setDispatchSuccessMsg] = useState(false);

  // View Letter Modal State
  const [letterViewPetition, setLetterViewPetition] = useState<CommunityPetition | null>(null);

  // Filter petitions
  const filteredPetitions = petitions.filter(p => {
    const wardStr = p.ward || p.targetWard || '';
    const descStr = p.description || p.problemStatement || '';
    const matchesSearch = !searchQuery || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.petitionerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wardStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      descStr.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate Metrics
  const totalPetitions = petitions.length;
  const underReviewCount = petitions.filter(p => p.status === 'Under Review' || p.status === 'Submitted').length;
  const approvedCount = petitions.filter(p => p.status === 'Approved').length;
  const rejectedCount = petitions.filter(p => p.status === 'Rejected').length;

  // Handle open review modal
  const handleOpenReview = (p: CommunityPetition) => {
    setReviewPetition(p);
    setSelectedDecision(p.status === 'Rejected' ? 'Rejected' : 'Approved');
    const existingNotes = (typeof p.decision === 'object' && p.decision ? p.decision.decisionNotes : '') || (typeof p.decisionMessage === 'object' && p.decisionMessage ? p.decisionMessage.detailedRationale || p.decisionMessage.detailedReason : '');
    setDecisionRationale(existingNotes || '');
    setDispatchSuccessMsg(false);
  };

  // Generate Respectful Decision Letter
  const generateRespectfulDecisionLetter = (
    petition: CommunityPetition, 
    decision: 'Approved' | 'Rejected', 
    rationaleNotes: string
  ) => {
    const now = new Date();
    const dateFormatted = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    const wardName = petition.ward || petition.targetWard || 'Constituency Ward';
    const emailVal = petition.petitionerEmail || petition.email || 'On Record';
    const phoneVal = petition.petitionerPhone || petition.phone || 'On Record';
    const sigCount = petition.signatoriesCount ?? petition.signaturesCount ?? 1;

    if (decision === 'Approved') {
      return `OFFICE OF HON. UMAR YUSUF (DANMAJE YABO)
House of Representatives • National Assembly Complex, Three Arms Zone, Abuja
Yabo/Shagari Federal Constituency, Sokoto State

Ref: ${petition.referenceNumber}/DECISION/APP
Date: ${dateFormatted}

TO:
${petition.petitionerName}
${wardName}, Yabo/Shagari Federal Constituency
Email: ${emailVal} | Phone: ${phoneVal}

SUBJECT: OFFICIAL COMMENDATION & FORMAL PETITION APPROVAL
RE: "${petition.title.toUpperCase()}"

Dear ${petition.petitionerName},

On behalf of the Office of Hon. Umar Yusuf (Danmaje Yabo) and the Yabo/Shagari Federal Constituency Parliamentary Office, I am pleased to convey that your community petition (Ref: ${petition.referenceNumber}) has been thoroughly reviewed and officially APPROVED for legislative sponsorship and executive intervention.

${rationaleNotes.trim() ? `COMMITTEE APPRAISAL & ACTION PLAN:\n${rationaleNotes.trim()}\n` : `COMMITTEE APPRAISAL & ACTION PLAN:
Your petition clearly illustrates an urgent public infrastructure and social welfare need for the people of ${wardName}. The data, community backing (${sigCount}+ endorsed constituents), and actionable recommendations you submitted satisfy all criteria for constituency intervention.\n`}

NEXT STEPS & IMPLEMENTATION:
1. Sponsorship: The petition is formally referred to the Federal House Committee on Legislative Compliance and Relevant Ministries, Departments, and Agencies (MDAs).
2. Field Verification: A technical delegation from our constituency liaison office will visit ${wardName} to conduct on-site project scoping.
3. Budgetary Capture: Funding allocations are being integrated into the immediate upcoming constituency development budget.

ENCOURAGING CONSTRUCTIVE CIVIC PARTICIPATION:
Your proactive initiative demonstrates the highest ideals of citizen participation and peaceful democratic advocacy. Active citizen voices like yours are the lifeblood of sustainable progress in Yabo and Shagari.

We warmly encourage you and all members of your community to remain actively involved in community development. You are invited to participate regularly in our quarterly Town Hall sessions, engage with our ward development committees, and continue providing valuable grassroots insights.

Thank you for your dedicated service to the community.

Yours respectfully in national service,

Hon. Umar Yusuf (Danmaje Yabo)
Member, House of Representatives
Federal Republic of Nigeria`;
    } else {
      return `OFFICE OF HON. UMAR YUSUF (DANMAJE YABO)
House of Representatives • National Assembly Complex, Three Arms Zone, Abuja
Yabo/Shagari Federal Constituency, Sokoto State

Ref: ${petition.referenceNumber}/DECISION/COMM
Date: ${dateFormatted}

TO:
${petition.petitionerName}
${wardName}, Yabo/Shagari Federal Constituency
Email: ${emailVal} | Phone: ${phoneVal}

SUBJECT: OFFICIAL REVIEW OUTCOME & RESPECTFUL EXPLANATION
RE: "${petition.title.toUpperCase()}"

Dear ${petition.petitionerName},

On behalf of Hon. Umar Yusuf (Danmaje Yabo) and the parliamentary representation team for Yabo/Shagari Federal Constituency, we express our profound gratitude and high regard for your initiative in submitting petition Ref: ${petition.referenceNumber}.

Your concern for the welfare and advancement of ${wardName} is exemplary, and we treat every citizen submission with the utmost diligence and respect.

EXPLANATION OF DECISION:
Following comprehensive review by our parliamentary legal and infrastructure advisory committee, we regret to inform you that this petition cannot be adopted as a direct federal legislative bill or capital project at this time.

${rationaleNotes.trim() ? `SPECIFIC ADMINISTRATIVE RATIONALE:\n${rationaleNotes.trim()}\n` : `SPECIFIC ADMINISTRATIVE RATIONALE:
The subject matter falls predominantly under the administrative jurisdiction of the State/Local Government Council, or currently exceeds statutory federal appropriation guidelines for the ongoing fiscal envelope.\n`}

APPRECIATION & ENCOURAGEMENT FOR CONTINUED CIVIC PARTICIPATION:
Please be assured that this outcome does not diminish the nobility or sincerity of your advocacy. Civic engagement is essential for good governance, and your dedication to ${wardName} is deeply valued and admired.

We warmly and strongly encourage you to continue participating constructively in our community's development:
1. Alternative Avenues: Our constituency office has forwarded your recommendations to the local government authorities for localized administrative attention.
2. Town Hall Engagement: We cordially invite you to attend our next Constituency Town Hall to discuss community priorities directly with our policy advisors.
3. Collaborative Advocacy: We encourage you and your fellow residents to continue identifying shared solutions and partnering with our ward development liaisons.

Thank you for your commitment to the progress and prosperity of Yabo and Shagari Federal Constituency.

Yours respectfully in community service,

Hon. Umar Yusuf (Danmaje Yabo)
Member, House of Representatives
Federal Republic of Nigeria`;
    }
  };

  // Dispatch Decision Handler
  const handleDispatchDecision = async () => {
    if (!reviewPetition) return;
    setIsDispatching(true);

    const generatedLetter = generateRespectfulDecisionLetter(
      reviewPetition, 
      selectedDecision, 
      decisionRationale
    );

    const now = new Date();
    const decisionRecord = {
      status: selectedDecision as 'Approved' | 'Rejected',
      decisionDate: now.toISOString().split('T')[0],
      decisionBy: `${adminRole} (${adminEmail})`,
      decisionNotes: decisionRationale.trim() || (selectedDecision === 'Approved' ? 'Petition approved for parliamentary action.' : 'Respectfully declined under jurisdictional criteria.'),
      officialLetter: generatedLetter,
      deliveredVia: ['Constituency Portal Notification', 'SMS & Email Gateway']
    };

    const wisdomDecisionMsg = generatePetitionerDecisionMessage(
      {
        id: reviewPetition.id,
        referenceNumber: reviewPetition.referenceNumber,
        applicantName: reviewPetition.petitionerName,
        phone: reviewPetition.petitionerPhone || (reviewPetition as any).phone,
        email: reviewPetition.petitionerEmail || (reviewPetition as any).email,
        wardOrTown: reviewPetition.ward || reviewPetition.targetWard || reviewPetition.wardOrTown || 'Yabo/Shagari Constituency',
        programTitle: reviewPetition.title,
        programCategory: reviewPetition.category,
        awardGrantPackage: selectedDecision === 'Approved' ? (decisionRationale.trim() || 'Direct constituency intervention & project appropriation') : undefined
      },
      selectedDecision === 'Approved' ? 'APPROVED' : 'REJECTED',
      decisionRationale.trim()
    );

    // Update state permanently
    const updated = petitions.map(p => {
      if (p.id === reviewPetition.id) {
        return {
          ...p,
          status: selectedDecision,
          decision: decisionRecord,
          decisionLetter: generatedLetter,
          decisionMessage: wisdomDecisionMsg,
          publicFeedback: decisionRationale.trim() || wisdomDecisionMsg.detailedReason,
          awardGrantPackage: selectedDecision === 'Approved' ? (decisionRationale.trim() || 'Direct constituency intervention & project appropriation') : undefined,
          reviewNotes: decisionRationale.trim() || (selectedDecision === 'Approved' ? 'Petition approved and verified for constituency appropriation.' : 'Respectful advisory recorded.')
        };
      }
      return p;
    });

    setPetitions(updated);
    safeSetItem('danmaje_petitions', JSON.stringify(updated));

    // Two-way sync with applications cache
    try {
      const savedApps = localStorage.getItem('danmaje_applications');
      if (savedApps) {
        const apps = JSON.parse(savedApps);
        const mappedApps = apps.map((a: any) => {
          if (a.referenceNumber?.toLowerCase() === reviewPetition.referenceNumber.toLowerCase() || a.id === reviewPetition.id) {
            return {
              ...a,
              status: selectedDecision === 'Approved' ? 'APPROVED' : 'REJECTED',
              decision: decisionRecord,
              decisionLetter: generatedLetter,
              decisionMessage: wisdomDecisionMsg,
              publicFeedback: decisionRationale.trim() || wisdomDecisionMsg.detailedReason,
              awardGrantPackage: selectedDecision === 'Approved' ? (decisionRationale.trim() || 'Direct constituency intervention & project appropriation') : undefined
            };
          }
          return a;
        });
        safeSetItem('danmaje_applications', JSON.stringify(mappedApps));
      }
    } catch {}

    // Call backend API & Remote Database
    try {
      await fetch(`/api/petitions/${reviewPetition.id}/decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: selectedDecision,
          decisionNotes: decisionRationale,
          officialLetter: generatedLetter,
          decisionBy: adminRole
        })
      });
    } catch {}

    onLogActivity(`Dispatched official ${selectedDecision} decision message to petitioner ${reviewPetition.petitionerName} (Ref: ${reviewPetition.referenceNumber})`);
    
    setIsDispatching(false);
    setDispatchSuccessMsg(true);

    setTimeout(() => {
      setReviewPetition(null);
      setDispatchSuccessMsg(false);
    }, 1800);
  };

  // Delete petition
  const handleDeletePetition = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this petition record?')) return;
    const updated = petitions.filter(p => p.id !== id);
    setPetitions(updated);
    try {
      localStorage.setItem('danmaje_petitions', JSON.stringify(updated));
    } catch {}

    try {
      await fetch(`/api/petitions/${id}`, { method: 'DELETE' });
    } catch {}

    onLogActivity(`Deleted community petition #${id}`);
  };

  return (
    <div className="w-full min-w-0 space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-['Manrope'] font-extrabold text-2xl text-[#103C2E] uppercase">
              COMMUNITY PETITIONS & CIVIC GRIEVANCES ({petitions.length})
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black border border-emerald-300 uppercase">
              DECISION DISPATCH ACTIVE
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Review citizen petitions, formulate official parliamentary decisions, and automatically dispatch respectful, constructive letters.
          </p>
        </div>
      </div>

      {/* Metrics Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Total Received</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-[#103C2E]">{totalPetitions}</span>
            <FileText className="w-4 h-4 text-[#C6A15B]" />
          </div>
          <p className="text-[11px] text-stone-500">Citizen submissions on file</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Under Active Review</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-amber-700">{underReviewCount}</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-[11px] text-stone-500">Awaiting committee decision</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Approved & Sponsored</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-700">{approvedCount}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-[11px] text-stone-500">Official letters dispatched</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Respectfully Declined</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-stone-700">{rejectedCount}</span>
            <XCircle className="w-4 h-4 text-stone-400" />
          </div>
          <p className="text-[11px] text-stone-500">Civic encouragement sent</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by ref number, title, petitioner, or ward..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-[#103C2E] focus:outline-none focus:border-[#103C2E]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-stone-500 font-bold uppercase">Status Filter:</span>
          <div className="flex flex-wrap bg-stone-100 p-1 rounded-xl">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                statusFilter === 'ALL' ? 'bg-[#103C2E] text-white' : 'text-stone-600'
              }`}
            >
              All ({petitions.length})
            </button>
            <button
              onClick={() => setStatusFilter('Under Review')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                statusFilter === 'Under Review' ? 'bg-amber-700 text-white' : 'text-stone-600'
              }`}
            >
              Pending ({underReviewCount})
            </button>
            <button
              onClick={() => setStatusFilter('Approved')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                statusFilter === 'Approved' ? 'bg-emerald-700 text-white' : 'text-stone-600'
              }`}
            >
              Approved ({approvedCount})
            </button>
            <button
              onClick={() => setStatusFilter('Rejected')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                statusFilter === 'Rejected' ? 'bg-stone-700 text-white' : 'text-stone-600'
              }`}
            >
              Declined ({rejectedCount})
            </button>
          </div>
        </div>
      </div>

      {/* Petitions Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-[#103C2E] text-white">
                <th className="p-4 uppercase text-[11px] font-bold">Ref & Date</th>
                <th className="p-4 uppercase text-[11px] font-bold">Petition Title & Category</th>
                <th className="p-4 uppercase text-[11px] font-bold">Petitioner & Ward</th>
                <th className="p-4 uppercase text-[11px] font-bold">Signatures</th>
                <th className="p-4 uppercase text-[11px] font-bold">Status</th>
                <th className="p-4 uppercase text-[11px] font-bold">Decision Message</th>
                <th className="p-4 text-right uppercase text-[11px] font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {filteredPetitions.map(petition => {
                const isApproved = petition.status === 'Approved';
                const isRejected = petition.status === 'Rejected';
                const hasDecision = isApproved || isRejected || !!petition.decision || !!petition.decisionMessage;
                const wardName = petition.ward || petition.targetWard || 'Constituency';
                const phoneVal = petition.petitionerPhone || petition.phone || '';
                const descVal = petition.description || petition.problemStatement || '';
                const sigCount = petition.signatoriesCount ?? petition.signaturesCount ?? 1;

                return (
                  <tr key={petition.id} className="hover:bg-stone-50 transition">
                    <td className="p-4 whitespace-nowrap">
                      <strong className="font-mono text-xs text-[#103C2E] block">
                        {petition.referenceNumber}
                      </strong>
                      <span className="text-[10px] text-stone-400 font-mono">
                        {petition.submittedDate}
                      </span>
                    </td>

                    <td className="p-4 max-w-sm">
                      <div className="font-bold text-[#103C2E] line-clamp-1">
                        {petition.title}
                      </div>
                      <div className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                        {descVal}
                      </div>
                      <span className="inline-block text-[9px] font-bold uppercase mt-1 px-2 py-0.5 rounded bg-stone-100 text-stone-600">
                        {petition.category}
                      </span>
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <strong className="text-[#103C2E] block">{petition.petitionerName}</strong>
                      <span className="text-[11px] text-stone-500">{wardName}</span>
                      {phoneVal && <span className="text-[10px] text-stone-400 block font-mono">{phoneVal}</span>}
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 font-mono font-bold text-xs bg-stone-100 px-2.5 py-1 rounded-lg text-stone-800">
                        <Users className="w-3 h-3 text-stone-500" />
                        {sigCount}
                      </span>
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1 ${
                        isApproved ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                        isRejected ? 'bg-stone-200 text-stone-700 border border-stone-300' :
                        'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}>
                        {isApproved && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        {isRejected && <XCircle className="w-3 h-3 text-stone-500" />}
                        {!isApproved && !isRejected && <Clock className="w-3 h-3 text-amber-600" />}
                        {petition.status}
                      </span>
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      {hasDecision ? (
                        <button
                          type="button"
                          onClick={() => setLetterViewPetition(petition)}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 transition cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5 text-[#C6A15B]" />
                          <span>View Official Letter</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-amber-700 italic">Decision pending</span>
                      )}
                    </td>

                    <td className="p-4 text-right whitespace-nowrap space-x-1.5">
                      <button
                        onClick={() => handleOpenReview(petition)}
                        className="inline-flex items-center gap-1 bg-[#103C2E] hover:bg-[#09291F] text-white px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition shadow-xs cursor-pointer"
                        title="Review and dispatch official decision"
                      >
                        <Send className="w-3.5 h-3.5 text-[#C6A15B]" />
                        <span>{hasDecision ? 'Re-Appraise' : 'Settle Decision'}</span>
                      </button>

                      <button
                        onClick={() => handleDeletePetition(petition.id)}
                        className="inline-flex items-center gap-1 bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white px-2.5 py-1.5 rounded-xl border border-rose-200 transition text-xs font-bold uppercase cursor-pointer"
                        title="Delete Petition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredPetitions.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-stone-400 text-xs">
                    No community petitions found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* REVIEW & DECISION DISPATCH MODAL */}
      {reviewPetition && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8 border border-stone-200 max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-start border-b border-stone-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#C6A15B] bg-[#C6A15B]/15 px-2.5 py-0.5 rounded-full border border-[#C6A15B]/30 inline-block mb-1">
                  PARLIAMENTARY GRIEVANCE & PETITIONS COMMITTEE
                </span>
                <h3 className="font-['Manrope'] font-black text-xl text-[#103C2E] uppercase">
                  APPRAISE & DISPATCH PETITION DECISION
                </h3>
                <p className="text-xs text-stone-500 font-mono mt-0.5">
                  Ref: {reviewPetition.referenceNumber} • Submitted by {reviewPetition.petitionerName} ({reviewPetition.ward || reviewPetition.targetWard || 'Constituency'})
                </p>
              </div>

              <button
                onClick={() => setReviewPetition(null)}
                className="bg-stone-100 hover:bg-rose-600 text-stone-600 hover:text-white p-2 rounded-xl transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {dispatchSuccessMsg && (
              <div className="bg-emerald-50 border-2 border-emerald-500 text-emerald-900 p-4 rounded-2xl flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <strong className="text-sm font-bold block">Decision Dispatched Successfully!</strong>
                  <span className="text-xs">
                    The professional, respectful letter explaining the decision and encouraging active civic participation has been logged and sent to {reviewPetition.petitionerName}.
                  </span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
              {/* Left Column: Petition Details */}
              <div className="space-y-4 bg-stone-50 p-5 rounded-2xl border border-stone-200">
                <h4 className="font-black text-xs uppercase tracking-wider text-[#103C2E] flex items-center gap-1.5 border-b border-stone-200 pb-2">
                  <FileText className="w-4 h-4 text-emerald-700" />
                  <span>Constituent Petition Dossier</span>
                </h4>

                <div>
                  <span className="text-[10px] font-bold uppercase text-stone-400 block">Petition Title</span>
                  <strong className="text-sm text-[#103C2E] block">{reviewPetition.title}</strong>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-stone-400 block">Petitioner</span>
                    <strong className="text-stone-800">{reviewPetition.petitionerName}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-stone-400 block">Target Ward</span>
                    <strong className="text-stone-800">{reviewPetition.ward || reviewPetition.targetWard || 'Constituency'}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-stone-400 block">Phone</span>
                    <strong className="text-stone-800 font-mono">{reviewPetition.petitionerPhone || reviewPetition.phone || 'On Record'}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-stone-400 block">Signatures Count</span>
                    <strong className="text-stone-800 font-mono">{reviewPetition.signatoriesCount ?? reviewPetition.signaturesCount ?? 1} Verified</strong>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase text-stone-400 block">Problem Statement / Community Grievance</span>
                  <div className="bg-white p-3 rounded-xl border border-stone-200 text-stone-700 leading-relaxed mt-1">
                    {reviewPetition.description || reviewPetition.problemStatement || 'Grassroots petition submitted for parliamentary intervention.'}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase text-stone-400 block">Requested Parliamentary Solution</span>
                  <div className="bg-white p-3 rounded-xl border border-stone-200 text-stone-700 leading-relaxed mt-1">
                    {reviewPetition.expectedImpact || reviewPetition.proposedSolution || 'Direct constituency intervention and infrastructural support.'}
                  </div>
                </div>
              </div>

              {/* Right Column: Decision Setting & Live Letter Preview */}
              <div className="space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <h4 className="font-black text-xs uppercase tracking-wider text-[#103C2E] flex items-center gap-1.5 border-b border-stone-200 pb-2">
                    <Send className="w-4 h-4 text-emerald-700" />
                    <span>Official Decision & Rationale</span>
                  </h4>

                  {/* Decision Radio Choice */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedDecision('Approved')}
                      className={`p-3 rounded-2xl border-2 font-bold text-xs uppercase flex items-center justify-center gap-2 transition cursor-pointer ${
                        selectedDecision === 'Approved'
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-sm'
                          : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Approve Petition</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedDecision('Rejected')}
                      className={`p-3 rounded-2xl border-2 font-bold text-xs uppercase flex items-center justify-center gap-2 transition cursor-pointer ${
                        selectedDecision === 'Rejected'
                          ? 'border-stone-700 bg-stone-100 text-stone-900 shadow-sm'
                          : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      <XCircle className="w-4 h-4 text-stone-600" />
                      <span>Respectfully Decline</span>
                    </button>
                  </div>

                  {/* Custom Administrative Rationale */}
                  <div className="space-y-1">
                    <label className="font-bold text-[#103C2E] uppercase block">
                      Specific Legislative & Administrative Rationale *
                    </label>
                    <textarea
                      rows={3}
                      placeholder={selectedDecision === 'Approved'
                        ? 'e.g. Approved. Scheduled for plenary motion on constituency water infrastructure and immediate site inspection...'
                        : 'e.g. Primary health dispensary operations fall under Local Council statutory jurisdiction. Forwarded to Yabo LGA executive...'
                      }
                      value={decisionRationale}
                      onChange={(e) => setDecisionRationale(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 leading-relaxed"
                    ></textarea>
                    <p className="text-[10px] text-stone-500">
                      This rationale will be incorporated into the respectful official letter and visible on the citizen petition tracking portal.
                    </p>
                  </div>

                  {/* Live Respectful Message Notice */}
                  <div className="bg-amber-50/80 p-3.5 rounded-xl border border-amber-200 text-amber-900 space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      Civic Respect & Encouragement Guarantee
                    </span>
                    <p className="text-[11px] leading-relaxed">
                      Whether approved or declined, the petitioner automatically receives a formal, dignified letter warmly acknowledging their civic responsibility and encouraging continued active participation in constituency community development.
                    </p>
                  </div>
                </div>

                {/* Dispatch Button */}
                <div className="pt-4 border-t border-stone-200 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setReviewPetition(null)}
                    className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 rounded-xl font-bold uppercase cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isDispatching}
                    onClick={handleDispatchDecision}
                    className={`px-6 py-2.5 text-white rounded-xl font-bold uppercase cursor-pointer shadow flex items-center gap-2 transition ${
                      selectedDecision === 'Approved'
                        ? 'bg-emerald-700 hover:bg-emerald-800'
                        : 'bg-[#103C2E] hover:bg-[#09291F]'
                    }`}
                  >
                    <Send className="w-4 h-4 text-[#C6A15B]" />
                    <span>{isDispatching ? 'Dispatching...' : `Dispatch ${selectedDecision} Letter`}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW OFFICIAL LETTER MODAL */}
      {letterViewPetition && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8 border border-stone-200 max-h-[92vh] overflow-y-auto">
            {/* Action Bar */}
            <div className="flex justify-between items-center border-b border-stone-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#C6A15B] bg-[#C6A15B]/15 px-2.5 py-0.5 rounded-full border border-[#C6A15B]/30 inline-block">
                  PARLIAMENTARY OFFICIAL CORRESPONDENCE
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  letterViewPetition.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-700'
                }`}>
                  {letterViewPetition.status}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="bg-stone-100 hover:bg-stone-200 text-[#103C2E] px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Slip</span>
                </button>
                <button
                  onClick={() => setLetterViewPetition(null)}
                  className="bg-stone-100 hover:bg-rose-600 text-stone-600 hover:text-white p-2 rounded-xl transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Letter Content Preview */}
            <div className="bg-[#FAF9F5] p-6 sm:p-8 rounded-2xl border border-stone-300 font-mono text-xs text-stone-800 leading-relaxed whitespace-pre-wrap">
              {(typeof letterViewPetition.decision === 'object' && letterViewPetition.decision ? letterViewPetition.decision.officialLetter : null) || (typeof letterViewPetition.decisionMessage === 'object' && letterViewPetition.decisionMessage ? letterViewPetition.decisionMessage.detailedRationale || letterViewPetition.decisionMessage.detailedReason : generateRespectfulDecisionLetter(
                letterViewPetition,
                letterViewPetition.status === 'Approved' ? 'Approved' : 'Rejected',
                (typeof letterViewPetition.decision === 'object' && letterViewPetition.decision ? letterViewPetition.decision.decisionNotes : '') || ''
              ))}
            </div>

            <div className="flex justify-between items-center text-xs text-stone-400 pt-2 border-t border-stone-100">
              <span>Delivered via: Constituency Portal & Notification Gateway</span>
              <button
                type="button"
                onClick={() => setLetterViewPetition(null)}
                className="px-5 py-2 bg-[#103C2E] hover:bg-[#09291F] text-white rounded-xl font-bold uppercase cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
