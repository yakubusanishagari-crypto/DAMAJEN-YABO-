import React from 'react';
import { X, ShieldCheck } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#FAF9F5] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-[#C6A15B]/30 max-h-[90vh] flex flex-col">
        <div className="bg-[#103C2E] text-white p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ShieldCheck className="w-6 h-6 text-[#C6A15B]" />
            <h3 className="text-xl font-bold font-['Manrope']">Privacy Policy & Data Protection</h3>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-2">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto space-y-4 text-[#242824] text-sm leading-relaxed">
          <p><strong>Effective Date:</strong> October 2025</p>
          <p>The Office of Hon. Umar Yusuf (Danmaje Yabo), Member representing Yabo/Shagari Federal Constituency at the National Assembly Abuja, is committed to safeguarding the privacy and personal data of all constituents and visitors.</p>
          
          <h4 className="font-bold text-base text-[#103C2E] mt-4">1. Information We Collect</h4>
          <p>When you submit enquiries, register for empowerment programmes, or report community issues through our official portal, we may collect your name, email address, phone number, ward/town, and specific feedback details.</p>

          <h4 className="font-bold text-base text-[#103C2E] mt-4">2. How We Use Information</h4>
          <p>Data collected is used strictly for official constituency correspondence, processing empowerment applications, addressing reported community concerns, and providing updates on legislative activities.</p>

          <h4 className="font-bold text-base text-[#103C2E] mt-4">3. Data Security & Confidentiality</h4>
          <p>We implement robust technical and administrative safeguards to protect your personal information from unauthorized access, loss, or disclosure. Private submissions are restricted to authorized office personnel only.</p>

          <h4 className="font-bold text-base text-[#103C2E] mt-4">4. Your Rights</h4>
          <p>Constituents have the right to request access to their submitted records, correct inaccuracies, or request the deletion of personal data by contacting our official constituency office in Abuja or Yabo.</p>
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
