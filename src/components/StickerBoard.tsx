import React from 'react';
import { Star, Sparkles, X, RotateCcw } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  earnedStars: number;
  maxStars?: number;
  onReset: () => void;
}

export const StickerBoard: React.FC<Props> = ({
  isOpen,
  onClose,
  earnedStars,
  maxStars = 10,
  onReset,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-gradient-to-b from-amber-50 to-orange-50 rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-amber-300 flex flex-col items-center">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="absolute top-4 right-4 w-12 h-12 flex items-center justify-center bg-white rounded-full border-2 border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-7 h-7" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-8 h-8 text-amber-500 animate-pulse" />
          <h2 className="text-2xl sm:text-3xl font-black text-amber-800 font-jua">
            칭찬 스티커 판
          </h2>
          <Sparkles className="w-8 h-8 text-amber-500 animate-pulse" />
        </div>

        <p className="text-base text-amber-700 font-medium mb-6 text-center">
          열심히 수세기를 하고 모은 반짝반짝 별 스티커예요! ({earnedStars} / {maxStars})
        </p>

        {/* 10-Star Sticker Grid */}
        <div className="grid grid-cols-5 gap-3 sm:gap-4 w-full p-4 bg-white/90 rounded-2xl border-2 border-amber-200 shadow-inner mb-6">
          {Array.from({ length: maxStars }).map((_, idx) => {
            const hasStar = idx < earnedStars;
            return (
              <div
                key={idx}
                className={`aspect-square rounded-2xl flex flex-col items-center justify-center border-2 transition-all ${
                  hasStar
                    ? 'bg-amber-100 border-amber-400 shadow-md scale-100 animate-pulse'
                    : 'bg-slate-50 border-dashed border-slate-200'
                }`}
              >
                {hasStar ? (
                  <Star className="w-9 h-9 sm:w-11 sm:h-11 text-amber-500 fill-amber-400 drop-shadow" />
                ) : (
                  <span className="text-slate-300 font-bold text-lg font-mono">
                    {idx + 1}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between w-full gap-4">
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-3 rounded-xl border border-slate-300 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 font-bold text-sm cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>스티커 비우기</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-base shadow-md cursor-pointer"
          >
            놀이 계속하기
          </button>
        </div>
      </div>
    </div>
  );
};
