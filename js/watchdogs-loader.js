/**
 * Watch Dogs 2 (DedSec / ctOS 2.0) 10-Second Cinematic Cyber Bootloader
 * Author: Arghya Mukherjee (@ArghyaMuk) - AI/ML & Cloud Engineer @ TCS
 */

class WatchDogsLoader {
  constructor() {
    this.loader = document.getElementById('watchdogs-loader');
    if (!this.loader) return;

    this.progressBar = document.getElementById('wd-progress-fill');
    this.progressText = document.getElementById('wd-progress-pct');
    this.terminalStream = document.getElementById('wd-terminal-stream');
    this.skullElement = document.getElementById('wd-dedsec-skull');
    this.skipHint = document.getElementById('wd-skip-hint');

    this.totalDurationMs = 8000; // Exact 10 seconds duration
    this.startTime = null;

    this.logs = [
      ">> [0x7FFD2B] INTERCEPTING SAN FRANCISCO ctOS 2.0 SATELLITE LINK...",
      ">> TARGET IDENTIFIED: BLUME MAINFRAME [37.7749° N, 122.4194° W]",
      ">> INJECTING DEDSEC PROXY CHAINS & ZERO-DAY EXPLOITS...",
      ">> BYPASSING BLUME FIREWALL KERNEL DEFENSES [LAYER 7 OVERRIDE OK]",
      ">> INITIALIZING ARGHYAX NEURAL CORE (PYTHON 3.11 / ASYNCIO)...",
      ">> COMPILING LANGGRAPH CYCLIC STATE GRAPH WITH 5 AGENT NODES...",
      ">> DISPATCHING STRANDS AGENTS (PLANNER • RESEARCHER • CODER • VERIFIER)...",
      ">> CONNECTING AWS BEDROCK FOUNDATION MODELS (CLAUDE 3.5 SONNET / TITAN)...",
      ">> HYDRATING CHROMADB & QDRANT VECTOR STORES (RAG RETRIEVAL 96.2%)...",
      ">> EXECUTING TERRAFORM IaC MULTI-CLOUD DECLARATIVE BLUEPRINTS...",
      ">> PROVISIONING MULTI-REGION KUBERNETES PODS (AWS EKS • AZURE AKS • GCP GKE)...",
      ">> ATTACHING FLASK & FASTAPI REST API GATEWAYS WITH OAUTH2 ZERO-TRUST...",
      ">> ACTIVATING REDIS TOKEN-BUCKET RATE LIMITER & CELERY TASK QUEUES...",
      ">> RUNNING GITOPS ARGOCD AUTO-SYNC & PROMETHEUS OBSERVABILITY...",
      ">> ctOS 2.0 ROOT PRIVILEGES GRANTED. BLUME FIREWALLS NULLIFIED.",
      ">> DEDSEC EXPLOIT SUCCESSFUL. ARGHYAX PORTFOLIO ONLINE.",
      ">> WELCOME TO ARGHYAX // JOIN DEDSEC."
    ];

    this.isDone = false;
    this.lastAudioStep = 0;
    this.init();
  }

  init() {
    // Initial cyber glitch audio burst
    this.playGlitchSound();

    // Glitch Skull ASCII animation
    this.startSkullGlitch();

    // Start 10-second cinematic boot sequence
    this.run10SecondBootSequence();

    // Instant Skip on click or keyboard press
    const skipHandler = () => this.finish();
    this.loader.addEventListener('click', skipHandler);
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' || e.key === ' ' || e.key === 'Enter') {
        skipHandler();
      }
    }, { once: true });
  }

  startSkullGlitch() {
    const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const originalText = `
     .--------------------------------------------------.
    |  [!] WATCH DOGS 2 // DEDSEC ctOS_2.0 OVERRIDE       |
    |      TARGET: ARGHYAX NEURAL AGENTIC NETWORK         |
     '--------------------------------------------------'
             /\\                  /\\
            /  \\________________/  \\
           /   /\\              /\\   \\
          /   /  \\    ctOS    /  \\   \\
         /   /    \\  2.0 OK  /    \\   \\
         \\  /      \\        /      \\  /
          \\/        \\      /        \\/
                     \\    /
                      \\  /
                       \\/
    `;

    if (!this.skullElement) return;
    this.skullElement.textContent = originalText;

    this.glitchInterval = setInterval(() => {
      if (this.isDone) {
        clearInterval(this.glitchInterval);
        return;
      }
      if (Math.random() > 0.6) {
        const textArr = originalText.split('');
        for (let i = 0; i < 8; i++) {
          const idx = Math.floor(Math.random() * textArr.length);
          if (textArr[idx] !== '\n' && textArr[idx] !== ' ') {
            textArr[idx] = chars[Math.floor(Math.random() * chars.length)];
          }
        }
        this.skullElement.textContent = textArr.join('');
        setTimeout(() => {
          if (this.skullElement) this.skullElement.textContent = originalText;
        }, 90);
      }
    }, 140);
  }

  run10SecondBootSequence() {
    this.startTime = performance.now();
    let lastLogIdx = -1;

    const tick = (now) => {
      if (this.isDone) return;

      const elapsed = now - this.startTime;
      let progress = Math.min(elapsed / this.totalDurationMs, 1.0);

      // Glitch progress percentage (0 - 100%)
      const pct = Math.floor(progress * 100);
      if (this.progressBar) this.progressBar.style.width = pct + '%';
      if (this.progressText) this.progressText.textContent = pct + '%';

      // Periodic audio blips at 25%, 50%, 75%
      const step = Math.floor(pct / 25);
      if (step > this.lastAudioStep && step < 4) {
        this.lastAudioStep = step;
        this.playTelemetryBlip(300 + step * 180);
      }

      // Stream logs sequentially across the 10 seconds
      const targetLogIdx = Math.floor(progress * this.logs.length);
      if (targetLogIdx > lastLogIdx && targetLogIdx < this.logs.length) {
        for (let i = lastLogIdx + 1; i <= targetLogIdx; i++) {
          this.appendLog(this.logs[i]);
        }
        lastLogIdx = targetLogIdx;
      }

      if (progress < 1.0) {
        requestAnimationFrame(tick);
      } else {
        if (this.progressBar) this.progressBar.style.width = '100%';
        if (this.progressText) this.progressText.textContent = '100%';
        setTimeout(() => this.finish(), 400);
      }
    };

    requestAnimationFrame(tick);
  }

  appendLog(text) {
    if (!this.terminalStream) return;
    const logLine = document.createElement('div');
    logLine.className = 'wd-log-row';
    logLine.innerHTML = `<span class="wd-cyan">[ctOS]</span> <span class="wd-txt">${text}</span>`;
    this.terminalStream.appendChild(logLine);
    this.terminalStream.scrollTop = this.terminalStream.scrollHeight;

    // Play micro-tick on every streaming log line
    this.playDataStreamClick();
  }

  finish() {
    if (this.isDone) return;
    this.isDone = true;

    if (this.progressBar) this.progressBar.style.width = '100%';
    if (this.progressText) this.progressText.textContent = '100%';

    // Play authentic Watch Dogs 2 breach access success chord
    this.playAccessGrantedChime();

    // Glitch flash transition
    this.loader.classList.add('wd-glitch-exit');

    setTimeout(() => {
      this.loader.classList.add('wd-hidden');
      setTimeout(() => {
        if (this.loader && this.loader.parentElement) {
          this.loader.parentElement.removeChild(this.loader);
        }
      }, 600);
    }, 450);
  }

  // Shared Persistent Audio Engine for Watch Dogs 2 Sound System
  getAudioContext() {
    if (!window.ctosSharedAudioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        window.ctosSharedAudioCtx = new AudioCtx();
      }
    }
    if (window.ctosSharedAudioCtx && window.ctosSharedAudioCtx.state === 'suspended') {
      window.ctosSharedAudioCtx.resume().catch(() => {});
    }
    return window.ctosSharedAudioCtx;
  }

  // 1. Initial Watch Dogs 2 Multi-Layer Cyber Glitch Audio
  playGlitchSound() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      if (ctx.state === 'suspended') {
        const unlock = () => {
          ctx.resume().then(() => {
            this.playGlitchSound();
          }).catch(() => {});
          ['click', 'pointerdown', 'pointermove', 'mousemove', 'keydown', 'touchstart', 'scroll', 'wheel'].forEach(evt => {
            window.removeEventListener(evt, unlock);
          });
        };
        ['click', 'pointerdown', 'pointermove', 'mousemove', 'keydown', 'touchstart', 'scroll', 'wheel'].forEach(evt => {
          window.addEventListener(evt, unlock, { once: true, passive: true });
        });
        return;
      }

      // Layer A: FM Modulated Glitch Sweep
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(160, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.12);
      osc1.frequency.exponentialRampToValueAtTime(280, ctx.currentTime + 0.3);

      gain1.gain.setValueAtTime(0.35, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.36);

      // Layer B: Square Wave Stutter
      for (let i = 0; i < 4; i++) {
        const t = ctx.currentTime + i * 0.07;
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'square';
        osc2.frequency.setValueAtTime(900 - i * 160, t);

        gain2.gain.setValueAtTime(0.25, t);
        gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(t);
        osc2.stop(t + 0.05);
      }

      // Layer C: Static Noise Burst
      const bufferSize = Math.floor(ctx.sampleRate * 0.2);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.20, ctx.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

      noise.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start();
    } catch (e) {}
  }

  // 2. Micro Data Stream Ticking Sound
  playDataStreamClick() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx || ctx.state === 'suspended') return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(1400 + Math.random() * 500, ctx.currentTime);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.025);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.03);
    } catch (e) {}
  }

  // 3. Milestone Telemetry Blip
  playTelemetryBlip(freq = 440) {
    try {
      const ctx = this.getAudioContext();
      if (!ctx || ctx.state === 'suspended') return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.6, ctx.currentTime + 0.09);

      gain.gain.setValueAtTime(0.20, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.11);
    } catch (e) {}
  }

  // 4. Access Granted Dual-Tone Chime
  playAccessGrantedChime() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx || ctx.state === 'suspended') return;

      const tones = [587.33, 880.00, 1174.66]; // D5, A5, D6
      tones.forEach((freq, idx) => {
        const time = ctx.currentTime + idx * 0.08;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);

        gain.gain.setValueAtTime(0.12, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(time);
        osc.stop(time + 0.36);
      });
    } catch (e) {}
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.watchDogsLoader = new WatchDogsLoader();
});
