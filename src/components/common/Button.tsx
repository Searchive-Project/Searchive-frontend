import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-blue-400 text-white shadow hover:bg-blue-500",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-gray-100 bg-white shadow-sm hover:bg-blue-300 hover:text-white",
        secondary: "bg-gray-100 text-gray-900 shadow-sm hover:bg-gray-100/80",
        ghost: "hover:bg-gray-100 hover:text-gray-900",
        link: "text-blue-400 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-16 py-3 text-sm",
        sm: "h-10 rounded-md px-10 py-2.5 text-xs",
        lg: "h-12 rounded-md px-20 py-4 text-base",
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
