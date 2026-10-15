import React from 'react';
import { X, Eye } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AccessibilityModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#FAF9F5] w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-[#C6A15B]/30 max-h-[90vh] flex flex-col">
        <div className="bg-[#103C2E] text-white p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Eye className="w-6 h-6 text-[#C6A15B]" />
            <h3 className="text-xl font-bold font-['Manrope']">Accessibility Statement</h3>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-2">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto space-y-4 text-[#242824] text-sm leading-relaxed">
          <p><strong>Commitment to Digital Inclusion:</strong></p>
          <p>The official website of Hon. Umar Yusuf (Danmaje Yabo) is committed to ensuring digital accessibility for all citizens, including individuals with visual, auditory, motor, or cognitive disabilities.</p>
          
          <h4 className="font-bold text-base text-[#103C2E] mt-4">1. Standards Compliance</h4>
          <p>We strive to adhere to WCAG 2.2 Level AA guidelines, ensuring high color contrast ratios, scalable typography, keyboard navigation support, and descriptive alternative text for all official photographs and project media.</p>

          <h4 className="font-bold text-base text-[#103C2E] mt-4">2. Assistive Features</h4>
          <p>Our responsive layout is optimized for screen readers, mobile magnifiers, and touch navigation across Android, iOS, tablet, and desktop devices.</p>

          <h4 className="font-bold text-base text-[#103C2E] mt-4">3. Feedback & Assistance</h4>
          <p>If you encounter any accessibility barriers while browsing our portal or require assistance accessing legislative reports or empowerment forms, please contact our constituency help desk at the National Assembly Abuja or via our contact portal.</p>
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
