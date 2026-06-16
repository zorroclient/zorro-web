import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { DocsToc } from "@/components/docs/docs-toc";
import { moduleCategories } from "@/lib/modules";

export const metadata: Metadata = {
  title: "Modules reference",
  description:
    "Every Zorro module explained in detail, with the settings you can tune on each.",
};


export default function ModulesDocsPage() {
  return (
    <div className="relative z-[1] mx-auto max-w-[76rem] px-5 pb-16 pt-32 sm:px-8 lg:pb-24 lg:pt-40">
      <div className="max-w-2xl">
        <Link
          href="/docs"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to docs
        </Link>
        <p className="mt-6 text-xs uppercase tracking-widest text-brand">
          Reference
        </p>
        <h1 className="mt-3 text-4xl font-bold sm:text-5xl">Modules reference</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Every module, grouped by category, with the settings you can tune on
          each. All modules are included on every plan.
        </p>
      </div>

      <div className="mt-14 gap-12 lg:grid lg:grid-cols-[200px_1fr]">
        {/* sticky scroll-spy TOC */}
        <aside className="hidden lg:block">
          <DocsToc
            title="Categories"
            items={moduleCategories.map((c) => ({ id: c.id, label: c.label }))}
          />
        </aside>

        <div className="space-y-16">
          {moduleCategories.map((cat) => (
            <section key={cat.id} id={cat.id} className="scroll-mt-28">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-none border border-brand/30 bg-brand/10 text-brand">
                  <cat.icon className="h-5 w-5" />
                </span>
                <h2 className="text-2xl font-bold">{cat.label}</h2>
              </div>
              <p className="mt-3 text-muted-foreground">{cat.blurb}</p>

              <div className="mt-6 space-y-4">
                {cat.modules.map((mod) => (
                  <div
                    key={mod.name}
                    className="rounded-none border border-border/60 bg-card/40 p-5"
                  >
                    <h3 className="font-heading text-lg font-semibold">
                      {mod.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {mod.summary}
                    </p>
                    {mod.settings.length > 0 && (
                      <dl className="mt-4 space-y-2 border-t border-border/60 pt-4">
                        {mod.settings.map((s) => (
                          <div
                            key={s.name}
                            className="grid grid-cols-1 gap-1 sm:grid-cols-[160px_1fr] sm:gap-4"
                          >
                            <dt className="font-mono text-xs text-foreground/80">
                              {s.name}
                            </dt>
                            <dd className="text-sm text-muted-foreground">
                              {s.detail}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
