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
      agent: this.cmdAgent.bind(this),
      rag: this.cmdRag.bind(this),
      cloud: this.cmdCloud.bind(this),
      terraform: this.cmdTerraform.bind(this),
      tf: this.cmdTerraform.bind(this),
      gcp: this.cmdGcp.bind(this),
      flask: this.cmdFlask.bind(this),
      api: this.cmdFlask.bind(this),
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
<span class="term-cmd">about</span>      - Developer profile &amp; TCS AI/ML Cloud background
<span class="term-cmd">skills</span>     - Core technical stack (Agentic AI, AWS, Azure, GCP, K8s, Python)
<span class="term-cmd">projects</span>   - Highlighted enterprise solutions &amp; architecture
<span class="term-cmd">agent</span>      - Inspect live LangGraph &amp; Strands multi-agent state
<span class="term-cmd">terraform</span>  - View Infrastructure as Code (IaC) &amp; GitOps status
<span class="term-cmd">gcp</span>        - Google Cloud Platform &amp; Multi-Cloud cluster telemetry
<span class="term-cmd">flask</span>      - Inspect Python &amp; Flask RESTful API Gateway layer
<span class="term-cmd">rag</span>        - Query AWS Bedrock &amp; ChromaDB RAG vector engine
<span class="term-cmd">cloud</span>      - Multi-Cloud (AWS, Azure, GCP) infrastructure overview
<span class="term-cmd">fetch</span>      - Display system runtime &amp; credentials
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

Building production-grade Agentic AI systems across AWS, Azure, and GCP:
• <span class="term-purple">Agentic AI &amp; Multi-Agent Swarms</span>: LangGraph, LangChain, Strands Agents
• <span class="term-info">Multi-Cloud &amp; IaC</span>: AWS Bedrock, Azure (AKS), GCP (Vertex/GKE), Terraform
• <span class="term-success">Container &amp; GitOps</span>: Kubernetes (K8s), Docker, GitHub Actions, Helm, ArgoCD
• <span class="term-warning">Python, Flask &amp; APIs</span>: Flask, FastAPI, AsyncIO, Redis, PostgreSQL, Zero-Trust

GitHub: <a href="https://github.com/ArghyaMuk" target="_blank" style="color:var(--accent-cyan); text-decoration:underline;">https://github.com/ArghyaMuk</a>
    `;
  }

  cmdSkills() {
    return `
<span class="term-success">⚡ CORE TECHNICAL STACK:</span>
┌────────────────────────────────────────────────────────────────────────┐
│ <span class="term-purple">Agentic AI &amp; LLMs</span>  : LangGraph, LangChain, Strands Agents, AWS Bedrock, RAG
│ <span class="term-info">Cloud &amp; IaC</span>        : AWS, Azure, GCP, Terraform, Kubernetes (K8s), GitOps
│ <span class="term-success">Python &amp; APIs</span>      : Python 3.11, Flask, FastAPI, AsyncIO, Redis, PostgreSQL
│ <span class="term-warning">LLMOps &amp; Security</span>  : ChromaDB, Qdrant, OAuth2 / JWT Zero-Trust, Docker
└────────────────────────────────────────────────────────────────────────┘
    `;
  }

  cmdProjects() {
    return `
<span class="term-success">🚀 FEATURED ENGINEERING PROJECTS:</span>
1. <span class="term-purple">AgentGraph Multi-Agent Orchestrator</span>:
   - Stateful multi-agent swarm framework built with LangGraph, Strands Agents &amp; AWS Bedrock.
2. <span class="term-info">NeuroQuery Enterprise RAG Engine</span>:
   - Grounded document QA powered by LangChain, AWS Bedrock, ChromaDB &amp; Qdrant.
3. <span class="term-warning">SentinelGuard Cloud API Gateway</span>:
   - Kubernetes-native reverse proxy with Redis token-bucket rate limiter &amp; JWT zero-trust auth.
4. <span class="term-success">CloudOps Kubernetes GitOps Engine</span>:
   - Automated CI/CD pipelines deploying AI agent microservices on Azure AKS &amp; GCP.

<span class="term-dim">Scroll down to the Projects section or click on project cards for deep architecture blueprints!</span>
    `;
  }

  cmdAgent() {
    return `
<span class="term-purple">🤖 LANGGRAPH MULTI-AGENT SWARM STATUS:</span>
[Node: Chief Planner]     : <span class="term-success">ACTIVE</span> (State Graph: Cyclic / In-Memory Checkpointer)
[Node: Strands Tool Agent] : <span class="term-success">READY</span> (Registered Tools: WebSearch, VectorQuery, CodeExec)
[Node: AWS Bedrock LLM]   : <span class="term-success">CONNECTED</span> (Model: Anthropic Claude 3.5 Sonnet)
[Node: RAG Verifier]      : <span class="term-success">OPTIMAL</span> (Hallucination Guardrail: 0.98 Confidence)
<span class="term-info">Explore the interactive Agentic AI Studio on the page to dispatch live agent swarms!</span>
    `;
  }

  cmdTerraform() {
    return `
<span class="term-purple">🏗️ TERRAFORM INFRASTRUCTURE AS CODE (IaC):</span>
• Cloud Targets       : AWS (EKS, Bedrock, VPC) • Azure (AKS, Key Vault) • GCP (GKE, Artifacts)
• Modules Configured  : 14 Reusable HCL Modules
• State Backend       : Terraform Cloud Remote State Locking
• IaC Security        : tfsec &amp; Checkov automated scanning PASSED
    `;
  }

  cmdGcp() {
    return `
<span class="term-info">🟩 GOOGLE CLOUD PLATFORM (GCP) INTEGRATION:</span>
• Compute Engine      : Google Kubernetes Engine (GKE Autopilot)
• AI Platform         : Vertex AI Foundation Model Gateway
• Security &amp; IAM      : Workload Identity Federation with AWS / Azure
• Networking          : Cloud Armor DDoS defense &amp; Global HTTPS Load Balancer
    `;
  }

  cmdFlask() {
    return `
<span class="term-success">🐍 PYTHON &amp; FLASK RESTFUL API GATEWAY:</span>
• Architecture        : Modular Flask Blueprints &amp; FastAPI Async Microservices
• Security Layer      : OAuth2.0 / JWT Cryptographic Validation &amp; RBAC
• Performance         : Redis Token Bucket Rate Limiter (< 2ms execution)
• Database Pool       : SQLAlchemy Async connection pooling with PostgreSQL
    `;
  }

  cmdRag() {
    return `
<span class="term-info">🔍 HYBRID RAG VECTOR STORE ENGINE:</span>
• Embeddings Engine    : Amazon Titan Multimodal v2 / OpenAI text-embedding-3-large
• Vector Stores        : ChromaDB (Local dev) / Qdrant (Cloud cluster)
• Retrieval Precision  : 96.2% Grounded Accuracy (Reciprocal Rank Fusion)
• Latency (TTFT)       : ~190ms streaming via FastAPI WebSockets
    `;
  }

  cmdCloud() {
    return `
<span class="term-success">☁️ MULTI-CLOUD INFRASTRUCTURE (AWS, Azure &amp; GCP):</span>
• Kubernetes (K8s)     : 12 Node Multi-Region Pool • 48 Microservice Deployments • HPA Active
• Cloud AI Gateways    : AWS Bedrock + Azure OpenAI + GCP Vertex AI
• CI/CD &amp; GitOps       : GitHub Actions automated lint, test, Docker build &amp; ArgoCD sync
• Observability        : Prometheus metrics + Grafana dashboard stream
    `;
  }

  cmdContact() {
    return `
<span class="term-success">📬 CONTACT &amp; CHANNELS:</span>
• GitHub   : <a href="https://github.com/ArghyaMuk" target="_blank" style="color:var(--accent-cyan);">github.com/ArghyaMuk</a>
• Email    : arghyamukherjee06@gmail.com
• Status   : AI/ML &amp; Cloud Engineer @ TCS. Open for Agentic AI, Cloud &amp; LLM discussions.
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
     ( o.o )  ArghyaMuk-Cloud
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
