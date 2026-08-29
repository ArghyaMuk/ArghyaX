/**
 * Watch Dogs 2 (DedSec / ctOS) ASCII Values & Text Glitch Decoder Engine
 * Author: Arghya Mukherjee (@ArghyaMuk) - AI/ML & Cloud Engineer @ TCS
 */

class AsciiGlitchEngine {
  constructor() {
    this.asciiChars = '░▒▓█▀▄▌▐010101<>/{}[];:!@#$%^&*()_+-=~0x7F0xCA0xBEEF';
    this.hexValues = [
      '0x7FFD2B', '0xCAFEBABE', '0xDEADBEEF', '0x1337', '0x00FF',
      '0xBLUME_NET', '0xctOS_v2', '0xARGHYAX', '0xLANGGRAPH', '0xK8S_01'
    ];

    this.init();
  }

  init() {
    this.attachHoverDecoders();
    this.attachGlitchEffectToBrand();
    this.initAsciiSidebars();
    this.initAsciiHexCycle();
  }

  // 1. Interactive ASCII Scramble & Text Decoder on Hover
  attachHoverDecoders() {
    const targets = document.querySelectorAll(
      '.nav-brand, .section-tag, .hero-title, .section-title, .badge, .hud-tag-val, .btn-primary'
    );

    targets.forEach(el => {
      // Store original text
      const originalText = el.textContent.trim();
      el.setAttribute('data-original-text', originalText);
      el.classList.add('ascii-decoder-target');

      el.addEventListener('mouseenter', () => {
        this.scrambleText(el, originalText);
      });
    });
  }

  scrambleText(element, originalText) {
    if (element.dataset.isScrambling === 'true') return;
    element.dataset.isScrambling = 'true';

    const length = originalText.length;
    let iteration = 0;
    const maxIterations = Math.min(length * 2, 14);

    const interval = setInterval(() => {
      element.innerText = originalText
        .split('')
        .map((char, index) => {
          if (char === ' ' || char === '\n') return char;
          if (index < iteration / 2) {
            return originalText[index];
          }
          return this.asciiChars[Math.floor(Math.random() * this.asciiChars.length)];
        })
        .join('');

      iteration++;

      if (iteration >= maxIterations) {
        clearInterval(interval);
        element.innerText = originalText;
        element.dataset.isScrambling = 'false';
      }
    }, 28);
  }

  // 2. Brand ASCII Glitch Pulse
  attachGlitchEffectToBrand() {
    const brand = document.querySelector('.brand-name');
    if (!brand) return;

    setInterval(() => {
      if (Math.random() < 0.2) {
        brand.classList.add('wd-active-glitch');
        setTimeout(() => {
          brand.classList.remove('wd-active-glitch');
        }, 180);
      }
    }, 4000);
  }

  // 3. Side Viewport Floating ASCII Telemetry Ribbons
  initAsciiSidebars() {
    if (document.getElementById('ascii-ribbon-left')) return;

    // Left Telemetry Ribbon
    const leftRibbon = document.createElement('div');
    leftRibbon.id = 'ascii-ribbon-left';
    leftRibbon.className = 'ascii-telemetry-sidebar left';
    leftRibbon.innerHTML = `[ 0x7FFD2B // SF_BAY_ctOS_v2.0 // ARGHYAX_AI_NODE_01 // 01000001 01010010 ]`;
    document.body.appendChild(leftRibbon);

    // Right Telemetry Ribbon
    const rightRibbon = document.createElement('div');
    rightRibbon.id = 'ascii-ribbon-right';
    rightRibbon.className = 'ascii-telemetry-sidebar right';
    rightRibbon.innerHTML = `[ DEDSEC_PAYLOAD // LANGGRAPH_SWARM_ACTIVE // K8S_MULTI_CLOUD // 0xCAFEBABE ]`;
    document.body.appendChild(rightRibbon);
  }

  // 4. Periodically Mutate Hex/ASCII Values in Ribbons
  initAsciiHexCycle() {
    const leftRibbon = document.getElementById('ascii-ribbon-left');
    const rightRibbon = document.getElementById('ascii-ribbon-right');

    setInterval(() => {
      const hex1 = this.hexValues[Math.floor(Math.random() * this.hexValues.length)];
      const hex2 = this.hexValues[Math.floor(Math.random() * this.hexValues.length)];
      const binarySample = Math.random().toString(2).slice(2, 10);

      if (leftRibbon) {
        leftRibbon.innerHTML = `[ ${hex1} // ctOS_SURVEILLANCE_OK // BIN:${binarySample} // ARGHYAX_AI ]`;
      }
      if (rightRibbon) {
        rightRibbon.innerHTML = `[ DEDSEC // ${hex2} // AWS_AZURE_GCP_LINK // STATE_GRAPH: OK ]`;
      }
    }, 4500);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.asciiGlitchEngine = new AsciiGlitchEngine();
});
