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
    // Always ON by default unless explicitly disabled
    this.enabled = localStorage.getItem('sound_enabled') !== 'false';
    this.updateToggleUI();

    // Auto-resume AudioContext on first user interaction anywhere
    const unlockAudio = () => {
      this.initContext();
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };
    window.addEventListener('pointerdown', unlockAudio);
    window.addEventListener('keydown', unlockAudio);
    window.addEventListener('touchstart', unlockAudio);
  }

  initContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem('sound_enabled', this.enabled);
    this.updateToggleUI();
    if (this.enabled) {
      this.initContext();
      this.playSuccessChirp();
    }
  }

  updateToggleUI() {
    const btn = document.getElementById('audio-toggle-btn');
    if (!btn) return;
    if (this.enabled) {
      btn.classList.add('active');
      btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`;
      btn.setAttribute('title', 'Sound FX: ON (Click to mute)');
    } else {
      btn.classList.remove('active');
      btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`;
      btn.setAttribute('title', 'Sound FX: OFF (Click to unmute)');
    }
  }

  playKeyClick() {
    if (!this.enabled) return;
    this.initContext();
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, this.audioCtx.currentTime + 0.04);
    gain.gain.setValueAtTime(0.06, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.04);
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.04);
  }

  playTelemetryBeep() {
    if (!this.enabled) return;
    this.initContext();
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200, this.audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1800, this.audioCtx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.08);
  }

  playSuccessChirp() {
    if (!this.enabled) return;
    this.initContext();
    const now = this.audioCtx.currentTime;
    const osc1 = this.audioCtx.createOscillator();
    const osc2 = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc1.frequency.setValueAtTime(587.33, now); // D5
    osc2.frequency.setValueAtTime(880.00, now + 0.07); // A5

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc1.start(now);
    osc1.stop(now + 0.07);
    osc2.start(now + 0.07);
    osc2.stop(now + 0.25);
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

  // 2. Sound Toggle Button
  const audioBtn = document.getElementById('audio-toggle-btn');
  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      window.soundFX.toggle();
    });
  }

  // 3. Watch Dogs 2 ctOS Dark / Light Theme Manager
  const themeBtn = document.getElementById('theme-toggle-btn');
  const savedTheme = localStorage.getItem('arghyax_theme');
  const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  let currentTheme = savedTheme || (prefersLight ? 'light' : 'dark');

  function applyTheme(theme, isUserClick = false) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('arghyax_theme', theme);

    if (themeBtn) {
      const nextLabel = theme === 'dark' ? 'LIGHT' : 'DARK';
      const nextIcon = theme === 'dark' ? '☀️' : '🌙';
      themeBtn.innerHTML = `<span class="theme-btn-bracket">[</span> <span class="theme-icon">${nextIcon}</span> <span class="theme-btn-text">${nextLabel}</span> <span class="theme-btn-bracket">]</span>`;
      themeBtn.setAttribute('title', `Active: ${theme.toUpperCase()} Mode. Click to switch to ${nextLabel} Mode`);
    }

    if (isUserClick) {
      if (window.soundFX) window.soundFX.playKeyClick();
      // Digital glitch snap flash
      document.body.classList.add('theme-glitch-snap');
      setTimeout(() => {
        document.body.classList.remove('theme-glitch-snap');
      }, 180);
      showToast(`[ctOS] THEME RECONFIGURED // ${theme.toUpperCase()} MODE ACTIVE`);
    }
  }

  // Initial apply
  applyTheme(currentTheme, false);

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme, true);
    });
  }

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
      const email = 'arghya.dev.x@gmail.com';
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

      showToast('🤖 J.A.R.V.I.S. CORE ACTIVE: Agentic AI, Multi-Cloud (AWS • Azure • GCP) & Terraform clusters fully operational.');

      // Trigger animation pulse in studio
      if (window.agenticStudioInstance) {
        window.agenticStudioInstance.triggerBurstAction();
      }
    });
  }
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
