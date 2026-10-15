import React, { useState } from 'react';
import { EmpowermentProgram, ProgramApplication } from '../types';
import { Award, Calendar, Users, CheckCircle, X, Shield, ArrowRight, Download, FileCheck, Info } from 'lucide-react';
import { Language, t, Translations } from '../utils/i18n';

interface Props {
  programs: EmpowermentProgram[];
  currentLang?: Language;
  translations?: Translations;
}

export const EmpowermentPage: React.FC<Props> = ({ programs, currentLang = 'en', translations }) => {
  const [selectedProgram, setSelectedProgram] = useState<EmpowermentProgram | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [formData, setFormData] = useState({
    applicantName: '',
    email: '',
    phone: '',
    wardOrTown: '',
    qualifications: '',
    statement: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submissionReceipt, setSubmissionReceipt] = useState<{ id: string; ref: string; date: string } | null>(null);

  const categories = ['All', 'Agricultural Support', 'Skills Acquisition', 'Women Empowerment', 'Educational Support'];

  const filteredPrograms = programs.filter(p => {
    return selectedCategory === 'All' || p.category === selectedCategory;
  });

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProgram) return;
    setSubmitting(true);

    const refCode = `DY-${Date.now().toString().slice(-6)}`;
    const newApplication = {
      programId: selectedProgram.id,
      programTitle: selectedProgram.title,
      referenceCode: refCode,
      ...formData,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };

    try {
      await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newApplication)
      });
    } catch {
      // Local fallback
    }

    try {
      const stored = JSON.parse(localStorage.getItem('danmaje_applications') || '[]');
      stored.unshift(newApplication);
      localStorage.setItem('danmaje_applications', JSON.stringify(stored));
    } catch {
      // Storage fallback
    }

    setSubmissionReceipt({
      id: selectedProgram.id,
      ref: refCode,
      date: new Date().toISOString().split('T')[0]
    });
    setFormData({ applicantName: '', email: '', phone: '', wardOrTown: '', qualifications: '', statement: '' });
    setSubmitting(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#09291F] via-[#103C2E] to-[#0A261E] text-white rounded-3xl p-8 sm:p-14 shadow-xl space-y-4 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#C6A15B]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#C6A15B]/20 border border-[#C6A15B]/40 text-xs font-bold uppercase tracking-wider text-[#C6A15B]">
            <Users className="w-3.5 h-3.5" />
            <span>Grassroots Socio-Economic Empowerment</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-['Manrope']">
            Empowerment & Constituency Programmes
          </h1>
          <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-light">
            Direct public interventions providing subsidized dry-season agricultural inputs, youth digital skills apprenticeships, and women micro-enterprise startup capital.
          </p>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-[#103C2E] text-white shadow-sm'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Programs Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {filteredPrograms.map((program) => (
          <div 
            key={program.id} 
            className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8 flex flex-col justify-between space-y-6 hover:shadow-md transition-shadow"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="bg-[#103C2E]/10 text-[#103C2E] px-2.5 py-1 rounded-md font-bold">
                  {program.category}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full font-bold ${
                  program.status === 'Active' ? 'bg-emerald-100 text-emerald-800' :
                  program.status === 'Upcoming' ? 'bg-amber-100 text-amber-800' : 'bg-stone-100 text-stone-700'
                }`}>
                  {program.status}
                </span>
              </div>

              <h3 className="font-['Manrope'] font-bold text-xl text-[#103C2E] leading-snug">
                {program.title}
              </h3>

              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {program.description}
              </p>

              <div className="space-y-2 text-xs pt-3 border-t border-stone-100">
                <div className="flex justify-between">
                  <span className="text-stone-500">Target Beneficiaries:</span>
                  <span className="font-bold text-[#103C2E]">{program.targetBeneficiaries}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Application Deadline:</span>
                  <span className="font-bold text-rose-600">{program.deadline}</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <span className="text-xs font-bold text-[#103C2E] block">Required Verification Documents:</span>
                <ul className="list-disc list-inside text-xs text-stone-600 space-y-1">
                  {program.requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              onClick={() => { setSelectedProgram(program); setSubmissionReceipt(null); }}
              className="w-full bg-[#103C2E] hover:bg-[#09291F] text-white py-3 rounded-xl font-bold text-xs sm:text-sm shadow transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Apply Online for Programme</span>
              <ArrowRight className="w-4 h-4 text-[#C6A15B]" />
            </button>
          </div>
        ))}
      </div>

      {/* Application Modal Workflow */}
      {selectedProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#FAF9F5] w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-[#C6A15B]/40 max-h-[90vh] flex flex-col">
            <div className="bg-[#103C2E] text-white p-6 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#C6A15B] uppercase tracking-wider">Official Application Desk</span>
                <h3 className="text-lg font-bold font-['Manrope'] mt-1">{selectedProgram.title}</h3>
              </div>
              <button 
                onClick={() => setSelectedProgram(null)} 
                className="text-white/80 hover:text-white p-2 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              {submissionReceipt ? (
                <div className="bg-white border border-emerald-200 text-stone-800 p-8 rounded-2xl text-center space-y-5 shadow-sm">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto text-emerald-700">
                    <FileCheck className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-xl font-['Manrope'] text-emerald-900">Application Acknowledged</h4>
                    <p className="text-xs text-stone-600">Your application has been registered with the Constituency Verification Committee.</p>
                  </div>

                  <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs space-y-2 text-left">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Tracking Reference:</span>
                      <strong className="text-[#103C2E] font-mono">{submissionReceipt.ref}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Programme:</span>
                      <strong className="text-[#103C2E]">{selectedProgram.title}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Submission Date:</span>
                      <strong className="text-[#103C2E]">{submissionReceipt.date}</strong>
                    </div>
                  </div>

                  <p className="text-[11px] text-stone-500 leading-relaxed">
                    Please retain this reference code. Shortlisted applicants will receive an SMS and WhatsApp notification from the constituency liaison desk.
                  </p>

                  <button
                    onClick={() => setSelectedProgram(null)}
                    className="w-full bg-[#103C2E] text-white py-3 rounded-xl font-bold text-xs sm:text-sm hover:bg-[#09291F] transition cursor-pointer"
                  >
                    Done & Return
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplySubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#103C2E]">Full Legal Name (as on PVC / National ID)</label>
                    <input
                      type="text"
                      required
                      value={formData.applicantName}
                      onChange={(e) => setFormData({...formData, applicantName: e.target.value})}
                      placeholder="e.g. Ibrahim Abubakar Yabo"
                      className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#103C2E]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#103C2E]">Email Address</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="yourname@gmail.com"
                        className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#103C2E]"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#103C2E]">Phone (WhatsApp enabled)</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        placeholder="+234 803 000 0000"
                        className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#103C2E]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#103C2E]">Ward / Community Residence</label>
                    <input
                      type="text"
                      required
                      value={formData.wardOrTown}
                      onChange={(e) => setFormData({...formData, wardOrTown: e.target.value})}
                      placeholder="e.g. Yabo Central Ward or Shagari South"
                      className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#103C2E]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#103C2E]">Cooperative ID or Educational Qualification</label>
                    <input
                      type="text"
                      required
                      value={formData.qualifications}
                      onChange={(e) => setFormData({...formData, qualifications: e.target.value})}
                      placeholder="e.g. Sokoto Rice Farmers Cooperative Member #248"
                      className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#103C2E]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#103C2E]">How will this programme support your livelihood?</label>
                    <textarea
                      rows={3}
                      required
                      value={formData.statement}
                      onChange={(e) => setFormData({...formData, statement: e.target.value})}
                      placeholder="Explain your farming plan, business need, or vocational skill aspiration..."
                      className="w-full px-4 py-2.5 bg-white border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#103C2E]"
                    ></textarea>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-[#103C2E] hover:bg-[#09291F] text-white py-3.5 rounded-xl font-bold text-xs sm:text-sm shadow transition cursor-pointer"
                    >
                      {submitting ? 'Submitting Application...' : 'Submit Application to Liaison Desk'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
