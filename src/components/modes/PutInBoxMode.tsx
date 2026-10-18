import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Volume2, Shuffle, Plus, Minus, Check, Sparkles } from 'lucide-react';
import { AccessibilitySettings, ConcreteItemId } from '../../types/game';
import { getItemDef } from '../../data/items';
import { ConcreteObject } from '../ConcreteObject';
import { TenFrame } from '../TenFrame';
import { RewardModal } from '../RewardModal';
import { playCountTone, playPop } from '../../utils/sound';
import { speakKorean, speakNumber, getNumberWord } from '../../utils/speech';

interface Props {
  settings: AccessibilitySettings;
  activeItemOverride: ConcreteItemId | 'random';
  onAddStar: () => void;
}

export const PutInBoxMode: React.FC<Props> = ({
  settings,
  activeItemOverride,
  onAddStar,
}) => {
  const [targetCount, setTargetCount] = useState<number>(3);
  const [activeItemId, setActiveItemId] = useState<ConcreteItemId>('duck');
  const [inBoxCount, setInBoxCount] = useState<number>(0);
  const [showReward, setShowReward] = useState<boolean>(false);

  const maxRangeNumber = useMemo(() => {
    switch (settings.numberRange) {
      case '1-3':
        return 3;
      case '1-5':
        return 5;
      case '1-10':
      default:
        return 8;
    }
  }, [settings.numberRange]);

  const initRound = useCallback(() => {
    let count: number;
    if (maxRangeNumber === 3) {
      count = Math.floor(Math.random() * 3) + 1;
    } else if (maxRangeNumber === 5) {
      count = Math.floor(Math.random() * 5) + 1;
    } else {
      count = Math.floor(Math.random() * 6) + 1; // 1 ~ 6
    }

    let chosenItemId: ConcreteItemId = 'duck';
    if (activeItemOverride === 'random') {
      const itemIds: ConcreteItemId[] = [
        'apple',
        'bear',
        'strawberry',
        'duck',
        'car',
        'puppy',
        'banana',
        'star',
        'cookie',
        'carrot',
      ];
      chosenItemId = itemIds[Math.floor(Math.random() * itemIds.length)];
    } else {
      chosenItemId = activeItemOverride;
    }

    setTargetCount(count);
    setActiveItemId(chosenItemId);
    setInBoxCount(0);
    setShowReward(false);

    const def = getItemDef(chosenItemId);
    speakKorean(
      `바구니에 ${def.name} ${count}${def.unit}을 쏙 담아보세요!`,
      settings.speechRate,
      settings.useVoice
    );
  }, [maxRangeNumber, activeItemOverride, settings.speechRate, settings.useVoice]);

  useEffect(() => {
    initRound();
  }, [initRound]);

  const itemDef = getItemDef(activeItemId);

  const handleAddItem = () => {
    if (inBoxCount >= 10) return;
    const next = inBoxCount + 1;
    setInBoxCount(next);

    playCountTone(next, settings.useSound);
    speakNumber(next, settings.countingStyle, settings.speechRate, settings.useVoice);

    if (next === targetCount) {
      setTimeout(() => {
        onAddStar();
        setShowReward(true);
      }, 700);
    }
  };

  const handleRemoveItem = () => {
    if (inBoxCount <= 0) return;
    const next = inBoxCount - 1;
    setInBoxCount(next);
    playPop(settings.useSound);
    if (next > 0) {
      const numWord = getNumberWord(next, settings.countingStyle);
      speakKorean(`${numWord}개 남았어요`, settings.speechRate, settings.useVoice);
    } else {
      speakKorean('바구니가 비었어요', settings.speechRate, settings.useVoice);
    }
  };

  const speakPrompt = () => {
    speakKorean(
      `바구니에 ${itemDef.name} ${targetCount}${itemDef.unit}을 담아보세요!`,
      settings.speechRate,
      settings.useVoice
    );
  };

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto px-4 py-4 sm:py-6">
      {/* Visual Instruction Banner */}
      <div className="w-full bg-white rounded-3xl p-4 sm:p-5 shadow-sm border-2 border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={speakPrompt}
            aria-label="안내 음성 다시 듣기"
            className="w-14 h-14 rounded-2xl bg-amber-100 hover:bg-amber-200 active:scale-95 text-amber-700 flex items-center justify-center transition-all cursor-pointer shadow-sm border border-amber-300"
          >
            <Volume2 className="w-8 h-8" />
          </button>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800 font-jua">
              바구니에 {itemDef.name}{' '}
              <span className="text-red-500 text-2xl sm:text-3xl underline decoration-wavy decoration-amber-400">
                {targetCount}{itemDef.unit}
              </span>
              을 담아보세요!
            </h2>
            <p className="text-sm font-semibold text-amber-700">
              위의 사물을 누르면 바구니에 쏙 들어갑니다!
            </p>
          </div>
        </div>

        {/* Live Counter Badge */}
        <div className="flex items-center gap-3 bg-amber-50 px-5 py-2.5 rounded-2xl border-2 border-amber-300">
          <span className="text-sm font-bold text-amber-900">담은 개수:</span>
          <span className="text-3xl font-black text-amber-600 font-mono">
            {inBoxCount}
          </span>
          <span className="text-sm font-bold text-amber-800">/ 목표 {targetCount}개</span>
        </div>
      </div>

      {/* Ten-Frame if enabled */}
      {settings.useTenFrame && (
        <div className="w-full mb-6">
          <TenFrame
            maxCount={maxRangeNumber <= 5 ? 5 : 10}
            currentCount={inBoxCount}
            activeItemId={activeItemId}
          />
        </div>
      )}

      {/* Main Interactive Stage: Source Shelf (Top) and Basket (Bottom) */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* Left: Source Supply Area */}
        <div className="bg-white rounded-3xl p-6 shadow-md border-3 border-amber-200 flex flex-col items-center justify-between min-h-[300px]">
          <div className="w-full text-center pb-2 border-b border-slate-100">
            <span className="text-base font-bold text-slate-700 font-jua">
              가져올 {itemDef.name}
            </span>
          </div>

          {/* Big Clickable Supply Source */}
          <div className="my-auto flex flex-col items-center py-4">
            <div className="transform hover:scale-105 active:scale-95 transition-transform">
              <ConcreteObject
                itemId={activeItemId}
                size={140}
                onClick={handleAddItem}
                ariaLabel={`${itemDef.name} 바구니에 담기`}
              />
            </div>
            <span className="text-xs font-bold text-slate-500 mt-2">
              (터치하면 바구니에 쏙 들어가요!)
            </span>
          </div>

          {/* Big Accessible +1 Button */}
          <button
            type="button"
            onClick={handleAddItem}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 active:scale-95 text-slate-950 font-black text-xl shadow-md border-2 border-amber-300 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-6 h-6" />
            <span>바구니에 1개 넣기</span>
          </button>
        </div>

        {/* Right: The Target Basket */}
        <div className="bg-gradient-to-b from-amber-50 to-orange-100/60 rounded-3xl p-6 shadow-md border-4 border-amber-300 flex flex-col items-center justify-between min-h-[300px] relative overflow-hidden">
          <div className="w-full flex items-center justify-between pb-2 border-b border-amber-200/80">
            <span className="text-base font-black text-amber-900 font-jua">
              내 바구니 ({inBoxCount}개)
            </span>
            {inBoxCount > 0 && (
              <button
                type="button"
                onClick={handleRemoveItem}
                aria-label="하나 빼기"
                className="flex items-center gap-1 px-3 py-1 bg-white hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-700 border border-slate-300 shadow-sm cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
                <span>1개 빼기</span>
              </button>
            )}
          </div>

          {/* Items inside basket */}
          <div className="w-full flex-1 flex flex-wrap items-center justify-center gap-3 p-4 min-h-[160px] my-auto">
            {inBoxCount === 0 ? (
              <div className="flex flex-col items-center justify-center text-amber-600/70 py-8">
                <span className="text-4xl mb-2">🧺</span>
                <span className="font-bold text-sm">바구니가 비어 있어요. 쏙 넣어보세요!</span>
              </div>
            ) : (
              Array.from({ length: inBoxCount }).map((_, idx) => (
                <div key={idx} className="relative animate-bounce" style={{ animationIterationCount: 1 }}>
                  <ConcreteObject
                    itemId={activeItemId}
                    size={76}
                    isCounted={true}
                    orderNumber={idx + 1}
                    onClick={handleRemoveItem}
                    ariaLabel={`바구니 속 ${idx + 1}번째 ${itemDef.name}`}
                  />
                </div>
              ))
            )}
          </div>

          {/* Progress Indicator */}
          <div className="w-full pt-3 border-t border-amber-200/80 text-center">
            {inBoxCount === targetCount ? (
              <span className="text-base font-black text-emerald-600 flex items-center justify-center gap-1 animate-pulse font-jua">
                <Check className="w-5 h-5" />
                <span>와! 딱 맞게 담았어요!</span>
              </span>
            ) : inBoxCount > targetCount ? (
              <span className="text-sm font-bold text-amber-800">
                조금 많아요! 빼기 버튼을 눌러보세요.
              </span>
            ) : (
              <span className="text-sm font-semibold text-amber-800">
                {targetCount - inBoxCount}개 더 넣으면 완성돼요!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Button */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          type="button"
          onClick={initRound}
          className="flex items-center gap-2 py-3.5 px-8 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-black text-lg border-2 border-amber-400 shadow-md cursor-pointer"
        >
          <Shuffle className="w-6 h-6" />
          <span>다른 문제 풀기</span>
        </button>
      </div>

      {/* Reward Modal */}
      <RewardModal
        isOpen={showReward}
        count={targetCount}
        itemName={itemDef.name}
        unit={itemDef.unit}
        onReplay={() => {
          setShowReward(false);
          setInBoxCount(0);
        }}
        onNext={() => {
          setShowReward(false);
          initRound();
        }}
        useSound={settings.useSound}
        useVoice={settings.useVoice}
        speechRate={settings.speechRate}
      />
    </div>
  );
};
