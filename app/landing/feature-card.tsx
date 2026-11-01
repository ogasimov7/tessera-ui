import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/** A bento card: icon, title and description on top, a live demo in a dotted frame below. */
export function FeatureCard({ icon: Icon, title, desc, className, demoClassName, children }: {
  icon: LucideIcon; title: string; desc: string; className?: string; demoClassName?: string; children: React.ReactNode;
}) {
  return (
    <div className={cn("flex min-w-0 flex-col rounded-2xl border border-[var(--grid-line)] bg-card/60 p-2", className)}>
      <div className="flex items-start gap-4 p-4 sm:p-6">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-[var(--grid-line)] bg-background text-site-accent"><Icon className="size-5" /></span>
        <div className="grid gap-1">
          <h3 className="text-lg font-medium tracking-tight">{title}</h3>
          <p className="text-sm text-muted-foreground">{desc}</p>
        </div>
      </div>
      <div className={cn("min-w-0 flex-1 rounded-xl border border-[var(--grid-line)] bg-background bg-[radial-gradient(var(--grid-line)_1px,transparent_1px)] bg-[length:12px_12px] p-4 sm:p-6", demoClassName)}>
        {children}
      </div>
    </div>
  );
}
