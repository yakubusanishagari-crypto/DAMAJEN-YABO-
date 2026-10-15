import React, { useState } from 'react';
import { LegislativeRecord } from '../types';
import { 
  Award, FileText, Calendar, CheckCircle, Clock, ExternalLink, Search, 
  Landmark, Download, Share2, ChevronRight, X, UserCheck, Shield
} from 'lucide-react';
import { Language, t, Translations } from '../utils/i18n';

interface Props {
  legislative: LegislativeRecord[];
  currentLang?: Language;
  translations?: Translations;
}

export const LegislativePage: React.FC<Props> = ({ legislative, currentLang = 'en', translations }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [activeGazette, setActiveGazette] = useState<LegislativeRecord | null>(null);

  const categories = ['All', 'Bill', 'Motion', 'Committee', 'Parliamentary Question'];
  const statuses = ['All', 'Passed', 'Pending', 'Introduced'];

  const filteredRecords = legislative.filter(l => {
    const matchesSearch = l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          l.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === 'All' || l.category === selectedCategory;
    const matchesStat = selectedStatus === 'All' || l.status === selectedStatus;
    return matchesSearch && matchesCat && matchesStat;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#09291F] via-[#103C2E] to-[#0A261E] text-white rounded-3xl p-8 sm:p-14 shadow-xl space-y-4 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#C6A15B]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#C6A15B]/20 border border-[#C6A15B]/40 text-xs font-bold uppercase tracking-wider text-[#C6A15B]">
            <Landmark className="w-3.5 h-3.5" />
            <span>National Assembly of Nigeria</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-['Manrope']">
            Legislative Work & Bills Tracker
          </h1>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-light">
            An open parliamentary registry documenting bills sponsored, substantive motions moved, and committee oversight led by Hon. Umar Yusuf (Danmaje Yabo) at the House of Representatives.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search bills, motions, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#103C2E] transition-colors"
          />
        </div>

        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#103C2E] transition-colors text-stone-700"
          >
            {categories.map(c => (
              <option key={c} value={c}>{c === 'All' ? 'All Parliamentary Categories' : c}</option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#103C2E] transition-colors text-stone-700"
          >
            {statuses.map(s => (
              <option key={s} value={s}>{s === 'All' ? 'All Legislative Statuses' : s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Legislative Cards with Stages Progression */}
      <div className="space-y-6">
        {filteredRecords.length === 0 ? (
          <div className="py-16 text-center text-stone-500 bg-white rounded-2xl border border-stone-200">
            <p className="text-lg font-semibold text-[#103C2E]">No legislative records found.</p>
            <p className="text-xs text-stone-500 mt-1">Try adjusting your keyword search or category filters.</p>
          </div>
        ) : (
          filteredRecords.map((record) => (
            <div 
              key={record.id} 
              className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-stone-200 hover:border-[#C6A15B]/60 transition-all duration-300 space-y-5"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-stone-100 pb-4">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                  <span className="bg-[#103C2E]/10 text-[#103C2E] px-2.5 py-1 rounded-md font-bold">
                    {record.category}
                  </span>
                  <span aria-hidden="true" className="text-stone-300">·</span>
                  <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                    record.status === 'Passed' ? 'bg-emerald-100 text-emerald-800' :
                    record.status === 'Pending' ? 'bg-amber-100 text-amber-800' :
                    record.status === 'Introduced' ? 'bg-blue-100 text-blue-800' : 'bg-stone-100 text-stone-700'
                  }`}>
                    {record.status}
                  </span>
                  <span aria-hidden="true" className="text-stone-300">·</span>
                  <span className="text-stone-500 flex items-center gap-1 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-[#C6A15B]" /> {record.date}
                  </span>
                </div>

                <button
                  onClick={() => setActiveGazette(record)}
                  className="bg-[#103C2E] hover:bg-[#09291F] text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow transition-all cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-[#C6A15B]" /> View Gazette Docket
                </button>
              </div>

              <div className="space-y-3">
                <h3 className="font-['Manrope'] font-bold text-xl sm:text-2xl text-[#103C2E] leading-snug">
                  {record.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed max-w-4xl">
                  {record.description}
                </p>

                {record.coSponsors && record.coSponsors.length > 0 && (
                  <div className="text-xs text-stone-600 flex items-center gap-2 pt-1">
                    <UserCheck className="w-3.5 h-3.5 text-[#C6A15B]" />
                    <span>Co-sponsors: <strong>{record.coSponsors.join(', ')}</strong></span>
                  </div>
                )}
              </div>

              {/* Parliamentary Stage Timeline */}
              <div className="pt-3 border-t border-stone-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block mb-2">
                  Parliamentary Progress Timeline
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-lg p-2.5 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <p className="font-bold">1st Reading</p>
                      <p className="text-[10px] text-emerald-700">Formal Presentation</p>
                    </div>
                  </div>

                  <div className={`p-2.5 rounded-lg flex items-center gap-2 border ${
                    record.status === 'Passed' || record.status === 'Pending' 
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-200' 
                      : 'bg-stone-50 text-stone-400 border-stone-200'
                  }`}>
                    <CheckCircle className={`w-4 h-4 shrink-0 ${record.status === 'Passed' || record.status === 'Pending' ? 'text-emerald-600' : 'text-stone-300'}`} />
                    <div>
                      <p className="font-bold">2nd Reading</p>
                      <p className="text-[10px]">Floor Debate</p>
                    </div>
                  </div>

                  <div className={`p-2.5 rounded-lg flex items-center gap-2 border ${
                    record.status === 'Passed'
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-200' 
                      : record.status === 'Pending'
                      ? 'bg-amber-50 text-amber-900 border-amber-200 animate-pulse'
                      : 'bg-stone-50 text-stone-400 border-stone-200'
                  }`}>
                    <Clock className={`w-4 h-4 shrink-0 ${record.status === 'Passed' ? 'text-emerald-600' : record.status === 'Pending' ? 'text-amber-600' : 'text-stone-300'}`} />
                    <div>
                      <p className="font-bold">Committee Stage</p>
                      <p className="text-[10px]">Public Hearing</p>
                    </div>
                  </div>

                  <div className={`p-2.5 rounded-lg flex items-center gap-2 border ${
                    record.status === 'Passed'
                      ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                      : 'bg-stone-50 text-stone-400 border-stone-200'
                  }`}>
                    <CheckCircle className={`w-4 h-4 shrink-0 ${record.status === 'Passed' ? 'text-emerald-600' : 'text-stone-300'}`} />
                    <div>
                      <p className="font-bold">3rd Reading & Assent</p>
                      <p className="text-[10px]">Final Enactment</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Gazette Docket Modal */}
      {activeGazette && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#FAF9F5] w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-[#C6A15B]/40 max-h-[90vh] flex flex-col">
            <div className="bg-[#103C2E] text-white p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#C6A15B] text-[#09291F] flex items-center justify-center font-bold">
                  <Landmark className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-['Manrope']">Official Parliamentary Gazette Docket</h3>
                  <p className="text-xs text-white/80">National Assembly • House of Representatives</p>
                </div>
              </div>
              <button 
                onClick={() => setActiveGazette(null)} 
                className="text-white/80 hover:text-white p-2 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-stone-800">
              <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-2">
                <span className="text-xs font-bold text-[#C6A15B] uppercase tracking-wider">{activeGazette.category} Reference</span>
                <h4 className="font-bold text-lg text-[#103C2E] font-['Manrope']">{activeGazette.title}</h4>
                <p className="text-xs text-stone-600">Lead Sponsor: <strong>Hon. Umar Yusuf (Danmaje Yabo)</strong></p>
                <p className="text-xs text-stone-600">Date Gazetted: <strong>{activeGazette.date}</strong></p>
                <p className="text-xs text-stone-600">Official Source: <strong>{activeGazette.source || 'Votes & Proceedings, House of Representatives'}</strong></p>
              </div>

              <div className="space-y-2">
                <h5 className="font-bold text-sm text-[#103C2E]">Substantive Summary</h5>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed bg-white p-4 rounded-xl border border-stone-200">
                  {activeGazette.description}
                </p>
              </div>

              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-1">
                <span className="font-bold flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-emerald-700" /> Public Verification Status
                </span>
                <p>This entry corresponds to verified legislative proceedings in the National Assembly Journal. Constituents may request full printed transcripts from the constituency liaison office.</p>
              </div>
            </div>

            <div className="bg-stone-100 p-4 border-t border-stone-200 flex justify-between items-center">
              <button
                onClick={() => {
                  const blob = new Blob([JSON.stringify(activeGazette, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `gazette_${activeGazette.id}.json`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="bg-[#C6A15B] hover:bg-[#b59048] text-[#09291F] font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow cursor-pointer"
              >
                <Download className="w-4 h-4" /> Download Official Record
              </button>

              <button
                onClick={() => setActiveGazette(null)}
                className="bg-[#103C2E] text-white px-5 py-2 rounded-xl font-bold text-xs hover:bg-[#09291F] transition cursor-pointer"
              >
                Close Docket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
