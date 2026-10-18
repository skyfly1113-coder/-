import React from 'react';
import { ConcreteItemId } from '../types/game';

interface Props {
  itemId: ConcreteItemId;
  size?: number; // width/height in px
  isCounted?: boolean;
  orderNumber?: number; // 1, 2, 3...
  isHighlighted?: boolean;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
}

export const ConcreteObject: React.FC<Props> = ({
  itemId,
  size = 110,
  isCounted = false,
  orderNumber,
  isHighlighted = false,
  onClick,
  className = '',
  disabled = false,
  ariaLabel,
}) => {
  const renderSvg = () => {
    switch (itemId) {
      case 'apple':
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md overflow-visible">
            {/* Stem */}
            <path d="M60 22 C60 10 68 8 72 6" stroke="#5C3A21" strokeWidth="6" strokeLinecap="round" fill="none" />
            {/* Leaf */}
            <path d="M62 18 C75 12 85 22 75 28 C65 28 62 20 62 18 Z" fill="#22C55E" stroke="#15803D" strokeWidth="2" />
            {/* Apple Body */}
            <path
              d="M60 32 C38 18 12 36 18 70 C22 96 46 112 60 112 C74 112 98 96 102 70 C108 36 82 18 60 32 Z"
              fill="#EF4444"
              stroke="#B91C1C"
              strokeWidth="4"
            />
            {/* Highlight */}
            <ellipse cx="38" cy="46" rx="8" ry="14" transform="rotate(-25 38 46)" fill="#F87171" opacity="0.75" />
            {/* Eyes */}
            <circle cx="48" cy="64" r="5" fill="#1E293B" />
            <circle cx="72" cy="64" r="5" fill="#1E293B" />
            <circle cx="46" cy="62" r="1.8" fill="#FFFFFF" />
            <circle cx="70" cy="62" r="1.8" fill="#FFFFFF" />
            {/* Blush */}
            <ellipse cx="38" cy="72" rx="6" ry="3.5" fill="#FDA4AF" />
            <ellipse cx="82" cy="72" rx="6" ry="3.5" fill="#FDA4AF" />
            {/* Smile */}
            <path d="M52 74 Q60 84 68 74" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          </svg>
        );

      case 'strawberry':
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md overflow-visible">
            {/* Leaves */}
            <path d="M60 25 L45 14 L52 28 L32 24 L48 35 L60 30 L72 35 L88 24 L68 28 L75 14 Z" fill="#16A34A" stroke="#14532D" strokeWidth="2.5" />
            {/* Strawberry Body */}
            <path
              d="M60 30 C32 30 20 60 32 90 C42 112 55 116 60 116 C65 116 78 112 88 90 C100 60 88 30 60 30 Z"
              fill="#F43F5E"
              stroke="#BE123C"
              strokeWidth="4"
            />
            {/* Seeds */}
            <ellipse cx="40" cy="50" rx="2" ry="3" fill="#FDE047" />
            <ellipse cx="80" cy="50" rx="2" ry="3" fill="#FDE047" />
            <ellipse cx="34" cy="78" rx="2" ry="3" fill="#FDE047" />
            <ellipse cx="86" cy="78" rx="2" ry="3" fill="#FDE047" />
            <ellipse cx="60" cy="98" rx="2" ry="3" fill="#FDE047" />
            {/* Eyes */}
            <circle cx="48" cy="66" r="4.5" fill="#1E293B" />
            <circle cx="72" cy="66" r="4.5" fill="#1E293B" />
            <circle cx="46.5" cy="64.5" r="1.5" fill="#FFFFFF" />
            <circle cx="70.5" cy="64.5" r="1.5" fill="#FFFFFF" />
            {/* Cheeks & Smile */}
            <circle cx="40" cy="74" r="5" fill="#FDA4AF" />
            <circle cx="80" cy="74" r="5" fill="#FDA4AF" />
            <path d="M53 74 Q60 82 67 74" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" fill="none" />
          </svg>
        );

      case 'banana':
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md overflow-visible">
            {/* Stem */}
            <path d="M22 48 L14 42 C12 40 10 44 14 48 L22 54 Z" fill="#65A30D" stroke="#3F6212" strokeWidth="2" />
            {/* Banana Body */}
            <path
              d="M18 48 C30 82 72 108 108 82 C92 102 44 98 22 68 C16 60 16 52 18 48 Z"
              fill="#FBBF24"
              stroke="#D97706"
              strokeWidth="4"
            />
            {/* Outer banana peel curve */}
            <path
              d="M18 48 C36 88 80 108 112 80 C84 94 38 82 22 50 Z"
              fill="#FDE047"
            />
            {/* Eyes */}
            <circle cx="56" cy="74" r="4.5" fill="#1E293B" />
            <circle cx="74" cy="76" r="4.5" fill="#1E293B" />
            <circle cx="54.5" cy="72.5" r="1.5" fill="#FFFFFF" />
            <circle cx="72.5" cy="74.5" r="1.5" fill="#FFFFFF" />
            {/* Smile */}
            <path d="M62 82 Q67 88 72 83" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" fill="none" />
          </svg>
        );

      case 'bear':
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md overflow-visible">
            {/* Ears */}
            <circle cx="32" cy="34" r="18" fill="#B45309" stroke="#78350F" strokeWidth="3.5" />
            <circle cx="32" cy="34" r="10" fill="#FDE68A" />
            <circle cx="88" cy="34" r="18" fill="#B45309" stroke="#78350F" strokeWidth="3.5" />
            <circle cx="88" cy="34" r="10" fill="#FDE68A" />
            {/* Head */}
            <circle cx="60" cy="62" r="42" fill="#D97706" stroke="#92400E" strokeWidth="4" />
            {/* Muzzle */}
            <ellipse cx="60" cy="72" rx="20" ry="15" fill="#FEF3C7" />
            {/* Nose */}
            <ellipse cx="60" cy="66" rx="8" ry="6" fill="#451A03" />
            {/* Mouth */}
            <path d="M60 72 L60 79 M53 79 Q60 86 67 79" stroke="#451A03" strokeWidth="3" strokeLinecap="round" fill="none" />
            {/* Eyes */}
            <circle cx="45" cy="54" r="5" fill="#1E293B" />
            <circle cx="75" cy="54" r="5" fill="#1E293B" />
            <circle cx="43" cy="52" r="1.8" fill="#FFFFFF" />
            <circle cx="73" cy="52" r="1.8" fill="#FFFFFF" />
            {/* Cheeks */}
            <circle cx="32" cy="68" r="6" fill="#FCA5A5" opacity="0.8" />
            <circle cx="88" cy="68" r="6" fill="#FCA5A5" opacity="0.8" />
          </svg>
        );

      case 'puppy':
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md overflow-visible">
            {/* Ears */}
            <path d="M26 38 C14 42 12 70 24 82 C28 72 32 50 26 38 Z" fill="#92400E" stroke="#78350F" strokeWidth="3" />
            <path d="M94 38 C106 42 108 70 96 82 C92 72 88 50 94 38 Z" fill="#92400E" stroke="#78350F" strokeWidth="3" />
            {/* Head */}
            <circle cx="60" cy="60" r="40" fill="#F59E0B" stroke="#B45309" strokeWidth="4" />
            {/* Spot over eye */}
            <ellipse cx="44" cy="52" rx="14" ry="12" fill="#D97706" />
            {/* Muzzle */}
            <ellipse cx="60" cy="74" rx="18" ry="13" fill="#FFFBEB" />
            {/* Nose */}
            <ellipse cx="60" cy="68" rx="8" ry="5.5" fill="#1E293B" />
            {/* Mouth & Tongue */}
            <path d="M60 73 L60 80 M54 80 Q60 85 66 80" stroke="#1E293B" strokeWidth="2.8" strokeLinecap="round" fill="none" />
            <path d="M57 82 C57 90 63 90 63 82 Z" fill="#F43F5E" />
            {/* Eyes */}
            <circle cx="44" cy="52" r="4.8" fill="#1E293B" />
            <circle cx="76" cy="52" r="4.8" fill="#1E293B" />
            <circle cx="42.5" cy="50" r="1.8" fill="#FFFFFF" />
            <circle cx="74.5" cy="50" r="1.8" fill="#FFFFFF" />
          </svg>
        );

      case 'duck':
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md overflow-visible">
            {/* Tail */}
            <path d="M24 76 C12 68 14 58 26 62 Z" fill="#FACC15" stroke="#CA8A04" strokeWidth="3" />
            {/* Body */}
            <path d="M24 72 C24 94 56 108 88 94 C104 84 104 68 88 64 C64 60 36 60 24 72 Z" fill="#FACC15" stroke="#CA8A04" strokeWidth="3.5" />
            {/* Head */}
            <circle cx="78" cy="46" r="22" fill="#FDE047" stroke="#CA8A04" strokeWidth="3.5" />
            {/* Beak */}
            <path d="M96 46 C112 46 116 54 98 58 Z" fill="#EA580C" stroke="#C2410C" strokeWidth="2.5" />
            {/* Eye */}
            <circle cx="82" cy="42" r="4.5" fill="#1E293B" />
            <circle cx="80.5" cy="40.5" r="1.6" fill="#FFFFFF" />
            {/* Cheeks */}
            <circle cx="74" cy="52" r="4" fill="#FDA4AF" />
            {/* Wing */}
            <path d="M46 72 C54 64 74 64 72 82 C60 88 48 84 46 72 Z" fill="#EAB308" stroke="#CA8A04" strokeWidth="2.5" />
          </svg>
        );

      case 'car':
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md overflow-visible">
            {/* Car Cabin */}
            <path d="M34 56 Q44 28 66 28 Q84 28 92 56 Z" fill="#60A5FA" stroke="#1D4ED8" strokeWidth="3" />
            {/* Windows */}
            <path d="M44 54 Q48 35 62 35 L62 54 Z" fill="#DBEAFE" stroke="#2563EB" strokeWidth="2" />
            <path d="M68 54 L68 35 Q80 35 84 54 Z" fill="#DBEAFE" stroke="#2563EB" strokeWidth="2" />
            {/* Car Body */}
            <rect x="14" y="54" width="92" height="32" rx="12" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="3.5" />
            {/* Headlights */}
            <circle cx="100" cy="66" r="5" fill="#FEF08A" stroke="#CA8A04" strokeWidth="1.5" />
            <circle cx="20" cy="66" r="4" fill="#F87171" stroke="#B91C1C" strokeWidth="1.5" />
            {/* Wheels */}
            <circle cx="36" cy="88" r="14" fill="#334155" stroke="#0F172A" strokeWidth="3" />
            <circle cx="36" cy="88" r="6" fill="#E2E8F0" />
            <circle cx="84" cy="88" r="14" fill="#334155" stroke="#0F172A" strokeWidth="3" />
            <circle cx="84" cy="88" r="6" fill="#E2E8F0" />
            {/* Smiley on door */}
            <path d="M52 68 Q60 76 68 68" stroke="#1E3A8A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </svg>
        );

      case 'star':
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md overflow-visible">
            {/* Star polygon with friendly rounded style */}
            <path
              d="M60 14 L73 44 L106 48 L81 70 L88 102 L60 86 L32 102 L39 70 L14 48 L47 44 Z"
              fill="#FBBF24"
              stroke="#D97706"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            {/* Shimmer */}
            <ellipse cx="60" cy="35" rx="4" ry="10" fill="#FEF3C7" opacity="0.8" />
            {/* Eyes */}
            <circle cx="48" cy="62" r="5" fill="#1E293B" />
            <circle cx="72" cy="62" r="5" fill="#1E293B" />
            <circle cx="46.5" cy="60" r="1.8" fill="#FFFFFF" />
            <circle cx="70.5" cy="60" r="1.8" fill="#FFFFFF" />
            {/* Cheeks */}
            <circle cx="38" cy="70" r="5" fill="#FDA4AF" />
            <circle cx="82" cy="70" r="5" fill="#FDA4AF" />
            {/* Smile */}
            <path d="M52 72 Q60 82 68 72" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" fill="none" />
          </svg>
        );

      case 'cookie':
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md overflow-visible">
            {/* Cookie Body */}
            <circle cx="60" cy="60" r="44" fill="#D97706" stroke="#92400E" strokeWidth="4" />
            {/* Chocolate Chips */}
            <circle cx="38" cy="40" r="6" fill="#451A03" />
            <circle cx="82" cy="42" r="5" fill="#451A03" />
            <circle cx="32" cy="74" r="5.5" fill="#451A03" />
            <circle cx="86" cy="74" r="5" fill="#451A03" />
            <circle cx="60" cy="92" r="6" fill="#451A03" />
            {/* Eyes */}
            <circle cx="48" cy="58" r="4.5" fill="#1E293B" />
            <circle cx="72" cy="58" r="4.5" fill="#1E293B" />
            <circle cx="46.5" cy="56" r="1.5" fill="#FFFFFF" />
            <circle cx="70.5" cy="56" r="1.5" fill="#FFFFFF" />
            {/* Smile */}
            <path d="M54 68 Q60 76 66 68" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" fill="none" />
          </svg>
        );

      case 'carrot':
        return (
          <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md overflow-visible">
            {/* Green Tops */}
            <path d="M60 22 C52 8 42 12 50 26 C58 8 68 8 64 26 C72 10 82 14 70 26" fill="none" stroke="#16A34A" strokeWidth="4.5" strokeLinecap="round" />
            {/* Carrot Root */}
            <path
              d="M40 28 C34 32 36 40 44 66 C52 94 58 114 60 114 C62 114 68 94 76 66 C84 40 86 32 80 28 C74 24 46 24 40 28 Z"
              fill="#F97316"
              stroke="#C2410C"
              strokeWidth="4"
            />
            {/* Texture marks */}
            <path d="M42 42 L52 42 M70 54 L80 54 M46 68 L56 68 M66 82 L74 82" stroke="#EA580C" strokeWidth="2.5" strokeLinecap="round" />
            {/* Eyes */}
            <circle cx="52" cy="48" r="4" fill="#1E293B" />
            <circle cx="68" cy="48" r="4" fill="#1E293B" />
            <circle cx="50.5" cy="46.5" r="1.4" fill="#FFFFFF" />
            <circle cx="66.5" cy="46.5" r="1.4" fill="#FFFFFF" />
            {/* Smile */}
            <path d="M55 58 Q60 64 65 58" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </svg>
        );

      default:
        return null;
    }
  };

  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-label={ariaLabel || `${itemId} 구체물`}
      style={{ width: `${size}px`, height: `${size}px` }}
      className={`relative inline-flex items-center justify-center p-2 rounded-3xl transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-500 cursor-pointer ${
        isCounted
          ? 'scale-105 shadow-xl bg-amber-50 ring-4 ring-amber-400'
          : isHighlighted
          ? 'scale-110 shadow-lg ring-4 ring-blue-400 animate-pulse bg-blue-50'
          : 'hover:scale-105 active:scale-95 bg-white/80 hover:bg-white shadow-md'
      } ${className}`}
    >
      {/* SVG Image */}
      <div className="w-full h-full flex items-center justify-center transition-transform duration-200">
        {renderSvg()}
      </div>

      {/* Big Bright Order Number Badge when counted */}
      {isCounted && orderNumber !== undefined && (
        <span
          className="absolute -top-2 -right-2 min-w-10 min-h-10 px-2 flex items-center justify-center bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 font-black text-2xl rounded-full border-3 border-white shadow-lg animate-bounce"
          style={{ animationIterationCount: 2 }}
        >
          {orderNumber}
        </span>
      )}
    </button>
  );
};
