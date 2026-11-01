import * as React from "react"
import { cn } from "@/lib/utils"

// Filled at rest, clear on focus: the field lifts to the background color with a soft ring.
function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "border-input bg-muted/50 placeholder:text-muted-foreground flex h-9 w-full min-w-0 rounded-[calc(var(--radius)-2px)] border px-3 py-1 text-base shadow-[inset_0_1px_2px_0_rgb(0_0_0/0.04)] transition-[background-color,border-color,box-shadow] outline-none md:text-sm",
        "hover:border-ring/60 focus-visible:border-ring focus-visible:bg-background focus-visible:ring-4 focus-visible:ring-ring/15 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
