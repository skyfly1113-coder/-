import { CountingStyle } from '../types/game';

const NATIVE_NUMBERS: Record<number, string> = {
  1: '하나',
  2: '둘',
  3: '셋',
  4: '넷',
  5: '다섯',
  6: '여섯',
  7: '일곱',
  8: '여덟',
  9: '아홉',
  10: '열',
};

const SINO_NUMBERS: Record<number, string> = {
  1: '일',
  2: '이',
  3: '삼',
  4: '사',
  5: '오',
  6: '육',
  7: '칠',
  8: '팔',
  9: '구',
  10: '십',
};

const NATIVE_ATTRIBUTIVE_NUMBERS: Record<number, string> = {
  1: '한',
  2: '두',
  3: '세',
  4: '네',
  5: '다섯',
  6: '여섯',
  7: '일곱',
  8: '여덟',
  9: '아홉',
  10: '열',
};

export function getNumberWord(num: number, style: CountingStyle = 'native'): string {
  if (style === 'sino') {
    return SINO_NUMBERS[num] || String(num);
  }
  return NATIVE_NUMBERS[num] || String(num);
}

export function getAttributiveNumberWord(num: number): string {
  return NATIVE_ATTRIBUTIVE_NUMBERS[num] || String(num);
}

let cachedVoice: SpeechSynthesisVoice | null = null;

function getKoreanVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  if (cachedVoice) return cachedVoice;

  const voices = window.speechSynthesis.getVoices();
  const koVoice =
    voices.find((v) => v.lang.replace('_', '-').startsWith('ko-KR') && !v.name.includes('Compact')) ||
    voices.find((v) => v.lang.startsWith('ko') || v.lang.includes('KR'));

  if (koVoice) {
    cachedVoice = koVoice;
  }
  return koVoice || null;
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoice = null;
    getKoreanVoice();
  };
}

let currentUtteranceTimer: ReturnType<typeof setTimeout> | null = null;

export function speakKorean(
  text: string,
  rate = 0.68, // Steady, calm, slow pace
  enabled = true,
  onEnd?: () => void
) {
  if (!enabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return;
  }

  try {
    if (currentUtteranceTimer) {
      clearTimeout(currentUtteranceTimer);
      currentUtteranceTimer = null;
    }

    window.speechSynthesis.cancel();

    currentUtteranceTimer = setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ko-KR';
      utterance.rate = Math.max(0.5, Math.min(rate, 1.0));
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      const voice = getKoreanVoice();
      if (voice) {
        utterance.voice = voice;
      }

      if (onEnd) {
        utterance.onend = onEnd;
        utterance.onerror = () => onEnd();
      }

      window.speechSynthesis.speak(utterance);
    }, 40);
  } catch (e) {
    console.warn('Speech synthesis error:', e);
    if (onEnd) onEnd();
  }
}

/**
 * Speaks cleanly "하나.", "둘.", "셋." slowly
 */
export function speakNumber(
  num: number,
  style: CountingStyle = 'native',
  rate = 0.68,
  enabled = true,
  onEnd?: () => void
) {
  const word = getNumberWord(num, style);
  // Adding punctuation like "하나." encourages the speech synthesizer to pause cleanly and not clip
  speakKorean(`${word}.`, rate, enabled, onEnd);
}
