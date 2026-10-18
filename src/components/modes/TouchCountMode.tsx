import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Volume2, RotateCcw, Shuffle, CheckCircle2, PlayCircle } from 'lucide-react';
import { AccessibilitySettings, ConcreteItemId, PlacedObject } from '../../types/game';
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

export const TouchCountMode: React.FC<Props> = ({
  settings,
  activeItemOverride,
  onAddStar,
}) => {
  const [targetCount, setTargetCount] = useState<number>(3);
  const [activeItemId, setActiveItemId] = useState<ConcreteItemId>('apple');
  const [objects, setObjects] = useState<PlacedObject[]>([]);
  const [countedCount, setCountedCount] = useState<number>(0);
  const [showReward, setShowReward] = useState<boolean>(false);
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const [isReadingSequence, setIsReadingSequence] = useState<boolean>(false);
  const sequenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const maxRangeNumber = useMemo(() => {
    switch (settings.numberRange) {
      case '1-3':
        return 3;
      case '1-5':
        return 5;
      case '1-10':
      default:
        return 10;
    }
  }, [settings.numberRange]);

  const initRound = useCallback(
    (countPreset?: number) => {
      if (sequenceTimerRef.current) {
        clearTimeout(sequenceTimerRef.current);
      }
      setIsReadingSequence(false);

      let count = countPreset;
      if (count === undefined) {
        if (maxRangeNumber === 3) {
          count = Math.floor(Math.random() * 3) + 1;
        } else if (maxRangeNumber === 5) {
          count = Math.floor(Math.random() * 5) + 1;
        } else {
          count = Math.floor(Math.random() * 8) + 1;
        }
      }

      let chosenItemId: ConcreteItemId = 'apple';
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

      setTargetCount(count);
      setActiveItemId(chosenItemId);
      setObjects(newObjects);
      setCountedCount(0);
      setShowReward(false);
      setFocusedIndex(0);

      const def = getItemDef(chosenItemId);
      speakKorean(
        `화면의 ${def.name}를 하나씩 콕콕 눌러 세어보세요!`,
        settings.speechRate,
        settings.useVoice
      );
    },
    [maxRangeNumber, activeItemOverride, settings.speechRate, settings.useVoice]
  );

  useEffect(() => {
    initRound();
    return () => {
      if (sequenceTimerRef.current) {
        clearTimeout(sequenceTimerRef.current);
      }
    };
  }, [initRound]);

  const itemDef = getItemDef(activeItemId);

  // Sequentially read "하나... 둘... 셋..." slowly
  const handleReadFullSequence = () => {
    if (isReadingSequence) return;
    setIsReadingSequence(true);

    const totalToRead = countedCount > 0 ? countedCount : targetCount;
    let step = 1;

    const readStep = () => {
      if (step > totalToRead) {
        setIsReadingSequence(false);
        setFocusedIndex(-1);
        speakKorean(
          `모두 ${totalToRead}${itemDef.unit}이에요!`,
          settings.speechRate,
          settings.useVoice
        );
        return;
      }

      const currentStep = step;
      setFocusedIndex(currentStep - 1);
      playCountTone(currentStep, settings.useSound);
      // Speaks pure number: "하나.", "둘.", "셋." slowly!
      speakNumber(currentStep, settings.countingStyle, settings.speechRate, settings.useVoice);

      step++;
      const delay = Math.max(1200, Math.round(1500 / settings.speechRate));
      sequenceTimerRef.current = setTimeout(readStep, delay);
    };

    readStep();
  };

  const handleObjectClick = (index: number) => {
    if (isReadingSequence) return;
    const obj = objects[index];

    if (obj.isCounted) {
      // already counted: speak pure number slowly
      speakNumber(
        obj.orderNumber || 1,
        settings.countingStyle,
        settings.speechRate,
        settings.useVoice
      );
      playCountTone(obj.orderNumber || 1, settings.useSound);
      return;
    }

    const nextCount = countedCount + 1;
    const newObjects = [...objects];
    newObjects[index] = {
      ...obj,
      isCounted: true,
      orderNumber: nextCount,
    };

    setObjects(newObjects);
    setCountedCount(nextCount);

    // Audio & Pure Number Voice Feedback ("하나", "둘", "셋" slowly!)
    playCountTone(nextCount, settings.useSound);
    speakNumber(nextCount, settings.countingStyle, settings.speechRate, settings.useVoice);

    if (nextCount === targetCount) {
      setTimeout(() => {
        onAddStar();
        setShowReward(true);
      }, 800);
    } else {
      const nextUncounted = newObjects.findIndex((o) => !o.isCounted);
      if (nextUncounted !== -1) {
        setFocusedIndex(nextUncounted);
      }
    }
  };

  useEffect(() => {
    if (!settings.switchAccess) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        if (showReward) {
          initRound();
        } else {
          handleObjectClick(focusedIndex);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [settings.switchAccess, focusedIndex, showReward, handleObjectClick, initRound]);

  useEffect(() => {
    if (!settings.switchAccess || showReward || isReadingSequence) return;

    const interval = setInterval(() => {
      setFocusedIndex((prev) => {
        const next = (prev + 1) % objects.length;
        return next;
      });
    }, settings.switchScanSpeed * 1000);

    return () => clearInterval(interval);
  }, [settings.switchAccess, objects.length, showReward, isReadingSequence, settings.switchScanSpeed]);

  const speakPrompt = () => {
    speakKorean(
      `화면에 ${itemDef.name}가 몇 개 있을까요? 하나씩 터치해 보세요!`,
      settings.speechRate,
      settings.useVoice
    );
  };

  const handleResetCountOnly = () => {
    if (sequenceTimerRef.current) {
      clearTimeout(sequenceTimerRef.current);
    }
    setIsReadingSequence(false);
    playPop(settings.useSound);
    setObjects((prev) =>
      prev.map((o) => ({ ...o, isCounted: false, orderNumber: undefined }))
    );
    setCountedCount(0);
    setFocusedIndex(0);
    speakKorean('처음부터 다시 세어보아요!', settings.speechRate, settings.useVoice);
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
              {itemDef.name}를 하나씩 콕콕 눌러보세요!
            </h2>
            <p className="text-sm font-semibold text-amber-700">
              누르면 하나, 둘, 셋 소리와 함께 숫자가 나타나요!
            </p>
          </div>
        </div>

        {/* Live Count Status Indicator */}
        <div className="flex items-center gap-3 bg-amber-50 px-5 py-2.5 rounded-2xl border-2 border-amber-300">
          <span className="text-sm font-bold text-amber-900">지금까지 센 개수:</span>
          <span className="text-3xl font-black text-amber-600 font-mono">
            {countedCount}
          </span>
          <span className="text-sm font-bold text-amber-800">/ {targetCount}개</span>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div
        className={`w-full bg-white rounded-3xl p-6 sm:p-10 shadow-lg border-4 transition-all duration-300 flex flex-col items-center justify-center min-h-[360px] sm:min-h-[420px] ${
          settings.highContrast
            ? 'bg-slate-900 border-yellow-400 text-yellow-300'
            : 'border-amber-200'
        }`}
      >
        {/* Visual Ten-Frame (if enabled) */}
        {settings.useTenFrame && (
          <div className="w-full mb-8">
            <TenFrame
              maxCount={maxRangeNumber <= 5 ? 5 : 10}
              currentCount={countedCount}
              activeItemId={activeItemId}
            />
          </div>
        )}

        {/* Concrete Objects Display Area */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 max-w-4xl py-4">
          {objects.map((obj, idx) => {
            const isSwitchFocused = (settings.switchAccess || isReadingSequence) && idx === focusedIndex;
            return (
              <div key={obj.id} className="relative transition-transform duration-200">
                <ConcreteObject
                  itemId={obj.itemId}
                  size={targetCount <= 4 ? 140 : targetCount <= 7 ? 115 : 95}
                  isCounted={obj.isCounted}
                  orderNumber={obj.orderNumber}
                  isHighlighted={isSwitchFocused}
                  onClick={() => handleObjectClick(idx)}
                  ariaLabel={`${itemDef.name} ${idx + 1}번째`}
                />
              </div>
            );
          })}
        </div>

        {/* Helper visual hint when all counted */}
        {countedCount === targetCount && (
          <div className="mt-6 flex items-center gap-2 text-emerald-600 font-bold text-lg font-jua animate-bounce">
            <CheckCircle2 className="w-6 h-6" />
            <span>모두 세었어요! 정말 잘했어요!</span>
          </div>
        )}
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-6 w-full">
        <button
          type="button"
          onClick={handleResetCountOnly}
          className="flex items-center gap-2 py-3.5 px-6 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-base border-2 border-slate-300 shadow-sm active:scale-95 cursor-pointer"
        >
          <RotateCcw className="w-5 h-5 text-slate-500" />
          <span>다시 세기</span>
        </button>

        {/* Sequential slow read button */}
        <button
          type="button"
          onClick={handleReadFullSequence}
          disabled={isReadingSequence}
          className="flex items-center gap-2 py-3.5 px-6 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-base border-2 border-amber-300 shadow-sm active:scale-95 cursor-pointer disabled:opacity-50"
        >
          <PlayCircle className="w-5 h-5 text-amber-700" />
          <span>{isReadingSequence ? '읽어주는 중...' : '순서대로 천천히 듣기'}</span>
        </button>

        <button
          type="button"
          onClick={() => initRound()}
          className="flex items-center gap-2 py-3.5 px-8 rounded-2xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-black text-lg border-2 border-amber-400 shadow-md cursor-pointer"
        >
          <Shuffle className="w-6 h-6" />
          <span>새로운 문제</span>
        </button>
      </div>

      {/* Reward Modal */}
      <RewardModal
        isOpen={showReward}
        count={targetCount}
        itemName={itemDef.name}
        unit={itemDef.unit}
        onReplay={() => {
          handleResetCountOnly();
          setShowReward(false);
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
