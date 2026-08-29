/**
 * Watch Dogs 2 (DedSec / ctOS 2.0) Loading & Cyber Bootloader
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

    this.logs = [
      ">> INITIALIZING ctOS 2.0 BYPASS PROTOCOL...",
      ">> CONNECTING TO SAN FRANCISCO BLUME MAINFRAME [127.0.0.1:443]...",
      ">> DECRYPTING ARGHYAX NEURAL CORE & AGENTIC AI SWARMS...",
      ">> MOUNTING AWS BEDROCK & LANGGRAPH REASONING MESH...",
      ">> DEPLOYING TERRAFORM MULTI-CLOUD BRIDGES (AWS • AZURE • GCP)...",
      ">> COMPILING PYTHON & FLASK ZERO-TRUST SECURITY REST APIS...",
      ">> ALL BLUME FIREWALLS OVERRIDDEN. SYSTEM BREACH SUCCESSFUL.",
      ">> WELCOME TO ARGHYAX // JOIN DEDSEC."
    ];

    this.isDone = false;
    this.init();
  }

  init() {
    // Play cyber glitch sound
    this.playGlitchSound();

    // Glitch Skull ASCII / text animation
    this.startSkullGlitch();

    // Stream terminal hacking logs & progress
    this.runBootSequence();

    // Allow user to click or press any key to skip immediately
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
     .----------------------------------.
    |  [!] DEDSEC // ctOS_BREACH_v2.0    |
    |      ARGHYAX NEURAL NETWORK        |
     '----------------------------------'
           .-''''-.
          /  _  _  \\
         |  (o)(o)  |   >> BLUME SECURITY: COMPROMISED
         |   .__.   |   >> ACCESS LEVEL : ROOT_ADMIN
          \\  '--'  /
           '-....-'
    `;

    if (!this.skullElement) return;
    this.skullElement.textContent = originalText;

    this.glitchInterval = setInterval(() => {
      if (this.isDone) {
        clearInterval(this.glitchInterval);
        return;
      }
      if (Math.random() > 0.65) {
        const textArr = originalText.split('');
        for (let i = 0; i < 6; i++) {
          const idx = Math.floor(Math.random() * textArr.length);
          if (textArr[idx] !== '\n' && textArr[idx] !== ' ') {
            textArr[idx] = chars[Math.floor(Math.random() * chars.length)];
          }
        }
        this.skullElement.textContent = textArr.join('');
        setTimeout(() => {
          if (this.skullElement) this.skullElement.textContent = originalText;
        }, 80);
      }
    }, 150);
  }

  runBootSequence() {
    let currentLog = 0;
    let progress = 0;

    const logInterval = setInterval(() => {
      if (this.isDone) {
        clearInterval(logInterval);
        return;
      }

      if (currentLog < this.logs.length) {
        if (this.terminalStream) {
          const logLine = document.createElement('div');
          logLine.className = 'wd-log-row';
          logLine.innerHTML = `<span class="wd-cyan">[ctOS]</span> <span class="wd-txt">${this.logs[currentLog]}</span>`;
          this.terminalStream.appendChild(logLine);
          this.terminalStream.scrollTop = this.terminalStream.scrollHeight;
        }
        currentLog++;
      }
    }, 180);

    const progressInterval = setInterval(() => {
      if (this.isDone) {
        clearInterval(progressInterval);
        return;
      }

      progress += Math.floor(Math.random() * 12) + 6;
      if (progress > 100) progress = 100;

      if (this.progressBar) this.progressBar.style.width = progress + '%';
      if (this.progressText) this.progressText.textContent = progress + '%';

      if (progress >= 100) {
        clearInterval(progressInterval);
        clearInterval(logInterval);
        setTimeout(() => this.finish(), 300);
      }
    }, 90);
  }

  finish() {
    if (this.isDone) return;
    this.isDone = true;

    if (this.progressBar) this.progressBar.style.width = '100%';
    if (this.progressText) this.progressText.textContent = '100%';

    // Glitch flash transition
    this.loader.classList.add('wd-glitch-exit');

    // Play final breach access tone
    if (window.soundFX) window.soundFX.playSuccessChirp();

    setTimeout(() => {
      this.loader.classList.add('wd-hidden');
      setTimeout(() => {
        if (this.loader && this.loader.parentElement) {
          this.loader.parentElement.removeChild(this.loader);
        }
      }, 600);
    }, 450);
  }

  playGlitchSound() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // Cyber glitch burst
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
      osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.36);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.watchDogsLoader = new WatchDogsLoader();
});
