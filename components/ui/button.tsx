import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Tessera buttons are tiles: a hairline edge, a soft top highlight and a small press, with an offset focus ring.
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[calc(var(--radius)-2px)] text-sm font-medium transition-[background-color,color,box-shadow,transform] duration-150 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-[inset_0_1px_0_0_rgb(255_255_255/0.18),0_0_0_1px_var(--primary),0_1px_3px_0_rgb(0_0_0/0.14)] hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-[inset_0_1px_0_0_rgb(255_255_255/0.2),0_0_0_1px_var(--destructive),0_1px_3px_0_rgb(0_0_0/0.14)] hover:bg-destructive/90",
        outline: "bg-background text-foreground shadow-[0_0_0_1px_var(--input),0_1px_2px_0_rgb(0_0_0/0.06)] hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-[0_0_0_1px_var(--border)] hover:bg-secondary/70",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline underline-offset-4 decoration-primary/30 hover:decoration-primary active:translate-y-0",
      },
      size: { default: "h-9 px-4", sm: "h-8 px-3 text-xs", lg: "h-10 px-6", icon: "size-9" },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
)

function Button({ className, variant, size, asChild = false, ...props }: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button"
  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />
}

export { Button, buttonVariants }
