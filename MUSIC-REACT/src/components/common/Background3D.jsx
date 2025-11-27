import { useEffect, useRef } from 'react';

// Upgraded music-themed animated background.
// Features:
// - Soft animated gradient + glow
// - Floating musical-note particles (3D perspective)
// - Optional audio-reactive frequency bars when `audioId` prop is provided
// - Lightweight, no external libs
export default function Background3D({
  color = '#9be7ff',
  noteColor = '#9be7ff',
  audioId = null, // pass the id of an <audio> element to make it reactive
}) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    const DPR = Math.max(1, window.devicePixelRatio || 1);
    canvas.width = w * DPR;
    canvas.height = h * DPR;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    const NOTES = 48; // slightly increased particle count for richness
    const depth = 1200;
    const FOV = 640;

    const particles = [];
    for (let i = 0; i < NOTES; i++) {
      particles.push({
        x: (Math.random() - 0.5) * w * 2,
        y: (Math.random() - 0.5) * h * 2,
        z: Math.random() * depth,
        speed: 0.2 + Math.random() * 1.2,
        rot: Math.random() * Math.PI * 2,
        baseSize: 8 + Math.random() * 18,
        alpha: 0.25 + Math.random() * 0.8,
      });
    }

    // WebAudio analyzer (optional)
    let audioCtx = null;
    let analyser = null;
    let freqData = null;
    let audioSource = null;

    if (audioId) {
      try {
        const audioEl = document.getElementById(audioId);
        if (audioEl && audioEl instanceof HTMLMediaElement) {
          audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          analyser = audioCtx.createAnalyser();
          analyser.fftSize = 512;
          freqData = new Uint8Array(analyser.frequencyBinCount);
          // capture from element but do not re-route to destination to avoid echo
          audioSource = audioCtx.createMediaElementSource(audioEl);
          audioSource.connect(analyser);
        }
      } catch (e) {
        // fail silently — visualization will fall back to idle animation
        console.warn('Background3D: audio analyzer unavailable', e);
      }
    }

    let rafId;

    function resize() {
      const oldW = w;
      const oldH = h;
      w = window.innerWidth;
      h = window.innerHeight;
      const DPR = Math.max(1, window.devicePixelRatio || 1);
      canvas.width = w * DPR;
      canvas.height = h * DPR;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      const sx = oldW ? w / oldW : 1;
      const sy = oldH ? h / oldH : 1;
      for (let p of particles) {
        p.x *= sx;
        p.y *= sy;
      }
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    function drawNote(ctx, x, y, s, rot) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.beginPath();
      ctx.rect(-s * 0.08, -s * 0.9, s * 0.16, s * 1.4);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(s * 0.25, s * 0.35, s * 0.45, s * 0.32, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(s * 0.08, -s * 0.9);
      ctx.quadraticCurveTo(s * 0.6, -s * 0.6, s * 0.9, -s * 0.2);
      ctx.lineWidth = Math.max(1, s * 0.06);
      ctx.stroke();
      ctx.restore();
    }

    function render(t) {
      ctx.clearRect(0, 0, w, h);

      // Background: smooth animated gradient
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, 'rgba(6,12,34,0.95)');
      g.addColorStop(0.5, 'rgba(18,24,58,0.85)');
      g.addColorStop(1, 'rgba(6,12,34,0.95)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // Soft radial glow in center
      const rx = w * 0.5 + Math.sin(t * 0.0002) * w * 0.08;
      const ry = h * 0.45 + Math.cos(t * 0.00015) * h * 0.03;
      const rg = ctx.createRadialGradient(rx, ry, 40, rx, ry, Math.max(w, h));
      rg.addColorStop(0, 'rgba(30,100,255,0.06)');
      rg.addColorStop(0.3, 'rgba(155,231,255,0.03)');
      rg.addColorStop(1, 'rgba(8,10,18,0)');
      ctx.fillStyle = rg;
      ctx.fillRect(0, 0, w, h);

      // If we have audio, pull frequency data
      let bass = 0;
      if (analyser && freqData) {
        analyser.getByteFrequencyData(freqData);
        // average lower frequencies for a bass-driven effect
        const lowCount = Math.floor(freqData.length * 0.12) || 1;
        let sum = 0;
        for (let i = 0; i < lowCount; i++) sum += freqData[i];
        bass = sum / lowCount / 255; // 0..1
      }

      // Draw floating notes
      for (let p of particles) {
        // speed influenced by bass when audio present
        const speedFactor = 1 + bass * 2;
        p.z -= p.speed * 2 * speedFactor;
        if (p.z < 1) {
          p.z = depth;
          p.x = (Math.random() - 0.5) * w * 2;
          p.y = (Math.random() - 0.5) * h * 2;
        }

        const scale = FOV / (FOV + p.z);
        const x2 = w / 2 + p.x * scale;
        const y2 = h / 2 + p.y * scale;
        const size = p.baseSize * (1 + bass * 0.9) * scale * 1.1;
        const alpha = Math.min(1, p.alpha * scale * 1.8 + bass * 0.2);

        ctx.globalAlpha = alpha;
        ctx.fillStyle = noteColor;
        ctx.strokeStyle = noteColor;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        drawNote(ctx, x2, y2, size, p.rot + t * 0.0006 * (p.speed + 0.2));
      }
      ctx.globalAlpha = 1;

      // Draw audio-reactive bars (bottom) or a subtle glow bar when idle
      const barAreaH = Math.max(80, Math.min(160, Math.round(h * 0.18)));
      const barCount = 48;
      const barWidth = Math.max(2, (w * 0.9) / barCount - 2);
      const startX = w * 0.05;
      const baseY = h - barAreaH / 2 - 20;

      if (analyser && freqData) {
        // draw bars driven by freqData
        for (let i = 0; i < barCount; i++) {
          const idx = Math.floor((i / barCount) * freqData.length);
          const v = (freqData[idx] / 255) || 0;
          const bh = Math.max(2, v * barAreaH * 1.6);
          const x = startX + i * (barWidth + 2);
          const y = baseY - bh / 2;

          // bar gradient glow
          const barGrad = ctx.createLinearGradient(x, y, x, y + bh);
          barGrad.addColorStop(0, 'rgba(255,255,255,0.95)');
          barGrad.addColorStop(0.3, noteColor);
          barGrad.addColorStop(1, 'rgba(0,0,0,0.05)');
          ctx.fillStyle = barGrad;
          roundRect(ctx, x, y, barWidth, bh, barWidth * 0.18);
          ctx.fill();
        }
      } else {
        // idle subtle animated bars
        for (let i = 0; i < 14; i++) {
          const v = 0.15 + 0.12 * Math.sin(t * 0.002 + i);
          const bh = Math.max(2, v * barAreaH);
          const x = w * 0.5 - (14 * (barWidth + 4)) / 2 + i * (barWidth + 4);
          const y = baseY - bh / 2;
          ctx.fillStyle = `rgba(155,231,255,${0.12 + i * 0.01})`;
          roundRect(ctx, x, y, barWidth, bh, barWidth * 0.2);
          ctx.fill();
        }
      }

      rafId = requestAnimationFrame(render);
    }

    function roundRect(ctx, x, y, width, height, radius) {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.arcTo(x + width, y, x + width, y + height, radius);
      ctx.arcTo(x + width, y + height, x, y + height, radius);
      ctx.arcTo(x, y + height, x, y, radius);
      ctx.arcTo(x, y, x + width, y, radius);
      ctx.closePath();
    }

    window.addEventListener('resize', resize);
    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      try {
        if (audioSource) audioSource.disconnect();
        if (analyser) analyser.disconnect();
        if (audioCtx && audioCtx.state !== 'closed') audioCtx.close();
      } catch {
        // ignore cleanup errors
      }
    };
  }, [color, noteColor, audioId]);

  return (
    <canvas
      ref={ref}
      className="bg-3d-canvas"
      style={{ position: 'fixed', inset: 0, zIndex: -1, pointerEvents: 'none' }}
    />
  );
}
