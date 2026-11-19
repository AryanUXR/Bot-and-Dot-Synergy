"use client";
import { useEffect, useRef } from "react";

// A quiet background in the spirit of the ATLAS orb: a sparse field of nodes drifting
// slowly, faint lines between near neighbours, and an occasional soft pulse travelling
// along a line. Kept dim so text always reads first. Rests under reduced motion and
// stops when the tab is hidden.
const CYAN = [103, 232, 249];
const BLUE = [96, 140, 255];

export default function NetworkBackground({ className, intensity = 1 }: { className?: string; intensity?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let W = 0, H = 0;
    type Node = { x: number; y: number; vx: number; vy: number; r: number; f: number };
    let nodes: Node[] = [];
    const LINK = 150;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      W = rect.width; H = rect.height;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(90, (W * H) / 16000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 6, vy: (Math.random() - 0.5) * 6,
        r: 1 + Math.random() * 1.4, f: 0,
      }));
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    type Pulse = { a: number; b: number; t: number };
    let pulses: Pulse[] = [];
    const k = intensity;

    const draw = (dt: number, animate: boolean) => {
      ctx.clearRect(0, 0, W, H);
      if (animate) {
        for (const n of nodes) {
          n.x += n.vx * dt; n.y += n.vy * dt;
          if (n.x < -20) n.x = W + 20; if (n.x > W + 20) n.x = -20;
          if (n.y < -20) n.y = H + 20; if (n.y > H + 20) n.y = -20;
          n.f = Math.max(0, n.f - dt * 0.8);
        }
      }
      // faint links between near neighbours
      ctx.lineWidth = 1;
      const near: [number, number][] = [];
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
          const d = Math.hypot(dx, dy);
          if (d < LINK) {
            near.push([i, j]);
            const a = (1 - d / LINK) * 0.16 * k;
            ctx.strokeStyle = `rgba(${BLUE},${a})`;
            ctx.beginPath(); ctx.moveTo(nodes[i].x, nodes[i].y); ctx.lineTo(nodes[j].x, nodes[j].y); ctx.stroke();
          }
        }
      }
      // a rare pulse along a link
      if (animate) {
        if (near.length && pulses.length < 3 && Math.random() < dt * 0.6) {
          const [a, b] = near[Math.floor(Math.random() * near.length)];
          pulses.push({ a, b, t: 0 });
        }
        for (const p of pulses) {
          p.t += dt * 0.45;
          if (p.t >= 1) nodes[p.b].f = 1;
        }
        pulses = pulses.filter((p) => p.t < 1);
      }
      for (const p of pulses) {
        const A = nodes[p.a], B = nodes[p.b];
        const x = A.x + (B.x - A.x) * p.t, y = A.y + (B.y - A.y) * p.t;
        ctx.fillStyle = `rgba(${CYAN},${0.7 * k})`;
        ctx.beginPath(); ctx.arc(x, y, 1.6, 0, Math.PI * 2); ctx.fill();
      }
      for (const n of nodes) {
        ctx.fillStyle = n.f > 0.02 ? `rgba(${CYAN},${(0.3 + n.f * 0.5) * k})` : `rgba(${BLUE},${0.32 * k})`;
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r + n.f * 1.2, 0, Math.PI * 2); ctx.fill();
      }
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      draw(0, false);
      return () => ro.disconnect();
    }
    let raf = 0, last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      draw(dt, true);
      raf = requestAnimationFrame(loop);
    };
    const onVis = () => { cancelAnimationFrame(raf); if (!document.hidden) { last = performance.now(); raf = requestAnimationFrame(loop); } };
    document.addEventListener("visibilitychange", onVis);
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); document.removeEventListener("visibilitychange", onVis); };
  }, [intensity]);

  return <canvas ref={ref} aria-hidden className={className} />;
}
