import Link from "next/link";
import { Button } from "@/components/ui/button";
import { plans } from "@/lib/pricing";
import { siteConfig } from "@/lib/nav";
import { cn } from "@/lib/utils";
import styles from "@/components/site/hud.module.css";

// HUD-styled pricing tiers. Each CTA enters our on-site checkout; the payment
// session itself is created only after authentication on that page.
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
          <div className="mt-auto pt-6">
            <Button
              asChild
              variant={plan.featured ? "hud" : "hudOutline"}
              className="h-11 w-full"
            >
              <Link href={`/checkout?plan=${encodeURIComponent(plan.id)}`}>
                Get {siteConfig.name}
              </Link>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
