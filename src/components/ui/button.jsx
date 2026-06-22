"use client";

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // Примечание: классы для SVG должны применяться напрямую к элементам <svg>
  // Например: <Button><ArrowLeft className="size-4 shrink-0 pointer-events-none" /></Button>
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "rounded-xl bg-[var(--bizon-black)] text-white shadow hover:bg-[var(--bizon-dark)] hover:-translate-y-0.5 transition-all duration-300",
        primary:
          "rounded-xl bg-[var(--bizon-black)] text-white hover:bg-[var(--bizon-dark)] hover:-translate-y-0.5 transition-all duration-300",
        accent:
          "rounded-xl bg-[var(--bizon-accent)] text-[var(--bizon-black)] font-semibold hover:bg-[var(--bizon-accent-dark)] hover:-translate-y-0.5 transition-all duration-300",
        secondary:
          "rounded-xl border border-foreground/20 bg-transparent hover:bg-secondary hover:-translate-y-0.5 transition-all duration-300",
        ghost:
          "rounded-xl border border-current bg-transparent hover:-translate-y-0.5 transition-all duration-300",
        glass:
          "rounded-xl border border-white/20 bg-white/20 text-white backdrop-blur-xl hover:bg-white/30 hover:-translate-y-0.5 transition-all duration-300",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "min-h-11 px-8 py-4 text-lg",
        sm: "min-h-9 rounded-lg px-4 text-sm",
        lg: "min-h-12 rounded-xl px-10 py-4 text-lg",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props} />
  );
})
Button.displayName = "Button"

export { Button, buttonVariants }
