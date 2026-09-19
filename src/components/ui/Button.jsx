import React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import { cn } from '../../lib/utils'

// eslint-disable-next-line react-refresh/only-export-components
export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 cursor-pointer select-none active:scale-[0.98]',
  {
    variants: {
      variant: {
        primary: 'gradient-primary text-white font-bold shadow-lg shadow-cyan-500/20 hover:opacity-95',
        default: 'gradient-primary text-white font-bold shadow-lg shadow-cyan-500/20 hover:opacity-95',
        secondary: 'bg-theme-card border border-theme text-theme-base hover:text-theme-primary hover:border-theme-primary/50 shadow-sm',
        destructive: 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30',
        outline: 'border border-theme text-theme-base hover:bg-theme-canvas hover:text-theme-primary',
        ghost: 'text-theme-muted hover:text-theme-base hover:bg-theme-canvas/60',
        link: 'text-theme-primary underline-offset-4 hover:underline p-0 h-auto active:scale-100',
      },
      size: {
        default: 'h-10 px-5 py-2.5 text-sm',
        md: 'h-10 px-5 py-2.5 text-sm',
        sm: 'h-8 px-3.5 text-xs rounded-lg',
        lg: 'h-12 px-7 text-base rounded-2xl',
        icon: 'h-10 w-10 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
)

export const Button = React.forwardRef(
  (
    {
      className,
      variant = 'primary',
      size = 'default',
      asChild = false,
      isLoading = false,
      loading = false,
      disabled = false,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    if (asChild) {
      return (
        <Slot
          ref={ref}
          className={cn(buttonVariants({ variant, size }), className)}
          {...props}
        >
          {children}
        </Slot>
      )
    }

    const isSpinnerActive = isLoading || loading
    const isDisabled = disabled || isSpinnerActive
    const spinnerSize = size === 'sm' ? 14 : size === 'lg' ? 20 : 16

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {isSpinnerActive && <Loader2 className="animate-spin shrink-0" size={spinnerSize} />}
        {!isSpinnerActive && leftIcon && <span className="shrink-0">{leftIcon}</span>}
        {children}
        {!isSpinnerActive && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
