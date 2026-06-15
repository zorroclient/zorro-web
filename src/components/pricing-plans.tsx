import { Button } from "@/components/ui/button";
import { plans } from "@/lib/pricing";
import { siteConfig } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { createCheckoutSession } from "@/lib/billing-actions";
import styles from "@/components/site/hud.module.css";

// HUD-styled pricing tiers. Each submit posts to the Stripe checkout server
// action (unchanged); the "what's included" list is shown once by the page.
export function PricingPlans({ className }: { className?: string }) {
  return (
    <div className={cn(styles.tiers, className)}>
      {plans.map((plan) => (
        <div
          key={plan.id}
          className={`${styles.tier} ${plan.featured ? styles.tierFeatured : ""}`}
        >
          {plan.badge && <span className={styles.badge}>{plan.badge}</span>}
          <div className={styles.tierName}>{plan.name}</div>
          <div className={styles.tierPrice}>
            <b>{plan.price}</b>
            <span className={styles.tierCadence}>{plan.cadence}</span>
          </div>
          {plan.note && <div className={styles.tierNote}>{plan.note}</div>}
          <form
            action={createCheckoutSession.bind(null, plan.id)}
            className="mt-auto pt-6"
          >
            <Button
              type="submit"
              variant={plan.featured ? "hud" : "hudOutline"}
              className="h-11 w-full"
            >
              Get {siteConfig.name}
            </Button>
          </form>
        </div>
      ))}
    </div>
  );
}
