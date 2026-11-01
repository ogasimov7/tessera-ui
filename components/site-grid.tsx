import { cn } from "@/lib/utils";

/** A content row with full-bleed hairlines above and below (see .grid-row in globals.css). */
export function Row({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("grid-row", className)} {...props} />;
}

/** Small uppercase mono label above a section heading. */
export function Eyebrow({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("font-mono text-xs font-semibold uppercase tracking-widest text-site-accent", className)} {...props} />;
}

/** A faint mono annotation naming the tokens the element below is styled with. */
export function Annotation({ className, ...props }: React.ComponentProps<"p">) {
  return <p aria-hidden className={cn("grid-row select-none py-1 font-mono text-[11px] text-muted-foreground/60", className)} {...props} />;
}

/** Inline token or code name, highlighted in the accent color. */
export function Token({ className, ...props }: React.ComponentProps<"code">) {
  return <code className={cn("font-mono text-[0.92em] font-medium text-site-accent", className)} {...props} />;
}
