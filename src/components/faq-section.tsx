import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Faq } from "@/lib/faq";
import { cn } from "@/lib/utils";

export function FaqSection({
  items,
  className,
  heading = "Questions, answered",
}: {
  items: Faq[];
  className?: string;
  heading?: string;
}) {
  return (
    <div className={cn("mx-auto max-w-3xl", className)}>
      <h2 className="text-center text-2xl font-bold sm:text-3xl">{heading}</h2>
      <Accordion
        type="single"
        collapsible
        className="mt-10 border-y border-border/60"
      >
        {items.map((faq) => (
          <AccordionItem key={faq.q} value={faq.q}>
            <AccordionTrigger className="py-5 font-heading text-base font-semibold">
              {faq.q}
            </AccordionTrigger>
            <AccordionContent className="leading-relaxed text-muted-foreground">
              {faq.a}
              {faq.href && (
                <>
                  {" "}
                  <Link
                    href={faq.href}
                    className="text-brand hover:underline"
                  >
                    {faq.hrefLabel ?? "Learn more"} →
                  </Link>
                </>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
