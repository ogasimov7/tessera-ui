"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

function Progress({ className, value, ...props }: React.ComponentProps<typeof ProgressPrimitive.Root>) {
  return (
    <ProgressPrimitive.Root data-slot="progress" className={cn("bg-primary/12 relative h-2 w-full overflow-hidden rounded-[max(2px,calc(var(--radius)-6px))] shadow-[inset_0_1px_1px_0_rgb(0_0_0/0.06)]", className)} {...props}>
      <ProgressPrimitive.Indicator data-slot="progress-indicator" className="bg-primary h-full w-full flex-1 rounded-[inherit] shadow-[inset_0_1px_0_0_rgb(255_255_255/0.2)] transition-transform duration-500" style={{ transform: `translateX(-${100 - (value || 0)}%)` }} />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
