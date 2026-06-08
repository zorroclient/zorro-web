"use client";

import { useEffect, useState } from "react";

type Item = { id: string; label: string };

// Scroll-spy table of contents: a vertical tracker whose active segment follows
// whichever section is currently in view.
export function DocsToc({
  items,
  title = "On this page",
}: {
  items: readonly Item[];
  title?: string;
}) {
  const [active, setActive] = useState<string>(items[0]?.id ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // the topmost section intersecting the upper band of the viewport wins
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-12% 0px -70% 0px", threshold: 0 },
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav className="sticky top-28">
      <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
        {title}
      </p>
      <ul className="border-l border-border/60">
        {items.map((item) => {
          const isActive = active === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "true" : undefined}
                className={`-ml-px block border-l-2 py-1.5 pl-3 text-sm transition-colors ${
                  isActive
                    ? "border-brand font-medium text-brand"
                    : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
                }`}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
