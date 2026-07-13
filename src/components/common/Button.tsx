import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600/40 disabled:pointer-events-none disabled:opacity-50 active:translate-y-px",
  {
    variants: {
      variant: {
        default: "bg-blue-600 text-white shadow-sm shadow-blue-900/10 hover:bg-blue-700",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-red-700",
        outline: "border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50",
        secondary: "bg-blue-50 text-blue-800 hover:bg-blue-100",
        ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
        link: "text-blue-700 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 text-sm",
        sm: "h-9 rounded-md px-3 text-sm",
        lg: "h-12 px-5 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return <button className={cn(buttonVariants({ variant, size }), className)} ref={ref} {...props} />
  },
)

Button.displayName = "Button"
