import React, { useRef } from 'react';
import { ProgramApplication } from '../types';
import { 
  Printer, Download, X, Award, CheckCircle2, ShieldCheck, 
  MapPin, Calendar, FileText, Building2, User 
} from 'lucide-react';

interface Props {
  application: ProgramApplication;
  onClose: () => void;
}

export const CongratulationOfferModal: React.FC<Props> = ({ application, onClose }) => {
  const offerRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const isPetition = Boolean(
    application.referenceNumber?.startsWith('DAN-PET') ||
    application.programCategory?.toLowerCase().includes('petition') ||
    application.programId?.includes('ticket') ||
    application.programId?.includes('petition')
  );

  const grantPackageDescription = application.awardGrantPackage || 
    (isPetition ? 'Constituency Executive Relief & Infrastructure Intervention Assigned' :
     application.programCategory === 'Agriculture' ? '1x Complete Solar Irrigation Pumping Unit + Industrial Hose + ₦50,000 Agricultural Input Support Grant' :
     application.programCategory === 'Skills Acquisition' ? '1x Heavy-Duty Tailoring/Trade Machine + Complete Tooling Kit + ₦40,000 Apprenticeship Seed Fund' :
     application.programCategory === 'Small Business Grant' ? '₦150,000 Direct Non-Refundable Business Working Capital Grant + MSME Financial Record Book' :
     'Constituency Vocational Starter Kit & Direct Financial Empowerment Grant');

  const handleDownloadOffer = () => {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${isPetition ? 'Official_Petition_Resolution_' : 'Official_Offer_Letter_'}${application.referenceNumber}</title>
  <style>
    @page { size: A4 portrait; margin: 15mm; }
    body { font-family: 'Times New Roman', Times, serif; color: #103C2E; background: #fff; margin: 0; padding: 25px; line-height: 1.5; }
    .header { text-align: center; border-bottom: 3px double #103C2E; padding-bottom: 15px; margin-bottom: 25px; }
    .crest { width: 75px; height: 75px; margin: 0 auto 10px; }
    .title-republic { font-size: 13px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; margin: 0; color: #103C2E; }
    .title-nass { font-size: 17px; font-weight: 900; color: #103C2E; margin: 3px 0; text-transform: uppercase; }
    .title-office { font-size: 13px; font-weight: bold; color: #9A7B38; text-transform: uppercase; margin: 2px 0; }
    .title-award { font-size: 17px; font-weight: 900; color: #09291F; background: #eaf3ee; display: inline-block; padding: 7px 25px; border-radius: 6px; margin-top: 15px; border: 2px solid #103C2E; letter-spacing: 1.5px; text-transform: uppercase; }
    .top-meta { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; font-family: sans-serif; font-size: 12px; }
    .photo-frame { width: 110px; height: 135px; border: 2px solid #9A7B38; padding: 3px; background: #faf9f5; text-align: center; }
    .photo-frame img { width: 100%; height: 100%; object-fit: cover; }
    .congrats-banner { background: #0e3d2f; color: #D4AF37; padding: 12px 18px; border-radius: 6px; font-family: sans-serif; font-size: 13px; font-weight: bold; text-align: center; margin: 20px 0; letter-spacing: 0.5px; text-transform: uppercase; }
    .content-p { font-size: 14px; text-align: justify; margin: 12px 0; line-height: 1.6; }
    .package-box { background: #faf8f2; border: 1.5px solid #D4AF37; padding: 15px; border-radius: 6px; margin: 20px 0; font-family: sans-serif; }
    .package-title { font-size: 12px; font-weight: 900; color: #103C2E; text-transform: uppercase; margin-bottom: 6px; }
    .package-item { font-size: 14px; font-weight: bold; color: #09291F; }
    .instructions-box { background: #fdfbf7; border-left: 4px solid #103C2E; padding: 12px 16px; font-family: sans-serif; font-size: 12px; margin: 20px 0; }
    .footer-seal { margin-top: 35px; display: flex; justify-content: space-between; align-items: flex-end; padding-top: 20px; border-top: 1px solid #c2cfc7; }
    .seal-stamp { border: 2px double #103C2E; padding: 10px 16px; border-radius: 6px; text-align: center; font-family: sans-serif; font-size: 10px; font-weight: bold; text-transform: uppercase; color: #103C2E; }
    .signature-box { text-align: right; font-family: sans-serif; font-size: 12px; }
    .sig-line { width: 200px; border-bottom: 1.5px solid #103C2E; margin-bottom: 6px; display: inline-block; }
  </style>
</head>
<body>
  <div class="header">
    <p class="title-republic">FEDERAL REPUBLIC OF NIGERIA</p>
    <p class="title-nass">HOUSE OF REPRESENTATIVES • NATIONAL ASSEMBLY</p>
    <p class="title-office">Office of Hon. (Dr.) Umar Yusuf Yabo (Dan Majen Yabo)</p>
    <p style="font-size: 11px; margin: 0; color: #3a5043;">Member Representing Yabo/Shagari Federal Constituency, Sokoto State</p>
    <div class="title-award">${isPetition ? 'OFFICIAL PETITION RESOLUTION & CIVIC COMMENDATION ORDER' : 'OFFICIAL NOTIFICATION OF EMPOWERMENT SELECTION & AWARD'}</div>
  </div>

  <div class="top-meta">
    <div>
      <div><strong>OFFICIAL REF NO:</strong> <span style="font-family: monospace; font-size: 14px; color: #103C2E;">${application.referenceNumber}</span></div>
      <div><strong>DATE OF ISSUANCE:</strong> ${application.date}</div>
      <div><strong>${isPetition ? 'PETITION SUBJECT:' : 'SCHEME:'}</strong> ${application.programTitle}</div>
      <div><strong>LGA / WARD:</strong> ${application.lga || 'Yabo/Shagari'} • ${application.wardOrTown}</div>
    </div>
    ${!isPetition ? `
    <div class="photo-frame">
      ${application.passportPhoto ? `<img src="${application.passportPhoto}" alt="Applicant Photo" />` : '<div style="display:flex;height:100%;align-items:center;justify-content:center;font-size:10px;color:#888;">OFFICIAL BIOMETRIC PHOTO</div>'}
    </div>` : ''}
  </div>

  <div class="congrats-banner">
    ${isPetition 
      ? '★ PETITION FORMALLY UPHELD & RELIEF ACTION DIRECTED ★'
      : '★ CONGRATULATIONS! YOU HAVE BEEN OFFICIALLY SELECTED & APPROVED ★'}
  </div>

  <p class="content-p">
    <strong>Dear ${application.applicantName.toUpperCase()},</strong>
  </p>

  <p class="content-p">
    ${isPetition 
      ? `On behalf of <strong>Hon. (Dr.) Umar Yusuf Yabo (Dan Majen Yabo)</strong>, Member representing Yabo/Shagari Federal Constituency in the House of Representatives, 10th National Assembly, we highly commend your dedicated civic engagement and proactive proposal toward community development in <strong>${application.wardOrTown}</strong>. Following thorough committee investigation and field inspection, your petition has been formally <strong>UPHELD AND APPROVED FOR DIRECT EXECUTIVE INTERVENTION</strong>.`
      : `On behalf of <strong>Hon. (Dr.) Umar Yusuf Yabo (Dan Majen Yabo)</strong>, Member representing Yabo/Shagari Federal Constituency in the House of Representatives, 10th National Assembly, we take immense pleasure in informing you that your application for the <strong>"${application.programTitle}"</strong> has successfully completed the rigorous screening and verification exercise and has been <strong>OFFICIALLY APPROVED</strong>.`}
  </p>

  <div class="package-box">
    <div class="package-title">${isPetition ? 'DIRECTED EXECUTIVE ACTION & COMMITTED RELIEF INTERVENTION:' : 'APPROVED EMPOWERMENT ALLOCATION & AWARD SPECIFICATION:'}</div>
    <div class="package-item">${grantPackageDescription}</div>
  </div>

  <div class="instructions-box">
    <strong>${isPetition ? 'OFFICIAL IMPLEMENTATION DIRECTIVE & CITIZEN ADVISORY:' : 'MANDATORY INSTRUCTIONS FOR COLLECTION & INDUCTION:'}</strong><br/>
    ${isPetition ? `
    1. <strong>Field Execution:</strong> The constituency engineering & liaison team has received legislative orders to initiate the requested community relief action.<br/>
    2. <strong>Civic Commendation:</strong> The Office of the Representative expresses deep gratitude for your proactive community service and vigilance.<br/>
    3. <strong>Tracking & Accountability:</strong> Citizens may continuously inspect progress updates using your official reference: <strong>${application.referenceNumber}</strong>.
    ` : `
    1. <strong>Physical Orientation & Induction:</strong> You are scheduled to attend the orientation and physical hand-over session at the Yabo Constituency Central Secretariat / Liaison Headquarters.<br/>
    2. <strong>Mandatory Credentials to Bring:</strong> You must present this printed Official Congratulatory Offer Letter, your original National Identity Card (NIN slip), and Local Government Indigene Certificate.<br/>
    3. <strong>Identity Verification:</strong> Your physical appearance must match the official biometric passport photograph affixed to this offer document.
    `}
  </div>

  <p class="content-p" style="font-size: 13px; font-style: italic;">
    ${isPetition 
      ? `"Grassroots development succeeds through active citizen participation and responsive legislative action." — Hon. Umar Yusuf Yabo.`
      : `"This empowerment award is conferred upon you in trust to foster self-reliance, local enterprise, and economic advancement across Yabo and Shagari." — Hon. Umar Yusuf Yabo.`}
  </p>

  <div class="footer-seal">
    <div class="seal-stamp">
      ${isPetition ? 'OFFICIALLY UPHELD & RECORDED<br/>CONSTITUENCY PETITIONS DESK<br/>NATIONAL ASSEMBLY • ABUJA' : 'OFFICIALLY APPROVED & CERTIFIED<br/>CONSTITUENCY EMPOWERMENT BOARD<br/>NATIONAL ASSEMBLY • ABUJA'}
    </div>
    <div class="signature-box">
      <div class="sig-line"></div><br/>
      <strong>Hon. (Dr.) Umar Yusuf Yabo</strong><br/>
      Member, House of Representatives<br/>
      Yabo/Shagari Federal Constituency
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Official_Offer_Letter_${application.referenceNumber}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white print:static">
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * {
            visibility: hidden;
          }
          #official-congrat-offer, #official-congrat-offer * {
            visibility: visible;
          }
          #official-congrat-offer {
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

      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden border-2 border-[#D4AF37] max-h-[92vh] flex flex-col my-auto print:max-h-none print:border-none print:shadow-none print:rounded-none">
        
        {/* Modal Top Bar */}
        <div className="no-print bg-[#103C2E] text-white px-6 py-4 flex items-center justify-between border-b border-[#D4AF37]/50">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="font-['Manrope'] font-bold text-sm sm:text-base uppercase tracking-wider text-white">
              OFFICIAL CONGRATULATORY OFFER & AWARD CERTIFICATE
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm uppercase tracking-wide transition"
              title="Print Official Award Document"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">PRINT OFFER</span>
            </button>
            <button
              onClick={handleDownloadOffer}
              className="bg-[#D4AF37] hover:bg-[#C6A15B] text-[#09291F] text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm uppercase tracking-wide transition"
              title="Download Standalone Document"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">DOWNLOAD OFFER</span>
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

        {/* Award Document View */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-6 text-[#103C2E]" id="official-congrat-offer" ref={offerRef}>
          
          {/* Official Letterhead Header */}
          <div className="text-center space-y-2 border-b-2 border-[#103C2E] pb-6 relative">
            <div className="flex justify-center items-center gap-3">
              <img
                src="/official_logo.png"
                alt="Federal Crest"
                className="w-16 h-16 rounded-full object-contain border-2 border-[#D4AF37] shadow-md bg-[#07241A] p-1"
              />
            </div>
            <div>
              <p className="text-[11px] font-extrabold tracking-[0.25em] text-[#103C2E] uppercase">
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

            <div className="inline-block mt-2 bg-gradient-to-r from-[#103C2E] via-[#09291F] to-[#103C2E] text-[#D4AF37] px-6 py-1.5 rounded-full text-xs font-black tracking-widest uppercase border border-[#D4AF37] shadow-sm">
              {isPetition ? 'OFFICIAL CONSTITUENCY PETITION RESOLUTION & ACTION ORDER' : 'OFFICIAL EMPOWERMENT SELECTION OFFER & AWARD NOTIFICATION'}
            </div>
          </div>

          {/* Top Meta Bar + Biometric / Civic Frame */}
          <div className="bg-[#FAF9F5] border border-[#C6A15B]/50 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1.5 text-xs">
              <div>
                <span className="text-[10px] text-stone-500 uppercase font-bold block">
                  {isPetition ? 'PETITION DOCKET REFERENCE:' : 'OFFICIAL BENEFICIARY REF:'}
                </span>
                <span className="font-mono text-base font-black text-[#103C2E] tracking-wider select-all">
                  {application.referenceNumber}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs pt-1">
                <div>
                  <span className="text-[10px] text-stone-500 uppercase font-bold block">DATE OF APPROVAL:</span>
                  <span className="font-bold text-[#103C2E]">{application.date}</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 uppercase font-bold block">CONSTITUENCY WARD:</span>
                  <span className="font-bold text-[#103C2E]">{application.wardOrTown} ({application.lga || 'Yabo/Shagari'})</span>
                </div>
              </div>
            </div>

            {/* Passport Photo (Only for Empowerment Applicants) */}
            {!isPetition && (
              <div className="w-24 h-28 sm:w-28 sm:h-32 rounded-xl overflow-hidden border-2 border-[#D4AF37] bg-stone-100 shadow-md shrink-0 flex flex-col items-center justify-center relative p-0.5">
                {application.passportPhoto ? (
                  <img
                    src={application.passportPhoto}
                    alt={application.applicantName}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-2 text-center text-stone-400">
                    <User className="w-8 h-8 text-stone-400" />
                    <span className="text-[9px] font-bold uppercase mt-1">Verified Photo</span>
                  </div>
                )}
                <div className="absolute bottom-0 inset-x-0 bg-[#103C2E]/90 text-[#D4AF37] text-[8px] font-bold py-0.5 text-center uppercase tracking-wider">
                  Official Photo
                </div>
              </div>
            )}
          </div>

          {/* Congratulations Highlight Banner */}
          <div className="bg-gradient-to-r from-[#103C2E] to-[#0A261E] text-white p-4 rounded-2xl border border-[#D4AF37]/60 flex items-center gap-3 shadow-md">
            <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] shrink-0 border border-[#D4AF37]">
              {isPetition ? <ShieldCheck className="w-5 h-5" /> : <Award className="w-5 h-5" />}
            </div>
            <div>
              <h4 className="font-['Manrope'] font-bold text-sm sm:text-base text-[#D4AF37] uppercase tracking-wide">
                {isPetition 
                  ? `CIVIC COMMENDATION: ${application.applicantName.toUpperCase()}`
                  : `CONGRATULATIONS, ${application.applicantName.toUpperCase()}!`}
              </h4>
              <p className="text-xs text-emerald-100">
                {isPetition 
                  ? `Your community proposal and petition regarding "${application.programTitle}" has been formally upheld and referred for executive action.`
                  : `You have been selected as an official beneficiary for the ${application.programTitle}.`}
              </p>
            </div>
          </div>

          {/* Formal Body of Letter */}
          <div className="space-y-3 text-xs sm:text-sm text-stone-800 leading-relaxed">
            <p>
              {isPetition ? (
                <>We highly commend your dedicated civic engagement and proactive proposal toward community development in <strong>{application.wardOrTown}</strong>. Following thorough committee review and field verification, your petition has been formally <strong>UPHELD AND APPROVED FOR DIRECT EXECUTIVE INTERVENTION</strong>.</>
              ) : (
                <>We are pleased to formally notify you that following the thorough, merit-based screening conducted by the Constituency Screening Committee, your application has been <strong>OFFICIALLY APPROVED</strong>.</>
              )}
            </p>

            {/* Award Package Specifications */}
            <div className="bg-[#FAF8F2] border-2 border-[#C6A15B]/60 p-4 rounded-2xl space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#103C2E] block">
                {isPetition ? '★ DIRECTED EXECUTIVE ACTION & COMMITTED RELIEF INTERVENTION:' : '★ CERTIFIED EMPOWERMENT GRANT / ALLOCATION PACKAGE:'}
              </span>
              <p className="font-extrabold text-sm sm:text-base text-[#09291F]">
                {grantPackageDescription}
              </p>
            </div>

            {/* Instructions */}
            <div className="bg-stone-50 border-l-4 border-[#103C2E] p-4 rounded-r-xl space-y-1.5 text-xs">
              <strong className="text-[#103C2E] uppercase font-bold block">
                {isPetition ? 'OFFICIAL DIRECTIVE & CITIZEN LIAISON PROTOCOL:' : 'NEXT STEPS & INDUCTION PROTOCOL:'}
              </strong>
              {isPetition ? (
                <ul className="list-disc list-inside space-y-1 text-stone-700">
                  <li>The designated engineering and constituency works team has received formal legislative directive to execute this relief intervention.</li>
                  <li>We convey the deepest appreciation of Hon. Umar Yusuf Yabo for your vigilance and active contribution toward grassroots community advancement.</li>
                  <li>Progress milestones can be tracked live via the constituency transparency portal using docket reference: <strong>{application.referenceNumber}</strong>.</li>
                </ul>
              ) : (
                <ul className="list-disc list-inside space-y-1 text-stone-700">
                  <li>Present this printed Offer Letter at the Constituency Liaison Office during designated distribution dates.</li>
                  <li>Bring your original National Identity Number (NIN) Slip/Card and Local Government Indigene Certificate for physical matching.</li>
                  <li>Disbursement and equipment handover will be executed strictly to the verified beneficiary matching the biometric photograph above.</li>
                </ul>
              )}
            </div>
          </div>

          {/* Official Signatures and Seal */}
          <div className="pt-6 border-t-2 border-[#103C2E] flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 text-xs">
            <div className="border-2 border-double border-[#103C2E] p-3 rounded-xl text-center">
              <span className="text-[9px] font-black uppercase text-[#103C2E] tracking-widest block">
                OFFICIAL SEAL OF APPROVAL
              </span>
              <span className="text-[11px] font-black text-emerald-800 block">
                {isPetition ? 'CONSTITUENCY PETITIONS DESK' : 'CONSTITUENCY EMPOWERMENT BOARD'}
              </span>
              <span className="text-[9px] text-stone-500 font-mono">10TH NATIONAL ASSEMBLY • NIGERIA</span>
            </div>

            <div className="text-right space-y-1 self-end">
              <div className="w-48 border-b-2 border-[#103C2E] ml-auto mb-1"></div>
              <strong className="text-xs font-black text-[#103C2E] block">
                HON. (DR.) UMAR YUSUF YABO
              </strong>
              <span className="text-[10px] text-stone-600 block">Member, House of Representatives</span>
              <span className="text-[10px] text-[#8C6D2B] font-bold block">Yabo/Shagari Federal Constituency</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
