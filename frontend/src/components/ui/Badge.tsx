import type { OrderStatus } from "../../types/index";

type BadgeProps = { status: OrderStatus };

const config: Record<OrderStatus, { label: string; classes: string; pulse: boolean }> = {
  processing: { label: "Processing",  classes: "bg-primary/10 text-primary",    pulse: true  },
  shipped:    { label: "Shipped",      classes: "bg-secondary/10 text-secondary", pulse: false },
  delivered:  { label: "Delivered",   classes: "bg-tertiary/10 text-tertiary",   pulse: false },
};

export default function Badge({ status }: BadgeProps) {
  const { label, classes, pulse } = config[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium font-label ${classes}`}>
      <span className={`w-1.5 h-1.5 rounded-full bg-current ${pulse ? "animate-pulse" : ""}`} />
      {label}
    </span>
  );
}
