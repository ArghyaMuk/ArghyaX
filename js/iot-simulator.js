/**
 * Interactive IoT Telemetry Simulator & Live Waveform Graph
 * Author: Arghya Mukherjee (@ArghyaMuk)
 */

class IoTSimulator {
  constructor() {
    this.canvas = document.getElementById('iot-telemetry-canvas');
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.dataPoints = [];
    this.maxPoints = 60;

    // Simulated sensor states
    this.metrics = {
      temp: 24.5,
      humidity: 58,
      pressure: 1013.2,
      vibration: 0.04
    };

    this.isSpikeActive = false;
    this.packetCount = 1420;
    this.logElement = document.getElementById('iot-log-terminal');

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Pre-populate initial data points
    for (let i = 0; i < this.maxPoints; i++) {
      this.dataPoints.push(24 + (Math.sin(i / 4) * 2) + (Math.random() * 0.8));
    }

    // Start graph animation loop
    this.animate();

    // Start periodic data generator
    setInterval(() => this.updateTelemetry(), 1200);

    // Bind interactive buttons
    this.bindControls();
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height || 170;
  }

  bindControls() {
    const triggerPulseBtn = document.getElementById('iot-trigger-pulse');
    const toggleNodeBtn = document.getElementById('iot-toggle-node');
    const calibrateBtn = document.getElementById('iot-calibrate');

    if (triggerPulseBtn) {
      triggerPulseBtn.addEventListener('click', () => {
        if (window.soundFX) window.soundFX.playTelemetryBeep();
        this.triggerPulse();
      });
    }

    if (toggleNodeBtn) {
      let nodeActive = true;
      toggleNodeBtn.addEventListener('click', () => {
        if (window.soundFX) window.soundFX.playKeyClick();
        nodeActive = !nodeActive;
        toggleNodeBtn.textContent = nodeActive ? 'Node: Online' : 'Node: Suspended';
        toggleNodeBtn.style.color = nodeActive ? 'var(--accent-emerald)' : 'var(--accent-pink)';
        this.logPacket('system/node/status', `{"node": "ESP32_01", "state": "${nodeActive ? 'ACTIVE' : 'STANDBY'}"}`);
      });
    }

    if (calibrateBtn) {
      calibrateBtn.addEventListener('click', () => {
        if (window.soundFX) window.soundFX.playKeyClick();
        this.metrics.temp = 24.0;
        this.metrics.vibration = 0.02;
        this.updateDOMMetrics();
        this.logPacket('sensors/calibrate', '{"status": "SUCCESS", "drift_corrected": "-0.04%"}');
      });
    }
  }

  triggerPulse() {
    this.isSpikeActive = true;
    this.metrics.temp += 3.5;
    this.metrics.vibration = 0.32;
    this.updateDOMMetrics();
    this.logPacket('alert/sensor/threshold_exceeded', `{"temp": ${this.metrics.temp.toFixed(1)}, "vibration": ${this.metrics.vibration.toFixed(2)}, "flag": "WARN"}`);

    setTimeout(() => {
      this.isSpikeActive = false;
    }, 2800);
  }

  updateTelemetry() {
    // Slight random drift
    const tempDelta = (Math.random() - 0.5) * 0.4;
    const humDelta = (Math.random() - 0.5) * 1.2;
    const pressDelta = (Math.random() - 0.5) * 0.3;

    if (!this.isSpikeActive) {
      this.metrics.temp = Math.max(20, Math.min(35, this.metrics.temp + tempDelta));
      this.metrics.vibration = Math.max(0.01, Math.min(0.09, 0.04 + (Math.random() - 0.5) * 0.02));
    } else {
      this.metrics.temp = Math.max(24, this.metrics.temp - 0.6);
      this.metrics.vibration = Math.max(0.04, this.metrics.vibration - 0.05);
    }

    this.metrics.humidity = Math.max(40, Math.min(80, this.metrics.humidity + humDelta));
    this.metrics.pressure = +(1013.2 + pressDelta).toFixed(1);

    this.dataPoints.push(this.metrics.temp);
    if (this.dataPoints.length > this.maxPoints) {
      this.dataPoints.shift();
    }

    this.updateDOMMetrics();

    // Log MQTT packet occasionally
    this.packetCount++;
    const topics = [
      { topic: 'sensor/esp32/telemetry', payload: `{"t":${this.metrics.temp.toFixed(1)},"h":${this.metrics.humidity.toFixed(0)},"p":${this.metrics.pressure}}` },
      { topic: 'gateway/rpi/heartbeat', payload: `{"uptime":"99.98%","cpu":22,"rssi":-48}` },
      { topic: 'ai/vision/stream', payload: `{"fps":29.8,"latency_ms":38,"detections":1}` }
    ];

    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    this.logPacket(randomTopic.topic, randomTopic.payload);
  }

  updateDOMMetrics() {
    const tempEl = document.getElementById('metric-temp');
    const humEl = document.getElementById('metric-hum');
    const pressEl = document.getElementById('metric-press');
    const vibEl = document.getElementById('metric-vib');

    if (tempEl) tempEl.textContent = this.metrics.temp.toFixed(1);
    if (humEl) humEl.textContent = this.metrics.humidity.toFixed(0);
    if (pressEl) pressEl.textContent = this.metrics.pressure.toFixed(1);
    if (vibEl) vibEl.textContent = this.metrics.vibration.toFixed(2);
  }

  logPacket(topic, payload) {
    if (!this.logElement) return;

    const timeStr = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const row = document.createElement('div');
    row.className = 'iot-log-row';
    row.innerHTML = `
      <span class="iot-log-time">[${timeStr}]</span>
      <span class="iot-log-topic">${topic}</span>
      <span class="iot-log-payload">${payload}</span>
    `;

    this.logElement.prepend(row);

    // Keep log max 25 entries
    while (this.logElement.children.length > 25) {
      this.logElement.removeChild(this.logElement.lastChild);
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const width = this.canvas.width;
    const height = this.canvas.height;
    const step = width / (this.maxPoints - 1);

    // Draw grid lines
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    this.ctx.lineWidth = 1;

    for (let y = 30; y < height; y += 35) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(width, y);
      this.ctx.stroke();
    }

    // Min / Max scaling for waveform
    const minVal = 18;
    const maxVal = 38;
    const range = maxVal - minVal;

    // Create waveform path
    this.ctx.beginPath();
    for (let i = 0; i < this.dataPoints.length; i++) {
      const val = this.dataPoints[i];
      const normalized = (val - minVal) / range;
      const x = i * step;
      const y = height - (normalized * (height - 30)) - 15;

      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        // Smooth curve
        const prevX = (i - 1) * step;
        const prevVal = this.dataPoints[i - 1];
        const prevNorm = (prevVal - minVal) / range;
        const prevY = height - (prevNorm * (height - 30)) - 15;
        const cx = (prevX + x) / 2;
        this.ctx.quadraticCurveTo(prevX, prevY, cx, (prevY + y) / 2);
      }
    }

    // Gradient stroke
    const strokeGradient = this.ctx.createLinearGradient(0, 0, width, 0);
    strokeGradient.addColorStop(0, '#38bdf8');
    strokeGradient.addColorStop(0.5, '#00f5d4');
    strokeGradient.addColorStop(1, '#8b5cf6');

    this.ctx.strokeStyle = strokeGradient;
    this.ctx.lineWidth = 2.5;
    this.ctx.stroke();

    // Area fill gradient below curve
    this.ctx.lineTo(width, height);
    this.ctx.lineTo(0, height);
    this.ctx.closePath();

    const fillGradient = this.ctx.createLinearGradient(0, 0, 0, height);
    fillGradient.addColorStop(0, 'rgba(0, 245, 212, 0.25)');
    fillGradient.addColorStop(1, 'rgba(0, 245, 212, 0.0)');
    this.ctx.fillStyle = fillGradient;
    this.ctx.fill();

    requestAnimationFrame(() => this.animate());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.iotSimInstance = new IoTSimulator();
});
