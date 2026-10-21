import React, { useState } from 'react';
import { Download, Printer, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';
import { LegislativeRecord, Project, EmpowermentProgram } from '../types';

interface Props {
  legislative: LegislativeRecord[];
  projects: Project[];
  programs: EmpowermentProgram[];
  currentLang: string;
}

export const ParliamentaryGazetteExporter: React.FC<Props> = ({ legislative, projects, programs, currentLang }) => {
  const [exporting, setExporting] = useState(false);

  const handleGenerateGazette = () => {
    setExporting(true);
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Official_Parliamentary_Gazette_2026_Hon_Umar_Yusuf</title>
  <style>
    @page { size: A4 portrait; margin: 20mm; }
    body { font-family: 'Times New Roman', Times, serif; color: #103C2E; background: #fff; margin: 0; padding: 20px; line-height: 1.6; }
    .header { text-align: center; border-bottom: 4px double #103C2E; padding-bottom: 15px; margin-bottom: 25px; }
    .title-republic { font-size: 13px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; color: #103C2E; margin: 0; }
    .title-nass { font-size: 18px; font-weight: 900; color: #103C2E; text-transform: uppercase; margin: 4px 0; }
    .title-office { font-size: 14px; font-weight: bold; color: #09291F; text-transform: uppercase; margin: 2px 0; }
    .gazette-badge { font-size: 16px; font-weight: 900; color: #fff; background: #103C2E; display: inline-block; padding: 8px 30px; border-radius: 4px; margin-top: 15px; letter-spacing: 1px; text-transform: uppercase; }
    h2 { font-size: 16px; font-weight: bold; color: #103C2E; border-bottom: 1px solid #103C2E; padding-bottom: 4px; margin-top: 25px; text-transform: uppercase; }
    p, li { font-size: 13px; text-align: justify; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
    th, td { border: 1px solid #cbd5e1; padding: 8px; text-align: left; }
    th { background: #103C2E; color: #fff; text-transform: uppercase; font-size: 11px; }
    .footer { margin-top: 40px; border-top: 1px solid #94a3b8; padding-top: 15px; display: flex; justify-content: space-between; font-size: 11px; font-family: sans-serif; }
  </style>
</head>
<body>
  <div class="header">
    <p class="title-republic">FEDERAL REPUBLIC OF NIGERIA</p>
    <p class="title-nass">HOUSE OF REPRESENTATIVES • NATIONAL ASSEMBLY, ABUJA</p>
    <p class="title-office">Office of Hon. (Dr.) Umar Yusuf Yabo (Dan Majen Yabo)</p>
    <p style="font-size: 11px; color: #475569; margin: 2px 0;">Member Representing Yabo / Shagari Federal Constituency, Sokoto State</p>
    <div class="gazette-badge">OFFICIAL PARLIAMENTARY & CONSTITUENCY GAZETTE (2026)</div>
  </div>

  <p>
    <strong>EXECUTIVE SUMMARY:</strong> This official legislative gazette compiles the verified bills sponsored, motions moved, constituency projects executed, and empowerment allocations facilitated by Hon. Umar Yusuf (Danmaje Yabo) during the 10th National Assembly session.
  </p>

  <h2>1. Key Legislative Bills & Motions ({legislative.length} Recorded)</h2>
  <table>
    <thead>
      <tr>
        <th>Title</th>
        <th>Category</th>
        <th>Status</th>
        <th>Date</th>
      </tr>
    </thead>
    <tbody>
      ${legislative.map(l => `
        <tr>
          <td><strong>${l.title}</strong></td>
          <td>${l.category}</td>
          <td><strong>${l.status}</strong></td>
          <td>${l.date}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <h2>2. Constituency Infrastructure & Development Projects ({projects.length} Executed)</h2>
  <table>
    <thead>
      <tr>
        <th>Project Title</th>
        <th>Category</th>
        <th>Location</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      ${projects.map(p => `
        <tr>
          <td><strong>${p.title}</strong></td>
          <td>${p.category}</td>
          <td>${p.location}</td>
          <td><strong>${p.status}</strong></td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <h2>3. Human Capital & Empowerment Schemes ({programs.length} Active Schemes)</h2>
  <table>
    <thead>
      <tr>
        <th>Scheme Title</th>
        <th>Category</th>
        <th>Target Beneficiaries</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      ${programs.map(pr => `
        <tr>
          <td><strong>${pr.title}</strong></td>
          <td>${pr.category}</td>
          <td>${pr.targetBeneficiaries}</td>
          <td><strong>${pr.status}</strong></td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="footer">
    <div>
      <strong>OFFICIAL PARLIAMENTARY RECORD</strong><br/>
      National Assembly Complex, Three Arms Zone, Abuja
    </div>
    <div style="text-align: right;">
      <strong>VERIFICATION SEAL</strong><br/>
      Certified True Copy • {new Date().toLocaleDateString()}
    </div>
  </div>
</body>
</html>
    `;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const w = window.open(url, '_blank');
    if (w) {
      setTimeout(() => w.print(), 800);
    }
    setExporting(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10 space-y-8 animate-fadeIn">
      {/* Banner */}
      <div className="bg-gradient-to-br from-[#09291F] via-[#103C2E] to-[#0A261E] text-white rounded-3xl p-8 sm:p-12 shadow-2xl space-y-4 border border-emerald-500/30 text-center relative overflow-hidden">
        <span className="inline-block text-xs font-extrabold uppercase tracking-widest text-emerald-200 bg-emerald-900/60 px-4 py-1.5 rounded-full border border-emerald-500/40">
          Official Parliamentary Gazette & Hansard
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-['Manrope'] text-white">
          PARLIAMENTARY SCORECARD & GAZETTE EXPORTER
        </h1>
        <p className="text-stone-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed font-light">
          Generate, preview, and print the certified true copy of the official legislative scorecard and constituency project gazette for Hon. Umar Yusuf (Danmaje Yabo).
        </p>

        <div className="pt-4 flex justify-center">
          <button
            onClick={handleGenerateGazette}
            disabled={exporting}
            className="bg-white hover:bg-emerald-50 text-[#09291F] px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-wider shadow-xl transition cursor-pointer border border-emerald-400 flex items-center gap-2.5"
          >
            <Download className="w-4 h-4 text-[#103C2E]" />
            <span>{exporting ? 'GENERATING GAZETTE...' : 'GENERATE & PRINT OFFICIAL GAZETTE PDF'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
