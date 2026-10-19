import React, { useState, useEffect } from 'react';
import { 
  X, CheckCircle, AlertCircle, Copy, Check, Users, MapPin, 
  Send, BarChart2, Shield, ArrowRight, Phone, Award, Building2
} from 'lucide-react';
import { PollingUnitAgentLink, ElectionReport } from '../types';
import { Language, t, Translations } from '../utils/i18n';

interface Props {
  currentLang: Language;
  translations?: Translations;
}

export const AgentElectionPortal: React.FC<Props> = ({ currentLang }) => {
  const [tokenInput, setTokenInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verifiedAgentLink, setVerifiedAgentLink] = useState<PollingUnitAgentLink | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    totalRegisteredVoters: '',
    totalAccreditedVoters: '',
    totalValidVotes: '',
    rejectedVotes: '',
    danmajeVotes: '',
    opponentVotes: '',
    otherPartyVotes: '',
    notes: ''
  });

  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleVerifyToken = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const cleanToken = tokenInput.trim();
    const cleanPassword = passwordInput.trim();
    if (!cleanToken || !cleanPassword) {
      setError('Please enter both Agent Token and Password.');
      return;
    }

    // Retrieve links from localStorage
    const storedLinksJson = localStorage.getItem('danmaje_agent_links');
    const links: PollingUnitAgentLink[] = storedLinksJson ? JSON.parse(storedLinksJson) : [];
    
    console.log('Available agents:', links);
    console.log('Trying token:', cleanToken, 'Trying password:', cleanPassword);

    const found = links.find(l => {
      const storedToken1 = (l.uniqueToken || '').trim().toLowerCase();
      const storedToken2 = (l.token || '').trim().toLowerCase();
      const storedPassword = (l.password || '').trim();
      const inputToken = cleanToken.toLowerCase();
      const inputPassword = cleanPassword; // Should we trim input password? User might use spaces in password? Let's not trim input password for now, or maybe we should? Let's trim input password too to be safe.
      const inputPasswordClean = cleanPassword.trim();
      
      const tokenMatch1 = storedToken1 === inputToken;
      const tokenMatch2 = storedToken2 === inputToken;
      const passMatch = storedPassword === inputPasswordClean;
      
      console.log(`DEBUG: Checking agent ${l.id}`);
      console.log(`DEBUG:   storedToken1: '${storedToken1}', input: '${inputToken}', match1: ${tokenMatch1}`);
      console.log(`DEBUG:   storedPassword: '${storedPassword}', input: '${inputPasswordClean}', match: ${passMatch}`);
      
      return (tokenMatch1 || tokenMatch2) && passMatch;
    });

    if (!found) {
      setError('Invalid Agent Token or Password.');
      return;
    }

    setVerifiedAgentLink(found);
  };

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifiedAgentLink) return;

    setError('');
    const reg = parseInt(formData.totalRegisteredVoters, 10);
    const acc = parseInt(formData.totalAccreditedVoters, 10);
    const valid = parseInt(formData.totalValidVotes, 10);
    const danmaje = parseInt(formData.danmajeVotes, 10);
    const opponent = parseInt(formData.opponentVotes, 10);

    if (isNaN(reg) || isNaN(acc) || isNaN(valid) || isNaN(danmaje) || isNaN(opponent)) {
      setError('Please provide valid numbers for all mandatory vote counts.');
      return;
    }

    if (acc > reg) {
      setError('Accredited voters cannot exceed total registered voters.');
      return;
    }

    const report: ElectionReport = {
      id: 'rep_' + Math.random().toString(36).substring(2, 9),
      linkId: verifiedAgentLink.id,
      agentName: verifiedAgentLink.agentName,
      wardName: verifiedAgentLink.wardName,
      pollingUnitName: verifiedAgentLink.pollingUnitName,
      pollingUnitCode: verifiedAgentLink.pollingUnitCode || '',
      phone: verifiedAgentLink.phone,
      totalRegisteredVoters: reg,
      totalAccreditedVoters: acc,
      totalValidVotes: valid,
      rejectedVotes: parseInt(formData.rejectedVotes || '0', 10),
      danmajeVotes: danmaje,
      opponentVotes: opponent,
      otherPartyVotes: parseInt(formData.otherPartyVotes || '0', 10),
      notes: formData.notes,
      submittedAt: new Date().toLocaleString()
    };

    // Save report to localStorage
    const reportsJson = localStorage.getItem('danmaje_election_reports');
    const reports: ElectionReport[] = reportsJson ? JSON.parse(reportsJson) : [];
    
    // Check if already submitted for this polling unit
    const existingIndex = reports.findIndex(r => r.linkId === verifiedAgentLink.id);
    if (existingIndex >= 0) {
      reports[existingIndex] = report; // update
    } else {
      reports.push(report);
    }

    localStorage.setItem('danmaje_election_reports', JSON.stringify(reports));

    // Mark link as used
    const linksJson = localStorage.getItem('danmaje_agent_links');
    if (linksJson) {
      const links: PollingUnitAgentLink[] = JSON.parse(linksJson);
      const updatedLinks = links.map(l => l.id === verifiedAgentLink.id ? { ...l, isUsed: true } : l);
      localStorage.setItem('danmaje_agent_links', JSON.stringify(updatedLinks));
    }

    setSubmittedSuccess(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] py-12 px-4 sm:px-8">
      <div className="max-w-xl mx-auto space-y-6">
        {/* Header Branding */}
        <div className="bg-[#103C2E] text-white p-8 rounded-3xl shadow-2xl border-2 border-[#C6A15B]/50 text-center space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#C6A15B]/10 rounded-full blur-2xl"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-[#07241A] border-2 border-[#D4AF37] flex items-center justify-center shadow-lg mb-2">
              <img src="/official_logo.png" alt="Crest" className="w-10 h-10 object-contain rounded-full" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] bg-[#C6A15B]/20 px-3 py-1 rounded-full border border-[#C6A15B]/40">
              OFFICIAL POLLING UNIT AGENT PORTAL
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold font-['Manrope'] text-white">
              HON. UMAR YUSUF (DANMAJE YABO)
            </h1>
            <p className="text-xs text-emerald-200">
              Yabo/Shagari Federal Constituency • Election Results Transmission Desk
            </p>
          </div>
        </div>

        {/* Main Content Box */}
        <div className="bg-white rounded-3xl shadow-xl border border-stone-200 p-6 sm:p-8">
          {submittedSuccess ? (
            <div className="text-center space-y-5 py-6">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <h2 className="font-['Manrope'] font-extrabold text-2xl text-[#103C2E]">
                  RESULT SUBMITTED SUCCESSFULLY!
                </h2>
                <p className="text-xs text-stone-600">
                  Your polling unit scores have been securely transmitted and compiled into the central constituency command dashboard.
                </p>
              </div>

              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 text-left space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-500 font-semibold">Polling Unit:</span>
                  <span className="font-bold text-[#103C2E]">{verifiedAgentLink?.pollingUnitName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500 font-semibold">Ward:</span>
                  <span className="font-bold text-[#103C2E]">{verifiedAgentLink?.wardName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500 font-semibold">Agent Name:</span>
                  <span className="font-bold text-[#103C2E]">{verifiedAgentLink?.agentName}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-stone-500 font-semibold">Danmaje Votes:</span>
                  <span className="font-bold text-emerald-700 text-sm">{formData.danmajeVotes} Votes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500 font-semibold">Main Opponent Votes:</span>
                  <span className="font-bold text-rose-700 text-sm">{formData.opponentVotes} Votes</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setSubmittedSuccess(false);
                  setVerifiedAgentLink(null);
                  setTokenInput('');
                }}
                className="w-full bg-[#103C2E] hover:bg-[#09291F] text-white py-3.5 rounded-xl font-extrabold text-xs transition cursor-pointer uppercase tracking-wider shadow-md"
              >
                SUBMIT ANOTHER OR EDIT REPORT
              </button>
            </div>
          ) : !verifiedAgentLink ? (
            <form onSubmit={handleVerifyToken} className="space-y-5">
              <div className="space-y-1.5">
                <h2 className="font-['Manrope'] font-bold text-lg text-[#103C2E]">
                  Agent Token Verification
                </h2>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Enter your unique Polling Unit Agent Link Token provided by the constituency headquarters to access the secure result reporting form.
                </p>
              </div>

              {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#103C2E]">Unique Agent Token / Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. agent_yabo_central_01"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:border-[#103C2E]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#103C2E]">Agent Password *</label>
                <input
                  type="password"
                  required
                  placeholder="Enter agent password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:border-[#103C2E]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#103C2E] hover:bg-[#09291F] text-white py-3.5 rounded-xl font-extrabold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
              >
                <span>ACCESS REPORTING FORM</span>
                <ArrowRight className="w-4 h-4 text-[#C6A15B]" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmitReport} className="space-y-6">
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-200/60 px-2.5 py-0.5 rounded">
                    Verified Polling Unit Agent
                  </span>
                  <button
                    type="button"
                    onClick={() => setVerifiedAgentLink(null)}
                    className="text-xs text-stone-500 hover:text-stone-800 underline font-medium"
                  >
                    Change Agent
                  </button>
                </div>
                <h3 className="font-['Manrope'] font-bold text-base text-[#103C2E]">
                  {verifiedAgentLink.pollingUnitName}
                </h3>
                <p className="text-xs text-stone-600">
                  Ward: <strong>{verifiedAgentLink.wardName}</strong> | Agent: <strong>{verifiedAgentLink.agentName}</strong> ({verifiedAgentLink.phone})
                </p>
              </div>

              {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#103C2E]">Total Registered Voters (PU) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 750"
                    value={formData.totalRegisteredVoters}
                    onChange={(e) => setFormData({ ...formData, totalRegisteredVoters: e.target.value })}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#103C2E]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#103C2E]">Total Accredited Voters *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="e.g. 420"
                    value={formData.totalAccreditedVoters}
                    onChange={(e) => setFormData({ ...formData, totalAccreditedVoters: e.target.value })}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#103C2E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#103C2E]">Total Valid Votes *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="e.g. 405"
                    value={formData.totalValidVotes}
                    onChange={(e) => setFormData({ ...formData, totalValidVotes: e.target.value })}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#103C2E]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#103C2E]">Rejected / Void Votes *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="e.g. 15"
                    value={formData.rejectedVotes}
                    onChange={(e) => setFormData({ ...formData, rejectedVotes: e.target.value })}
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#103C2E]"
                  />
                </div>
              </div>

              <div className="bg-[#FAF9F5] p-5 rounded-2xl border-2 border-[#C6A15B]/40 space-y-4">
                <h4 className="font-['Manrope'] font-bold text-sm text-[#103C2E] uppercase tracking-wider flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#C6A15B]" />
                  <span>Candidate Score Breakdown</span>
                </h4>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#103C2E]">
                    Hon. Umar Yusuf (Danmaje Yabo) Votes [APC/Party] *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="e.g. 280"
                    value={formData.danmajeVotes}
                    onChange={(e) => setFormData({ ...formData, danmajeVotes: e.target.value })}
                    className="w-full px-4 py-3 bg-white border-2 border-emerald-500 rounded-xl text-sm font-bold text-[#103C2E] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#103C2E]">
                    Main Opponent Votes [PDP/Other] *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="e.g. 110"
                    value={formData.opponentVotes}
                    onChange={(e) => setFormData({ ...formData, opponentVotes: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-stone-300 rounded-xl text-sm font-bold text-rose-700 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#103C2E]">Other Parties Total Votes</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 15"
                    value={formData.otherPartyVotes}
                    onChange={(e) => setFormData({ ...formData, otherPartyVotes: e.target.value })}
                    className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs focus:outline-none"
                  />
                </div>

                {/* Real-time calculated difference preview */}
                <div className="bg-emerald-900 text-white p-3 rounded-xl text-xs flex justify-between items-center font-bold">
                  <span>Calculated Margin (Difference):</span>
                  <span className="text-[#D4AF37] text-sm">
                    {(!isNaN(parseInt(formData.danmajeVotes)) && !isNaN(parseInt(formData.opponentVotes)))
                      ? `${(parseInt(formData.danmajeVotes) - parseInt(formData.opponentVotes)) >= 0 ? '+' : ''}${parseInt(formData.danmajeVotes) - parseInt(formData.opponentVotes)} Votes`
                      : 'Enter votes above'}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[#103C2E]">Incident / Observation Notes (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Note any peaceful conduct, turnout details, or official remarks..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#103C2E] resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-[#103C2E] hover:bg-[#09291F] text-white py-4 rounded-xl font-extrabold text-xs sm:text-sm shadow-xl transition flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
              >
                <span>TRANSMIT OFFICIAL POLLING RESULT</span>
                <Send className="w-4 h-4 text-[#C6A15B]" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
