import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Swords, Crosshair, ArrowRight, Eye, Globe, Wrench } from "lucide-react";
import { HeroMotion } from "@/components/lab/hero-motion";

export const metadata: Metadata = {
  title: "Lab — hero redesign",
};

// Award-tier hero redesign (new-ui). Ink wash + orange-blade accent + scroll
// motion. Recreated from docs/handoff in idiomatic Next.js. View at /lab.
export default function LabPage() {
  return (
    <div className="lab">
      <HeroMotion />
      <div aria-hidden className="lab-grain bg-grain" />

      <section className="lab-hero" id="lab-hero">
        <div className="lab-figure-wrap" aria-hidden>
          <div className="lab-figure-glow-2" />
          <div className="lab-figure">
            <Image
              src="/brand/figure-trimmed.png"
              alt=""
              width={914}
              height={623}
              priority
            />
          </div>
          <div className="lab-figure-rim">
            <Image
              src="/brand/figure-trimmed.png"
              alt=""
              width={914}
              height={623}
              priority
            />
          </div>
        </div>

        <div className="lab-copy">
          <span className="lab-eyebrow lab-reveal">
            <span className="" /> • Ghost client •
          </span>
          <h1 className="lab-display">
            <span className="lab-line">
              <span>One client.</span>
            </span>
            <span className="lab-line">
              <span className="lab-blade">Every advantage.</span>
            </span>
          </h1>
          <div className="lab-slash" aria-hidden />
          <p className="lab-lead lab-reveal">
            One client that runs clean on Lunar, vanilla, Cosmic — or any server
            you play. Lightweight, always current, and gone without a trace.
          </p>
          <div className="lab-actions lab-reveal">
            <Link className="lab-btn lab-btn-primary" href="/signup">
              <Swords strokeWidth={2} />
              Get Zorro
            </Link>
            <Link className="lab-btn lab-btn-ghost" href="/pricing">
              View pricing
            </Link>
          </div>
          <div className="lab-works lab-reveal">
            <span className="lbl">Works with</span>
            <span className="row">
              <span>Lunar</span>
              <span>Vanilla</span>
              <span>Cosmic</span>
              <span>+ more</span>
            </span>
          </div>
        </div>
      </section>

      <div className="lab-cut-wrap">
        <div className="lab-slash-cut" aria-hidden />
        <section className="lab-teaser" id="lab-teaser">
          <div className="lab-teaser-inner">
          <span className="lab-kicker lab-s-reveal">Inside the client</span>
          <h2 className="lab-s-reveal">Every edge, in one blade.</h2>
          <p className="lab-s-reveal">
            Combat, movement, visuals, world — 20+ modules, each tuned down to
            the detail and included on every plan.
          </p>
          <div className="lab-grid4">
            <div className="lab-cell lab-s-reveal">
              <div className="ic">
                <Crosshair size={22} strokeWidth={1.6} />
              </div>
              <div className="t">Combat</div>
              <div className="d">
                Reach, Aim Assist, Kill Aura, Velocity — dialed in.
              </div>
            </div>
            <div className="lab-cell lab-s-reveal">
              <div className="ic">
                <ArrowRight size={22} strokeWidth={1.6} />
              </div>
              <div className="t">Movement</div>
              <div className="d">Flight, Timer, FastBridge, Keep Sprint.</div>
            </div>
            <div className="lab-cell lab-s-reveal">
              <div className="ic">
                <Eye size={22} strokeWidth={1.6} />
              </div>
              <div className="t">Visual</div>
              <div className="d">ESP, Tracers, Fullbright, NameTags.</div>
            </div>
            <div className="lab-cell lab-s-reveal">
              <div className="ic">
                <Globe size={22} strokeWidth={1.6} />
              </div>
              <div className="t">World</div>
              <div className="d">Chest ESP, Block Search, Spawner ESP.</div>
            </div>
            <div className="lab-cell lab-s-reveal">
              <div className="ic">
                <Wrench size={22} strokeWidth={1.6} />
              </div>
              <div className="t">Utility</div>
              <div className="d">AutoFish, Drop Blocker, Panic.</div>
            </div>
          </div>
          </div>
        </section>
      </div>
    </div>
  );
}
