// On-hold muzak — synthesized so we don't ship audio assets. Classic
// elevator-music vamp: warm pad chord progression + soft pluck arpeggio.
// Only init/start on user gesture (memory rule: "Audio init only on first
// touch").

type Ctx = AudioContext & { __cbSrc?: AudioBufferSourceNode | null };

let ctx: Ctx | null = null;
let masterGain: GainNode | null = null;
let onHoldSrc: AudioBufferSourceNode | null = null;
let ringIntervalId: ReturnType<typeof setInterval> | null = null;

function ensureCtx(): Ctx | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const Ctor = window.AudioContext || (window as any).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor() as Ctx;
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.18;
    masterGain.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function buildOnHoldBuffer(c: Ctx): AudioBuffer {
  // 8 seconds, 2 channels, stereo. ii-V-I-vi muzak vamp in F major:
  // Gm7 – C7 – Fmaj7 – Dm7. Two bars each, simple sine pad + plucked
  // arp triad on top + tape hiss layer.
  const dur = 8;
  const sr = c.sampleRate;
  const buf = c.createBuffer(2, dur * sr, sr);

  const chords = [
    { name: 'Gm7', root: 196.0, third: 233.08, fifth: 293.66, seventh: 349.23 }, // G, Bb, D, F
    { name: 'C7', root: 130.81, third: 164.81, fifth: 196.0, seventh: 233.08 }, // C, E, G, Bb
    { name: 'Fmaj7', root: 174.61, third: 220.0, fifth: 261.63, seventh: 329.63 }, // F, A, C, E
    { name: 'Dm7', root: 146.83, third: 174.61, fifth: 220.0, seventh: 261.63 }, // D, F, A, C
  ];

  for (let ch = 0; ch < 2; ch++) {
    const data = buf.getChannelData(ch);
    const pan = ch === 0 ? -1 : 1;
    for (let n = 0; n < data.length; n++) {
      const t = n / sr;
      const chordIdx = Math.floor(t / 2) % 4;
      const chord = chords[chordIdx];
      const tInBar = t - Math.floor(t / 2) * 2;
      // Pad: 3 sustained sine voices
      let s = 0;
      s += Math.sin(2 * Math.PI * chord.root * t) * 0.16;
      s += Math.sin(2 * Math.PI * chord.third * t) * 0.12;
      s += Math.sin(2 * Math.PI * chord.fifth * t) * 0.10;
      s += Math.sin(2 * Math.PI * chord.seventh * t) * 0.06;
      // Light tremolo
      s *= 0.85 + 0.15 * Math.sin(2 * Math.PI * 4.5 * t);
      // Pluck arpeggio (8th notes, decaying)
      const plick = Math.floor(tInBar * 8) % 4;
      const plickT = (tInBar * 8) % 1;
      const plickFreqs = [chord.root * 2, chord.third * 2, chord.fifth * 2, chord.seventh * 2];
      const env = Math.exp(-plickT * 4) * 0.5;
      s += Math.sin(2 * Math.PI * plickFreqs[plick] * t) * env * 0.08;
      // Hiss
      s += (Math.random() - 0.5) * 0.018;
      // Soft stereo widen
      s *= 1 + 0.05 * pan * Math.sin(2 * Math.PI * 0.5 * t);
      // Tape low-pass-ish (simple smoothing)
      data[n] = s * 0.55;
    }
  }
  return buf;
}

export function startOnHold(): void {
  const c = ensureCtx();
  if (!c || !masterGain) return;
  if (onHoldSrc) return; // already playing
  const src = c.createBufferSource();
  src.buffer = buildOnHoldBuffer(c);
  src.loop = true;
  const filter = c.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 1500;
  filter.Q.value = 0.5;
  src.connect(filter);
  filter.connect(masterGain);
  src.start();
  onHoldSrc = src;
}

export function stopOnHold(): void {
  if (onHoldSrc) {
    try {
      onHoldSrc.stop();
    } catch {
      /* already stopped */
    }
    onHoldSrc.disconnect();
    onHoldSrc = null;
  }
}

// Ring tone — a quick 4 beeps + pause loop, used during the "ringing" stage.
export function startRing(): void {
  const c = ensureCtx();
  if (!c || !masterGain) return;
  if (ringIntervalId) return;
  const beat = () => {
    if (!ctx || !masterGain) return;
    const t0 = ctx.currentTime;
    [0, 0.18].forEach((delay) => {
      const osc = ctx!.createOscillator();
      const g = ctx!.createGain();
      osc.frequency.value = 440;
      g.gain.setValueAtTime(0, t0 + delay);
      g.gain.linearRampToValueAtTime(0.08, t0 + delay + 0.02);
      g.gain.linearRampToValueAtTime(0, t0 + delay + 0.16);
      osc.connect(g);
      g.connect(masterGain!);
      osc.start(t0 + delay);
      osc.stop(t0 + delay + 0.2);
    });
  };
  beat();
  ringIntervalId = setInterval(beat, 1600);
}

export function stopRing(): void {
  if (ringIntervalId) {
    clearInterval(ringIntervalId);
    ringIntervalId = null;
  }
}

// One-off "verdict stamp" thud — used at the moment the stamp lands.
export function playStampThud(): void {
  const c = ensureCtx();
  if (!c || !masterGain) return;
  const t0 = c.currentTime;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(180, t0);
  osc.frequency.exponentialRampToValueAtTime(40, t0 + 0.14);
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(0.6, t0 + 0.01);
  g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.18);
  osc.connect(g);
  g.connect(masterGain);
  osc.start(t0);
  osc.stop(t0 + 0.2);
  // a bit of noise burst for impact
  const dur = 0.16;
  const buf = c.createBuffer(1, c.sampleRate * dur, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() - 0.5) * Math.exp(-i / data.length * 5);
  }
  const noise = c.createBufferSource();
  noise.buffer = buf;
  const filter = c.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 800;
  const ng = c.createGain();
  ng.gain.value = 0.55;
  noise.connect(filter);
  filter.connect(ng);
  ng.connect(masterGain);
  noise.start(t0);
}

export function shutdownAudio(): void {
  stopOnHold();
  stopRing();
}
