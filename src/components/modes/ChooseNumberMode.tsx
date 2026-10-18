import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Volume2, Shuffle, CheckCircle2, HelpCircle } from 'lucide-react';
import { AccessibilitySettings, ConcreteItemId, PlacedObject } from '../../types/game';
import { getItemDef } from '../../data/items';
import { ConcreteObject } from '../ConcreteObject';
import { TenFrame } from '../TenFrame';
import { RewardModal } from '../RewardModal';
import { playCountTone, playGentleEncourage } from '../../utils/sound';
import { speakKorean, speakNumber, getNumberWord } from '../../utils/speech';

interface Props {
  settings: AccessibilitySettings;
  activeItemOverride: ConcreteItemId | 'random';
  onAddStar: () => void;
}

export const ChooseNumberMode: React.FC<Props> = ({
  settings,
  activeItemOverride,
  onAddStar,
}) => {
  const [targetCount, setTargetCount] = useState<number>(3);
  const [activeItemId, setActiveItemId] = useState<ConcreteItemId>('bear');
  const [objects, setObjects] = useState<PlacedObject[]>([]);
  const [options, setOptions] = useState<number[]>([2, 3, 4]);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showReward, setShowReward] = useState<boolean>(false);
  const [wrongAttempts, setWrongAttempts] = useState<number>(0);

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
      count = Math.floor(Math.random() * 3) + 1; // 1, 2, 3
    } else if (maxRangeNumber === 5) {
      count = Math.floor(Math.random() * 5) + 1; // 1 ~ 5
    } else {
      count = Math.floor(Math.random() * 8) + 1; // 1 ~ 8
    }

    // Pick item
    let chosenItemId: ConcreteItemId = 'bear';
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

    const newObjects: PlacedObject[] = Array.from({ length: count }, (_, idx) => ({
      id: `obj-${idx}-${Date.now()}`,
      index: idx,
      itemId: chosenItemId,
      isCounted: false,
    }));

    // Generate 3 choices (or 2 if range is 1-3)
    const optsSet = new Set<number>([count]);
    const maxChoice = Math.max(count + 2, maxRangeNumber);
    while (optsSet.size < (maxRangeNumber === 3 ? 2 : 3)) {
      const delta = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 2) + 1);
      const candidate = count + delta;
      if (candidate >= 1 && candidate <= maxChoice && candidate !== count) {
        optsSet.add(candidate);
      } else {
        const fallback = Math.floor(Math.random() * maxRangeNumber) + 1;
        optsSet.add(fallback);
      }
    }

    const shuffledOptions = Array.from(optsSet).sort((a, b) => a - b);

    setTargetCount(count);
    setActiveItemId(chosenItemId);
    setObjects(newObjects);
    setOptions(shuffledOptions);
    setSelectedNumber(null);
    setIsCorrect(null);
    setShowReward(false);
    setWrongAttempts(0);

    const def = getItemDef(chosenItemId);
    speakKorean(
      `${def.name}가 몇 개 있을까요? 아래에서 알맞은 숫자를 골라보세요!`,
      settings.speechRate,
      settings.useVoice
    );
  }, [maxRangeNumber, activeItemOverride, settings.speechRate, settings.useVoice]);

  useEffect(() => {
    initRound();
  }, [initRound]);

  const itemDef = getItemDef(activeItemId);

  // Student can tap objects on stage to count them if they need help
  const handleObjectTap = (index: number) => {
    const obj = objects[index];
    const newObjects = [...objects];
    const countedCount = objects.filter((o) => o.isCounted).length;
    const nextCount = obj.isCounted ? obj.orderNumber || 1 : countedCount + 1;

    newObjects[index] = {
      ...obj,
      isCounted: true,
      orderNumber: obj.orderNumber || nextCount,
    };
    setObjects(newObjects);

    playCountTone(nextCount, settings.useSound);
    speakNumber(nextCount, settings.countingStyle, settings.speechRate, settings.useVoice);
  };

  const handleSelectOption = (num: number) => {
    setSelectedNumber(num);
    if (num === targetCount) {
      setIsCorrect(true);
      speakKorean(
        `맞았어요! 정답은 ${num}개예요!`,
        settings.speechRate,
        settings.useVoice
      );
      setTimeout(() => {
        onAddStar();
        setShowReward(true);
      }, 700);
    } else {
      setIsCorrect(false);
      setWrongAttempts((prev) => prev + 1);
      playGentleEncourage(settings.useSound);
      speakKorean(
        `다시 한번 세어볼까요? ${itemDef.name}를 하나씩 눌러보세요!`,
        settings.speechRate,
        settings.useVoice
      );
    }
  };

  const speakPrompt = () => {
    speakKorean(
      `${itemDef.name}가 몇 개 있을까요? 숫자를 눌러보세요!`,
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
              {itemDef.name}가 모두 몇 개일까요?
            </h2>
            <p className="text-sm font-semibold text-amber-700">
              세어보고 아래에서 알맞은 숫자 카드를 눌러보세요!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-2xl border border-blue-200 text-blue-700 font-bold text-sm">
          <HelpCircle className="w-5 h-5" />
          <span>사물을 터치하면 직접 셀 수 있어요</span>
        </div>
      </div>

      {/* Main Object Display Stage */}
      <div
        className={`w-full bg-white rounded-3xl p-6 sm:p-10 shadow-lg border-4 transition-all duration-300 flex flex-col items-center justify-center min-h-[320px] sm:min-h-[380px] ${
          settings.highContrast
            ? 'bg-slate-900 border-yellow-400 text-yellow-300'
            : 'border-amber-200'
        }`}
      >
        {/* Ten Frame */}
        {settings.useTenFrame && (
          <div className="w-full mb-8">
            <TenFrame
              maxCount={maxRangeNumber <= 5 ? 5 : 10}
              currentCount={objects.filter((o) => o.isCounted).length}
              activeItemId={activeItemId}
            />
          </div>
        )}

        {/* Concrete Objects */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 max-w-4xl py-4">
          {objects.map((obj, idx) => (
            <div key={obj.id} className="relative transition-transform duration-200">
              <ConcreteObject
                itemId={obj.itemId}
                size={targetCount <= 4 ? 140 : targetCount <= 7 ? 115 : 95}
                isCounted={obj.isCounted}
                orderNumber={obj.orderNumber}
                onClick={() => handleObjectTap(idx)}
                ariaLabel={`${itemDef.name} ${idx + 1}번째`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Large Accessible Number Cards */}
      <div className="w-full mt-6 flex flex-col items-center">
        <span className="text-sm font-bold text-slate-600 mb-3 font-jua text-lg">
          정답 숫자를 콕 눌러보세요:
        </span>

        <div className="flex items-center justify-center gap-4 sm:gap-8 w-full max-w-2xl">
          {options.map((num) => {
            const isChosen = selectedNumber === num;
            const isChoiceCorrect = isChosen && isCorrect === true;
            const isChoiceWrong = isChosen && isCorrect === false;

            return (
              <button
                key={num}
                type="button"
                onClick={() => handleSelectOption(num)}
                className={`flex-1 min-w-[90px] max-w-[160px] py-6 sm:py-8 rounded-3xl font-black text-4xl sm:text-6xl font-jua transition-all cursor-pointer shadow-lg border-4 flex flex-col items-center justify-center gap-2 ${
                  isChoiceCorrect
                    ? 'bg-emerald-500 text-white border-emerald-600 scale-105 shadow-emerald-200'
                    : isChoiceWrong
                    ? 'bg-amber-100 text-amber-800 border-amber-400 scale-95 animate-shake'
                    : 'bg-white hover:bg-amber-50 text-slate-800 border-amber-300 hover:border-amber-400 hover:scale-105 active:scale-95'
                }`}
              >
                <span>{num}</span>
                <span className="text-sm sm:text-base font-semibold text-slate-600 font-sans">
                  {getNumberWord(num, settings.countingStyle)}
                </span>
              </button>
            );
          })}
        </div>

        {/* Gentle guidance when student makes an attempt */}
        {isCorrect === false && (
          <div className="mt-4 p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-800 font-bold text-base flex items-center gap-2 animate-bounce">
            <span>괜찮아요! 위의 {itemDef.name}를 하나씩 눌러보며 다시 세어보세요!</span>
          </div>
        )}
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
          setObjects((prev) =>
            prev.map((o) => ({ ...o, isCounted: false, orderNumber: undefined }))
          );
          setSelectedNumber(null);
          setIsCorrect(null);
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
