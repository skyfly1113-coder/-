import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Star, RotateCcw, ArrowRight, Sparkles } from 'lucide-react';
import { playSuccess } from '../utils/sound';
import { speakKorean } from '../utils/speech';

interface Props {
  isOpen: boolean;
  count: number;
  itemName: string;
  unit: string;
  onReplay: () => void;
  onNext: () => void;
  useSound: boolean;
  useVoice: boolean;
  speechRate: number;
}

export const RewardModal: React.FC<Props> = ({
  isOpen,
  count,
  itemName,
  unit,
  onReplay,
  onNext,
  useSound,
  useVoice,
  speechRate,
}) => {
  useEffect(() => {
    if (isOpen) {
      playSuccess(useSound);
      speakKorean(`참 잘했어요! ${itemName}가 모두 ${count}${unit} 있어요! 정말 멋져요!`, speechRate, useVoice);

      // Launch cheerful confetti bursts
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F59E0B', '#EF4444', '#10B981', '#3B82F6', '#EC4899'],
        });
      } catch (e) {
        // Fallback gracefully
      }
    }
  }, [isOpen, count, itemName, unit, useSound, useVoice, speechRate]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-amber-300 text-center flex flex-col items-center">
        {/* Animated Celebration Icon */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-amber-100 border-4 border-amber-400 flex items-center justify-center mb-4 shadow-inner relative animate-bounce">
          <Star className="w-16 h-16 sm:w-20 sm:h-20 text-amber-500 fill-amber-400 drop-shadow" />
          <Sparkles className="w-8 h-8 text-yellow-400 absolute -top-1 -right-1 animate-spin" style={{ animationDuration: '4s' }} />
        </div>

        <h2 className="text-3xl sm:text-4xl font-black text-amber-600 mb-2 font-jua">
          참 잘했어요!
        </h2>

        <p className="text-xl sm:text-2xl font-bold text-slate-800 mb-6 font-jua">
          {itemName}가 모두 <span className="text-red-500 font-black text-3xl mx-1">{count}</span>{unit} 있어요!
        </p>

        {/* Large Accessible Action Buttons */}
        <div className="grid grid-cols-2 gap-4 w-full mt-2">
          <button
            type="button"
            onClick={onReplay}
            className="flex flex-col sm:flex-row items-center justify-center gap-2 py-4 px-4 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 font-bold text-lg sm:text-xl rounded-2xl border-2 border-slate-300 transition-all cursor-pointer shadow-sm"
          >
            <RotateCcw className="w-6 h-6 text-slate-600" />
            <span>한 번 더 하기</span>
          </button>

          <button
            type="button"
            onClick={onNext}
            className="flex flex-col sm:flex-row items-center justify-center gap-2 py-4 px-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 active:scale-95 text-slate-950 font-black text-xl rounded-2xl border-3 border-amber-300 transition-all cursor-pointer shadow-lg"
          >
            <span>다음 놀이</span>
            <ArrowRight className="w-7 h-7 text-slate-950" />
          </button>
        </div>
      </div>
    </div>
  );
};
