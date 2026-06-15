"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

// Scroll motion for marketing pages: layered hero parallax ("mountains" depth —
// each layer drifts at its own rate), the brand-slide scale, Lenis smooth-scroll,
// and on-enter section reveals. Motion hooks are data-attributes so this never
// depends on hashed CSS-module class names; mount it inside a [data-hud-root].
//
// The finished design is the BASE CSS. Reveal start-states are gated behind
// [data-motion="on"], which we only set once GSAP is confirmed live — so
// no-JS / failure / reduced-motion all render the full page.
export function ScrollMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-hud-root]");
    if (!root) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) return;

    let lenis: Lenis | null = null;
    let ticker: ((t: number) => void) | null = null;
    let ctx: gsap.Context | null = null;

    try {
      gsap.registerPlugin(ScrollTrigger);
      // gate the reveal start-states now that the driver is confirmed live
      root.setAttribute("data-motion", "on");

      lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
      lenis.on("scroll", ScrollTrigger.update);
      ticker = (t: number) => lenis?.raf(t * 1000);
      gsap.ticker.add(ticker);
      gsap.ticker.lagSmoothing(0);

      ctx = gsap.context(() => {
        // layered parallax — each element drifts by its own yPercent
        gsap.utils
          .toArray<HTMLElement>("[data-hud-parallax]")
          .forEach((el) => {
            const amt = parseFloat(el.dataset.hudParallax || "0");
            gsap.to(el, {
              yPercent: amt,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            });
          });

        // hero copy lifts + fades as the hero scrolls away
        const copy = document.querySelector("[data-hud-copy]");
        const hero = document.querySelector("[data-hud-hero]");
        if (copy && hero) {
          gsap.to(copy, {
            yPercent: -10,
            opacity: 0,
            ease: "none",
            scrollTrigger: {
              trigger: hero,
              start: "45% top",
              end: "bottom top",
              scrub: true,
            },
          });
        }

        // big brand word scales up as you scroll through its slide
        const brand = document.querySelector("[data-hud-brand]");
        const brandSlide = document.querySelector("[data-hud-brand-slide]");
        if (brand && brandSlide) {
          gsap.fromTo(
            brand,
            { scale: 0.82 },
            {
              scale: 1.12,
              ease: "none",
              scrollTrigger: {
                trigger: brandSlide,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        }

        // on-enter reveals across every dark section
        gsap.utils
          .toArray<HTMLElement>("[data-hud-reveal]")
          .forEach((el, i) => {
            gsap.to(el, {
              opacity: 1,
              y: 0,
              duration: 0.9,
              ease: "expo.out",
              delay: (i % 3) * 0.06,
              scrollTrigger: { trigger: el, start: "top 85%" },
            });
          });
      }, root);
    } catch {
      // anything goes wrong → un-gate so the full page is visible
      root.removeAttribute("data-motion");
    }

    return () => {
      ctx?.revert();
      if (ticker) gsap.ticker.remove(ticker);
      lenis?.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
      root.removeAttribute("data-motion");
    };
  }, []);

  return null;
}
