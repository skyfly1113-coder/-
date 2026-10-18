// Web Audio API Synthesizer for high-fidelity responsive audio feedback
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Frequencies for counting notes: C4, D4, E4, F4, G4, A4, B4, C5, D5, E5
const COUNT_FREQUENCIES = [
  261.63, // 1: C4 (도)
  293.66, // 2: D4 (레)
  329.63, // 3: E4 (미)
  349.23, // 4: F4 (파)
  392.00, // 5: G4 (솔)
  440.00, // 6: A4 (라)
  493.88, // 7: B4 (시)
  523.25, // 8: C5 (높은 도)
  587.33, // 9: D5 (높은 레)
  659.25, // 10: E5 (높은 미)
];

export function playCountTone(count: number, enabled = true) {
  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  const freq = COUNT_FREQUENCIES[Math.min(Math.max(count - 1, 0), COUNT_FREQUENCIES.length - 1)];

  // Marimba / Warm Bell timbre
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(freq, now);

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.35, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.55);
}

export function playPop(enabled = true) {
  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(450, now);
  osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);

  gain.gain.setValueAtTime(0.25, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.12);
}

export function playSuccess(enabled = true) {
  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  // Play triumphant 4-note chime: C5, E5, G5, C6
  const notes = [523.25, 659.25, 783.99, 1046.50];

  notes.forEach((freq, idx) => {
    const noteTime = now + idx * 0.12;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, noteTime);

    gain.gain.setValueAtTime(0, noteTime);
    gain.gain.linearRampToValueAtTime(0.28, noteTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(noteTime);
    osc.stop(noteTime + 0.65);
  });
}

export function playGentleEncourage(enabled = true) {
  if (!enabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  // Warm dual-tone guiding chime
  const notes = [329.63, 392.00]; // E4, G4

  notes.forEach((freq, idx) => {
    const noteTime = now + idx * 0.14;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, noteTime);

    gain.gain.setValueAtTime(0, noteTime);
    gain.gain.linearRampToValueAtTime(0.18, noteTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(noteTime);
    osc.stop(noteTime + 0.45);
  });
}
