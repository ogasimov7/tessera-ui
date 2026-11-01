import * as React from "react"
import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  // A light sweep instead of a pulse; it stops for people who prefer reduced motion.
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "bg-muted relative overflow-hidden rounded-[calc(var(--radius)-2px)]",
        "before:absolute before:inset-0 before:-translate-x-full before:animate-[tessera-shimmer_1.6s_ease-in-out_infinite] before:bg-linear-to-r before:from-transparent before:via-foreground/[0.06] before:to-transparent motion-reduce:before:hidden",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
