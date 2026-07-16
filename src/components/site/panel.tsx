import { cn } from "@/lib/utils";
import styles from "./hud.module.css";

// HUD surface card: 1px border with brand corner-ticks and a subtle hover tint.
// The shared building block for feature cells and generic boxes.
export function Panel({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn(styles.cell, className)} {...props}>
      {children}
    </div>
  );
}
