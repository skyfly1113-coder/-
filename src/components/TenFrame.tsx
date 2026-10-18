import React from 'react';
import { ConcreteItemId } from '../types/game';
import { ConcreteObject } from './ConcreteObject';

interface Props {
  maxCount: number; // 5 or 10
  currentCount: number;
  activeItemId: ConcreteItemId;
  onSlotClick?: (index: number) => void;
  className?: string;
}

export const TenFrame: React.FC<Props> = ({
  maxCount,
  currentCount,
  activeItemId,
  onSlotClick,
  className = '',
}) => {
  const slotsCount = maxCount <= 5 ? 5 : 10;
  const slots = Array.from({ length: slotsCount }, (_, i) => i);

  return (
    <div
      className={`bg-amber-100/60 p-3 sm:p-4 rounded-3xl border-3 border-amber-300 shadow-inner flex flex-col items-center gap-2 ${className}`}
      role="region"
      aria-label={`${slotsCount}칸 수세기 상자틀`}
    >
      <div className="flex items-center justify-between w-full px-2 text-xs font-bold text-amber-900/80">
        <span>상자 채우기 ({currentCount}/{slotsCount})</span>
        <span className="font-mono text-sm">{currentCount}개 쏙!</span>
      </div>

      <div
        className={`grid ${
          slotsCount === 5 ? 'grid-cols-5' : 'grid-cols-5 grid-rows-2'
        } gap-2 sm:gap-3 w-full max-w-2xl`}
      >
        {slots.map((idx) => {
          const isFilled = idx < currentCount;
          return (
            <div
              key={idx}
              onClick={() => onSlotClick && onSlotClick(idx)}
              className={`aspect-square rounded-2xl flex items-center justify-center border-2 border-dashed transition-all duration-300 relative ${
                isFilled
                  ? 'bg-white border-amber-400 shadow-md scale-95'
                  : 'bg-amber-50/70 border-amber-300/80'
              }`}
            >
              {isFilled ? (
                <div className="w-full h-full p-1 flex items-center justify-center">
                  <ConcreteObject
                    itemId={activeItemId}
                    size={64}
                    isCounted={false}
                    disabled
                  />
                  <span className="absolute bottom-1 right-1 bg-amber-500 text-white text-xs font-black rounded-full w-5 h-5 flex items-center justify-center shadow">
                    {idx + 1}
                  </span>
                </div>
              ) : (
                <span className="text-amber-300 text-lg sm:text-xl font-bold opacity-60">
                  {idx + 1}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
