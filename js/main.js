/**
 * ArghyaX Portfolio Core Controller
 * Author: Arghya Mukherjee (@ArghyaMuk)
 */

/* --------------------------------------------------------------------------
   1. Web Audio FX Synthesizer (No external audio files needed)
   -------------------------------------------------------------------------- */
class SoundEffects {
  constructor() {
    this.audioCtx = null;
    // Sound is PERMANENTLY ALWAYS ON
    this.enabled = true;
    localStorage.setItem('sound_enabled', 'true');
    this.updateToggleUI();

    // Auto-resume AudioContext on ANY user interaction
    const unlockAudio = () => {
      this.initContext();
    };
    ['pointerdown', 'pointermove', 'keydown', 'touchstart', 'scroll', 'click', 'wheel'].forEach(evt => {
      window.addEventListener(evt, unlockAudio, { passive: true });
    });
  }

  initContext() {
    if (!window.ctosSharedAudioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        window.ctosSharedAudioCtx = new AudioContext();
      }
    }
    this.audioCtx = window.ctosSharedAudioCtx;
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
  }

  toggle() {
    // Sound remains permanently active, plays confirmation feedback chime
    this.enabled = true;
    this.initContext();
    this.playSuccessChirp();
    showToast('[ctOS] AUDIO SYNTHESIZER // PERMANENTLY ONLINE');
  }

  updateToggleUI() {
    const btn = document.getElementById('audio-toggle-btn');
    if (!btn) return;
    btn.classList.add('active');
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`;
    btn.setAttribute('title', 'ctOS Sound FX: Always Active');
  }

  playKeyClick() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(950, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.05);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  playTelemetryBeep() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(2200, now + 0.09);
    gain.gain.setValueAtTime(0.30, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.09);
  }

  playSuccessChirp() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;
    const osc1 = this.audioCtx.createOscillator();
    const osc2 = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc1.frequency.setValueAtTime(659.25, now); // E5
    osc2.frequency.setValueAtTime(987.77, now + 0.07); // B5

    gain.gain.setValueAtTime(0.30, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc1.start(now);
    osc1.stop(now + 0.07);
    osc2.start(now + 0.07);
    osc2.stop(now + 0.28);
  }
}

window.soundFX = new SoundEffects();

/* --------------------------------------------------------------------------
   2. Typewriter Effect
   -------------------------------------------------------------------------- */
class Typewriter {
  constructor(elementId, roles, speed = 80, delay = 2200) {
    this.el = document.getElementById(elementId);
    this.roles = roles;
    this.speed = speed;
    this.delay = delay;
    this.roleIdx = 0;
    this.charIdx = 0;
    this.isDeleting = false;
    if (this.el) this.type();
  }

  type() {
    if (!this.el) return;
    const currentRole = this.roles[this.roleIdx];

    if (this.isDeleting) {
      this.charIdx--;
      this.el.textContent = currentRole.substring(0, this.charIdx);
    } else {
      this.charIdx++;
      this.el.textContent = currentRole.substring(0, this.charIdx);
    }

    let timeoutSpeed = this.speed;

    if (!this.isDeleting && this.charIdx === currentRole.length) {
      timeoutSpeed = this.delay;
      this.isDeleting = true;
    } else if (this.isDeleting && this.charIdx === 0) {
      this.isDeleting = false;
      this.roleIdx = (this.roleIdx + 1) % this.roles.length;
      timeoutSpeed = 400;
    } else if (this.isDeleting) {
      timeoutSpeed = this.speed / 2;
    }

    setTimeout(() => this.type(), timeoutSpeed);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new Typewriter('hero-typewriter', [
    'AI/ML Engineer @ TCS',
    'Production Agentic AI on AWS, Azure & GCP',
    'LangGraph & Strands Multi-Agent Swarms',
    'Terraform, Kubernetes & GitOps Specialist',
    'Secure Python, Flask & FastAPI RESTful APIs'
  ], 80, 2200);
});

/* --------------------------------------------------------------------------
   3. DOM Initialization & Event Handlers
   -------------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Typewriter
  new Typewriter('hero-typewriter', [
    'AI/ML & Cloud Engineer @ TCS',
    'Agentic AI & LangGraph Architect',
    'LLMs, RAG & AWS Bedrock Specialist',
    'Strands Agents & Multi-Agent Swarms',
    'Python, Kubernetes & Cloud Native CI/CD'
  ]);

  // 2. Lock Theme Permanently to Watch Dogs 2 ctOS Dark Mode
  document.documentElement.setAttribute('data-theme', 'dark');
  document.body.setAttribute('data-theme', 'dark');
  localStorage.setItem('arghyax_theme', 'dark');

  // 4. Navbar Scroll State & Spy
  const navbar = document.querySelector('.navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll spy
    let current = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile menu toggle
  const mobileToggle = document.getElementById('mobile-toggle-btn');
  const mobileNav = document.getElementById('mobile-nav');

  if (mobileToggle && mobileNav) {
    mobileToggle.addEventListener('click', () => {
      if (window.soundFX) window.soundFX.playKeyClick();
      mobileNav.classList.toggle('open');
    });

    mobileNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
      });
    });
  }

  // 5. Skills Matrix Tabs
  const skillTabBtns = document.querySelectorAll('.skills-tab-btn');
  const skillPanes = document.querySelectorAll('.skills-tab-pane');

  skillTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (window.soundFX) window.soundFX.playKeyClick();
      skillTabBtns.forEach(b => b.classList.remove('active'));
      skillPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-target');
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });

  // 8. Contact Form Dispatcher & Validation
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const msgInput = document.getElementById('contact-message');
      const submitBtn = contactForm.querySelector('button[type="submit"]');

      if (!nameInput.value.trim() || !emailInput.value.trim() || !msgInput.value.trim()) {
        showToast('⚠️ Please complete all form fields.');
        return;
      }

      // Simulate sending
      if (window.soundFX) window.soundFX.playKeyClick();
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: rotate-ring 1s linear infinite;"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a10 10 0 0 1 10 10"></path></svg>
        Transmitting Payload...
      `;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          Send Message
        `;
        contactForm.reset();
        if (window.soundFX) window.soundFX.playSuccessChirp();
        showToast('🚀 Transmission received! Thank you for reaching out to Arghya Mukherjee.');
      }, 1200);
    });
  }

  // 9. Copy Email Quick Button
  const copyEmailBtn = document.getElementById('copy-email-btn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = 'arghyamukherjee06@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        if (window.soundFX) window.soundFX.playSuccessChirp();
        showToast('📋 Email copied to clipboard: ' + email);
      }).catch(() => {
        showToast('Email: ' + email);
      });
    });
  }

  // 10. J.A.R.V.I.S. AI Core Shockwave & Protocol Activation
  const jarvisCore = document.getElementById('jarvis-core-trigger');
  if (jarvisCore) {
    jarvisCore.addEventListener('click', () => {
      // Spawn holographic shockwave ring
      const shockwave = document.createElement('div');
      shockwave.className = 'jarvis-shockwave';
      jarvisCore.appendChild(shockwave);

      setTimeout(() => {
        if (shockwave.parentElement) shockwave.parentElement.removeChild(shockwave);
      }, 950);

      // Play audio feedback
      if (window.soundFX) {
        window.soundFX.playSuccessChirp();
        setTimeout(() => window.soundFX.playTelemetryBeep(), 120);
      }

      showToast('[ctOS 2.0] DEDSEC CORE ACTIVE: Multi-Cloud (AWS • Azure • GCP) & LangGraph clusters fully operational.');

      // Trigger animation pulse in studio
      if (window.agenticStudioInstance) {
        window.agenticStudioInstance.triggerBurstAction();
      }
    });
  }

  // 11. ctOS Live Surveillance Traffic & Visitor Counter
  const visitorCountEl = document.getElementById('ctos-visitor-count');
  const activeSessionsEl = document.getElementById('ctos-active-sessions');

  async function updateTrafficAnalytics() {
    try {
      const storedVisits = parseInt(localStorage.getItem('arghyax_local_visits') || '1428', 10) + 1;
      localStorage.setItem('arghyax_local_visits', storedVisits);
      
      let hits = storedVisits;
      try {
        const res = await fetch('https://api.counterapi.dev/v1/arghyax-portfolio/visits/up', { mode: 'cors' });
        if (res.ok) {
          const data = await res.json();
          if (data && data.count) hits = data.count + 1420;
        }
      } catch (e) {}

      if (visitorCountEl) {
        visitorCountEl.textContent = `${hits.toLocaleString()} HITS`;
      }
      if (activeSessionsEl) {
        const randNodes = Math.floor(32 + Math.random() * 16);
        activeSessionsEl.textContent = `${randNodes} NODES`;
      }
      window.ctosTrafficStats = { totalHits: hits, activeNodes: 38 };
    } catch (e) {
      if (visitorCountEl) visitorCountEl.textContent = '1,429 HITS';
    }
  }
  updateTrafficAnalytics();
});

/* --------------------------------------------------------------------------
   5. Toast Notification System
   -------------------------------------------------------------------------- */
function showToast(message) {
  let toast = document.getElementById('app-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'app-toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <span style="color: var(--accent-cyan); font-size: 1.1rem;">⚡</span>
    <span style="font-size: 0.9rem; font-weight: 500;">${message}</span>
  `;

  toast.classList.add('show');

  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3800);
}

/* --------------------------------------------------------------------------
   6. Watch Dogs 2 ctOS Security Guard & Right-Click Restriction Engine
   -------------------------------------------------------------------------- */
(function() {
  'use strict';

  function showCtosAccessDenied(x, y, customText) {
    // Play cyber rejection audio chirp
    if (window.soundFX) {
      window.soundFX.playKeyClick();
    }

    const badge = document.createElement('div');
    badge.className = 'ctos-access-denied-badge';
    badge.style.left = `${Math.min(Math.max(x, 140), window.innerWidth - 140)}px`;
    badge.style.top = `${Math.min(Math.max(y, 40), window.innerHeight - 40)}px`;
    badge.innerHTML = `
      <span class="ctos-denied-icon">⚠️</span>
      <span>${customText || 'ctOS_RESTRICTION: CONTEXT MENU DISABLED'}</span>
      <span class="ctos-denied-tag">0x403</span>
    `;

    document.body.appendChild(badge);

    setTimeout(() => {
      if (badge && badge.parentElement) {
        badge.parentElement.removeChild(badge);
      }
    }, 1300);
  }

  // 1. Intercept and restrict right-click context menu
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    showCtosAccessDenied(e.clientX, e.clientY, 'ACCESS DENIED // RIGHT-CLICK RESTRICTED');
  }, { capture: true });

  // 2. Intercept common developer inspection keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Block F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U (View Source)
    if (
      e.key === 'F12' ||
      (e.ctrlKey && e.shiftKey && ['I', 'i', 'J', 'j', 'C', 'c'].includes(e.key)) ||
      (e.ctrlKey && ['U', 'u', 'S', 's'].includes(e.key))
    ) {
      e.preventDefault();
      showCtosAccessDenied(window.innerWidth / 2, window.innerHeight / 2, 'ctOS SECURITY // INSPECTION RESTRICTED');
      showToast('[!] DedSec Security Matrix: Source inspection restricted by ctOS.');
    }
  }, { capture: true });
})();
