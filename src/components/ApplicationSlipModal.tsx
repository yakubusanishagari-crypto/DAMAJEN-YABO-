import React, { useRef, useState } from 'react';
import { ProgramApplication } from '../types';
import { Printer, Download, X, CheckCircle2, ShieldCheck, QrCode, FileText, ArrowRight, Award, User } from 'lucide-react';
import { CongratulationOfferModal } from './CongratulationOfferModal';

interface Props {
  application: ProgramApplication;
  onClose: () => void;
  onTrack?: (ref: string) => void;
}

export const ApplicationSlipModal: React.FC<Props> = ({ application, onClose, onTrack }) => {
  const slipRef = useRef<HTMLDivElement>(null);
  const [showCongratOffer, setShowCongratOffer] = useState(false);

  const isPetition = Boolean(
    application.referenceNumber?.startsWith('DAN-PET') ||
    application.programCategory?.toLowerCase().includes('petition') ||
    application.programId?.includes('ticket') ||
    application.programId?.includes('petition')
  );

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadSlip = () => {
    const isPetition = Boolean(
      application.referenceNumber?.startsWith('DAN-PET') ||
      application.programCategory?.toLowerCase().includes('petition') ||
      application.programId?.includes('ticket') ||
      application.programId?.includes('petition')
    );
    // Generate a standalone, printable HTML document for download with exact color preservation
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${isPetition ? 'Petition Docket' : 'Application Slip'} - ${application.referenceNumber}</title>
  <style>
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important; }
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
  <div class="watermark">DAN MAJE CONSTITUENCY</div>
  <div class="header">
    <p class="title-republic">FEDERAL REPUBLIC OF NIGERIA</p>
    <p class="title-nass">HOUSE OF REPRESENTATIVES • NATIONAL ASSEMBLY</p>
    <p class="title-office">Office of Hon. (Dr.) Umar Yusuf Yabo (Dan Majen Yabo)</p>
    <p style="font-size: 11px; color: #4b5e52; margin: 0;">Member Representing Yabo/Shagari Federal Constituency, Sokoto State</p>
    <div class="title-slip">${isPetition ? 'OFFICIAL CONSTITUENCY PETITION & SERVICE DOCKET' : 'OFFICIAL APPLICATION & ACKNOWLEDGMENT SLIP'}</div>
  </div>

  <div class="ref-box">
    <div>
      <div class="field-label">${isPetition ? 'PETITION REFERENCE CODE' : 'APPLICATION REFERENCE CODE'}</div>
      <div style="font-size: 16px; font-weight: 900; color: #103C2E; font-family: monospace;">${application.referenceNumber}</div>
    </div>
    <div>
      <div class="field-label">DATE LOGGED</div>
      <div class="field-value">${application.date} ${application.submissionTime || 'WAT'}</div>
    </div>
    <div>
      <div class="field-label">CURRENT STATUS</div>
      <div style="color: #0d6832; font-weight: 800;">${application.status || 'SUBMITTED'}</div>
    </div>
  </div>

  <div class="section-title">1. SUBJECT INFORMATION</div>
  <div class="grid">
    <div class="field">
      <div class="field-label">${isPetition ? 'Petition Subject / Title' : 'Programme Title'}</div>
      <div class="field-value">${application.programTitle}</div>
    </div>
    <div class="field">
      <div class="field-label">Category</div>
      <div class="field-value">${application.programCategory || (isPetition ? 'Constituency Petition' : 'Empowerment Scheme')}</div>
    </div>
  </div>

  <div class="section-title">2. ${isPetition ? 'CITIZEN PETITIONER CONTACT DETAILS' : 'APPLICANT PERSONAL DETAILS & BIOMETRIC IDENTIFICATION'}</div>
  <div style="display: flex; gap: 15px; margin-bottom: 12px; align-items: flex-start;">
    <div style="flex: 1;">
      <div class="grid">
        <div class="field">
          <div class="field-label">${isPetition ? 'Petitioner Full Name' : 'Full Name'}</div>
          <div class="field-value">${application.applicantName}</div>
        </div>
        <div class="field">
          <div class="field-label">${isPetition ? 'Identifier / NIN' : 'National Identity Number (NIN)'}</div>
          <div class="field-value">${application.nin || 'Submitted Record'}</div>
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
    </div>
    ${!isPetition && application.passportPhoto ? `
    <div style="width: 105px; height: 130px; border: 2px solid #C6A15B; background: #faf9f5; padding: 2px; text-align: center; border-radius: 4px; shrink: 0;">
      <img src="${application.passportPhoto}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 2px;" alt="Passport" />
    </div>` : ''}
  </div>

  <div class="section-title">3. ${isPetition ? 'GRIEVANCE STATEMENT & CITIZEN PLEA' : 'EDUCATIONAL & SOCIO-ECONOMIC INFORMATION'}</div>
  <div class="statement-box">
    "${application.statement}"
  </div>

  <div class="instructions">
    <strong>OFFICIAL CONSTITUENCY NOTICE:</strong><br/>
    1. This official document is generated from the National Assembly Constituency Transparency Portal.<br/>
    2. Track live review progress at <strong>danmayeyabo.gov.ng</strong> using reference: <strong>${application.referenceNumber}</strong>.
  </div>

  <div class="footer-seal">
    <div class="stamp">
      OFFICIALLY RECORDED<br/>
      ${isPetition ? 'CONSTITUENCY PETITION DESK' : 'EMPOWERMENT SCREENING DESK'}<br/>
      HON. UMAR YUSUF YABO
    </div>
    <div class="sign-line">
      <div class="sign-line-bar"></div><br/>
      <strong>Authorized Committee Secretary</strong><br/>
      Yabo/Shagari Federal Constituency Office
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
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
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

          {/* Special Status Resolution Banners */}
          {isPetition ? (
            <>
              {application.status === 'APPROVED' && (
                <div className="no-print bg-gradient-to-r from-[#103C2E] via-[#09291F] to-[#103C2E] border-2 border-[#D4AF37] p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-white shadow-xl">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shrink-0">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-['Manrope'] font-extrabold text-sm sm:text-base text-[#D4AF37] uppercase tracking-wide">
                        ★ PETITION FORMALLY UPHELD & EXECUTIVE RELIEF ACTION DIRECTED ★
                      </h4>
                      <p className="text-xs text-emerald-100">
                        The Office of Hon. (Dr.) Umar Yusuf Yabo highly commends your proactive civic engagement and constructive proposal toward community development. Following committee review, this petition has been officially validated and assigned to the constituency execution team.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {application.status === 'REJECTED' && (
                <div className="no-print bg-stone-100 border-2 border-stone-300 p-4 sm:p-5 rounded-2xl flex items-center gap-3.5 text-stone-800 shadow-sm">
                  <div className="w-11 h-11 rounded-full bg-stone-200 border border-stone-400 flex items-center justify-center text-stone-700 shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-['Manrope'] font-bold text-sm sm:text-base text-[#103C2E] uppercase tracking-wide">
                      CIVIC NOTICE: PETITION REVIEW CONCLUDED & ADVISORY RECORDED
                    </h4>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      We sincerely appreciate your civic awareness and active initiative in bringing this matter forward for community development. Following thorough committee review, this matter has been resolved or noted in constituency archives.
                    </p>
                  </div>
                </div>
              )}
            </>
          ) : (
            application.status === 'APPROVED' && (
              <div className="no-print bg-gradient-to-r from-[#103C2E] via-[#09291F] to-[#103C2E] border-2 border-[#D4AF37] p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-white shadow-xl">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] shrink-0">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-['Manrope'] font-extrabold text-sm sm:text-base text-[#D4AF37] uppercase tracking-wide">
                      ★ CONGRATULATIONS! SELECTION & AWARD APPROVED ★
                    </h4>
                    <p className="text-xs text-emerald-100">
                      Hon. (Dr.) Umar Yusuf Yabo has approved this dossier. You can now view and print your Official Congratulation Offer & Award Letter.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowCongratOffer(true)}
                  className="bg-gradient-to-r from-[#D4AF37] to-[#C6A15B] hover:brightness-110 active:scale-95 text-[#09291F] px-5 py-2.5 rounded-xl font-black text-xs uppercase shadow-lg flex items-center gap-2 transition cursor-pointer shrink-0"
                >
                  <Award className="w-4 h-4" />
                  <span>VIEW CONGRATULATION OFFER</span>
                </button>
              </div>
            )
          )}

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

          {/* Section 2: Personal / Petitioner Details (Omit photo for petitions) */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#103C2E] border-b border-stone-200 pb-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#C6A15B]"></span>
              2. {isPetition ? 'CITIZEN PETITIONER IDENTIFICATION & CONTACTS' : 'APPLICANT PERSONAL PROFILE & BIOMETRIC PHOTOGRAPH'}
            </h4>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 bg-stone-50 p-4 rounded-xl border border-stone-200/80">
              {/* Passport Photograph Box (Omitted for Petitions) */}
              {!isPetition && (
                <div className="w-24 h-28 sm:w-28 sm:h-32 rounded-xl overflow-hidden border-2 border-[#C6A15B] bg-white shrink-0 shadow-sm flex flex-col items-center justify-center p-0.5 relative">
                  {application.passportPhoto ? (
                    <img
                      src={application.passportPhoto}
                      alt={application.applicantName}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="text-center p-2 text-stone-400">
                      <User className="w-8 h-8 mx-auto" />
                      <span className="text-[9px] font-bold uppercase mt-1 block">Passport Photo</span>
                    </div>
                  )}
                  <div className="absolute bottom-0 inset-x-0 bg-[#103C2E]/90 text-[#D4AF37] text-[8px] font-bold py-0.5 text-center uppercase tracking-wider">
                    Official Photo
                  </div>
                </div>
              )}

              {/* Data Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs flex-1 w-full">
                <div>
                  <span className="text-stone-500 block text-[10px] uppercase font-bold">{isPetition ? 'Petitioner Full Name:' : 'Full Name:'}</span>
                  <span className="font-bold text-[#103C2E] text-sm">{application.applicantName}</span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[10px] uppercase font-bold">{isPetition ? 'Identifier / NIN:' : 'National Identity Number (NIN):'}</span>
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
          </div>

          {/* Section 3: Educational or Petition Details */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#103C2E] border-b border-stone-200 pb-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#C6A15B]"></span>
              {isPetition ? '3. COMMUNITY PETITION & LOCATION DETAILS' : '3. EDUCATIONAL & SOCIO-ECONOMIC BACKGROUND'}
            </h4>
            {isPetition ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-stone-50 p-3.5 rounded-xl border border-stone-200/80">
                <div>
                  <span className="text-stone-500 block text-[10px] uppercase font-bold">Category:</span>
                  <span className="font-bold text-[#103C2E]">{application.programCategory || 'Constituency Petition'}</span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[10px] uppercase font-bold">Community Ward:</span>
                  <span className="font-bold text-[#103C2E]">{application.wardOrTown}</span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[10px] uppercase font-bold">Local Government:</span>
                  <span className="font-bold text-[#103C2E]">{application.lga || 'Yabo / Shagari'}</span>
                </div>
              </div>
            ) : (
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
            )}
          </div>

          {/* Section 4: Personal Statement */}
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#103C2E] border-b border-stone-200 pb-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#C6A15B]"></span>
              {isPetition ? '4. CITIZEN PETITION GRIEVANCE & PROPOSAL' : '4. STATEMENT OF INTENT & COMMUNITY IMPACT'}
            </h4>
            <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200/80 text-xs italic text-stone-700 leading-relaxed">
              "{application.statement}"
            </div>
          </div>

          {/* Section 5: Official Committee Resolution & Feedback */}
          {(application.publicFeedback || application.awardGrantPackage) && (
            <div className="space-y-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#103C2E] border-b border-stone-200 pb-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                {isPetition ? '5. OFFICIAL COMMITTEE RESOLUTION & EXECUTIVE ACTION' : '5. COMMITTEE ALLOCATION & PUBLIC NOTICE'}
              </h4>
              <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-300 space-y-2 text-xs">
                {application.publicFeedback && (
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-900 block">
                      {isPetition ? 'Official Resolution Notice:' : 'Committee Feedback:'}
                    </span>
                    <p className="font-medium text-[#103C2E] leading-relaxed">{application.publicFeedback}</p>
                  </div>
                )}
                {application.awardGrantPackage && (
                  <div className="pt-1.5 border-t border-emerald-200">
                    <span className="text-[10px] uppercase font-bold text-emerald-900 block">
                      {isPetition ? 'Committed Relief / Executive Action:' : 'Approved Award Specification:'}
                    </span>
                    <span className="font-black text-[#103C2E]">{application.awardGrantPackage}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Verification Instructions Box */}
          <div className="bg-[#FAF9F5] border-l-4 border-[#C6A15B] p-4 rounded-r-xl space-y-1.5 text-xs text-stone-700">
            <span className="font-extrabold uppercase text-[#103C2E] block">
              {isPetition ? 'CONSTITUENCY PETITION & CIVIC CITIZENSHIP ADVISORY' : 'VERIFICATION INSTRUCTIONS & NEXT STEPS'}
            </span>
            {isPetition ? (
              <ul className="list-disc list-inside space-y-1 text-[11px] font-light">
                <li>This petition docket is officially logged in the legislative records of Hon. (Dr.) Umar Yusuf Yabo.</li>
                <li>We commend your active civic citizenship in advocating for community development in your ward.</li>
                <li>Track live committee investigation and resolution at <strong>danmayeyabo.gov.ng</strong> using reference: <strong className="font-mono text-[#103C2E]">{application.referenceNumber}</strong>.</li>
              </ul>
            ) : (
              <ul className="list-disc list-inside space-y-1 text-[11px] font-light">
                <li>Keep this printed acknowledgment slip safe for official identification.</li>
                <li>Verification desk officers will review submitted records and notify shortlisted beneficiaries via SMS and phone call.</li>
                <li>When invited, bring this slip alongside your original NIN slip and Local Government Indigene Certificate.</li>
                <li>Track live updates at <strong>danmayeyabo.gov.ng</strong> using reference: <strong className="font-mono text-[#103C2E]">{application.referenceNumber}</strong>.</li>
              </ul>
            )}
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

      {/* Congratulation Offer Modal */}
      {showCongratOffer && (
        <CongratulationOfferModal
          application={application}
          onClose={() => setShowCongratOffer(false)}
        />
      )}
    </div>
  );
};
