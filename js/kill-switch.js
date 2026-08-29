/**
 * Watch Dogs 2 (ctOS 2.0 / DedSec) Authentic "Kill Switch" System Breach & Map Engine
 * Author: Arghya Mukherjee (@ArghyaMuk) - AI/ML & Cloud Engineer @ TCS
 */

class WatchDogsKillSwitch {
  constructor() {
    this.btn = document.getElementById('kill-switch-btn');
    this.overlay = document.getElementById('kill-switch-overlay');
    this.mapCanvas = document.getElementById('ks-map-canvas');
    this.isTriggered = false;

    if (!this.btn || !this.overlay) return;
    this.init();
  }

  init() {
    this.btn.addEventListener('click', () => this.executeKillSequence());
  }

  executeKillSequence() {
    if (this.isTriggered) return;
    this.isTriggered = true;

    // Start background ctOS Map Visualizer
    this.startMapVisualizer();

    // Audio: Initial sharp digital snap / pop
    this.playDigitalSnap();

    // 1. Stage 1: Trigger (0.0s - 0.3s) - Sharp pure white/cyan flash cut
    this.overlay.classList.remove('ks-hidden');
    this.overlay.className = 'ks-stage-trigger';

    // 2. Stage 2: Breach Effect (0.3s - 1.0s) - Digital stutter cuts & rectangular slices
    setTimeout(() => {
      this.overlay.className = 'ks-stage-breach';
      this.playStutterBursts();
    }, 300);

    // 3. Stage 3: Data Corruption & Map Activation (1.0s - 1.8s)
    setTimeout(() => {
      this.overlay.className = 'ks-stage-corruption';
      this.populateHexMatrix();
      this.startErraticCounters();
    }, 1000);

    // 4. Stage 4: Lockout Reveal with Full ctOS Map (1.8s - 2.2s)
    setTimeout(() => {
      this.overlay.className = 'ks-stage-lockout';
      this.playLockoutSlam();
      this.glitchTextJitter('CONTROL LOST');
    }, 1800);

    // 5. Stage 5: Hold with Background Surveillance Map (2.2s - 4.0s)
    setTimeout(() => {
      this.overlay.className = 'ks-stage-hold';
    }, 2200);

    // 6. Stage 6: Recovery (4.0s - 4.8s) - Scan-bar sweep & typewriter "RESTORING ACCESS"
    setTimeout(() => {
      this.overlay.className = 'ks-stage-recovery';
      this.typewriterRecovery("RESTORING ACCESS...");
    }, 4000);

    // 7. Stage 7: Reload (4.8s) - Final sharp snap flash & window reload
    setTimeout(() => {
      this.overlay.className = 'ks-stage-reload-flash';
      this.playDigitalSnap();
      setTimeout(() => {
        window.location.reload();
      }, 120);
    }, 4800);
  }

  // Real-Time ctOS City Map Visualizer on Canvas
  startMapVisualizer() {
    if (!this.mapCanvas) return;
    const canvas = this.mapCanvas;
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const targets = [
      { name: "MISSION BAY [BLUME HQ]", lat: "37.7701° N", lon: "122.3892° W", xRel: 0.52, yRel: 0.54, status: "BREACHED", color: "#ff003c" },
      { name: "ALCATRAZ [MILITARY RELAY]", lat: "37.8267° N", lon: "122.4230° W", xRel: 0.44, yRel: 0.32, status: "OFFLINE", color: "#ff003c" },
      { name: "COIT TOWER [ctOS HUB]", lat: "37.8024° N", lon: "122.4058° W", xRel: 0.55, yRel: 0.42, status: "OVERRIDDEN", color: "#00f5d4" },
      { name: "GOLDEN GATE [TRAFFIC GRID]", lat: "37.8199° N", lon: "122.4783° W", xRel: 0.28, yRel: 0.38, status: "HACKED", color: "#ff003c" },
      { name: "HAIGHT-ASHBURY [DEDSEC HUB]", lat: "37.7699° N", lon: "122.4469° W", xRel: 0.38, yRel: 0.62, status: "ACTIVE", color: "#00ff66" },
      { name: "SILICON VALLEY [SERVER VAULT]", lat: "37.4419° N", lon: "122.1430° W", xRel: 0.72, yRel: 0.78, status: "ISOLATED", color: "#ff003c" },
      { name: "EMBARCADERO [FIBER BACKBONE]", lat: "37.7955° N", lon: "122.3937° W", xRel: 0.62, yRel: 0.46, status: "COMPROMISED", color: "#00f5d4" },
      { name: "OAKLAND [POWER GRID #42]", lat: "37.8044° N", lon: "122.2712° W", xRel: 0.82, yRel: 0.34, status: "BLACKOUT", color: "#ff003c" },
      { name: "SUTRO TOWER [BROADCAST ARRAY]", lat: "37.7552° N", lon: "122.4528° W", xRel: 0.34, yRel: 0.68, status: "OVERLOAD", color: "#00f5d4" },
      { name: "MARIN HEADLANDS [RADAR]", lat: "37.8270° N", lon: "122.5000° W", xRel: 0.22, yRel: 0.28, status: "JAMMED", color: "#ff003c" }
    ];

    let radarAngle = 0;
    let frame = 0;

    const renderMap = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      radarAngle += 0.04;
      frame++;

      const cx = canvas.width * 0.5;
      const cy = canvas.height * 0.5;

      // 1. Radar Sweep Beam
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(radarAngle);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, Math.max(canvas.width, canvas.height) * 0.75, 0, 0.45);
      ctx.lineTo(0, 0);
      ctx.fillStyle = 'rgba(0, 245, 212, 0.06)';
      ctx.fill();
      ctx.restore();

      // 2. Draw Vector Connections between locations
      for (let i = 0; i < targets.length; i++) {
        const t1 = targets[i];
        const x1 = t1.xRel * canvas.width;
        const y1 = t1.yRel * canvas.height;

        for (let j = i + 1; j < targets.length; j++) {
          if ((i + j) % 3 === 0) {
            const t2 = targets[j];
            const x2 = t2.xRel * canvas.width;
            const y2 = t2.yRel * canvas.height;

            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = 'rgba(0, 245, 212, 0.15)';
            ctx.lineWidth = 0.8;
            ctx.setLineDash([4, 4]);
            ctx.stroke();
            ctx.setLineDash([]);
          }
        }
      }

      // 3. Render Location Nodes, Alert Rings & Callout Tags
      targets.forEach((t, idx) => {
        const x = t.xRel * canvas.width;
        const y = t.yRel * canvas.height;

        // Pulsing ring
        const pulse = 10 + Math.sin(frame * 0.08 + idx) * 5;
        ctx.beginPath();
        ctx.arc(x, y, pulse, 0, Math.PI * 2);
        ctx.strokeStyle = t.color === '#ff003c' ? 'rgba(255, 0, 60, 0.6)' : 'rgba(0, 245, 212, 0.6)';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Node center
        ctx.beginPath();
        ctx.arc(x, y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = t.color;
        ctx.fill();

        // Callout Tag Box
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(t.name, x + 14, y - 4);

        ctx.font = '8px "JetBrains Mono", monospace';
        ctx.fillStyle = t.color;
        ctx.fillText(`[${t.status}] ${t.lat}, ${t.lon}`, x + 14, y + 8);
      });

      // 4. Draw Active Target Crosshair snapping onto random target
      const activeIdx = Math.floor((frame / 35) % targets.length);
      const activeT = targets[activeIdx];
      const ax = activeT.xRel * canvas.width;
      const ay = activeT.yRel * canvas.height;

      ctx.beginPath();
      ctx.arc(ax, ay, 22, 0, Math.PI * 2);
      ctx.strokeStyle = '#ff003c';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(ax - 28, ay); ctx.lineTo(ax - 16, ay);
      ctx.moveTo(ax + 16, ay); ctx.lineTo(ax + 28, ay);
      ctx.moveTo(ax, ay - 28); ctx.lineTo(ax, ay - 16);
      ctx.moveTo(ax, ay + 16); ctx.lineTo(ax, ay + 28);
      ctx.strokeStyle = '#ff003c';
      ctx.stroke();

      requestAnimationFrame(renderMap);
    };

    requestAnimationFrame(renderMap);
  }

  // Generate scrolling background hex matrix
  populateHexMatrix() {
    const matrix = document.getElementById('ks-hex-stream');
    if (!matrix) return;

    let hexText = '';
    const hexTokens = ['0x7F', '0x45', '0x4C', '0x46', '0xDEAD', '0xBEEF', '0xCAFE', '0x1337', '010110', '0x00FF', 'BLUME_OVERFLOW', 'ctOS_ERR_409'];
    for (let i = 0; i < 40; i++) {
      let row = '';
      for (let j = 0; j < 8; j++) {
        row += hexTokens[Math.floor(Math.random() * hexTokens.length)] + ' ';
      }
      hexText += row + '\n';
    }
    matrix.textContent = hexText;
  }

  startErraticCounters() {
    const coordEl = document.getElementById('ks-telemetry-coord');
    const pctEl = document.getElementById('ks-telemetry-pct');

    const counterInterval = setInterval(() => {
      if (coordEl) {
        coordEl.textContent = `LAT: ${(37.7 + Math.random() * 0.1).toFixed(4)}° N // LON: ${(122.4 + Math.random() * 0.1).toFixed(4)}° W`;
      }
      if (pctEl) {
        pctEl.textContent = `CORRUPTION: ${Math.floor(Math.random() * 90 + 10)}%`;
      }
    }, 60);

    setTimeout(() => clearInterval(counterInterval), 800);
  }

  glitchTextJitter(targetText) {
    const title = document.getElementById('ks-lockout-title');
    if (!title) return;

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!<>[]_#%';
    let step = 0;
    const interval = setInterval(() => {
      if (step >= 6) {
        clearInterval(interval);
        title.textContent = targetText;
        return;
      }

      const shuffled = targetText.split('').map(c => {
        if (c === ' ') return ' ';
        return Math.random() > 0.5 ? c : chars[Math.floor(Math.random() * chars.length)];
      }).join('');

      title.textContent = shuffled;
      step++;
    }, 45);
  }

  typewriterRecovery(fullText) {
    const el = document.getElementById('ks-recovery-text');
    if (!el) return;
    el.textContent = '';
    let idx = 0;

    const typeInterval = setInterval(() => {
      if (idx < fullText.length) {
        el.textContent += fullText[idx];
        idx++;
      } else {
        clearInterval(typeInterval);
      }
    }, 45);
  }

  // Audio: Snappy Digital Clicks & Cyber Static Pulses
  playDigitalSnap() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // Sharp digital square wave snap
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(1600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);

      // Noise static pop
      const bufferSize = ctx.sampleRate * 0.05;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const nGain = ctx.createGain();
      nGain.gain.setValueAtTime(0.15, ctx.currentTime);
      nGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      noise.connect(nGain);
      nGain.connect(ctx.destination);
      noise.start();
    } catch (e) {}
  }

  playStutterBursts() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // Rapid digital machine-gun glitch cuts
      for (let i = 0; i < 6; i++) {
        const time = ctx.currentTime + i * 0.11;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = i % 2 === 0 ? 'sawtooth' : 'square';
        osc.frequency.setValueAtTime(320 + Math.random() * 800, time);
        gain.gain.setValueAtTime(0.12, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.06);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(time);
        osc.stop(time + 0.07);
      }
    } catch (e) {}
  }

  playLockoutSlam() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // Deep 808 sub-bass drop slam
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(28, ctx.currentTime + 0.45);

      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.55);

      // CRT Electrical zap
      const zap = ctx.createOscillator();
      const zapGain = ctx.createGain();
      zap.type = 'sawtooth';
      zap.frequency.setValueAtTime(2400, ctx.currentTime);
      zap.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.2);
      zapGain.gain.setValueAtTime(0.15, ctx.currentTime);
      zapGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
      zap.connect(zapGain);
      zapGain.connect(ctx.destination);
      zap.start();
      zap.stop(ctx.currentTime + 0.23);
    } catch (e) {}
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.watchDogsKillSwitch = new WatchDogsKillSwitch();
});
