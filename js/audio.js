/**
 * Watch Dogs 2 ctOS Global Audio Synthesizer Engine
 * Zero-dependency Web Audio API sound generator
 */
class CtosAudioEngine {
  constructor() {
    this.ctx = null;
    this.isUnlocked = false;
    this.initAudioContext();
    this.registerUnlockListeners();
  }

  initAudioContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'running') {
      this.isUnlocked = true;
    }
    return this.ctx;
  }

  unlock() {
    const ctx = this.initAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') {
      ctx.resume().then(() => {
        this.isUnlocked = true;
      }).catch(() => {});
    } else {
      this.isUnlocked = true;
    }
  }

  registerUnlockListeners() {
    const unlockHandler = () => {
      this.unlock();
    };
    ['pointerdown', 'mousedown', 'touchstart', 'touchend', 'keydown', 'click'].forEach(evt => {
      window.addEventListener(evt, unlockHandler, { passive: true });
    });
  }

  // 1. Watch Dogs 2 Boot Glitch Sound
  playBootGlitch() {
    try {
      this.unlock();
      const ctx = this.ctx;
      if (!ctx || ctx.state === 'suspended') return;
      const now = ctx.currentTime;

      // Layer 1: FM Frequency Modulated Sawtooth Sweep
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(140, now);
      osc1.frequency.exponentialRampToValueAtTime(1600, now + 0.15);
      osc1.frequency.exponentialRampToValueAtTime(320, now + 0.35);

      gain1.gain.setValueAtTime(0.40, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.38);

      // Layer 2: Rapid Stutter Square Wave Bursts
      for (let i = 0; i < 4; i++) {
        const t = now + i * 0.08;
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'square';
        osc2.frequency.setValueAtTime(1000 - i * 200, t);

        gain2.gain.setValueAtTime(0.30, t);
        gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(t);
        osc2.stop(t + 0.06);
      }

      // Layer 3: White Noise Static Burst
      const bufferSize = Math.floor(ctx.sampleRate * 0.25);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.25, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      noise.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(now);
    } catch (e) {}
  }

  // 2. Data Stream Micro-Tick for Terminal Log Streaming
  playDataTick() {
    try {
      this.unlock();
      const ctx = this.ctx;
      if (!ctx || ctx.state === 'suspended') return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(1600 + Math.random() * 600, now);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.035);
    } catch (e) {}
  }

  // 3. Milestone Telemetry Blip
  playTelemetryBeep(freq = 880) {
    try {
      this.unlock();
      const ctx = this.ctx;
      if (!ctx || ctx.state === 'suspended') return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.08);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.085);
    } catch (e) {}
  }

  // 4. Keyboard Key Click
  playKeyClick() {
    try {
      this.unlock();
      const ctx = this.ctx;
      if (!ctx || ctx.state === 'suspended') return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1100, now);
      osc.frequency.exponentialRampToValueAtTime(360, now + 0.04);

      gain.gain.setValueAtTime(0.30, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.045);
    } catch (e) {}
  }

  // 5. Access Granted / Breach Complete Chime
  playSuccessChirp() {
    try {
      this.unlock();
      const ctx = this.ctx;
      if (!ctx || ctx.state === 'suspended') return;
      const now = ctx.currentTime;

      const notes = [587.33, 880.00, 1174.66]; // D5, A5, D6
      notes.forEach((freq, idx) => {
        const time = now + idx * 0.07;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);

        gain.gain.setValueAtTime(0.35, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(time);
        osc.stop(time + 0.31);
      });
    } catch (e) {}
  }

  // 6. Security Denial Error Alarm
  playAccessDenied() {
    try {
      this.unlock();
      const ctx = this.ctx;
      if (!ctx || ctx.state === 'suspended') return;
      const now = ctx.currentTime;

      for (let i = 0; i < 2; i++) {
        const t = now + i * 0.09;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, t);
        osc.frequency.setValueAtTime(220, t + 0.04);

        gain.gain.setValueAtTime(0.35, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.085);
      }
    } catch (e) {}
  }
}

// Global Audio Engine Instance
window.ctosAudio = new CtosAudioEngine();
window.soundFX = {
  enabled: true,
  playKeyClick: () => window.ctosAudio.playKeyClick(),
  playTelemetryBeep: (freq) => window.ctosAudio.playTelemetryBeep(freq),
  playSuccessChirp: () => window.ctosAudio.playSuccessChirp(),
  playAccessDenied: () => window.ctosAudio.playAccessDenied()
};
