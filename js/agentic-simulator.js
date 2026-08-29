/**
 * Interactive Multi-Agent Swarm, Cloud Architecture & RAG Studio
 * Author: Arghya Mukherjee (@ArghyaMuk) - AI/ML & Cloud Engineer @ TCS
 */

class AgenticStudio {
  constructor() {
    this.canvas = document.getElementById('agentic-mesh-canvas');
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.currentMode = 'langgraph'; // 'langgraph' | 'multicloud' | 'apisec'

    this.nodes = [];
    this.connections = [];
    this.activePackets = [];

    this.modeMetrics = {
      langgraph: {
        title1: 'Active Swarm Nodes', val1: '5', unit1: 'Agents', badge1: 'LangGraph',
        title2: 'LLM Token Velocity', val2: '1420', unit2: 'tok/sec', badge2: 'AWS Bedrock',
        title3: 'RAG Cosine Precision', val3: '0.952', unit3: 'Score', badge3: 'Chroma/Qdrant',
        title4: 'Inference TTFT', val4: '195', unit4: 'ms', badge4: 'Azure / Bedrock'
      },
      multicloud: {
        title1: 'Multi-Cloud Infrastructure', val1: '3', unit1: 'Clouds', badge1: 'AWS/Azure/GCP',
        title2: 'Kubernetes Pods', val2: '48', unit2: 'Pods', badge2: 'K8s Cluster',
        title3: 'Terraform IaC Resources', val3: '100%', unit3: 'State OK', badge3: 'Terraform Cloud',
        title4: 'GitOps Deployment Sync', val4: '0', unit4: 'Drift', badge4: 'ArgoCD / CI/CD'
      },
      apisec: {
        title1: 'Secure REST API Endpoints', val1: '24', unit1: 'Routes', badge1: 'Python / Flask',
        title2: 'Token Bucket Rate Limit', val2: '1.2M', unit2: 'req/sec', badge2: 'Redis Engine',
        title3: 'Zero-Trust Verification', val3: '100%', unit3: 'JWT / RBAC', badge3: 'OAuth2 / IAM',
        title4: 'Gateway Response Time', val4: '3.8', unit4: 'ms', badge4: 'FastAPI / Async'
      }
    };

    this.logElement = document.getElementById('agentic-log-terminal');
    this.isBurstActive = false;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => {
      this.resize();
      this.initNodesForMode(this.currentMode);
    });

    this.initNodesForMode(this.currentMode);
    this.animate();

    // Start background activity ticker
    setInterval(() => this.generateAgentActivity(), 1800);

    // Bind controls
    this.bindControls();
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height || 220;
  }

  setMode(mode) {
    if (!this.modeMetrics[mode]) return;
    this.currentMode = mode;
    this.activePackets = [];
    this.initNodesForMode(mode);
    this.updateMetricsDisplay(mode);

    // Update active pill button
    document.querySelectorAll('.arch-pill-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-mode') === mode);
    });

    const modeTitles = {
      langgraph: 'Agentic AI Swarm (LangGraph & Strands)',
      multicloud: 'Multi-Cloud Infrastructure (AWS, Azure, GCP & Terraform)',
      apisec: 'Secure Python & Flask RESTful Cloud API Gateway'
    };

    this.logMessage('SYSTEM', `Switched architecture visualizer to [${modeTitles[mode]}]`, 'term-purple');
  }

  initNodesForMode(mode) {
    const w = this.canvas.width;
    const h = this.canvas.height;

    if (mode === 'multicloud') {
      this.nodes = [
        { id: 'tf', label: 'Terraform IaC', x: w * 0.12, y: h * 0.5, color: '#8b5cf6', icon: '🏗️' },
        { id: 'aws', label: 'AWS Bedrock / EKS', x: w * 0.35, y: h * 0.28, color: '#f59e0b', icon: '🟧' },
        { id: 'azure', label: 'Azure AKS Pods', x: w * 0.35, y: h * 0.72, color: '#00d4ff', icon: '🔷' },
        { id: 'gcp', label: 'GCP Vertex AI / GKE', x: w * 0.65, y: h * 0.28, color: '#38bdf8', icon: '🟩' },
        { id: 'k8s', label: 'Kubernetes Ingress', x: w * 0.65, y: h * 0.72, color: '#00f5d4', icon: '☸️' },
        { id: 'gitops', label: 'GitOps CI/CD Sync', x: w * 0.88, y: h * 0.5, color: '#10b981', icon: '🔄' }
      ];

      this.connections = [
        { from: 0, to: 1 },
        { from: 0, to: 2 },
        { from: 0, to: 3 },
        { from: 1, to: 4 },
        { from: 2, to: 4 },
        { from: 3, to: 4 },
        { from: 4, to: 5 }
      ];
    } else if (mode === 'apisec') {
      this.nodes = [
        { id: 'client', label: 'Client / App', x: w * 0.12, y: h * 0.5, color: '#38bdf8', icon: '📱' },
        { id: 'flask', label: 'Flask / FastAPI Gateway', x: w * 0.32, y: h * 0.3, color: '#10b981', icon: '🐍' },
        { id: 'jwt', label: 'OAuth2 / JWT Zero-Trust', x: w * 0.32, y: h * 0.72, color: '#ec4899', icon: '🔒' },
        { id: 'redis', label: 'Redis Rate Limiter', x: w * 0.65, y: h * 0.3, color: '#ef4444', icon: '⚡' },
        { id: 'db', label: 'PostgreSQL DB Pool', x: w * 0.65, y: h * 0.72, color: '#00d4ff', icon: '🐘' },
        { id: 'res', label: 'Cloud Resource API', x: w * 0.88, y: h * 0.5, color: '#f59e0b', icon: '☁️' }
      ];

      this.connections = [
        { from: 0, to: 1 },
        { from: 1, to: 2 },
        { from: 2, to: 3 },
        { from: 3, to: 4 },
        { from: 4, to: 5 },
        { from: 3, to: 5 }
      ];
    } else {
      // Default: langgraph
      this.nodes = [
        { id: 'user', label: 'User Query', x: w * 0.12, y: h * 0.5, color: '#38bdf8', icon: '👤' },
        { id: 'planner', label: 'Chief Planner (LangGraph)', x: w * 0.32, y: h * 0.3, color: '#8b5cf6', icon: '🤖' },
        { id: 'rag', label: 'RAG Retriever (Chroma)', x: w * 0.32, y: h * 0.72, color: '#00f5d4', icon: '🔍' },
        { id: 'bedrock', label: 'AWS Bedrock (Claude 3.5)', x: w * 0.65, y: h * 0.35, color: '#f59e0b', icon: '⚡' },
        { id: 'strands', label: 'Strands Tool Agent', x: w * 0.65, y: h * 0.75, color: '#ec4899', icon: '🛠️' },
        { id: 'output', label: 'Synthesized Response', x: w * 0.88, y: h * 0.5, color: '#10b981', icon: '✨' }
      ];

      this.connections = [
        { from: 0, to: 1 },
        { from: 0, to: 2 },
        { from: 1, to: 3 },
        { from: 2, to: 3 },
        { from: 3, to: 4 },
        { from: 4, to: 1 }, // Feedback cycle
        { from: 3, to: 5 }
      ];
    }
  }

  updateMetricsDisplay(mode) {
    const data = this.modeMetrics[mode];
    if (!data) return;

    const el1 = document.getElementById('metric-agents');
    const el2 = document.getElementById('metric-tokens');
    const el3 = document.getElementById('metric-rag');
    const el4 = document.getElementById('metric-lat');

    if (el1) el1.textContent = data.val1;
    if (el2) el2.textContent = data.val2;
    if (el3) el3.textContent = data.val3;
    if (el4) el4.textContent = data.val4;

    const card1 = document.querySelector('.iot-device-grid > div:nth-child(1) .iot-metric-title');
    const card2 = document.querySelector('.iot-device-grid > div:nth-child(2) .iot-metric-title');
    const card3 = document.querySelector('.iot-device-grid > div:nth-child(3) .iot-metric-title');
    const card4 = document.querySelector('.iot-device-grid > div:nth-child(4) .iot-metric-title');

    if (card1) card1.textContent = data.title1;
    if (card2) card2.textContent = data.title2;
    if (card3) card3.textContent = data.title3;
    if (card4) card4.textContent = data.title4;

    const badge1 = document.querySelector('.iot-device-grid > div:nth-child(1) .badge');
    const badge2 = document.querySelector('.iot-device-grid > div:nth-child(2) .badge');
    const badge3 = document.querySelector('.iot-device-grid > div:nth-child(3) .badge');
    const badge4 = document.querySelector('.iot-device-grid > div:nth-child(4) .badge');

    if (badge1) badge1.textContent = data.badge1;
    if (badge2) badge2.textContent = data.badge2;
    if (badge3) badge3.textContent = data.badge3;
    if (badge4) badge4.textContent = data.badge4;
  }

  bindControls() {
    // Mode switcher pills
    document.querySelectorAll('.arch-pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-mode');
        if (mode) {
          if (window.soundFX) window.soundFX.playKeyClick();
          this.setMode(mode);
        }
      });
    });

    const dispatchBtn = document.getElementById('agent-dispatch-swarm');
    const ragBtn = document.getElementById('agent-trigger-rag');
    const resetBtn = document.getElementById('agent-reset-state');

    if (dispatchBtn) {
      dispatchBtn.addEventListener('click', () => {
        if (window.soundFX) window.soundFX.playSuccessChirp();
        this.triggerBurstAction();
      });
    }

    if (ragBtn) {
      ragBtn.addEventListener('click', () => {
        if (window.soundFX) window.soundFX.playTelemetryBeep();
        this.triggerSecondaryAction();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (window.soundFX) window.soundFX.playKeyClick();
        this.activePackets = [];
        this.logMessage('SYSTEM', 'Execution buffer flushed & node state reset.', 'term-dim');
      });
    }
  }

  triggerBurstAction() {
    this.isBurstActive = true;

    if (this.currentMode === 'multicloud') {
      this.spawnPacket(0, 1);
      this.spawnPacket(0, 2);
      this.spawnPacket(0, 3);
      setTimeout(() => {
        this.spawnPacket(1, 4);
        this.spawnPacket(2, 4);
        this.spawnPacket(3, 4);
      }, 400);
      setTimeout(() => this.spawnPacket(4, 5), 800);

      this.logMessage('TERRAFORM', 'Terraform plan applied across AWS, Azure, and GCP clusters: 12 nodes provisioned.', 'term-purple');
      this.logMessage('KUBERNETES', 'Kubernetes HPA autoscaled: Pods healthy across multi-region VPC peering.', 'term-success');
    } else if (this.currentMode === 'apisec') {
      this.spawnPacket(0, 1);
      setTimeout(() => this.spawnPacket(1, 2), 250);
      setTimeout(() => this.spawnPacket(2, 3), 500);
      setTimeout(() => this.spawnPacket(3, 4), 750);
      setTimeout(() => this.spawnPacket(4, 5), 1000);

      this.logMessage('FLASK_API', 'POST /api/v1/cloud/provision: JWT token verified, rate limit token consumed.', 'term-info');
      this.logMessage('IAM_AUTH', 'OAuth2 Zero-Trust scope verified: Access granted to cloud resource broker.', 'term-success');
    } else {
      this.spawnPacket(0, 1);
      setTimeout(() => this.spawnPacket(1, 3), 350);
      setTimeout(() => this.spawnPacket(3, 4), 700);
      setTimeout(() => this.spawnPacket(4, 1), 1050);
      setTimeout(() => this.spawnPacket(3, 5), 1400);

      this.logMessage('LANGGRAPH', 'State Graph transition: [START] -> [Chief Planner] -> [Agent Swarm Dispatched]', 'term-success');
      this.logMessage('BEDROCK', 'AWS Bedrock invoked: foundation model streaming responses across 4 concurrent branches.', 'term-warning');
    }

    setTimeout(() => {
      this.isBurstActive = false;
    }, 2200);
  }

  triggerSecondaryAction() {
    if (this.currentMode === 'multicloud') {
      this.spawnPacket(0, 1);
      setTimeout(() => this.spawnPacket(1, 4), 350);
      this.logMessage('GITOPS', 'ArgoCD sync completed: Kubernetes manifests synchronized with main branch.', 'term-info');
    } else if (this.currentMode === 'apisec') {
      this.spawnPacket(0, 1);
      setTimeout(() => this.spawnPacket(1, 3), 300);
      this.logMessage('REDIS', 'Rate limiter cache hit: client bucket 998/1000 tokens remaining.', 'term-info');
    } else {
      this.spawnPacket(0, 2);
      setTimeout(() => this.spawnPacket(2, 3), 400);
      setTimeout(() => this.spawnPacket(3, 5), 900);
      this.logMessage('RAG_CORE', 'Hybrid Semantic Vector Search: ChromaDB queried. Top 5 chunks retrieved (Cosine: 0.968).', 'term-info');
    }
  }

  spawnPacket(fromIdx, toIdx) {
    const fromNode = this.nodes[fromIdx];
    const toNode = this.nodes[toIdx];
    if (!fromNode || !toNode) return;

    this.activePackets.push({
      fromX: fromNode.x,
      fromY: fromNode.y,
      toX: toNode.x,
      toY: toNode.y,
      progress: 0,
      color: fromNode.color
    });
  }

  generateAgentActivity() {
    if (this.isBurstActive) return;

    const randomConn = this.connections[Math.floor(Math.random() * this.connections.length)];
    if (randomConn) {
      this.spawnPacket(randomConn.from, randomConn.to);
    }

    const modeLogs = {
      langgraph: [
        { tag: 'LANGGRAPH', msg: 'Cyclical state transition evaluated: condition met -> Tool Call [Code Interpreter].', cls: 'term-purple' },
        { tag: 'AWS_BEDROCK', msg: 'Bedrock Knowledge Base sync: 42 docs embedded with Amazon Titan v2.', cls: 'term-warning' },
        { tag: 'STRANDS_AGENT', msg: 'Strands reasoning loop: autonomous multi-step sub-task resolved in 195ms.', cls: 'term-success' }
      ],
      multicloud: [
        { tag: 'TERRAFORM', msg: 'Terraform State check: 0 changes detected, cloud infra drift: 0.00%.', cls: 'term-purple' },
        { tag: 'KUBERNETES', msg: 'AKS / GKE / EKS worker nodes healthy: CPU 28%, Memory 42%.', cls: 'term-info' },
        { tag: 'GITOPS', msg: 'CI/CD pipeline webhook triggered: automated container scan PASSED.', cls: 'term-success' }
      ],
      apisec: [
        { tag: 'FLASK_API', msg: 'REST endpoint /v1/agents/state dispatched in 4.2ms.', cls: 'term-info' },
        { tag: 'REDIS', msg: 'Token-bucket limiter: 1,420 req/s pipeline latency < 1ms.', cls: 'term-success' },
        { tag: 'POSTGRESQL', msg: 'SQLAlchemy connection pool: 18 active async connections.', cls: 'term-purple' }
      ]
    };

    const logs = modeLogs[this.currentMode] || modeLogs.langgraph;
    const item = logs[Math.floor(Math.random() * logs.length)];
    this.logMessage(item.tag, item.msg, item.cls);
  }

  logMessage(tag, msg, cls = 'term-info') {
    if (!this.logElement) return;

    const timeStr = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const row = document.createElement('div');
    row.className = 'iot-log-row';
    row.innerHTML = `
      <span class="iot-log-time">[${timeStr}]</span>
      <span class="iot-log-topic ${cls}">[${tag}]</span>
      <span class="iot-log-payload">${msg}</span>
    `;

    this.logElement.prepend(row);

    while (this.logElement.children.length > 25) {
      this.logElement.removeChild(this.logElement.lastChild);
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 1. Draw connection lines
    for (let conn of this.connections) {
      const n1 = this.nodes[conn.from];
      const n2 = this.nodes[conn.to];
      if (!n1 || !n2) continue;

      this.ctx.beginPath();
      this.ctx.moveTo(n1.x, n1.y);
      this.ctx.lineTo(n2.x, n2.y);
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      this.ctx.lineWidth = 1.5;
      this.ctx.setLineDash([4, 4]);
      this.ctx.stroke();
      this.ctx.setLineDash([]);
    }

    // 2. Draw animated moving packets
    for (let i = this.activePackets.length - 1; i >= 0; i--) {
      const p = this.activePackets[i];
      p.progress += 0.035;

      const currentX = p.fromX + (p.toX - p.fromX) * p.progress;
      const currentY = p.fromY + (p.toY - p.fromY) * p.progress;

      this.ctx.beginPath();
      this.ctx.arc(currentX, currentY, 4, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.shadowColor = p.color;
      this.ctx.shadowBlur = 10;
      this.ctx.fill();
      this.ctx.shadowBlur = 0;

      if (p.progress >= 1) {
        this.activePackets.splice(i, 1);
      }
    }

    // 3. Draw Nodes
    for (let n of this.nodes) {
      // Glow ring
      this.ctx.beginPath();
      this.ctx.arc(n.x, n.y, 22, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(18, 22, 36, 0.9)';
      this.ctx.strokeStyle = n.color;
      this.ctx.lineWidth = 2;
      this.ctx.shadowColor = n.color;
      this.ctx.shadowBlur = 8;
      this.ctx.fill();
      this.ctx.stroke();
      this.ctx.shadowBlur = 0;

      // Icon
      this.ctx.font = '13px sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(n.icon, n.x, n.y);

      // Label below
      this.ctx.font = '10px var(--font-mono)';
      this.ctx.fillStyle = '#cbd5e1';
      this.ctx.fillText(n.label, n.x, n.y + 32);
    }

    requestAnimationFrame(() => this.animate());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.agenticStudioInstance = new AgenticStudio();
});
