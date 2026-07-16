"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Accordion } from "radix-ui";
import type { Faq as FaqItem } from "@/lib/faq";
import styles from "./hud.module.css";

// Bespoke disclosure on the radix Accordion primitive (keyboard-accessible):
// numbered, mono index, brand accent, plus→x icon, animated height open/close.
export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <Accordion.Root type="single" collapsible className={styles.faq}>
      {items.map((f, i) => (
        <Accordion.Item key={f.q} value={f.q} className={styles.faqItem}>
          <Accordion.Header>
            <Accordion.Trigger className={styles.faqTrigger}>
              <span className={styles.faqIdx}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className={styles.faqQ}>{f.q}</span>
              <Plus className={styles.faqIcon} aria-hidden />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className={styles.faqPanel}>
            <div className={styles.faqAnswer}>
              {f.a}
              {f.href && (
                <>
                  {" "}
                  <Link href={f.href}>{f.hrefLabel ?? "Learn more"} →</Link>
                </>
              )}
            </div>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
