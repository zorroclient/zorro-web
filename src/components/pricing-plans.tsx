import { Button } from "@/components/ui/button";
import { plans } from "@/lib/pricing";
import { siteConfig } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { createCheckoutSession } from "@/lib/billing-actions";

export function PricingPlans({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "grid items-start gap-5 sm:grid-cols-3",
        className,
      )}
    >
      {plans.map((plan) => (
        <div
          key={plan.id}
          className={
            plan.featured
              ? "relative flex flex-col rounded-2xl border border-brand/40 bg-gradient-to-b from-brand/10 to-transparent p-7 shadow-[0_0_40px_-12px_rgb(255_122_24/0.35)]"
              : "relative flex flex-col rounded-2xl border border-border/60 bg-card/40 p-7"
          }
        >
          {plan.badge && (
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-primary-foreground">
              {plan.badge}
            </span>
          )}
          <h3 className="font-heading text-lg font-semibold">{plan.name}</h3>
          <div className="mt-4 flex items-baseline gap-1.5">
            <span className="text-4xl font-bold tracking-tight">
              {plan.price}
            </span>
            <span className="text-sm text-muted-foreground">
              {plan.cadence}
            </span>
          </div>
          {plan.note && (
            <p className="mt-2 text-sm text-muted-foreground">{plan.note}</p>
          )}
          <form action={createCheckoutSession.bind(null, plan.id)} className="mt-6">
            <Button
              type="submit"
              size="lg"
              variant={plan.featured ? "default" : "outline"}
              className="w-full"
            >
              Get {siteConfig.name}
            </Button>
          </form>
        </div>
      ))}
    </div>
  );
}
