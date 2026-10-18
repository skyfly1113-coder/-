import React from 'react';
import { X, Volume2, VolumeX, Mic, Eye, Sliders, Check } from 'lucide-react';
import { AccessibilitySettings, ConcreteItemId, NumberRange, CountingStyle } from '../types/game';
import { CONCRETE_ITEMS } from '../data/items';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  settings: AccessibilitySettings;
  onUpdateSettings: (newSettings: Partial<AccessibilitySettings>) => void;
  selectedItemId: ConcreteItemId | 'random';
  onSelectItem: (itemId: ConcreteItemId | 'random') => void;
}

export const SettingsDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  selectedItemId,
  onSelectItem,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-blue-200">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 font-jua">
                학습 및 접근성 설정
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                학생의 인지 및 신체 특성에 맞추어 설정을 변경하세요.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="설정 닫기"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* 1. 수 범위 선택 */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              수 범위 (난이도)
            </label>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {(['1-3', '1-5', '1-10'] as NumberRange[]).map((range) => {
                const isActive = settings.numberRange === range;
                const label = range === '1-3' ? '1 ~ 3 (초급)' : range === '1-5' ? '1 ~ 5 (기본)' : '1 ~ 10 (심화)';
                return (
                  <button
                    key={range}
                    type="button"
                    onClick={() => onUpdateSettings({ numberRange: range })}
                    className={`py-3 px-3 rounded-2xl font-bold text-sm sm:text-base transition-all flex flex-col items-center justify-center gap-1 border-2 cursor-pointer ${
                      isActive
                        ? 'bg-blue-500 text-white border-blue-600 shadow-md scale-102'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>{label}</span>
                    <span className="text-xs opacity-80">
                      {range === '1-3' ? '중증 기초' : range === '1-5' ? '한 손 수량' : '양손 수량'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. 구체물 선택 */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              구체물 (친근한 사물)
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => onSelectItem('random')}
                className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-bold border-2 transition-all cursor-pointer ${
                  selectedItemId === 'random'
                    ? 'bg-amber-500 text-white border-amber-600 shadow'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                🎲 문제마다 랜덤
              </button>
              {CONCRETE_ITEMS.map((item) => {
                const isSelected = selectedItemId === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelectItem(item.id)}
                    className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-bold border-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-700 shadow'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. 소리 및 음성 설정 */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {settings.useSound ? <Volume2 className="w-5 h-5 text-blue-600" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
                <span className="font-bold text-slate-800 text-sm">맑은 실로폰 효과음</span>
              </div>
              <button
                type="button"
                onClick={() => onUpdateSettings({ useSound: !settings.useSound })}
                className={`px-4 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                  settings.useSound ? 'bg-blue-500 text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {settings.useSound ? '켜짐' : '꺼짐'}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mic className="w-5 h-5 text-emerald-600" />
                <div>
                  <span className="font-bold text-slate-800 text-sm block">한국어 음성 안내 (TTS)</span>
                  <span className="text-xs text-slate-500">숫자와 칭찬을 소리로 읽어줍니다</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onUpdateSettings({ useVoice: !settings.useVoice })}
                className={`px-4 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                  settings.useVoice ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {settings.useVoice ? '켜짐' : '꺼짐'}
              </button>
            </div>

            {/* 수세기 방식 */}
            <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-700">숫자 읽기 방식:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ countingStyle: 'native' })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${
                    settings.countingStyle === 'native'
                      ? 'bg-emerald-600 text-white border-emerald-700'
                      : 'bg-white text-slate-700 border-slate-300'
                  }`}
                >
                  하나, 둘, 셋 (고유어)
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ countingStyle: 'sino' })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${
                    settings.countingStyle === 'sino'
                      ? 'bg-emerald-600 text-white border-emerald-700'
                      : 'bg-white text-slate-700 border-slate-300'
                  }`}
                >
                  일, 이, 삼 (한자어)
                </button>
              </div>
            </div>

            {/* 음성 속도 */}
            <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-700">말하는 속도:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ speechRate: 0.6 })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${
                    settings.speechRate <= 0.65
                      ? 'bg-blue-600 text-white border-blue-700'
                      : 'bg-white text-slate-700 border-slate-300'
                  }`}
                >
                  아주 천천히 (0.6x)
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ speechRate: 0.68 })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${
                    settings.speechRate > 0.65 && settings.speechRate <= 0.78
                      ? 'bg-blue-600 text-white border-blue-700'
                      : 'bg-white text-slate-700 border-slate-300'
                  }`}
                >
                  천천히 (0.7x 기본)
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ speechRate: 0.85 })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${
                    settings.speechRate > 0.78
                      ? 'bg-blue-600 text-white border-blue-700'
                      : 'bg-white text-slate-700 border-slate-300'
                  }`}
                >
                  보통 (0.85x)
                </button>
              </div>
            </div>

            {/* 소리 미리듣기 버튼 */}
            <div className="pt-2 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  const demo =
                    settings.countingStyle === 'native'
                      ? '하나. 둘. 셋.'
                      : '일. 이. 삼.';
                  const utterance = new SpeechSynthesisUtterance(demo);
                  utterance.lang = 'ko-KR';
                  utterance.rate = settings.speechRate;
                  utterance.pitch = 1.0;
                  window.speechSynthesis.cancel();
                  window.speechSynthesis.speak(utterance);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs border border-amber-300 cursor-pointer transition-colors"
              >
                <Volume2 className="w-4 h-4 text-amber-700" />
                <span>읽어주는 소리 미리듣기 (하나, 둘, 셋)</span>
              </button>
            </div>
          </div>

          {/* 4. 시각 및 보조 기능 */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-slate-700">
              시각 보조 및 틀 지원
            </label>

            {/* 텐프레임 */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <div>
                <span className="font-bold text-slate-800 text-sm block">
                  5칸/10칸 상자틀(텐프레임) 보조
                </span>
                <span className="text-xs text-slate-500">
                  수량을 한눈에 알기 쉽게 칸 상자 시각틀을 제공합니다
                </span>
              </div>
              <button
                type="button"
                onClick={() => onUpdateSettings({ useTenFrame: !settings.useTenFrame })}
                className={`px-4 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                  settings.useTenFrame ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {settings.useTenFrame ? '켜짐' : '꺼짐'}
              </button>
            </div>

            {/* 고대비 모드 */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-slate-600" />
                <div>
                  <span className="font-bold text-slate-800 text-sm block">고대비 화면 (저시력 보조)</span>
                  <span className="text-xs text-slate-500">배경과 사물의 윤곽을 더욱 또렷하게 표시합니다</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onUpdateSettings({ highContrast: !settings.highContrast })}
                className={`px-4 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                  settings.highContrast ? 'bg-purple-600 text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {settings.highContrast ? '켜짐' : '꺼짐'}
              </button>
            </div>

            {/* 단일 스위치 접근성 모드 */}
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <div>
                <span className="font-bold text-slate-800 text-sm block">
                  스위치 / 키보드 접근성 (지체장애 보조)
                </span>
                <span className="text-xs text-slate-500">
                  스페이스바(Space) 또는 엔터키(Enter)로 순차 선택 가능
                </span>
              </div>
              <button
                type="button"
                onClick={() => onUpdateSettings({ switchAccess: !settings.switchAccess })}
                className={`px-4 py-1.5 rounded-xl font-bold text-xs transition-colors cursor-pointer ${
                  settings.switchAccess ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                {settings.switchAccess ? '켜짐' : '꺼짐'}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Done Button */}
        <div className="mt-8 pt-4 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-base rounded-2xl shadow-md cursor-pointer transition-all active:scale-95"
          >
            <Check className="w-5 h-5" />
            <span>설정 완료</span>
          </button>
        </div>
      </div>
    </div>
  );
};
