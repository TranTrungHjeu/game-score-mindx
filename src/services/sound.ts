import confetti from 'canvas-confetti';
import { Howl } from 'howler';

let evolutionHowl: Howl | null = null;
let megaHowl: Howl | null = null;

function getEvolutionSound(): Howl {
  if (!evolutionHowl) {
    evolutionHowl = new Howl({
      src: ['/audio/evolution.mp3'],
      volume: 0.85,
    });
  }
  return evolutionHowl;
}

function getMegaSound(): Howl {
  if (!megaHowl) {
    megaHowl = new Howl({
      src: ['/audio/mega.m4a'],
      volume: 0.95,
    });
  }
  return megaHowl;
}

/**
 * Web Audio API synthesized musical ding for zero-latency point rewards
 */
export function playScoreDing(delta: number = 1, enabled: boolean = true) {
  if (!enabled) return;

  try {
    const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const now = audioCtx.currentTime;

    const baseFreq = delta >= 5 ? 880 : delta >= 3 ? 659.25 : delta > 0 ? 523.25 : 329.63; // A5, E5, C5, E4
    const notes = delta > 0 ? [baseFreq, baseFreq * 1.25] : [baseFreq, baseFreq * 0.8];

    notes.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = delta > 0 ? 'sine' : 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.2, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.36);
    });
  } catch {
    // AudioContext blocked or not supported
  }
}

/**
 * Sad devolve sound when team drops to <= 0 and turns into a Digitama
 */
export function playEggDevolveSound(enabled: boolean = true) {
  if (!enabled) return;

  try {
    const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const now = audioCtx.currentTime;

    // Descending minor progression: Eb4 (311Hz) -> C4 (261Hz) -> Ab3 (207Hz) -> F3 (174Hz)
    const tones = [311.13, 261.63, 207.65, 174.61];

    tones.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);

      gain.gain.setValueAtTime(0.22, now + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.3);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 0.32);
    });
  } catch {
    // AudioContext blocked
  }
}

/**
 * Joyful ascending arpeggio when Digitama hatches back into Digimon
 */
export function playEggHatchSound(enabled: boolean = true) {
  if (!enabled) return;

  try {
    const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const now = audioCtx.currentTime;

    // Rising major arpeggio: C5 (523Hz) -> E5 (659Hz) -> G5 (784Hz) -> C6 (1046Hz)
    const notes = [523.25, 659.25, 783.99, 1046.5];

    notes.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.09);

      gain.gain.setValueAtTime(0.25, now + idx * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.38);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now + idx * 0.09);
      osc.stop(now + idx * 0.09 + 0.4);
    });
  } catch {
    // AudioContext blocked
  }
}

export function playEvolutionMusic(enabled: boolean = true) {
  if (!enabled) return;
  try {
    const sound = getEvolutionSound();
    sound.stop();
    sound.play();
  } catch (err) {
    console.warn('Could not play evolution audio:', err);
  }
}

export function playMegaMusic(enabled: boolean = true) {
  if (!enabled) return;
  try {
    const sound = getMegaSound();
    sound.stop();
    sound.play();
  } catch (err) {
    console.warn('Could not play mega audio:', err);
  }
}

export function fireConfettiBurst() {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#E31F26', '#FFD62D', '#ffffff', '#38bdf8', '#ff4d4f'],
    });
  } catch {
    // Confetti canvas not ready
  }
}

export function fireSideCannons() {
  try {
    const end = Date.now() + 1200;
    const colors = ['#E31F26', '#FFD62D', '#ffffff', '#ff4d4f'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  } catch {
    // Confetti canvas error
  }
}
