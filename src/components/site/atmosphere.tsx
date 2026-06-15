"use client";

import { useEffect, useRef } from "react";
import styles from "./hud.module.css";

// Site-wide background "atmosphere": faint circuit-board traces (Manhattan-routed
// lines with solder pads) carrying slow light pulses, plus CRT/old-tv overlays
// (scanlines, grain, vignette). `intensity="calm"` thins + dims everything for
// functional pages. Canvas is DPR-capped, paused when hidden, and static under
// prefers-reduced-motion.
const ACCENT = "255, 122, 24";

type Trace = {
  pts: { x: number; y: number }[];
  segLen: number[];
  total: number;
  pulse: { d: number; speed: number };
};

const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));

export function Atmosphere({
  intensity = "full",
}: {
  intensity?: "full" | "calm";
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const calm = intensity === "calm";

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const alphaMul = calm ? 0.5 : 1;
    const densityDiv = calm ? 340 : 210;

    let w = 0;
    let h = 0;
    let traces: Trace[] = [];

    const makeTrace = (): Trace => {
      const pad = 32;
      let x = pad + Math.random() * (w - 2 * pad);
      let y = pad + Math.random() * (h - 2 * pad);
      let horizontal = Math.random() < 0.5;
      const pts = [{ x, y }];
      const segs = 2 + Math.floor(Math.random() * 3);
      for (let s = 0; s < segs; s++) {
        const len = 70 + Math.random() * 190;
        const sign = Math.random() < 0.5 ? -1 : 1;
        if (horizontal) x = clamp(x + len * sign, pad, w - pad);
        else y = clamp(y + len * sign, pad, h - pad);
        pts.push({ x, y });
        horizontal = !horizontal;
      }
      const segLen: number[] = [];
      let total = 0;
      for (let i = 1; i < pts.length; i++) {
        const L = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
        segLen.push(L);
        total += L;
      }
      return {
        pts,
        segLen,
        total,
        pulse: { d: Math.random() * total, speed: 26 + Math.random() * 48 },
      };
    };

    // clamped (NOT wrapped) so a trail near the start never samples the far end
    const pointAt = (t: Trace, dist: number) => {
      let d = clamp(dist, 0, t.total);
      for (let i = 0; i < t.segLen.length; i++) {
        if (d <= t.segLen[i]) {
          const a = t.pts[i];
          const b = t.pts[i + 1];
          const f = t.segLen[i] === 0 ? 0 : d / t.segLen[i];
          return { x: a.x + (b.x - a.x) * f, y: a.y + (b.y - a.y) * f };
        }
        d -= t.segLen[i];
      }
      const last = t.pts[t.pts.length - 1];
      return { x: last.x, y: last.y };
    };

    const seed = () => {
      const count = clamp(
        Math.round((w + h) / densityDiv),
        calm ? 4 : 7,
        calm ? 9 : 15,
      );
      traces = Array.from({ length: count }, makeTrace);
    };

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const draw = (dt: number) => {
      ctx.clearRect(0, 0, w, h);

      ctx.lineWidth = 1.2;
      for (const t of traces) {
        ctx.strokeStyle = `rgba(${ACCENT}, ${0.1 * alphaMul})`;
        ctx.beginPath();
        ctx.moveTo(t.pts[0].x, t.pts[0].y);
        for (let i = 1; i < t.pts.length; i++) ctx.lineTo(t.pts[i].x, t.pts[i].y);
        ctx.stroke();
        ctx.fillStyle = `rgba(${ACCENT}, ${0.22 * alphaMul})`;
        for (const end of [t.pts[0], t.pts[t.pts.length - 1]]) {
          ctx.beginPath();
          ctx.arc(end.x, end.y, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.shadowBlur = 8;
      ctx.shadowColor = `rgba(${ACCENT}, ${0.85 * alphaMul})`;
      const trailLen = 30;
      const steps = 6;
      const fadeZone = trailLen + 10;
      for (const t of traces) {
        t.pulse.d += t.pulse.speed * dt;
        if (t.pulse.d > t.total) t.pulse.d -= t.total;
        const edge = Math.min(t.pulse.d, t.total - t.pulse.d);
        const fade = clamp(edge / fadeZone, 0, 1) * alphaMul;
        if (fade <= 0) continue;
        ctx.strokeStyle = `rgba(${ACCENT}, ${0.85 * fade})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let k = 0; k <= steps; k++) {
          const p = pointAt(t, t.pulse.d - trailLen * (k / steps));
          if (k === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
        const head = pointAt(t, t.pulse.d);
        ctx.fillStyle = `rgba(${ACCENT}, ${fade})`;
        ctx.beginPath();
        ctx.arc(head.x, head.y, 2.4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    };

    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      draw(dt);
      raf = requestAnimationFrame(loop);
    };

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else if (!reduce && !raf) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };

    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);

    if (reduce) draw(0);
    else raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [calm]);

  return (
    <>
      <canvas ref={ref} className={styles.bgCanvas} aria-hidden />
      {!calm && <div aria-hidden className={styles.grain} />}
      <div
        aria-hidden
        className={`${styles.scan} ${calm ? styles.scanCalm : ""}`}
      />
      <div aria-hidden className={styles.vignette} />
    </>
  );
}
