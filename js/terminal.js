/**
 * ArghyaOS Interactive CLI Terminal
 * Author: Arghya Mukherjee (@ArghyaMuk)
 */

class InteractiveTerminal {
  constructor(options = {}) {
    this.outputElement = document.getElementById('terminal-output');
    this.inputElement = document.getElementById('terminal-input');
    this.terminalBody = document.querySelector('.terminal-body');
    this.history = [];
    this.historyIndex = -1;

    this.commands = {
      help: this.cmdHelp.bind(this),
      about: this.cmdAbout.bind(this),
      bio: this.cmdAbout.bind(this),
      skills: this.cmdSkills.bind(this),
      projects: this.cmdProjects.bind(this),
      iot: this.cmdIot.bind(this),
      contact: this.cmdContact.bind(this),
      clear: this.cmdClear.bind(this),
      cls: this.cmdClear.bind(this),
      fetch: this.cmdFetch.bind(this),
      neofetch: this.cmdFetch.bind(this),
      matrix: this.cmdMatrix.bind(this),
      theme: this.cmdTheme.bind(this),
      date: this.cmdDate.bind(this),
      echo: this.cmdEcho.bind(this),
      sudo: this.cmdSudo.bind(this),
      history: this.cmdHistory.bind(this),
      github: () => { window.open('https://github.com/ArghyaMuk', '_blank'); return '<span class="term-success">Opening https://github.com/ArghyaMuk in a new tab...</span>'; }
    };

    this.init();
  }

  init() {
    if (!this.inputElement || !this.outputElement) return;

    this.inputElement.addEventListener('keydown', (e) => this.handleKeyDown(e));

    // Support clicking on chip buttons
    document.querySelectorAll('.terminal-chip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const cmd = btn.getAttribute('data-cmd');
        if (cmd) {
          this.executeCommand(cmd);
        }
      });
    });
  }

  handleKeyDown(e) {
    if (e.key === 'Enter') {
      const commandLine = this.inputElement.value.trim();
      if (commandLine) {
        this.history.push(commandLine);
        this.historyIndex = this.history.length;
        this.executeCommand(commandLine);
        this.inputElement.value = '';
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (this.history.length > 0 && this.historyIndex > 0) {
        this.historyIndex--;
        this.inputElement.value = this.history[this.historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (this.historyIndex < this.history.length - 1) {
        this.historyIndex++;
        this.inputElement.value = this.history[this.historyIndex];
      } else {
        this.historyIndex = this.history.length;
        this.inputElement.value = '';
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      this.handleTabComplete();
    }
  }

  handleTabComplete() {
    const val = this.inputElement.value.trim().toLowerCase();
    if (!val) return;
    const matches = Object.keys(this.commands).filter(c => c.startsWith(val));
    if (matches.length === 1) {
      this.inputElement.value = matches[0];
    } else if (matches.length > 1) {
      this.printLine(`<span class="term-dim">Possible commands: ${matches.join(', ')}</span>`);
    }
  }

  executeCommand(commandLine) {
    if (window.soundFX) window.soundFX.playKeyClick();

    // Echo command in terminal
    this.printLine(`<span class="term-prompt">arghya@ArghyaX:~$</span> <span class="term-cmd">${this.escapeHTML(commandLine)}</span>`);

    const parts = commandLine.trim().split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    if (this.commands[cmd]) {
      const output = this.commands[cmd](args);
      if (output) {
        this.printLine(output);
      }
    } else {
      this.printLine(`<span class="term-danger">Command not found: '${cmd}'. Type <span class="term-cmd">'help'</span> for available commands.</span>`);
    }

    this.scrollToBottom();
  }

  printLine(htmlContent) {
    const line = document.createElement('div');
    line.className = 'terminal-line';
    line.innerHTML = htmlContent;
    this.outputElement.appendChild(line);
  }

  scrollToBottom() {
    if (this.terminalBody) {
      this.terminalBody.scrollTop = this.terminalBody.scrollHeight;
    }
  }

  escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  cmdHelp() {
    return `
<span class="term-success">=================== ARGHYAOS CLI COMMANDS ===================</span>
<span class="term-cmd">help</span>       - Displays this list of available commands
<span class="term-cmd">about</span>      - Learn more about Arghya Mukherjee & engineering philosophy
<span class="term-cmd">skills</span>     - Summary of technical proficiencies (Python, AI, IoT, APIs)
<span class="term-cmd">projects</span>   - Highlighted engineering projects and architecture
<span class="term-cmd">iot</span>        - Inspect live IoT node telemetry simulation
<span class="term-cmd">fetch</span>      - Display developer profile & system specifications
<span class="term-cmd">contact</span>    - Get direct contact links (Email, GitHub, LinkedIn)
<span class="term-cmd">matrix</span>     - Toggle matrix stream cyber effect
<span class="term-cmd">theme</span>      - Switch theme: 'theme obsidian', 'theme space', 'theme matrix'
<span class="term-cmd">github</span>     - Jump directly to GitHub profile (@ArghyaMuk)
<span class="term-cmd">clear</span>      - Clear terminal screen
<span class="term-dim">Tip: Use Tab for autocomplete and Up/Down arrows for command history.</span>
    `;
  }

  cmdAbout() {
    return `
<span class="term-info">📌 Developer Profile:</span>
<span class="term-cmd">Arghya Mukherjee</span> (ArghyaX)
<span class="term-success">AI/ML &amp; Cloud Engineer @ Tata Consultancy Services (TCS)</span>

Specializing in:
• <span class="term-purple">Agentic AI &amp; Multi-Agent Swarms</span>: LangGraph, LangChain, Strands Agents
• <span class="term-info">LLMs &amp; Enterprise RAG</span>: AWS Bedrock, Azure OpenAI, ChromaDB, Qdrant
• <span class="term-success">Cloud Native &amp; DevOps</span>: Kubernetes, Docker, CI/CD Pipelines, Azure Cloud
• <span class="term-warning">Python &amp; IoT Telemetry</span>: FastAPI, AsyncIO, Celery, ESP32, Raspberry Pi, MQTT

GitHub: <a href="https://github.com/ArghyaMuk" target="_blank" style="color:var(--accent-cyan); text-decoration:underline;">https://github.com/ArghyaMuk</a>
    `;
  }

  cmdSkills() {
    return `
<span class="term-success">⚡ CORE TECHNICAL STACK:</span>
┌────────────────────────────────────────────────────────────────────────┐
│ <span class="term-purple">Agentic AI &amp; LLMs</span>  : LangGraph, LangChain, Strands Agents, AWS Bedrock, RAG
│ <span class="term-info">Cloud &amp; DevOps</span>     : Kubernetes (K8s), Azure, Docker, CI/CD, Linux, Nginx
│ <span class="term-success">Python &amp; Backends</span>  : FastAPI, AsyncIO, Celery, Redis, PostgreSQL, SQLAlchemy
│ <span class="term-warning">IoT &amp; Hardware</span>      : ESP32, Raspberry Pi, MQTT/Mosquitto, I2C/SPI, MicroPython
└────────────────────────────────────────────────────────────────────────┘
    `;
  }

  cmdProjects() {
    return `
<span class="term-success">🚀 FEATURED ENGINEERING PROJECTS:</span>
1. <span class="term-purple">NeuroQuery RAG &amp; Agentic Assistant</span>:
   - Enterprise documentation QA powered by LangGraph, AWS Bedrock &amp; Vector Embeddings.
2. <span class="term-info">OmniSense IoT Telemetry Platform</span>:
   - ESP32 + Raspberry Pi distributed telemetry hub with MQTT &amp; FastAPI WebSocket engine.
3. <span class="term-warning">SentinelGuard Async API Gateway</span>:
   - Async reverse proxy with Redis token-bucket rate limiting and JWT auth verification.
4. <span class="term-success">VisionEdge Edge AI Automation</span>:
   - On-device real-time OpenCV &amp; PyTorch computer vision defect detection pipeline.

<span class="term-dim">Scroll down to the Projects section or click on project cards for deep architecture blueprints!</span>
    `;
  }

  cmdIot() {
    return `
<span class="term-warning">📡 REAL-TIME IOT TELEMETRY NODE HEALTH:</span>
[Node 01: ESP32-TempHum]   : <span class="term-success">ONLINE</span> (24.8°C / 58% RH) - MQTT: 100ms interval
[Node 02: RPi-TelemetryHub] : <span class="term-success">ONLINE</span> (CPU: 22% / Mem: 34%) - Broker: Mosquitto v2.0
[Node 03: VibraSense-Edge]  : <span class="term-success">CALIBRATED</span> (0.04g RMS) - Protocol: Modbus/TCP
<span class="term-info">Check the interactive IoT Telemetry Lab on the page to trigger live sensor spikes and packet inspector!</span>
    `;
  }

  cmdContact() {
    return `
<span class="term-success">📬 CONTACT &amp; CHANNELS:</span>
• GitHub   : <a href="https://github.com/ArghyaMuk" target="_blank" style="color:var(--accent-cyan);">github.com/ArghyaMuk</a>
• Email    : arghya.dev.x@gmail.com
• Status   : AI/ML &amp; Cloud Engineer @ TCS. Open for Agentic AI, Cloud &amp; IoT discussions.
    `;
  }

  cmdClear() {
    this.outputElement.innerHTML = '';
    return null;
  }

  cmdFetch() {
    return `
<pre style="color:var(--accent-cyan); font-size:0.75rem; margin:0.5rem 0;">
      /\\_/\   
     ( o.o )  ArghyaMuk@TCS-Cloud
      > ^ <   --------------------
</pre>
<span class="term-info">Role</span>      : AI/ML &amp; Cloud Engineer @ TCS
<span class="term-info">Stack</span>     : Agentic AI | LangGraph | LangChain | AWS Bedrock | Strands Agents
<span class="term-info">Cloud</span>     : Kubernetes (K8s) | Microsoft Azure | Docker | CI/CD
<span class="term-info">Core</span>      : Python 3.11+ | FastAPI | AsyncIO | Redis | PostgreSQL | MQTT
<span class="term-info">Uptime</span>    : 99.99% High Availability
    `;
  }

  cmdMatrix() {
    const isMatrix = document.body.getAttribute('data-theme') === 'matrix';
    if (isMatrix) {
      document.body.removeAttribute('data-theme');
      return '<span class="term-dim">Matrix mode deactivated. Switched to Obsidian theme.</span>';
    } else {
      document.body.setAttribute('data-theme', 'matrix');
      return '<span class="term-success">Matrix mode activated. Wake up, Neo...</span>';
    }
  }

  cmdTheme(args) {
    const theme = args[0] ? args[0].toLowerCase() : '';
    if (theme === 'space' || theme === 'deep-space') {
      document.body.setAttribute('data-theme', 'deep-space');
      return '<span class="term-info">Theme switched to Deep Space Violet.</span>';
    } else if (theme === 'matrix') {
      document.body.setAttribute('data-theme', 'matrix');
      return '<span class="term-success">Theme switched to Matrix Emerald.</span>';
    } else if (theme === 'obsidian' || theme === 'default') {
      document.body.removeAttribute('data-theme');
      return '<span class="term-cmd">Theme switched to Obsidian Cyber (Default).</span>';
    } else {
      return '<span class="term-warning">Usage: theme [obsidian | space | matrix]</span>';
    }
  }

  cmdDate() {
    return `<span class="term-info">${new Date().toUTCString()}</span>`;
  }

  cmdEcho(args) {
    return `<span class="term-dim">${this.escapeHTML(args.join(' '))}</span>`;
  }

  cmdSudo(args) {
    return `<span class="term-danger">[sudo] password for visitor: *********<br>Permission denied: With great power comes great responsibility!</span>`;
  }

  cmdHistory() {
    if (this.history.length === 0) return '<span class="term-dim">No command history yet.</span>';
    return this.history.map((cmd, i) => `${i + 1}  ${this.escapeHTML(cmd)}`).join('<br>');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.terminalInstance = new InteractiveTerminal();
});
