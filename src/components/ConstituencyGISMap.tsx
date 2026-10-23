import React, { useState } from 'react';
import { MapPin, Building2, Search, CheckCircle2, Navigation, Layers } from 'lucide-react';
import { Project } from '../types';

interface Props {
  projects: Project[];
  currentLang: string;
}

export const ConstituencyGISMap: React.FC<Props> = ({ projects, currentLang }) => {
  const [selectedLGA, setSelectedLGA] = useState<'All' | 'Yabo' | 'Shagari'>('All');
  const [selectedWard, setSelectedWard] = useState('All');
  const [selectedProj, setSelectedProj] = useState<Project | null>(projects[0] || null);

  const yaboWards = ['Yabo Central', 'Birnin Tudu', 'Kilgori', 'Kuchi', 'Badau', 'Romawa'];
  const shagariWards = ['Shagari Central', 'Dandin Mahe', 'Gangara', 'Lambu', 'Tapkin Alkali', 'Yari'];

  const filteredProjects = projects.filter(p => {
    if (selectedLGA === 'Yabo' && !p.location.toLowerCase().includes('yabo')) return false;
    if (selectedLGA === 'Shagari' && !p.location.toLowerCase().includes('shagari')) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-8 animate-fadeIn">
      {/* Banner */}
      <div className="bg-gradient-to-br from-[#09291F] via-[#103C2E] to-[#0A261E] text-white rounded-3xl p-8 sm:p-12 shadow-2xl space-y-4 border border-emerald-500/30 relative overflow-hidden">
        <div className="flex items-center gap-3">
          <span className="inline-block text-xs font-extrabold uppercase tracking-widest text-emerald-200 bg-emerald-900/60 px-3 py-1 rounded-full border border-emerald-500/40">
            Interactive GIS & Constituency Project Map
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-['Manrope'] text-white">
          YABO / SHAGARI GIS INFRASTRUCTURE MAPPING
        </h1>
        <p className="text-stone-300 text-sm sm:text-base max-w-2xl leading-relaxed font-light">
          Geographically inspect verified constituency projects, solar water boreholes, school renovations, and road networks across all wards in Yabo and Shagari Local Government Areas.
        </p>

        {/* Filter Pills */}
        <div className="pt-2 flex flex-wrap gap-3 items-center">
          {(['All', 'Yabo', 'Shagari'] as const).map(lga => (
            <button
              key={lga}
              onClick={() => setSelectedLGA(lga)}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase transition cursor-pointer shadow-sm ${
                selectedLGA === lga
                  ? 'bg-white text-[#09291F] border border-emerald-400'
                  : 'bg-emerald-950/70 text-emerald-200 border border-emerald-500/40 hover:bg-emerald-900'
              }`}
            >
              {lga === 'All' ? 'All LGAs (Yabo & Shagari)' : `${lga} LGA`}
            </button>
          ))}
        </div>
      </div>

      {/* GIS Grid / Map Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Interactive Ward Map Grid Simulation */}
        <div className="lg:col-span-7 bg-[#072118] p-6 sm:p-8 rounded-3xl shadow-2xl border border-emerald-500/40 text-white space-y-6 relative overflow-hidden">
          <div className="flex justify-between items-center border-b border-emerald-500/30 pb-4">
            <div>
              <h3 className="font-['Manrope'] font-extrabold text-lg uppercase text-[#D4AF37]">
                Constituency Geographic Grid
              </h3>
              <span className="text-xs text-stone-300">Click any project marker to inspect GIS coordinates & status</span>
            </div>
            <span className="bg-emerald-900/80 text-emerald-200 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/40">
              {filteredProjects.length} Verified Sites
            </span>
          </div>

          {/* Visual Map Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2">
            {filteredProjects.map((proj, idx) => (
              <div
                key={proj.id}
                onClick={() => setSelectedProj(proj)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                  selectedProj?.id === proj.id
                    ? 'bg-emerald-900/90 border-[#D4AF37] shadow-xl ring-2 ring-[#D4AF37]/50'
                    : 'bg-[#0A261E] border-emerald-500/30 hover:border-emerald-400'
                }`}
              >
                <div className="flex justify-between items-center text-[10px] font-bold uppercase">
                  <span className="text-emerald-300">{proj.category}</span>
                  <span className={`px-2 py-0.5 rounded ${proj.status === 'Completed' ? 'bg-emerald-700 text-white' : 'bg-amber-600 text-white'}`}>
                    {proj.status}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-white">{proj.title}</h4>
                <div className="flex items-center gap-1.5 text-xs text-stone-300">
                  <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                  <span>{proj.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Selected Project GIS Telemetry & Details */}
        <div className="lg:col-span-5 space-y-6">
          {selectedProj ? (
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-stone-200 space-y-5">
              <div className="aspect-video rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 relative">
                <img
                  src={selectedProj.images[0] || 'https://images.unsplash.com/photo-1541888946425-d0fbb18f764c?auto=format&fit=crop&q=80&w=800'}
                  alt={selectedProj.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-[#103C2E]/90 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  {selectedProj.status}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">{selectedProj.category}</span>
                <h3 className="font-['Manrope'] font-extrabold text-xl text-[#103C2E]">{selectedProj.title}</h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-light">{selectedProj.description}</p>
              </div>

              <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-stone-500 font-bold uppercase">GIS Latitude:</span>
                  <span className="text-[#103C2E] font-bold">13.0622° N, 5.2330° E</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500 font-bold uppercase">Location / Ward:</span>
                  <span className="text-[#103C2E] font-bold">{selectedProj.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500 font-bold uppercase">Allocation / Budget:</span>
                  <span className="text-emerald-800 font-bold">{selectedProj.expenditure || 'Fully Funded'}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-stone-200 text-center text-stone-500">
              Select a project from the GIS map grid to inspect geographic telemetry.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
