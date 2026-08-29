/**
 * J.A.R.V.I.S. Neural Q&A Chatbot Engine
 * Author: Arghya Mukherjee (@ArghyaMuk) - AI/ML & Cloud Engineer @ TCS
 */

class JarvisChatbot {
  constructor() {
    this.chatTrigger = document.getElementById('jarvis-chat-trigger');
    this.chatModal = document.getElementById('jarvis-chat-modal');
    this.closeBtn = document.getElementById('jarvis-chat-close');
    this.clearBtn = document.getElementById('jarvis-chat-clear');
    this.messagesContainer = document.getElementById('jarvis-messages-body');
    this.inputField = document.getElementById('jarvis-chat-input');
    this.sendBtn = document.getElementById('jarvis-chat-send');
    this.chipsContainer = document.getElementById('jarvis-quick-chips');

    this.isOpen = false;
    this.isTyping = false;

    this.knowledgeBase = this.initKnowledgeBase();
    this.init();
  }

  init() {
    if (!this.chatTrigger || !this.chatModal) return;

    // Toggle Chat
    this.chatTrigger.addEventListener('click', () => this.toggleChat());
    if (this.closeBtn) this.closeBtn.addEventListener('click', () => this.toggleChat(false));
    if (this.clearBtn) this.clearBtn.addEventListener('click', () => this.clearChat());

    // Send Message
    if (this.sendBtn) this.sendBtn.addEventListener('click', () => this.handleUserSend());
    if (this.inputField) {
      this.inputField.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.handleUserSend();
        }
      });
    }

    // Quick Chips Click
    if (this.chipsContainer) {
      this.chipsContainer.addEventListener('click', (e) => {
        const chip = e.target.closest('.jarvis-chip');
        if (chip && !this.isTyping) {
          const query = chip.getAttribute('data-query');
          if (query) {
            this.sendUserMessage(query);
          }
        }
      });
    }

    // Welcome Greeting after first render
    setTimeout(() => {
      if (this.messagesContainer && this.messagesContainer.children.length === 0) {
        this.addBotMessage(
          "DedSec // ctOS 2.0 Profiler Online. Neural uplink established to Arghya Mukherjee's portfolio mainframe. Ask anything about his **Agentic AI systems (LangGraph, Strands)**, **Multi-Cloud & GitOps (AWS, Azure, GCP, Kubernetes)**, or **Python/Flask** architectures.",
          false
        );
      }
    }, 600);
  }

  toggleChat(forceState) {
    this.isOpen = forceState !== undefined ? forceState : !this.isOpen;
    if (this.isOpen) {
      this.chatModal.classList.add('active');
      this.chatTrigger.classList.add('chat-open');
      if (window.soundFX) window.soundFX.playSuccessChirp();
      setTimeout(() => {
        if (this.inputField) this.inputField.focus();
      }, 200);
    } else {
      this.chatModal.classList.remove('active');
      this.chatTrigger.classList.remove('chat-open');
      if (window.soundFX) window.soundFX.playKeyClick();
    }
  }

  clearChat() {
    if (this.messagesContainer) {
      this.messagesContainer.innerHTML = '';
      this.addBotMessage("ctOS memory buffer flushed. DedSec Profiler is ready for your query.", false);
      if (window.soundFX) window.soundFX.playKeyClick();
    }
  }

  handleUserSend() {
    if (this.isTyping || !this.inputField) return;
    const text = this.inputField.value.trim();
    if (!text) return;

    this.inputField.value = '';
    this.sendUserMessage(text);
  }

  sendUserMessage(text) {
    this.addUserMessage(text);
    if (window.soundFX) window.soundFX.playKeyClick();

    // Show Typing Indicator
    this.showTypingIndicator();

    // Generate intelligent response
    setTimeout(() => {
      this.hideTypingIndicator();
      const reply = this.generateResponse(text);
      this.addBotMessage(reply, true);
    }, 450 + Math.random() * 350);
  }

  addUserMessage(text) {
    if (!this.messagesContainer) return;
    const msgDiv = document.createElement('div');
    msgDiv.className = 'jarvis-msg user-msg';
    msgDiv.innerHTML = `
      <div class="msg-bubble">${this.escapeHTML(text)}</div>
      <span class="msg-time">${this.getCurrentTime()}</span>
    `;
    this.messagesContainer.appendChild(msgDiv);
    this.scrollToBottom();
  }

  addBotMessage(markdownText, animate = false) {
    if (!this.messagesContainer) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = 'jarvis-msg bot-msg';
    msgDiv.innerHTML = `
      <div class="msg-avatar">
        <img src="assets/dedsec_emblem.jpg" alt="DedSec" class="wd-bot-avatar" />
      </div>
      <div class="msg-content">
        <div class="msg-sender">[DEDSEC // ctOS_PROFILER_v2.0]</div>
        <div class="msg-bubble"></div>
        <span class="msg-time">${this.getCurrentTime()}</span>
      </div>
    `;

    this.messagesContainer.appendChild(msgDiv);
    const bubble = msgDiv.querySelector('.msg-bubble');

    if (!animate) {
      bubble.innerHTML = this.parseMarkdown(markdownText);
      this.scrollToBottom();
      return;
    }

    // Token streaming simulation
    this.isTyping = true;
    const words = markdownText.split(' ');
    let currentIdx = 0;
    bubble.innerHTML = '';

    const interval = setInterval(() => {
      if (currentIdx < words.length) {
        currentIdx++;
        bubble.innerHTML = this.parseMarkdown(words.slice(0, currentIdx).join(' '));
        this.scrollToBottom();
      } else {
        clearInterval(interval);
        this.isTyping = false;
        if (window.soundFX) window.soundFX.playTelemetryBeep();
      }
    }, 32);
  }

  showTypingIndicator() {
    if (!this.messagesContainer) return;
    const typingDiv = document.createElement('div');
    typingDiv.id = 'jarvis-typing-indicator';
    typingDiv.className = 'jarvis-msg bot-msg typing-msg';
    typingDiv.innerHTML = `
      <div class="msg-avatar"><span>🤖</span></div>
      <div class="msg-content">
        <div class="msg-bubble typing-dots">
          <span></span><span></span><span></span>
        </div>
      </div>
    `;
    this.messagesContainer.appendChild(typingDiv);
    this.scrollToBottom();
  }

  hideTypingIndicator() {
    const indicator = document.getElementById('jarvis-typing-indicator');
    if (indicator && indicator.parentElement) {
      indicator.parentElement.removeChild(indicator);
    }
  }

  scrollToBottom() {
    if (this.messagesContainer) {
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
  }

  getCurrentTime() {
    return new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
  }

  escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  parseMarkdown(text) {
    let parsed = text
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Inline Code
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      // Bullet points
      .replace(/\n• /g, '<br>• ')
      .replace(/\n\n/g, '<br><br>');

    return parsed;
  }

  /* --------------------------------------------------------------------------
     Conversational Intelligence & Query Matching
     -------------------------------------------------------------------------- */
  generateResponse(query) {
    const q = query.toLowerCase().trim();

    // 1. Who is Arghya / Background / TCS
    if (q.includes('who is') || q.includes('about') || q.includes('bio') || q.includes('background') || q.includes('profile') || q.includes('tcs') || q.includes('experience')) {
      return "**Arghya Mukherjee (ArghyaX)** is an **AI/ML & Cloud Engineer at Tata Consultancy Services (TCS)**.\n\nHe specializes in building production-grade **Agentic AI systems** across **AWS, Azure, and GCP**. His core expertise includes:\n• **Agentic AI & Swarms**: LangGraph, LangChain, Strands Agents\n• **Cloud & IaC**: AWS Bedrock, Azure AKS, GCP Vertex AI, Terraform, Kubernetes (K8s), GitOps\n• **Backend & Security**: Python, Flask, FastAPI, Redis caching, Zero-Trust OAuth2/JWT\n• **LLMOps**: ChromaDB, Qdrant, Amazon Titan, Claude 3.5 Sonnet";
    }

    // 2. Agentic AI / LangGraph / Strands
    if (q.includes('agent') || q.includes('langgraph') || q.includes('strands') || q.includes('swarm') || q.includes('langchain')) {
      return "Arghya architects stateful **multi-agent orchestration frameworks** using **LangGraph**, **LangChain**, and **Strands Agents**:\n\n• **Cyclic State Graphs**: Enables autonomous planning, self-reflection, tool execution, and state rollback.\n• **Dynamic Tool Calling**: Strands Agents dynamically execute web search, database querying, and code execution.\n• **Foundation Models**: Seamlessly routed through **AWS Bedrock (Claude 3.5 Sonnet / Amazon Titan)** with strict hallucination guardrails.";
    }

    // 3. Multi-Cloud / Terraform / Kubernetes / GitOps
    if (q.includes('cloud') || q.includes('terraform') || q.includes('iac') || q.includes('aws') || q.includes('azure') || q.includes('gcp') || q.includes('kubernetes') || q.includes('k8s') || q.includes('gitops') || q.includes('docker')) {
      return "Arghya designs scalable, cloud-native infrastructure across **AWS, Azure, and Google Cloud Platform (GCP)**:\n\n• **Terraform (IaC)**: Automated declarative provisioning of VPCs, container clusters, and cloud AI gateways with remote state locking.\n• **Kubernetes & GitOps**: Multi-region pod orchestration (EKS/AKS/GKE), Helm charts, ArgoCD automated sync, and Horizontal Pod Autoscaling (HPA).\n• **CI/CD Automation**: GitHub Actions multi-stage container builds with automated linting and zero-downtime rollouts.";
    }

    // 4. Python, Flask, FastAPI & REST APIs
    if (q.includes('python') || q.includes('flask') || q.includes('fastapi') || q.includes('api') || q.includes('rest') || q.includes('backend') || q.includes('redis') || q.includes('postgres')) {
      return "For backend engineering, Arghya develops **high-throughput asynchronous Python microservices**:\n\n• **Flask & FastAPI**: Modular blueprints, async handlers, Pydantic v2 schemas, and auto-generated OpenAPI documentation.\n• **Security Layer**: Zero-Trust architecture with cryptographic OAuth2 / JWT authentication and RBAC.\n• **Performance & Caching**: Redis token-bucket rate limiters (< 2ms overhead) and asynchronous PostgreSQL connection pooling via SQLAlchemy v2.";
    }

    // 5. RAG & Vector Databases
    if (q.includes('rag') || q.includes('vector') || q.includes('chroma') || q.includes('qdrant') || q.includes('embedding') || q.includes('bedrock')) {
      return "Arghya builds enterprise **Retrieval-Augmented Generation (RAG)** systems:\n\n• **Hybrid Search**: Dense vector embeddings paired with reciprocal rank fusion (RRF) reranking.\n• **Vector Stores**: ChromaDB for rapid local development and Qdrant for enterprise cloud clusters.\n• **Grounded Accuracy**: AWS Bedrock Knowledge Base integrations with sub-200ms Time-to-First-Token (TTFT) and strict citation verification.";
    }

    // 6. Projects Breakdown
    if (q.includes('project') || q.includes('portfolio') || q.includes('work') || q.includes('built')) {
      return "Arghya has engineered several flagship production systems:\n\n1. **AgentGraph Multi-Agent Orchestrator**: Autonomous agent swarm framework with LangGraph, Strands Agents & AWS Bedrock.\n2. **NeuroQuery Enterprise RAG Engine**: High-throughput semantic document QA powered by ChromaDB, Qdrant & FastAPI.\n3. **SentinelGuard Cloud API Gateway**: Kubernetes-native reverse proxy with Redis token-bucket rate limiter and JWT zero-trust auth.\n4. **CloudOps Kubernetes GitOps Engine**: Automated CI/CD pipeline deploying containerized AI agent workloads to Azure AKS & GCP.";
    }

    // 7. Contact / Hire / Socials
    if (q.includes('contact') || q.includes('email') || q.includes('hire') || q.includes('reach') || q.includes('github') || q.includes('linkedin') || q.includes('message')) {
      return "You can connect with Arghya through the following channels:\n\n• **Email**: [arghyamukherjee06@gmail.com](mailto:arghyamukherjee06@gmail.com)\n• **GitHub**: [github.com/ArghyaMuk](https://github.com/ArghyaMuk)\n• **Contact Form**: Use the interactive dispatcher at the bottom of this page!\n\nHe is actively open for technical collaborations, Agentic AI architectures, and cloud migrations.";
    }

    // 8. General Greetings
    if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('greetings') || q.includes('dedsec') || q.includes('ctos') || q.includes('jarvis')) {
      return "DedSec // ctOS 2.0 Profiler Online. Neural uplink established to Arghya's knowledge base. Feel free to ask about his **TCS AI/ML experience**, **LangGraph swarms**, **Multi-Cloud Terraform pipelines**, or **Python/Flask REST APIs**!";
    }

    // 9. General Technical & Conceptual Questions
    if (q.includes('what is agentic ai') || q.includes('what is langgraph')) {
      return "**Agentic AI** moves beyond static prompt-response LLMs into autonomous agents capable of **iterative reasoning, multi-step planning, dynamic tool invocation, and stateful memory**. LangGraph allows building cyclic graphs with human-in-the-loop validation and checkpointed persistence.";
    }

    if (q.includes('what is gitops') || q.includes('what is terraform')) {
      return "**Terraform** is declarative Infrastructure as Code (IaC) that defines cloud resources in reusable code. **GitOps** uses Git as the single source of truth for cloud deployments, ensuring Kubernetes clusters automatically synchronize with repository commits via tools like ArgoCD.";
    }

    // Fallback response
    return `Regarding "${this.escapeHTML(query)}": Arghya applies engineering rigor across **Agentic AI (LangGraph, Strands)**, **Multi-Cloud (AWS, Azure, GCP)**, **Terraform/Kubernetes**, and **Python/Flask RESTful APIs**.\n\nWould you like to explore his **featured projects**, **technical skills matrix**, or **direct contact details**?`;
  }

  initKnowledgeBase() {
    return {
      name: "Arghya Mukherjee",
      handle: "ArghyaX",
      role: "AI/ML & Cloud Engineer @ Tata Consultancy Services (TCS)",
      email: "arghyamukherjee06@gmail.com",
      github: "https://github.com/ArghyaMuk"
    };
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.jarvisChatbot = new JarvisChatbot();
});
