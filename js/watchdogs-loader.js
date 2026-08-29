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
    this.audioBtnPill = document.getElementById('wd-audio-btn-pill');

    // Initial cyber glitch audio burst attempt
    if (window.ctosAudio) {
      window.ctosAudio.playBootGlitch();
    }

    // Glitch Skull ASCII animation
    this.startSkullGlitch();

    // Start cinematic boot sequence
    this.run10SecondBootSequence();

    // Interactive unmute on tap/click anywhere on loader
    const unmuteHandler = (e) => {
      if (e && e.target && e.target.closest('#wd-skip-hint')) return;
      if (window.ctosAudio) {
        window.ctosAudio.unlock();
        window.ctosAudio.playBootGlitch();
      }
      if (this.audioBtnPill) {
        this.audioBtnPill.innerHTML = '<span class="audio-pulse-icon">🔊</span> <span class="audio-btn-text">ctOS 2.0 AUDIO SYNCED & STREAMING</span>';
        this.audioBtnPill.style.borderColor = '#00FF66';
        this.audioBtnPill.style.color = '#00FF66';
        this.audioBtnPill.style.background = 'rgba(0, 255, 102, 0.15)';
      }
    };

    if (this.audioBtnPill) {
      this.audioBtnPill.addEventListener('click', unmuteHandler);
      this.audioBtnPill.addEventListener('pointerdown', unmuteHandler, { passive: true });
    }
    this.loader.addEventListener('pointerdown', unmuteHandler, { once: true, passive: true });
    this.loader.addEventListener('click', unmuteHandler, { once: true });

    // Explicit skip handler only when clicking skip button or pressing ESC
    if (this.skipHint) {
      this.skipHint.innerHTML = '<span class="skip-bracket">[</span> <span class="skip-key">ESC</span> <span class="skip-label">TO SKIP</span> <span class="skip-bracket">]</span>';
      this.skipHint.addEventListener('click', (e) => {
        e.stopPropagation();
        this.finish();
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.finish();
      } else {
        unmuteHandler();
      }
    });
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
            if (textArr[idx] !== ' ' && textArr[idx] !== '\n') {
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
          if (window.ctosAudio) {
            window.ctosAudio.playTelemetryBeep(400 + step * 200);
          }
        }

        // Stream logs sequentially across the boot duration
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
      if (window.ctosAudio) {
        window.ctosAudio.playDataTick();
      }
    }

    finish() {
      if (this.isDone) return;
      this.isDone = true;

      if (this.progressBar) this.progressBar.style.width = '100%';
      if (this.progressText) this.progressText.textContent = '100%';

      // Play authentic Watch Dogs 2 breach access success chord
      if (window.ctosAudio) {
        window.ctosAudio.playSuccessChirp();
      }

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
  }

document.addEventListener('DOMContentLoaded', () => {
  window.watchDogsLoader = new WatchDogsLoader();
});
