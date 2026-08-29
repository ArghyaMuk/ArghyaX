/**
 * Watch Dogs 2 (ctOS 2.0 / DedSec) Cyber Mesh & Surveillance Grid Canvas
 * Author: Arghya Mukherjee (@ArghyaMuk) - AI/ML & Cloud Engineer @ TCS
 */

class WatchDogsCyberGrid {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.nodes = [];
    this.packets = [];
    this.mouse = { x: null, y: null, radius: 180 };
    this.targetCount = 45;
    this.maxDistance = 140;
    this.glitchFrame = 0;

    this.init();
  }

  init() {
    this.resize();
    this.createNodes();
    this.bindEvents();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    if (window.innerWidth < 768) {
      this.targetCount = 25;
      this.maxDistance = 100;
    } else {
      this.targetCount = 50;
      this.maxDistance = 145;
    }
  }

  createNodes() {
    this.nodes = [];
    const colors = [
      '#00ff66', // DedSec Neon Lime
      '#00f5d4', // Cyan
      '#38bdf8', // Blue
      '#ff0055', // Magenta Glitch
      '#ffe600'  // Electric Yellow
    ];

    const asciiTags = ['0x7F', '0x1337', '0xDEAD', '0xCAFE', '0101', '0x00FF', '0xBEEF', '0xBLUME', '0xK8S', '0xAI'];

    for (let i = 0; i < this.targetCount; i++) {
      this.nodes.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.65,
        vy: (Math.random() - 0.5) * 0.65,
        radius: Math.random() * 2.5 + 1.2,
        color: colors[i % colors.length],
        id: 'NODE_' + Math.floor(Math.random() * 900 + 100),
        asciiVal: asciiTags[i % asciiTags.length],
        showAscii: i % 4 === 0,
        isSpecial: i % 8 === 0,
        pulse: Math.random() * Math.PI
      });
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.createNodes();
    });

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.glitchFrame++;

    // 1. Draw subtle ctOS background grid lines
    this.drawCtOSGrid();

    // 2. Draw Connections & Data Laser Lines
    for (let i = 0; i < this.nodes.length; i++) {
      for (let j = i + 1; j < this.nodes.length; j++) {
        const dx = this.nodes[i].x - this.nodes[j].x;
        const dy = this.nodes[i].y - this.nodes[j].y;
        const dist = Math.hypot(dx, dy);

        if (dist < this.maxDistance) {
          const alpha = (1 - dist / this.maxDistance) * 0.22;
          this.ctx.beginPath();
          this.ctx.moveTo(this.nodes[i].x, this.nodes[i].y);
          this.ctx.lineTo(this.nodes[j].x, this.nodes[j].y);
          this.ctx.strokeStyle = `rgba(0, 245, 212, ${alpha})`;
          this.ctx.lineWidth = 0.8;
          this.ctx.stroke();

          // Spawn occasional traveling data packet
          if (Math.random() < 0.003) {
            this.packets.push({
              x1: this.nodes[i].x, y1: this.nodes[i].y,
              x2: this.nodes[j].x, y2: this.nodes[j].y,
              progress: 0,
              speed: 0.035,
              color: this.nodes[i].color
            });
          }
        }
      }
    }

    // 3. Render Traveling Data Packets
    for (let i = this.packets.length - 1; i >= 0; i--) {
      const pkt = this.packets[i];
      pkt.progress += pkt.speed;

      if (pkt.progress >= 1) {
        this.packets.splice(i, 1);
        continue;
      }

      const currX = pkt.x1 + (pkt.x2 - pkt.x1) * pkt.progress;
      const currY = pkt.y1 + (pkt.y2 - pkt.y1) * pkt.progress;

      this.ctx.beginPath();
      this.ctx.arc(currX, currY, 2.2, 0, Math.PI * 2);
      this.ctx.fillStyle = pkt.color;
      this.ctx.shadowColor = pkt.color;
      this.ctx.shadowBlur = 8;
      this.ctx.fill();
      this.ctx.shadowBlur = 0;
    }

    // 4. Update & Render Nodes & ASCII Values
    for (let i = 0; i < this.nodes.length; i++) {
      const n = this.nodes[i];
      n.pulse += 0.04;

      n.x += n.vx;
      n.y += n.vy;

      if (n.x < 0 || n.x > this.canvas.width) n.vx *= -1;
      if (n.y < 0 || n.y > this.canvas.height) n.vy *= -1;

      // Mouse interactive hack field
      if (this.mouse.x !== null && this.mouse.y !== null) {
        const mdx = this.mouse.x - n.x;
        const mdy = this.mouse.y - n.y;
        const mdist = Math.hypot(mdx, mdy);

        if (mdist < this.mouse.radius) {
          const force = (1 - mdist / this.mouse.radius) * 1.8;
          n.x -= (mdx / mdist) * force;
          n.y -= (mdy / mdist) * force;

          // Connect laser line to mouse
          this.ctx.beginPath();
          this.ctx.moveTo(n.x, n.y);
          this.ctx.lineTo(this.mouse.x, this.mouse.y);
          this.ctx.strokeStyle = `rgba(0, 255, 102, ${(1 - mdist / this.mouse.radius) * 0.4})`;
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
        }
      }

      // Draw Node
      this.ctx.beginPath();
      this.ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = n.color;
      this.ctx.fill();

      // Render Floating ASCII / Hex String
      if (n.showAscii) {
        this.ctx.font = '9px "JetBrains Mono", monospace';
        this.ctx.fillStyle = 'rgba(0, 245, 212, 0.45)';
        this.ctx.fillText(n.asciiVal, n.x + 8, n.y - 6);
      }

      // Special Watch Dogs ctOS Reticles on select nodes
      if (n.isSpecial) {
        const ringRadius = 8 + Math.sin(n.pulse) * 3;
        this.ctx.beginPath();
        this.ctx.arc(n.x, n.y, ringRadius, 0, Math.PI * 2);
        this.ctx.strokeStyle = 'rgba(0, 255, 102, 0.45)';
        this.ctx.lineWidth = 0.8;
        this.ctx.stroke();

        // Node ID label
        this.ctx.font = '8px "JetBrains Mono", monospace';
        this.ctx.fillStyle = 'rgba(0, 255, 102, 0.7)';
        this.ctx.fillText(n.id, n.x + 10, n.y + 3);
      }
    }

    // 5. Draw Mouse DedSec Targeting Reticle
    if (this.mouse.x !== null && this.mouse.y !== null) {
      this.drawMouseReticle(this.mouse.x, this.mouse.y);
    }

    requestAnimationFrame(() => this.animate());
  }

  drawCtOSGrid() {
    const isLight = document.body.getAttribute('data-theme') === 'light';
    const spacing = 120;
    this.ctx.strokeStyle = isLight ? 'rgba(0, 136, 163, 0.04)' : 'rgba(0, 240, 255, 0.02)';
    this.ctx.lineWidth = 1;

    for (let x = 0; x < this.canvas.width; x += spacing) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
      this.ctx.stroke();
    }
    for (let y = 0; y < this.canvas.height; y += spacing) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
      this.ctx.stroke();
    }
  }

  drawMouseReticle(x, y) {
    const angle = this.glitchFrame * 0.03;
    const r = 24;

    this.ctx.save();
    this.ctx.translate(x, y);

    // Rotating dashed circle
    this.ctx.rotate(angle);
    this.ctx.beginPath();
    this.ctx.arc(0, 0, r, 0, Math.PI * 2);
    this.ctx.setLineDash([4, 4]);
    this.ctx.strokeStyle = 'rgba(0, 255, 102, 0.7)';
    this.ctx.lineWidth = 1.2;
    this.ctx.stroke();

    // Crosshairs
    this.ctx.setLineDash([]);
    this.ctx.beginPath();
    this.ctx.moveTo(-r - 6, 0); this.ctx.lineTo(-r + 2, 0);
    this.ctx.moveTo(r - 2, 0);  this.ctx.lineTo(r + 6, 0);
    this.ctx.moveTo(0, -r - 6); this.ctx.lineTo(0, -r + 2);
    this.ctx.moveTo(0, r - 2);  this.ctx.lineTo(0, r + 6);
    this.ctx.strokeStyle = '#00ff66';
    this.ctx.stroke();

    this.ctx.restore();

    // Small DedSec Tag
    this.ctx.font = '9px "JetBrains Mono", monospace';
    this.ctx.fillStyle = '#00ff66';
    this.ctx.fillText('[DEDSEC_NET]', x + 30, y - 10);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.particleNetwork = new WatchDogsCyberGrid('particles-canvas');
});
