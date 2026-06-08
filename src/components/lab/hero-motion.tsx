"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

// Drives the /lab hero motion: a robust CSS-transition entrance (no JS-ticker
// dependency) plus GSAP/ScrollTrigger scroll effects and Lenis smooth-scroll.
// The finished design is the base CSS; this only *hides-then-reveals*, gated by
// classes on <html>, so no-JS / lib-failure / reduced-motion all show the hero.
export function HeroMotion() {
  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) return; // base CSS already shows the full, final design

    const docEl = document.documentElement;
    const added = ["lab-js-motion"];
    docEl.classList.add("lab-js-motion");

    const playIn = () => docEl.classList.add("lab-in");
    // double-rAF so the hidden initial state paints first, then transitions
    const raf1 = requestAnimationFrame(() =>
      requestAnimationFrame(playIn),
    );
    // hard safety net: reveal no matter what within 500ms
    const safety = window.setTimeout(playIn, 500);

    gsap.registerPlugin(ScrollTrigger);
    docEl.classList.add("lab-gsap-ok");
    added.push("lab-gsap-ok");

    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    const ticker = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    // subtle mouse-reactive parallax on the light blobs — the glow drifts
    // toward the cursor (different strengths per blob so the light feels alive)
    const hero = document.getElementById("lab-hero");
    let onPointer: ((e: PointerEvent) => void) | null = null;
    if (hero) {
      const glow2X = gsap.quickTo(".lab-figure-glow-2", "x", {
        duration: 1.3,
        ease: "power3.out",
      });
      const glow2Y = gsap.quickTo(".lab-figure-glow-2", "y", {
        duration: 1.3,
        ease: "power3.out",
      });
      onPointer = (e: PointerEvent) => {
        const r = hero.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5; // -0.5..0.5
        const ny = (e.clientY - r.top) / r.height - 0.5;
        // the light shaft sways gently with the cursor
        glow2X(nx * -34);
        glow2Y(ny * 16);
      };
      hero.addEventListener("pointermove", onPointer);
    }

    const ctx = gsap.context(() => {
      // figure parallax
      gsap.to(".lab-figure, .lab-figure-rim", {
        yPercent: -14,
        ease: "none",
        scrollTrigger: {
          trigger: "#lab-hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.to(".lab-figure-glow-2", {
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: "#lab-hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.to(".lab-copy", {
        yPercent: 12,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: "#lab-hero",
          start: "60% top",
          end: "bottom top",
          scrub: true,
        },
      });

      // subtle accent slash — draws across the section boundary
      gsap.to(".lab-slash-cut", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: ".lab-cut-wrap",
          start: "top bottom",
          end: "top 70%",
          scrub: true,
        },
      });

      // scroll reveals across every dark section
      gsap.utils.toArray<HTMLElement>(".lab-s-reveal").forEach((el, i) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "expo.out",
          delay: (i % 4) * 0.05,
          scrollTrigger: { trigger: el, start: "top 85%" },
        });
      });
    });

    return () => {
      cancelAnimationFrame(raf1);
      window.clearTimeout(safety);
      if (hero && onPointer) hero.removeEventListener("pointermove", onPointer);
      ctx.revert();
      gsap.ticker.remove(ticker);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
      added.forEach((c) => docEl.classList.remove(c));
      docEl.classList.remove("lab-in");
    };
  }, []);

  return null;
}
