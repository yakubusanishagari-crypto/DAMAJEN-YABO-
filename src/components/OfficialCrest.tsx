import React, { useState } from 'react';

interface Props {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
}

export const OfficialCrest: React.FC<Props> = ({ className = '', size = 'md' }) => {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-24 h-24',
    '3xl': 'w-32 h-32'
  };

  return (
    <div 
      className={`relative rounded-full flex items-center justify-center bg-[#07241A] border-2 border-[#D4AF37] shadow-xl group-hover:border-[#F3E5AB] transition-all duration-300 overflow-hidden shrink-0 ${sizeClasses[size]} ${className}`}
      title="Official Seal - Hon. Umar Yusuf (Danmaje Yabo) - Yabo/Shagari Federal Constituency"
    >
      {!imgError ? (
        <img
          src="/official_logo.png"
          alt="Hon. Umar Yusuf Yabo - Official Constituency Seal"
          loading="eager"
          decoding="sync"
          className="w-full h-full object-cover rounded-full"
          onError={() => setImgError(true)}
        />
      ) : (
        /* Golden outer glow and inner ring fallback */
        <div className="w-full h-full flex items-center justify-center p-1 bg-gradient-to-br from-[#0B3B2B] to-[#07241A]">
          <svg 
            viewBox="0 0 100 100" 
            className="w-4/5 h-4/5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]"
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="50" cy="50" r="46" stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.6" />
            <path d="M50 14 C48 18, 43 21, 38 22 C42 24, 46 25, 49 28 C50 25, 51 25, 52 28 C55 25, 59 24, 63 22 C58 21, 53 18, 51 14 Z" fill="#D4AF37" />
            <circle cx="50.5" cy="19" r="2.5" fill="#E53E3E" />
            <path d="M26 38 C28 32, 33 28, 38 32 C37 36, 35 44, 37 54 C35 56, 33 64, 35 74 C31 71, 28 66, 28 59 C25 57, 24 51, 26 38 Z" fill="#FAF9F5" stroke="#C6A15B" strokeWidth="1" />
            <path d="M74 38 C72 32, 67 28, 62 32 C63 36, 65 44, 63 54 C65 56, 67 64, 65 74 C69 71, 72 66, 72 59 C75 57, 76 51, 74 38 Z" fill="#FAF9F5" stroke="#C6A15B" strokeWidth="1" />
            <path d="M38 36 H62 C62 36, 63 54, 50 68 C37 54, 38 36, 38 36 Z" fill="#0D1F17" stroke="#D4AF37" strokeWidth="1.5" />
            <path d="M44 37 L50 49 L56 37 M50 49 V64" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M28 76 Q50 82 72 76 Q50 86 28 76 Z" fill="#D4AF37" />
            <rect x="42" y="79" width="5" height="2" fill="#008751" />
            <rect x="47" y="79" width="6" height="2" fill="#FFFFFF" />
            <rect x="53" y="79" width="5" height="2" fill="#008751" />
          </svg>
        </div>
      )}
    </div>
  );
};
