import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-black text-white hover:bg-zinc-800 shadow-md", // Landing Primary
                brand: "bg-gradient-to-br from-brand to-brand-muted text-white shadow-neon hover:translate-y-[-1px]", // App Primary
                secondary: "bg-white text-black border border-zinc-200 hover:bg-zinc-100 shadow-sm",
                destructive: "bg-red-500 text-white hover:bg-red-600 shadow-sm",
                ghost: "hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-white",
                outline: "border border-zinc-200 bg-transparent hover:bg-zinc-100 text-zinc-900 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-800",
            },
            size: {
                default: "h-10 px-6 py-2",
                sm: "h-9 px-3",
                lg: "h-12 px-8 text-base",
                icon: "h-10 w-10",
            },
            shape: {
                pill: "rounded-full", // Manteia Default
                rounded: "rounded-md",
            }
        },
        defaultVariants: {
            variant: "default",
            size: "default",
            shape: "pill"
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, shape, ...props }, ref) => {
        return (
            <button
                className={cn(buttonVariants({ variant, size, shape, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
