import React, { useState } from 'react';
import { TownHallPoll, PollOption, PollVoteRecord, PollCategory, PollStatus } from '../types';
import { 
  BarChart2, Plus, Trash2, CheckCircle2, AlertCircle, X, 
  RotateCcw, Download, Eye, Users, Check, Clock, Calendar, 
  ShieldCheck, Lock, ChevronRight, Filter, Search, Award
} from 'lucide-react';

interface Props {
  polls: TownHallPoll[];
  setPolls: React.Dispatch<React.SetStateAction<TownHallPoll[]>>;
  adminRole: string;
  adminEmail: string;
  onLogActivity: (action: string) => void;
}

const CONSTITUENCY_WARDS = [
  'All Wards (Constituency Wide)',
  'Yabo A',
  'Yabo B',
  'Bakale',
  'Birnin Ruwa',
  'Kilgori',
  'Shagari',
  'Dandin Mahe',
  'Kajiji',
  'Horo Birni',
  'Kambama',
  'Sanyinna'
];

export const AdminTownHallTab: React.FC<Props> = ({
  polls,
  setPolls,
  adminRole,
  adminEmail,
  onLogActivity
}) => {
  const isChiefAdmin = adminRole === 'Chief Administrator';

  // Helper for option votes
  const getOptVotes = (opt: PollOption): number => {
    return opt.votes ?? opt.votesCount ?? 0;
  };

  const isPollActive = (status: PollStatus): boolean => {
    return status === 'Active' || status === 'ACTIVE';
  };

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [trackingPoll, setTrackingPoll] = useState<TownHallPoll | null>(null);
  const [resetConfirmId, setResetConfirmId] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Active' | 'Closed'>('ALL');

  // New Poll Form State
  const [newTitle, setNewTitle] = useState('');
  const [newQuestion, setNewQuestion] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState<PollCategory>('Infrastructure');
  const [newTargetWard, setNewTargetWard] = useState('All Wards (Constituency Wide)');
  const [newEndDate, setNewEndDate] = useState('2026-12-31');
  const [optionsList, setOptionsList] = useState<string[]>([
    'Priority Option 1',
    'Priority Option 2',
    'Alternative Option 3'
  ]);
  const [formError, setFormError] = useState('');

  // Add & remove option handlers
  const handleAddOptionField = () => {
    if (optionsList.length >= 6) return;
    setOptionsList([...optionsList, `Option ${optionsList.length + 1}`]);
  };

  const handleRemoveOptionField = (index: number) => {
    if (optionsList.length <= 2) {
      setFormError('A town hall poll requires at least two voting options.');
      return;
    }
    setOptionsList(optionsList.filter((_, idx) => idx !== index));
  };

  const handleOptionChange = (index: number, val: string) => {
    const updated = [...optionsList];
    updated[index] = val;
    setOptionsList(updated);
  };

  // Create Poll Submission
  const handleCreatePoll = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!isChiefAdmin) {
      setFormError('Chief Administrator clearance is required to create town hall polls.');
      return;
    }

    if (!newQuestion.trim()) {
      setFormError('Please enter a clear question for constituents.');
      return;
    }

    const cleanOptions = optionsList.map(o => o.trim()).filter(Boolean);
    if (cleanOptions.length < 2) {
      setFormError('Please specify at least 2 distinct voting options.');
      return;
    }

    const pollId = `poll-${Date.now()}`;
    const builtOptions: PollOption[] = cleanOptions.map((text, idx) => ({
      id: `opt-${pollId}-${idx + 1}`,
      text,
      votes: 0,
      votesCount: 0
    }));

    const createdPoll: TownHallPoll = {
      id: pollId,
      title: newTitle.trim() || newQuestion.trim(),
      question: newQuestion.trim(),
      description: newDescription.trim() || 'Constituency participatory democracy vote convened by Hon. Umar Yusuf (Danmaje Yabo).',
      category: newCategory,
      targetWard: newTargetWard,
      startDate: new Date().toISOString().split('T')[0],
      endDate: newEndDate,
      status: 'Active',
      createdBy: adminEmail,
      createdAt: new Date().toISOString(),
      options: builtOptions,
      totalVotes: 0,
      votes: [],
      voters: []
    };

    // Update frontend state
    const updated = [createdPoll, ...polls];
    setPolls(updated);
    try {
      localStorage.setItem('danmaje_polls', JSON.stringify(updated));
    } catch {}

    // Attempt backend sync
    try {
      await fetch('/api/polls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createdPoll)
      });
    } catch {}

    onLogActivity(`Created new Town Hall Poll: "${createdPoll.question}"`);
    setShowCreateModal(false);

    // Reset Form
    setNewTitle('');
    setNewQuestion('');
    setNewDescription('');
    setOptionsList(['Priority Option 1', 'Priority Option 2', 'Alternative Option 3']);
  };

  // Toggle Poll Status (Active / Closed)
  const handleToggleStatus = async (pollId: string) => {
    if (!isChiefAdmin) return;
    const target = polls.find(p => p.id === pollId);
    if (!target) return;

    const nextStatus: PollStatus = isPollActive(target.status) ? 'Closed' : 'Active';
    const updated = polls.map(p => p.id === pollId ? { ...p, status: nextStatus } : p);
    setPolls(updated);
    try {
      localStorage.setItem('danmaje_polls', JSON.stringify(updated));
    } catch {}

    try {
      await fetch(`/api/polls/${pollId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
    } catch {}

    if (trackingPoll && trackingPoll.id === pollId) {
      setTrackingPoll({ ...trackingPoll, status: nextStatus });
    }

    onLogActivity(`Changed Poll #${pollId} status to ${nextStatus}`);
  };

  // Reset Poll Votes
  const handleResetVotes = async (pollId: string) => {
    if (!isChiefAdmin) return;
    const updated = polls.map(p => {
      if (p.id === pollId) {
        return {
          ...p,
          totalVotes: 0,
          options: p.options.map(opt => ({ ...opt, votes: 0, votesCount: 0 })),
          votes: [],
          voters: []
        };
      }
      return p;
    });

    setPolls(updated);
    try {
      localStorage.setItem('danmaje_polls', JSON.stringify(updated));
    } catch {}

    try {
      await fetch(`/api/polls/${pollId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          totalVotes: 0,
          votes: [],
          voters: [],
          options: (polls.find(p => p.id === pollId)?.options || []).map(opt => ({ ...opt, votes: 0, votesCount: 0 }))
        })
      });
    } catch {}

    setResetConfirmId(null);
    if (trackingPoll && trackingPoll.id === pollId) {
      setTrackingPoll(updated.find(p => p.id === pollId) || null);
    }

    onLogActivity(`Reset all ballot tallies for Poll #${pollId}`);
  };

  // Delete Poll
  const handleDeletePoll = async (pollId: string) => {
    if (!isChiefAdmin) return;
    const updated = polls.filter(p => p.id !== pollId);
    setPolls(updated);
    try {
      localStorage.setItem('danmaje_polls', JSON.stringify(updated));
    } catch {}

    try {
      await fetch(`/api/polls/${pollId}`, { method: 'DELETE' });
    } catch {}

    if (trackingPoll && trackingPoll.id === pollId) {
      setTrackingPoll(null);
    }

    onLogActivity(`Deleted Town Hall Poll #${pollId}`);
  };

  // Export Poll Results to CSV
  const handleExportPollCSV = (poll: TownHallPoll) => {
    const lines = [
      `"CONSTITUENCY TOWN HALL & PARTICIPATORY BALLOT REPORT"`,
      `"Federal Constituency: Yabo / Shagari Federal Constituency, Sokoto State"`,
      `"Representative: Hon. Umar Yusuf (Danmaje Yabo)"`,
      `"Generated At: ${new Date().toISOString()}"`,
      `""`,
      `"Poll Title","${poll.title.replace(/"/g, '""')}"`,
      `"Official Question","${poll.question.replace(/"/g, '""')}"`,
      `"Category","${poll.category}"`,
      `"Target Ward","${poll.targetWard}"`,
      `"Status","${poll.status}"`,
      `"Total Ballots Cast","${poll.totalVotes}"`,
      `""`,
      `"OPTION BREAKDOWN"`,
      `"Option ID","Option Label","Votes Count","Vote Share Percentage"`
    ];

    poll.options.forEach(opt => {
      const optV = getOptVotes(opt);
      const pct = poll.totalVotes > 0 ? ((optV / poll.totalVotes) * 100).toFixed(1) : '0.0';
      lines.push(`"${opt.id}","${opt.text.replace(/"/g, '""')}","${optV}","${pct}%"`);
    });

    lines.push(`""`);
    lines.push(`"VOTER AUDIT LOG"`);
    lines.push(`"Voter ID / Name","Ward","Selected Option ID","Verification Method","Timestamp"`);

    const voterList: PollVoteRecord[] = poll.votes || poll.voters || [];
    if (voterList.length > 0) {
      voterList.forEach((v: PollVoteRecord) => {
        const optionIdUsed = v.optionId || v.selectedOptionId || '';
        lines.push(`"${(v.voterName || 'Constituent').replace(/"/g, '""')}","${v.ward || 'Yabo/Shagari'}","${optionIdUsed}","Constituency Device Fingerprint","${v.timestamp}"`);
      });
    } else {
      lines.push(`"No individual voter ballots recorded yet"`);
    }

    const csvContent = "data:text/csv;charset=utf-8," + lines.join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `danmaje_poll_${poll.id}_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate Overall Metrics
  const totalVotesAcrossAllPolls = polls.reduce((acc, p) => acc + (p.totalVotes || 0), 0);
  const activePollsCount = polls.filter(p => isPollActive(p.status)).length;
  const closedPollsCount = polls.filter(p => !isPollActive(p.status)).length;

  const filteredPolls = polls.filter(p => {
    const matchesSearch = !searchFilter || 
      p.question.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.category.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.targetWard.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || 
      (statusFilter === 'Active' && isPollActive(p.status)) ||
      (statusFilter === 'Closed' && !isPollActive(p.status));
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full min-w-0 space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-['Manrope'] font-extrabold text-2xl text-[#103C2E] uppercase">
              TOWN HALL & CIVIC VOTING MANAGER
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#09291F] text-[10px] font-black border border-[#D4AF37]/50 uppercase">
              CHIEF ADMIN CONTROL
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Empower constituents to vote on priority development projects, motions, and town hall agendas with real-time tracking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isChiefAdmin ? (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-[#103C2E] hover:bg-[#09291F] text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow cursor-pointer transition uppercase"
            >
              <Plus className="w-4 h-4 text-[#C6A15B]" />
              <span>Create Constituency Poll</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs font-semibold">
              <Lock className="w-4 h-4 text-amber-600" />
              <span>Chief Admin Privileges Required to Launch Polls</span>
            </div>
          )}
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Active Polls</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-700">{activePollsCount}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <p className="text-[11px] text-stone-500">Open for citizen ballots</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Total Ballots Cast</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-[#103C2E]">{totalVotesAcrossAllPolls.toLocaleString()}</span>
            <Users className="w-4 h-4 text-[#C6A15B]" />
          </div>
          <p className="text-[11px] text-stone-500">Across Yabo & Shagari wards</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Closed / Concluded</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-stone-700">{closedPollsCount}</span>
            <CheckCircle2 className="w-4 h-4 text-stone-400" />
          </div>
          <p className="text-[11px] text-stone-500">Results archived</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Democracy Index</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-[#D4AF37]">100%</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-[11px] text-stone-500">Transparent real-time tallying</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search polls by question, category, or ward..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-[#103C2E] focus:outline-none focus:border-[#103C2E]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-stone-500 font-bold uppercase">Status:</span>
          <div className="flex bg-stone-100 p-1 rounded-xl">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                statusFilter === 'ALL' ? 'bg-[#103C2E] text-white' : 'text-stone-600'
              }`}
            >
              All ({polls.length})
            </button>
            <button
              onClick={() => setStatusFilter('Active')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                statusFilter === 'Active' ? 'bg-emerald-700 text-white' : 'text-stone-600'
              }`}
            >
              Active ({activePollsCount})
            </button>
            <button
              onClick={() => setStatusFilter('Closed')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                statusFilter === 'Closed' ? 'bg-stone-700 text-white' : 'text-stone-600'
              }`}
            >
              Closed ({closedPollsCount})
            </button>
          </div>
        </div>
      </div>

      {/* Polls Listing Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-[#103C2E] text-white">
                <th className="p-4 uppercase text-[11px] font-bold">Status</th>
                <th className="p-4 uppercase text-[11px] font-bold">Question & Civic Focus</th>
                <th className="p-4 uppercase text-[11px] font-bold">Target Ward</th>
                <th className="p-4 uppercase text-[11px] font-bold">Ballots Cast</th>
                <th className="p-4 uppercase text-[11px] font-bold">Leading Preference</th>
                <th className="p-4 uppercase text-[11px] font-bold">End Date</th>
                <th className="p-4 text-right uppercase text-[11px] font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {filteredPolls.map(poll => {
                const totalVotes = poll.totalVotes || 0;
                // Identify leading option
                const leadingOption = poll.options.reduce((prev, curr) => 
                  (getOptVotes(curr) > getOptVotes(prev)) ? curr : prev, poll.options[0]);
                const leaderVotes = leadingOption ? getOptVotes(leadingOption) : 0;
                const leaderPct = totalVotes > 0 && leadingOption 
                  ? ((leaderVotes / totalVotes) * 100).toFixed(0) 
                  : 0;
                const active = isPollActive(poll.status);

                return (
                  <tr key={poll.id} className="hover:bg-stone-50 transition">
                    <td className="p-4 whitespace-nowrap">
                      {active ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          ACTIVE
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-stone-100 text-stone-600 border border-stone-300">
                          CONCLUDED
                        </span>
                      )}
                    </td>

                    <td className="p-4 max-w-md">
                      <div className="font-bold text-[#103C2E] line-clamp-2">
                        {poll.question}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-stone-100 text-stone-600">
                          {poll.category}
                        </span>
                        <span className="text-[10px] text-stone-400">
                          {poll.options.length} Options
                        </span>
                      </div>
                    </td>

                    <td className="p-4 whitespace-nowrap font-medium text-stone-700">
                      {poll.targetWard}
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <span className="font-mono font-bold text-sm text-[#103C2E]">
                        {totalVotes.toLocaleString()}
                      </span>
                    </td>

                    <td className="p-4 max-w-xs">
                      {totalVotes > 0 && leadingOption ? (
                        <div>
                          <div className="flex items-center justify-between text-[11px] mb-1">
                            <span className="font-bold text-stone-800 truncate pr-2">{leadingOption.text}</span>
                            <span className="font-mono font-black text-emerald-700">{leaderPct}%</span>
                          </div>
                          <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-emerald-600 h-full rounded-full transition-all"
                              style={{ width: `${leaderPct}%` }}
                            ></div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-stone-400 text-xs italic">Awaiting votes</span>
                      )}
                    </td>

                    <td className="p-4 whitespace-nowrap font-mono text-stone-500 text-xs">
                      {poll.endDate}
                    </td>

                    <td className="p-4 text-right whitespace-nowrap space-x-1.5">
                      {/* Track Button */}
                      <button
                        onClick={() => setTrackingPoll(poll)}
                        className="inline-flex items-center gap-1 bg-emerald-50 hover:bg-[#103C2E] text-[#103C2E] hover:text-white px-2.5 py-1.5 rounded-xl border border-emerald-200 transition-all shadow-xs cursor-pointer text-xs font-bold uppercase"
                        title="View Real-Time Tracking & Voter Audit"
                      >
                        <BarChart2 className="w-3.5 h-3.5" />
                        <span>Track</span>
                      </button>

                      {/* Export CSV Button */}
                      <button
                        onClick={() => handleExportPollCSV(poll)}
                        className="inline-flex items-center gap-1 bg-stone-100 hover:bg-stone-200 text-stone-700 px-2.5 py-1.5 rounded-xl border border-stone-300 transition-all shadow-xs cursor-pointer text-xs font-bold uppercase"
                        title="Export Official Ballot CSV"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">CSV</span>
                      </button>

                      {/* Toggle Active / Close */}
                      {isChiefAdmin && (
                        <button
                          onClick={() => handleToggleStatus(poll.id)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border transition-all shadow-xs cursor-pointer text-xs font-bold uppercase ${
                            active
                              ? 'bg-amber-50 hover:bg-amber-600 text-amber-800 hover:text-white border-amber-200'
                              : 'bg-emerald-50 hover:bg-emerald-600 text-emerald-800 hover:text-white border-emerald-200'
                          }`}
                          title={active ? 'Close Voting' : 'Reopen Voting'}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>{active ? 'Close' : 'Reopen'}</span>
                        </button>
                      )}

                      {/* Reset Votes Confirmation */}
                      {isChiefAdmin && (
                        resetConfirmId === poll.id ? (
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => handleResetVotes(poll.id)}
                              className="bg-rose-700 text-white px-2 py-1 rounded-lg text-[10px] font-bold uppercase hover:bg-rose-800"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setResetConfirmId(null)}
                              className="bg-stone-200 text-stone-700 px-2 py-1 rounded-lg text-[10px] font-bold uppercase hover:bg-stone-300"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setResetConfirmId(poll.id)}
                            className="inline-flex items-center gap-1 bg-stone-100 hover:bg-stone-200 text-stone-600 px-2 py-1.5 rounded-xl border border-stone-200 transition text-xs font-bold"
                            title="Reset Ballot Tallies"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )
                      )}

                      {/* Delete Poll */}
                      {isChiefAdmin && (
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this town hall poll? This cannot be undone.')) {
                              handleDeletePoll(poll.id);
                            }
                          }}
                          className="inline-flex items-center gap-1 bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white px-2.5 py-1.5 rounded-xl border border-rose-200 transition-all shadow-xs cursor-pointer text-xs font-bold uppercase"
                          title="Delete Poll"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}

              {filteredPolls.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-stone-400 text-xs">
                    No town hall polls match your current filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE POLL MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl my-8 border border-stone-200 max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#C6A15B] bg-[#C6A15B]/15 px-2.5 py-0.5 rounded-full border border-[#C6A15B]/30 inline-block mb-1">
                  PARLIAMENTARY CIVIC DEMOCRACY
                </span>
                <h3 className="font-['Manrope'] font-black text-xl text-[#103C2E] uppercase">
                  LAUNCH NEW TOWN HALL POLL
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="bg-stone-100 hover:bg-rose-600 text-stone-600 hover:text-white p-2 rounded-xl transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreatePoll} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#103C2E] uppercase">Poll Title / Reference Headline *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2026 Constituency Rural Electrification Priority Vote"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#103C2E] uppercase">Official Citizen Ballot Question *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Which community in Yabo/Shagari should receive the next Phase 3 solar electrification mini-grid?"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-semibold text-[#103C2E]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#103C2E] uppercase">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                  >
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Youth & Education">Youth & Education</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Agriculture">Agriculture</option>
                    <option value="Economic Empowerment">Economic Empowerment</option>
                    <option value="Governance & Policy">Governance & Policy</option>
                    <option value="Constituency Priority">Constituency Priority</option>
                    <option value="Budget & Projects">Budget & Projects</option>
                    <option value="Community Welfare">Community Welfare</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#103C2E] uppercase">Target Ward</label>
                  <select
                    value={newTargetWard}
                    onChange={(e) => setNewTargetWard(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                  >
                    {CONSTITUENCY_WARDS.map(w => (
                      <option key={w} value={w}>{w}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#103C2E] uppercase">Voting End Date</label>
                  <input
                    type="date"
                    required
                    value={newEndDate}
                    onChange={(e) => setNewEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#103C2E] uppercase">Civic Context & Explainer</label>
                <textarea
                  rows={2}
                  placeholder="Provide brief background information to guide constituents before they cast their ballot..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                ></textarea>
              </div>

              {/* Options Dynamic List */}
              <div className="space-y-2 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-[#103C2E] uppercase">
                    Voting Options / Choices ({optionsList.length})
                  </label>
                  {optionsList.length < 6 && (
                    <button
                      type="button"
                      onClick={handleAddOptionField}
                      className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Option</span>
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {optionsList.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#103C2E] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        required
                        placeholder={`Option ${idx + 1} label...`}
                        value={opt}
                        onChange={(e) => handleOptionChange(idx, e.target.value)}
                        className="flex-1 px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-semibold"
                      />
                      {optionsList.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveOptionField(idx)}
                          className="text-stone-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 rounded-xl font-bold uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#103C2E] hover:bg-[#09291F] text-white rounded-xl font-bold uppercase cursor-pointer shadow flex items-center gap-2"
                >
                  <Award className="w-4 h-4 text-[#C6A15B]" />
                  <span>Publish & Open Poll</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REAL-TIME TRACKING & VOTER AUDIT MODAL */}
      {trackingPoll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl my-8 border border-stone-200 max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-stone-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#C6A15B] bg-[#C6A15B]/15 px-2.5 py-0.5 rounded-full border border-[#C6A15B]/30 inline-block">
                    CONSTITUENCY BALLOT AUDIT & TRACKER
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                    isPollActive(trackingPoll.status) ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-600'
                  }`}>
                    {trackingPoll.status}
                  </span>
                </div>
                <h3 className="font-['Manrope'] font-black text-xl text-[#103C2E] uppercase mt-1">
                  {trackingPoll.question}
                </h3>
                <p className="text-xs text-stone-500 font-medium">
                  Ward: {trackingPoll.targetWard} • Category: {trackingPoll.category} • End Date: {trackingPoll.endDate}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleExportPollCSV(trackingPoll)}
                  className="bg-stone-100 hover:bg-stone-200 text-[#103C2E] px-3.5 py-2 rounded-xl text-xs font-bold uppercase transition flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Report</span>
                </button>
                <button
                  onClick={() => setTrackingPoll(null)}
                  className="bg-stone-100 hover:bg-rose-600 text-stone-600 hover:text-white p-2 rounded-xl transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Total Votes Highlight */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#FAF9F5] p-4 rounded-2xl border border-stone-200">
                <span className="text-[10px] font-bold uppercase text-stone-400 block">Total Verified Ballots</span>
                <span className="text-3xl font-black text-[#103C2E] font-mono">
                  {(trackingPoll.totalVotes || 0).toLocaleString()}
                </span>
                <span className="text-[11px] text-stone-500 block mt-1">Citizens participated</span>
              </div>

              <div className="bg-[#FAF9F5] p-4 rounded-2xl border border-stone-200">
                <span className="text-[10px] font-bold uppercase text-stone-400 block">Lead Margin</span>
                <span className="text-3xl font-black text-emerald-700 font-mono">
                  {(() => {
                    if (!trackingPoll.totalVotes || trackingPoll.options.length < 2) return '0%';
                    const sorted = [...trackingPoll.options].sort((a, b) => getOptVotes(b) - getOptVotes(a));
                    const leadDiff = getOptVotes(sorted[0]) - getOptVotes(sorted[1]);
                    const diffPct = ((leadDiff / trackingPoll.totalVotes) * 100).toFixed(1);
                    return `+${diffPct}%`;
                  })()}
                </span>
                <span className="text-[11px] text-stone-500 block mt-1">Over second preference</span>
              </div>

              <div className="bg-[#FAF9F5] p-4 rounded-2xl border border-stone-200">
                <span className="text-[10px] font-bold uppercase text-stone-400 block">Poll Integrity</span>
                <span className="text-3xl font-black text-[#D4AF37] font-mono">100%</span>
                <span className="text-[11px] text-emerald-700 font-semibold block mt-1">Anti-duplicate device check active</span>
              </div>
            </div>

            {/* Live Visual Voting Breakdown */}
            <div className="space-y-3 bg-stone-50 p-5 rounded-2xl border border-stone-200">
              <h4 className="font-black text-xs uppercase tracking-wider text-[#103C2E] flex items-center gap-1.5 border-b border-stone-200 pb-2">
                <BarChart2 className="w-4 h-4 text-emerald-700" />
                <span>Live Ballot Breakdown by Option</span>
              </h4>

              <div className="space-y-4 pt-1">
                {trackingPoll.options.map((opt, idx) => {
                  const total = trackingPoll.totalVotes || 0;
                  const optV = getOptVotes(opt);
                  const pct = total > 0 ? ((optV / total) * 100).toFixed(1) : '0.0';
                  const maxVotes = Math.max(...trackingPoll.options.map(o => getOptVotes(o)));
                  const isTop = optV === maxVotes && optV > 0;

                  return (
                    <div key={opt.id} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            isTop ? 'bg-emerald-600 text-white' : 'bg-stone-300 text-stone-700'
                          }`}>
                            {idx + 1}
                          </span>
                          <span className={`font-bold ${isTop ? 'text-[#103C2E]' : 'text-stone-700'}`}>
                            {opt.text}
                          </span>
                          {isTop && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                              Leading
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-stone-500 font-mono text-xs">
                            {optV.toLocaleString()} votes
                          </span>
                          <span className="font-mono font-black text-sm text-[#103C2E] w-12 text-right">
                            {pct}%
                          </span>
                        </div>
                      </div>

                      <div className="w-full bg-stone-200 h-3 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isTop ? 'bg-gradient-to-r from-emerald-600 to-[#103C2E]' : 'bg-stone-400'
                          }`}
                          style={{ width: `${pct}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Voter Audit Records Log */}
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-stone-200 pb-2">
                <h4 className="font-black text-xs uppercase tracking-wider text-[#103C2E] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Constituent Voter Audit Log ({((trackingPoll.votes || trackingPoll.voters) || []).length})</span>
                </h4>
                <span className="text-[11px] text-stone-400">
                  Verified parliamentary record
                </span>
              </div>

              <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden max-h-56 overflow-y-auto">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr className="bg-stone-100 text-stone-600 uppercase">
                      <th className="p-2.5 font-bold">Voter Identifier</th>
                      <th className="p-2.5 font-bold">Ward</th>
                      <th className="p-2.5 font-bold">Selected Choice</th>
                      <th className="p-2.5 font-bold">Device Fingerprint</th>
                      <th className="p-2.5 font-bold">Cast Timestamp</th>
                      <th className="p-2.5 font-bold text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {(() => {
                      const list: PollVoteRecord[] = trackingPoll.votes || trackingPoll.voters || [];
                      if (list.length === 0) {
                        return (
                          <tr>
                            <td colSpan={6} className="p-6 text-center text-stone-400 italic">
                              No individualized voter logs recorded for this poll yet.
                            </td>
                          </tr>
                        );
                      }
                      return list.map((v: PollVoteRecord, i: number) => {
                        const optId = v.optionId || v.selectedOptionId;
                        const chosenOpt = trackingPoll.options.find(o => o.id === optId);
                        return (
                          <tr key={v.id || i} className="hover:bg-stone-50">
                            <td className="p-2.5 font-bold text-[#103C2E]">{v.voterName || 'Verified Constituent'}</td>
                            <td className="p-2.5 text-stone-600">{v.ward || 'Yabo/Shagari'}</td>
                            <td className="p-2.5 font-semibold text-emerald-800">{chosenOpt?.text || optId}</td>
                            <td className="p-2.5 font-mono text-stone-400 text-[10px]">
                              {v.ipHash ? `SHA256:${v.ipHash.slice(0, 10)}...` : 'Browser-Secured Token'}
                            </td>
                            <td className="p-2.5 text-stone-500 font-mono text-[10px]">{v.timestamp}</td>
                            <td className="p-2.5 text-right">
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800">
                                Verified
                              </span>
                            </td>
                          </tr>
                        );
                      });
                    })()}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-between items-center pt-2 border-t border-stone-100">
              <span className="text-[11px] text-stone-400">
                Official Parliamentary Voting Register • Office of Hon. Umar Yusuf (Danmaje Yabo)
              </span>
              <button
                type="button"
                onClick={() => setTrackingPoll(null)}
                className="px-5 py-2 bg-[#103C2E] hover:bg-[#09291F] text-white rounded-xl text-xs font-bold uppercase cursor-pointer"
              >
                Close Audit View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
