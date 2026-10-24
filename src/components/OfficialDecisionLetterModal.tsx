import React, { useState } from 'react';
import { X, Printer, Copy, Check, ShieldCheck, Award, AlertCircle, Share2, Mail, Phone, Calendar } from 'lucide-react';
import { PetitionerDecisionMessage } from '../types';
import { formatFullLetterText } from '../utils/petitionMessaging';

interface Props {
  message: PetitionerDecisionMessage;
  onClose: () => void;
}

export const OfficialDecisionLetterModal: React.FC<Props> = ({ message, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = formatFullLetterText(message);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const isApproved = message.decision === 'APPROVED';
  const isRejected = message.decision === 'REJECTED';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border-2 border-[#103C2E] my-8 overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Top Control Bar (Hidden during print) */}
        <div className="print:hidden bg-[#103C2E] text-white px-6 py-3.5 flex items-center justify-between border-b border-emerald-700/50">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-pulse"></span>
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-emerald-200">
              Official Parliamentary Dispatch Docket • {message.referenceNumber}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-emerald-800/80 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase transition flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-[#D4AF37] hover:bg-[#C6A15B] text-[#09291F] rounded-xl text-xs font-black uppercase transition flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Letter</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-emerald-900 rounded-xl text-emerald-200 hover:text-white transition cursor-pointer"
              title="Close Letter"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Letterhead Body */}
        <div className="p-8 sm:p-12 overflow-y-auto flex-1 font-serif text-stone-900 leading-relaxed bg-[#FAF9F5] print:p-0 print:bg-white">
          
          {/* Letterhead Header */}
          <div className="text-center border-b-2 border-[#103C2E] pb-6 space-y-2">
            <div className="flex items-center justify-center gap-4">
              <img
                src="/official_logo.png"
                alt="National Assembly Seal"
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain mx-auto"
              />
            </div>
            <h2 className="font-['Manrope'] font-black text-lg sm:text-2xl text-[#103C2E] tracking-tight uppercase">
              HOUSE OF REPRESENTATIVES
            </h2>
            <h3 className="font-['Manrope'] font-extrabold text-xs sm:text-sm text-stone-700 uppercase tracking-wider">
              NATIONAL ASSEMBLY OF THE FEDERAL REPUBLIC OF NIGERIA
            </h3>
            <p className="text-[11px] text-stone-500 font-sans uppercase font-bold tracking-widest">
              Office of Hon. (Dr.) Umar Yusuf Yabo (Dan Majen Yabo)
            </p>
            <p className="text-[10px] text-stone-400 font-sans">
              Member Representing Yabo/Shagari Federal Constituency, Sokoto State
            </p>
          </div>

          {/* Reference, Date & Recipient Docket */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6 border-b border-stone-200 text-xs font-sans">
            <div className="space-y-1">
              <span className="text-stone-400 uppercase font-bold text-[10px] block">To Petitioner:</span>
              <strong className="text-sm text-[#103C2E] font-black block">{message.recipientName}</strong>
              <span className="text-stone-600 block">{message.wardOrTown}</span>
              {message.recipientPhone && (
                <span className="text-stone-500 font-mono text-[11px] block">{message.recipientPhone}</span>
              )}
            </div>
            <div className="sm:text-right space-y-1 font-mono">
              <div>
                <span className="text-stone-400 uppercase font-bold text-[10px] block font-sans">Docket Reference:</span>
                <strong className="text-sm text-[#103C2E] font-black">{message.referenceNumber}</strong>
              </div>
              <div>
                <span className="text-stone-400 uppercase font-bold text-[10px] block font-sans">Official Dispatch Date:</span>
                <span className="text-stone-700 text-xs">{message.sentAt}</span>
              </div>
            </div>
          </div>

          {/* Subject & Status Banner */}
          <div className="py-5 space-y-2 font-sans">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border flex items-center gap-1.5 ${
                isApproved ? 'bg-emerald-100 text-emerald-900 border-emerald-300' :
                isRejected ? 'bg-stone-200 text-stone-900 border-stone-300' :
                'bg-blue-100 text-blue-900 border-blue-300'
              }`}>
                <span className={`w-2 h-2 rounded-full ${isApproved ? 'bg-emerald-600' : isRejected ? 'bg-stone-500' : 'bg-blue-600'}`}></span>
                {message.decisionTitle}
              </span>
              <span className="text-[11px] text-stone-500 font-bold uppercase tracking-wide">
                Category: {message.category}
              </span>
            </div>
            <h4 className="font-['Manrope'] font-bold text-base sm:text-lg text-[#103C2E] pt-1">
              RE: CITIZEN PETITION CONCERNING "{(message.petitionTitle || 'COMMUNITY PETITION').toUpperCase()}"
            </h4>
          </div>

          {/* Letter Body */}
          <div className="space-y-4 text-xs sm:text-sm text-stone-800 leading-relaxed pt-2">
            <p className="font-bold text-[#103C2E]">{message.salutation}</p>
            
            <p>{message.executiveSummary}</p>

            {/* Decision & Detailed Reasoning Box */}
            <div className={`p-5 rounded-2xl border space-y-2 font-sans text-xs ${
              isApproved ? 'bg-emerald-50 border-emerald-300' :
              isRejected ? 'bg-stone-100 border-stone-300' :
              'bg-blue-50 border-blue-200'
            }`}>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#103C2E]" />
                <strong className="uppercase tracking-wider text-[#103C2E]">
                  Committee Deliberation & Findings
                </strong>
              </div>
              <p className="text-stone-800 leading-relaxed font-serif text-xs sm:text-sm">
                {message.detailedReason}
              </p>
              {message.committedAction && (
                <div className="pt-2 border-t border-stone-300/70">
                  <span className="font-bold uppercase text-[10px] text-stone-500 block">Committed Action / Status:</span>
                  <span className="font-black text-[#103C2E] text-xs sm:text-sm">{message.committedAction}</span>
                </div>
              )}
            </div>

            {/* Crucial Section: Encouraging Constructive Participation in Community Development */}
            <div className="p-5 rounded-2xl bg-[#F7F4EB] border-2 border-[#D4AF37]/50 space-y-2 font-sans">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#C6A15B]" />
                <h5 className="font-['Manrope'] font-black uppercase text-xs tracking-wider text-[#09291F]">
                  Commendation & Constructive Participation in Community Development
                </h5>
              </div>
              <p className="text-stone-800 leading-relaxed font-serif text-xs sm:text-sm">
                {message.civicEncouragement}
              </p>
            </div>

            {/* Channels Notice */}
            <div className="text-[11px] font-sans text-stone-500 pt-1 flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1 font-semibold text-emerald-800">
                <Check className="w-3.5 h-3.5" /> SMS Notification Dispatched
              </span>
              <span className="flex items-center gap-1 font-semibold text-emerald-800">
                <Check className="w-3.5 h-3.5" /> Published to Citizen Tracker Portal
              </span>
              <span className="flex items-center gap-1 font-semibold text-emerald-800">
                <Check className="w-3.5 h-3.5" /> Docket Archival Recorded
              </span>
            </div>

            {/* Parliamentary Sign-off */}
            <div className="pt-8 space-y-4 font-sans">
              <p className="text-stone-600 text-xs italic">Yours in parliamentary service and community progress,</p>
              <div className="space-y-1">
                <div className="font-serif italic font-black text-base text-[#103C2E]">
                  Hon. (Dr.) Umar Yusuf Yabo (Dan Majen Yabo)
                </div>
                <p className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                  Member, House of Representatives
                </p>
                <p className="text-[11px] text-stone-500">
                  Chairman, Committee on Constituency Petitions & Grassroots Development
                </p>
                <p className="text-[10px] text-stone-400 font-mono">
                  National Assembly of Nigeria • Three Arms Zone, Abuja
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
