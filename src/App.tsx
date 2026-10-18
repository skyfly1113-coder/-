import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Volume2,
  VolumeX,
  Sliders,
  Star,
  Hand,
  HelpCircle,
  PackageOpen,
  Palette,
} from 'lucide-react';
import { GameMode, AccessibilitySettings, ConcreteItemId } from './types/game';
import { TouchCountMode } from './components/modes/TouchCountMode';
import { ChooseNumberMode } from './components/modes/ChooseNumberMode';
import { PutInBoxMode } from './components/modes/PutInBoxMode';
import { FreePlayMode } from './components/modes/FreePlayMode';
import { SettingsDrawer } from './components/SettingsDrawer';
import { StickerBoard } from './components/StickerBoard';
import { playPop } from './utils/sound';
import { speakKorean } from './utils/speech';

export default function App() {
  const [currentMode, setCurrentMode] = useState<GameMode>('touch-count');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isStickersOpen, setIsStickersOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<ConcreteItemId | 'random'>('random');

  // Load earned stars from storage
  const [earnedStars, setEarnedStars] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('doran_stars');
      return saved ? parseInt(saved, 10) || 0 : 0;
    } catch {
      return 0;
    }
  });

  // Settings
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    const defaults: AccessibilitySettings = {
      numberRange: '1-5',
      countingStyle: 'native',
      speechRate: 0.68,
      useVoice: true,
      useSound: true,
      useTenFrame: true,
      highContrast: false,
      switchAccess: false,
      switchScanSpeed: 2.5,
    };

    try {
      const saved = localStorage.getItem('doran_settings');
      if (saved) {
        return { ...defaults, ...JSON.parse(saved) };
      }
    } catch {
      // ignore
    }
    return defaults;
  });

  // Save settings
  useEffect(() => {
    try {
      localStorage.setItem('doran_settings', JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  // Save stars
  const addStar = () => {
    setEarnedStars((prev) => {
      const next = Math.min(prev + 1, 10);
      try {
        localStorage.setItem('doran_stars', String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const resetStars = () => {
    setEarnedStars(0);
    try {
      localStorage.setItem('doran_stars', '0');
    } catch {
      // ignore
    }
  };

  const updateSettings = (partial: Partial<AccessibilitySettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  };

  const switchMode = (mode: GameMode, modeName: string) => {
    playPop(settings.useSound);
    setCurrentMode(mode);
    speakKorean(`${modeName} 놀이를 시작해요!`, settings.speechRate, settings.useVoice);
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
        settings.highContrast
          ? 'bg-slate-950 text-slate-100'
          : 'bg-[#FDFBF7] text-slate-800'
      }`}
    >
      {/* Top Bar Contract: Zone 1 (Wordmark) - Zone 2 (Nav Links) - Zone 3 (Action) */}
      <header
        className={`w-full border-b px-4 sm:px-8 py-3.5 flex items-center justify-between gap-8 z-30 ${
          settings.highContrast
            ? 'bg-slate-900 border-slate-800'
            : 'bg-white/95 backdrop-blur-md border-amber-200/80 shadow-xs'
        }`}
      >
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
          <div className="w-9 h-9 rounded-xl bg-amber-400 border-2 border-amber-500 flex items-center justify-center text-slate-950 shadow-xs">
            <Sparkles className="w-5 h-5 text-amber-900" />
          </div>
          <span className="text-xl sm:text-2xl font-black text-amber-900 tracking-tight font-jua">
            도란도란 첫걸음 수세기
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-bold text-slate-600">
          <button
            type="button"
            onClick={() => switchMode('touch-count', '콕콕 터치 수세기')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              currentMode === 'touch-count'
                ? 'text-amber-600 font-black underline decoration-2 underline-offset-8'
                : 'hover:text-slate-900'
            }`}
          >
            콕콕 터치 수세기
          </button>
          <button
            type="button"
            onClick={() => switchMode('choose-number', '몇 개일까요 맞히기')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              currentMode === 'choose-number'
                ? 'text-amber-600 font-black underline decoration-2 underline-offset-8'
                : 'hover:text-slate-900'
            }`}
          >
            몇 개일까요?
          </button>
          <button
            type="button"
            onClick={() => switchMode('put-in-box', '상자에 담기')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              currentMode === 'put-in-box'
                ? 'text-amber-600 font-black underline decoration-2 underline-offset-8'
                : 'hover:text-slate-900'
            }`}
          >
            상자에 담기
          </button>
          <button
            type="button"
            onClick={() => switchMode('free-play', '자유 감각 놀이터')}
            className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              currentMode === 'free-play'
                ? 'text-amber-600 font-black underline decoration-2 underline-offset-8'
                : 'hover:text-slate-900'
            }`}
          >
            자유 놀이터
          </button>
        </nav>

        {/* Zone 3: Primary Action & Quick Tools */}
        <div className="flex items-center gap-2.5 shrink-0 whitespace-nowrap">
          {/* Sticker Board Trigger */}
          <button
            type="button"
            onClick={() => setIsStickersOpen(true)}
            aria-label="칭찬 스티커판 보기"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-bold text-xs sm:text-sm cursor-pointer shadow-xs active:scale-95 transition-all"
          >
            <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span className="font-mono font-black">{earnedStars}</span>
            <span className="hidden sm:inline">/10 별</span>
          </button>

          {/* Sound Quick Toggle */}
          <button
            type="button"
            onClick={() => updateSettings({ useSound: !settings.useSound })}
            title={settings.useSound ? '소리 끄기' : '소리 켜기'}
            className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
          >
            {settings.useSound ? <Volume2 className="w-4 h-4 text-blue-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Settings Trigger */}
          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer shadow-xs"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>설정</span>
          </button>
        </div>
      </header>

      {/* Accessible Big Mode Switcher Tabs for Students (especially on tablets/mobile) */}
      <div className="w-full max-w-5xl mx-auto px-4 pt-4 sm:pt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 p-1.5 bg-amber-100/60 rounded-3xl border-2 border-amber-200 shadow-inner">
          <button
            type="button"
            onClick={() => switchMode('touch-count', '콕콕 터치 수세기')}
            className={`flex items-center justify-center gap-2 py-3 px-3 rounded-2xl font-black text-sm sm:text-base font-jua transition-all cursor-pointer ${
              currentMode === 'touch-count'
                ? 'bg-amber-400 text-slate-950 shadow-md scale-102 border-2 border-amber-500'
                : 'bg-white/80 hover:bg-white text-slate-700 hover:text-slate-950 border border-transparent'
            }`}
          >
            <Hand className="w-5 h-5 text-amber-900" />
            <span>1. 콕콕 터치</span>
          </button>

          <button
            type="button"
            onClick={() => switchMode('choose-number', '몇 개일까요 맞히기')}
            className={`flex items-center justify-center gap-2 py-3 px-3 rounded-2xl font-black text-sm sm:text-base font-jua transition-all cursor-pointer ${
              currentMode === 'choose-number'
                ? 'bg-amber-400 text-slate-950 shadow-md scale-102 border-2 border-amber-500'
                : 'bg-white/80 hover:bg-white text-slate-700 hover:text-slate-950 border border-transparent'
            }`}
          >
            <HelpCircle className="w-5 h-5 text-amber-900" />
            <span>2. 몇 개일까요?</span>
          </button>

          <button
            type="button"
            onClick={() => switchMode('put-in-box', '상자에 담기')}
            className={`flex items-center justify-center gap-2 py-3 px-3 rounded-2xl font-black text-sm sm:text-base font-jua transition-all cursor-pointer ${
              currentMode === 'put-in-box'
                ? 'bg-amber-400 text-slate-950 shadow-md scale-102 border-2 border-amber-500'
                : 'bg-white/80 hover:bg-white text-slate-700 hover:text-slate-950 border border-transparent'
            }`}
          >
            <PackageOpen className="w-5 h-5 text-amber-900" />
            <span>3. 상자에 담기</span>
          </button>

          <button
            type="button"
            onClick={() => switchMode('free-play', '자유 감각 놀이터')}
            className={`flex items-center justify-center gap-2 py-3 px-3 rounded-2xl font-black text-sm sm:text-base font-jua transition-all cursor-pointer ${
              currentMode === 'free-play'
                ? 'bg-amber-400 text-slate-950 shadow-md scale-102 border-2 border-amber-500'
                : 'bg-white/80 hover:bg-white text-slate-700 hover:text-slate-950 border border-transparent'
            }`}
          >
            <Palette className="w-5 h-5 text-amber-900" />
            <span>4. 자유 놀이터</span>
          </button>
        </div>
      </div>

      {/* Main Content Stage */}
      <main className="flex-1 flex flex-col justify-start pb-12">
        {currentMode === 'touch-count' && (
          <TouchCountMode
            settings={settings}
            activeItemOverride={selectedItemId}
            onAddStar={addStar}
          />
        )}

        {currentMode === 'choose-number' && (
          <ChooseNumberMode
            settings={settings}
            activeItemOverride={selectedItemId}
            onAddStar={addStar}
          />
        )}

        {currentMode === 'put-in-box' && (
          <PutInBoxMode
            settings={settings}
            activeItemOverride={selectedItemId}
            onAddStar={addStar}
          />
        )}

        {currentMode === 'free-play' && (
          <FreePlayMode settings={settings} />
        )}
      </main>

      {/* Accessible Bottom Bar */}
      <footer
        className={`w-full py-4 px-6 border-t text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 ${
          settings.highContrast
            ? 'bg-slate-950 border-slate-800 text-slate-400'
            : 'bg-white/60 border-amber-100 text-amber-900/60'
        }`}
      >
        <div className="flex items-center gap-2">
          <span>특수교육 맞춤형 구체물 수세기 프로그램</span>
          <span aria-hidden="true">·</span>
          <span>수 범위: 1 ~ {settings.numberRange === '1-3' ? 3 : settings.numberRange === '1-5' ? 5 : 10}</span>
          <span aria-hidden="true">·</span>
          <span>{settings.countingStyle === 'native' ? '고유어 (하나, 둘, 셋)' : '한자어 (일, 이, 삼)'}</span>
        </div>

        <div className="flex items-center gap-3">
          {settings.switchAccess && (
            <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
              스위치 모드 켜짐 (스페이스바 입력)
            </span>
          )}
          <span>도란도란 교실</span>
        </div>
      </footer>

      {/* Accessibility & Options Drawer */}
      <SettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={updateSettings}
        selectedItemId={selectedItemId}
        onSelectItem={setSelectedItemId}
      />

      {/* Reward Sticker Board Modal */}
      <StickerBoard
        isOpen={isStickersOpen}
        onClose={() => setIsStickersOpen(false)}
        earnedStars={earnedStars}
        onReset={resetStars}
      />
    </div>
  );
}
