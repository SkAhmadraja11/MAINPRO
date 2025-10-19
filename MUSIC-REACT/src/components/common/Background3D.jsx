import { useEffect, useRef } from 'react';

// Lightweight canvas animation creating a 3D-ish floating music-note field.
// No external libs; keeps CPU modest by limiting particle count and using
// simple perspective projection.
export default function Background3D({ color = '#9be7ff' }) {
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
    ctx.scale(DPR, DPR);

    const NOTES = 40; // particles
    const depth = 1200; // z-range
    const FOV = 600; // perspective

    // generate simple music-note shapes as small objects (we'll render as paths)
    const particles = [];
    for (let i = 0; i < NOTES; i++) {
      particles.push({
        x: (Math.random() - 0.5) * w * 2,
        y: (Math.random() - 0.5) * h * 2,
        z: Math.random() * depth,
        speed: 0.2 + Math.random() * 0.9,
        rot: Math.random() * Math.PI * 2,
        size: 8 + Math.random() * 18,
        alpha: 0.25 + Math.random() * 0.7,
      });
    }

    let rafId;

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      const DPR = Math.max(1, window.devicePixelRatio || 1);
      canvas.width = w * DPR;
      canvas.height = h * DPR;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }

    function drawNote(ctx, x, y, s, rot, alpha) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.beginPath();
      // stem
      ctx.rect(-s * 0.08, -s * 0.9, s * 0.16, s * 1.4);
      ctx.fill();
      // head (ellipse)
      ctx.beginPath();
      ctx.ellipse(s * 0.25, s * 0.35, s * 0.45, s * 0.32, 0, 0, Math.PI * 2);
      ctx.fill();
      // small flag
      ctx.beginPath();
      ctx.moveTo(s * 0.08, -s * 0.9);
      ctx.quadraticCurveTo(s * 0.6, -s * 0.6, s * 0.9, -s * 0.2);
      ctx.lineWidth = Math.max(1, s * 0.06);
      ctx.stroke();
      ctx.restore();
    }

    function render(t) {
      ctx.clearRect(0, 0, w, h);

      // subtle global glow
      ctx.save();
      ctx.fillStyle = 'rgba(8,10,18,0.45)';
      ctx.fillRect(0, 0, w, h);
      ctx.restore();

      for (let p of particles) {
        // move forward in z, loop back
        p.z -= p.speed * 2;
        if (p.z < 1) p.z = depth;

        // perspective projection
        const scale = FOV / (FOV + p.z);
        const x2 = w / 2 + p.x * scale;
        const y2 = h / 2 + p.y * scale;
        const size = p.size * scale * 1.1;
        const alpha = Math.min(1, p.alpha * scale * 1.6);

        ctx.globalAlpha = alpha;
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        drawNote(ctx, x2, y2, size, p.rot + t * 0.0006 * (p.speed + 0.2), alpha);
      }
      ctx.globalAlpha = 1;
      rafId = requestAnimationFrame(render);
    }

    window.addEventListener('resize', resize);
    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, [color]);

  return (
    <canvas
      ref={ref}
      className="bg-3d-canvas"
      style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    />
  );
}
