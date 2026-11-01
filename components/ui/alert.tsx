import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Status alerts share one recipe driven by --tone: a left accent bar, a faint tint, and text mixed toward the
// foreground (darker in light mode, lighter in dark mode) so it reads at 4.5:1+ for every status in both modes.
const toned =
  "bg-[color-mix(in_oklab,var(--tone)_5%,var(--card))] border-[color-mix(in_oklab,var(--tone)_25%,transparent)] border-l-[var(--tone)] text-[color-mix(in_oklab,var(--tone)_60%,var(--foreground))] *:data-[slot=alert-description]:text-current"

const alertVariants = cva(
  "relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5 rounded-[var(--radius)] border border-l-[3px] px-4 py-3 text-sm has-[>svg]:grid-cols-[16px_1fr] has-[>svg]:gap-x-3 [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground border-l-primary",
        destructive: cn("[--tone:var(--destructive)]", toned),
        success: cn("[--tone:var(--success)]", toned),
        warning: cn("[--tone:var(--warning)]", toned),
        info: cn("[--tone:var(--info)]", toned),
      },
    },
    defaultVariants: { variant: "default" },
  }
)

function Alert({ className, variant, ...props }: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return <div data-slot="alert" role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
}
function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="alert-title" className={cn("col-start-2 line-clamp-1 min-h-4 font-semibold tracking-tight", className)} {...props} />
}
function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="alert-description" className={cn("text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed", className)} {...props} />
}

export { Alert, AlertTitle, AlertDescription }
