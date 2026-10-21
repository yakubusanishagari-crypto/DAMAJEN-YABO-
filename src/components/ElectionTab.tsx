import React, { useState } from 'react';
import { PollingUnitAgentLink, ElectionReport } from '../types';
import { Plus, X, Trash2, Copy, Printer, MessageCircle, CheckCircle2, ExternalLink, ShieldCheck } from 'lucide-react';

interface Props {
  agents: PollingUnitAgentLink[];
  setAgents: React.Dispatch<React.SetStateAction<PollingUnitAgentLink[]>>;
  electionReports: ElectionReport[];
  setElectionReports: React.Dispatch<React.SetStateAction<ElectionReport[]>>;
}

export const ElectionTab: React.FC<Props> = ({ agents, setAgents, electionReports, setElectionReports }) => {
  const [showNewAgentModal, setShowNewAgentModal] = useState(false);
  const [justCreatedAgent, setJustCreatedAgent] = useState<PollingUnitAgentLink | null>(null);
  const [newLGA, setNewLGA] = useState('');
  const [newWard, setNewWard] = useState('');
  const [newPUName, setNewPUName] = useState('');
  const [newPUCode, setNewPUCode] = useState('');
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentPhone, setNewAgentPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [copiedToken, setCopiedToken] = useState('');
  const [copiedType, setCopiedType] = useState('');

  const totalAssigned = agents.length;
  const totalReported = electionReports.length;
  const totalDanmajeVotes = electionReports.reduce((acc, r) => acc + r.danmajeVotes, 0);
  const totalOpponentVotes = electionReports.reduce((acc, r) => acc + r.opponentVotes, 0);
  const netMargin = totalDanmajeVotes - totalOpponentVotes;
  const totalValid = electionReports.reduce((acc, r) => acc + r.totalValidVotes, 0);

  const getAgentWhatsAppUrl = (agent: PollingUnitAgentLink) => {
    const rawPhone = (agent.phone || '').replace(/[^0-9]/g, '');
    let formattedPhone = rawPhone;
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '234' + formattedPhone.slice(1);
    } else if (formattedPhone.startsWith('8') || formattedPhone.startsWith('7') || formattedPhone.startsWith('9')) {
      formattedPhone = '234' + formattedPhone;
    }
    const tokenVal = agent.token || agent.uniqueToken;
    const directLink = `${window.location.origin}/?agent_token=${encodeURIComponent(tokenVal)}&pwd=${encodeURIComponent(agent.password)}`;

    const text = 
`*FEDERAL REPUBLIC OF NIGERIA • 10TH NATIONAL ASSEMBLY*
*CAMPAIGN & ELECTION TRANSMISSION DESK*
*OFFICE OF HON. (DR.) UMAR YUSUF (DAN MAJEN YABO)*

Dear Accredited Agent: *${agent.agentName.toUpperCase()}*,

You have been officially accredited as the Polling Unit Transmission Officer for:
🏛️ *Polling Unit:* ${agent.pollingUnitName}
📍 *PU Code:* ${agent.pollingUnitCode || 'PU Code Verified'}
📍 *Ward / LGA:* ${agent.ward || agent.wardName} • ${agent.localGovernment}

🔐 *YOUR SECURE ACCESS CREDENTIALS:*
• *Agent ID / Token:* ${tokenVal}
• *Password:* ${agent.password}

📲 *1-CLICK INSTANT LOGIN LINK:*
${directLink}

_INSTRUCTIONS:_
1. Click the 1-Click link above to automatically log into your transmission desk.
2. Enter accredited voter counts, vote tallies, and capture the authentic Form EC8A result sheet photo.
3. Transmit immediately as soon as counting concludes.

_Strictly Confidential • Assigned to ${agent.agentName}_`;

    return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(text)}`;
  };

  const handleCreateAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLGA || !newWard || !newPUName || !newAgentName) return;
    const cleanWard = newWard.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const randCode = Math.random().toString(36).substring(2, 6);
    const token = `${cleanWard || 'pu'}-${randCode}`;
    const password = newPassword.trim() || `DAN${Math.floor(1000 + Math.random() * 9000)}`;

    const newAg: PollingUnitAgentLink = {
      id: `ag-${Date.now()}`,
      uniqueToken: token,
      token,
      password,
      localGovernment: newLGA.trim(),
      ward: newWard.trim(),
      wardName: newWard.trim(),
      pollingUnitName: newPUName.trim(),
      pollingUnitCode: newPUCode.trim() || '01/05/00/000',
      agentName: newAgentName.trim(),
      phone: newAgentPhone.trim() || '+234 803 000 0000',
      status: 'PENDING',
      isUsed: false,
      createdAt: new Date().toLocaleString()
    };

    const updatedAgents = [newAg, ...agents];
    setAgents(updatedAgents);
    localStorage.setItem('danmaje_agent_links', JSON.stringify(updatedAgents));
    localStorage.setItem('danmaje_agents', JSON.stringify(updatedAgents));
    setJustCreatedAgent(newAg);
    setShowNewAgentModal(false);
    setNewLGA('');
    setNewWard('');
    setNewPUName('');
    setNewPUCode('');
    setNewAgentName('');
    setNewAgentPhone('');
    setNewPassword('');
  };

  const copyDirectAgentLink = (agent: PollingUnitAgentLink) => {
    const link = `${window.location.origin}/?agent_token=${encodeURIComponent(agent.token || agent.uniqueToken)}&pwd=${encodeURIComponent(agent.password)}`;
    navigator.clipboard.writeText(link);
    setCopiedToken(agent.token || agent.uniqueToken);
    setCopiedType('link');
    setTimeout(() => {
      setCopiedToken('');
      setCopiedType('');
    }, 3000);
  };

  const copyCredential = (text: string, id: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(id);
    setCopiedType(type);
    setTimeout(() => {
      setCopiedToken('');
      setCopiedType('');
    }, 2500);
  };

  const handleTestLogin = (agent: PollingUnitAgentLink) => {
    const targetUrl = `/?agent_token=${encodeURIComponent(agent.token || agent.uniqueToken)}&pwd=${encodeURIComponent(agent.password)}`;
    window.location.href = targetUrl;
  };

  return (
    <div className="w-full min-w-0 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-200 pb-4">
        <div>
          <h3 className="font-['Manrope'] font-extrabold text-2xl text-[#103C2E] uppercase">
            10. ELECTION RESULTS & POLLING UNIT AGENTS
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Real-time collation of polling unit agent reports across all wards in the constituency for Hon. Umar Yusuf.
          </p>
        </div>
        <button
          onClick={() => setShowNewAgentModal(true)}
          className="bg-[#103C2E] hover:bg-[#09291F] text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase shadow flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#C6A15B]" />
          <span>Assign Agent & Generate Link</span>
        </button>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-stone-200 space-y-1">
          <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">Assigned Agents</span>
          <strong className="text-2xl font-extrabold text-[#103C2E] block">{totalAssigned}</strong>
          <span className="text-xs text-stone-500">Polling Units Covered</span>
        </div>
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-stone-200 space-y-1">
          <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">Reports Received</span>
          <strong className="text-2xl font-extrabold text-emerald-700 block">{totalReported} / {totalAssigned}</strong>
          <span className="text-xs text-stone-500">{Math.round((totalReported / (totalAssigned || 1)) * 100)}% Collation Rate</span>
        </div>
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-stone-200 space-y-1">
          <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">Hon. Umar Yusuf</span>
          <strong className="text-2xl font-extrabold text-[#103C2E] block">{totalDanmajeVotes.toLocaleString()}</strong>
          <span className="text-xs text-emerald-600 font-bold">Candidate Votes</span>
        </div>
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-stone-200 space-y-1">
          <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">Main Opponent</span>
          <strong className="text-2xl font-extrabold text-red-700 block">{totalOpponentVotes.toLocaleString()}</strong>
          <span className="text-xs text-stone-500">Opponent Votes</span>
        </div>
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-stone-200 space-y-1">
          <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">Net Margin / Lead</span>
          <strong className={`text-2xl font-extrabold block ${netMargin >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
            {netMargin >= 0 ? `+${netMargin.toLocaleString()}` : netMargin.toLocaleString()}
          </strong>
          <span className="text-xs text-stone-500">Total Valid: {totalValid.toLocaleString()}</span>
        </div>
      </div>

      {/* Agent Link Generator Modal */}
      {showNewAgentModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-[#C6A15B]">
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <h4 className="font-bold text-[#103C2E] text-lg uppercase">Generate Unique Agent Link</h4>
              <button onClick={() => setShowNewAgentModal(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateAgent} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#103C2E] block mb-1 uppercase">Local Government</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Yabo"
                    value={newLGA}
                    onChange={(e) => setNewLGA(e.target.value)}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#103C2E] block mb-1 uppercase">Constituency Ward</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Yabo Central Ward"
                    value={newWard}
                    onChange={(e) => setNewWard(e.target.value)}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#103C2E] block mb-1 uppercase">Polling Unit Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Town Hall PU 001"
                    value={newPUName}
                    onChange={(e) => setNewPUName(e.target.value)}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#103C2E] block mb-1 uppercase">Polling Unit Code</label>
                  <input
                    type="text"
                    placeholder="e.g. 01/05/02/001"
                    value={newPUCode}
                    onChange={(e) => setNewPUCode(e.target.value)}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#103C2E] block mb-1 uppercase">Agent Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aliyu Dan-Yabo"
                    value={newAgentName}
                    onChange={(e) => setNewAgentName(e.target.value)}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#103C2E] block mb-1 uppercase">Agent Phone Number</label>
                  <input
                    type="text"
                    placeholder="e.g. +234 803 123 4567"
                    value={newAgentPhone}
                    onChange={(e) => setNewAgentPhone(e.target.value)}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#103C2E] block mb-1 uppercase">
                  Agent Access Password (Optional - leave blank to auto-generate)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 123456 or leave blank for secure auto-code"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium font-mono text-xs"
                />
                <span className="text-[10px] text-stone-500 mt-0.5 block">
                  You can set an easy memorable password for the polling unit agent or leave blank.
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowNewAgentModal(false)}
                  className="bg-stone-100 hover:bg-stone-200 text-stone-700 px-4 py-2.5 rounded-xl font-bold uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#103C2E] hover:bg-[#09291F] text-white px-6 py-2.5 rounded-xl font-bold uppercase shadow cursor-pointer"
                >
                  Generate Agent Credentials & Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Generated Agent Credentials & WhatsApp Instant Dispatch Modal */}
      {justCreatedAgent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border-2 border-[#25D366]">
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-['Manrope'] font-extrabold text-[#103C2E] text-base uppercase">
                    Agent Credentials Generated
                  </h4>
                  <span className="text-[11px] text-stone-500 font-medium">Ready for direct WhatsApp DM transmission</span>
                </div>
              </div>
              <button onClick={() => setJustCreatedAgent(null)} className="text-stone-400 hover:text-stone-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-stone-500 font-bold uppercase text-[10px]">Accredited Agent:</span>
                <span className="font-extrabold text-[#103C2E] text-sm">{justCreatedAgent.agentName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-500 font-bold uppercase text-[10px]">Phone Number:</span>
                <span className="font-mono font-bold text-stone-800">{justCreatedAgent.phone}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-500 font-bold uppercase text-[10px]">Polling Unit:</span>
                <span className="font-bold text-stone-800">{justCreatedAgent.pollingUnitName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-500 font-bold uppercase text-[10px]">Ward & LGA:</span>
                <span className="text-stone-700">{justCreatedAgent.ward} • {justCreatedAgent.localGovernment}</span>
              </div>
              <div className="pt-2 border-t border-stone-200 flex justify-between items-center">
                <div>
                  <span className="text-stone-500 text-[10px] uppercase font-bold block">Assigned Token & Password:</span>
                  <span className="font-mono text-emerald-800 font-bold text-xs select-all">
                    {justCreatedAgent.token} / {justCreatedAgent.password}
                  </span>
                </div>
                <button
                  onClick={() => copyDirectAgentLink(justCreatedAgent)}
                  className="bg-stone-200 hover:bg-stone-300 text-stone-800 px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase cursor-pointer"
                >
                  Copy Link
                </button>
              </div>
            </div>

            {/* Direct WhatsApp Transmission Action */}
            <div className="space-y-3 pt-1">
              <a
                href={getAgentWhatsAppUrl(justCreatedAgent)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  window.open(getAgentWhatsAppUrl(justCreatedAgent), '_blank');
                  e.preventDefault();
                }}
                className="w-full bg-[#25D366] hover:bg-[#1EBE5D] text-white py-4 px-4 rounded-2xl font-black text-xs sm:text-sm uppercase flex items-center justify-center gap-2.5 shadow-xl transition active:scale-[0.98] cursor-pointer tracking-wider border-2 border-white/40"
              >
                <MessageCircle className="w-5 h-5 fill-current shrink-0" />
                <span className="text-center">SEND LINK & LOGIN CREDENTIALS DIRECTLY TO AGENT'S WHATSAPP DM ({justCreatedAgent.phone})</span>
              </a>

              <div className="flex gap-2">
                <button
                  onClick={() => copyDirectAgentLink(justCreatedAgent)}
                  className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-800 py-2.5 px-4 rounded-xl font-bold text-xs uppercase transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5 text-stone-600" />
                  <span>Copy 1-Click Link Only</span>
                </button>
                <button
                  onClick={() => setJustCreatedAgent(null)}
                  className="bg-[#103C2E] hover:bg-[#09291F] text-white py-2.5 px-5 rounded-xl font-bold text-xs uppercase transition cursor-pointer"
                >
                  Close & View Table
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assigned Agents Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden space-y-4 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-stone-100 pb-3">
          <div>
            <h4 className="font-bold text-[#103C2E] text-base uppercase">Polling Unit Agents & Secure Submission Links</h4>
            <span className="text-xs text-stone-500 font-medium">Click WhatsApp DM to send credentials directly to your agent or copy 1-click link.</span>
          </div>
          <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full font-bold">
            Master Campaign Key: <code>DANMAJE2026</code>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#103C2E] text-white uppercase font-bold">
              <tr>
                <th className="p-3.5">Location & PU</th>
                <th className="p-3.5">Agent Details</th>
                <th className="p-3.5">Access Credentials</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">1-Click Submission & WhatsApp</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {agents.map(ag => {
                const tokenVal = ag.token || ag.uniqueToken;
                const hasReport = electionReports.find(r => r.linkId === tokenVal || r.linkId === ag.id);
                return (
                  <tr key={ag.id} className="hover:bg-stone-50 transition">
                    <td className="p-3.5">
                      <strong className="text-[#103C2E] text-xs block">{ag.pollingUnitName}</strong>
                      <span className="text-stone-500 text-[11px] block">{ag.localGovernment} • {ag.ward || ag.wardName}</span>
                      <span className="font-mono text-[10px] text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60 inline-block mt-0.5">
                        Code: {ag.pollingUnitCode}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className="font-bold text-stone-900 block text-xs">{ag.agentName}</span>
                      <span className="text-stone-500 text-[11px] font-mono">{ag.phone}</span>
                    </td>
                    <td className="p-3.5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 bg-stone-100 px-2 py-1 rounded font-mono text-[10px]">
                          <span className="text-stone-500">User:</span>
                          <strong className="text-stone-900 select-all">{tokenVal}</strong>
                          <button
                            onClick={() => copyCredential(tokenVal, ag.id, 'user')}
                            className="p-1 hover:bg-stone-200 rounded cursor-pointer ml-auto"
                            title="Copy Username/Token"
                          >
                            <Copy className="w-3 h-3 text-stone-600" />
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5 bg-emerald-50 px-2 py-1 rounded border border-emerald-200/80 font-mono text-[10px]">
                          <span className="text-emerald-700">Pass:</span>
                          <strong className="text-emerald-950 select-all">{ag.password}</strong>
                          <button
                            onClick={() => copyCredential(ag.password, ag.id, 'pass')}
                            className="p-1 hover:bg-emerald-200 rounded cursor-pointer ml-auto"
                            title="Copy Password"
                          >
                            <Copy className="w-3 h-3 text-emerald-700" />
                          </button>
                        </div>
                        {copiedToken === ag.id && (
                          <span className="text-[10px] text-emerald-700 font-bold block">
                            {copiedType === 'user' ? 'Token Copied!' : 'Password Copied!'}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3.5">
                      {hasReport ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                          Reported
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px] uppercase inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                          Awaiting
                        </span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <div className="space-y-1.5">
                        <a
                          href={getAgentWhatsAppUrl(ag)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-[#25D366] hover:bg-[#1EBE5D] text-white px-3 py-1.5 rounded-xl font-bold text-[11px] flex items-center gap-1.5 shadow-sm transition inline-flex w-fit cursor-pointer uppercase tracking-wider"
                          title="Open WhatsApp chat and send login credentials directly in DM"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-current" />
                          <span>WHATSAPP DM</span>
                        </a>

                        <button
                          onClick={() => copyDirectAgentLink(ag)}
                          className="bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white px-3 py-1.5 rounded-xl font-bold text-[11px] flex items-center gap-1.5 shadow-xs transition cursor-pointer w-fit"
                          title="Copy Direct Link with Credentials Pre-loaded for WhatsApp/SMS"
                        >
                          <Copy className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>COPY 1-CLICK LINK</span>
                        </button>
                        {copiedToken === tokenVal && copiedType === 'link' && (
                          <span className="text-[10px] text-emerald-700 font-bold block">
                            1-Click Link Copied to Clipboard!
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3.5 text-right space-x-1.5">
                      <button
                        onClick={() => handleTestLogin(ag)}
                        className="bg-[#103C2E] hover:bg-[#09291F] text-white px-2.5 py-1.5 rounded-xl text-[10px] font-bold uppercase transition cursor-pointer shadow-xs inline-flex items-center gap-1"
                        title="Directly test agent portal login for this polling unit"
                      >
                        <span>Test Portal</span>
                      </button>
                      <button
                        onClick={() => {
                          setAgents(agents.filter(a => a.id !== ag.id));
                          setElectionReports(electionReports.filter(r => r.linkId !== tokenVal && r.linkId !== ag.id));
                        }}
                        className="text-rose-600 hover:text-rose-800 p-1.5 hover:bg-rose-50 rounded-lg transition"
                        title="Delete Agent Link"
                      >
                        <Trash2 className="w-4 h-4 inline" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Submitted Polling Unit Reports Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden space-y-4 p-6">
        <div className="flex justify-between items-center border-b border-stone-100 pb-3">
          <h4 className="font-bold text-[#103C2E] text-base uppercase">Compiled Polling Unit Election Results</h4>
          <button
            onClick={() => window.print()}
            className="bg-stone-100 hover:bg-stone-200 text-stone-800 px-4 py-2 rounded-xl text-xs font-bold uppercase flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print Compiled Result</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 uppercase font-bold border-b border-stone-200">
              <tr>
                <th className="p-3">Polling Unit & Ward</th>
                <th className="p-3">Agent</th>
                <th className="p-3 text-center">Accredited</th>
                <th className="p-3 text-center">Hon. Umar Yusuf</th>
                <th className="p-3 text-center">Opponent</th>
                <th className="p-3 text-center">Margin</th>
                <th className="p-3">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {electionReports.map(rep => {
                const margin = rep.danmajeVotes - rep.opponentVotes;
                return (
                  <tr key={rep.id} className="hover:bg-stone-50">
                    <td className="p-3">
                      <strong className="text-[#103C2E] block">{rep.pollingUnitName}</strong>
                      <span className="text-stone-500 text-[11px]">{rep.ward} • {rep.pollingUnitCode}</span>
                    </td>
                    <td className="p-3">
                      <span className="font-bold text-stone-800 block">{rep.agentName}</span>
                      <span className="text-stone-500 text-[11px]">{rep.phone}</span>
                    </td>
                    <td className="p-3 text-center font-bold text-stone-700">{rep.totalAccreditedVoters}</td>
                    <td className="p-3 text-center font-extrabold text-[#103C2E] text-sm">{rep.danmajeVotes}</td>
                    <td className="p-3 text-center font-extrabold text-red-700 text-sm">{rep.opponentVotes}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2.5 py-1 rounded-full font-extrabold text-[11px] ${margin >= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                        {margin >= 0 ? `+${margin}` : margin}
                      </span>
                    </td>
                    <td className="p-3 text-stone-600 text-[11px] italic max-w-xs truncate">
                      {rep.notes || 'No remarks'}
                    </td>
                  </tr>
                );
              })}
              {electionReports.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-stone-500">
                    No election reports submitted by agents yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
