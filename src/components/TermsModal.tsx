import React from 'react';
import { X, FileText } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#FAF9F5] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-[#C6A15B]/30 max-h-[90vh] flex flex-col">
        <div className="bg-[#103C2E] text-white p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6 text-[#C6A15B]" />
            <h3 className="text-xl font-bold font-['Manrope']">Terms of Use</h3>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-2">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto space-y-4 text-[#242824] text-sm leading-relaxed">
          <p><strong>Last Updated:</strong> October 2025</p>
          <p>Welcome to the official digital portal of Hon. Umar Yusuf (Danmaje Yabo), Member representing Yabo/Shagari Federal Constituency, National Assembly Abuja.</p>
          
          <h4 className="font-bold text-base text-[#103C2E] mt-4">1. Acceptance of Terms</h4>
          <p>By accessing and using this website, you agree to comply with these terms of use and all applicable Nigerian laws and regulations regarding public representation portals.</p>

          <h4 className="font-bold text-base text-[#103C2E] mt-4">2. Official Content & Intellectual Property</h4>
          <p>All official statements, legislative records, project reports, photographs, and media published on this portal are authorized by the office of Hon. Umar Yusuf Danmaje Yabo. Unauthorized reproduction or malicious alteration of official content is strictly prohibited.</p>

          <h4 className="font-bold text-base text-[#103C2E] mt-4">3. Constituency Services & Applications</h4>
          <p>Submitting applications for empowerment programmes or community feedback requests through this platform constitutes a declaration of accurate information. Submission does not automatically guarantee selection or financial disbursement unless verified and approved by the constituency selection committee.</p>

          <h4 className="font-bold text-base text-[#103C2E] mt-4">4. Limitation of Liability</h4>
          <p>The constituency office maintains this platform to ensure transparency and civic engagement but shall not be held liable for technical interruptions or external network delays.</p>
        </div>
        <div className="bg-gray-100 p-4 border-t border-gray-200 flex justify-end">
          <button onClick={onClose} className="bg-[#103C2E] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#09291F] transition">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
