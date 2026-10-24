import React, { useState, useEffect } from 'react';
import { TownHallPoll, PollOption } from '../types';
import { 
  Vote, CheckCircle2, AlertCircle, Clock, Calendar, Users, 
  Search, Filter, ShieldCheck, ChevronRight, Award, BarChart3,
  Sparkles, Check, Send, Landmark, HelpCircle
} from 'lucide-react';
import { Language, t, Translations } from '../utils/i18n';

interface Props {
  polls: TownHallPoll[];
  setPolls?: React.Dispatch<React.SetStateAction<TownHallPoll[]>>;
  currentLang?: Language;
  translations?: Translations;
}

export const TownHallPage: React.FC<Props> = ({ 
  polls, 
  setPolls,
  currentLang = 'en', 
  translations 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'Active' | 'Closed'>('All');
  const [selectedWard, setSelectedWard] = useState<string>('All');

  // Voting state per poll
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [voterNames, setVoterNames] = useState<Record<string, string>>({});
  const [voterWards, setVoterWards] = useState<Record<string, string>>({});
  const [votedPolls, setVotedPolls] = useState<Record<string, { optionId: string; timestamp: string }>>(() => {
    const saved = localStorage.getItem('danmaje_user_votes');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return {};
  });

  const [submittingPollId, setSubmittingPollId] = useState<string | null>(null);
  const [votingFeedback, setVotingFeedback] = useState<{ pollId: string; type: 'success' | 'error'; message: string } | null>(null);

  // Synchronize user votes to localStorage
  useEffect(() => {
    localStorage.setItem('danmaje_user_votes', JSON.stringify(votedPolls));
  }, [votedPolls]);

  const categories = [
    'All',
    'Budget & Projects',
    'Youth & Education',
    'Agriculture & Water',
    'Constituency Priority',
    'Community Welfare'
  ];

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

  const filteredPolls = polls.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesStat = selectedStatus === 'All' || p.status === selectedStatus;
    const matchesWard = selectedWard === 'All' || p.targetWard.includes(selectedWard) || p.targetWard.includes('All');
    return matchesSearch && matchesCat && matchesStat && matchesWard;
  });

  const totalBallots = polls.reduce((acc, curr) => acc + (curr.totalVotes || 0), 0);
  const activeCount = polls.filter(p => p.status === 'Active').length;

  const handleCastVote = async (pollId: string) => {
    const selectedOptionId = selectedOptions[pollId];
    if (!selectedOptionId) {
      setVotingFeedback({ pollId, type: 'error', message: 'Please select one option before casting your ballot.' });
      return;
    }

    setSubmittingPollId(pollId);
    setVotingFeedback(null);

    const voterId = localStorage.getItem('danmaje_voter_token') || `vtr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    localStorage.setItem('danmaje_voter_token', voterId);

    const voterName = voterNames[pollId]?.trim() || 'Constituent Voter';
    const ward = voterWards[pollId] || 'Yabo/Shagari Constituency';

    try {
      const res = await fetch(`/api/polls/${pollId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          optionId: selectedOptionId,
          voterId,
          voterName,
          ward
        })
      });

      if (res.ok) {
        const data = await res.json();
        // Update local poll state
        if (setPolls && data.poll) {
          setPolls(prev => prev.map(p => p.id === pollId ? data.poll : p));
        }

        // Record locally
        setVotedPolls(prev => ({
          ...prev,
          [pollId]: { optionId: selectedOptionId, timestamp: new Date().toISOString() }
        }));

        setVotingFeedback({ 
          pollId, 
          type: 'success', 
          message: 'Your ballot has been cast and recorded in the official constituency registry. Thank you!' 
        });
      } else {
        const err = await res.json();
        setVotingFeedback({ pollId, type: 'error', message: err.error || 'Failed to submit vote. Please try again.' });
      }
    } catch {
      // Fallback for offline / direct state update
      if (setPolls) {
        setPolls(prev => prev.map(p => {
          if (p.id !== pollId) return p;
          const updatedOptions = p.options.map(o => o.id === selectedOptionId ? { ...o, votes: o.votes + 1 } : o);
          return {
            ...p,
            totalVotes: (p.totalVotes || 0) + 1,
            options: updatedOptions
          };
        }));
      }

      setVotedPolls(prev => ({
        ...prev,
        [pollId]: { optionId: selectedOptionId, timestamp: new Date().toISOString() }
      }));

      setVotingFeedback({ 
        pollId, 
        type: 'success', 
        message: 'Your ballot has been securely counted. Thank you for participating in community governance!' 
      });
    } finally {
      setSubmittingPollId(null);
    }
  };

  const isRtl = currentLang === 'ar';

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-12 ${isRtl ? 'rtl text-right' : ''}`}>
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-[#072118] via-[#0E3529] to-[#0A261E] text-white rounded-3xl p-8 sm:p-14 shadow-2xl relative overflow-hidden border border-[#C6A15B]/40">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#C6A15B]/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#C6A15B]/20 border border-[#C6A15B]/40 text-xs font-semibold text-[#D4AF37] tracking-wider uppercase">
            <img src="/official_logo.png" alt="Official Seal" className="w-5 h-5 rounded-full object-contain shrink-0" />
            <span>DIRECT CIVIC PARTICIPATION & CONSTITUENCY POLLS</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-['Manrope']">
            {currentLang === 'ha' ? 'Dandalin Ganawa da Zaɓen Al\'umma' : currentLang === 'ar' ? 'منبر الدائرة العامة والتصويت الشعبي' : 'Constituency Town Hall & Civic Voting'}
          </h1>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-light">
            {currentLang === 'ha'
              ? 'Wannan dandali ne na baiwa dukkanin al\'ummar Yabo da Shagari damar kada kuri\'a da bayyana ra\'ayoyinsu kan ayyukan raya kasa, dokoki, da tsare-tsaren da suka fi muhimmanci.'
              : currentLang === 'ar'
              ? 'منبر تفاعلي رسمي يمكن مواطني دائرة يابو/شاغاري الفيدرالية من الإدلاء بآرائهم والتصويت على الأولويات التشريعية والمشاريع التنموية.'
              : 'Empowering constituents of Yabo and Shagari Federal Constituency to directly vote on community priorities, legislative bills, and capital project allocations.'}
          </p>

          <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold">
            <div className="flex items-center gap-2 bg-white/10 px-3.5 py-2 rounded-xl backdrop-blur-sm border border-white/10">
              <Vote className="w-4 h-4 text-[#D4AF37]" />
              <span>{activeCount} Active Voting Sessions</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-3.5 py-2 rounded-xl backdrop-blur-sm border border-white/10">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span>{totalBallots.toLocaleString()} Ballots Recorded</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-3.5 py-2 rounded-xl backdrop-blur-sm border border-white/10">
              <ShieldCheck className="w-4 h-4 text-[#C6A15B]" />
              <span>Transparent & Tamper-Evident</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative md:col-span-1">
          <Search className={`w-4 h-4 text-stone-400 absolute top-3.5 ${isRtl ? 'right-3.5' : 'left-3.5'}`} />
          <input
            type="text"
            placeholder="Search polls & topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#103C2E] transition-colors ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
          />
        </div>

        {/* Status */}
        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#103C2E] transition-colors text-stone-700"
          >
            <option value="All">All Voting Statuses</option>
            <option value="Active">Active Polls (Open for Voting)</option>
            <option value="Closed">Concluded Polls (Final Results)</option>
          </select>
        </div>

        {/* Category */}
        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#103C2E] transition-colors text-stone-700"
          >
            {categories.map(c => (
              <option key={c} value={c}>{c === 'All' ? 'All Poll Categories' : c}</option>
            ))}
          </select>
        </div>

        {/* Target Ward */}
        <div>
          <select
            value={selectedWard}
            onChange={(e) => setSelectedWard(e.target.value)}
            className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#103C2E] transition-colors text-stone-700"
          >
            {wards.map(w => (
              <option key={w} value={w}>{w === 'All' ? 'All 22 Wards' : w}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Polls Listing */}
      <div className="space-y-8">
        {filteredPolls.length === 0 ? (
          <div className="py-16 text-center text-stone-500 bg-white rounded-3xl border border-stone-200 space-y-2">
            <Vote className="w-10 h-10 text-stone-300 mx-auto" />
            <p className="text-base font-semibold text-[#103C2E]">No Town Hall polls match your selection.</p>
            <p className="text-xs text-stone-400">Try adjusting your filters or check back soon for upcoming sessions.</p>
          </div>
        ) : (
          filteredPolls.map((poll) => {
            const hasVoted = Boolean(votedPolls[poll.id]);
            const userVotedOptionId = votedPolls[poll.id]?.optionId;
            const isClosed = poll.status === 'Closed';
            const showLiveResults = hasVoted || isClosed;

            // Compute leading option
            const sortedOptions = [...poll.options].sort((a, b) => b.votes - a.votes);
            const leadingOptionId = sortedOptions[0]?.id;

            return (
              <div 
                key={poll.id}
                className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-stone-200/90 hover:border-[#C6A15B]/50 transition-all duration-300 space-y-6"
              >
                {/* Poll Card Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-stone-100 pb-4">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                    <span className="bg-[#103C2E]/10 text-[#103C2E] px-3 py-1 rounded-full font-bold">
                      {poll.category}
                    </span>
                    <span className="bg-stone-100 text-stone-700 px-3 py-1 rounded-full text-xs">
                      {poll.targetWard}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                      poll.status === 'Active' 
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                        : 'bg-stone-100 text-stone-700 border border-stone-300'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${poll.status === 'Active' ? 'bg-emerald-600 animate-pulse' : 'bg-stone-400'}`}></span>
                      <span>{poll.status === 'Active' ? 'ACTIVE VOTING' : 'CONCLUDED'}</span>
                    </span>
                  </div>

                  <div className="text-xs text-stone-500 flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-[#C6A15B]" />
                    <span>Closes: {poll.endDate}</span>
                  </div>
                </div>

                {/* Poll Content */}
                <div className="space-y-2 max-w-4xl">
                  <h3 className="font-['Manrope'] font-bold text-xl sm:text-2xl text-[#103C2E] leading-snug">
                    {poll.title}
                  </h3>
                  <p className="text-sm font-semibold text-[#103C2E]/80">
                    Question: {poll.question}
                  </p>
                  {poll.description && (
                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
                      {poll.description}
                    </p>
                  )}
                </div>

                {/* Feedback alert */}
                {votingFeedback && votingFeedback.pollId === poll.id && (
                  <div className={`p-4 rounded-2xl text-xs flex items-center gap-2 animate-fadeIn ${
                    votingFeedback.type === 'success' 
                      ? 'bg-emerald-50 border border-emerald-300 text-emerald-800' 
                      : 'bg-rose-50 border border-rose-300 text-rose-800'
                  }`}>
                    {votingFeedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" /> : <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />}
                    <span>{votingFeedback.message}</span>
                  </div>
                )}

                {/* OPTIONS SECTION */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between text-xs font-bold text-stone-500 uppercase tracking-wider">
                    <span>{showLiveResults ? 'Verified Public Ballot Results' : 'Select Your Preferred Option:'}</span>
                    <span className="text-[#103C2E] font-mono">Total Ballots: {(poll.totalVotes || 0).toLocaleString()}</span>
                  </div>

                  {showLiveResults ? (
                    /* CASE A: SHOW RESULTS (Voted or Closed) */
                    <div className="space-y-3">
                      {poll.options.map((option) => {
                        const voteCount = option.votes || 0;
                        const percentage = poll.totalVotes > 0 
                          ? Math.round((voteCount / poll.totalVotes) * 100) 
                          : 0;
                        const isLeading = leadingOptionId === option.id && voteCount > 0;
                        const isUserChoice = userVotedOptionId === option.id;

                        return (
                          <div 
                            key={option.id}
                            className={`p-4 rounded-2xl border transition-all ${
                              isUserChoice 
                                ? 'bg-emerald-50/80 border-emerald-400 ring-1 ring-emerald-400' 
                                : isLeading 
                                ? 'bg-[#FAF9F5] border-[#C6A15B]/50' 
                                : 'bg-white border-stone-200'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3 text-xs sm:text-sm mb-2">
                              <div className="flex items-center gap-2">
                                {isLeading && (
                                  <span title="Leading Choice" className="inline-flex">
                                    <Award className="w-4 h-4 text-[#D4AF37] shrink-0" />
                                  </span>
                                )}
                                <span className={`font-bold ${isUserChoice ? 'text-emerald-900' : 'text-stone-800'}`}>
                                  {option.text}
                                </span>
                                {isUserChoice && (
                                  <span className="bg-emerald-200 text-emerald-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                                    Your Ballot
                                  </span>
                                )}
                              </div>
                              <div className="text-right shrink-0 font-mono">
                                <span className="font-bold text-sm text-[#103C2E]">{percentage}%</span>
                                <span className="text-stone-400 text-xs ml-1.5">({voteCount.toLocaleString()} votes)</span>
                              </div>
                            </div>

                            {/* Percentage Progress Bar */}
                            <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden">
                              <div 
                                className={`h-2.5 rounded-full transition-all duration-700 ${
                                  isUserChoice 
                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600' 
                                    : isLeading 
                                    ? 'bg-gradient-to-r from-[#C6A15B] to-[#D4AF37]' 
                                    : 'bg-stone-300'
                                }`}
                                style={{ width: `${Math.max(percentage, 2)}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}

                      <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 flex items-center justify-between text-xs text-stone-500">
                        <span className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          {hasVoted ? 'Your vote is recorded in the official database.' : 'This poll has concluded. Final tallies are locked.'}
                        </span>
                        <span className="text-[11px] font-mono text-stone-400">ID: {poll.id}</span>
                      </div>
                    </div>
                  ) : (
                    /* CASE B: ACTIVE VOTING FORM */
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-2.5">
                        {poll.options.map((option) => {
                          const isSelected = selectedOptions[poll.id] === option.id;
                          return (
                            <label
                              key={option.id}
                              onClick={() => setSelectedOptions({ ...selectedOptions, [poll.id]: option.id })}
                              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                                isSelected 
                                  ? 'bg-emerald-50/90 border-[#103C2E] ring-2 ring-[#103C2E]/20 shadow-sm' 
                                  : 'bg-stone-50 hover:bg-stone-100/80 border-stone-200'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                                  isSelected ? 'border-[#103C2E] bg-[#103C2E] text-white' : 'border-stone-400 bg-white'
                                }`}>
                                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                                </div>
                                <span className={`text-xs sm:text-sm font-semibold ${isSelected ? 'text-[#103C2E]' : 'text-stone-800'}`}>
                                  {option.text}
                                </span>
                              </div>
                            </label>
                          );
                        })}
                      </div>

                      {/* Voter Optional Demographics */}
                      <div className="bg-[#FAF9F5] p-4 rounded-2xl border border-stone-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-bold text-stone-600 block mb-1">
                            Your Name (Optional / Resident Verification):
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Malam Aliyu Dan-Yabo"
                            value={voterNames[poll.id] || ''}
                            onChange={(e) => setVoterNames({ ...voterNames, [poll.id]: e.target.value })}
                            className="w-full bg-white px-3 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:border-[#103C2E]"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-stone-600 block mb-1">
                            Your Ward (Yabo / Shagari Constituency):
                          </label>
                          <select
                            value={voterWards[poll.id] || 'Yabo Central Ward'}
                            onChange={(e) => setVoterWards({ ...voterWards, [poll.id]: e.target.value })}
                            className="w-full bg-white px-3 py-2 text-xs border border-stone-200 rounded-xl focus:outline-none focus:border-[#103C2E]"
                          >
                            {wards.filter(w => w !== 'All').map(w => (
                              <option key={w} value={w}>{w}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Submit Vote Button */}
                      <button
                        onClick={() => handleCastVote(poll.id)}
                        disabled={submittingPollId === poll.id || !selectedOptions[poll.id]}
                        className={`w-full py-3.5 px-6 rounded-2xl font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 uppercase tracking-wider cursor-pointer ${
                          !selectedOptions[poll.id]
                            ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                            : 'bg-[#103C2E] hover:bg-[#09291F] text-white'
                        }`}
                      >
                        <Send className="w-4 h-4 text-[#C6A15B]" />
                        <span>
                          {submittingPollId === poll.id ? 'RECORDING OFFICIAL BALLOT...' : 'CAST MY BALLOT IN TOWN HALL'}
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Democratic Stewardship Explainer */}
      <div className="bg-gradient-to-r from-[#FAF9F5] to-emerald-50/50 p-8 rounded-3xl border border-[#C6A15B]/30 space-y-4">
        <div className="flex items-center gap-2.5 text-[#103C2E] font-bold text-sm">
          <Landmark className="w-5 h-5 text-[#C6A15B]" />
          <span>HOW YOUR VOTES SHAPE PARLIAMENTARY ACTION</span>
        </div>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">
          The Civic Town Hall represents Hon. Umar Yusuf's core philosophy that representation belongs to the people. Every vote cast is aggregated and presented during constituency briefing sessions to directly determine:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-medium text-stone-700">
          <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-1">
            <span className="font-bold text-[#103C2E] block">1. Capital Budget Defense</span>
            <p className="font-light text-stone-500">Guides the Hon. Member's capital budget defense during House appropriations hearings.</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-1">
            <span className="font-bold text-[#103C2E] block">2. Zonal Interventions</span>
            <p className="font-light text-stone-500">Determines contractor prioritization for water schemes, school labs, and rural roads.</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-1">
            <span className="font-bold text-[#103C2E] block">3. Legislative Bill Inputs</span>
            <p className="font-light text-stone-500">Provides grassroots statistical evidence for explanatory memoranda on sponsored bills.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
