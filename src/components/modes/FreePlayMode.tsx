import React, { useState } from 'react';
import { Volume2, Trash2, Plus, Sparkles } from 'lucide-react';
import { AccessibilitySettings, ConcreteItemId, PlacedObject } from '../../types/game';
import { CONCRETE_ITEMS, getItemDef } from '../../data/items';
import { ConcreteObject } from '../ConcreteObject';
import { TenFrame } from '../TenFrame';
import { playCountTone, playPop } from '../../utils/sound';
import { speakKorean, speakNumber } from '../../utils/speech';

interface Props {
  settings: AccessibilitySettings;
}

export const FreePlayMode: React.FC<Props> = ({ settings }) => {
  const [activeItemId, setActiveItemId] = useState<ConcreteItemId>('car');
  const [itemsList, setItemsList] = useState<PlacedObject[]>([]);

  const itemDef = getItemDef(activeItemId);

  const handleAddItem = () => {
    if (itemsList.length >= 10) {
      speakKorean('최대 10개까지 놓을 수 있어요!', settings.speechRate, settings.useVoice);
      return;
    }

    const nextCount = itemsList.length + 1;
    const newObj: PlacedObject = {
      id: `free-${Date.now()}-${Math.random()}`,
      index: itemsList.length,
      itemId: activeItemId,
      isCounted: true,
      orderNumber: nextCount,
    };

    setItemsList((prev) => [...prev, newObj]);
    playCountTone(nextCount, settings.useSound);
    speakNumber(nextCount, settings.countingStyle, settings.speechRate, settings.useVoice);
  };

  const handleItemTap = (obj: PlacedObject) => {
    playCountTone(obj.orderNumber || 1, settings.useSound);
    speakNumber(obj.orderNumber || 1, settings.countingStyle, settings.speechRate, settings.useVoice);
  };

  const handleClear = () => {
    playPop(settings.useSound);
    setItemsList([]);
    speakKorean('깨끗이 비웠어요!', settings.speechRate, settings.useVoice);
  };

  const handleItemRemove = (id: string) => {
    playPop(settings.useSound);
    const filtered = itemsList.filter((it) => it.id !== id);
    // Renumber
    const renumbered = filtered.map((it, idx) => ({
      ...it,
      orderNumber: idx + 1,
    }));
    setItemsList(renumbered);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto px-4 py-4 sm:py-6">
      {/* Banner */}
      <div className="w-full bg-white rounded-3xl p-4 sm:p-5 shadow-sm border-2 border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 font-jua">
            자유 감각 놀이터
          </h2>
          <p className="text-sm font-semibold text-amber-700">
            원하는 사물을 고르고 눌러서 마음껏 세어보세요!
          </p>
        </div>

        {/* Counter */}
        <div className="flex items-center gap-3 bg-amber-50 px-5 py-2.5 rounded-2xl border-2 border-amber-300">
          <span className="text-sm font-bold text-amber-900">놓은 개수:</span>
          <span className="text-3xl font-black text-amber-600 font-mono">
            {itemsList.length}
          </span>
          <span className="text-sm font-bold text-amber-800">개</span>
        </div>
      </div>

      {/* Item Selector Tray */}
      <div className="w-full bg-white rounded-3xl p-4 shadow-sm border-2 border-slate-200 mb-6">
        <span className="block text-xs font-bold text-slate-500 mb-2 font-jua">
          사물 선택하기:
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CONCRETE_ITEMS.map((item) => {
            const isSelected = item.id === activeItemId;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveItemId(item.id);
                  playPop(settings.useSound);
                  speakKorean(item.name, settings.speechRate, settings.useVoice);
                }}
                className={`flex-shrink-0 flex items-center gap-2 py-2 px-3.5 rounded-2xl border-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 font-black border-amber-500 shadow-md scale-105'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold border-slate-200'
                }`}
              >
                <div className="w-6 h-6">
                  <ConcreteObject itemId={item.id} size={24} disabled />
                </div>
                <span className="text-sm font-jua">{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Ten Frame */}
      {settings.useTenFrame && (
        <div className="w-full mb-6">
          <TenFrame
            maxCount={10}
            currentCount={itemsList.length}
            activeItemId={activeItemId}
          />
        </div>
      )}

      {/* Free Interactive Stage */}
      <div
        className="w-full bg-white rounded-3xl p-6 sm:p-10 shadow-lg border-4 border-amber-200 flex flex-col items-center justify-center min-h-[340px] sm:min-h-[400px] relative"
      >
        {itemsList.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-slate-400 py-12">
            <Sparkles className="w-16 h-16 text-amber-400 mb-3 animate-pulse" />
            <span className="text-xl font-bold font-jua text-slate-600">
              아래의 사물 추가 버튼을 눌러보세요!
            </span>
            <span className="text-xs text-slate-400 mt-1">
              누를 때마다 하나, 둘, 셋 소리가 나요.
            </span>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 max-w-4xl py-4">
            {itemsList.map((obj) => (
              <div key={obj.id} className="relative group">
                <ConcreteObject
                  itemId={obj.itemId}
                  size={itemsList.length <= 4 ? 130 : itemsList.length <= 7 ? 105 : 90}
                  isCounted={true}
                  orderNumber={obj.orderNumber}
                  onClick={() => handleItemTap(obj)}
                  ariaLabel={`${itemDef.name} ${obj.orderNumber}번째`}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleItemRemove(obj.id);
                  }}
                  title="지우기"
                  className="absolute -bottom-2 -right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-70 hover:opacity-100 shadow text-xs font-bold"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-6 w-full">
        <button
          type="button"
          onClick={handleAddItem}
          disabled={itemsList.length >= 10}
          className="flex items-center gap-2 py-4 px-8 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 active:scale-95 text-slate-950 font-black text-xl shadow-lg border-2 border-amber-300 disabled:opacity-50 cursor-pointer"
        >
          <Plus className="w-7 h-7" />
          <span>{itemDef.name} 하나 더 놓기</span>
        </button>

        {itemsList.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="flex items-center gap-2 py-4 px-6 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-base border-2 border-slate-300 shadow-sm active:scale-95 cursor-pointer"
          >
            <Trash2 className="w-5 h-5 text-slate-500" />
            <span>모두 비우기</span>
          </button>
        )}
      </div>
    </div>
  );
};
