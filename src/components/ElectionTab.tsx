import React, { useState } from 'react';
import { PollingUnitAgentLink, ElectionReport } from '../types';
import { Plus, X, Trash2, Copy, Printer } from 'lucide-react';

interface Props {
  agents: PollingUnitAgentLink[];
  setAgents: React.Dispatch<React.SetStateAction<PollingUnitAgentLink[]>>;
  electionReports: ElectionReport[];
  setElectionReports: React.Dispatch<React.SetStateAction<ElectionReport[]>>;
}

export const ElectionTab: React.FC<Props> = ({ agents, setAgents, electionReports, setElectionReports }) => {
  const [showNewAgentModal, setShowNewAgentModal] = useState(false);
  const [newLGA, setNewLGA] = useState('');
  const [newWard, setNewWard] = useState('');
  const [newPUName, setNewPUName] = useState('');
  const [newPUCode, setNewPUCode] = useState('');
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentPhone, setNewAgentPhone] = useState('');
  const [copiedToken, setCopiedToken] = useState('');

  const totalAssigned = agents.length;
  const totalReported = electionReports.length;
  const totalDanmajeVotes = electionReports.reduce((acc, r) => acc + r.danmajeVotes, 0);
  const totalOpponentVotes = electionReports.reduce((acc, r) => acc + r.opponentVotes, 0);
  const netMargin = totalDanmajeVotes - totalOpponentVotes;
  const totalValid = electionReports.reduce((acc, r) => acc + r.totalValidVotes, 0);

  const handleCreateAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLGA || !newWard || !newPUName || !newAgentName) return;
    const token = `${newWard.toLowerCase().replace(/\s+/g, '-')}-${Math.random().toString(36).substring(2, 7)}`;
    const password = Math.random().toString(36).substring(2, 10);
    const newAg: PollingUnitAgentLink = {
      id: `ag-${Date.now()}`,
      uniqueToken: token,
      token,
      password,
      localGovernment: newLGA,
      ward: newWard,
      pollingUnitName: newPUName,
      pollingUnitCode: newPUCode || '01/05/00/000',
      agentName: newAgentName,
      phone: newAgentPhone || '+234 803 000 0000',
      status: 'PENDING',
      isUsed: false,
      createdAt: new Date().toLocaleString()
    };
    const updatedAgents = [newAg, ...agents];
    setAgents(updatedAgents);
    localStorage.setItem('danmaje_agent_links', JSON.stringify(updatedAgents));
    setShowNewAgentModal(false);
    setNewLGA('');
    setNewWard('');
    setNewPUName('');
    setNewPUCode('');
    setNewAgentName('');
    setNewAgentPhone('');
  };

  const copyAgentLink = (token: string) => {
    const link = `${window.location.origin}/?agent_token=${token}`;
    navigator.clipboard.writeText(link);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(''), 3000);
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
                  <label className="font-bold text-[#103C2E] block mb-1 uppercase">Agent Full Name</label>
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
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowNewAgentModal(false)}
                  className="bg-stone-100 hover:bg-stone-200 text-stone-700 px-4 py-2.5 rounded-xl font-bold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#103C2E] hover:bg-[#09291F] text-white px-6 py-2.5 rounded-xl font-bold uppercase shadow"
                >
                  Generate Agent Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assigned Agents Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden space-y-4 p-6">
        <div className="flex justify-between items-center border-b border-stone-100 pb-3">
          <h4 className="font-bold text-[#103C2E] text-base uppercase">Polling Unit Agents & Secure Submission Links</h4>
          <span className="text-xs text-stone-500 font-medium">Click copy link to send directly to your agent via WhatsApp or SMS.</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 text-stone-500 uppercase font-bold border-b border-stone-200">
              <tr>
                <th className="p-3">Location</th>
                <th className="p-3">Agent</th>
                <th className="p-3">Credentials</th>
                <th className="p-3">Status</th>
                <th className="p-3">Link</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {agents.map(ag => {
                const hasReport = electionReports.find(r => r.linkId === ag.token);
                return (
                  <tr key={ag.id} className="hover:bg-stone-50">
                    <td className="p-3">
                      <strong className="text-[#103C2E] block">{ag.pollingUnitName}</strong>
                      <span className="text-stone-500 text-[11px]">{ag.ward} • {ag.pollingUnitCode}</span>
                    </td>
                    <td className="p-3">
                      <span className="font-bold text-stone-800 block">{ag.agentName}</span>
                      <span className="text-stone-500 text-[11px]">{ag.phone}</span>
                    </td>
                    <td className="p-3">
                      <span className="font-mono text-[10px] text-stone-600">User: {ag.token}</span><br/>
                      <span className="font-mono text-[10px] text-stone-600">Pass: {ag.password}</span>
                    </td>
                    <td className="p-3">
                      {hasReport ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase">
                          Submitted
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px] uppercase">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="p-3 font-mono text-[11px] text-stone-600">
                      <div className="flex items-center gap-1.5">
                        <span className="truncate max-w-[120px]">/?agent_token={ag.token || ''}</span>
                        <button
                          onClick={() => copyAgentLink(ag.token || '')}
                          className="p-1.5 bg-stone-100 hover:bg-[#103C2E] hover:text-white rounded-lg transition-all"
                          title="Copy Agent Link"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        {copiedToken === ag.token && (
                          <span className="text-[10px] text-emerald-700 font-bold">Copied!</span>
                        )}
                      </div>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => {
                          setAgents(agents.filter(a => a.id !== ag.id));
                          setElectionReports(electionReports.filter(r => r.linkId !== ag.token));
                        }}
                        className="text-rose-600 hover:text-rose-800 p-1"
                        title="Delete Agent"
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
