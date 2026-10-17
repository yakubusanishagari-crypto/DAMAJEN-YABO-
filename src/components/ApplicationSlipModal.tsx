import React, { useRef } from 'react';
import { ProgramApplication } from '../types';
import { Printer, Download, X, CheckCircle2, ShieldCheck, QrCode, FileText, ArrowRight } from 'lucide-react';

interface Props {
  application: ProgramApplication;
  onClose: () => void;
  onTrack?: (ref: string) => void;
}

export const ApplicationSlipModal: React.FC<Props> = ({ application, onClose, onTrack }) => {
  const slipRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadSlip = () => {
    // Generate a standalone, printable HTML document for download
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Application Slip - ${application.referenceNumber}</title>
  <style>
    @page { size: A4 portrait; margin: 15mm; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1a2e22; background: #fff; margin: 0; padding: 20px; line-height: 1.4; }
    .header { text-align: center; border-bottom: 2px solid #103C2E; padding-bottom: 12px; margin-bottom: 20px; }
    .crest { width: 70px; height: 70px; margin: 0 auto 8px; }
    .title-republic { font-size: 13px; font-weight: 800; letter-spacing: 1.5px; color: #103C2E; text-transform: uppercase; margin: 0; }
    .title-nass { font-size: 16px; font-weight: 900; color: #103C2E; margin: 2px 0; text-transform: uppercase; }
    .title-office { font-size: 12px; font-weight: 700; color: #C6A15B; text-transform: uppercase; margin: 2px 0; }
    .title-slip { font-size: 18px; font-weight: 900; color: #09291F; background: #eaf3ee; display: inline-block; padding: 6px 20px; border-radius: 6px; margin-top: 10px; border: 1px solid #103C2E; letter-spacing: 1px; text-transform: uppercase; }
    .ref-box { display: flex; justify-content: space-between; background: #f7faf8; border: 1px dashed #103C2E; padding: 12px 16px; border-radius: 8px; margin-bottom: 20px; font-size: 13px; }
    .section-title { font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #103C2E; border-bottom: 1px solid #d8e2dc; padding-bottom: 4px; margin-top: 16px; margin-bottom: 8px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 13px; }
    .field { padding: 4px 0; }
    .field-label { font-size: 10px; font-weight: 700; color: #526359; text-transform: uppercase; }
    .field-value { font-size: 13px; font-weight: 700; color: #103C2E; }
    .statement-box { background: #fafbfc; border: 1px solid #e1e7e4; padding: 10px; border-radius: 6px; font-size: 12px; margin-top: 10px; color: #334; }
    .instructions { background: #fdfbf7; border-left: 4px solid #C6A15B; padding: 10px 14px; font-size: 11px; color: #493b1d; margin-top: 20px; border-radius: 0 6px 6px 0; }
    .footer-seal { margin-top: 30px; display: flex; justify-content: space-between; align-items: flex-end; padding-top: 15px; border-top: 1px solid #d8e2dc; }
    .stamp { border: 2px double #103C2E; padding: 8px 14px; border-radius: 8px; font-size: 10px; text-align: center; color: #103C2E; font-weight: 800; text-transform: uppercase; display: inline-block; }
    .sign-line { text-align: right; font-size: 11px; }
    .sign-line-bar { width: 180px; border-bottom: 1px solid #103C2E; margin-bottom: 4px; display: inline-block; }
    .watermark { position: fixed; top: 40%; left: 20%; font-size: 80px; color: rgba(16, 60, 46, 0.04); font-weight: 900; transform: rotate(-35deg); pointer-events: none; z-index: -1; text-transform: uppercase; }
  </style>
</head>
<body>
  <div class="watermark">DAN MAJE EMPOWERMENT</div>
  <div class="header">
    <p class="title-republic">FEDERAL REPUBLIC OF NIGERIA</p>
    <p class="title-nass">HOUSE OF REPRESENTATIVES • NATIONAL ASSEMBLY</p>
    <p class="title-office">Office of Hon. (Dr.) Umar Yusuf Yabo (Dan Majen Yabo)</p>
    <p style="font-size: 11px; color: #4b5e52; margin: 0;">Member Representing Yabo/Shagari Federal Constituency, Sokoto State</p>
    <div class="title-slip">OFFICIAL APPLICATION & ACKNOWLEDGMENT SLIP</div>
  </div>

  <div class="ref-box">
    <div>
      <div class="field-label">APPLICATION REFERENCE CODE</div>
      <div style="font-size: 16px; font-weight: 900; color: #103C2E; font-family: monospace;">${application.referenceNumber}</div>
    </div>
    <div>
      <div class="field-label">DATE & TIME OF SUBMISSION</div>
      <div class="field-value">${application.date} ${application.submissionTime || 'WAT'}</div>
    </div>
    <div>
      <div class="field-label">APPLICATION STATUS</div>
      <div style="color: #0d6832; font-weight: 800;">${application.status || 'SUBMITTED'}</div>
    </div>
  </div>

  <div class="section-title">1. PROGRAMME INFORMATION</div>
  <div class="grid">
    <div class="field">
      <div class="field-label">Programme Title</div>
      <div class="field-value">${application.programTitle}</div>
    </div>
    <div class="field">
      <div class="field-label">Programme Category</div>
      <div class="field-value">${application.programCategory || 'Constituency Empowerment Scheme'}</div>
    </div>
  </div>

  <div class="section-title">2. APPLICANT PERSONAL DETAILS</div>
  <div class="grid">
    <div class="field">
      <div class="field-label">Full Name</div>
      <div class="field-value">${application.applicantName}</div>
    </div>
    <div class="field">
      <div class="field-label">National Identity Number (NIN)</div>
      <div class="field-value">${application.nin || 'Submitted with Credentials'}</div>
    </div>
    <div class="field">
      <div class="field-label">Primary Telephone Number</div>
      <div class="field-value">${application.phone}</div>
    </div>
    <div class="field">
      <div class="field-label">Email Address</div>
      <div class="field-value">${application.email || 'N/A'}</div>
    </div>
    <div class="field">
      <div class="field-label">Local Government Area (LGA)</div>
      <div class="field-value">${application.lga || 'Yabo / Shagari'}</div>
    </div>
    <div class="field">
      <div class="field-label">Constituency Ward / Community</div>
      <div class="field-value">${application.wardOrTown}</div>
    </div>
  </div>

  <div class="section-title">3. EDUCATIONAL & SOCIO-ECONOMIC INFORMATION</div>
  <div class="grid">
    <div class="field">
      <div class="field-label">Highest Educational Attainment</div>
      <div class="field-value">${application.highestEducation || 'Verified on Screening'}</div>
    </div>
    <div class="field">
      <div class="field-label">Current Employment / Trade Status</div>
      <div class="field-value">${application.employmentStatus || 'Artisan / Artisan Candidate'}</div>
    </div>
    <div class="field">
      <div class="field-label">Qualifications & Trade Background</div>
      <div class="field-value">${application.qualifications}</div>
    </div>
    <div class="field">
      <div class="field-label">Attached Supporting Documents</div>
      <div class="field-value">${application.documents && application.documents.length > 0 ? `${application.documents.length} verified file(s) attached` : 'Registered Credentials on Record'}</div>
    </div>
  </div>

  <div class="section-title">4. STATEMENT OF PURPOSE & SOCIO-ECONOMIC IMPACT</div>
  <div class="statement-box">
    "${application.statement}"
  </div>

  <div class="instructions">
    <strong>IMPORTANT INSTRUCTIONS FOR THE APPLICANT:</strong><br/>
    1. Print and keep this official slip as proof of your application submission.<br/>
    2. Shortlisted applicants will be invited for physical verification at the Yabo and Shagari constituency liaison offices.<br/>
    3. You must present this slip alongside your original National Identity Card / NIN slip and Local Government Indigene Certificate.<br/>
    4. Track your live progress anytime at <strong>danmayeyabo.gov.ng</strong> using your Reference Number: <strong>${application.referenceNumber}</strong>.
  </div>

  <div class="footer-seal">
    <div class="stamp">
      OFFICIALLY REGISTERED<br/>
      CONSTITUENCY EMPOWERMENT DESK<br/>
      HON. UMAR YUSUF YABO
    </div>
    <div class="sign-line">
      <div class="sign-line-bar"></div><br/>
      <strong>Authorized Verification Secretary</strong><br/>
      Yabo/Shagari Constituency Empowerment Board
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Application_Slip_${application.referenceNumber}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const statusBg = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'UNDER REVIEW':
      case 'INITIAL REVIEW':
      case 'DOCUMENT VERIFICATION':
      case 'ELIGIBILITY ASSESSMENT':
      case 'FINAL REVIEW':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'WAITLISTED':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'REJECTED':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-[#103C2E]/10 text-[#103C2E] border-[#103C2E]/30';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white print:static">
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * {
            visibility: hidden;
          }
          #official-print-slip, #official-print-slip * {
            visibility: visible;
          }
          #official-print-slip {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 10mm 15mm;
            border: none !important;
            box-shadow: none !important;
            background: white !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}} />

      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border border-[#C6A15B]/40 max-h-[92vh] flex flex-col my-auto print:max-h-none print:border-none print:shadow-none print:rounded-none">
        
        {/* Modal Top Bar (Hidden in Print) */}
        <div className="no-print bg-[#103C2E] text-white px-6 py-4 flex items-center justify-between border-b border-[#C6A15B]/40">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#C6A15B]" />
            <h3 className="font-['Manrope'] font-bold text-sm sm:text-base uppercase tracking-wider">
              OFFICIAL APPLICATION SLIP & RECEIPT
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm uppercase tracking-wide transition"
              title="Print Official Slip"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">PRINT SLIP</span>
            </button>
            <button
              onClick={handleDownloadSlip}
              className="bg-[#C6A15B] hover:bg-[#B38F46] text-[#103C2E] text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm uppercase tracking-wide transition"
              title="Download Slip File"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">DOWNLOAD SLIP</span>
            </button>
            <button
              onClick={onClose}
              className="text-stone-300 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Slip Content */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-6 text-[#103C2E]" id="official-print-slip" ref={slipRef}>
          
          {/* Official Emblem & National Assembly Header */}
          <div className="text-center space-y-2 border-b-2 border-[#103C2E] pb-6 relative">
            <div className="flex justify-center items-center gap-4">
              <img
                src="/official_logo.png"
                alt="Official Seal"
                className="w-16 h-16 rounded-full object-contain border border-[#C6A15B] shadow-md bg-[#07241A] p-1"
              />
            </div>
            <div>
              <p className="text-[11px] font-extrabold tracking-[0.2em] text-[#103C2E] uppercase">
                FEDERAL REPUBLIC OF NIGERIA
              </p>
              <h2 className="text-base sm:text-xl font-black font-['Manrope'] text-[#103C2E] uppercase tracking-wide">
                NATIONAL ASSEMBLY • HOUSE OF REPRESENTATIVES
              </h2>
              <p className="text-xs font-bold text-[#8C6D2B] uppercase tracking-wider">
                OFFICE OF HON. (DR.) UMAR YUSUF YABO (DAN MAJEN YABO)
              </p>
              <p className="text-[11px] text-stone-500 font-medium">
                Member Representing Yabo/Shagari Federal Constituency, Sokoto State
              </p>
            </div>

            <div className="inline-block mt-2 bg-[#103C2E] text-white px-6 py-1.5 rounded-full text-xs font-black tracking-widest uppercase border border-[#C6A15B]">
              CONSTITUENCY EMPOWERMENT ACKNOWLEDGMENT SLIP
            </div>
          </div>

          {/* Reference Bar & Quick Meta */}
          <div className="bg-[#FAF9F5] border-2 border-dashed border-[#103C2E]/40 rounded-2xl p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
            <div>
              <span className="text-[10px] font-extrabold text-stone-500 uppercase tracking-wider block">
                APPLICATION REFERENCE CODE
              </span>
              <span className="text-lg font-black font-mono text-[#103C2E] tracking-wider select-all">
                {application.referenceNumber}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-stone-500 uppercase tracking-wider block">
                SUBMISSION DATE & TIME
              </span>
              <span className="text-xs font-bold text-[#103C2E]">
                {application.date} {application.submissionTime || 'WAT'}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-stone-500 uppercase tracking-wider block">
                CURRENT STATUS
              </span>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-black border ${statusBg(application.status)}`}>
                {application.status || 'SUBMITTED'}
              </span>
            </div>
          </div>

          {/* Section 1: Programme Details */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#103C2E] border-b border-stone-200 pb-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#C6A15B]"></span>
              1. PROGRAMME INFORMATION
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-stone-50 p-3.5 rounded-xl border border-stone-200/80">
              <div>
                <span className="text-stone-500 block text-[10px] uppercase font-bold">Programme Name:</span>
                <span className="font-bold text-[#103C2E] text-sm">{application.programTitle}</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[10px] uppercase font-bold">Category:</span>
                <span className="font-bold text-[#103C2E]">{application.programCategory || 'Empowerment Initiative'}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Applicant Information */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#103C2E] border-b border-stone-200 pb-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#C6A15B]"></span>
              2. APPLICANT PERSONAL PROFILE
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-stone-50 p-3.5 rounded-xl border border-stone-200/80">
              <div>
                <span className="text-stone-500 block text-[10px] uppercase font-bold">Full Name:</span>
                <span className="font-bold text-[#103C2E]">{application.applicantName}</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[10px] uppercase font-bold">National Identity Number (NIN):</span>
                <span className="font-bold font-mono text-[#103C2E]">{application.nin || 'On file with Committee'}</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[10px] uppercase font-bold">Primary Phone:</span>
                <span className="font-bold text-[#103C2E]">{application.phone}</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[10px] uppercase font-bold">Email Address:</span>
                <span className="font-bold text-[#103C2E]">{application.email || 'None Provided'}</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[10px] uppercase font-bold">Local Government Area:</span>
                <span className="font-bold text-[#103C2E]">{application.lga || 'Yabo / Shagari'}</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[10px] uppercase font-bold">Ward / Community:</span>
                <span className="font-bold text-[#103C2E]">{application.wardOrTown}</span>
              </div>
            </div>
          </div>

          {/* Section 3: Educational & Socio-economic */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#103C2E] border-b border-stone-200 pb-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#C6A15B]"></span>
              3. EDUCATIONAL & SOCIO-ECONOMIC BACKGROUND
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-stone-50 p-3.5 rounded-xl border border-stone-200/80">
              <div>
                <span className="text-stone-500 block text-[10px] uppercase font-bold">Highest Qualification:</span>
                <span className="font-bold text-[#103C2E]">{application.highestEducation || 'Verified on Screening'}</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[10px] uppercase font-bold">Employment Status:</span>
                <span className="font-bold text-[#103C2E]">{application.employmentStatus || 'Artisan / Candidate'}</span>
              </div>
              <div>
                <span className="text-stone-500 block text-[10px] uppercase font-bold">Qualifications / Trade:</span>
                <span className="font-bold text-[#103C2E] truncate block">{application.qualifications}</span>
              </div>
            </div>
          </div>

          {/* Section 4: Personal Statement */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#103C2E] border-b border-stone-200 pb-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#C6A15B]"></span>
              4. STATEMENT OF INTENT & COMMUNITY IMPACT
            </h4>
            <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200/80 text-xs italic text-stone-700 leading-relaxed">
              "{application.statement}"
            </div>
          </div>

          {/* Verification Instructions Box */}
          <div className="bg-[#FAF9F5] border-l-4 border-[#C6A15B] p-4 rounded-r-xl space-y-1.5 text-xs text-stone-700">
            <span className="font-extrabold uppercase text-[#103C2E] block">
              VERIFICATION INSTRUCTIONS & NEXT STEPS
            </span>
            <ul className="list-disc list-inside space-y-1 text-[11px] font-light">
              <li>Keep this printed acknowledgment slip safe for official identification.</li>
              <li>Verification desk officers will review submitted records and notify shortlisted beneficiaries via SMS and phone call.</li>
              <li>When invited, bring this slip alongside your original NIN slip and Local Government Indigene Certificate.</li>
              <li>Track live updates at <strong>danmayeyabo.gov.ng</strong> using reference: <strong className="font-mono text-[#103C2E]">{application.referenceNumber}</strong>.</li>
            </ul>
          </div>

          {/* Official Seals and Signature Line */}
          <div className="pt-4 flex flex-col sm:flex-row justify-between items-center sm:items-end gap-6 border-t border-stone-200 text-center sm:text-left">
            <div className="space-y-1">
              <div className="border-2 border-dashed border-[#103C2E] rounded-xl px-4 py-2 bg-stone-50 inline-block text-[10px] font-black uppercase tracking-wider text-[#103C2E]">
                ★ OFFICIAL SCREENING REGISTRATION SEAL ★<br />
                CONSTITUENCY LIAISON DESK • VERIFIED RECORD
              </div>
              <p className="text-[9px] text-stone-400 font-mono">
                SECURITY CHECKSUM: {application.id.toUpperCase()}-{application.referenceNumber.replace(/[^A-Z0-9]/g, '')}
              </p>
            </div>

            <div className="text-right space-y-1">
              <div className="w-48 border-b-2 border-stone-800 mx-auto sm:ml-auto"></div>
              <p className="text-xs font-bold text-[#103C2E]">Screening Committee Secretary</p>
              <p className="text-[10px] text-stone-500">Yabo/Shagari Constituency Empowerment Board</p>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions (Hidden in Print) */}
        <div className="no-print bg-stone-100 px-6 py-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-stone-600">
            Reference code: <strong className="font-mono text-[#103C2E]">{application.referenceNumber}</strong>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {onTrack && (
              <button
                onClick={() => {
                  onClose();
                  onTrack(application.referenceNumber);
                }}
                className="bg-[#103C2E] text-white hover:bg-[#09291F] px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition shadow-sm uppercase tracking-wide"
              >
                <span>TRACK APPLICATION STAGES</span>
                <ArrowRight className="w-4 h-4 text-[#C6A15B]" />
              </button>
            )}
            <button
              onClick={handlePrint}
              className="bg-emerald-600 text-white hover:bg-emerald-500 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition shadow-sm uppercase tracking-wide"
            >
              <Printer className="w-4 h-4" />
              <span>PRINT SLIP</span>
            </button>
            <button
              onClick={onClose}
              className="bg-stone-200 text-stone-700 hover:bg-stone-300 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition uppercase tracking-wide"
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
