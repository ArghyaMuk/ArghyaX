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
    this.enabled = localStorage.getItem('sound_enabled') === 'true';
    this.updateToggleUI();
  }

  initContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
    if (this.audioCtx.state === 'suspended') {
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
  constructor(elementId, roles, speed = 90, delay = 2200) {
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

/* --------------------------------------------------------------------------
   3. Projects Data & Modal Breakdown
   -------------------------------------------------------------------------- */
const PROJECTS_DATA = {
  omnisense: {
    title: 'OmniSense IoT Telemetry Platform',
    category: 'IoT & Hardware',
    image: 'assets/omnisense_iot.jpg',
    description: 'A distributed edge-to-cloud IoT telemetry and monitoring ecosystem built with ESP32 microcontrollers, Raspberry Pi gateways, MQTT message brokers, and an asynchronous Python FastAPI real-time WebSocket backend.',
    problem: 'Industrial edge sensors often suffer from high latency, packet loss over unreliable networks, and lack unified low-latency telemetry visualization.',
    solution: 'Engineered an asynchronous MQTT-to-WebSocket pipeline with automatic edge packet buffering on ESP32, dynamic QoS throttling, and sub-40ms real-time browser analytics charts.',
    techStack: ['Python 3.11', 'FastAPI', 'MQTT / Mosquitto', 'ESP32 / C++', 'Raspberry Pi', 'WebSockets', 'Chart.js', 'Docker'],
    metrics: {
      latency: '< 35ms E2E Latency',
      throughput: '10k+ Packets/sec',
      uptime: '99.99% Reliability',
      nodes: 'Multi-Node Cluster'
    },
    demoUrl: '#iot-lab',
    repoUrl: 'https://github.com/ArghyaMuk'
  },
  neuroquery: {
    title: 'NeuroQuery RAG AI Engine',
    category: 'AI & Machine Learning',
    image: 'assets/neuroquery_rag.jpg',
    description: 'A high-throughput Retrieval-Augmented Generation (RAG) assistant designed for instant semantic querying across multi-format technical documents, API specifications, and codebases.',
    problem: 'Large Language Models suffer from hallucinations and lack context on proprietary documentation and internal system protocols.',
    solution: 'Designed a hybrid semantic search pipeline combining dense vector embeddings (Chroma/Qdrant) with reciprocal rank fusion (RRF) reranking, LangChain document chunking, and streaming LLM responses via FastAPI.',
    techStack: ['Python', 'LangChain', 'OpenAI / Anthropic APIs', 'ChromaDB / Qdrant', 'FastAPI', 'PyTorch', 'Docker'],
    metrics: {
      accuracy: '94.8% Retrieval Precision',
      latency: '240ms Query Response',
      index: '100k+ Indexed Chunks',
      throughput: 'Async Streaming'
    },
    demoUrl: '#',
    repoUrl: 'https://github.com/ArghyaMuk'
  },
  sentinel: {
    title: 'SentinelGuard Async API Gateway',
    category: 'Backend & APIs',
    image: 'assets/sentinel_gateway.jpg',
    description: 'High-performance reverse proxy and microservices API gateway built with Python AsyncIO, Redis token-bucket rate limiting, JWT authentication, and dynamic route orchestration.',
    problem: 'Microservices architectures require centralized auth verification, distributed DDoS mitigation, and dynamic traffic routing without introducing latency bottlenecks.',
    solution: 'Built an async gateway leveraging Redis in-memory pipeline caching, non-blocking HTTP proxying, automated health checks, and cryptographic token verification.',
    techStack: ['Python 3.11', 'FastAPI / AsyncIO', 'Redis', 'PostgreSQL', 'Docker Compose', 'Nginx', 'Prometheus'],
    metrics: {
      throughput: '1.2M req/sec handling',
      latency: '< 4ms Overhead',
      security: 'Zero-Trust Token Auth',
      uptime: '99.98% SLA'
    },
    demoUrl: '#',
    repoUrl: 'https://github.com/ArghyaMuk'
  },
  visionedge: {
    title: 'VisionEdge Edge AI Automation',
    category: 'AI & IoT',
    image: 'assets/visionedge_cv.jpg',
    description: 'On-device edge computer vision pipeline for automated component inspection, defect detection, and GPIO relay actuation running on lightweight embedded hardware.',
    problem: 'Cloud-based computer vision for factory assembly lines incurs prohibitive bandwidth costs and latency delays for real-time safety shutoffs.',
    solution: 'Trained and quantized lightweight MobileNet/YOLO models running locally on Raspberry Pi with OpenCV video stream decoders and sub-50ms hardware relay trigger mechanisms.',
    techStack: ['Python', 'OpenCV', 'PyTorch Mobile', 'Raspberry Pi 4/5', 'GPIO Controls', 'Flask REST API', 'MQTT'],
    metrics: {
      fps: '32 FPS Real-Time Inference',
      latency: '38ms Inference Latency',
      accuracy: '98.2% Defect Recall',
      trigger: '< 15ms Hardware Actuation'
    },
    demoUrl: '#',
    repoUrl: 'https://github.com/ArghyaMuk'
  }
};

/* --------------------------------------------------------------------------
   4. DOM Initialization & Event Handlers
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

  // 3. Theme Toggle & Customizer
  const themeBtn = document.getElementById('theme-toggle-btn');
  const themes = ['obsidian', 'deep-space', 'matrix'];
  let currentThemeIdx = 0;

  // Restore saved theme
  const savedTheme = localStorage.getItem('arghyax_theme');
  if (savedTheme && themes.includes(savedTheme)) {
    if (savedTheme !== 'obsidian') {
      document.body.setAttribute('data-theme', savedTheme);
    }
    currentThemeIdx = themes.indexOf(savedTheme);
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      if (window.soundFX) window.soundFX.playKeyClick();
      currentThemeIdx = (currentThemeIdx + 1) % themes.length;
      const nextTheme = themes[currentThemeIdx];

      if (nextTheme === 'obsidian') {
        document.body.removeAttribute('data-theme');
      } else {
        document.body.setAttribute('data-theme', nextTheme);
      }
      localStorage.setItem('arghyax_theme', nextTheme);

      showToast(`Theme switched to ${nextTheme.replace('-', ' ').toUpperCase()}`);
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

  // 5. Projects Filter Tabs
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (window.soundFX) window.soundFX.playKeyClick();
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category.includes(filterValue)) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 6. Project Details Modal
  const modalBackdrop = document.getElementById('project-modal');
  const modalContainer = document.getElementById('modal-content-area');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  function openProjectModal(projectId) {
    const proj = PROJECTS_DATA[projectId];
    if (!proj || !modalContainer) return;

    if (window.soundFX) window.soundFX.playTelemetryBeep();

    modalContainer.innerHTML = `
      <img src="${proj.image}" alt="${proj.title}" class="modal-header-img" />
      <div class="modal-content">
        <span class="badge badge-cyan">${proj.category}</span>
        <h2 class="modal-title" style="margin-top: 0.5rem;">${proj.title}</h2>
        <p style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 1.25rem;">${proj.description}</p>

        <h3 class="modal-section-title">⚡ Performance & Architectural Metrics</h3>
        <div class="modal-spec-grid">
          ${Object.entries(proj.metrics).map(([key, val]) => `
            <div class="modal-spec-item">
              <div class="modal-spec-label">${key.toUpperCase()}</div>
              <div class="modal-spec-value">${val}</div>
            </div>
          `).join('')}
        </div>

        <h3 class="modal-section-title">🔍 Problem Statement</h3>
        <p style="color: var(--text-secondary); font-size: 0.92rem; line-height: 1.6;">${proj.problem}</p>

        <h3 class="modal-section-title">🛠️ Engineering Solution</h3>
        <p style="color: var(--text-secondary); font-size: 0.92rem; line-height: 1.6;">${proj.solution}</p>

        <h3 class="modal-section-title">📦 Technology Stack</h3>
        <div class="project-tags" style="margin-top: 0.5rem; margin-bottom: 1.75rem;">
          ${proj.techStack.map(tag => `<span class="badge">${tag}</span>`).join('')}
        </div>

        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
          <a href="${proj.repoUrl}" target="_blank" class="btn btn-primary btn-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
            GitHub Repository
          </a>
          <button class="btn btn-secondary btn-sm" onclick="closeProjectModal()">Close Blueprint</button>
        </div>
      </div>
    `;

    modalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  window.closeProjectModal = function() {
    if (modalBackdrop) {
      modalBackdrop.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeProjectModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeProjectModal();
    });
  }

  document.querySelectorAll('.view-project-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projId = btn.getAttribute('data-project');
      openProjectModal(projId);
    });
  });

  // 7. Skills Matrix Tabs
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
